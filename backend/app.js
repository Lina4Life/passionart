const path = require('path');
require('dotenv').config();

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Socket.IO setup for real-time chat
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) || ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
const onlineUsers = new Map();
const groupUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining a chat room
  socket.on('join-room', (groupName) => {
    socket.join(groupName);
    console.log(`Socket ${socket.id} joined room: ${groupName}`);
  });

  // Handle user leaving a chat room
  socket.on('leave-room', (groupName) => {
    socket.leave(groupName);
    console.log(`Socket ${socket.id} left room: ${groupName}`);
  });

  // Handle new messages
  socket.on('send-message', (messageData) => {
    // Broadcast message to all users in the group
    socket.to(messageData.group).emit('new-message', messageData);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.group).emit('user-typing', data);
  });

  // Handle user online status
  socket.on('user-online', (userData) => {
    onlineUsers.set(socket.id, userData);
    
    // Add user to group
    if (!groupUsers.has(userData.group)) {
      groupUsers.set(userData.group, new Set());
    }
    groupUsers.get(userData.group).add(userData);

    // Broadcast online users to group
    const groupOnlineUsers = Array.from(groupUsers.get(userData.group) || []);
    io.to(userData.group).emit('online-users', groupOnlineUsers);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const userData = onlineUsers.get(socket.id);
    if (userData) {
      // Remove from group users
      const groupSet = groupUsers.get(userData.group);
      if (groupSet) {
        groupSet.delete(userData);
        const groupOnlineUsers = Array.from(groupSet);
        io.to(userData.group).emit('online-users', groupOnlineUsers);
      }
      
      onlineUsers.delete(socket.id);
    }
  });
});

// Make io available to routes
app.set('io', io);

