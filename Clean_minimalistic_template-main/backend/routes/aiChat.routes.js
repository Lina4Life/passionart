/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/aiChat.controller');

// POST /api/ai-chat - Send message to AI
router.post('/', aiChatController.sendMessage);

module.exports = router;
