/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const db = require('./config/database');

const insertQuery = `INSERT INTO orders (buyer_id, artwork_id, total_amount, payment_status, payment_intent_id, shipping_address, created_at, updated_at) 
VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;

const orderData = [
  3, // buyer_id (Youssef Mohamed Ali)
  2, // artwork_id (Digital Horizons) 
  800, // total_amount
  'pending', // payment_status
  'pi_pending_test_order_123', // payment_intent_id
  '42 Artist Lane, Los Angeles, CA 90210, USA' // shipping_address
];

db.run(insertQuery, orderData, function(err) {
  if (err) {
    console.error('Error inserting order:', err);
  } else {
    console.log('✅ Successfully added pending order with ID:', this.lastID);
    console.log('Order details:');
    console.log('- Buyer: Youssef Mohamed Ali (ID: 3)');
    console.log('- Artwork: Digital Horizons (ID: 2)');
    console.log('- Amount: $800');
    console.log('- Status: pending');
    console.log('- Address: 42 Artist Lane, Los Angeles, CA 90210, USA');
  }
  process.exit();
});
