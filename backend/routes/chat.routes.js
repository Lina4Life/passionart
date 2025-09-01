const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '../config/database.db');
let db;

try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening chat database:', err);
    } else {
      console.log('Chat database connected');
      // Initialize the chat messages table if it doesn't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          group_name TEXT NOT NULL,
          username TEXT NOT NULL,
          message TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating chat_messages table:', err);
        } else {
          console.log('Chat messages table ready');
        }
      });
    }
  });
} catch (error) {
  console.error('Database connection error:', error);
}

// Get messages for a specific group
router.get('/messages/:group', (req, res) => {
  try {
    const { group } = req.params;
    const { limit = 50 } = req.query;
    
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const query = `
      SELECT * FROM chat_messages 
      WHERE group_name = ? 
      ORDER BY timestamp ASC 
      LIMIT ?
    `;
    
    db.all(query, [group, parseInt(limit)], (err, rows) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ error: 'Failed to fetch messages' });
      }
      res.json(rows || []);
    });
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a message to a group
router.post('/send', (req, res) => {
  try {
    const { group, username, message } = req.body;
    
    if (!group || !username || !message) {
      return res.status(400).json({ error: 'Group, username, and message are required' });
    }
    
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const query = `
      INSERT INTO chat_messages (group_name, username, message, timestamp)
      VALUES (?, ?, ?, datetime('now'))
    `;
    
    db.run(query, [group, username, message], function(err) {
      if (err) {
        console.error('Error sending message:', err);
        return res.status(500).json({ error: 'Failed to send message' });
      }
      
      // Get the created message
      const getMessageQuery = `
        SELECT * FROM chat_messages WHERE id = ?
      `;
      
      db.get(getMessageQuery, [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching created message:', err);
          return res.status(500).json({ error: 'Message sent but failed to retrieve' });
        }
        
        res.status(201).json(row);
      });
    });
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity across all groups
router.get('/activity', (req, res) => {
  const { limit = 20 } = req.query;
  
  const query = `
    SELECT group_name, COUNT(*) as message_count, MAX(timestamp) as last_activity
    FROM chat_messages 
    GROUP BY group_name 
    ORDER BY last_activity DESC 
    LIMIT ?
  `;
  
  db.all(query, [parseInt(limit)], (err, rows) => {
    if (err) {
      console.error('Error fetching activity:', err);
      return res.status(500).json({ error: 'Failed to fetch activity' });
    }
    res.json(rows);
  });
});

module.exports = router;
