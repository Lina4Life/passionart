const { createUser, findUserByEmail, findUserByVerificationToken, verifyUserEmail } = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('./hubspot.controller');
const { syncUserRegistration } = require('../services/hubspot.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const { email, password, username, first_name, last_name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await createUser(email, password, username, first_name, last_name, verificationToken);
    
    // Send verification email
    console.log(`Attempting to send verification email to: ${email}`);
    const emailResult = await sendVerificationEmail(email, verificationToken);
    console.log('Email send result:', emailResult);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Continue with registration even if email fails
    } else {
      console.log('✅ Verification email sent successfully!');
    }
    
    // Sync user to HubSpot CRM
    console.log(`📞 Syncing user to HubSpot: ${email}`);
    const hubspotResult = await syncUserRegistration({
      email,
      first_name,
      last_name,
      username
    });
    
    if (hubspotResult.success) {
      console.log(`✅ User synced to HubSpot: ${hubspotResult.message}`);
    } else {
      console.error(`❌ HubSpot sync failed: ${hubspotResult.error}`);
      // Continue with registration even if HubSpot sync fails
    }
    
    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        email_verified: user.email_verified
      },
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true,
      hubspotSynced: hubspotResult.success
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    
    const user = await findUserByVerificationToken(token);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    const verified = await verifyUserEmail(user.id);
    
    if (verified) {
      res.json({ message: 'Email verified successfully! You can now log in.' });
    } else {
      res.status(500).json({ error: 'Failed to verify email' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Email verification failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Check if password is hashed or plain text
    let valid = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      // Password is hashed, use bcrypt.compare
      valid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text (for existing test users)
      valid = password === user.password;
    }
    
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in. Check your inbox for the verification link.',
        requiresVerification: true 
      });
    }
    
    const token = generateToken(user);
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        email_verified: user.email_verified
      }, 
      token 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login, verifyEmail };
