const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_development');
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
    const { title = '', description = '', keywords = '', category = '', paymentIntentId } = req.body;
    
    if (!req.file) return res.status(400).json({ error: 'Missing image' });
    
    // Verify payment if paymentIntentId is provided
    if (paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({ error: 'Payment not completed' });
        }
      } catch (paymentError) {
        console.error('Payment verification failed:', paymentError);
        return res.status(400).json({ error: 'Invalid payment' });
      }
    }
    
    const relPath = '/uploads/' + req.file.filename;
    const art = await saveArtwork(req.user.id, title, description, keywords, relPath, category, paymentIntentId);
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
