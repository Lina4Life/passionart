/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const db = require('../config/database');

const saveArtwork = async (userId, title, description, keywords, imagePath, category, paymentIntentId) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO artworks (user_id, title, description, keywords, image_url, category, payment_intent_id, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)
    `;
    
    db.run(query, [userId, title, description, keywords, imagePath, category, paymentIntentId], function(err) {
      if (err) {
        reject(err);
      } else {
        // Get the created artwork
        db.get("SELECT * FROM artworks WHERE id = ?", [this.lastID], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      }
    });
  });
};

const listArtworks = async () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, user_id, title, description, 
             image_url, status, created_at
      FROM artworks ORDER BY id DESC
    `;
    
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = { saveArtwork, listArtworks };
