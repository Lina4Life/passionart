﻿const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/aiChat.controller');

// POST /api/ai-chat - Send message to AI
router.post('/', aiChatController.sendMessage);

module.exports = router;

