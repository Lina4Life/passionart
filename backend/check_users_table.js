const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const usersDbPath = path.join(__dirname, 'data', 'passionart.db');
const db = new sqlite3.Database(usersDbPath);

console.log('Checking users table structure...');

db.all("PRAGMA table_info(users)", (err, columns) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Users table columns:');
  columns.forEach(col => {
    console.log(`- ${col.name}: ${col.type}`);
  });
  
  // Also get a sample user to see the data
  db.all('SELECT * FROM users LIMIT 3', (err, rows) => {
    if (err) {
      console.error('Error getting sample users:', err);
    } else {
      console.log('\nSample users:');
      rows.forEach(user => {
        console.log(JSON.stringify(user, null, 2));
      });
    }
    db.close();
  });
});

