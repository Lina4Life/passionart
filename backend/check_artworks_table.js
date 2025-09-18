/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'data', 'passionart.db');

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Check artworks table structure
db.all("PRAGMA table_info(artworks)", (err, rows) => {
  if (err) {
    console.error('Error fetching artworks table info:', err);
    return;
  }
  
  console.log('\n=== ARTWORKS TABLE STRUCTURE ===');
  rows.forEach(row => {
    console.log(`- ${row.name}: ${row.type} (${row.notnull ? 'NOT NULL' : 'nullable'})`);
  });
  
  // Check what categories are currently in use
  db.all("SELECT DISTINCT category FROM artworks WHERE category IS NOT NULL ORDER BY category", (err, categoryRows) => {
    if (err) {
      console.error('Error fetching categories:', err);
    } else {
      console.log('\n=== CURRENT CATEGORIES IN ARTWORKS ===');
      if (categoryRows.length === 0) {
        console.log('No categories found in artworks');
      } else {
        categoryRows.forEach(row => {
          console.log(`- ${row.category}`);
        });
      }
    }
    
    db.close();
  });
});
