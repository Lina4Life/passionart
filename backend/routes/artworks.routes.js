const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../utils/jwt');
const { saveArtwork, listArtworks } = require('../models/artworks.model');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title = '', description = '', keywords = '' } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Missing image' });
    const relPath = '/uploads/' + req.file.filename;
    const art = await saveArtwork(req.user.id, title, description, keywords, relPath);
    res.json(art);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed' });
  }
});
router.get('/', async (_req, res) => {
  try {
    const rows = await listArtworks();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

module.exports = router;
