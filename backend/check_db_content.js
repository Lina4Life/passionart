/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'passionart.db');
const db = new sqlite3.Database(dbPath);

console.log('📊 CHECKING DATABASE CONTENT...\n');

// Check users count
db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
  if (err) {
    console.log('❌ Error counting users:', err.message);
  } else {
    console.log('👥 Total Users in DB:', row.count);
  }
  
  // Check artworks count
  db.get('SELECT COUNT(*) as count FROM artworks', (err, row) => {
    if (err) {
      console.log('❌ Error counting artworks:', err.message);
    } else {
      console.log('🎨 Total Artworks in DB:', row.count);
    }
    
    // Check articles count
    db.get('SELECT COUNT(*) as count FROM articles', (err, row) => {
      if (err) {
        console.log('❌ Error counting articles:', err.message);
      } else {
        console.log('📝 Total Articles in DB:', row.count);
      }
      
      // Check orders count
      db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
        if (err) {
          console.log('❌ Error counting orders:', err.message);
        } else {
          console.log('🛒 Total Orders in DB:', row.count);
        }
        
        // Check recent users
        db.all('SELECT id, email, user_type, created_at FROM users ORDER BY created_at DESC LIMIT 5', (err, rows) => {
          if (err) {
            console.log('❌ Error getting recent users:', err.message);
          } else {
            console.log('\n📋 Recent Users:');
            rows.forEach(user => {
              console.log(`  - ID: ${user.id}, Email: ${user.email}, Type: ${user.user_type}, Created: ${user.created_at}`);
            });
          }
          
          // Check recent artworks
          db.all('SELECT id, title, user_id, status, price FROM artworks ORDER BY created_at DESC LIMIT 5', (err, rows) => {
            if (err) {
              console.log('❌ Error getting recent artworks:', err.message);
            } else {
              console.log('\n🎨 Recent Artworks:');
              rows.forEach(artwork => {
                console.log(`  - ID: ${artwork.id}, Title: ${artwork.title}, User: ${artwork.user_id}, Status: ${artwork.status}, Price: $${artwork.price}`);
              });
            }
            
            // Check orders with details
            db.all('SELECT o.id, o.total_amount, o.payment_status, u.email as buyer_email, a.title as artwork_title FROM orders o JOIN users u ON o.buyer_id = u.id JOIN artworks a ON o.artwork_id = a.id ORDER BY o.created_at DESC LIMIT 5', (err, rows) => {
              if (err) {
                console.log('❌ Error getting orders:', err.message);
              } else {
                console.log('\n🛒 Recent Orders:');
                rows.forEach(order => {
                  console.log(`  - Order ID: ${order.id}, Amount: $${order.total_amount}, Status: ${order.payment_status}, Buyer: ${order.buyer_email}, Artwork: ${order.artwork_title}`);
                });
              }
              
              console.log('\n✅ Database content check complete!');
              db.close();
            });
          });
        });
      });
    });
  });
});
