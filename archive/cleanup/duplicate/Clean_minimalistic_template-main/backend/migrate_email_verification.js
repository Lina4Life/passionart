/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const db = require('./config/database');

// Migration to add email verification fields to users table
function addEmailVerificationFields() {
  console.log('Adding email verification fields to users table...');
  
  // Check if email_verified column exists
  db.get("PRAGMA table_info(users)", (err, info) => {
    if (err) {
      console.error('Error checking table info:', err);
      return;
    }

    // Add email_verified column if it doesn't exist
    db.run(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding email_verified column:', err);
      } else {
        console.log('✓ Added email_verified column');
      }
    });

    // Add verification_token column if it doesn't exist
    db.run(`ALTER TABLE users ADD COLUMN verification_token TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding verification_token column:', err);
      } else {
        console.log('✓ Added verification_token column');
      }
    });

    // Add verification_token_expires column if it doesn't exist
    db.run(`ALTER TABLE users ADD COLUMN verification_token_expires INTEGER`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding verification_token_expires column:', err);
      } else {
        console.log('✓ Added verification_token_expires column');
      }
    });

    // Update existing users to have verified emails (for backward compatibility)
    db.run(`UPDATE users SET email_verified = 1 WHERE email_verified IS NULL OR email_verified = 0`, (err) => {
      if (err) {
        console.error('Error updating existing users:', err);
      } else {
        console.log('✓ Updated existing users to have verified emails');
      }
    });

    console.log('✅ Email verification migration completed!');
    process.exit(0);
  });
}

// Run migration
addEmailVerificationFields();
