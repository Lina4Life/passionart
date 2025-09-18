/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const { createUser, findUserByEmail, findUserByVerificationToken, verifyUserEmail } = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const axios = require('axios');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const { email, password, username, first_name, last_name, user_type } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await createUser(email, password, username, first_name, last_name, verificationToken, user_type);
    
    // Send verification email via hybrid system
    console.log(`Attempting to send verification email to: ${email}`);
    try {
      const response = await axios.post(`http://localhost:${process.env.PORT || 3001}/api/hybrid-email/send-verification`, {
        email,
        verificationToken,
        firstName: first_name
      });
      
      if (response.data.success) {
        console.log('✅ Verification email sent successfully!');
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message);
      // Continue with registration even if email fails
    }
    
    // Sync user to HubSpot CRM
    console.log(`📞 Syncing user to HubSpot: ${email}`);
    try {
      const hubspotResponse = await axios.post(`http://localhost:${process.env.PORT || 3001}/api/hybrid-email/sync-user`, {
        email,
        firstName: first_name,
        lastName: last_name,
        userType: user_type
      });
      
      if (hubspotResponse.data.success) {
        console.log(`✅ User synced to HubSpot: ${hubspotResponse.data.message}`);
      }
    } catch (hubspotError) {
      console.error(`❌ HubSpot sync failed: ${hubspotError.message}`);
      // Continue with registration even if HubSpot sync fails
    }
    
    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        user_type: user.user_type,
        email_verified: user.email_verified
      },
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true
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
    
    // Temporarily disable email verification check for testing
    // TODO: Re-enable email verification in production
    /*
    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in. Check your inbox for the verification link.',
        requiresVerification: true 
      });
    }
    */
    
    const token = generateToken(user);
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        verification_status: user.verification_status
      }, 
      token 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login, verifyEmail };
