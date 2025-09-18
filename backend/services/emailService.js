// Basic email service for PassionArt feedback system
// This is a placeholder implementation that logs emails to console
// In production, you would integrate with services like Resend, SendGrid, etc.

const sendEmail = async (emailData) => {
  try {
    console.log('ðŸ“§ Sending email:');
    console.log(`From: ${emailData.from}`);
    console.log(`To: ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log('Body (HTML):', emailData.html);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // For development, we'll just log the email instead of actually sending it
    console.log('âœ… Email "sent" successfully (development mode)');
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('âŒ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail
};
