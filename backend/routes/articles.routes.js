const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  getFeaturedArticles,
  searchArticles,
  incrementViews
} = require('../controllers/articles.controller');

// Public routes
router.get('/', getAllArticles);
router.get('/featured', getFeaturedArticles);
router.get('/search', searchArticles);
router.get('/category/:category', getArticlesByCategory);
router.get('/:id', getArticleById);
router.post('/:id/view', incrementViews);

module.exports = router;

