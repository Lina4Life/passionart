# 🔗 HubSpot Website Integration Guide

## Complete Setup for PassionArt + HubSpot Integration

Your PassionArt platform is now ready for complete HubSpot integration! This will let you track all website activity, user behavior, and manage leads directly in HubSpot.

### 🚀 **Step 1: Get Your HubSpot Credentials**

#### A. Get Your Hub ID (for website tracking):
1. Login to [app.hubspot.com](https://app.hubspot.com)
2. Go to **Settings** → **Tracking & Analytics** → **Tracking Code**
3. Find your Hub ID in the tracking code:
   ```html
   <script src="//js.hs-scripts.com/YOUR_HUB_ID.js"></script>
   ```
4. Copy the numbers (YOUR_HUB_ID)

#### B. Get Your Private App Token (for API access):
1. Go to **Settings** → **Integrations** → **Private Apps**
2. Click **Create a private app**
3. Name it "PassionArt Integration"
4. **Required Scopes**:
   - ✅ **crm.objects.contacts.read**
   - ✅ **crm.objects.contacts.write** 
   - ✅ **marketing-email.read**
   - ✅ **marketing-email.write**
   - ✅ **timeline.read**
   - ✅ **settings.users.read**
5. Click **Create app** and copy the **Access Token**

### 🔧 **Step 2: Update Your Configuration**

#### A. Update Environment Variables:
Edit your `.env` file:
```env
# Replace with your actual HubSpot Private App token
HUBSPOT_ACCESS_TOKEN=pat-na1-your-actual-token-here
```

#### B. Update Website Tracking Code:
In `frontend/index.html`, replace `YOUR_HUB_ID` with your actual Hub ID:
```html
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/12345678.js"></script>
```

### 📊 **What You'll See in HubSpot:**

#### **Contacts Dashboard**:
- 👤 **Automatic Contact Creation**: Every user registration creates a HubSpot contact
- 📧 **Email Sync**: All email addresses synced automatically
- 🏷️ **Custom Properties**: 
  - `passionart_username`
  - `passionart_registration_date`
  - `passionart_user_type`

#### **Website Analytics**:
- 📈 **Page Views**: Track all page visits
- 🎯 **User Behavior**: See what users do on your site
- 📊 **Conversion Tracking**: Track registrations and email verifications
- 🔄 **Session Recording**: See how users interact with your platform

#### **Email Marketing**:
- 📧 **Automated Workflows**: Set up email sequences for new users
- 🎨 **Professional Templates**: Use HubSpot's email builder
- 📈 **Email Analytics**: Open rates, click rates, engagement metrics

### 🚀 **Step 3: Test Your Integration**

#### A. Test API Connection:
1. Start your server: `npm start` or `node app.js`
2. Go to Admin Panel → HubSpot Email System
3. Click **"Test Connection"** - should show "Connected"

#### B. Test Contact Sync:
1. Register a new user on your platform
2. Check HubSpot → Contacts
3. New contact should appear automatically

#### C. Test Website Tracking:
1. Visit your website with the tracking code
2. Go to HubSpot → Reports → Website Analytics
3. Should see real-time visitor data

### 📋 **Available API Endpoints:**

| Endpoint | Purpose | Data Tracked |
|----------|---------|--------------|
| `/api/hubspot/analytics` | Get contact analytics | Total contacts, recent signups |
| `/api/hubspot/test-connection` | Test API connectivity | Connection status |
| `/api/hubspot/stats` | Email statistics | User counts, verified emails |
| `/api/hubspot/send-bulk-email` | Mass email campaigns | Email delivery stats |

### 🎯 **HubSpot Features You Can Now Use:**

#### **Lead Management**:
- 🔥 **Lead Scoring**: Automatically score users based on activity
- 📋 **Custom Properties**: Track PassionArt-specific data
- 🎯 **Lead Status Tracking**: NEW → QUALIFIED → CUSTOMER

#### **Marketing Automation**:
- 📧 **Welcome Email Series**: Auto-send to new users
- 🎨 **Abandoned Cart**: Email users who don't complete verification
- 🔄 **Re-engagement**: Win back inactive users

#### **Analytics & Reporting**:
- 📊 **Custom Dashboards**: Track PassionArt metrics
- 📈 **Growth Tracking**: Monitor user acquisition
- 🎯 **Conversion Funnels**: See registration to verification rates

### 🔧 **Advanced Setup (Optional):**

#### **Custom Events Tracking**:
Your system automatically tracks:
- ✅ User registration
- ✅ Email verification
- ✅ Profile updates

#### **Webhooks** (for real-time sync):
Set up HubSpot webhooks to sync data both ways:
1. Go to **Settings** → **Integrations** → **Webhooks**
2. Add webhook URL: `https://yoursite.com/api/hubspot/webhook`
3. Select events: Contact updates, Deal changes

### 📱 **HubSpot Mobile App**:
- Download HubSpot mobile app
- Get real-time notifications when users register
- View analytics on the go

### 🚨 **Troubleshooting:**

#### **Connection Issues**:
- ✅ Check access token is correct
- ✅ Verify required scopes are enabled
- ✅ Test connection in admin panel

#### **Tracking Not Working**:
- ✅ Check Hub ID in tracking code
- ✅ Clear browser cache
- ✅ Test in incognito mode

#### **Contacts Not Syncing**:
- ✅ Check server logs for errors
- ✅ Verify CRM permissions
- ✅ Test with new registration

---

## 🎉 **You're All Set!**

Once configured, you'll have complete visibility into:
- 👥 **Who visits your website**
- 📧 **Email engagement rates**
- 🎨 **User journey through your platform**
- 📊 **Growth metrics and analytics**
- 🎯 **Lead conversion rates**

Your PassionArt platform will now be a powerful lead generation and user engagement machine powered by HubSpot! 🚀
