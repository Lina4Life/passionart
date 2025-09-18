const express = require('express');
const router = express.Router();
const { 
  sendBulkEmail, 
  sendWelcomeEmail, 
  sendVerificationEmail, 
  testConnection,
  getEmailStats,
  getAnalytics
} = require('../controllers/hubspot.controller');
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
router.get('/test-connection', verifyToken, requireAdmin, testConnection);

// Send bulk email to all users (admin only)
router.post('/send-bulk-email', verifyToken, requireAdmin, sendBulkEmail);

// Send welcome email to new user
router.post('/send-welcome', verifyToken, requireAdmin, sendWelcomeEmail);

// Get email statistics (admin only)
router.get('/stats', verifyToken, requireAdmin, getEmailStats);

// Get HubSpot analytics (admin only)
router.get('/analytics', verifyToken, requireAdmin, getAnalytics);

module.exports = router;

