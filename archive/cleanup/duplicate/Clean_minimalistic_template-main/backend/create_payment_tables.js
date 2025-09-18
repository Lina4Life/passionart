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

// Create payments and purchase_history tables
const createTables = [
  `CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    artwork_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'pending_admin',
    stripe_payment_intent_id VARCHAR(255),
    admin_approved_by INTEGER,
    admin_approved_at DATETIME,
    transferred_to_artist_at DATETIME,
    platform_commission DECIMAL(10,2),
    artist_earnings DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id),
    FOREIGN KEY (admin_approved_by) REFERENCES users(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS purchase_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    artwork_id INTEGER NOT NULL,
    artwork_title VARCHAR(255),
    artist_name VARCHAR(255),
    artwork_medium VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (artwork_id) REFERENCES artworks(id)
  )`,
  
  `CREATE TABLE IF NOT EXISTS email_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
];

async function createPaymentTables() {
  for (const query of createTables) {
    try {
      await new Promise((resolve, reject) => {
        db.run(query, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log('Table created successfully');
    } catch (error) {
      console.log('Table creation error (might already exist):', error.message);
    }
  }
  
  db.close();
  console.log('Payment system tables created successfully!');
}

createPaymentTables();
