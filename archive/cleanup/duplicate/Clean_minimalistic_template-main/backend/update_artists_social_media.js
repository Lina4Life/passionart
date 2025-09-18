/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'passionart', 'passionart.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  
  console.log('✅ Connected to SQLite database');
  
  // Sample social media data for different artists
  const sampleSocialMediaData = [
    {
      instagram: 'https://instagram.com/modernartist_gallery',
      twitter: 'https://twitter.com/modernartist',
      website: 'https://modernartist.gallery',
      behance: 'https://behance.net/modernartist'
    },
    {
      instagram: 'https://instagram.com/abstractpainter',
      facebook: 'https://facebook.com/abstractpainter.art',
      website: 'https://abstractpainter.com',
      dribbble: 'https://dribbble.com/abstractpainter'
    },
    {
      twitter: 'https://twitter.com/digitalcreatve',
      instagram: 'https://instagram.com/digitalcreative_studio',
      youtube: 'https://youtube.com/c/digitalcreative',
      website: 'https://digitalcreative.studio'
    },
    {
      instagram: 'https://instagram.com/contemporary_works',
      pinterest: 'https://pinterest.com/contemporaryart',
      website: 'https://contemporaryworks.art',
      facebook: 'https://facebook.com/contemporary.works'
    },
    {
      instagram: 'https://instagram.com/mixedmedia_art',
      tiktok: 'https://tiktok.com/@mixedmediaartist',
      youtube: 'https://youtube.com/c/mixedmediaartist',
      website: 'https://mixedmediaart.com'
    }
  ];
  
  // Get all artists
  db.all("SELECT id, first_name, last_name, email FROM users WHERE user_type = 'artist'", (err, artists) => {
    if (err) {
      console.error('Error fetching artists:', err);
      db.close();
      return;
    }
    
    console.log(`\n👥 Found ${artists.length} artists`);
    
    let updateCount = 0;
    
    artists.forEach((artist, index) => {
      // Use modulo to cycle through sample data
      const socialDataIndex = index % sampleSocialMediaData.length;
      const socialData = sampleSocialMediaData[socialDataIndex];
      
      // Convert to JSON string
      const socialMediaJson = JSON.stringify(socialData);
      
      db.run(
        "UPDATE users SET social_media = ? WHERE id = ?",
        [socialMediaJson, artist.id],
        function(err) {
          if (err) {
            console.error(`Error updating artist ${artist.id}:`, err);
          } else {
            updateCount++;
            console.log(`✅ Updated social media for ${artist.first_name} ${artist.last_name}`);
          }
          
          // Close database when all updates are done
          if (updateCount + (artists.length - updateCount) === artists.length) {
            console.log(`\n🎉 Successfully updated ${updateCount} artists with social media data`);
            
            // Verify the updates
            db.all("SELECT id, first_name, last_name, social_media FROM users WHERE user_type = 'artist' AND social_media IS NOT NULL LIMIT 3", (err, results) => {
              if (err) {
                console.error('Error verifying updates:', err);
              } else {
                console.log('\n📋 Sample updated artists:');
                results.forEach(result => {
                  const socialMedia = JSON.parse(result.social_media);
                  const platforms = Object.keys(socialMedia).join(', ');
                  console.log(`${result.first_name} ${result.last_name}: ${platforms}`);
                });
              }
              
              db.close();
            });
          }
        }
      );
    });
    
    if (artists.length === 0) {
      console.log('No artists found to update');
      db.close();
    }
  });
});
