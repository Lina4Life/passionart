const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'data', 'passionart.db');

console.log('ðŸ” Checking for recent user registrations...');
console.log('=' .repeat(60));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('âŒ Error opening database:', err.message);
    return;
  }
  
  console.log('âœ… Connected to SQLite database');
  console.log('=' .repeat(60));
  
  // Get all users ordered by creation date
  db.all("SELECT * FROM users ORDER BY created_at DESC", [], (err, users) => {
    if (err) {
      console.error('âŒ Error fetching users:', err.message);
      return;
    }
    
    console.log(`ðŸ“‹ Total users in database: ${users.length}`);
    console.log('=' .repeat(60));
    
    users.forEach((user, index) => {
      console.log(`\nðŸ‘¤ User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Username: ${user.username || 'N/A'}`);
      console.log(`   Name: ${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`);
      console.log(`   User Type: ${user.user_type}`);
      console.log(`   Status: ${user.verification_status}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Updated: ${user.updated_at}`);
      
      // Check if password is hashed or plain text
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        console.log(`   Password: âœ… Properly hashed`);
      } else {
        console.log(`   Password: âš ï¸ Plain text (${user.password.substring(0, 10)}...)`);
      }
    });
    
    // Check for users created today
    const today = new Date().toISOString().split('T')[0];
    const todayUsers = users.filter(user => user.created_at.startsWith(today));
    
    console.log('\n' + '=' .repeat(60));
    console.log(`ðŸ“… Users created today (${today}): ${todayUsers.length}`);
    
    if (todayUsers.length > 0) {
      todayUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.first_name} ${user.last_name}) at ${user.created_at}`);
      });
    }
    
    // Check for users created in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recentUsers = users.filter(user => user.created_at > oneHourAgo);
    
    console.log(`\nâ° Users created in the last hour: ${recentUsers.length}`);
    
    if (recentUsers.length > 0) {
      recentUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.first_name} ${user.last_name}) at ${user.created_at}`);
      });
    } else {
      console.log('   No recent registrations found.');
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('âœ… User check complete!');
    db.close();
  });
});

