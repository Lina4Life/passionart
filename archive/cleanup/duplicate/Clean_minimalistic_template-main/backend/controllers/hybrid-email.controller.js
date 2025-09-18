/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const { Resend } = require('resend');
const hubspot = require('@hubspot/api-client');

// Initialize clients
const resend = new Resend(process.env.RESEND_API_KEY);
const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN
});

// Send verification email via Resend (transactional)
const sendVerificationEmail = async (req, res) => {
  try {
    const { email, verificationToken, firstName } = req.body;

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://217.154.119.33'}/verify-email?token=${verificationToken}`;

    // Send email via Resend
    const emailData = await resend.emails.send({
      from: 'PassionArt <noreply@passionart.io>',
      to: [email],
      subject: 'Verify Your PassionArt Account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Account</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">Welcome to PassionArt</h1>
              </div>
              <div style="padding: 40px 30px; line-height: 1.6; color: #333333;">
                <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName || 'Artist'}!</h2>
                <p style="margin: 0 0 20px 0;">Thank you for joining PassionArt! Please verify your email address to complete your registration.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius:25px; font-weight: 500;">Verify Email Address</a>
                </div>
                <p style="margin: 20px 0; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              </div>
              <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">© 2025 PassionArt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    // Sync contact to HubSpot (if available)
    try {
      if (process.env.HUBSPOT_ACCESS_TOKEN) {
        await hubspotClient.crm.contacts.basicApi.create({
          properties: {
            email: email,
            firstname: firstName || '',
            lifecyclestage: 'lead',
            hs_lead_status: 'NEW'
          }
        });
      }
    } catch (hubspotError) {
      console.log('HubSpot sync warning:', hubspotError.message);
      // Don't fail the email send if HubSpot fails
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully',
      emailId: emailData.id
    });

  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email',
      error: error.message
    });
  }
};

// Send password reset email via Resend
const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email, resetToken, firstName } = req.body;

    const resetUrl = `${process.env.FRONTEND_URL || 'http://217.154.119.33'}/reset-password?token=${resetToken}`;

    const emailData = await resend.emails.send({
      from: 'PassionArt <noreply@passionart.io>',
      to: [email],
      subject: 'Reset Your PassionArt Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">Password Reset</h1>
              </div>
              <div style="padding: 40px 30px; line-height: 1.6; color: #333333;">
                <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName || 'Artist'}!</h2>
                <p style="margin: 0 0 20px 0;">You requested to reset your PassionArt password. Click the button below to create a new password.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius:25px; font-weight: 500;">Reset Password</a>
                </div>
                <p style="margin: 20px 0; color: #666;">This link will expire in 1 hour for security reasons.</p>
                <p style="margin: 20px 0; color: #666;">If you didn't request this reset, please ignore this email.</p>
              </div>
              <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">© 2025 PassionArt. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    res.json({
      success: true,
      message: 'Password reset email sent successfully',
      emailId: emailData.id
    });

  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
};

// Test HubSpot connection
const testHubSpotConnection = async (req, res) => {
  try {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
      return res.status(400).json({
        success: false,
        message: 'HubSpot access token not configured'
      });
    }

    const accountInfo = await hubspotClient.settings.users.usersApi.getAccessTokens();
    
    res.json({
      success: true,
      message: 'HubSpot connection successful',
      service: 'HubSpot CRM',
      status: 'Connected',
      accountInfo: {
        hubId: accountInfo.hubId,
        scopes: accountInfo.scopes || []
      }
    });

  } catch (error) {
    console.error('HubSpot connection error:', error);
    res.status(500).json({
      success: false,
      message: 'HubSpot connection failed',
      error: error.message
    });
  }
};

// Sync user to HubSpot contact
const syncUserToHubSpot = async (req, res) => {
  try {
    const { email, firstName, lastName, userType } = req.body;

    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
      return res.status(400).json({
        success: false,
        message: 'HubSpot not configured'
      });
    }

    const contactData = {
      properties: {
        email: email,
        firstname: firstName || '',
        lastname: lastName || '',
        lifecyclestage: userType === 'artist' ? 'customer' : 'lead',
        hs_lead_status: 'NEW',
        website: userType === 'artist' ? 'passionart.io/artist' : 'passionart.io'
      }
    };

    const contact = await hubspotClient.crm.contacts.basicApi.create(contactData);

    res.json({
      success: true,
      message: 'User synced to HubSpot successfully',
      contactId: contact.id
    });

  } catch (error) {
    console.error('Error syncing to HubSpot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync user to HubSpot',
      error: error.message
    });
  }
};

// Get email statistics
const getEmailStats = async (req, res) => {
  try {
    const stats = {
      emailService: 'Resend (Transactional)',
      crmService: 'HubSpot (Contact Management)',
      status: 'Hybrid Configuration Active',
      features: {
        transactionalEmails: 'Resend',
        contactManagement: 'HubSpot',
        marketingEmails: 'HubSpot (Future)',
        analytics: 'Both Services'
      }
    };

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error getting email stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email statistics',
      error: error.message
    });
  }
};

// Handle HubSpot webhooks
const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    
    console.log('📨 HubSpot Webhook received:', {
      subscriptionType: webhookData.subscriptionType,
      eventId: webhookData.eventId,
      objectId: webhookData.objectId
    });

    // Handle different webhook events
    for (const event of webhookData) {
      switch (event.subscriptionType) {
        case 'contact.creation':
          console.log('👤 New contact created in HubSpot:', event.objectId);
          // You can add custom logic here
          break;
          
        case 'contact.propertyChange':
          console.log('📝 Contact property changed:', event.objectId);
          // You can add custom logic here
          break;
          
        default:
          console.log('🔔 Unhandled webhook event:', event.subscriptionType);
      }
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook',
      error: error.message
    });
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  testHubSpotConnection,
  syncUserToHubSpot,
  getEmailStats,
  handleWebhook
};
