const Database = require('better-sqlite3');
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'data', 'passionart.db');
const db = new Database(dbPath);

try {
  // Check existing users
  console.log('\nExisting users:');
  const users = db.prepare('SELECT id, email, username, email_verified FROM users').all();
  console.log(users);

  // Update the specific user to be verified for testing
  const email = 'youssefelgharib03@gmail.com';
  
  console.log(`\nUpdating verification status for ${email}...`);
  const result = db.prepare('UPDATE users SET email_verified = 1 WHERE email = ?').run(email);
  
  if (result.changes > 0) {
    console.log(`âœ… Successfully verified ${email}`);
    
    // Show updated user
    const updatedUser = db.prepare('SELECT id, email, username, email_verified FROM users WHERE email = ?').get(email);
    console.log('Updated user:', updatedUser);
  } else {
    console.log(`âŒ No user found with email ${email}`);
  }

} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
  console.log('\nDatabase connection closed.');
}

