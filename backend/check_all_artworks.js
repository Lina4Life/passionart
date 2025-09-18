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

// Function to check all artworks
function checkArtworks() {
  console.log('=== ALL ARTWORKS IN DATABASE ===\n');
  
  const query = `
    SELECT 
      a.id,
      a.title,
      u.username as artist,
      a.category,
      a.medium,
      a.price,
      a.featured,
      a.status,
      a.created_at
    FROM artworks a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.id DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching artworks:', err);
      return;
    }
    
    if (rows.length === 0) {
      console.log('No artworks found in database.');
      db.close();
      return;
    }
    
    rows.forEach((artwork, index) => {
      console.log(`${index + 1}. "${artwork.title}"`);
      console.log(`   Artist: ${artwork.artist || 'Unknown'}`);
      console.log(`   Category: ${artwork.category}`);
      console.log(`   Medium: ${artwork.medium || 'Not specified'}`);
      console.log(`   Price: $${artwork.price}`);
      console.log(`   Featured: ${artwork.featured ? 'Yes' : 'No'}`);
      console.log(`   Status: ${artwork.status}`);
      console.log(`   ID: ${artwork.id}`);
      console.log('');
    });
    
    // Show category breakdown
    console.log('=== CATEGORY BREAKDOWN ===');
    db.all(`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM artworks 
      WHERE category IS NOT NULL 
      GROUP BY category 
      ORDER BY count DESC
    `, (err, categoryRows) => {
      if (err) {
        console.error('Error fetching category breakdown:', err);
      } else {
        categoryRows.forEach(row => {
          console.log(`- ${row.category}: ${row.count} works`);
          console.log(`  Price range: $${row.min_price} - $${row.max_price} (avg $${row.avg_price.toFixed(2)})`);
        });
      }
      
      // Show featured artworks
      console.log('\n=== FEATURED ARTWORKS ===');
      db.all(`
        SELECT 
          a.title,
          u.username as artist,
          a.category,
          a.price
        FROM artworks a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.featured = 1
        ORDER BY a.category, a.title
      `, (err, featuredRows) => {
        if (err) {
          console.error('Error fetching featured artworks:', err);
        } else {
          featuredRows.forEach(row => {
            console.log(`- "${row.title}" by ${row.artist || 'Unknown'} (${row.category}) - $${row.price}`);
          });
        }
        
        console.log(`\nðŸ“Š Total artworks: ${rows.length}`);
        console.log(`ðŸŒŸ Featured artworks: ${featuredRows.length}`);
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('\nâœ… Database check completed!');
          }
        });
      });
    });
  });
}

// Run the function
checkArtworks();

