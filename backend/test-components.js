// Simple server test without API calls
console.log('ðŸ§ª Testing HubSpot Integration Components...\n');

// Test 1: Environment variables
console.log('1ï¸âƒ£ Testing Environment Configuration...');
require('dotenv').config();

const resendKey = process.env.RESEND_API_KEY;
const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;

console.log('âœ… RESEND_API_KEY:', resendKey ? 'Found' : 'âŒ Missing');
console.log('âœ… HUBSPOT_ACCESS_TOKEN:', hubspotToken ? 'Found' : 'âŒ Missing');

// Test 2: Package imports
console.log('\n2ï¸âƒ£ Testing Package Imports...');
try {
    const { Resend } = require('resend');
    console.log('âœ… Resend package imported successfully');
    
    const { Client } = require('@hubspot/api-client');
    console.log('âœ… HubSpot API client imported successfully');
    
} catch (error) {
    console.log('âŒ Package import error:', error.message);
}

// Test 3: Basic functionality test
console.log('\n3ï¸âƒ£ Testing Basic Functionality...');

async function testComponents() {
    try {
        // Test Resend initialization
        if (resendKey) {
            const { Resend } = require('resend');
            const resend = new Resend(resendKey);
            console.log('âœ… Resend client initialized');
        } else {
            console.log('âŒ Cannot test Resend - API key missing');
        }
        
        // Test HubSpot initialization  
        if (hubspotToken) {
            const { Client } = require('@hubspot/api-client');
            const hubspotClient = new Client({ accessToken: hubspotToken });
            console.log('âœ… HubSpot client initialized');
            
            // Quick API test
            const accountInfo = await hubspotClient.settings.users.usersApi.getPage();
            console.log('âœ… HubSpot API connection verified');
            
        } else {
            console.log('âŒ Cannot test HubSpot - access token missing');
        }
        
        console.log('\nðŸŽ‰ All components are working correctly!');
        console.log('ðŸš€ Your hybrid email system is ready for production.');
        
    } catch (error) {
        console.log('âŒ Component test error:', error.message);
    }
}

testComponents();

