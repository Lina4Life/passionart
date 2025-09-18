const express = require('express');
const router = express.Router();
const { sendBulkEmail, testEmailConfig } = require('../controllers/email.controller');
const { verifyToken } = require('../utils/jwt');

// Admin-only middleware (you can enhance this based on your auth system)
const requireAdmin = (req, res, next) => {
  // Check if user is admin (adjust based on your user model)
  if (!req.user || req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Send bulk email to all users (admin only)
router.post('/send-bulk-email', verifyToken, requireAdmin, sendBulkEmail);

// Test email configuration (admin only)
router.get('/test-config', verifyToken, requireAdmin, testEmailConfig);

module.exports = router;

