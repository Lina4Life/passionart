/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all community categories
const getCategories = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    
    const result = await pool.query(`
      SELECT c.*, 
             COALESCE(t.translated_title, c.name) as display_name,
             COALESCE(t.translated_content, c.description) as display_description
      FROM community_categories c
      LEFT JOIN community_translations t ON t.content_type = 'category' 
        AND t.content_id = c.id AND t.language_code = $1
      WHERE c.is_active = true
      ORDER BY c.post_count DESC, c.member_count DESC
    `, [language]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get posts by category
const getPosts = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 20, sort = 'hot', language = 'en' } = req.query;
    const offset = (page - 1) * limit;

    let orderBy = 'p.created_at DESC'; // default: new
    if (sort === 'hot') {
      orderBy = '(p.upvotes - p.downvotes + p.comment_count) DESC, p.created_at DESC';
    } else if (sort === 'top') {
      orderBy = '(p.upvotes - p.downvotes) DESC';
    } else if (sort === 'rising') {
      orderBy = '(p.upvotes - p.downvotes) / EXTRACT(EPOCH FROM (NOW() - p.created_at)) DESC';
    }

    const result = await pool.query(`
      SELECT p.*, 
             u.username as author_name,
             u.email as author_email,
             c.name as category_name,
             c.slug as category_slug,
             COALESCE(t.translated_title, p.title) as display_title,
             COALESCE(t.translated_content, p.content) as display_content,
             (p.upvotes - p.downvotes) as score
      FROM community_posts p
      JOIN users u ON p.author_id = u.id
      JOIN community_categories c ON p.category_id = c.id
      LEFT JOIN community_translations t ON t.content_type = 'post' 
        AND t.content_id = p.id AND t.language_code = $1
      WHERE c.slug = $2 AND p.is_deleted = false
      ORDER BY ${orderBy}
      LIMIT $3 OFFSET $4
    `, [language, categorySlug, limit, offset]);

    res.json({
      posts: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, postType, imageUrls, linkUrl, categorySlug, tags, isNsfw, languageCode = 'en' } = req.body;
    const userId = req.user.id; // Assuming auth middleware sets this

    // Get category ID
    const categoryResult = await pool.query(
      'SELECT id FROM community_categories WHERE slug = $1',
      [categorySlug]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryId = categoryResult.rows[0].id;

    // Check if this is a paid artwork post
    const isArtworkPost = postType === 'artwork';
    const paymentRequired = isArtworkPost;

    // If payment is required, set payment_status to pending
    const paymentStatus = paymentRequired ? 'pending' : 'none';
    const verificationStatus = paymentRequired ? 'pending' : 'approved';

    const result = await pool.query(`
      INSERT INTO community_posts 
      (title, content, post_type, image_urls, link_url, author_id, category_id, 
       tags, is_nsfw, language_code, payment_status, verification_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [title, content, postType, imageUrls, linkUrl, userId, categoryId, 
        tags, isNsfw, languageCode, paymentStatus, verificationStatus]);

    const post = result.rows[0];

    // If payment is required, return payment info
    if (paymentRequired) {
      res.json({
        post,
        paymentRequired: true,
        amount: 5.00,
        currency: 'EUR',
        message: 'Payment of €5.00 is required before your artwork can be published and verified.'
      });
    } else {
      // Update category post count
      await pool.query(
        'UPDATE community_categories SET post_count = post_count + 1 WHERE id = $1',
        [categoryId]
      );

      res.status(201).json(post);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Process payment for artwork post
const processPayment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { paymentMethod, paymentProviderId, amount = 5.00 } = req.body;
    const userId = req.user.id;

    // Verify the post belongs to the user and requires payment
    const postResult = await pool.query(
      'SELECT * FROM community_posts WHERE id = $1 AND author_id = $2 AND payment_status = $3',
      [postId, userId, 'pending']
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found or payment not required' });
    }

    // Create payment record
    const paymentResult = await pool.query(`
      INSERT INTO community_payments 
      (user_id, post_id, amount, payment_method, payment_provider_id, payment_status)
      VALUES ($1, $2, $3, $4, $5, 'completed')
      RETURNING *
    `, [userId, postId, amount, paymentMethod, paymentProviderId]);

    // Update post payment status
    await pool.query(`
      UPDATE community_posts 
      SET payment_status = 'paid', payment_amount = $2, payment_id = $3
      WHERE id = $1
    `, [postId, amount, paymentProviderId]);

    res.json({
      message: 'Payment processed successfully. Your artwork is now in the verification queue.',
      payment: paymentResult.rows[0]
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get posts pending verification (for moderators)
const getPendingVerification = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT p.*, 
             u.username as author_name,
             u.email as author_email,
             c.name as category_name,
             py.amount as payment_amount,
             py.payment_method
      FROM community_posts p
      JOIN users u ON p.author_id = u.id
      JOIN community_categories c ON p.category_id = c.id
      LEFT JOIN community_payments py ON py.post_id = p.id
      WHERE p.payment_status = 'paid' AND p.verification_status = 'pending'
      ORDER BY p.created_at ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      posts: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: result.rows.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify or reject artwork post (for moderators)
const moderatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { action, reason, notes } = req.body; // action: 'approve' or 'reject'
    const moderatorId = req.user.id;

    const verificationStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update post verification status
    const result = await pool.query(`
      UPDATE community_posts 
      SET verification_status = $1, verified_by = $2, verified_at = NOW(),
          rejection_reason = $3
      WHERE id = $4 AND payment_status = 'paid'
      RETURNING *
    `, [verificationStatus, moderatorId, reason, postId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found or not eligible for verification' });
    }

    // Log moderation action
    await pool.query(`
      INSERT INTO community_moderation (post_id, moderator_id, action, reason, notes)
      VALUES ($1, $2, $3, $4, $5)
    `, [postId, moderatorId, action, reason, notes]);

    // If approved, update category post count
    if (action === 'approve') {
      const post = result.rows[0];
      await pool.query(
        'UPDATE community_categories SET post_count = post_count + 1 WHERE id = $1',
        [post.category_id]
      );
    }

    res.json({
      message: `Post ${action}d successfully`,
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error moderating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Vote on post
const votePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.id;

    // Check if user already voted
    const existingVote = await pool.query(
      'SELECT * FROM community_votes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    let result;

    if (existingVote.rows.length > 0) {
      // Update existing vote
      result = await pool.query(`
        UPDATE community_votes 
        SET vote_type = $1
        WHERE user_id = $2 AND post_id = $3
        RETURNING *
      `, [voteType, userId, postId]);
    } else {
      // Create new vote
      result = await pool.query(`
        INSERT INTO community_votes (user_id, post_id, vote_type)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, postId, voteType]);
    }

    // Update post vote counts
    const voteCounts = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvotes,
        COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvotes
      FROM community_votes WHERE post_id = $1
    `, [postId]);

    await pool.query(`
      UPDATE community_posts 
      SET upvotes = $1, downvotes = $2
      WHERE id = $3
    `, [voteCounts.rows[0].upvotes, voteCounts.rows[0].downvotes, postId]);

    res.json({
      vote: result.rows[0],
      upvotes: parseInt(voteCounts.rows[0].upvotes),
      downvotes: parseInt(voteCounts.rows[0].downvotes)
    });
  } catch (error) {
    console.error('Error voting on post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { language = 'en' } = req.query;

    const result = await pool.query(`
      WITH RECURSIVE comment_tree AS (
        SELECT c.*, u.username as author_name, 0 as depth,
               COALESCE(t.translated_content, c.content) as display_content
        FROM community_comments c
        JOIN users u ON c.author_id = u.id
        LEFT JOIN community_translations t ON t.content_type = 'comment' 
          AND t.content_id = c.id AND t.language_code = $2
        WHERE c.post_id = $1 AND c.parent_id IS NULL AND c.is_deleted = false
        
        UNION ALL
        
        SELECT c.*, u.username as author_name, ct.depth + 1,
               COALESCE(t.translated_content, c.content) as display_content
        FROM community_comments c
        JOIN users u ON c.author_id = u.id
        JOIN comment_tree ct ON c.parent_id = ct.id
        LEFT JOIN community_translations t ON t.content_type = 'comment' 
          AND t.content_id = c.id AND t.language_code = $2
        WHERE c.is_deleted = false
      )
      SELECT * FROM comment_tree
      ORDER BY depth, upvotes DESC, created_at ASC
    `, [postId, language]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create comment
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId = null, languageCode = 'en' } = req.body;
    const userId = req.user.id;

    const result = await pool.query(`
      INSERT INTO community_comments (content, author_id, post_id, parent_id, language_code)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [content, userId, postId, parentId, languageCode]);

    // Update post comment count
    await pool.query(
      'UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = $1',
      [postId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getCategories,
  getPosts,
  createPost,
  processPayment,
  getPendingVerification,
  moderatePost,
  votePost,
  getComments,
  createComment
};
