/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database paths
const artworksDbPath = path.join(__dirname, 'config', 'database.db');
const usersDbPath = path.join(__dirname, 'data', 'passionart.db');

const sampleArtworks = [
  // Artworks for sss@passionart.com (ID: 34)
  {
    title: 'Digital Dreams',
    description: 'A vibrant digital painting exploring the intersection of technology and imagination. Created using advanced digital techniques.',
    price: 350.00,
    medium: 'Digital Art',
    dimensions: '24" x 18"',
    artist_id: 34,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    tags: 'digital,modern,colorful,technology'
  },
  {
    title: 'Neon Cityscape',
    description: 'An atmospheric digital artwork capturing the energy of a futuristic city at night. Bright neon colors illuminate the urban landscape.',
    price: 425.00,
    medium: 'Digital Art',
    dimensions: '30" x 20"',
    artist_id: 34,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    tags: 'digital,neon,city,night,futuristic'
  },
  {
    title: 'Abstract Emotions',
    description: 'A powerful abstract piece that conveys deep emotions through bold colors and flowing forms.',
    price: 275.00,
    medium: 'Digital Art',
    dimensions: '20" x 16"',
    artist_id: 34,
    status: 'pending',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    tags: 'abstract,emotional,colors,flowing'
  },

  // Artworks for booga@passionart.com (ID: 26)
  {
    title: 'Mystic Forest',
    description: 'A mysterious and enchanting forest scene with ethereal lighting and magical atmosphere.',
    price: 480.00,
    medium: 'Mixed Media',
    dimensions: '36" x 24"',
    artist_id: 26,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    tags: 'forest,mystical,nature,enchanting'
  },
  {
    title: 'Ocean Depths',
    description: 'Deep underwater scene showcasing the beauty and mystery of ocean life with vibrant coral and marine creatures.',
    price: 390.00,
    medium: 'Acrylic on Canvas',
    dimensions: '28" x 22"',
    artist_id: 26,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    tags: 'ocean,underwater,marine,colorful'
  },

  // Artworks for youssefelgharib03@gmail.com (ID: 3)
  {
    title: 'Desert Mirage',
    description: 'A stunning landscape capturing the beauty and vastness of desert dunes with warm golden tones.',
    price: 520.00,
    medium: 'Oil on Canvas',
    dimensions: '40" x 30"',
    artist_id: 3,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
    tags: 'desert,landscape,golden,nature'
  },
  {
    title: 'Urban Portrait',
    description: 'A compelling portrait series depicting the diversity and character of urban life.',
    price: 650.00,
    medium: 'Photography',
    dimensions: '24" x 18"',
    artist_id: 3,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    tags: 'portrait,urban,people,photography'
  },

  // Artworks for sophia.martinez@example.com (ID: 4)
  {
    title: 'Geometric Harmony',
    description: 'Modern geometric composition exploring balance and symmetry through precise shapes and vibrant colors.',
    price: 385.00,
    medium: 'Acrylic on Canvas',
    dimensions: '32" x 24"',
    artist_id: 4,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    tags: 'geometric,modern,colorful,abstract'
  },
  {
    title: 'Floral Symphony',
    description: 'Delicate watercolor painting of blooming flowers in a garden setting with soft, natural colors.',
    price: 295.00,
    medium: 'Watercolor',
    dimensions: '18" x 14"',
    artist_id: 4,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop',
    tags: 'floral,watercolor,garden,delicate'
  },

  // Artworks for james.parker@example.com (ID: 5)
  {
    title: 'Industrial Beauty',
    description: 'A stunning architectural photography series showcasing the beauty in industrial structures and urban landscapes.',
    price: 450.00,
    medium: 'Photography',
    dimensions: '30" x 20"',
    artist_id: 5,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    tags: 'architecture,industrial,urban,photography'
  },
  {
    title: 'Mountain Majesty',
    description: 'Breathtaking landscape photography capturing the raw power and beauty of mountain peaks at sunrise.',
    price: 380.00,
    medium: 'Photography',
    dimensions: '36" x 24"',
    artist_id: 5,
    status: 'approved',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    tags: 'mountain,landscape,sunrise,nature'
  }
];

