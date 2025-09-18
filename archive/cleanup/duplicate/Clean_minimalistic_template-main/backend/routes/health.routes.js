/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const express = require('express');
const router = express.Router();
router.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
module.exports = router;
