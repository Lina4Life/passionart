const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'passionart.db');
const db = new sqlite3.Database(dbPath);

console.log('ðŸ” Running diagnostic queries...\n');

// Check for any users with invalid data
db.all(`SELECT id, email, verification_status, is_active FROM users WHERE email IS NULL OR email = ''`, (err, rows) => {
  if (err) {
    console.log('âŒ Error checking users:', err.message);
  } else {
    console.log('ðŸ‘¥ Users with invalid emails:', rows.length > 0 ? rows : 'None found');
  }
  
  // Check for artworks without required fields
  db.all(`SELECT id, title, user_id, status FROM artworks WHERE title IS NULL OR title = '' OR user_id IS NULL`, (err, rows) => {
    if (err) {
      console.log('âŒ Error checking artworks:', err.message);
    } else {
      console.log('ðŸŽ¨ Artworks with missing required fields:', rows.length > 0 ? rows : 'None found');
    }
    
    // Check feedback table integrity
    db.all(`SELECT id, user_email, issue, feedback, status FROM feedback WHERE user_email IS NULL OR issue IS NULL OR feedback IS NULL`, (err, rows) => {
      if (err) {
        console.log('âŒ Error checking feedback:', err.message);
      } else {
        console.log('ðŸ’¬ Feedback entries with missing required fields:', rows.length > 0 ? rows : 'None found');
      }
      
      // Check for any foreign key violations in orders
      db.all(`SELECT o.id, o.buyer_id, o.artwork_id, u.email as buyer_email, a.title as artwork_title 
              FROM orders o 
              LEFT JOIN users u ON o.buyer_id = u.id 
              LEFT JOIN artworks a ON o.artwork_id = a.id 
              WHERE u.id IS NULL OR a.id IS NULL`, (err, rows) => {
        if (err) {
          console.log('âŒ Error checking orders:', err.message);
        } else {
          console.log('ðŸ›’ Orders with invalid references:', rows.length > 0 ? rows : 'None found');
        }
        
        // Check database file size and tables
        db.all(`PRAGMA integrity_check`, (err, rows) => {
          if (err) {
            console.log('âŒ Error running integrity check:', err.message);
          } else {
            console.log('ðŸ” Database integrity check:', rows[0]['integrity_check']);
          }
          
          console.log('\nâœ… Database diagnostic complete!');
          db.close();
        });
      });
    });
  });
});

