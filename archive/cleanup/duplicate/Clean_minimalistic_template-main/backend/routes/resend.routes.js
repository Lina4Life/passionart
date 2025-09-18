/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const router = express.Router();
const { 
  sendBulkEmail, 
  sendWelcomeEmail, 
  sendVerificationEmail, 
  testConnection,
  getEmailStats
} = require('../controllers/resend.controller');
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

// Test Resend connection (admin only)
router.get('/test-connection', verifyToken, requireAdmin, testConnection);

// Send bulk email to all users (admin only)
router.post('/send-bulk-email', verifyToken, requireAdmin, sendBulkEmail);

// Send welcome email to new user
router.post('/send-welcome', verifyToken, requireAdmin, sendWelcomeEmail);

// Get email statistics (admin only)
router.get('/stats', verifyToken, requireAdmin, getEmailStats);

// Manual verification email resend (admin only)
router.post('/resend-verification', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    const { sendVerificationEmail } = require('../controllers/resend.controller');
    const crypto = require('crypto');
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Send verification email
    const result = await sendVerificationEmail(email, verificationToken);
    
    if (result.success) {
      res.json({ success: true, message: 'Verification email sent successfully!' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send verification email', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending verification email', error: error.message });
  }
});

module.exports = router;
