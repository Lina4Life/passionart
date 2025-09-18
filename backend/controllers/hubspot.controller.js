﻿const hubspot = require('@hubspot/api-client');

// Initialize HubSpot client
const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN // You'll need to set this in your environment
});

// Send bulk email to all users
const sendBulkEmail = async (req, res) => {
  try {
    const { subject, content, sendToAll } = req.body;
    const db = require('../config/database');

    // Get all users with verified emails
    const users = await new Promise((resolve, reject) => {
      const query = sendToAll 
        ? 'SELECT email FROM users WHERE email IS NOT NULL AND email_verified = 1'
        : 'SELECT email FROM users WHERE email IS NOT NULL';
      
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No users found to send emails to'
      });
    }

    // Create beautiful HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; line-height: 1.6; color: #333333; }
            .content p { margin: 0 0 20px 0; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { margin: 0; color: #6c757d; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius:25px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PassionArt</h1>
            </div>
            <div class="content">
              ${content.replace(/\n/g, '<br>')}
            </div>
            <div class="footer">
              <p>Best regards,<br>The PassionArt Team</p>
              <p style="margin-top: 20px;">Â© 2025 PassionArt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Send emails in batches to avoid rate limiting
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < users.length; i += batchSize) {
      batches.push(users.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const emailPromises = batch.map(async (user) => {
        try {
          // HubSpot email sending using Marketing Email API
          const emailData = {
            emailType: 'BATCH_EMAIL',
            recipient: user.email,
            fromName: 'PassionArt',
            fromEmail: 'noreply@passionart.com',
            subject: subject,
            htmlBody: htmlContent,
            textBody: content
          };

          // For now, we'll use a simple approach
          // In production, you'd create a marketing email in HubSpot and send it
          await hubspotClient.marketing.emails.send(emailData);
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push({
            email: user.email,
            error: error.message
          });
        }
      });

      await Promise.all(emailPromises);
      
      // Small delay between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.status(200).json({
      success: true,
      message: `Bulk email sent successfully!`,
      stats: {
        total: users.length,
        successful: successCount,
        failed: errorCount
      },
      errors: errors.slice(0, 5) // Return first 5 errors
    });

  } catch (error) {
    console.error('HubSpot bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk email via HubSpot',
      error: error.message
    });
  }
};

// Send welcome email to new user
const sendWelcomeEmail = async (req, res) => {
  try {
    const { email, firstName } = req.body;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to PassionArt!</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; line-height: 1.6; color: #333333; }
            .content h2 { color: #667eea; margin-top: 0; }
            .content p { margin: 0 0 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius:25px; margin: 20px 0; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { margin: 0; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PassionArt</h1>
            </div>
            <div class="content">
              <h2>Welcome to PassionArt, ${firstName || 'Art Lover'}! ðŸŽ¨</h2>
              <p>We're thrilled to have you join our passionate community of artists and art enthusiasts!</p>
              <p>At PassionArt, you can:</p>
              <ul>
                <li>Discover amazing artwork from talented artists</li>
                <li>Connect with fellow art lovers</li>
                <li>Share your own creative journey</li>
                <li>Stay updated with the latest art trends</li>
              </ul>
              <p>Get started by exploring our platform and connecting with the community.</p>
              <a href="http://localhost:5174" class="button">Explore PassionArt</a>
            </div>
            <div class="footer">
              <p>Best regards,<br>The PassionArt Team</p>
              <p style="margin-top: 20px;">Â© 2025 PassionArt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'PassionArt <welcome@passionart.com>',
      to: [email],
      subject: 'Welcome to PassionArt! ðŸŽ¨',
      html: htmlContent,
      text: `Welcome to PassionArt, ${firstName || 'Art Lover'}!\n\nWe're thrilled to have you join our passionate community of artists and art enthusiasts!\n\nExplore our platform and connect with the community at http://localhost:5174\n\nBest regards,\nThe PassionArt Team`
    });

    res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully'
    });

  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
};

