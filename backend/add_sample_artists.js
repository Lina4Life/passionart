const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, 'data', 'passionart.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

const sampleArtists = [
  {
    email: 'sophia.martinez@example.com',
    password: 'password123',
    username: 'sophiart',
    first_name: 'Sophia',
    last_name: 'Martinez',
    user_type: 'artist',
    bio: 'Contemporary digital artist exploring the intersection of technology and human emotion. Specializing in surreal landscapes and abstract portraiture.',
    phone: '+1-555-0101'
  },
  {
    email: 'james.parker@example.com',
    password: 'password123',
    username: 'jamespainter',
    first_name: 'James',
    last_name: 'Parker',
    user_type: 'artist',
    bio: 'Oil painter with 15 years of experience in classical realism. My work focuses on capturing the beauty of everyday moments and natural light.',
    phone: '+1-555-0102'
  },
  {
    email: 'elena.rodriguez@example.com',
    password: 'password123',
    username: 'elenasculpt',
    first_name: 'Elena',
    last_name: 'Rodriguez',
    user_type: 'artist',
    bio: 'Sculptor and installation artist working with recycled materials. Passionate about environmental consciousness through art.',
    phone: '+1-555-0103'
  },
  {
    email: 'alex.chen@example.com',
    password: 'password123',
    username: 'alexstreet',
    first_name: 'Alex',
    last_name: 'Chen',
    user_type: 'artist',
    bio: 'Street artist and muralist based in downtown. Creating vibrant urban art that tells stories of community and culture.',
    phone: '+1-555-0104'
  },
  {
    email: 'maya.patel@example.com',
    password: 'password123',
    username: 'mayamixed',
    first_name: 'Maya',
    last_name: 'Patel',
    user_type: 'artist',
    bio: 'Mixed media artist combining traditional watercolors with digital techniques. Inspired by nature and geometric patterns.',
    phone: '+1-555-0105'
  },
  {
    email: 'david.kim@example.com',
    password: 'password123',
    username: 'davidphoto',
    first_name: 'David',
    last_name: 'Kim',
    user_type: 'artist',
    bio: 'Fine art photographer specializing in black and white portraits. Exploring themes of identity and human connection.',
    phone: '+1-555-0106'
  },
  {
    email: 'isabella.taylor@example.com',
    password: 'password123',
    username: 'isabellaart',
    first_name: 'Isabella',
    last_name: 'Taylor',
    user_type: 'artist',
    bio: 'Abstract expressionist painter drawing inspiration from music and movement. Each piece is a visual symphony of color and form.',
    phone: '+1-555-0107'
  },
  {
    email: 'marcus.johnson@example.com',
    password: 'password123',
    username: 'marcusmetal',
    first_name: 'Marcus',
    last_name: 'Johnson',
    user_type: 'artist',
    bio: 'Metal sculptor and jewelry designer. Creating intricate pieces that blend industrial materials with organic forms.',
    phone: '+1-555-0108'
  },
  {
    email: 'zoe.williams@example.com',
    password: 'password123',
    username: 'zoetextile',
    first_name: 'Zoe',
    last_name: 'Williams',
    user_type: 'artist',
    bio: 'Textile artist and fashion designer. Hand-weaving sustainable fabrics and creating wearable art pieces.',
    phone: '+1-555-0109'
  },
  {
    email: 'gabriel.santos@example.com',
    password: 'password123',
    username: 'gabrieldigital',
    first_name: 'Gabriel',
    last_name: 'Santos',
    user_type: 'artist',
    bio: '3D artist and animator creating immersive digital experiences. Blending reality with imagination through cutting-edge technology.',
    phone: '+1-555-0110'
  },
  {
    email: 'aria.nakamura@example.com',
    password: 'password123',
    username: 'ariaceramic',
    first_name: 'Aria',
    last_name: 'Nakamura',
    user_type: 'artist',
    bio: 'Ceramic artist influenced by Japanese minimalism and modern design. Creating functional art that brings zen to everyday life.',
    phone: '+1-555-0111'
  },
  {
    email: 'oliver.brown@example.com',
    password: 'password123',
    username: 'oliverprint',
    first_name: 'Oliver',
    last_name: 'Brown',
    user_type: 'artist',
    bio: 'Printmaker and book artist working with traditional lithography techniques. Preserving ancient art forms in contemporary contexts.',
    phone: '+1-555-0112'
  },
  {
    email: 'luna.garcia@example.com',
    password: 'password123',
    username: 'lunaillust',
    first_name: 'Luna',
    last_name: 'Garcia',
    user_type: 'artist',
    bio: 'Children\'s book illustrator and character designer. Bringing magical stories to life through whimsical illustrations.',
    phone: '+1-555-0113'
  },
  {
    email: 'ethan.moore@example.com',
    password: 'password123',
    username: 'ethanvideo',
    first_name: 'Ethan',
    last_name: 'Moore',
    user_type: 'artist',
    bio: 'Video artist and experimental filmmaker. Exploring the boundaries between reality and dreams through moving images.',
    phone: '+1-555-0114'
  },
  {
    email: 'nora.anderson@example.com',
    password: 'password123',
    username: 'norafiber',
    first_name: 'Nora',
    last_name: 'Anderson',
    user_type: 'artist',
    bio: 'Fiber artist creating large-scale installations. Weaving together stories of heritage and contemporary life.',
    phone: '+1-555-0115'
  }
];

async function addSampleArtists() {
  try {
    console.log('Starting to add sample artists...');
    
    for (const artist of sampleArtists) {
      try {
        // Check if user already exists
        const existingUser = await new Promise((resolve, reject) => {
          db.get(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [artist.email, artist.username],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            }
          );
        });
        
        if (existingUser) {
          console.log(`User ${artist.username} already exists, skipping...`);
          continue;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(artist.password, 10);
        
        // Insert user
        const insertQuery = `
          INSERT INTO users (
            email, password, username, first_name, last_name, 
            user_type, bio, phone, verification_status, is_active, 
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
          artist.email,
          hashedPassword,
          artist.username,
          artist.first_name,
          artist.last_name,
          artist.user_type,
          artist.bio,
          artist.phone,
          'verified',
          1, // SQLite uses 1/0 for boolean
          new Date().toISOString(),
          new Date().toISOString()
        ];
        
        await new Promise((resolve, reject) => {
          db.run(insertQuery, values, function(err) {
            if (err) {
              reject(err);
            } else {
              console.log(`âœ… Added artist: ${artist.username} (ID: ${this.lastID})`);
              resolve(this.lastID);
            }
          });
        });
        
      } catch (error) {
        console.error(`âŒ Error adding artist ${artist.username}:`, error.message);
      }
    }
    
    console.log('\nðŸŽ¨ Sample artists added successfully!');
    console.log('You can now view them on the Artists page.');
    
    // Show total count
    const count = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM users WHERE user_type = ?', ['artist'], (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });
    
    console.log(`\nTotal artists in database: ${count}`);
    
    db.close();
    process.exit(0);
    
  } catch (error) {
    console.error('Error adding sample artists:', error);
    db.close();
    process.exit(1);
  }
}

addSampleArtists();

