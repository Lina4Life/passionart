﻿// Check feedback table structure
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend', 'passionart.db');
console.log('Connecting to database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
});

// Check if feedback table exists
db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='feedback'", (err, tables) => {
  if (err) {
    console.error('Error checking tables:', err);
    return;
  }
  
  if (tables.length === 0) {
    console.log('âŒ Feedback table does not exist');
    console.log('Creating feedback table...');
    
    const createFeedbackTable = `
      CREATE TABLE feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_email TEXT,
        user_name TEXT,
        issue TEXT NOT NULL,
        feedback TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;
    
    db.run(createFeedbackTable, (err) => {
      if (err) {
        console.error('Error creating feedback table:', err);
      } else {
        console.log('âœ… Feedback table created successfully');
      }
      db.close();
    });
  } else {
    console.log('âœ… Feedback table exists');
    
    // Check table structure
    db.all("PRAGMA table_info(feedback)", (err, columns) => {
      if (err) {
        console.error('Error getting table info:', err);
      } else {
        console.log('Feedback table structure:');
        columns.forEach(col => {
          console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
        });
      }
      db.close();
    });
  }
});

