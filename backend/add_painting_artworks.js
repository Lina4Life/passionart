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

// Sample painting artworks categorized by style
const paintingArtworks = [
  // Abstract Paintings
  {
    user_id: 1,
    title: 'Crimson Dreams',
    description: 'A bold abstract composition exploring the relationship between passion and tranquility through vibrant reds and calming blues',
    keywords: 'abstract, painting, contemporary, red, blue, emotion',
    image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853',
    category: 'Painting',
    medium: 'Acrylic on Canvas',
    dimensions: '36" x 48"',
    year_created: 2024,
    price: 1200.00,
    status: 'active',
    featured: 1
  },
  {
    user_id: 2,
    title: 'Urban Symphony',
    description: 'Dynamic abstract piece inspired by the rhythm and energy of city life, featuring geometric forms in metallic tones',
    keywords: 'abstract, urban, geometric, metallic, contemporary',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    category: 'Painting',
    medium: 'Mixed Media on Canvas',
    dimensions: '30" x 40"',
    year_created: 2024,
    price: 950.00,
    status: 'active',
    featured: 0
  },
  
  // Landscape Paintings
  {
    user_id: 3,
    title: 'Misty Mountain Morning',
    description: 'Serene landscape capturing the ethereal beauty of dawn breaking over mountain peaks, rendered in soft watercolors',
    keywords: 'landscape, mountains, watercolor, nature, peaceful',
    image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    category: 'Painting',
    medium: 'Watercolor on Paper',
    dimensions: '18" x 24"',
    year_created: 2023,
    price: 650.00,
    status: 'active',
    featured: 1
  },
  {
    user_id: 4,
    title: 'Golden Wheat Fields',
    description: 'Impressionistic landscape depicting vast wheat fields under a golden sunset, painted with bold, expressive brushstrokes',
    keywords: 'landscape, impressionist, wheat, sunset, golden',
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    category: 'Painting',
    medium: 'Oil on Canvas',
    dimensions: '24" x 32"',
    year_created: 2024,
    price: 850.00,
    status: 'active',
    featured: 0
  },
  
  // Portrait Paintings
  {
    user_id: 5,
    title: 'The Dreamer',
    description: 'Intimate portrait study capturing the contemplative expression of a young artist, painted in classical realist style',
    keywords: 'portrait, realism, classical, contemplative, artist',
    image_url: 'https://images.unsplash.com/photo-1578320340459-76d3c5d67d95',
    category: 'Painting',
    medium: 'Oil on Canvas',
    dimensions: '16" x 20"',
    year_created: 2024,
    price: 750.00,
    status: 'active',
    featured: 0
  },
  {
    user_id: 1,
    title: 'Fragments of Memory',
    description: 'Expressionistic portrait exploring themes of identity and memory through fragmented facial features and bold color choices',
    keywords: 'portrait, expressionism, identity, memory, bold',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    category: 'Painting',
    medium: 'Acrylic on Canvas',
    dimensions: '20" x 24"',
    year_created: 2023,
    price: 680.00,
    status: 'active',
    featured: 0
  },
  
  // Still Life Paintings
  {
    user_id: 2,
    title: 'Botanical Study No. 3',
    description: 'Detailed still life painting of exotic flowers and succulents, showcasing delicate brushwork and natural lighting',
    keywords: 'still life, botanical, flowers, detailed, natural',
    image_url: 'https://images.unsplash.com/photo-1502780402662-acc01917091e',
    category: 'Painting',
    medium: 'Oil on Canvas',
    dimensions: '14" x 18"',
    year_created: 2024,
    price: 420.00,
    status: 'active',
    featured: 0
  },
  {
    user_id: 3,
    title: 'Vintage Books and Tea',
    description: 'Nostalgic still life composition featuring antique books, porcelain teacup, and warm candlelight in rich earth tones',
    keywords: 'still life, vintage, books, nostalgic, warm tones',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
    category: 'Painting',
    medium: 'Oil on Panel',
    dimensions: '12" x 16"',
    year_created: 2023,
    price: 380.00,
    status: 'active',
    featured: 0
  },
  
  // Modern Contemporary
  {
    user_id: 4,
    title: 'Neon Nights',
    description: 'Contemporary painting capturing the electric energy of nighttime city streets with vibrant neon colors and dynamic composition',
    keywords: 'contemporary, neon, city, night, vibrant',
    image_url: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853',
    category: 'Painting',
    medium: 'Acrylic and Fluorescent Paint on Canvas',
    dimensions: '40" x 30"',
    year_created: 2024,
    price: 1100.00,
    status: 'active',
    featured: 1
  },
  {
    user_id: 5,
    title: 'Digital Age Reflection',
    description: 'Thought-provoking contemporary piece examining our relationship with technology through layered painterly techniques',
    keywords: 'contemporary, technology, digital age, reflection, layered',
    image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
    category: 'Painting',
    medium: 'Mixed Media on Canvas',
    dimensions: '36" x 36"',
    year_created: 2024,
    price: 980.00,
    status: 'active',
    featured: 0
  }
];

