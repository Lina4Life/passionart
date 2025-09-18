const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '../config/database.db');
const db = new sqlite3.Database(dbPath);

// Get all servers
router.get('/servers', (req, res) => {
  const query = `
    SELECT 
      s.*,
      COUNT(DISTINCT sm.user_id) as member_count
    FROM community_servers s
    LEFT JOIN server_members sm ON s.id = sm.server_id
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching servers:', err);
      return res.status(500).json({ error: 'Failed to fetch servers' });
    }
    res.json(rows);
  });
});

// Get channels for a specific server
router.get('/servers/:serverId/channels', (req, res) => {
  const { serverId } = req.params;
  
  const query = `
    SELECT * FROM community_channels 
    WHERE server_id = ? 
    ORDER BY channel_type, name
  `;
  
  db.all(query, [serverId], (err, rows) => {
    if (err) {
      console.error('Error fetching channels:', err);
      return res.status(500).json({ error: 'Failed to fetch channels' });
    }
    res.json(rows);
  });
});

// Get messages for a specific channel
router.get('/channels/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  const { limit = 50, before } = req.query;
  
  let query = `
    SELECT 
      cm.*,
      u.username,
      u.profile_image
    FROM channel_messages cm
    JOIN users u ON cm.user_id = u.id
    WHERE cm.channel_id = ?
  `;
  
  const params = [channelId];
  
  if (before) {
    query += ' AND cm.created_at < ?';
    params.push(before);
  }
  
  query += ' ORDER BY cm.created_at DESC LIMIT ?';
  params.push(parseInt(limit));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    
    // Reverse to show oldest first
    res.json(rows.reverse());
  });
});

// Send a message to a channel
router.post('/channels/:channelId/messages', (req, res) => {
  const { channelId } = req.params;
  const { content, userId, attachment_url } = req.body;
  
  if (!content || !userId) {
    return res.status(400).json({ error: 'Content and userId are required' });
  }
  
  const query = `
    INSERT INTO channel_messages (channel_id, user_id, content, attachment_url, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(query, [channelId, userId, content, attachment_url], function(err) {
    if (err) {
      console.error('Error sending message:', err);
      return res.status(500).json({ error: 'Failed to send message' });
    }
    
    // Get the created message with user info
    const getMessageQuery = `
      SELECT 
        cm.*,
        u.username,
        u.profile_image
      FROM channel_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.id = ?
    `;
    
    db.get(getMessageQuery, [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created message:', err);
        return res.status(500).json({ error: 'Message sent but failed to retrieve' });
      }
      
      res.status(201).json(row);
    });
  });
});

// Join a server
router.post('/servers/:serverId/join', (req, res) => {
  const { serverId } = req.params;
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  // Check if already a member
  const checkQuery = 'SELECT * FROM server_members WHERE server_id = ? AND user_id = ?';
  
  db.get(checkQuery, [serverId, userId], (err, row) => {
    if (err) {
      console.error('Error checking membership:', err);
      return res.status(500).json({ error: 'Failed to check membership' });
    }
    
    if (row) {
      return res.status(400).json({ error: 'Already a member of this server' });
    }
    
    // Add as member
    const insertQuery = `
      INSERT INTO server_members (server_id, user_id, joined_at)
      VALUES (?, ?, datetime('now'))
    `;
    
    db.run(insertQuery, [serverId, userId], function(err) {
      if (err) {
        console.error('Error joining server:', err);
        return res.status(500).json({ error: 'Failed to join server' });
      }
      
      res.status(201).json({ message: 'Successfully joined server' });
    });
  });
});

// Leave a server
router.delete('/servers/:serverId/leave', (req, res) => {
  const { serverId } = req.params;
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  
  const query = 'DELETE FROM server_members WHERE server_id = ? AND user_id = ?';
  
  db.run(query, [serverId, userId], function(err) {
    if (err) {
      console.error('Error leaving server:', err);
      return res.status(500).json({ error: 'Failed to leave server' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Not a member of this server' });
    }
    
    res.json({ message: 'Successfully left server' });
  });
});

// Get server members
router.get('/servers/:serverId/members', (req, res) => {
  const { serverId } = req.params;
  
  const query = `
    SELECT 
      u.id,
      u.username,
      u.email,
      u.profile_image,
      sm.joined_at,
      sm.role
    FROM server_members sm
    JOIN users u ON sm.user_id = u.id
    WHERE sm.server_id = ?
    ORDER BY sm.joined_at ASC
  `;
  
  db.all(query, [serverId], (err, rows) => {
    if (err) {
      console.error('Error fetching server members:', err);
      return res.status(500).json({ error: 'Failed to fetch server members' });
    }
    res.json(rows);
  });
});

// Create a new server (admin only)
router.post('/servers', (req, res) => {
  const { name, description, category, created_by } = req.body;
  
  if (!name || !created_by) {
    return res.status(400).json({ error: 'Name and created_by are required' });
  }
  
  // Generate icon color based on name
  const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
  const iconColor = colors[name.length % colors.length];
  
  const query = `
    INSERT INTO community_servers (name, description, category, icon_color, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(query, [name, description, category, iconColor, created_by], function(err) {
    if (err) {
      console.error('Error creating server:', err);
      return res.status(500).json({ error: 'Failed to create server' });
    }
    
    const serverId = this.lastID;
    
    // Add creator as admin member
    const addMemberQuery = `
      INSERT INTO server_members (server_id, user_id, role, joined_at)
      VALUES (?, ?, 'admin', datetime('now'))
    `;
    
    db.run(addMemberQuery, [serverId, created_by], (err) => {
      if (err) {
        console.error('Error adding creator as member:', err);
      }
    });
    
    // Get the created server
    const getServerQuery = `
      SELECT 
        s.*,
        COUNT(DISTINCT sm.user_id) as member_count
      FROM community_servers s
      LEFT JOIN server_members sm ON s.id = sm.server_id
      WHERE s.id = ?
      GROUP BY s.id
    `;
    
    db.get(getServerQuery, [serverId], (err, row) => {
      if (err) {
        console.error('Error fetching created server:', err);
        return res.status(500).json({ error: 'Server created but failed to retrieve' });
      }
      
      res.status(201).json(row);
    });
  });
});

// Create a new channel (admin/moderator only)
router.post('/servers/:serverId/channels', (req, res) => {
  const { serverId } = req.params;
  const { name, description, channel_type = 'text', created_by } = req.body;
  
  if (!name || !created_by) {
    return res.status(400).json({ error: 'Name and created_by are required' });
  }
  
  const query = `
    INSERT INTO community_channels (server_id, name, description, channel_type, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(query, [serverId, name, description, channel_type, created_by], function(err) {
    if (err) {
      console.error('Error creating channel:', err);
      return res.status(500).json({ error: 'Failed to create channel' });
    }
    
    // Get the created channel
    const getChannelQuery = 'SELECT * FROM community_channels WHERE id = ?';
    
    db.get(getChannelQuery, [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created channel:', err);
        return res.status(500).json({ error: 'Channel created but failed to retrieve' });
      }
      
      res.status(201).json(row);
    });
  });
});

module.exports = router;

