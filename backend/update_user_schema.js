/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'config/database.db');
const db = new sqlite3.Database(dbPath);

// Add new columns for enhanced user types
const alterQueries = [
  'ALTER TABLE users ADD COLUMN user_type VARCHAR(20) DEFAULT "artist"',
  'ALTER TABLE users ADD COLUMN institution_name VARCHAR(255)',
  'ALTER TABLE users ADD COLUMN institution_type VARCHAR(100)',
  'ALTER TABLE users ADD COLUMN bio TEXT',
  'ALTER TABLE users ADD COLUMN phone VARCHAR(20)',
  'ALTER TABLE users ADD COLUMN address TEXT',
  'ALTER TABLE users ADD COLUMN collector_interests TEXT',
  'ALTER TABLE users ADD COLUMN institution_focus TEXT'
];

async function updateUserSchema() {
  for (const query of alterQueries) {
    try {
      await new Promise((resolve, reject) => {
        db.run(query, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log('Executed:', query);
    } catch (error) {
      console.log('Skipped (column exists):', query);
    }
  }
  
  db.close();
  console.log('Database schema updated successfully!');
}

updateUserSchema();
