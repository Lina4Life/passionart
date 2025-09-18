const db = require('../config/database');

// Get all articles with pagination
const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    db.get("SELECT COUNT(*) as total FROM articles WHERE status = 'published'", (err, countResult) => {
      if (err) {
        console.error('Error getting article count:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch articles'
        });
      }
      
      const total = countResult.total;
      
      // Get articles with author info
      const query = `
        SELECT 
          a.id,
          a.title,
          a.content,
          a.category,
          a.tags,
          a.featured_image,
          a.views,
          a.published_at,
          a.created_at,
          u.username as author_name,
          u.email as author_email
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        WHERE a.status = 'published'
        ORDER BY a.published_at DESC
        LIMIT ? OFFSET ?
      `;
      
      db.all(query, [limit, offset], (err2, articles) => {
        if (err2) {
          console.error('Error fetching articles:', err2);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch articles'
          });
        }
        
        // Process articles to add computed fields
        const processedArticles = articles.map(article => ({
          ...article,
          excerpt: article.content.substring(0, 200) + '...',
          readTime: Math.ceil(article.content.split(' ').length / 200) + ' MIN READ',
          author: article.author_name || 'Unknown Author',
          date: new Date(article.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit'
          }).replace(/\//g, '.'),
          tags: article.tags ? article.tags.split(',') : []
        }));
        
        res.json({
          success: true,
          articles: processedArticles,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      });
    });
    
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles'
    });
  }
};

// Get featured articles
const getFeaturedArticles = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.category,
        a.tags,
        a.featured_image,
        a.views,
        a.published_at,
        a.created_at,
        u.username as author_name,
        u.email as author_email
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.status = 'published'
      ORDER BY a.views DESC, a.published_at DESC
      LIMIT 3
    `;
    
    db.all(query, [], (err, articles) => {
      if (err) {
        console.error('Error fetching featured articles:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch featured articles'
        });
      }
      
      const processedArticles = articles.map(article => ({
        ...article,
        excerpt: article.content.substring(0, 200) + '...',
        readTime: Math.ceil(article.content.split(' ').length / 200) + ' MIN READ',
        author: article.author_name || 'Unknown Author',
        date: new Date(article.published_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit'
        }).replace(/\//g, '.'),
        tags: article.tags ? article.tags.split(',') : [],
        featured: true
      }));
      
      res.json({
        success: true,
        articles: processedArticles
      });
    });
    
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured articles'
    });
  }
};

// Get article by ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.category,
        a.tags,
        a.featured_image,
        a.views,
        a.published_at,
        a.created_at,
        u.username as author_name,
        u.email as author_email
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ? AND a.status = 'published'
    `;
    
    db.get(query, [id], (err, article) => {
      if (err) {
        console.error('Error fetching article:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch article'
        });
      }
      
      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found'
        });
      }
      
      const processedArticle = {
        ...article,
        readTime: Math.ceil(article.content.split(' ').length / 200) + ' MIN READ',
        author: article.author_name || 'Unknown Author',
        date: new Date(article.published_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit'
        }).replace(/\//g, '.'),
        tags: article.tags ? article.tags.split(',') : []
      };
      
      res.json({
        success: true,
        article: processedArticle
      });
    });
    
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article'
    });
  }
};

// Get articles by category
const getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    let whereClause = "WHERE a.status = 'published'";
    let queryParams = [];
    
    if (category && category !== 'ALL') {
      whereClause += " AND UPPER(a.category) = UPPER(?)";
      queryParams.push(category);
    }
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM articles a
      ${whereClause}
    `;
    
    db.get(countQuery, queryParams, (err, countResult) => {
      if (err) {
        console.error('Error getting article count by category:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch articles'
        });
      }
      
      const total = countResult.total;
      
      // Get articles
      const query = `
        SELECT 
          a.id,
          a.title,
          a.content,
          a.category,
          a.tags,
          a.featured_image,
          a.views,
          a.published_at,
          a.created_at,
          u.username as author_name,
          u.email as author_email
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        ${whereClause}
        ORDER BY a.published_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const allParams = [...queryParams, limit, offset];
      
      db.all(query, allParams, (err2, articles) => {
        if (err2) {
          console.error('Error fetching articles by category:', err2);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch articles'
          });
        }
        
        const processedArticles = articles.map(article => ({
          ...article,
          excerpt: article.content.substring(0, 200) + '...',
          readTime: Math.ceil(article.content.split(' ').length / 200) + ' MIN READ',
          author: article.author_name || 'Unknown Author',
          date: new Date(article.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit'
          }).replace(/\//g, '.'),
          tags: article.tags ? article.tags.split(',') : []
        }));
        
        res.json({
          success: true,
          articles: processedArticles,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      });
    });
    
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles'
    });
  }
};

// Search articles
const searchArticles = async (req, res) => {
  try {
    const { q, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    let whereClause = "WHERE a.status = 'published' AND (a.title LIKE ? OR a.content LIKE ?)";
    let queryParams = [`%${q}%`, `%${q}%`];
    
    if (category && category !== 'ALL') {
      whereClause += " AND UPPER(a.category) = UPPER(?)";
      queryParams.push(category);
    }
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM articles a
      ${whereClause}
    `;
    
    db.get(countQuery, queryParams, (err, countResult) => {
      if (err) {
        console.error('Error getting search count:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to search articles'
        });
      }
      
      const total = countResult.total;
      
      // Get articles
      const query = `
        SELECT 
          a.id,
          a.title,
          a.content,
          a.category,
          a.tags,
          a.featured_image,
          a.views,
          a.published_at,
          a.created_at,
          u.username as author_name,
          u.email as author_email
        FROM articles a
        LEFT JOIN users u ON a.author_id = u.id
        ${whereClause}
        ORDER BY a.published_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const allParams = [...queryParams, limit, offset];
      
      db.all(query, allParams, (err2, articles) => {
        if (err2) {
          console.error('Error searching articles:', err2);
          return res.status(500).json({
            success: false,
            message: 'Failed to search articles'
          });
        }
        
        const processedArticles = articles.map(article => ({
          ...article,
          excerpt: article.content.substring(0, 200) + '...',
          readTime: Math.ceil(article.content.split(' ').length / 200) + ' MIN READ',
          author: article.author_name || 'Unknown Author',
          date: new Date(article.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit', 
            day: '2-digit'
          }).replace(/\//g, '.'),
          tags: article.tags ? article.tags.split(',') : []
        }));
        
        res.json({
          success: true,
          articles: processedArticles,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      });
    });
    
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search articles'
    });
  }
};

// Increment article views
const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = "UPDATE articles SET views = views + 1 WHERE id = ?";
    
    db.run(query, [id], function(err) {
      if (err) {
        console.error('Error incrementing views:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update view count'
        });
      }
      
      res.json({
        success: true,
        message: 'View count updated'
      });
    });
    
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update view count'
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  getFeaturedArticles,
  searchArticles,
  incrementViews
};

