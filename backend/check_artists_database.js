const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use absolute path to database
const dbPath = path.join(__dirname, 'data', 'passionart.db');
console.log('Connecting to database at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database successfully');
});

// Check what tables exist
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.error('Error fetching tables:', err.message);
    return;
  }
  
  console.log('\n=== AVAILABLE TABLES ===');
  tables.forEach(table => {
    console.log(`- ${table.name}`);
  });
  
  // Check users table structure
  db.all("PRAGMA table_info(users)", [], (err, columns) => {
    if (err) {
      console.error('Error getting table info:', err.message);
      return;
    }
    
    console.log('\n=== USERS TABLE STRUCTURE ===');
    columns.forEach(col => {
      console.log(`${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check user types distribution
    db.all("SELECT user_type, COUNT(*) as count FROM users GROUP BY user_type", [], (err, types) => {
      if (err) {
        console.error('Error getting user types:', err.message);
        return;
      }
      
      console.log('\n=== USER TYPES DISTRIBUTION ===');
      types.forEach(type => {
        console.log(`${type.user_type}: ${type.count} users`);
      });
      
      // Get all artists
      db.all("SELECT id, username, first_name, last_name, user_type FROM users WHERE user_type = 'artist'", [], (err, artists) => {
        if (err) {
          console.error('Error fetching artists:', err.message);
          return;
        }
        
        console.log('\n=== ARTISTS IN DATABASE ===');
        console.log(`Found ${artists.length} artists:`);
        artists.forEach(artist => {
          console.log(`- ID: ${artist.id}, Username: ${artist.username}, Name: ${artist.first_name} ${artist.last_name}`);
        });
        
        // Get total user count
        db.get("SELECT COUNT(*) as total FROM users", [], (err, result) => {
          if (err) {
            console.error('Error getting total users:', err.message);
            return;
          }
          
          console.log(`\n=== SUMMARY ===`);
          console.log(`Total users: ${result.total}`);
          console.log(`Artists: ${artists.length}`);
          
          db.close();
        });
      });
    });
  });
});

