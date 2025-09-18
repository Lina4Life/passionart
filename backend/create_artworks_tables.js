const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'config/database.db');
const db = new sqlite3.Database(dbPath);

// Create artworks table with featured functionality
const createArtworksTable = `
  CREATE TABLE IF NOT EXISTS artworks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    artist_name VARCHAR(255),
    artist_id INTEGER,
    medium VARCHAR(100),
    dimensions VARCHAR(100),
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending',
    is_featured BOOLEAN DEFAULT 0,
    featured_at DATETIME,
    featured_by INTEGER,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES users(id),
    FOREIGN KEY (featured_by) REFERENCES users(id)
  )
`;

// Create featured_artworks table for better management
const createFeaturedTable = `
  CREATE TABLE IF NOT EXISTS featured_artworks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artwork_id INTEGER NOT NULL,
    featured_by INTEGER NOT NULL,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT 1,
    featured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id),
    FOREIGN KEY (featured_by) REFERENCES users(id)
  )
`;

async function createTables() {
  try {
    await new Promise((resolve, reject) => {
      db.run(createArtworksTable, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('âœ… Artworks table created successfully');

    await new Promise((resolve, reject) => {
      db.run(createFeaturedTable, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('âœ… Featured artworks table created successfully');

  } catch (error) {
    console.error('âŒ Error creating tables:', error);
  } finally {
    db.close();
  }
}

createTables();

