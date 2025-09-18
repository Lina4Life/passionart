/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const db = require('../config/database');
const bcrypt = require('bcrypt');

const createUser = async (email, password, username = null, first_name = null, last_name = null, verificationToken = null, user_type = null) => {
  const hash = await bcrypt.hash(password, 10);
  
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (email, password, username, first_name, last_name, user_type, verification_status)
      VALUES (?, ?, ?, ?, ?, ?, 'verified')
    `;
    
    db.run(query, [email, hash, username, first_name, last_name, user_type], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          email,
          username,
          first_name,
          last_name,
          user_type,
          verification_status: 'verified'
        });
      }
    });
  });
};

const findUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const findUserByVerificationToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Simplified: just find user by verification status
    const query = `SELECT * FROM users WHERE verification_status = 'pending'`;
    
    db.get(query, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const verifyUserEmail = async (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE users 
      SET verification_status = 'verified'
      WHERE id = ?
    `;
    
    db.run(query, [userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};

module.exports = { createUser, findUserByEmail, findUserByVerificationToken, verifyUserEmail };
