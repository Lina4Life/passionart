const express = require('express');
const { verifyToken } = require('../utils/jwt');
const router = express.Router();

// In-memory storage for testing (temporary)
let messages = [];
let onlineUsers = [];
let groups = [
  { id: 1, name: 'General Chat', description: 'Main community chat' }
];

// Send message endpoint
router.post('/send', verifyToken, (req, res) => {
  try {
    const { group, message, timestamp } = req.body;
    const user = req.user; // From JWT token
    
    const newMessage = {
      id: messages.length + 1,
      group: group || 'general',
      username: user.username || user.email.split('@')[0],
      userId: user.id,
      email: user.email,
      message: message,
      timestamp: timestamp || new Date().toISOString(),
      message_type: 'text'
    };
    
    messages.push(newMessage);
    
    // Get the Socket.IO instance from the app
    const io = req.app.get('io');
    if (io) {
      // Broadcast the message to all users in the group
      io.to(newMessage.group).emit('new-message', newMessage);
      console.log(`Broadcasting message to group ${newMessage.group}:`, newMessage);
    }
    
    console.log('Message received:', newMessage);
    
    res.status(200).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages endpoint
router.get('/messages/:group', verifyToken, (req, res) => {
  try {
    const { group } = req.params;
    const groupMessages = messages.filter(msg => msg.group === group);
    
    res.status(200).json({
      success: true,
      messages: groupMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get groups endpoint
router.get('/groups', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      groups: groups
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get online users endpoint
router.get('/online-users', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      onlineUsers: onlineUsers
    });
  } catch (error) {
    console.error('Error fetching online users:', error);
    res.status(500).json({ error: 'Failed to fetch online users' });
  }
});

module.exports = router;

