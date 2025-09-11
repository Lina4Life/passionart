/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
// Test admin endpoints
const axios = require('axios');

async function testAdminEndpoints() {
  console.log('Testing admin endpoints...');
  
  try {
    // Test stats
    const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
    console.log('✅ Stats endpoint working:', statsResponse.data);
    
    // Test users
    const usersResponse = await axios.get('http://localhost:5000/api/admin/users');
    console.log('✅ Users endpoint working:', usersResponse.data.length, 'users found');
    console.log('First user:', usersResponse.data[0]);
    
    // Test products
    const productsResponse = await axios.get('http://localhost:5000/api/admin/products');
    console.log('✅ Products endpoint working:', productsResponse.data.length, 'products found');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAdminEndpoints();
