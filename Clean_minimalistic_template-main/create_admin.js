/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
// Create default admin account
// Run this script after setting up the database: node create_admin.js

const bcrypt = require('bcrypt');
const pool = require('./backend/config/db');

async function createAdminAccount() {
  try {
    console.log('🔄 Creating default admin account...');
    
    // Admin credentials
    const adminEmail = 'admin@passionart.com';
    const adminPassword = 'admin123'; // Change this to something secure
    
    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin account already exists!');
      console.log(`Email: ${adminEmail}`);
      console.log('Use existing credentials or delete the account first.');
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create admin user
    const adminUser = await pool.query(
      `INSERT INTO users (email, password, user_type, is_active, is_verified) 
       VALUES ($1, $2, 'admin', true, true) 
       RETURNING id, email`,
      [adminEmail, hashedPassword]
    );
    
    // Create admin profile
    await pool.query(
      `INSERT INTO user_profiles (user_id, first_name, last_name) 
       VALUES ($1, 'Admin', 'User')`,
      [adminUser.rows[0].id]
    );
    
    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');
    console.log('🎯 Admin Features:');
    console.log('- Access to Management Dashboard');
    console.log('- User account management');
    console.log('- Product/artwork management');
    console.log('- Article management');
    console.log('- Order management');
    console.log('- Analytics and reports');
    
  } catch (error) {
    console.error('❌ Failed to create admin account:', error.message);
    
    if (error.code === '23505') {
      console.log('Email already exists in database.');
    } else {
      console.log('Make sure your database is set up and running.');
    }
  } finally {
    await pool.end();
  }
}

createAdminAccount();
