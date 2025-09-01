# 📧 Resend Email Integration Setup

## 🚀 Quick Setup Guide

### 1. Get Your Resend API Key
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (40,000 emails/month free!)
3. Go to **API Keys** in your dashboard
4. Click **Create API Key**
5. Copy your API key (starts with `re_`)

### 2. Update Your Environment
1. Open `backend/.env`
2. Replace `your_resend_api_key_here` with your actual API key:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### 3. Domain Setup (Optional)
- **For testing**: Use the default `resend.dev` domain
- **For production**: Add your custom domain in Resend dashboard

### 4. Test the Integration
1. Go to Admin Dashboard → Mail tab
2. Click "Test Connection" to verify setup
3. Send a test email to verify everything works

## ✨ Features Available

### 📤 **Bulk Email Sending**
- Send to all verified users
- Beautiful HTML templates
- Batch processing to avoid rate limits
- Real-time delivery statistics

### 📊 **Email Analytics**
- Delivery tracking
- User verification stats
- Email service status monitoring

### 🎨 **Professional Templates**
- Responsive HTML emails
- PassionArt branding
- Dark/light mode support
- Mobile-friendly design

### 🔐 **Security Features**
- Admin-only access
- JWT token authentication
- Email verification system
- Rate limiting protection

## 🛠️ API Endpoints

- `POST /api/resend/send-bulk-email` - Send to all users
- `POST /api/resend/send-welcome` - Welcome new users
- `GET /api/resend/test-connection` - Test API connection
- `GET /api/resend/stats` - Get email statistics

## 💡 Pro Tips

1. **Testing**: Use your own email first to test templates
2. **Deliverability**: Keep content professional to avoid spam filters
3. **Frequency**: Don't spam users - respect their inbox
4. **Analytics**: Monitor delivery rates in Resend dashboard

## 🆘 Troubleshooting

**Connection Failed?**
- Check your API key is correct
- Ensure no typos in .env file
- Restart the backend server

**Emails not sending?**
- Verify recipient emails are valid
- Check Resend dashboard for errors
- Ensure users have verified emails

**Need Help?**
- Check Resend documentation: https://resend.com/docs
- Review error messages in browser console
- Test with smaller batches first

---

**🎉 You're all set! Resend provides excellent deliverability and a great developer experience.**
