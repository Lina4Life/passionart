const { Resend } = require('resend');

const resend = new Resend('re_AS2hfFer_2sWWNn7ySNdB6uo1XxszmjVR');

async function testResendDirect() {
  console.log('Testing Resend with their exact example format...');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'youssefelgharib03@gmail.com', // Fixed email address
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });

    if (error) {
      console.error('âŒ Resend error:', error);
      return;
    }

    console.log('âœ… Email sent successfully!');
    console.log('Response data:', data);
    
    // Now test with our PassionArt format
    console.log('\nTesting with PassionArt verification email...');
    
    const verificationUrl = `http://localhost:5174/verify-email?token=test-token-123`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; line-height: 1.6; color: #333333; text-align: center; }
            .content h2 { color: #667eea; margin-top: 0; }
            .content p { margin: 0 0 20px 0; }
            .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius:25px; margin: 20px 0; font-weight: 600; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { margin: 0; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PassionArt</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for joining PassionArt! Please verify your email address to complete your registration.</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                If you didn't create an account with PassionArt, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>Best regards,<br>The PassionArt Team</p>
              <p style="margin-top: 20px;">Â© 2025 PassionArt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: data2, error: error2 } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's verified domain
      to: 'youssefelgharib03@gmail.com', // Fixed email address
      subject: 'Verify Your PassionArt Account',
      html: htmlContent,
      text: `Please verify your PassionArt account by clicking this link: ${verificationUrl}`
    });

    if (error2) {
      console.error('âŒ PassionArt email error:', error2);
      return;
    }

    console.log('âœ… PassionArt verification email sent successfully!');
    console.log('Response data:', data2);
    
  } catch (error) {
    console.error('âŒ Test failed:', error);
  }
}

testResendDirect();

