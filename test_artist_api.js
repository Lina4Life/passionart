// Test artist profile API
const fetchArtist = async (id) => {
  try {
    console.log(`Testing API: http://localhost:3001/api/user/${id}`);
    const response = await fetch(`http://localhost:3001/api/user/${id}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('SUCCESS! Artist data:', data.user);
    } else {
      console.log('API Error:', data);
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};

const fetchArtworks = async (id) => {
  try {
    console.log(`Testing Artworks API: http://localhost:3001/api/artworks/artist/${id}`);
    const response = await fetch(`http://localhost:3001/api/artworks/artist/${id}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('Artworks:', data);
    } else {
      console.log('Artworks API Error:', data);
    }
  } catch (error) {
    console.error('Artworks Fetch Error:', error);
  }
};

// Test artist ID 2
fetchArtist(2);
fetchArtworks(2);

// Test artist ID 3  
fetchArtist(3);
fetchArtworks(3);

