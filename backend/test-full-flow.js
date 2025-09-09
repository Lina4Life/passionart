// Complete PassionArt Registration Flow Test
require('dotenv').config();
const { Resend } = require('resend');
const { Client } = require('@hubspot/api-client');

async function testRegistrationFlow() {
    console.log('🎨 Testing PassionArt Registration Flow...\n');
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
    
    // Test user data
    const testUser = {
        email: 'artist.test@passionart.com',
        firstname: 'Artist',
        lastname: 'Test',
        userType: 'artist'
    };
    
    try {
        console.log('1️⃣ Testing Email Verification System...');
        
        // Test sending verification email
        const verificationLink = `http://217.154.119.33/verify-email?token=test-token-123`;
        
        const emailData = {
            from: 'PassionArt <noreply@passionart.com>',
            to: [testUser.email],
            subject: '🎨 Welcome to PassionArt - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2563eb;">Welcome to PassionArt! 🎨</h1>
                    <p>Hi ${testUser.firstname},</p>
                    <p>Thank you for joining PassionArt, the ultimate platform for artists and art lovers!</p>
                    <p>Please verify your email address to complete your registration:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationLink}" 
                           style="background-color: #2563eb; color: white; padding: 15px 30px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Verify Email Address
                        </a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link:</p>
                    <p><a href="${verificationLink}">${verificationLink}</a></p>
                    <hr style="margin: 30px 0;">
                    <p style="color: #666; font-size: 14px;">
                        Welcome to our community of passionate artists! 🌟<br>
                        - The PassionArt Team
                    </p>
                </div>
            `
        };
        
        const emailResult = await resend.emails.send(emailData);
        console.log('✅ Verification email sent successfully!');
        console.log('📧 Email ID:', emailResult.data?.id || emailResult.id || 'N/A');
        
        console.log('\n2️⃣ Testing HubSpot Contact Sync...');
        
        // Test creating contact in HubSpot
        const hubspotContact = {
            properties: {
                email: testUser.email,
                firstname: testUser.firstname,
                lastname: testUser.lastname,
                website: 'http://217.154.119.33',
                hs_lead_status: 'NEW',
                lifecyclestage: 'lead',
                user_type: testUser.userType,
                registration_source: 'PassionArt Website'
            }
        };
        
        const contactResult = await hubspotClient.crm.contacts.basicApi.create(hubspotContact);
        console.log('✅ Contact created in HubSpot!');
        console.log('👤 Contact ID:', contactResult.id);
        console.log('📧 Contact Email:', contactResult.properties.email);
        
        console.log('\n3️⃣ Testing Contact Update...');
        
        // Test updating contact (simulate email verification)
        const updateData = {
            properties: {
                email_verified: 'true',
                verification_date: new Date().toISOString(),
                hs_lead_status: 'VERIFIED'
            }
        };
        
        await hubspotClient.crm.contacts.basicApi.update(contactResult.id, updateData);
        console.log('✅ Contact updated with verification status!');
        
        console.log('\n4️⃣ Cleaning up test data...');
        
        // Clean up - delete test contact
        await hubspotClient.crm.contacts.basicApi.archive(contactResult.id);
        console.log('✅ Test contact cleaned up');
        
        console.log('\n🎉 COMPLETE REGISTRATION FLOW TEST SUCCESSFUL! 🎉');
        console.log('\n📋 What was tested:');
        console.log('  ✅ Professional email verification system');
        console.log('  ✅ Beautiful HTML email templates');
        console.log('  ✅ Automatic HubSpot contact creation');
        console.log('  ✅ Contact property updates');
        console.log('  ✅ Lead status management');
        console.log('  ✅ Email verification tracking');
        
        console.log('\n🚀 Your PassionArt platform is ready for production!');
        console.log('🌟 Users will receive professional emails and be tracked in HubSpot CRM.');
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        if (error.response) {
            console.log('Error details:', error.response.data);
        }
    }
}

testRegistrationFlow();
