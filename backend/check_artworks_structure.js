﻿const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'config', 'database.db');

function checkArtworksTable() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return;
    }
    console.log('âœ… Connected to SQLite database');
  });

  // Check current table structure
  db.all("PRAGMA table_info(artworks)", (err, columns) => {
    if (err) {
      console.error('Error checking table structure:', err.message);
      return;
    }
    
    console.log('ðŸ“‹ Current artworks table structure:');
    console.log('='.repeat(50));
    columns.forEach(col => {
      console.log(`${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check if tags column exists
    const hasTagsColumn = columns.some(col => col.name === 'tags');
    
    if (!hasTagsColumn) {
      console.log('\nðŸ”§ Adding tags column...');
      db.run("ALTER TABLE artworks ADD COLUMN tags TEXT", (err) => {
        if (err) {
          console.error('Error adding tags column:', err.message);
        } else {
          console.log('âœ… Tags column added successfully');
        }
        
        // Show updated structure
        db.all("PRAGMA table_info(artworks)", (err, newColumns) => {
          if (err) {
            console.error('Error checking updated table structure:', err.message);
          } else {
            console.log('\nðŸ“‹ Updated artworks table structure:');
            console.log('='.repeat(50));
            newColumns.forEach(col => {
              console.log(`${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });
          }
          
          db.close();
        });
      });
    } else {
      console.log('\nâœ… Tags column already exists');
      db.close();
    }
  });
}

checkArtworksTable();

