/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'passionart.db');

function checkAndFeatureArtworks() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      return;
    }
    console.log('Connected to real database');
  });

  console.log('=== CURRENT ARTWORKS IN REAL DATABASE ===');
  db.all(`
    SELECT 
      a.*, 
      u.username, 
      COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '') as artist_name
    FROM artworks a 
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.id
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching artworks:', err);
      db.close();
      return;
    }

    console.log(`Found ${rows.length} artworks:`);
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}`);
      console.log(`   Title: "${row.title}"`);
      console.log(`   Artist: ${row.artist_name.trim() || row.username || 'Unknown'}`);
      console.log(`   Status: ${row.status}`);
      console.log(`   Featured: ${row.featured ? 'YES' : 'NO'}`);
      console.log(`   Price: $${row.price}`);
      console.log('   ---');
    });

    console.log('\n=== FEATURING SOME ARTWORKS ===');
    
    // Feature the first 3 active artworks
    const activeArtworks = rows.filter(r => r.status === 'active');
    const toFeature = activeArtworks.slice(0, 3);
    
    if (toFeature.length === 0) {
      console.log('No active artworks found to feature');
      db.close();
      return;
    }

    console.log(`Featuring ${toFeature.length} artworks...`);
    
    let completed = 0;
    toFeature.forEach(artwork => {
      db.run('UPDATE artworks SET featured = 1 WHERE id = ?', [artwork.id], function(err) {
        if (err) {
          console.error(`Error featuring artwork ${artwork.id}:`, err);
        } else {
          console.log(`✅ Featured: "${artwork.title}"`);
        }
        
        completed++;
        if (completed === toFeature.length) {
          console.log('\n=== CHECKING FEATURED ARTWORKS ===');
          db.all('SELECT * FROM artworks WHERE featured = 1', (err, featured) => {
            if (err) {
              console.error('Error checking featured:', err);
            } else {
              console.log(`Currently featured: ${featured.length} artworks`);
              featured.forEach(f => console.log(`- "${f.title}"`));
            }
            db.close();
          });
        }
      });
    });
  });
}

checkAndFeatureArtworks();
