const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'passionart', 'passionart.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  
  console.log('✅ Connected to SQLite database');
  
  // Add social_media column
  db.run('ALTER TABLE users ADD COLUMN social_media TEXT', (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('ℹ️ social_media column already exists');
      } else {
        console.error('Error adding social_media column:', err);
      }
    } else {
      console.log('✅ Successfully added social_media column');
    }
    
    // Add bio and profile_picture columns if they don't exist
    db.run('ALTER TABLE users ADD COLUMN bio TEXT', (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding bio column:', err);
      } else if (!err) {
        console.log('✅ Successfully added bio column');
      }
    });
    
    db.run('ALTER TABLE users ADD COLUMN profile_picture TEXT', (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding profile_picture column:', err);
      } else if (!err) {
        console.log('✅ Successfully added profile_picture column');
      }
      
      // Update some artists with sample social media data
      const sampleSocialMedia = JSON.stringify({
        instagram: 'https://instagram.com/artist_profile',
        twitter: 'https://twitter.com/artist_handle',
        facebook: 'https://facebook.com/artist.page',
        website: 'https://artistwebsite.com'
      });
      
      db.run(
        "UPDATE users SET social_media = ? WHERE user_type = 'artist' AND id = (SELECT id FROM users WHERE user_type = 'artist' LIMIT 1)",
        [sampleSocialMedia],
        (err) => {
          if (err) {
            console.error('Error updating sample social media:', err);
          } else {
            console.log('✅ Added sample social media data to first artist');
          }
          
          // Verify the changes
          db.all('PRAGMA table_info(users)', (err, rows) => {
            if (err) {
              console.error('Error getting updated table info:', err);
            } else {
              console.log('\n📋 Updated Users table schema:');
              rows.forEach(row => {
                if (['social_media', 'bio', 'profile_picture'].includes(row.name)) {
                  console.log(`✅ ${row.name} (${row.type})`);
                }
              });
            }
            
            db.close();
          });
        }
      );
    });
  });
});
