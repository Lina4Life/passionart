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

// Check current user types and table structure
function checkCurrentUserTypes() {
  console.log('=== CHECKING CURRENT USER TYPES ===\n');
  
  // Check table structure
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
      console.error('Error fetching users table info:', err);
      return;
    }
    
    console.log('Users table structure:');
    rows.forEach(row => {
      console.log(`- ${row.name}: ${row.type} ${row.notnull ? '(NOT NULL)' : ''}`);
    });
    
    // Check current user types in use
    db.all("SELECT DISTINCT user_type FROM users WHERE user_type IS NOT NULL ORDER BY user_type", (err, userTypeRows) => {
      if (err) {
        console.error('Error fetching user types:', err);
      } else {
        console.log('\n=== CURRENT USER TYPES IN DATABASE ===');
        if (userTypeRows.length === 0) {
          console.log('No user types found');
        } else {
          userTypeRows.forEach(row => {
            console.log(`- ${row.user_type}`);
          });
        }
      }
      
      // Check user count by type
      db.all("SELECT user_type, COUNT(*) as count FROM users GROUP BY user_type ORDER BY user_type", (err, countRows) => {
        if (err) {
          console.error('Error counting users by type:', err);
        } else {
          console.log('\n=== USER COUNT BY TYPE ===');
          countRows.forEach(row => {
            console.log(`- ${row.user_type}: ${row.count} users`);
          });
        }
        
        db.close();
      });
    });
  });
}

// Run the function
checkCurrentUserTypes();

