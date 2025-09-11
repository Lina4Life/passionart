/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
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

// Function to create new admin account
async function createNewAdmin() {
  console.log('=== REPLACING ADMIN ACCOUNT ===\n');
  
  // New admin credentials
  const newAdmin = {
    username: 'admin',
    email: 'admin@passionart.com',
    password: 'admin123', // Simple password
    user_type: 'admin'
  };
  
  try {
    // Step 1: Delete old admin account
    console.log('Step 1: Deleting old admin account...');
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM users WHERE user_type = 'admin'`, function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Deleted ${this.changes} old admin account(s)`);
          resolve();
        }
      });
    });
    
    // Step 2: Hash the new password
    console.log('Step 2: Hashing new password...');
    const hashedPassword = await bcrypt.hash(newAdmin.password, 10);
    console.log('✅ Password hashed successfully');
    
    // Step 3: Create new admin account
    console.log('Step 3: Creating new admin account...');
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (username, email, password, user_type, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `, [newAdmin.username, newAdmin.email, hashedPassword, newAdmin.user_type], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Created new admin account with ID: ${this.lastID}`);
          resolve();
        }
      });
    });
    
    // Step 4: Verify the new account
    console.log('Step 4: Verifying new admin account...');
    db.get(`
      SELECT id, username, email, user_type, created_at 
      FROM users 
      WHERE user_type = 'admin'
    `, (err, row) => {
      if (err) {
        console.error('Error verifying new admin:', err);
      } else if (row) {
        console.log('\n🎉 NEW ADMIN ACCOUNT CREATED SUCCESSFULLY!\n');
        console.log('=== LOGIN CREDENTIALS ===');
        console.log(`📧 Email: ${row.email}`);
        console.log(`👤 Username: ${row.username}`);
        console.log(`🔑 Password: ${newAdmin.password}`);
        console.log(`🆔 User ID: ${row.id}`);
        console.log(`📅 Created: ${row.created_at}`);
        console.log('\n=== LOGIN INSTRUCTIONS ===');
        console.log('1. Go to your PassionArt login page');
        console.log('2. Use the email and password above');
        console.log('3. Access the admin dashboard after login');
      } else {
        console.log('❌ Failed to verify new admin account');
      }
      
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('\n✅ Database operation completed!');
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error creating new admin:', error);
    db.close();
  }
}

// Run the function
createNewAdmin();
