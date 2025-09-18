const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const { 
  getProfile, 
  updateProfile, 
  changePassword, 
  uploadProfilePicture,
  updateSocialMedia,
  upload 
} = require('../controllers/profile.controller');

// All profile routes require authentication
router.use(verifyToken);

// Get user profile
router.get('/', getProfile);

// Update user profile
router.put('/', updateProfile);

// Upload profile picture
router.post('/picture', upload.single('profilePicture'), uploadProfilePicture);

// Change password
router.put('/password', changePassword);

// Update social media links
router.put('/social-media', updateSocialMedia);

module.exports = router;

