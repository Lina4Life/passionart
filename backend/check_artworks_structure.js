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

function checkArtworksTable() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return;
    }
    console.log('✅ Connected to SQLite database');
  });

  // Check current table structure
  db.all("PRAGMA table_info(artworks)", (err, columns) => {
    if (err) {
      console.error('Error checking table structure:', err.message);
      return;
    }
    
    console.log('📋 Current artworks table structure:');
    console.log('='.repeat(50));
    columns.forEach(col => {
      console.log(`${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check if tags column exists
    const hasTagsColumn = columns.some(col => col.name === 'tags');
    
    if (!hasTagsColumn) {
      console.log('\n🔧 Adding tags column...');
      db.run("ALTER TABLE artworks ADD COLUMN tags TEXT", (err) => {
        if (err) {
          console.error('Error adding tags column:', err.message);
        } else {
          console.log('✅ Tags column added successfully');
        }
        
        // Show updated structure
        db.all("PRAGMA table_info(artworks)", (err, newColumns) => {
          if (err) {
            console.error('Error checking updated table structure:', err.message);
          } else {
            console.log('\n📋 Updated artworks table structure:');
            console.log('='.repeat(50));
            newColumns.forEach(col => {
              console.log(`${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });
          }
          
          db.close();
        });
      });
    } else {
      console.log('\n✅ Tags column already exists');
      db.close();
    }
  });
}

checkArtworksTable();
