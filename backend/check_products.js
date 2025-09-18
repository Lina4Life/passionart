const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'passionart.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking existing products in database...\n');

db.all("SELECT id, title, artist, price, category, status, created_at FROM artworks ORDER BY created_at DESC", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`Found ${rows.length} products:\n`);
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title} by ${row.artist}`);
      console.log(`   Status: ${row.status} | Price: $${row.price} | Category: ${row.category}`);
      console.log(`   Created: ${row.created_at}`);
      console.log(`   ID: ${row.id}\n`);
    });
    
    if (rows.length === 0) {
      console.log('No products found. You can add products through the admin panel.');
    }
  }
  
  db.close();
});

