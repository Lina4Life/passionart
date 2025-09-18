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

// Check what tables exist
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
  if (err) {
    console.error('Error fetching tables:', err);
    return;
  }
  
  console.log('\n=== EXISTING TABLES ===');
  if (rows.length === 0) {
    console.log('No tables found in database');
  } else {
    rows.forEach(row => {
      console.log(`- ${row.name}`);
    });
  }
  
  db.close();
});
