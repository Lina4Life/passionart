/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const { Resend } = require('resend');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class EmailNotificationService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.dbPath = path.join(__dirname, '../config/database.db');
  }

  async sendBulkEmail(subject, htmlContent, userTypes = ['all'], excludeUnverified = true) {
    const db = new sqlite3.Database(this.dbPath);
    
    try {
      // Get recipients based on user types
      let whereClause = '';
      const params = [];
      
      if (userTypes.includes('all')) {
        whereClause = '1=1';
      } else {
        whereClause = 'user_type IN (' + userTypes.map(() => '?').join(',') + ')';
        params.push(...userTypes);
      }
      
      if (excludeUnverified) {
        whereClause += ' AND email_verified = 1';
      }
      
      const users = await new Promise((resolve, reject) => {
        db.all(`SELECT email, first_name, last_name, user_type FROM users WHERE ${whereClause}`, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      const results = [];
      
      for (const user of users) {
        try {
          // Personalize email content
          const personalizedContent = htmlContent
            .replace(/{{first_name}}/g, user.first_name || 'Art Enthusiast')
            .replace(/{{last_name}}/g, user.last_name || '')
            .replace(/{{user_type}}/g, user.user_type || 'artist');

          const emailResult = await this.resend.emails.send({
            from: 'PassionArt <noreply@passionart.com>',
            to: [user.email],
            subject: subject,
            html: personalizedContent
          });

          // Log the notification
          await this.logNotification(user.email, subject, personalizedContent, 'bulk_notification', 'sent');
          
          results.push({
            email: user.email,
            status: 'sent',
            messageId: emailResult.data?.id
          });
          
          console.log(`Email sent to ${user.email}: ${emailResult.data?.id}`);
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          await this.logNotification(user.email, subject, htmlContent, 'bulk_notification', 'failed');
          
          results.push({
            email: user.email,
            status: 'failed',
            error: error.message
          });
        }
      }
      
      return {
        totalSent: results.filter(r => r.status === 'sent').length,
        totalFailed: results.filter(r => r.status === 'failed').length,
        results
      };
      
    } finally {
      db.close();
    }
  }

  async sendNewsletterEmail(subject, content, scheduledFor = null) {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 8px; }
        .cta-button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .social-links { margin: 20px 0; }
        .social-links a { margin: 0 10px; text-decoration: none; color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PassionArt Newsletter</h1>
            <p>Your Gateway to the Art World</p>
        </div>
        <div class="content">
            <h2>Hello {{first_name}}!</h2>
            ${content}
            
            <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3>🎨 Featured This Week</h3>
                <p>Discover amazing artworks from our community of talented artists. From digital masterpieces to traditional paintings, there's something for every art lover.</p>
                <a href="https://passionart.com/featured" class="cta-button">Explore Featured Art</a>
            </div>
        </div>
        <div class="footer">
            <p>Thank you for being part of the PassionArt community!</p>
            <div class="social-links">
                <a href="#" style="text-decoration: none;">📧 Email</a>
                <a href="#" style="text-decoration: none;">📱 Instagram</a>
                <a href="#" style="text-decoration: none;">🐦 Twitter</a>
            </div>
            <p style="font-size: 12px; color: #6c757d;">
                You received this email because you're a member of PassionArt.<br>
                <a href="#" style="color: #6c757d;">Unsubscribe</a> | <a href="#" style="color: #6c757d;">Update Preferences</a>
            </p>
        </div>
    </div>
</body>
</html>`;

    return await this.sendBulkEmail(subject, htmlTemplate);
  }

  async sendEventNotification(eventTitle, eventDate, eventDescription, eventLink) {
    const subject = `🎨 New Event: ${eventTitle}`;
    const content = `
      <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #dc3545;">
        <h3>📅 ${eventTitle}</h3>
        <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>${eventDescription}</p>
        <a href="${eventLink}" class="cta-button" style="background: #dc3545;">Register Now</a>
      </div>
      <p>Don't miss this exciting opportunity to connect with fellow artists and art enthusiasts!</p>
    `;

    return await this.sendBulkEmail(subject, content.replace('${content}', content));
  }

  async sendArtworkApprovalNotification(artistEmail, artworkTitle, approved = true) {
    const subject = approved ? 
      `✅ Your artwork "${artworkTitle}" has been approved!` : 
      `❌ Your artwork "${artworkTitle}" needs revision`;
    
    const content = approved ? `
      <div style="margin: 20px 0; padding: 20px; background: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
        <h3>🎉 Congratulations!</h3>
        <p>Your artwork "<strong>${artworkTitle}</strong>" has been approved and is now live on PassionArt!</p>
        <p>Art enthusiasts can now discover and purchase your work. We'll notify you of any sales.</p>
        <a href="https://passionart.com/my-artworks" class="cta-button">View My Artworks</a>
      </div>
    ` : `
      <div style="margin: 20px 0; padding: 20px; background: #f8d7da; border-radius: 8px; border-left: 4px solid #dc3545;">
        <h3>📝 Revision Needed</h3>
        <p>Your artwork "<strong>${artworkTitle}</strong>" needs some revisions before it can be published.</p>
        <p>Please check the feedback from our review team and resubmit when ready.</p>
        <a href="https://passionart.com/my-artworks" class="cta-button" style="background: #dc3545;">Review Feedback</a>
      </div>
    `;

    const htmlTemplate = this.getEmailTemplate(subject, content);
    
    await this.resend.emails.send({
      from: 'PassionArt <noreply@passionart.com>',
      to: [artistEmail],
      subject: subject,
      html: htmlTemplate
    });

    await this.logNotification(artistEmail, subject, htmlTemplate, 'artwork_notification', 'sent');
  }

  async logNotification(email, subject, content, type, status) {
    const db = new sqlite3.Database(this.dbPath);
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO email_notifications (recipient_email, subject, message, notification_type, status, sent_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const sentAt = status === 'sent' ? new Date().toISOString() : null;
      
      db.run(query, [email, subject, content, type, status, sentAt], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    }).finally(() => {
      db.close();
    });
  }

  getEmailTemplate(subject, content) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 8px; font-size: 12px; color: #6c757d; }
        .cta-button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PassionArt</h1>
            <p>Your Gateway to the Art World</p>
        </div>
        <div class="content">
            <h2>Hello {{first_name}}!</h2>
            ${content}
        </div>
        <div class="footer">
            <p>Thank you for being part of the PassionArt community!</p>
            <p>
                <a href="#" style="color: #6c757d;">Unsubscribe</a> | 
                <a href="#" style="color: #6c757d;">Update Preferences</a>
            </p>
        </div>
    </div>
</body>
</html>`;
  }
}

module.exports = EmailNotificationService;