// Function to add painting artworks
function addPaintingArtworks() {
  console.log('=== ADDING PAINTING ARTWORKS ===\n');
  
  // First check if we have users
  db.get("SELECT COUNT(*) as count FROM users", (err, result) => {
    if (err) {
      console.error('Error checking users:', err);
      return;
    }
    
    if (result.count === 0) {
      console.log('âŒ No users found in database. Please add users first.');
      db.close();
      return;
    }
    
    console.log(`âœ… Found ${result.count} users in database`);
    
    // Insert each painting artwork
    let completed = 0;
    const total = paintingArtworks.length;
    
    paintingArtworks.forEach((artwork, index) => {
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
          console.error(`âŒ Error adding "${artwork.title}":`, err);
        } else {
          console.log(`âœ… Added: "${artwork.title}" (ID: ${this.lastID})`);
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
            
            // Show painting count
            console.log('\n=== PAINTING ARTWORKS SUMMARY ===');
            db.all("SELECT COUNT(*) as count FROM artworks WHERE category = 'Painting'", (err, countResult) => {
              if (err) {
                console.error('Error counting paintings:', err);
              } else {
                console.log(`Total Paintings: ${countResult[0].count}`);
              }
              
              // Show featured paintings
              db.all("SELECT title, price, medium FROM artworks WHERE category = 'Painting' AND featured = 1 ORDER BY title", (err, featuredRows) => {
                if (err) {
                  console.error('Error fetching featured paintings:', err);
                } else {
                  console.log('\n=== FEATURED PAINTINGS ===');
                  featuredRows.forEach(row => {
                    console.log(`- ${row.title} - $${row.price} (${row.medium})`);
                  });
                }
                
                // Show painting categories breakdown
                db.all(`
                  SELECT 
                    medium,
                    COUNT(*) as count,
                    AVG(price) as avg_price
                  FROM artworks 
                  WHERE category = 'Painting' 
                  GROUP BY medium 
                  ORDER BY count DESC
                `, (err, mediumRows) => {
                  if (err) {
                    console.error('Error fetching medium breakdown:', err);
                  } else {
                    console.log('\n=== PAINTING MEDIUMS BREAKDOWN ===');
                    mediumRows.forEach(row => {
                      console.log(`- ${row.medium}: ${row.count} works (avg $${row.avg_price.toFixed(2)})`);
                    });
                  }
                  
                  db.close((err) => {
                    if (err) {
                      console.error('Error closing database:', err);
                    } else {
                      console.log('\nðŸŽ¨ Painting artworks added successfully!');
                      console.log('Diverse painting collection now includes:');
                      console.log('- Abstract paintings');
                      console.log('- Landscape paintings'); 
                      console.log('- Portrait paintings');
                      console.log('- Still life paintings');
                      console.log('- Contemporary paintings');
                    }
                  });
                });
              });
            });
          });
        }
      });
    });
  });
}

// Run the function
addPaintingArtworks();

