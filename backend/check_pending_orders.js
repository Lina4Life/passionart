const db = require('./config/database');

const query = `SELECT o.*, u.first_name, u.last_name, u.email, a.title as artwork_title 
FROM orders o 
LEFT JOIN users u ON o.buyer_id = u.id 
LEFT JOIN artworks a ON o.artwork_id = a.id 
WHERE o.payment_status = 'pending' 
ORDER BY o.created_at DESC`;

db.all(query, (err, orders) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('âœ… Pending orders found:');
    console.table(orders);
  }
  process.exit();
});

