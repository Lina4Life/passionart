const db = require('../config/database');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/profile-pictures');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userId_timestamp.extension
    const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    db.get(
      "SELECT id, email, username, first_name, last_name, user_type, phone, bio, profile_picture, website, created_at FROM users WHERE id = ?",
      [userId],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to fetch profile' });
        }
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ user });
      }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let { username, first_name, last_name, phone, bio, website } = req.body;
    
    // Validate required fields
    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }
    
    // Auto-generate username if not provided
    if (!username) {
      username = `${first_name.toLowerCase()}${last_name.toLowerCase()}`.replace(/[^a-z0-9]/g, '');
      // Add random number if username might be too common
      username = username + Math.floor(Math.random() * 1000);
    }
    
    // Check if username is already taken by another user
    db.get(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, userId],
      (err, existingUser) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to check username availability' });
        }
        
        if (existingUser) {
          return res.status(409).json({ error: 'Username is already taken' });
        }
        
        // Update the user profile
        const updateQuery = `
          UPDATE users 
          SET username = ?, first_name = ?, last_name = ?, phone = ?, bio = ?, website = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        
        db.run(updateQuery, [username, first_name, last_name, phone, bio, website, userId], function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to update profile' });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          // Return updated user info
          db.get(
            "SELECT id, email, username, first_name, last_name, user_type, phone, bio, profile_picture, website, created_at FROM users WHERE id = ?",
            [userId],
            (err, updatedUser) => {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Profile updated but failed to fetch updated data' });
              }
              
              res.json({ 
                message: 'Profile updated successfully',
                user: updatedUser 
              });
            }
          );
        });
      }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Get the old profile picture to delete it
    db.get("SELECT profile_picture FROM users WHERE id = ?", [userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch current profile picture' });
      }
      
      // Delete old profile picture if it exists
      if (user && user.profile_picture) {
        const oldPicturePath = path.join(__dirname, '../../uploads/profile-pictures', user.profile_picture);
        fs.unlink(oldPicturePath, (err) => {
          if (err) console.log('Note: Could not delete old profile picture:', err.message);
        });
      }
      
      // Update database with new profile picture filename
      const filename = req.file.filename;
      
      db.run(
        "UPDATE users SET profile_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [filename, userId],
        function(err) {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: 'Failed to update profile picture' });
          }
          
          res.json({ 
            message: 'Profile picture updated successfully',
            profilePicture: filename,
            profilePictureUrl: `/uploads/profile-pictures/${filename}`
          });
        }
      );
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    // Get current user
    db.get("SELECT password FROM users WHERE id = ?", [userId], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to verify current password' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verify current password
      let validCurrentPassword = false;
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        validCurrentPassword = await bcrypt.compare(currentPassword, user.password);
      } else {
        validCurrentPassword = currentPassword === user.password;
      }
      
      if (!validCurrentPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      db.run(
        "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [hashedNewPassword, userId],
        function(err) {
          if (err) {
            console.error('Password update error:', err);
            return res.status(500).json({ error: 'Failed to update password' });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          res.json({ message: 'Password updated successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Update social media links
const updateSocialMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { socialMedia } = req.body;
    
    // Validate and sanitize social media data
    if (socialMedia && typeof socialMedia !== 'object') {
      return res.status(400).json({ error: 'Invalid social media data format' });
    }
    
    // Convert to JSON string for SQLite storage
    const socialMediaJson = socialMedia ? JSON.stringify(socialMedia) : null;
    
    db.run(
      "UPDATE users SET social_media = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [socialMediaJson, userId],
      function(err) {
        if (err) {
          console.error('Database error updating social media:', err);
          return res.status(500).json({ error: 'Failed to update social media links' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ 
          success: true, 
          message: 'Social media links updated successfully',
          socialMedia: socialMedia 
        });
      }
    );
  } catch (error) {
    console.error('Social media update error:', error);
    res.status(500).json({ error: 'Failed to update social media links' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
  updateSocialMedia,
  upload
};

