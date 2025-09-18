const axios = require('axios');

// HubSpot Integration Test Script
const BASE_URL = 'http://localhost:3000'; // Updated to match current server port

async function testHubSpotIntegration() {
    console.log('ðŸ§ª Testing HubSpot Integration...\n');
    
    try {
        // Test 1: Basic API connection
        console.log('1ï¸âƒ£ Testing API connection...');
        const healthCheck = await axios.get(`${BASE_URL}/api/health`);
        console.log('âœ… API is responding:', healthCheck.data);
        
        // Test 2: HubSpot connection test
        console.log('\n2ï¸âƒ£ Testing HubSpot connection...');
        try {
            const hubspotTest = await axios.get(`${BASE_URL}/api/hubspot/test`);
            console.log('âœ… HubSpot connection:', hubspotTest.data);
        } catch (error) {
            console.log('âŒ HubSpot connection failed:', error.response?.data || error.message);
        }
        
        // Test 3: Test user registration (will create HubSpot contact)
        console.log('\n3ï¸âƒ£ Testing user registration with HubSpot sync...');
        const testUser = {
            email: `test-${Date.now()}@example.com`,
            password: 'testpass123',
            firstName: 'Test',
            lastName: 'User'
        };
        
        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
            console.log('âœ… User registration successful:', registerResponse.data);
            console.log('   â†’ Should create contact in HubSpot');
        } catch (error) {
            console.log('âŒ User registration failed:', error.response?.data || error.message);
        }
        
        // Test 4: Test email verification
        console.log('\n4ï¸âƒ£ Testing email verification...');
        try {
            const emailTest = await axios.post(`${BASE_URL}/api/hubspot/send-verification`, {
                email: 'test@example.com',
                verificationToken: 'test123'
            });
            console.log('âœ… Email verification test:', emailTest.data);
        } catch (error) {
            console.log('âŒ Email verification failed:', error.response?.data || error.message);
        }
        
        // Test 5: Test bulk email (admin feature)
        console.log('\n5ï¸âƒ£ Testing bulk email capability...');
        try {
            const bulkEmailTest = await axios.post(`${BASE_URL}/api/hubspot/send-bulk-email`, {
                subject: 'Test Email from PassionArt',
                htmlContent: '<h1>Test Email</h1><p>This is a test email from your PassionArt platform.</p>',
                recipients: ['test@example.com']
            });
            console.log('âœ… Bulk email test:', bulkEmailTest.data);
        } catch (error) {
            console.log('âŒ Bulk email failed:', error.response?.data || error.message);
        }
        
        // Test 6: HubSpot analytics
        console.log('\n6ï¸âƒ£ Testing HubSpot analytics...');
        try {
            const analyticsTest = await axios.get(`${BASE_URL}/api/hubspot/analytics`);
            console.log('âœ… HubSpot analytics:', analyticsTest.data);
        } catch (error) {
            console.log('âŒ HubSpot analytics failed:', error.response?.data || error.message);
        }
        
        console.log('\nðŸŽ‰ HubSpot integration testing completed!');
        console.log('\nðŸ“‹ Next steps:');
        console.log('1. Check your HubSpot dashboard for new contacts');
        console.log('2. Verify email delivery in HubSpot email logs');
        console.log('3. Update frontend with your HubSpot Hub ID');
        console.log('4. Test website tracking functionality');
        
    } catch (error) {
        console.log('âŒ Basic API connection failed:', error.message);
        console.log('   Make sure your server is running on port 5000');
    }
}

// Run the test
testHubSpotIntegration().catch(console.error);

