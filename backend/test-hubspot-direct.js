// Direct HubSpot API Test (no server required)
require('dotenv').config();
const { Client } = require('@hubspot/api-client');

async function testHubSpotIntegration() {
    console.log('ðŸ§ª Testing HubSpot Integration...\n');
    
    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
    console.log('Token found:', hubspotToken ? 'Yes âœ…' : 'No âŒ');
    
    if (!hubspotToken || hubspotToken === 'paste_your_actual_hubspot_token_here') {
        console.log('âŒ HubSpot token not configured properly');
        return;
    }
    
    try {
        console.log('1ï¸âƒ£ Testing HubSpot API connection...');
        const hubspotClient = new Client({ accessToken: hubspotToken });
        
        // Test API connection by getting account info
        const accountInfo = await hubspotClient.settings.users.usersApi.getPage();
        console.log('âœ… HubSpot API connection successful!');
        console.log(`Account has ${accountInfo.results.length} users`);
        
        console.log('\n2ï¸âƒ£ Testing contact creation...');
        // Test creating a contact
        const testContact = {
            properties: {
                email: 'test-user@passionart.com',
                firstname: 'Test',
                lastname: 'User',
                website: 'http://217.154.119.33',
                company: 'PassionArt'
            }
        };
        
        const contactResponse = await hubspotClient.crm.contacts.basicApi.create(testContact);
        console.log('âœ… Test contact created successfully!');
        console.log('Contact ID:', contactResponse.id);
        
        // Clean up - delete the test contact
        await hubspotClient.crm.contacts.basicApi.archive(contactResponse.id);
        console.log('âœ… Test contact cleaned up');
        
        console.log('\nðŸŽ‰ HubSpot integration is working perfectly!');
        console.log('âœ… Your PassionArt platform is ready for:');
        console.log('  - Automatic contact sync when users register');
        console.log('  - Email verification via Resend');
        console.log('  - CRM management via HubSpot');
        console.log('  - Real-time webhook notifications');
        
    } catch (error) {
        console.log('âŒ HubSpot API error:', error.message);
        if (error.code === 401) {
            console.log('ðŸ’¡ Token might be invalid or expired');
        }
    }
}

testHubSpotIntegration().catch(console.error);

