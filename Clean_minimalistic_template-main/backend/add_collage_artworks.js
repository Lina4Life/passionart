/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
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

// Sample collage artworks to add
const collageArtworks = [
  {
    user_id: 1, // Assuming user 1 exists
    title: 'Urban Memories',
    description: 'A mixed media collage exploring the fragments of city life through newspaper clippings, photographs, and acrylic paint',
    keywords: 'collage, urban, mixed media, contemporary art, city life',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    category: 'Collage',
    medium: 'Mixed Media Collage',
    dimensions: '24" x 18"',
    year_created: 2024,
    price: 450.00,
    status: 'active',
    featured: 0
  },
  {
    user_id: 1,
    title: 'Nature\'s Fragments', 
    description: 'An organic collage piece combining pressed flowers, magazine cutouts, and watercolor to celebrate the beauty of nature',
    keywords: 'collage, nature, flowers, organic, botanical art',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    category: 'Collage',
    medium: 'Paper and Botanical Collage',
    dimensions: '16" x 20"',
    year_created: 2024,
    price: 325.00,
    status: 'active',
    featured: 0
  },
  {
    user_id: 1,
    title: 'Digital Analog',
    description: 'A contemporary collage blending printed digital art with traditional paper elements, exploring the intersection of old and new media',
    keywords: 'collage, digital, contemporary, mixed media, technology',
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    category: 'Collage',
    medium: 'Digital Print and Paper Collage',
    dimensions: '20" x 24"',
    year_created: 2025,
    price: 550.00,
    status: 'active',
    featured: 1 // Featured artwork
  }
];

// Function to add collage artworks
function addCollageArtworks() {
  console.log('=== ADDING COLLAGE ARTWORKS ===\n');
  
  // First check if we have users
  db.get("SELECT COUNT(*) as count FROM users", (err, result) => {
    if (err) {
      console.error('Error checking users:', err);
      return;
    }
    
    if (result.count === 0) {
      console.log('❌ No users found in database. Please add users first.');
      db.close();
      return;
    }
    
    console.log(`✅ Found ${result.count} users in database`);
    
    // Insert each collage artwork
    let completed = 0;
    const total = collageArtworks.length;
    
    collageArtworks.forEach((artwork, index) => {
      const query = `
        INSERT INTO artworks (
          user_id, title, description, keywords, image_url, category, 
          medium, dimensions, year_created, price, status, featured, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `;
      
      db.run(query, [
        artwork.user_id,
        artwork.title,
        artwork.description,
        artwork.keywords,
        artwork.image_url,
        artwork.category,
        artwork.medium,
        artwork.dimensions,
        artwork.year_created,
        artwork.price,
        artwork.status,
        artwork.featured
      ], function(err) {
        if (err) {
          console.error(`❌ Error adding "${artwork.title}":`, err);
        } else {
          console.log(`✅ Added: "${artwork.title}" (ID: ${this.lastID})`);
          console.log(`   Category: ${artwork.category}`);
          console.log(`   Medium: ${artwork.medium}`);
          console.log(`   Price: $${artwork.price}`);
          console.log(`   Featured: ${artwork.featured ? 'Yes' : 'No'}`);
          console.log('');
        }
        
        completed++;
        if (completed === total) {
          // Show updated categories
          console.log('=== UPDATED CATEGORIES IN DATABASE ===');
          db.all("SELECT DISTINCT category FROM artworks WHERE category IS NOT NULL ORDER BY category", (err, rows) => {
            if (err) {
              console.error('Error fetching categories:', err);
            } else {
              rows.forEach(row => {
                console.log(`- ${row.category}`);
              });
            }
            
            // Show collage artworks
            console.log('\n=== COLLAGE ARTWORKS IN DATABASE ===');
            db.all("SELECT title, price, featured FROM artworks WHERE category = 'Collage' ORDER BY title", (err, collageRows) => {
              if (err) {
                console.error('Error fetching collage artworks:', err);
              } else {
                collageRows.forEach(row => {
                  console.log(`- ${row.title} - $${row.price} ${row.featured ? '(Featured)' : ''}`);
                });
              }
              
              db.close((err) => {
                if (err) {
                  console.error('Error closing database:', err);
                } else {
                  console.log('\n🎉 Collage category and artworks added successfully!');
                  console.log('The "Collage" category will now appear in your Store and featured artworks.');
                }
              });
            });
          });
        }
      });
    });
  });
}

// Run the function
addCollageArtworks();