function addArtworks() {
  // First, get artist information from users database
  const usersDb = new sqlite3.Database(usersDbPath, (err) => {
    if (err) {
      console.error('Error opening users database:', err.message);
      return;
    }
    console.log('✅ Connected to users database');
  });

  usersDb.all('SELECT id, email, username, first_name, last_name FROM users WHERE id IN (34, 26, 3, 4, 5)', (err, artists) => {
    if (err) {
      console.error('Error getting artists:', err.message);
      usersDb.close();
      return;
    }

    console.log('📋 Found artists:');
    artists.forEach(artist => {
      const fullName = `${artist.first_name || ''} ${artist.last_name || ''}`.trim();
      console.log(`   ID: ${artist.id}, Name: ${fullName}, Username: ${artist.username}, Email: ${artist.email}`);
    });

    usersDb.close();

    // Now connect to artworks database
    const artworksDb = new sqlite3.Database(artworksDbPath, (err) => {
      if (err) {
        console.error('Error opening artworks database:', err.message);
        return;
      }
      console.log('✅ Connected to artworks database');
    });

    // Insert sample artworks with artist information
    const insertStmt = artworksDb.prepare(`
      INSERT INTO artworks (title, description, price, medium, dimensions, artist_id, status, image_url, tags, artist_name, artist_username)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let insertedCount = 0;
    sampleArtworks.forEach((artwork) => {
      // Find the corresponding artist
      const artist = artists.find(a => a.id === artwork.artist_id);
      const artistName = artist ? `${artist.first_name || ''} ${artist.last_name || ''}`.trim() || 'Unknown Artist' : 'Unknown Artist';
      const artistUsername = artist ? artist.username || 'unknown' : 'unknown';

      insertStmt.run([
        artwork.title,
        artwork.description,
        artwork.price,
        artwork.medium,
        artwork.dimensions,
        artwork.artist_id,
        artwork.status,
        artwork.image_url,
        artwork.tags,
        artistName,
        artistUsername
      ], function(err) {
        if (err) {
          console.error('Error inserting artwork:', err.message);
        } else {
          insertedCount++;
          console.log(`✅ Added: "${artwork.title}" by ${artistName} (ID: ${artwork.artist_id})`);
        }

        if (insertedCount === sampleArtworks.length) {
          insertStmt.finalize();
          
          // Display summary
          artworksDb.all(`
            SELECT * FROM artworks
            ORDER BY created_at DESC
          `, (err, rows) => {
            if (err) {
              console.error('Error fetching artworks:', err.message);
            } else {
              console.log('\n🎨 ARTWORKS SUMMARY:');
              console.log('='.repeat(80));
              rows.forEach(artwork => {
                console.log(`📋 "${artwork.title}" - $${artwork.price}`);
                console.log(`   👤 Artist: ${artwork.artist_name} (${artwork.artist_username})`);
                console.log(`   🎭 Medium: ${artwork.medium} | Dimensions: ${artwork.dimensions}`);
                console.log(`   ✅ Status: ${artwork.status} | Tags: ${artwork.tags}`);
                console.log(`   📸 Image: ${artwork.image_url}`);
                console.log('-'.repeat(80));
              });
              console.log(`\n✨ Total artworks in database: ${rows.length}`);
            }
            
            artworksDb.close((err) => {
              if (err) {
                console.error('Error closing database:', err.message);
              } else {
                console.log('✅ Artworks database connection closed');
              }
            });
          });
        }
      });
    });
  });
}

// Run the script
if (require.main === module) {
  console.log('🎨 Adding sample artworks to database...');
  addArtworks();
}

module.exports = { addArtworks, sampleArtworks };
