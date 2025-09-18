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

// Function to create orders table if it doesn't exist and add sample orders
function createAndPopulateOrders() {
  console.log('=== CREATING ORDERS SYSTEM ===\n');
  
  // First, create orders table if it doesn't exist
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      artwork_id INTEGER NOT NULL,
      artwork_title TEXT NOT NULL,
      artist_name TEXT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
      payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
      payment_method TEXT DEFAULT 'credit_card',
      shipping_address TEXT,
      billing_address TEXT,
      tracking_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      shipped_at DATETIME,
      delivered_at DATETIME,
      FOREIGN KEY (artwork_id) REFERENCES artworks(id),
      FOREIGN KEY (customer_id) REFERENCES users(id)
    )
  `;
  
  db.run(createOrdersTable, (err) => {
    if (err) {
      console.error('Error creating orders table:', err);
      return;
    }
    console.log('âœ… Orders table created/verified');
    
    // Sample orders data
    const sampleOrders = [
      {
        order_number: 'ORD-2025-001',
        customer_email: 'collector1@example.com',
        customer_name: 'Emma Rodriguez',
        artwork_id: 10, // Crimson Dreams
        artwork_title: 'Crimson Dreams',
        artist_name: 'Admin User',
        total_amount: 1200.00,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'credit_card',
        shipping_address: '123 Art Street, New York, NY 10001',
        billing_address: '123 Art Street, New York, NY 10001',
        tracking_number: 'TRK123456789',
        notes: 'Customer requested special packaging',
        created_at: '2025-09-01 10:30:00',
        shipped_at: '2025-09-02 14:20:00',
        delivered_at: '2025-09-05 16:45:00'
      },
      {
        order_number: 'ORD-2025-002',
        customer_email: 'artlover@gallery.com',
        customer_name: 'Marcus Thompson',
        artwork_id: 25, // Misty Mountain Morning
        artwork_title: 'Misty Mountain Morning',
        artist_name: 'Youssef Mohamed Ali',
        total_amount: 650.00,
        status: 'shipped',
        payment_status: 'paid',
        payment_method: 'paypal',
        shipping_address: '456 Gallery Ave, Los Angeles, CA 90210',
        billing_address: '456 Gallery Ave, Los Angeles, CA 90210',
        tracking_number: 'TRK987654321',
        notes: 'Corporate purchase for office display',
        created_at: '2025-09-03 09:15:00',
        shipped_at: '2025-09-04 11:30:00'
      },
      {
        order_number: 'ORD-2025-003',
        customer_email: 'sophia.martinez@email.com',
        customer_name: 'Sophia Martinez',
        artwork_id: 28, // Neon Nights
        artwork_title: 'Neon Nights',
        artist_name: 'Sophia Martinez',
        total_amount: 1100.00,
        status: 'processing',
        payment_status: 'paid',
        payment_method: 'bank_transfer',
        shipping_address: '789 Modern St, Miami, FL 33101',
        billing_address: '789 Modern St, Miami, FL 33101',
        notes: 'Rush order - customer birthday gift',
        created_at: '2025-09-05 14:20:00'
      },
      {
        order_number: 'ORD-2025-004',
        customer_email: 'james.parker@art.com',
        customer_name: 'James Parker',
        artwork_id: 21, // The Dreamer
        artwork_title: 'The Dreamer',
        artist_name: 'James Parker',
        total_amount: 750.00,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'credit_card',
        shipping_address: '321 Artist Blvd, Chicago, IL 60601',
        billing_address: '321 Artist Blvd, Chicago, IL 60601',
        notes: 'Payment authorization pending',
        created_at: '2025-09-06 16:45:00'
      },
      {
        order_number: 'ORD-2025-005',
        customer_email: 'isabella.chen@collector.net',
        customer_name: 'Isabella Chen',
        artwork_id: 30, // Colonialmente 01
        artwork_title: 'Colonialmente 01',
        artist_name: 'Dede Ribeiro',
        total_amount: 1500.00,
        status: 'cancelled',
        payment_status: 'refunded',
        payment_method: 'credit_card',
        shipping_address: '654 Collector Ave, San Francisco, CA 94102',
        billing_address: '654 Collector Ave, San Francisco, CA 94102',
        notes: 'Customer requested cancellation due to size concerns',
        created_at: '2025-09-04 11:10:00'
      },
      {
        order_number: 'ORD-2025-006',
        customer_email: 'admin@passionart.com',
        customer_name: 'Gallery Purchase',
        artwork_id: 27, // Vintage Books and Tea
        artwork_title: 'Vintage Books and Tea',
        artist_name: 'Youssef Mohamed Ali',
        total_amount: 380.00,
        status: 'delivered',
        payment_status: 'paid',
        payment_method: 'internal',
        shipping_address: 'PassionArt Gallery, 999 Art District, Portland, OR 97201',
        billing_address: 'PassionArt Gallery, 999 Art District, Portland, OR 97201',
        tracking_number: 'TRK555666777',
        notes: 'Internal purchase for gallery permanent collection',
        created_at: '2025-08-28 13:00:00',
        shipped_at: '2025-08-29 10:00:00',
        delivered_at: '2025-08-30 15:30:00'
      }
    ];
    
    console.log('Adding sample orders...\n');
    
    let completed = 0;
    const total = sampleOrders.length;
    
    sampleOrders.forEach((order, index) => {
      const insertQuery = `
        INSERT INTO orders (
          order_number, customer_email, customer_name, artwork_id, artwork_title, 
          artist_name, total_amount, status, payment_status, payment_method,
          shipping_address, billing_address, tracking_number, notes, created_at,
          shipped_at, delivered_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `;
      
      db.run(insertQuery, [
        order.order_number,
        order.customer_email,
        order.customer_name,
        order.artwork_id,
        order.artwork_title,
        order.artist_name,
        order.total_amount,
        order.status,
        order.payment_status,
        order.payment_method,
        order.shipping_address,
        order.billing_address,
        order.tracking_number,
        order.notes,
        order.created_at,
        order.shipped_at,
        order.delivered_at
      ], function(err) {
        if (err) {
          console.error(`âŒ Error adding order ${order.order_number}:`, err);
        } else {
          console.log(`âœ… Added order: ${order.order_number}`);
          console.log(`   Customer: ${order.customer_name}`);
          console.log(`   Artwork: ${order.artwork_title}`);
          console.log(`   Amount: $${order.total_amount}`);
          console.log(`   Status: ${order.status}`);
          console.log('');
        }
        
        completed++;
        if (completed === total) {
          // Verify orders were added
          console.log('=== ORDERS SUMMARY ===');
          db.all(`
            SELECT 
              COUNT(*) as total_orders,
              COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
              COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
              COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped,
              COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
              COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
              SUM(total_amount) as total_revenue
            FROM orders
          `, (err, summary) => {
            if (err) {
              console.error('Error getting summary:', err);
            } else {
              const stats = summary[0];
              console.log(`ðŸ“Š Total Orders: ${stats.total_orders}`);
              console.log(`â³ Pending: ${stats.pending}`);
              console.log(`âš™ï¸ Processing: ${stats.processing}`);
              console.log(`ðŸšš Shipped: ${stats.shipped}`);
              console.log(`âœ… Delivered: ${stats.delivered}`);
              console.log(`âŒ Cancelled: ${stats.cancelled}`);
              console.log(`ðŸ’° Total Revenue: $${stats.total_revenue}`);
            }
            
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
              } else {
                console.log('\nðŸ›ï¸ Orders system created successfully!');
                console.log('Admin can now manage orders through the dashboard.');
              }
            });
          });
        }
      });
    });
  });
}

// Run the function
createAndPopulateOrders();

