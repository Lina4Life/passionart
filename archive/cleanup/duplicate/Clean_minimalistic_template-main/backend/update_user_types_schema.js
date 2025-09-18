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

function updateUserTypeConstraints() {
  console.log('=== UPDATING USER TYPE CONSTRAINTS ===\n');
  
  // SQLite doesn't support ALTER COLUMN with CHECK constraints directly
  // We need to recreate the table with new constraints
  
  // Step 1: Create a new users table with updated constraints
  const createNewUsersTable = `
    CREATE TABLE users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      username VARCHAR(100),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      user_type VARCHAR(50) CHECK (user_type IN ('artist', 'gallery', 'collector', 'institution', 'admin')),
      phone VARCHAR(20),
      bio TEXT,
      profile_picture VARCHAR(255),
      website VARCHAR(255),
      verification_status VARCHAR(20) DEFAULT 'pending',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(createNewUsersTable, (err) => {
    if (err) {
      console.error('Error creating new users table:', err);
      return;
    }
    
    console.log('✅ Created new users table with updated constraints');
    
    // Step 2: Copy data from old table to new table, updating 'sponsor' to 'institution'
    const copyData = `
      INSERT INTO users_new (
        id, email, password, username, first_name, last_name, 
        user_type, phone, bio, profile_picture, website, 
        verification_status, is_active, created_at, updated_at
      )
      SELECT 
        id, email, password, username, first_name, last_name,
        CASE 
          WHEN user_type = 'sponsor' THEN 'institution'
          ELSE user_type
        END as user_type,
        phone, bio, profile_picture, website,
        verification_status, is_active, created_at, updated_at
      FROM users
    `;
    
    db.run(copyData, (err) => {
      if (err) {
        console.error('Error copying data to new table:', err);
        return;
      }
      
      console.log('✅ Copied data to new table (sponsor → institution)');
      
      // Step 3: Drop old table and rename new table
      db.run('DROP TABLE users', (err) => {
        if (err) {
          console.error('Error dropping old users table:', err);
          return;
        }
        
        console.log('✅ Dropped old users table');
        
        db.run('ALTER TABLE users_new RENAME TO users', (err) => {
          if (err) {
            console.error('Error renaming new table:', err);
            return;
          }
          
          console.log('✅ Renamed new table to users');
          
          // Show updated user types
          db.all("SELECT DISTINCT user_type FROM users WHERE user_type IS NOT NULL ORDER BY user_type", (err, rows) => {
            if (err) {
              console.error('Error fetching user types:', err);
            } else {
              console.log('\n=== UPDATED USER TYPES ALLOWED ===');
              console.log('- artist');
              console.log('- gallery');  
              console.log('- collector 🆕');
              console.log('- institution 🆕 (was sponsor)');
              console.log('- admin');
              
              console.log('\n=== CURRENT USER TYPES IN DATABASE ===');
              rows.forEach(row => {
                console.log(`- ${row.user_type}`);
              });
            }
            
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
              } else {
                console.log('\n🎉 Database schema updated successfully!');
                console.log('You can now add collector and institution users.');
              }
            });
          });
        });
      });
    });
  });
}

// Run the function
updateUserTypeConstraints();
