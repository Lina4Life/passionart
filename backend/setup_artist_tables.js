const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, 'data', 'passionart.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath);

function checkAndCreateTables() {
  return new Promise((resolve, reject) => {
    console.log('Checking database tables...');
    
    // Check if user_follows table exists
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='user_follows'`, (err, row) => {
      if (err) {
        console.error('Error checking table:', err);
        reject(err);
        return;
      }
      
      if (!row) {
        console.log('Creating user_follows table...');
        db.run(`
          CREATE TABLE user_follows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            follower_id INTEGER NOT NULL,
            following_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(follower_id, following_id),
            FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) {
            console.error('Error creating user_follows table:', err);
            reject(err);
            return;
          }
          
          // Create indexes
          db.run(`CREATE INDEX idx_user_follows_follower ON user_follows(follower_id)`, (err) => {
            if (err) console.error('Error creating follower index:', err);
          });
          
          db.run(`CREATE INDEX idx_user_follows_following ON user_follows(following_id)`, (err) => {
            if (err) console.error('Error creating following index:', err);
          });
          
          console.log('user_follows table created successfully!');
          checkUsernameColumn();
        });
      } else {
        console.log('user_follows table already exists.');
        checkUsernameColumn();
      }
    });
    
    function checkUsernameColumn() {
      // Check if username column exists in users table
      db.all(`PRAGMA table_info(users)`, (err, columns) => {
        if (err) {
          console.error('Error checking users table:', err);
          reject(err);
          return;
        }
        
        const hasUsername = columns.some(col => col.name === 'username');
        
        if (!hasUsername) {
          console.log('Adding username column to users table...');
          db.run(`ALTER TABLE users ADD COLUMN username TEXT UNIQUE`, (err) => {
            if (err) {
              console.error('Error adding username column:', err);
              reject(err);
              return;
            }
            console.log('username column added successfully!');
            resolve();
          });
        } else {
          console.log('username column already exists.');
          resolve();
        }
      });
    }
  });
}

checkAndCreateTables()
  .then(() => {
    console.log('Database setup complete!');
    db.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting up database:', error);
    db.close();
    process.exit(1);
  });

