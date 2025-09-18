const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'config', 'database.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT id, email, username, name FROM users WHERE id IN (34, 26, 3, 4, 5)', (err, rows) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Artist details:');
  rows.forEach(row => {
    console.log(`ID: ${row.id}, Email: ${row.email}, Username: ${row.username || 'N/A'}, Name: ${row.name || 'N/A'}`);
  });
  db.close();
});

