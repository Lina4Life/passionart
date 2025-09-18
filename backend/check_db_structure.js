const db = require('./config/database.js');

console.log('Checking users table structure...');

db.all("PRAGMA table_info(users)", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Users table structure:', rows);
  }
  
  // Also check a sample user
  db.get("SELECT * FROM users LIMIT 1", (err, user) => {
    if (err) {
      console.error('Error getting user:', err);
    } else {
      console.log('Sample user:', user);
    }
    db.close();
  });
});

