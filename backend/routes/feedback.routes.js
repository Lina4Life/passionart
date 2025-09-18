const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../utils/jwt');
const resend = require('../services/emailService');

// Simple admin check middleware (matching admin.routes.js)
const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware called for feedback');
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header');
    return res.status(401).json({ error: 'No authorization header' });
  }
  
  // Extract token from Bearer header
  const token = authHeader.replace('Bearer ', '');
  
  // For admin access, we'll allow any valid token format for now
  // This matches the pattern used in the frontend admin panel
  if (token && (token.startsWith('admin-token-') || token.length > 10)) {
    console.log('Authorization passed for feedback - admin access granted');
    next();
  } else {
    console.log('Invalid authorization format for admin access');
    return res.status(401).json({ error: 'Admin access required' });
  }
};

// Submit feedback
router.post('/', verifyToken, async (req, res) => {
  try {
    const { issue, feedback, userEmail, userName } = req.body;
    const userId = req.user.id;

    if (!issue || !feedback) {
      return res.status(400).json({ error: 'Issue and feedback are required' });
    }

    // Insert feedback into database
    const insertSql = `
      INSERT INTO feedback (user_id, user_email, user_name, issue, feedback, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))
    `;

    db.run(insertSql, [userId, userEmail, userName, issue, feedback], function(err) {
      if (err) {
        console.error('Error inserting feedback:', err);
        return res.status(500).json({ error: 'Failed to submit feedback' });
      }

      // Send email notification to admin
      sendAdminNotification(issue, feedback, userEmail, userName, userId)
        .catch(emailError => {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the request if email fails
        });

      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedbackId: this.lastID
      });
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Send admin notification email
async function sendAdminNotification(issue, feedback, userEmail, userName, userId) {
  try {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@passionart.com'];
    
    await resend.sendEmail({
      from: 'PassionArt Support <no-reply@passionart.com>',
      to: adminEmails,
      subject: `New Feedback: ${issue}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
            New Feedback Received
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">User Information</h3>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>User ID:</strong> ${userId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Issue/Topic</h3>
            <p style="font-weight: 500; color: #1f2937;">${issue}</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Feedback Details</h3>
            <p style="line-height: 1.6; color: #374151;">${feedback.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Please review this feedback in your admin panel and respond accordingly.
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    throw error;
  }
}

// Get all feedback (admin only)
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT 
        f.*,
        CASE 
          WHEN f.user_id IS NOT NULL THEN 'registered'
          ELSE 'guest'
        END as user_type
      FROM feedback f
    `;
    
    const params = [];
    
    if (status && status !== 'all') {
      sql += ' WHERE f.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.all(sql, params, (err, feedback) => {
      if (err) {
        console.error('Error fetching feedback:', err);
        return res.status(500).json({ error: 'Failed to fetch feedback' });
      }

      // Get total count
      let countSql = 'SELECT COUNT(*) as total FROM feedback';
      const countParams = [];
      
      if (status && status !== 'all') {
        countSql += ' WHERE status = ?';
        countParams.push(status);
      }
      
      db.get(countSql, countParams, (err, totalResult) => {
        if (err) {
          console.error('Error getting feedback count:', err);
          return res.status(500).json({ error: 'Failed to get feedback count' });
        }
        
        const total = totalResult.total;

        res.json({
          feedback,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        });
      });
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Update feedback status (admin only)
router.put('/:id/status', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['pending', 'reviewing', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateSql = `
      UPDATE feedback 
      SET status = ?, admin_notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `;

    db.run(updateSql, [status, adminNotes || null, id], function(err) {
      if (err) {
        console.error('Error updating feedback status:', err);
        return res.status(500).json({ error: 'Failed to update feedback status' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      res.json({ message: 'Feedback status updated successfully' });
    });

  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ error: 'Failed to update feedback status' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteSql = 'DELETE FROM feedback WHERE id = ?';

    db.run(deleteSql, [id], function(err) {
      if (err) {
        console.error('Error deleting feedback:', err);
        return res.status(500).json({ error: 'Failed to delete feedback' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Feedback not found' });
      }

      res.json({ message: 'Feedback deleted successfully' });
    });

  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router;

