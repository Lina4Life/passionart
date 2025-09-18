/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const router = express.Router();
const { register, login, verifyEmail } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);

module.exports = router;
