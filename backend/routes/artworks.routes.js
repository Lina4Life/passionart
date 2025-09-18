const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_development');
const { verifyToken } = require('../utils/jwt');
const { saveArtwork, listArtworks } = require('../models/artworks.model');
const {
  getAllArtworks,
  getFeaturedArtworks,
  featureArtwork,
  unfeatureArtwork,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork
} = require('../controllers/artworks.controller');

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
    // Get approved artworks from the artworks database
    const artworksDbPath = path.join(__dirname, '..', 'config', 'database.db');
    const artworksDb = new sqlite3.Database(artworksDbPath);
    
    artworksDb.all(
      'SELECT * FROM artworks WHERE status = ? ORDER BY created_at DESC',
      ['approved'],
      (err, artworks) => {
        if (err) {
          console.error('Error fetching approved artworks:', err);
          return res.status(500).json({ error: 'Failed to fetch artworks' });
        }

        artworksDb.close();
        res.json(artworks);
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Featured artworks routes
router.get('/featured', getFeaturedArtworks);
router.post('/:id/feature', featureArtwork);
router.delete('/:id/feature', unfeatureArtwork);

module.exports = router;

