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

// Function to check existing orders table and add sample data
function checkAndPopulateOrders() {
  console.log('=== CHECKING EXISTING ORDERS TABLE ===\n');
  
  // Get table info
  db.all("PRAGMA table_info(orders)", (err, columns) => {
    if (err) {
      console.error('Error getting table info:', err);
      return;
    }
    
    if (columns.length === 0) {
      console.log('Orders table does not exist. Creating new one...');
      createNewOrdersTable();
    } else {
      console.log('Existing orders table structure:');
      columns.forEach(col => {
        console.log(`- ${col.name}: ${col.type}`);
      });
      
      // Check if table has data
      db.get("SELECT COUNT(*) as count FROM orders", (err, result) => {
        if (err) {
          console.error('Error counting orders:', err);
          return;
        }
        
        console.log(`\n📊 Current orders in table: ${result.count}`);
        
        if (result.count === 0) {
          addSampleOrders();
        } else {
          console.log('Orders table already has data. Showing existing orders...\n');
          showExistingOrders();
        }
      });
    }
  });
}

function createNewOrdersTable() {
  const createOrdersTable = `
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      product_title TEXT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(createOrdersTable, (err) => {
    if (err) {
      console.error('Error creating orders table:', err);
      return;
    }
    console.log('✅ New orders table created');
    addSampleOrders();
  });
}

function addSampleOrders() {
  console.log('\n=== ADDING SAMPLE ORDERS ===\n');
  
  const sampleOrders = [
    {
      customer_email: 'collector1@example.com',
      customer_name: 'Emma Rodriguez',
      product_title: 'Crimson Dreams',
      total_amount: 1200.00,
      status: 'completed'
    },
    {
      customer_email: 'artlover@gallery.com',
      customer_name: 'Marcus Thompson',
      product_title: 'Misty Mountain Morning',
      total_amount: 650.00,
      status: 'processing'
    },
    {
      customer_email: 'sophia.martinez@email.com',
      customer_name: 'Sophia Martinez',
      product_title: 'Neon Nights',
      total_amount: 1100.00,
      status: 'shipped'
    },
    {
      customer_email: 'james.parker@art.com',
      customer_name: 'James Parker',
      product_title: 'The Dreamer',
      total_amount: 750.00,
      status: 'pending'
    },
    {
      customer_email: 'isabella.chen@collector.net',
      customer_name: 'Isabella Chen',
      product_title: 'Colonialmente 01',
      total_amount: 1500.00,
      status: 'cancelled'
    },
    {
      customer_email: 'admin@passionart.com',
      customer_name: 'Gallery Purchase',
      product_title: 'Vintage Books and Tea',
      total_amount: 380.00,
      status: 'completed'
    },
    {
      customer_email: 'david.kim@modern.art',
      customer_name: 'David Kim',
      product_title: 'Urban Symphony',
      total_amount: 950.00,
      status: 'processing'
    },
    {
      customer_email: 'maria.garcia@studio.com',
      customer_name: 'Maria Garcia',
      product_title: 'Digital Age Reflection',
      total_amount: 980.00,
      status: 'completed'
    }
  ];
  
  let completed = 0;
  const total = sampleOrders.length;
  
  sampleOrders.forEach((order, index) => {
    const insertQuery = `
      INSERT INTO orders (customer_email, customer_name, product_title, total_amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'))
    `;
    
    const daysAgo = Math.floor(Math.random() * 30) + 1; // Random date within last 30 days
    
    db.run(insertQuery, [
      order.customer_email,
      order.customer_name,
      order.product_title,
      order.total_amount,
      order.status,
      daysAgo
    ], function(err) {
      if (err) {
        console.error(`❌ Error adding order for ${order.customer_name}:`, err);
      } else {
        console.log(`✅ Added order: ${order.product_title}`);
        console.log(`   Customer: ${order.customer_name}`);
        console.log(`   Amount: $${order.total_amount}`);
        console.log(`   Status: ${order.status}`);
        console.log('');
      }
      
      completed++;
      if (completed === total) {
        showOrdersSummary();
      }
    });
  });
}

function showExistingOrders() {
  db.all("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10", (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return;
    }
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.product_title || order.title || 'Unknown Product'}`);
      console.log(`   Customer: ${order.customer_name || order.customer_email || 'Unknown'}`);
      console.log(`   Amount: $${order.total_amount || order.amount || 0}`);
      console.log(`   Status: ${order.status || 'unknown'}`);
      console.log('');
    });
    
    showOrdersSummary();
  });
}

function showOrdersSummary() {
  console.log('=== ORDERS SUMMARY ===');
  db.all(`
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_revenue,
      status,
      COUNT(*) as status_count
    FROM orders
    GROUP BY status
  `, (err, statusGroups) => {
    if (err) {
      console.error('Error getting summary by status:', err);
    } else {
      let totalOrders = 0;
      let totalRevenue = 0;
      
      console.log('Status breakdown:');
      statusGroups.forEach(group => {
        console.log(`- ${group.status}: ${group.status_count} orders`);
        totalOrders += group.status_count;
        totalRevenue += parseFloat(group.total_revenue || 0);
      });
      
      console.log(`\n📊 Total Orders: ${totalOrders}`);
      console.log(`💰 Total Revenue: $${totalRevenue.toFixed(2)}`);
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('\n🛍️ Orders data ready for admin dashboard!');
      }
    });
  });
}

// Run the function
checkAndPopulateOrders();
