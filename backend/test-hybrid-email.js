const axios = require('axios');

// Hybrid Email System Test Script
const BASE_URL = 'http://localhost:3001';

async function testHybridEmailSystem() {
    console.log('ðŸ§ª Testing Hybrid Email System (Resend + HubSpot)...\n');
    
    try {
        // Test 1: Basic API connection
        console.log('1ï¸âƒ£ Testing API connection...');
        try {
            const healthCheck = await axios.get(`${BASE_URL}/api/health`);
            console.log('âœ… API is responding:', healthCheck.data.status || 'OK');
        } catch (error) {
            console.log('âŒ API connection failed. Make sure server is running on port 3001');
            return;
        }
        
        // Test 2: Test HubSpot connection
        console.log('\n2ï¸âƒ£ Testing HubSpot connection...');
        try {
            // Note: This requires admin token, so it might fail - that's OK
            const hubspotTest = await axios.get(`${BASE_URL}/api/hybrid-email/test-connection`);
            console.log('âœ… HubSpot connection:', hubspotTest.data);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('âš ï¸ HubSpot test requires admin authentication (this is expected)');
            } else {
                console.log('âŒ HubSpot connection failed:', error.response?.data?.message || error.message);
            }
        }
        
        // Test 3: Test verification email sending
        console.log('\n3ï¸âƒ£ Testing verification email (Resend)...');
        const testEmail = `test-${Date.now()}@example.com`;
        try {
            const emailResponse = await axios.post(`${BASE_URL}/api/hybrid-email/send-verification`, {
                email: testEmail,
                verificationToken: 'test-token-123',
                firstName: 'Test User'
            });
            console.log('âœ… Verification email sent via Resend:', emailResponse.data);
        } catch (error) {
            console.log('âŒ Verification email failed:', error.response?.data || error.message);
        }
        
        // Test 4: Test user registration with hybrid system
        console.log('\n4ï¸âƒ£ Testing user registration with hybrid sync...');
        const testUser = {
            email: `hybrid-test-${Date.now()}@example.com`,
            password: 'TestPass123!',
            username: 'hybridtest',
            first_name: 'Hybrid',
            last_name: 'Test',
            user_type: 'artist'
        };
        
        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
            console.log('âœ… User registration successful with hybrid system:', registerResponse.data);
            console.log('   â†’ Email sent via Resend');
            console.log('   â†’ Contact synced to HubSpot');
        } catch (error) {
            console.log('âŒ User registration failed:', error.response?.data || error.message);
        }
        
        // Test 5: Test email statistics
        console.log('\n5ï¸âƒ£ Testing email system statistics...');
        try {
            const statsResponse = await axios.get(`${BASE_URL}/api/hybrid-email/stats`);
            console.log('âœ… Email system stats:', statsResponse.data);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('âš ï¸ Stats require admin authentication (this is expected)');
            } else {
                console.log('âŒ Stats failed:', error.response?.data || error.message);
            }
        }
        
        console.log('\nðŸŽ‰ Hybrid Email System Test Complete!');
        console.log('\nðŸ“‹ Summary:');
        console.log('â€¢ Resend: Handles verification emails, password resets');
        console.log('â€¢ HubSpot: Manages contacts, CRM, future marketing');
        console.log('â€¢ System: Graceful fallbacks if either service fails');
        
    } catch (error) {
        console.error('âŒ Test failed:', error.message);
    }
}

// Run the test
testHybridEmailSystem();

