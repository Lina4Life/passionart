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

// Function to add sample orders using existing schema
function addSampleOrdersToExistingTable() {
  console.log('=== ADDING SAMPLE ORDERS TO EXISTING TABLE ===\n');
  
  // Existing schema: id, buyer_id, artwork_id, total_amount, payment_status, payment_intent_id, shipping_address, created_at, updated_at
  
  // First, let's get some user IDs and artwork IDs to use
  db.all(`
    SELECT u.id as user_id, u.username, u.email, a.id as artwork_id, a.title, a.price
    FROM users u, artworks a
    WHERE u.user_type != 'admin' AND a.status = 'active'
    ORDER BY RANDOM()
    LIMIT 10
  `, (err, userArtworkPairs) => {
    if (err) {
      console.error('Error getting user-artwork pairs:', err);
      return;
    }
    
    if (userArtworkPairs.length === 0) {
      console.log('No users or artworks found for creating orders');
      return;
    }
    
    console.log('Available user-artwork pairs:');
    userArtworkPairs.forEach((pair, index) => {
      console.log(`${index + 1}. ${pair.username} (${pair.email}) -> ${pair.title} ($${pair.price})`);
    });
    
    console.log('\nCreating sample orders...\n');
    
    const sampleOrders = [
      {
        buyer_id: userArtworkPairs[0]?.user_id || 2,
        artwork_id: userArtworkPairs[0]?.artwork_id || 10,
        total_amount: userArtworkPairs[0]?.price || 1200.00,
        payment_status: 'paid',
        payment_intent_id: 'pi_3GsGSYKK8K8K8K8K0K8K8K8K',
        shipping_address: '123 Art Street, New York, NY 10001, USA'
      },
      {
        buyer_id: userArtworkPairs[1]?.user_id || 3,
        artwork_id: userArtworkPairs[1]?.artwork_id || 25,
        total_amount: userArtworkPairs[1]?.price || 650.00,
        payment_status: 'paid',
        payment_intent_id: 'pi_3GsGSYKK8K8K8K8K1K8K8K8K',
        shipping_address: '456 Gallery Ave, Los Angeles, CA 90210, USA'
      },
      {
        buyer_id: userArtworkPairs[2]?.user_id || 4,
        artwork_id: userArtworkPairs[2]?.artwork_id || 28,
        total_amount: userArtworkPairs[2]?.price || 1100.00,
        payment_status: 'pending',
        payment_intent_id: 'pi_3GsGSYKK8K8K8K8K2K8K8K8K',
        shipping_address: '789 Modern St, Miami, FL 33101, USA'
      },
      {
        buyer_id: userArtworkPairs[3]?.user_id || 5,
        artwork_id: userArtworkPairs[3]?.artwork_id || 21,
        total_amount: userArtworkPairs[3]?.price || 750.00,
        payment_status: 'paid',
        payment_intent_id: 'pi_3GsGSYKK8K8K8K8K3K8K8K8K',
        shipping_address: '321 Artist Blvd, Chicago, IL 60601, USA'
      },
      {
        buyer_id: userArtworkPairs[4]?.user_id || 6,
        artwork_id: userArtworkPairs[4]?.artwork_id || 30,
        total_amount: userArtworkPairs[4]?.price || 1500.00,
        payment_status: 'failed',
        payment_intent_id: 'pi_3GsGSYKK8K8K8K8K4K8K8K8K',
        shipping_address: '654 Collector Ave, San Francisco, CA 94102, USA'
      },
      {
        buyer_id: userArtworkPairs[5]?.user_id || 7,
        artwork_id: userArtworkPairs[5]?.artwork_id || 27,
        total_amount: userArtworkPairs[5]?.price || 380.00,
        payment_status: 'paid',
        payment_intent_id: 'pi_3GsGSYKK8K8K8K8K5K8K8K8K',
        shipping_address: '999 Art District, Portland, OR 97201, USA'
      }
    ];
    
    let completed = 0;
    const total = sampleOrders.length;
    
    sampleOrders.forEach((order, index) => {
      const insertQuery = `
        INSERT INTO orders (
          buyer_id, artwork_id, total_amount, payment_status, 
          payment_intent_id, shipping_address, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'), datetime('now'))
      `;
      
      const daysAgo = Math.floor(Math.random() * 30) + 1; // Random date within last 30 days
      
      db.run(insertQuery, [
        order.buyer_id,
        order.artwork_id,
        order.total_amount,
        order.payment_status,
        order.payment_intent_id,
        order.shipping_address,
        daysAgo
      ], function(err) {
        if (err) {
          console.error(`❌ Error adding order ${index + 1}:`, err);
        } else {
          console.log(`✅ Added order #${this.lastID}`);
          console.log(`   Buyer ID: ${order.buyer_id}`);
          console.log(`   Artwork ID: ${order.artwork_id}`);
          console.log(`   Amount: $${order.total_amount}`);
          console.log(`   Payment: ${order.payment_status}`);
          console.log('');
        }
        
        completed++;
        if (completed === total) {
          showOrdersWithDetails();
        }
      });
    });
  });
}

function showOrdersWithDetails() {
  console.log('=== ORDERS WITH CUSTOMER AND ARTWORK DETAILS ===\n');
  
  const query = `
    SELECT 
      o.id,
      o.total_amount,
      o.payment_status,
      o.created_at,
      u.username as buyer_name,
      u.email as buyer_email,
      a.title as artwork_title,
      a.price as artwork_price
    FROM orders o
    LEFT JOIN users u ON o.buyer_id = u.id
    LEFT JOIN artworks a ON o.artwork_id = a.id
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, (err, orders) => {
    if (err) {
      console.error('Error fetching orders with details:', err);
      return;
    }
    
    if (orders.length === 0) {
      console.log('No orders found');
    } else {
      console.log(`Found ${orders.length} orders:\n`);
      
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order #${order.id}`);
        console.log(`   Customer: ${order.buyer_name || 'Unknown'} (${order.buyer_email || 'No email'})`);
        console.log(`   Artwork: ${order.artwork_title || 'Unknown artwork'}`);
        console.log(`   Amount: $${order.total_amount}`);
        console.log(`   Payment: ${order.payment_status}`);
        console.log(`   Date: ${order.created_at}`);
        console.log('');
      });
      
      // Summary
      const summary = orders.reduce((acc, order) => {
        acc.total += parseFloat(order.total_amount);
        acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
        return acc;
      }, { total: 0 });
      
      console.log('=== SUMMARY ===');
      console.log(`📊 Total Orders: ${orders.length}`);
      console.log(`💰 Total Revenue: $${summary.total.toFixed(2)}`);
      console.log('Payment Status Breakdown:');
      Object.keys(summary).forEach(key => {
        if (key !== 'total') {
          console.log(`- ${key}: ${summary[key]} orders`);
        }
      });
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('\n🛍️ Orders system ready for admin dashboard!');
        console.log('The admin can now view and manage orders through the interface.');
      }
    });
  });
}

// Run the function
addSampleOrdersToExistingTable();
