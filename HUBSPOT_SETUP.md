# HubSpot Email Integration Setup Guide

## 🚀 PassionArt HubSpot Email System

Your PassionArt platform has been successfully switched from Resend to **HubSpot** for email delivery.

### ✅ What's Been Updated:

1. **Backend Controllers**: 
   - `hubspot.controller.js` - Handles all email functionality via HubSpot API
   - `auth.controller.js` - Now uses HubSpot for verification emails

2. **API Endpoints**:
   - `/api/hubspot/send-bulk-email` - Send emails to all users
   - `/api/hubspot/test-connection` - Test HubSpot connectivity
   - `/api/hubspot/stats` - Get user email statistics

3. **Frontend Admin Panel**:
   - Updated to display "HubSpot Email System"
   - Test connection button now tests HubSpot
   - All email sending goes through HubSpot

4. **Dual Email Delivery**:
   - User verification emails sent to actual user email address
   - Admin notifications sent to `youssefelgharib03@gmail.com`

### 🔧 Required Setup:

#### 1. Get HubSpot Access Token:
1. Go to [HubSpot Developer Portal](https://developers.hubspot.com/)
2. Create a new **Private App** in your HubSpot account
3. Enable **Marketing Email** permissions
4. Copy your **Access Token**

#### 2. Update Environment Variables:
Edit your `.env` file and replace the placeholder:
```env
HUBSPOT_ACCESS_TOKEN=your_actual_hubspot_private_app_token_here
```

#### 3. HubSpot App Permissions Required:
- ✅ **Marketing Email** - Send marketing emails
- ✅ **Settings** - Read account info for connection testing
- ✅ **CRM Objects** - Manage contacts (optional)

### 📧 Email Features:

#### **Verification Emails** (Registration):
- **User receives**: Beautiful verification email at their email address
- **Admin receives**: Notification email at `youssefelgharib03@gmail.com`
- **Template**: Professional PassionArt branding with verification button

#### **Bulk Email System** (Admin Panel):
- Send emails to all users or verified users only
- Beautiful HTML templates with PassionArt styling
- Batch processing to avoid rate limits
- Real-time status reporting

#### **Connection Testing**:
- Admin panel includes "Test Connection" button
- Verifies HubSpot API connectivity
- Shows connection status and service info

### 🔗 API Endpoints Reference:

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/hubspot/test-connection` | GET | Test HubSpot connection | Admin |
| `/api/hubspot/send-bulk-email` | POST | Send bulk emails | Admin |
| `/api/hubspot/stats` | GET | Get email statistics | Admin |

### 📝 Email Templates:

All emails use responsive HTML templates with:
- PassionArt gradient branding
- Mobile-friendly design
- Professional typography
- Clear call-to-action buttons

### 🔧 Troubleshooting:

#### Connection Issues:
1. **Check Access Token**: Ensure `HUBSPOT_ACCESS_TOKEN` is correct
2. **Verify Permissions**: Private app needs Marketing Email permissions
3. **Test in Admin Panel**: Use "Test Connection" button

#### Email Delivery Issues:
1. **Check HubSpot Logs**: View email sending logs in HubSpot dashboard
2. **Verify Domains**: Ensure sender domains are verified in HubSpot
3. **Rate Limits**: HubSpot has rate limits, adjust batch sizes if needed

### 🚀 Next Steps:

1. **Get HubSpot Access Token** and update `.env` file
2. **Test Connection** in Admin Panel
3. **Send Test Email** to verify functionality
4. **Register New User** to test verification email flow

### 💡 Production Notes:

- **Domain Verification**: For production, verify your domain in HubSpot
- **From Addresses**: Update `@passionart.com` addresses to your actual domain
- **Rate Limits**: HubSpot has generous rate limits for email sending
- **Analytics**: HubSpot provides detailed email analytics and tracking

---

## 🎉 Your system is now running on HubSpot!

The server is currently running on port 5000 with HubSpot integration ready to use.
