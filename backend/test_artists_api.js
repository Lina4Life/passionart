/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const fetch = require('node-fetch');

async function testArtistsAPI() {
  try {
    console.log('🧪 Testing Artists API...');
    
    const response = await fetch('http://localhost:5000/api/artists');
    const data = await response.json();
    
    if (data.success && data.artists && data.artists.length > 0) {
      console.log('✅ API Response successful');
      console.log(`📊 Found ${data.artists.length} artists`);
      
      // Check first artist
      const firstArtist = data.artists[0];
      console.log('\n👤 First Artist:');
      console.log(`Name: ${firstArtist.first_name} ${firstArtist.last_name}`);
      console.log(`Type: ${firstArtist.user_type}`);
      console.log(`Has social_media: ${firstArtist.social_media ? 'Yes' : 'No'}`);
      
      if (firstArtist.social_media) {
        try {
          const socialData = JSON.parse(firstArtist.social_media);
          console.log('🔗 Social Media Links:');
          Object.entries(socialData).forEach(([platform, url]) => {
            console.log(`  ${platform}: ${url}`);
          });
        } catch (e) {
          console.log('❌ Error parsing social media JSON:', e.message);
        }
      }
    } else {
      console.log('❌ API failed or no artists found');
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testArtistsAPI();
