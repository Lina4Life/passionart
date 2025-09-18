/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const adminController = require('../controllers/admin_sqlite.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000000);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${randomNum}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Simple auth middleware for admin routes
const simpleAuth = (req, res, next) => {
  // For testing, just check if there's any authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.includes('Bearer')) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin stats endpoint
router.get('/stats', adminController.getAdminStats);

// Users management endpoints
router.get('/users', adminController.getAllUsers);
router.post('/users', simpleAuth, adminController.createUser);

// Products management endpoints
router.get('/products', adminController.getAllProducts);
router.post('/products', simpleAuth, upload.single('image'), adminController.createProduct);
router.put('/products/:id/status', simpleAuth, adminController.updateProductStatus);
router.delete('/products/:id', simpleAuth, adminController.deleteProduct);

// Articles management endpoints
router.get('/articles', adminController.getAllArticles);

// Community management endpoints
router.get('/community/posts', adminController.getCommunityPosts);
router.get('/community/payments', adminController.getPayments);

module.exports = router;
