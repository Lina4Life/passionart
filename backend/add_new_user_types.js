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

// Sample collector users
const collectorUsers = [
  {
    email: 'collector1@example.com',
    password: '$2b$10$hashedpassword1', // This should be properly hashed in real app
    username: 'artcollector_sophie',
    first_name: 'Sophie',
    last_name: 'Martinez',
    user_type: 'collector',
    bio: 'Contemporary art collector with a passion for emerging digital artists and mixed media works.',
    website: 'https://sophiemartinez-collection.com',
    verification_status: 'verified',
    is_active: 1
  },
  {
    email: 'collector2@example.com',
    password: '$2b$10$hashedpassword2',
    username: 'modernart_james',
    first_name: 'James',
    last_name: 'Wellington',
    user_type: 'collector',
    bio: 'Private collector specializing in modern abstract paintings and sculptural works.',
    website: 'https://wellington-collection.art',
    verification_status: 'verified',
    is_active: 1
  }
];

// Sample institution users
const institutionUsers = [
  {
    email: 'info@modernartmuseum.org',
    password: '$2b$10$hashedpassword3',
    username: 'modern_art_museum',
    first_name: 'Modern Art',
    last_name: 'Museum',
    user_type: 'institution',
    bio: 'Contemporary art museum dedicated to showcasing innovative works from emerging and established artists worldwide.',
    website: 'https://modernartmuseum.org',
    verification_status: 'verified',
    is_active: 1
  },
  {
    email: 'contact@cityculturalcenter.org',
    password: '$2b$10$hashedpassword4',
    username: 'city_cultural_center',
    first_name: 'City Cultural',
    last_name: 'Center',
    user_type: 'institution',
    bio: 'Cultural institution promoting local and international artists through exhibitions, workshops, and community programs.',
    website: 'https://cityculturalcenter.org',
    verification_status: 'verified',
    is_active: 1
  }
];

// Function to add new user types
function addNewUserTypes() {
  console.log('=== ADDING NEW USER TYPES ===\n');
  
  const allNewUsers = [...collectorUsers, ...institutionUsers];
  let completed = 0;
  const total = allNewUsers.length;
  
  allNewUsers.forEach((user, index) => {
    const query = `
      INSERT INTO users (
        email, password, username, first_name, last_name, user_type, 
        bio, website, verification_status, is_active, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    
    db.run(query, [
      user.email,
      user.password,
      user.username,
      user.first_name,
      user.last_name,
      user.user_type,
      user.bio,
      user.website,
      user.verification_status,
      user.is_active
    ], function(err) {
      if (err) {
        console.error(`âŒ Error adding ${user.user_type} "${user.username}":`, err);
      } else {
        console.log(`âœ… Added ${user.user_type}: "${user.first_name} ${user.last_name}" (ID: ${this.lastID})`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Bio: ${user.bio.substring(0, 50)}...`);
        console.log('');
      }
      
      completed++;
      if (completed === total) {
        // Show updated user types
        console.log('=== UPDATED USER TYPES IN DATABASE ===');
        db.all("SELECT DISTINCT user_type FROM users WHERE user_type IS NOT NULL ORDER BY user_type", (err, rows) => {
          if (err) {
            console.error('Error fetching updated user types:', err);
          } else {
            rows.forEach(row => {
              console.log(`- ${row.user_type}`);
            });
          }
          
          // Show user count by type
          console.log('\n=== USER COUNT BY TYPE ===');
          db.all("SELECT user_type, COUNT(*) as count FROM users GROUP BY user_type ORDER BY user_type", (err, countRows) => {
            if (err) {
              console.error('Error counting users by type:', err);
            } else {
              countRows.forEach(row => {
                console.log(`- ${row.user_type}: ${row.count} users`);
              });
            }
            
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
              } else {
                console.log('\nðŸŽ‰ New user types added successfully!');
                console.log('Account types now available:');
                console.log('- Artist (creates and sells art)');
                console.log('- Collector (buys and collects art) ðŸ†•');
                console.log('- Institution (museums, cultural centers) ðŸ†•');
                console.log('- Admin (platform administration)');
              }
            });
          });
        });
      }
    });
  });
}

// Run the function
addNewUserTypes();

