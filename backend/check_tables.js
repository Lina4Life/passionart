const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'config/database.db');
const db = new sqlite3.Database(dbPath);

// List all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Database tables:');
    rows.forEach(row => console.log('- ' + row.name));
    
    // Check artworks table schema if it exists
    const artworksTable = rows.find(row => row.name === 'artworks' || row.name === 'products');
    if (artworksTable) {
      console.log(`\nSchema for ${artworksTable.name} table:`);
      db.all(`PRAGMA table_info(${artworksTable.name})`, (err, schema) => {
        if (err) {
          console.error('Schema error:', err);
        } else {
          schema.forEach(col => {
            console.log(`  ${col.name}: ${col.type}`);
          });
        }
        db.close();
      });
    } else {
      console.log('\nNo artworks/products table found');
      db.close();
    }
  }
});

