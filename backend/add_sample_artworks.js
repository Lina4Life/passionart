/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'config', 'database.db');

const sampleArtworks = [
  {
    title: 'Sunset Dreams',
    description: 'A beautiful digital painting capturing the essence of a perfect sunset',
    price: 299.99,
    medium: 'Digital Art',
    dimensions: '24" x 18"',
    artist_id: 1,
    artist_name: 'Alex Rivera',
    artist_username: 'alex_art',
    status: 'approved',
    image_url: '/uploads/sunset-dreams.jpg'
  },
  {
    title: 'Urban Symphony',
    description: 'Mixed media piece representing the rhythm of city life',
    price: 450.00,
    medium: 'Mixed Media',
    dimensions: '30" x 24"',
    artist_id: 2,
    artist_name: 'Sarah Chen',
    artist_username: 'sarah_creates',
    status: 'approved',
    image_url: '/uploads/urban-symphony.jpg'
  },
  {
    title: 'Ocean Whispers',
    description: 'Photography capturing the serene beauty of ocean waves',
    price: 199.99,
    medium: 'Photography',
    dimensions: '16" x 12"',
    artist_id: 3,
    artist_name: 'Michael Johnson',
    artist_username: 'mike_photo',
    status: 'approved',
    image_url: '/uploads/ocean-whispers.jpg'
  },
  {
    title: 'Abstract Emotions',
    description: 'A powerful abstract piece exploring human emotions through color',
    price: 650.00,
    medium: 'Acrylic on Canvas',
    dimensions: '36" x 48"',
    artist_id: 4,
    artist_name: 'Emma Rodriguez',
    artist_username: 'emma_abstract',
    status: 'approved',
    image_url: '/uploads/abstract-emotions.jpg'
  },
  {
    title: 'Digital Renaissance',
    description: 'Modern interpretation of classical art forms using digital techniques',
    price: 375.00,
    medium: 'Digital Art',
    dimensions: '20" x 30"',
    artist_id: 5,
    artist_name: 'David Kim',
    artist_username: 'david_digital',
    status: 'approved',
    image_url: '/uploads/digital-renaissance.jpg'
  },
  {
    title: 'Nature\'s Pattern',
    description: 'Macro photography revealing the intricate patterns in nature',
    price: 225.00,
    medium: 'Photography',
    dimensions: '14" x 20"',
    artist_id: 6,
    artist_name: 'Lisa Taylor',
    artist_username: 'lisa_nature',
    status: 'approved',
    image_url: '/uploads/nature-pattern.jpg'
  }
];

function addSampleArtworks() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      return;
    }
    console.log('Connected to SQLite database');
  });

  // First, create the artworks table if it doesn't exist
  const createArtworksTable = `
    CREATE TABLE IF NOT EXISTS artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      medium TEXT,
      dimensions TEXT,
      artist_id INTEGER,
      artist_name TEXT,
      artist_username TEXT,
      status TEXT DEFAULT 'pending',
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create featured_artworks table if it doesn't exist
  const createFeaturedTable = `
    CREATE TABLE IF NOT EXISTS featured_artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      artwork_id INTEGER NOT NULL,
      featured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (artwork_id) REFERENCES artworks (id) ON DELETE CASCADE
    )
  `;

  db.run(createArtworksTable, (err) => {
    if (err) {
      console.error('Error creating artworks table:', err);
      return;
    }
    console.log('Artworks table ready');

    db.run(createFeaturedTable, (err) => {
      if (err) {
        console.error('Error creating featured_artworks table:', err);
        return;
      }
      console.log('Featured artworks table ready');

      // Clear existing sample data
      db.run('DELETE FROM artworks WHERE artist_id IN (1,2,3,4,5,6)', (err) => {
        if (err) {
          console.error('Error clearing existing data:', err);
        } else {
          console.log('Cleared existing sample data');
        }

        // Insert sample artworks
        const insertStmt = db.prepare(`
          INSERT INTO artworks (title, description, price, medium, dimensions, artist_id, artist_name, artist_username, status, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sampleArtworks.forEach((artwork) => {
          insertStmt.run([
            artwork.title,
            artwork.description,
            artwork.price,
            artwork.medium,
            artwork.dimensions,
            artwork.artist_id,
            artwork.artist_name,
            artwork.artist_username,
            artwork.status,
            artwork.image_url
          ], function(err) {
            if (err) {
              console.error('Error inserting artwork:', err);
            } else {
              console.log(`Inserted artwork: ${artwork.title} with ID ${this.lastID}`);
            }
          });
        });

        insertStmt.finalize((err) => {
          if (err) {
            console.error('Error finalizing statement:', err);
          } else {
            console.log('All sample artworks added successfully!');
            console.log('You can now manage featured artworks from the admin panel.');
          }
          
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('Database connection closed.');
            }
          });
        });
      });
    });
  });
}

// Run the script
addSampleArtworks();
