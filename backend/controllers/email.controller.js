const nodemailer = require('nodemailer');
const db = require('../config/database');

// Email configuration (you'll need to set up environment variables)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send email to all verified users
const sendBulkEmail = async (req, res) => {
  try {
    const { subject, message, sendToAll } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Get all users with verified emails
    const query = sendToAll 
      ? "SELECT email, username FROM users WHERE email_verified = 1"
      : "SELECT email, username FROM users WHERE email_verified = 1 LIMIT 1"; // For testing

    db.all(query, [], async (err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch users'
        });
      }

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No verified users found'
        });
      }

      const transporter = createTransporter();
      const emailPromises = [];

      // Create HTML email template
      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">PassionArt</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Digital Art Platform</p>
          </div>
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">${subject}</h2>
            <div style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 14px; text-align: center;">
              You received this email because you're a valued member of PassionArt platform.
              <br><a href="#" style="color: #667eea;">Unsubscribe</a> | <a href="#" style="color: #667eea;">Update Preferences</a>
            </p>
          </div>
        </div>
      `;

      // Send emails to all users
      for (const user of users) {
        const mailOptions = {
          from: process.env.EMAIL_USER || 'noreply@passionart.com',
          to: user.email,
          subject: `[PassionArt] ${subject}`,
          html: htmlTemplate,
          text: message // Fallback for plain text
        };

        emailPromises.push(
          transporter.sendMail(mailOptions).catch(error => {
            console.error(`Failed to send email to ${user.email}:`, error);
            return { error: true, email: user.email, message: error.message };
          })
        );
      }

      // Wait for all emails to be sent
      const results = await Promise.all(emailPromises);
      
      // Count successful and failed emails
      const successful = results.filter(result => !result.error).length;
      const failed = results.filter(result => result.error).length;

      res.json({
        success: true,
        message: `Email sent successfully to ${successful} users${failed > 0 ? `, ${failed} failed` : ''}`,
        stats: {
          total: users.length,
          successful,
          failed,
          failedEmails: results.filter(result => result.error).map(r => r.email)
        }
      });
    });

  } catch (error) {
    console.error('Error sending bulk email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails'
    });
  }
};

// Send verification email
const sendVerificationEmail = async (email, username, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/verify-email?token=${verificationToken}`;
    
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to PassionArt!</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0;">Digital Art Platform</p>
        </div>
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${username},<br><br>
            Thank you for joining PassionArt! To complete your registration and start exploring our digital art platform, please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius:25px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
          </p>
          <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 14px; text-align: center;">
            This verification link will expire in 24 hours for security reasons.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@passionart.com',
      to: email,
      subject: '[PassionArt] Verify Your Email Address',
      html: htmlTemplate,
      text: `Welcome to PassionArt! Please verify your email by visiting: ${verificationUrl}`
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConfig = async (req, res) => {
  try {
    const transporter = createTransporter();
    
    // Verify connection
    await transporter.verify();
    
    res.json({
      success: true,
      message: 'Email configuration is working correctly'
    });
  } catch (error) {
    console.error('Email configuration test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Email configuration failed',
      error: error.message
    });
  }
};

module.exports = {
  sendBulkEmail,
  sendVerificationEmail,
  testEmailConfig
};