// Send email verification
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const originalEmail = email;
    const adminEmail = 'youssefelgharib03@gmail.com'; // Your admin email
    const verificationUrl = `http://localhost:5174/verify-email?token=${verificationToken}`;
    
    console.log(`ðŸ“§ Sending verification email via HubSpot to both ${originalEmail} and admin ${adminEmail}`);
    
    // Create HTML content for the original user
    const userHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your PassionArt Account</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; line-height: 1.6; color: #333333; text-align: center; }
            .content h2 { color: #667eea; margin-bottom: 20px; }
            .content p { margin: 0 0 20px 0; }
            .button { display: inline-block; padding: 15px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius:25px; margin: 20px 0; font-weight: 500; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { margin: 0; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PassionArt</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Welcome to PassionArt! We're excited to have you join our creative community.</p>
              <p>Please verify your email address to complete your registration and start exploring amazing artwork.</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                If you didn't create an account with PassionArt, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>Best regards,<br>The PassionArt Team</p>
              <p style="margin-top: 20px;">Â© 2025 PassionArt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create HTML content for the admin notification
    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New User Registration - PassionArt</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; line-height: 1.6; color: #333333; }
            .content h2 { color: #667eea; margin-bottom: 20px; }
            .content p { margin: 0 0 20px 0; }
            .button { display: inline-block; padding: 15px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius:25px; margin: 20px 0; font-weight: 500; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { margin: 0; color: #6c757d; font-size: 14px; }
            .info-box { background-color: #e3f2fd; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PassionArt - Admin Notification</h1>
            </div>
            <div class="content">
              <h2>ðŸŽ¨ New User Registration</h2>
              <div class="info-box">
                <p><strong>New User Email:</strong> ${originalEmail}</p>
                <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Status:</strong> Awaiting email verification</p>
              </div>
              <p>A new user has registered on PassionArt with the email address <strong>${originalEmail}</strong>.</p>
              <p>They have been sent a verification email via HubSpot to complete their registration.</p>
              <a href="${verificationUrl}" class="button">View Verification Link</a>
            </div>
            <div class="footer">
              <p>PassionArt Admin Panel</p>
              <p style="margin-top: 20px;">Â© 2025 PassionArt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to the original user's email address via HubSpot
    try {
      const userEmailData = {
        emailType: 'REGULAR',
        recipient: originalEmail,
        fromName: 'PassionArt',
        fromEmail: 'verify@passionart.com',
        subject: 'Verify Your PassionArt Account',
        htmlBody: userHtmlContent,
        textBody: `Welcome to PassionArt! Please verify your email address by clicking this link: ${verificationUrl}`
      };

      await hubspotClient.marketing.emails.send(userEmailData);
      console.log(`âœ… Verification email sent to user via HubSpot: ${originalEmail}`);
    } catch (userEmailError) {
      console.error(`âŒ Failed to send HubSpot email to user ${originalEmail}:`, userEmailError.message);
      console.log(`ðŸ“§ User email failed, but continuing with admin notification...`);
    }

    // Send notification to admin email via HubSpot
    try {
      const adminEmailData = {
        emailType: 'REGULAR',
        recipient: adminEmail,
        fromName: 'PassionArt Admin',
        fromEmail: 'admin@passionart.com',
        subject: `New Registration: ${originalEmail}`,
        htmlBody: adminHtmlContent,
        textBody: `New user registered: ${originalEmail}. Registration time: ${new Date().toLocaleString()}. Verification link: ${verificationUrl}`
      };

      await hubspotClient.marketing.emails.send(adminEmailData);
      console.log(`âœ… Admin notification sent via HubSpot to: ${adminEmail}`);
    } catch (adminEmailError) {
      console.error(`âŒ Failed to send HubSpot admin notification:`, adminEmailError.message);
    }

    return { success: true };
  } catch (error) {
    console.error('HubSpot verification email error:', error);
    return { success: false, error: error.message };
  }
};

// Test HubSpot connection
const testConnection = async (req, res) => {
  try {
    // Test HubSpot connection by getting account info
    const accountInfo = await hubspotClient.settings.users.usersApi.getById('me');

    res.status(200).json({
      success: true,
      message: 'HubSpot connection successful',
      service: 'HubSpot',
      accountInfo: accountInfo.email || 'Connected',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('HubSpot connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'HubSpot connection failed',
      error: error.message,
      service: 'HubSpot'
    });
  }
};

// Get email statistics (mock data for now)
const getEmailStats = async (req, res) => {
  try {
    const db = require('../config/database');
    
    // Get user counts
    const totalUsers = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const verifiedUsers = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users WHERE email_verified = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        service: 'Resend'
      }
    });

  } catch (error) {
    console.error('Email stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email statistics',
      error: error.message
    });
  }
};

// Get HubSpot analytics and contact data
const getAnalytics = async (req, res) => {
  try {
    // Get recent contacts from HubSpot
    const recentContacts = await hubspotClient.crm.contacts.basicApi.getPage(
      10, // limit
      undefined, // after
      ['email', 'firstname', 'lastname', 'createdate', 'hs_lead_status', 'passionart_username']
    );

    // Get contact count
    const contactCount = await hubspotClient.crm.contacts.basicApi.getPage(1);
    
    res.status(200).json({
      success: true,
      analytics: {
        totalContacts: contactCount.total || 0,
        recentContacts: recentContacts.results || [],
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('HubSpot analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get HubSpot analytics',
      error: error.message
    });
  }
};

module.exports = {
  sendBulkEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  testConnection,
  getEmailStats,
  getAnalytics
};