// CORS
const origins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
app.use(cors({ origin: origins.length ? origins : '*' }));
// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const artworksRoutes = require('./routes/artworks.routes');
const adminSimpleRoutes = require('./routes/admin_simple.routes');
const adminRoutes = require('./routes/admin.routes');
const communityRoutes = require('./routes/community.routes');
const profileRoutes = require('./routes/profile.routes');
const articlesRoutes = require('./routes/articles.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const databaseRoutes = require('./routes/database.routes');
// const aiChatRoutes = require('./routes/aiChat.routes');
const chatRoutes = require('./routes/chat.routes'); // Updated to use enhanced chat routes
// const paymentRoutes = require('./routes/payment.routes');
// const articlesRoutes = require('./routes/articles.routes');
// const emailRoutes = require('./routes/email.routes');

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/artworks', artworksRoutes);
app.use('/api/admin', adminSimpleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/database', databaseRoutes);
// app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/chat', chatRoutes);
// app.use('/api/payment', paymentRoutes);
app.use('/api/articles', articlesRoutes);
// app.use('/api/email', emailRoutes);
app.use('/api/hubspot', require('./routes/hubspot.routes'));
app.use('/api/hybrid-email', require('./routes/hybrid-email.routes'));

// Artists API endpoint
app.get('/api/artists', async (req, res) => {
  try {
    const sqlite3 = require('sqlite3').verbose();
    const path = require('path');
    
    // Use absolute path to database
    const dbPath = path.join(__dirname, 'data', 'passionart.db');
    const db = new sqlite3.Database(dbPath);
    
    const query = `
      SELECT id, username, first_name, last_name, email, bio, 
             user_type, profile_picture, created_at
      FROM users 
      WHERE user_type = 'artist'
      ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        db.close();
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch artists' 
        });
      }
      
      console.log(`Found ${rows.length} artists in database`);
      db.close();
      
      res.json({ 
        success: true, 
        artists: rows 
      });
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Follow/Unfollow endpoints
app.post('/api/profile/follow', async (req, res) => {
  try {
    const { userId } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const currentUserId = decoded.userId;
    
    if (currentUserId === userId) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }
    
    const db = require('./config/database');
    
    // Check if already following
    db.get(
      'SELECT * FROM user_follows WHERE follower_id = ? AND following_id = ?',
      [currentUserId, userId],
      (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (row) {
          return res.status(400).json({ success: false, message: 'Already following this user' });
        }
        
        // Create follow relationship
        db.run(
          'INSERT INTO user_follows (follower_id, following_id, created_at) VALUES (?, ?, ?)',
          [currentUserId, userId, new Date().toISOString()],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ success: false, message: 'Failed to follow user' });
            }
            
            res.json({ success: true, message: 'Successfully followed user' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/profile/unfollow', async (req, res) => {
  try {
    const { userId } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const currentUserId = decoded.userId;
    
    const db = require('./config/database');
    
    db.run(
      'DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?',
      [currentUserId, userId],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, message: 'Failed to unfollow user' });
        }
        
        res.json({ success: true, message: 'Successfully unfollowed user' });
      }
    );
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/profile/following', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const currentUserId = decoded.userId;
    
    const db = require('./config/database');
    
    const query = `
      SELECT u.id, u.username, u.first_name, u.last_name
      FROM users u
      INNER JOIN user_follows uf ON u.id = uf.following_id
      WHERE uf.follower_id = ?
    `;
    
    db.all(query, [currentUserId], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      res.json({ success: true, following: rows });
    });
  } catch (error) {
    console.error('Error fetching following list:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user profile by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sqlite3 = require('sqlite3').verbose();
    const path = require('path');
    
    // Use absolute path to database
    const dbPath = path.join(__dirname, 'data', 'passionart.db');
    const db = new sqlite3.Database(dbPath);
    
    const query = `
      SELECT id, username, first_name, last_name, email, bio, 
             user_type, profile_picture, created_at
      FROM users 
      WHERE id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        db.close();
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (!row) {
        db.close();
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      db.close();
      res.json({ success: true, user: row });
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get artworks by artist ID (placeholder - you can implement when artworks table exists)
app.get('/api/artworks/artist/:id', async (req, res) => {
  try {
    // For now, return empty array since artworks table may not exist yet
    res.json({ success: true, artworks: [] });
  } catch (error) {
    console.error('Error fetching artist artworks:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get follower count for user
app.get('/api/user/:id/followers', async (req, res) => {
  try {
    const { id } = req.params;
    const db = require('./config/database');
    
    db.get('SELECT COUNT(*) as count FROM user_follows WHERE following_id = ?', [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      res.json({ success: true, count: row.count });
    });
  } catch (error) {
    console.error('Error fetching follower count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get following count for user
app.get('/api/user/:id/following', async (req, res) => {
  try {
    const { id } = req.params;
    const db = require('./config/database');
    
    db.get('SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ?', [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      res.json({ success: true, count: row.count });
    });
  } catch (error) {
    console.error('Error fetching following count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user profile by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = require('./config/db');
    
    const query = `
      SELECT id, username, first_name, last_name, email, bio, 
             user_type, profile_picture, created_at
      FROM users 
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user's artworks
app.get('/api/artworks/artist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = require('./config/db');
    
    const query = `
      SELECT id, title, description, price, category, medium, 
             dimensions, year_created, image_url, status, created_at
      FROM artworks 
      WHERE artist_id = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [id]);
    
    res.json({ success: true, artworks: result.rows });
  } catch (error) {
    console.error('Error fetching user artworks:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user's follower count
app.get('/api/user/:id/followers', async (req, res) => {
  try {
    const { id } = req.params;
    const db = require('./config/db');
    
    const query = 'SELECT COUNT(*) as count FROM user_follows WHERE following_id = $1';
    const result = await db.query(query, [id]);
    
    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error fetching follower count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get user's following count
app.get('/api/user/:id/following', async (req, res) => {
  try {
    const { id } = req.params;
    const db = require('./config/db');
    
    const query = 'SELECT COUNT(*) as count FROM user_follows WHERE follower_id = $1';
    const result = await db.query(query, [id]);
    
    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error fetching following count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Static
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

