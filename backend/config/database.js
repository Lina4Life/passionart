const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, '..', 'data', 'passionart.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    console.log('ðŸš€ Database connection ready');
  }
});

// Temporarily simplified initialization
function initializeDatabase() {
  console.log('Database initialization temporarily disabled for testing');
  
  // Add theme_preference column if it doesn't exist
  db.run(`ALTER TABLE users ADD COLUMN theme_preference TEXT DEFAULT 'light'`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding theme_preference column:', err);
    } else if (!err) {
      console.log('Added theme_preference column to users table');
    }
  });
}

function insertSampleData() {
  console.log('Starting sample data insertion...');
  
  // Check if data already exists
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error('Error checking users:', err);
      return;
    }
    
    console.log('Current user count:', row.count);
    
    if (row.count === 0) {
      console.log('Inserting sample users...');
      
      // Insert admin user with the correct columns that exist in the table
      db.run(`INSERT INTO users (username, email, password, first_name, last_name, user_type, verification_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`, 
              ['admin', 'admin@passionart.com', 'admin123', 'Admin', 'User', 'admin', 'verified'], 
              function(err) {
        if (err) {
          console.error('Error inserting admin user:', err);
          console.error('Error details:', err.message);
        } else {
          console.log('âœ… Admin user inserted successfully with ID:', this.lastID);
          
          // Insert a default chat group after user is created
          db.run(`INSERT INTO chat_groups (name, description, is_private, created_by) 
                  VALUES (?, ?, ?, ?)`,
                  ['General Chat', 'Main community chat room for all members', 0, this.lastID],
                  function(err) {
            if (err) {
              console.error('Error inserting chat group:', err);
            } else {
              console.log('âœ… Default chat group created with ID:', this.lastID);
            }
          });
        }
      });
    } else {
      console.log('Sample data already exists, skipping insertion');
    }
  });
}

module.exports = db;

