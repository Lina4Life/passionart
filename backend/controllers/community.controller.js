/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const db = require('../config/database');

// Get all community categories
const getCategories = (req, res) => {
  db.all("SELECT * FROM community_categories ORDER BY name", (err, rows) => {
    if (err) {
      console.error('Error getting categories:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

// Get posts by category (or all posts)
const getPosts = (req, res) => {
  const { categorySlug, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT 
      cp.*,
      cc.name as category_name,
      cc.slug as category_slug,
      u.username,
      u.first_name,
      u.last_name
    FROM community_posts cp
    LEFT JOIN community_categories cc ON cp.category_id = cc.id
    LEFT JOIN users u ON cp.user_id = u.id
  `;
  
  let params = [];
  
  if (categorySlug) {
    query += ` WHERE cc.slug = ?`;
    params.push(categorySlug);
  }
  
  query += ` ORDER BY cp.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error getting posts:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

// Create new post
const createPost = (req, res) => {
  const { title, content, category_id, artwork_image } = req.body;
  const user_id = req.user?.id || 1; // Default to user 1 if no auth
  
  const query = `
    INSERT INTO community_posts (title, content, category_id, user_id, artwork_image)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [title, content, category_id, user_id, artwork_image], function(err) {
    if (err) {
      console.error('Error creating post:', err);
      return res.status(500).json({ error: 'Failed to create post' });
    }
    
    // Get the created post with category and user info
    const getPostQuery = `
      SELECT 
        cp.*,
        cc.name as category_name,
        u.username,
        u.first_name,
        u.last_name
      FROM community_posts cp
      LEFT JOIN community_categories cc ON cp.category_id = cc.id
      LEFT JOIN users u ON cp.user_id = u.id
      WHERE cp.id = ?
    `;
    
    db.get(getPostQuery, [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created post:', err);
        return res.status(500).json({ error: 'Post created but failed to fetch' });
      }
      res.status(201).json(row);
    });
  });
};

// Process payment for post verification
const processPayment = (req, res) => {
  const { postId, paymentMethodId, amount = 5.00 } = req.body;
  const user_id = req.user?.id || 1;
  
  // Simulate Stripe payment processing
  const stripe_payment_intent_id = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Insert payment record
  const paymentQuery = `
    INSERT INTO community_payments (post_id, user_id, amount, stripe_payment_intent_id, stripe_payment_status, payment_method)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(paymentQuery, [postId, user_id, amount, stripe_payment_intent_id, 'succeeded', 'card'], (err) => {
    if (err) {
      console.error('Error recording payment:', err);
      return res.status(500).json({ error: 'Payment processing failed' });
    }
    
    // Update post payment status
    const updatePostQuery = `
      UPDATE community_posts 
      SET payment_status = 'completed', stripe_payment_id = ?
      WHERE id = ?
    `;
    
    db.run(updatePostQuery, [stripe_payment_intent_id, postId], (err) => {
      if (err) {
        console.error('Error updating post payment status:', err);
        return res.status(500).json({ error: 'Payment recorded but post update failed' });
      }
      
      res.json({
        success: true,
        payment_intent_id: stripe_payment_intent_id,
        amount: amount,
        currency: 'EUR'
      });
    });
  });
};

// Vote on post
const votePost = (req, res) => {
  const { postId } = req.params;
  const { voteType } = req.body; // 'up' or 'down'
  const user_id = req.user?.id || 1;
  
  // Check if user already voted
  db.get("SELECT * FROM community_votes WHERE user_id = ? AND post_id = ?", [user_id, postId], (err, existingVote) => {
    if (err) {
      console.error('Error checking existing vote:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (existingVote) {
      // Update existing vote
      db.run("UPDATE community_votes SET vote_type = ? WHERE id = ?", [voteType, existingVote.id], (err) => {
        if (err) {
          console.error('Error updating vote:', err);
          return res.status(500).json({ error: 'Failed to update vote' });
        }
        updatePostVoteCounts(postId, res);
      });
    } else {
      // Create new vote
      db.run("INSERT INTO community_votes (user_id, post_id, vote_type) VALUES (?, ?, ?)", [user_id, postId, voteType], (err) => {
        if (err) {
          console.error('Error creating vote:', err);
          return res.status(500).json({ error: 'Failed to create vote' });
        }
        updatePostVoteCounts(postId, res);
      });
    }
  });
};

// Helper function to update vote counts
function updatePostVoteCounts(postId, res) {
  // Count upvotes and downvotes
  db.all("SELECT vote_type, COUNT(*) as count FROM community_votes WHERE post_id = ? GROUP BY vote_type", [postId], (err, counts) => {
    if (err) {
      console.error('Error counting votes:', err);
      return res.status(500).json({ error: 'Failed to count votes' });
    }
    
    let upvotes = 0, downvotes = 0;
    counts.forEach(count => {
      if (count.vote_type === 'up') upvotes = count.count;
      if (count.vote_type === 'down') downvotes = count.count;
    });
    
    // Update post with new counts
    db.run("UPDATE community_posts SET upvotes = ?, downvotes = ? WHERE id = ?", [upvotes, downvotes, postId], (err) => {
      if (err) {
        console.error('Error updating post vote counts:', err);
        return res.status(500).json({ error: 'Failed to update vote counts' });
      }
      
      res.json({ success: true, upvotes, downvotes });
    });
  });
}

// Get comments for a post
const getComments = (req, res) => {
  const { postId } = req.params;
  
  const query = `
    SELECT 
      cc.*,
      u.username,
      u.first_name,
      u.last_name
    FROM community_comments cc
    LEFT JOIN users u ON cc.user_id = u.id
    WHERE cc.post_id = ?
    ORDER BY cc.created_at ASC
  `;
  
  db.all(query, [postId], (err, rows) => {
    if (err) {
      console.error('Error getting comments:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

// Create comment
const createComment = (req, res) => {
  const { postId } = req.params;
  const { content, parent_id } = req.body;
  const user_id = req.user?.id || 1;
  
  db.run("INSERT INTO community_comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)", 
    [postId, user_id, parent_id, content], function(err) {
    if (err) {
      console.error('Error creating comment:', err);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
    
    // Update comment count on post
    db.run("UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = ?", [postId], (err) => {
      if (err) {
        console.error('Error updating comment count:', err);
      }
    });
    
    // Get the created comment with user info
    const query = `
      SELECT 
        cc.*,
        u.username,
        u.first_name,
        u.last_name
      FROM community_comments cc
      LEFT JOIN users u ON cc.user_id = u.id
      WHERE cc.id = ?
    `;
    
    db.get(query, [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created comment:', err);
        return res.status(500).json({ error: 'Comment created but failed to fetch' });
      }
      res.status(201).json(row);
    });
  });
};

// Moderate post (admin/moderator only)
const moderatePost = (req, res) => {
  const { postId } = req.params;
  const { action, reason, notes } = req.body; // action: 'approve', 'reject', 'flag', 'featured'
  const moderator_id = req.user?.id || 1;
  
  // Update post status
  let verification_status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged';
  let is_featured = action === 'featured' ? 1 : 0;
  
  db.run("UPDATE community_posts SET verification_status = ?, is_featured = ? WHERE id = ?", 
    [verification_status, is_featured, postId], (err) => {
    if (err) {
      console.error('Error updating post status:', err);
      return res.status(500).json({ error: 'Failed to moderate post' });
    }
    
    // Record moderation action
    db.run("INSERT INTO community_moderation (post_id, moderator_id, action, reason, notes) VALUES (?, ?, ?, ?, ?)",
      [postId, moderator_id, action, reason, notes], (err) => {
      if (err) {
        console.error('Error recording moderation action:', err);
      }
    });
    
    res.json({ success: true, action, verification_status, is_featured });
  });
};

// Get posts for moderation (admin/moderator only)
const getModerationQueue = (req, res) => {
  const query = `
    SELECT 
      cp.*,
      cc.name as category_name,
      u.username,
      u.first_name,
      u.last_name,
      pay.amount as payment_amount,
      pay.stripe_payment_status
    FROM community_posts cp
    LEFT JOIN community_categories cc ON cp.category_id = cc.id
    LEFT JOIN users u ON cp.user_id = u.id
    LEFT JOIN community_payments pay ON cp.id = pay.post_id
    WHERE cp.verification_status = 'pending' AND cp.payment_status = 'completed'
    ORDER BY cp.created_at ASC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error getting moderation queue:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

module.exports = {
  getCategories,
  getPosts,
  createPost,
  processPayment,
  votePost,
  getComments,
  createComment,
  moderatePost,
  getModerationQueue
};
