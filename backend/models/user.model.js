const db = require('../config/database');
const bcrypt = require('bcrypt');

const createUser = async (email, password, username = null, first_name = null, last_name = null, verificationToken = null) => {
  const hash = await bcrypt.hash(password, 10);
  const tokenExpires = verificationToken ? Date.now() + 24 * 60 * 60 * 1000 : null; // 24 hours
  
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (email, password, username, first_name, last_name, verification_status, email_verified, verification_token, verification_token_expires)
      VALUES (?, ?, ?, ?, ?, 'pending', 0, ?, ?)
    `;
    
    db.run(query, [email, hash, username, first_name, last_name, verificationToken, tokenExpires], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          email,
          username,
          first_name,
          last_name,
          email_verified: 0,
          verification_token: verificationToken
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
    const query = `
      SELECT * FROM users 
      WHERE verification_token = ? AND verification_token_expires > ?
    `;
    
    db.get(query, [token, Date.now()], (err, row) => {
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
      SET email_verified = 1, verification_status = 'verified', verification_token = NULL, verification_token_expires = NULL 
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
