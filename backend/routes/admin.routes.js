/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getAllProducts: getAllArtworks,
  getAllArticles,
  getAllOrders,
  updateOrderStatus,
  updateOrderPrice,
  updateProductStatus,
  deleteProduct,
  getRejectionHistory
} = require('../controllers/admin_sqlite.controller');

// Middleware to check if user is admin (basic check for now)
const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware called');
  console.log('Authorization header:', req.headers.authorization);
  
  // For now, we'll do a simple check - in production you'd verify JWT and check user role
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header');
    return res.status(401).json({ error: 'No authorization header' });
  }
  // Basic check - just ensure there's some authorization header
  // In production, decode JWT and verify admin role
  if (authHeader.includes('Bearer')) {
    console.log('Authorization passed');
    next();
  } else {
    console.log('Invalid authorization format');
    return res.status(401).json({ error: 'Invalid authorization format' });
  }
};

// Admin routes
router.get('/stats', isAdmin, getAdminStats);
router.get('/users', isAdmin, getAllUsers);
router.post('/users', isAdmin, createUser);
router.put('/users/:id', isAdmin, updateUser);
router.delete('/users/:id', isAdmin, deleteUser);
router.get('/products', isAdmin, getAllArtworks);
router.get('/artworks', isAdmin, getAllArtworks);
router.put('/products/:id/status', isAdmin, updateProductStatus);
router.delete('/products/:id', isAdmin, deleteProduct);
router.get('/products/:productId/rejections', isAdmin, getRejectionHistory);
router.get('/articles', isAdmin, getAllArticles);
router.get('/orders', isAdmin, getAllOrders);
router.put('/orders/:id/status', isAdmin, updateOrderStatus);
router.put('/orders/:id/price', isAdmin, updateOrderPrice);

module.exports = router;
