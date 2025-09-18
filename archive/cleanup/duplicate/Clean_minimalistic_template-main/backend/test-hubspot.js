/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
const axios = require('axios');

// HubSpot Integration Test Script
const BASE_URL = 'http://localhost:3000'; // Updated to match current server port

async function testHubSpotIntegration() {
    console.log('🧪 Testing HubSpot Integration...\n');
    
    try {
        // Test 1: Basic API connection
        console.log('1️⃣ Testing API connection...');
        const healthCheck = await axios.get(`${BASE_URL}/api/health`);
        console.log('✅ API is responding:', healthCheck.data);
        
        // Test 2: HubSpot connection test
        console.log('\n2️⃣ Testing HubSpot connection...');
        try {
            const hubspotTest = await axios.get(`${BASE_URL}/api/hubspot/test`);
            console.log('✅ HubSpot connection:', hubspotTest.data);
        } catch (error) {
            console.log('❌ HubSpot connection failed:', error.response?.data || error.message);
        }
        
        // Test 3: Test user registration (will create HubSpot contact)
        console.log('\n3️⃣ Testing user registration with HubSpot sync...');
        const testUser = {
            email: `test-${Date.now()}@example.com`,
            password: 'testpass123',
            firstName: 'Test',
            lastName: 'User'
        };
        
        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
            console.log('✅ User registration successful:', registerResponse.data);
            console.log('   → Should create contact in HubSpot');
        } catch (error) {
            console.log('❌ User registration failed:', error.response?.data || error.message);
        }
        
        // Test 4: Test email verification
        console.log('\n4️⃣ Testing email verification...');
        try {
            const emailTest = await axios.post(`${BASE_URL}/api/hubspot/send-verification`, {
                email: 'test@example.com',
                verificationToken: 'test123'
            });
            console.log('✅ Email verification test:', emailTest.data);
        } catch (error) {
            console.log('❌ Email verification failed:', error.response?.data || error.message);
        }
        
        // Test 5: Test bulk email (admin feature)
        console.log('\n5️⃣ Testing bulk email capability...');
        try {
            const bulkEmailTest = await axios.post(`${BASE_URL}/api/hubspot/send-bulk-email`, {
                subject: 'Test Email from PassionArt',
                htmlContent: '<h1>Test Email</h1><p>This is a test email from your PassionArt platform.</p>',
                recipients: ['test@example.com']
            });
            console.log('✅ Bulk email test:', bulkEmailTest.data);
        } catch (error) {
            console.log('❌ Bulk email failed:', error.response?.data || error.message);
        }
        
        // Test 6: HubSpot analytics
        console.log('\n6️⃣ Testing HubSpot analytics...');
        try {
            const analyticsTest = await axios.get(`${BASE_URL}/api/hubspot/analytics`);
            console.log('✅ HubSpot analytics:', analyticsTest.data);
        } catch (error) {
            console.log('❌ HubSpot analytics failed:', error.response?.data || error.message);
        }
        
        console.log('\n🎉 HubSpot integration testing completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Check your HubSpot dashboard for new contacts');
        console.log('2. Verify email delivery in HubSpot email logs');
        console.log('3. Update frontend with your HubSpot Hub ID');
        console.log('4. Test website tracking functionality');
        
    } catch (error) {
        console.log('❌ Basic API connection failed:', error.message);
        console.log('   Make sure your server is running on port 5000');
    }
}

// Run the test
testHubSpotIntegration().catch(console.error);
