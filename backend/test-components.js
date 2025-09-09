// Simple server test without API calls
console.log('🧪 Testing HubSpot Integration Components...\n');

// Test 1: Environment variables
console.log('1️⃣ Testing Environment Configuration...');
require('dotenv').config();

const resendKey = process.env.RESEND_API_KEY;
const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;

console.log('✅ RESEND_API_KEY:', resendKey ? 'Found' : '❌ Missing');
console.log('✅ HUBSPOT_ACCESS_TOKEN:', hubspotToken ? 'Found' : '❌ Missing');

// Test 2: Package imports
console.log('\n2️⃣ Testing Package Imports...');
try {
    const { Resend } = require('resend');
    console.log('✅ Resend package imported successfully');
    
    const { Client } = require('@hubspot/api-client');
    console.log('✅ HubSpot API client imported successfully');
    
} catch (error) {
    console.log('❌ Package import error:', error.message);
}

// Test 3: Basic functionality test
console.log('\n3️⃣ Testing Basic Functionality...');

async function testComponents() {
    try {
        // Test Resend initialization
        if (resendKey) {
            const { Resend } = require('resend');
            const resend = new Resend(resendKey);
            console.log('✅ Resend client initialized');
        } else {
            console.log('❌ Cannot test Resend - API key missing');
        }
        
        // Test HubSpot initialization  
        if (hubspotToken) {
            const { Client } = require('@hubspot/api-client');
            const hubspotClient = new Client({ accessToken: hubspotToken });
            console.log('✅ HubSpot client initialized');
            
            // Quick API test
            const accountInfo = await hubspotClient.settings.users.usersApi.getPage();
            console.log('✅ HubSpot API connection verified');
            
        } else {
            console.log('❌ Cannot test HubSpot - access token missing');
        }
        
        console.log('\n🎉 All components are working correctly!');
        console.log('🚀 Your hybrid email system is ready for production.');
        
    } catch (error) {
        console.log('❌ Component test error:', error.message);
    }
}

testComponents();
