/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const router = express.Router();
const {
  getCategories,
  getPosts,
  createPost,
  processPayment,
  getPendingVerification,
  moderatePost,
  votePost,
  getComments,
  createComment
} = require('../../controllers/community/community.controller');

// Middleware to check authentication (you'll need to implement this)
const requireAuth = (req, res, next) => {
  // Basic auth check - implement proper JWT validation
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  // Mock user for now - replace with proper JWT decoding
  req.user = { id: 1, username: 'testuser', role: 'user' };
  next();
};

// Middleware to check moderator permissions
const requireModerator = (req, res, next) => {
  if (!req.user || (req.user.role !== 'moderator' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Moderator access required' });
  }
  next();
};

// Public routes
router.get('/categories', getCategories);
router.get('/categories/:categorySlug/posts', getPosts);
router.get('/posts/:postId/comments', getComments);

// Authenticated routes
router.post('/posts', requireAuth, createPost);
router.post('/posts/:postId/payment', requireAuth, processPayment);
router.post('/posts/:postId/vote', requireAuth, votePost);
router.post('/posts/:postId/comments', requireAuth, createComment);

// Moderator routes
router.get('/moderation/pending', requireAuth, requireModerator, getPendingVerification);
router.post('/moderation/posts/:postId', requireAuth, requireModerator, moderatePost);

module.exports = router;
