const { sendVerificationEmail } = require('./controllers/resend.controller');

async function testEmail() {
  console.log('Testing email send...');
  
  // Replace with your actual email address to test
  const testEmail = 'youssefelgharib03@gmail.com'; // Corrected email address
  const testToken = 'test-verification-token-123';
  
  try {
    const result = await sendVerificationEmail(testEmail, testToken);
    console.log('Email test result:', result);
    
    if (result.success) {
      console.log('âœ… Email sent successfully to:', testEmail);
      console.log('Check your inbox!');
    } else {
      console.log('âŒ Email failed:', result.error);
    }
  } catch (error) {
    console.log('âŒ Email error:', error.message);
  }
  
  process.exit(0);
}

testEmail();

