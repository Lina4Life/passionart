/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Simple registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, first_name, last_name, user_type } = req.body;
    
    console.log('Registration request:', { email, username, user_type });
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, existing) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert user
      const query = `
        INSERT INTO users (email, password, username, first_name, last_name, user_type, verification_status)
        VALUES (?, ?, ?, ?, ?, ?, 'verified')
      `;
      
      db.run(query, [email, hashedPassword, username, first_name, last_name, user_type], function(err) {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        console.log('User created successfully with ID:', this.lastID);
        res.json({ 
          message: 'Registration successful',
          user: {
            id: this.lastID,
            email,
            username,
            user_type
          }
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Simple login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request:', { email });
    
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      let valid = false;
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        valid = await bcrypt.compare(password, user.password);
      } else {
        valid = password === user.password;
      }
      
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          user_type: user.user_type
        },
        token: 'dummy-token-' + Date.now()
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Server shutting down gracefully...');
  process.exit(0);
});
