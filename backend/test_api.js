/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const http = require('http');

console.log('🔍 Testing API endpoints...');
console.log('=' .repeat(50));

// Test health endpoint
const testHealthEndpoint = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
};

// Test login endpoint
const testLoginEndpoint = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'admin@passionart.com',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

// Run tests
async function runTests() {
  try {
    // Test health endpoint
    console.log('📊 Testing health endpoint...');
    const healthResult = await testHealthEndpoint();
    console.log(`   Status: ${healthResult.status}`);
    console.log(`   Response: ${healthResult.data}`);
    
    // Test login endpoint
    console.log('\n🔐 Testing login endpoint with admin credentials...');
    const loginResult = await testLoginEndpoint();
    console.log(`   Status: ${loginResult.status}`);
    console.log(`   Response: ${loginResult.data}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();
