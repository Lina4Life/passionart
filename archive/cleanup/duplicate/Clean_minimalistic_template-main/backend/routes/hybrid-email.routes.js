/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const router = express.Router();
const { 
  sendVerificationEmail, 
  sendPasswordResetEmail,
  testHubSpotConnection,
  syncUserToHubSpot,
  getEmailStats,
  handleWebhook
} = require('../controllers/hybrid-email.controller');
const { verifyToken } = require('../utils/jwt');

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Test HubSpot connection (admin only)
router.get('/test-connection', verifyToken, requireAdmin, testHubSpotConnection);

// Send verification email (public)
router.post('/send-verification', sendVerificationEmail);

// Send password reset email (public)
router.post('/send-password-reset', sendPasswordResetEmail);

// Sync user to HubSpot (internal use)
router.post('/sync-user', verifyToken, syncUserToHubSpot);

// Get email statistics (admin only)
router.get('/stats', verifyToken, requireAdmin, getEmailStats);

// Handle HubSpot webhooks (public endpoint)
router.post('/webhook', handleWebhook);

module.exports = router;
