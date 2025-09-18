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

// Function to check admin accounts
function checkAdminAccounts() {
  console.log('=== CHECKING ADMIN ACCOUNTS ===\n');
  
  // Get all admin users
  db.all(`
    SELECT 
      id, 
      username, 
      email, 
      user_type, 
      password,
      created_at
    FROM users 
    WHERE user_type = 'admin'
    ORDER BY id
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching admin accounts:', err);
      return;
    }
    
    if (rows.length === 0) {
      console.log('❌ No admin accounts found in database.');
    } else {
      console.log(`✅ Found ${rows.length} admin account(s):\n`);
      
      rows.forEach((admin, index) => {
        console.log(`Admin Account #${index + 1}:`);
        console.log(`- ID: ${admin.id}`);
        console.log(`- Username: ${admin.username}`);
        console.log(`- Email: ${admin.email}`);
        console.log(`- Password: ${admin.password}`);
        console.log(`- User Type: ${admin.user_type}`);
        console.log(`- Created: ${admin.created_at}`);
        console.log('');
      });
    }
    
    // Also check if there are any other user types
    console.log('=== ALL USER TYPES IN DATABASE ===');
    db.all(`
      SELECT user_type, COUNT(*) as count 
      FROM users 
      GROUP BY user_type 
      ORDER BY count DESC
    `, (err, typeRows) => {
      if (err) {
        console.error('Error fetching user types:', err);
      } else {
        typeRows.forEach(row => {
          console.log(`- ${row.user_type}: ${row.count} user(s)`);
        });
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('\n✅ Database check completed!');
        }
      });
    });
  });
}

// Run the function
checkAdminAccounts();
