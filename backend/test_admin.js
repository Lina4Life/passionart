// Test admin endpoints
const axios = require('axios');

async function testAdminEndpoints() {
  console.log('Testing admin endpoints...');
  
  try {
    // Test stats
    const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
    console.log('âœ… Stats endpoint working:', statsResponse.data);
    
    // Test users
    const usersResponse = await axios.get('http://localhost:5000/api/admin/users');
    console.log('âœ… Users endpoint working:', usersResponse.data.length, 'users found');
    console.log('First user:', usersResponse.data[0]);
    
    // Test products
    const productsResponse = await axios.get('http://localhost:5000/api/admin/products');
    console.log('âœ… Products endpoint working:', productsResponse.data.length, 'products found');
    
  } catch (error) {
    console.error('âŒ Error testing endpoints:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAdminEndpoints();

