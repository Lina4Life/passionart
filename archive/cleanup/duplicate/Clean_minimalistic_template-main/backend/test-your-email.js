/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
// Manual Email Test with Your Gmail
require('dotenv').config();
const { Resend } = require('resend');
const { Client } = require('@hubspot/api-client');

async function testWithYourEmail() {
    console.log('📧 TESTING WITH YOUR REAL EMAIL ADDRESS...\n');
    
    // CHANGE THIS TO YOUR ACTUAL GMAIL ADDRESS
    const yourEmail = 'your-gmail@gmail.com'; // ← PUT YOUR EMAIL HERE
    
    console.log('⚠️  REMEMBER TO UPDATE THE EMAIL ADDRESS ABOVE! ⚠️\n');
    
    if (yourEmail === 'your-gmail@gmail.com') {
        console.log('❌ Please edit this file and put your real Gmail address in line 8');
        console.log('📝 Change: const yourEmail = \'your-actual-email@gmail.com\';');
        return;
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
    
    try {
        console.log('1️⃣ Sending verification email to:', yourEmail);
        
        const verificationToken = 'real-test-' + Date.now();
        const verificationLink = `http://217.154.119.33/verify-email?token=${verificationToken}`;
        
        const emailData = {
            from: 'PassionArt <welcome@passionart.com>',
            to: [yourEmail],
            subject: '🎨 Welcome to PassionArt - Test Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 32px;">🎨 PassionArt</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Where Art Meets Passion</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Welcome to PassionArt! 🌟</h2>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                            This is a <strong>test email</strong> to verify that your PassionArt email system is working correctly!
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                            Click the button below to verify your email address:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationLink}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; padding: 15px 30px; text-decoration: none; 
                                      border-radius:25px; font-weight: bold; font-size: 16px;
                                      display: inline-block; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);">
                                ✨ Verify Email Address
                            </a>
                        </div>
                        
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #2563eb; margin: 0 0 10px 0;">🧪 Test Details:</h3>
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                <strong>Email Provider:</strong> Resend<br>
                                <strong>CRM Integration:</strong> HubSpot<br>
                                <strong>Website:</strong> http://217.154.119.33<br>
                                <strong>Test Time:</strong> ${new Date().toLocaleString()}
                            </p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                            If you received this email, your PassionArt integration is working perfectly! 🎉
                        </p>
                    </div>
                </div>
            `
        };
        
        const emailResult = await resend.emails.send(emailData);
        console.log('✅ TEST EMAIL SENT SUCCESSFULLY!');
        console.log('📧 Check your Gmail inbox for the verification email');
        console.log('⏰ It should arrive within a few seconds');
        
        console.log('\n2️⃣ Creating test contact in HubSpot...');
        
        const hubspotContact = {
            properties: {
                email: yourEmail,
                firstname: 'Test',
                lastname: 'User',
                website: 'http://217.154.119.33',
                company: 'PassionArt Test',
                hs_lead_status: 'NEW',
                lifecyclestage: 'lead'
            }
        };
        
        const contactResult = await hubspotClient.crm.contacts.basicApi.create(hubspotContact);
        console.log('✅ Test contact created in HubSpot!');
        console.log('👤 Contact ID:', contactResult.id);
        console.log('📧 You can check this contact in your HubSpot dashboard');
        
        console.log('\n🧹 Cleaning up test contact...');
        await hubspotClient.crm.contacts.basicApi.archive(contactResult.id);
        console.log('✅ Test contact cleaned up');
        
        console.log('\n🎉 REAL EMAIL TEST COMPLETE!');
        console.log('📧 Check your Gmail - you should receive a beautiful test email!');
        console.log('🔍 If you don\'t see it, check your spam/promotions folder');
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        if (error.response?.data) {
            console.log('Error details:', error.response.data);
        }
    }
}

testWithYourEmail();
