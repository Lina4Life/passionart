const express = require('express');
const router = express.Router();

// Simple in-memory storage for testing
let chatMessages = {
  general: [],
  digital: [],
  traditional: [],
  photography: [],
  critique: [],
  commissions: []
};

// Get messages for a specific group
router.get('/messages/:group', (req, res) => {
  try {
    const { group } = req.params;
    const messages = chatMessages[group] || [];
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message to a group
router.post('/send', (req, res) => {
  try {
    const { group, username, message } = req.body;
    
    if (!group || !username || !message) {
      return res.status(400).json({ error: 'Group, username, and message are required' });
    }
    
    const newMessage = {
      id: Date.now(),
      username,
      message,
      timestamp: new Date().toISOString()
    };
    
    if (!chatMessages[group]) {
      chatMessages[group] = [];
    }
    
    chatMessages[group].push(newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get recent activity across all groups
router.get('/activity', (req, res) => {
  try {
    const activity = Object.keys(chatMessages).map(group => ({
      group_name: group,
      message_count: chatMessages[group].length,
      last_activity: chatMessages[group].length > 0 
        ? chatMessages[group][chatMessages[group].length - 1].timestamp 
        : null
    }));
    
    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

module.exports = router;

