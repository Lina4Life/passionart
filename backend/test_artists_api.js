const fetch = require('node-fetch');

async function testArtistsAPI() {
  try {
    console.log('ðŸ§ª Testing Artists API...');
    
    const response = await fetch('http://localhost:5000/api/artists');
    const data = await response.json();
    
    if (data.success && data.artists && data.artists.length > 0) {
      console.log('âœ… API Response successful');
      console.log(`ðŸ“Š Found ${data.artists.length} artists`);
      
      // Check first artist
      const firstArtist = data.artists[0];
      console.log('\nðŸ‘¤ First Artist:');
      console.log(`Name: ${firstArtist.first_name} ${firstArtist.last_name}`);
      console.log(`Type: ${firstArtist.user_type}`);
      console.log(`Has social_media: ${firstArtist.social_media ? 'Yes' : 'No'}`);
      
      if (firstArtist.social_media) {
        try {
          const socialData = JSON.parse(firstArtist.social_media);
          console.log('ðŸ”— Social Media Links:');
          Object.entries(socialData).forEach(([platform, url]) => {
            console.log(`  ${platform}: ${url}`);
          });
        } catch (e) {
          console.log('âŒ Error parsing social media JSON:', e.message);
        }
      }
    } else {
      console.log('âŒ API failed or no artists found');
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('âŒ Test failed:', error.message);
  }
}

testArtistsAPI();

