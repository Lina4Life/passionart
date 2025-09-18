/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'passionart', 'passionart.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  
  console.log('✅ Connected to SQLite database');
  
  // Check users table schema
  db.all('PRAGMA table_info(users)', (err, rows) => {
    if (err) {
      console.error('Error getting table info:', err);
    } else {
      console.log('\n📋 Users table schema:');
      rows.forEach(row => {
        console.log(`${row.name} (${row.type}) - ${row.notnull ? 'NOT NULL' : 'NULL'} - Default: ${row.dflt_value || 'None'}`);
      });
      
      // Check if social_media column exists
      const socialMediaColumn = rows.find(row => row.name === 'social_media');
      if (socialMediaColumn) {
        console.log('\n✅ social_media column already exists');
      } else {
        console.log('\n❌ social_media column does not exist');
      }
    }
    
    // Check some sample users
    db.all('SELECT id, first_name, last_name, email, user_type, social_media FROM users LIMIT 5', (err, users) => {
      if (err) {
        console.error('Error getting users:', err);
      } else {
        console.log('\n👥 Sample users:');
        users.forEach(user => {
          console.log(`${user.id}: ${user.first_name} ${user.last_name} (${user.user_type}) - Social: ${user.social_media || 'None'}`);
        });
      }
      
      db.close();
    });
  });
});
