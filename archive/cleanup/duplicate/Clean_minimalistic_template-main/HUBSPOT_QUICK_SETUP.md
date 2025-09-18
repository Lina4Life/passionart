# 🚀 HubSpot Quick Setup Checklist

## ✅ **What You Need to Do:**

### **1. Get HubSpot Credentials (5 minutes)**
```
□ Go to https://developers.hubspot.com/
□ Login with your HubSpot account
□ Create a new Private App called "PassionArt"
□ Enable these permissions:
  - contacts (Read & Write)
  - timeline (Write)
  - transactional-email (Send)
  - automation (Write)
□ Copy your Access Token
□ Note down your Hub ID (from Settings → Account & Billing)
```

### **2. Server Deployment (10 minutes)**
```
□ SSH into your server: ssh root@217.154.119.33
□ Navigate to your project: cd /path/to/passionart
□ Pull latest code: git pull origin main
□ Go to backend: cd backend
□ Install dependencies: npm install
□ Make deploy script executable: chmod +x deploy-hubspot.sh
□ Run deployment: ./deploy-hubspot.sh
□ Edit .env file: nano .env
  - Add your HUBSPOT_ACCESS_TOKEN
  - Add your HUBSPOT_HUB_ID
□ Restart: pm2 restart passionart-backend
```

### **3. Frontend Update (2 minutes)**
```
□ Edit frontend/index.html
□ Replace YOUR_HUB_ID with your actual Hub ID
□ Deploy frontend changes
```

### **4. Test Everything (5 minutes)**
```
□ Run test script: node test-hubspot.js
□ Test registration: Create a new account
□ Check HubSpot: Verify contact was created
□ Test email: Try password reset
□ Check analytics: Verify website tracking
```

## 🔧 **Server Commands You'll Need:**

### **Basic Setup:**
```bash
# 1. Connect to server
ssh root@217.154.119.33

# 2. Navigate to project
cd /path/to/passionart/backend

# 3. Install HubSpot package
npm install @hubspot/api-client

# 4. Create .env file
nano .env
```

### **Environment Variables (.env file):**
```env
HUBSPOT_ACCESS_TOKEN=pat-na1-your-token-here
HUBSPOT_HUB_ID=12345678
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secure-secret
FRONTEND_URL=http://217.154.119.33
```

### **Start Application:**
```bash
# Kill existing processes
pkill -f node

# Start with PM2
pm2 start app.js --name passionart-backend
pm2 save
pm2 startup
```

### **Testing:**
```bash
# Test API
curl http://localhost:5000/api/health

# Test HubSpot
curl http://localhost:5000/api/hubspot/test

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'
```

## 🔍 **How to Verify It's Working:**

### **1. Check Server Logs:**
```bash
pm2 logs passionart-backend
```

### **2. Check HubSpot Dashboard:**
```
□ Login to HubSpot
□ Go to Contacts → Contacts
□ Look for new contacts from registrations
□ Check Marketing → Email for sent emails
□ Check Reports → Analytics for website traffic
```

### **3. Test Registration Flow:**
```
□ Go to your website
□ Register a new account
□ Check your email for verification
□ Check HubSpot for the new contact
□ Verify website tracking is working
```

## ⚠️ **Common Issues:**

| Issue | Solution |
|-------|----------|
| "Invalid access token" | Check .env file, regenerate token |
| "Module not found @hubspot/api-client" | Run `npm install @hubspot/api-client` |
| "Port 5000 already in use" | Run `pkill -f node` then restart |
| "CORS errors" | Check FRONTEND_URL in .env |
| "No emails sending" | Verify HubSpot permissions include transactional-email |

## 📞 **Need Help?**
- Check server logs: `pm2 logs passionart-backend`
- Test HubSpot connection: `node test-hubspot.js`
- HubSpot API docs: https://developers.hubspot.com/docs/api/overview

---

**🎯 Your Goal:** Get all checkboxes ✅ and see new contacts appearing in HubSpot when users register!
