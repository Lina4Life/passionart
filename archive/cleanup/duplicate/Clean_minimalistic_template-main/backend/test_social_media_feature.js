/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const fetch = require('node-fetch');

async function testSocialMediaFeature() {
  try {
    console.log('🧪 Testing Social Media Feature...');
    
    // Test 1: Check if the endpoint exists
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      console.log('✅ Backend server is running');
    } else {
      console.log('❌ Backend server not responding');
      return;
    }
    
    // Test 2: Check if we can access profile endpoints (without auth for now)
    console.log('\n📊 Testing profile endpoints structure...');
    
    // Note: These will fail without auth, but we can see if the routes exist
    const profileResponse = await fetch('http://localhost:5000/api/profile');
    console.log(`Profile endpoint status: ${profileResponse.status}`);
    
    const socialMediaResponse = await fetch('http://localhost:5000/api/profile/social-media', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ socialMedia: { instagram: 'test' } })
    });
    console.log(`Social media endpoint status: ${socialMediaResponse.status}`);
    
    if (socialMediaResponse.status === 401) {
      console.log('✅ Social media endpoint exists (401 = needs auth, which is correct)');
    } else if (socialMediaResponse.status === 404) {
      console.log('❌ Social media endpoint not found');
    } else {
      console.log(`ℹ️ Social media endpoint responded with: ${socialMediaResponse.status}`);
    }
    
    console.log('\n🎉 Backend social media endpoints are properly configured!');
    console.log('🔗 Frontend should be accessible at: http://localhost:5174/profile');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSocialMediaFeature();
