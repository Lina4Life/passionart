# HubSpot Integration Setup Guide for Production Server

## 🚀 **Step 1: Get HubSpot API Access Token**

1. **Go to HubSpot Developer Portal**:
   - Visit: https://developers.hubspot.com/
   - Login with your HubSpot account

2. **Create a Private App**:
   - Go to "Apps" → "Private Apps"
   - Click "Create private app"
   - Name it "PassionArt Integration"

3. **Set Permissions** (Scopes needed):
   ```
   ✅ contacts (Read & Write)
   ✅ timeline (Write) 
   ✅ transactional-email (Send)
   ✅ crm.objects.contacts.read
   ✅ crm.objects.contacts.write
   ✅ automation (Write)
   ```

4. **Copy the Access Token** - You'll need this for the .env file

## 🔧 **Step 2: Server Environment Setup**

### **A. Install Dependencies**
```bash
# On your server, navigate to your project directory
cd /path/to/your/passionart/backend

# Install HubSpot API client
npm install @hubspot/api-client

# Install other required dependencies if missing
npm install dotenv cors express multer sqlite3 bcrypt jsonwebtoken
```

### **B. Create/Update .env file**
```bash
# Create .env file on your server
nano .env
```

Add these environment variables:
```env
# HubSpot Configuration
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
HUBSPOT_HUB_ID=your_hub_id_here

# Server Configuration  
PORT=5000
NODE_ENV=production

# Database (if using PostgreSQL instead of SQLite)
DB_HOST=localhost
DB_NAME=passionart
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Frontend URL
FRONTEND_URL=http://217.154.119.33
```

## 🌐 **Step 3: HubSpot Website Tracking Setup**

### **A. Get Your Hub ID**
1. In HubSpot, go to Settings → Account & Billing
2. Copy your **Hub ID** number
3. Update the frontend tracking code

### **B. Update Frontend Tracking Code**
In your `frontend/index.html`, replace the placeholder:
```html
<!-- Replace YOUR_HUB_ID with your actual Hub ID -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/YOUR_HUB_ID.js"></script>
```

## 🔄 **Step 4: Test HubSpot Integration**

### **A. Test API Connection**
```bash
# Test if HubSpot API is working
curl -X GET "http://your-server-ip:5000/api/hubspot/test" \
  -H "Content-Type: application/json"
```

### **B. Test Email Sending**
```bash
# Test email sending functionality
curl -X POST "http://your-server-ip:5000/api/hubspot/send-verification" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","verificationToken":"test123"}'
```

### **C. Test User Registration with HubSpot Sync**
```bash
# Test user registration (should create contact in HubSpot)
curl -X POST "http://your-server-ip:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","firstName":"Test","lastName":"User"}'
```

## 🔍 **Step 5: Verify HubSpot Integration**

### **Check in HubSpot Dashboard:**
1. **Contacts**: New registrations should appear as contacts
2. **Email**: Verification emails should be tracked
3. **Analytics**: Website visits should be tracked
4. **Timeline**: User activities should be logged

## ⚠️ **Common Issues & Solutions**

### **Issue 1: "HubSpot API client not found"**
```bash
# Install the package
npm install @hubspot/api-client
```

### **Issue 2: "Invalid access token"**
- Check your access token in .env file
- Ensure the private app has correct permissions
- Regenerate token if needed

### **Issue 3: "CORS errors"**
```javascript
// In app.js, ensure CORS is configured:
app.use(cors({
  origin: ['http://217.154.119.33', 'https://217.154.119.33'],
  credentials: true
}));
```

### **Issue 4: "Port already in use"**
```bash
# Kill existing processes
pkill -f node
# Or if using PM2
pm2 stop all
pm2 delete all
```

## 🚀 **Step 6: Production Deployment**

### **A. Start the Application**
```bash
# Option 1: Direct start
NODE_ENV=production node app.js

# Option 2: Using PM2 (recommended)
npm install -g pm2
pm2 start app.js --name "passionart-backend"
pm2 startup
pm2 save
```

### **B. Configure Nginx (if using reverse proxy)**
```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 📊 **Step 7: Monitor HubSpot Integration**

### **Check Logs**
```bash
# View application logs
pm2 logs passionart-backend

# Or if running directly
tail -f /path/to/your/app/logs/app.log
```

### **Monitor HubSpot Dashboard**
- Check contact creation in HubSpot
- Monitor email delivery rates
- Review website analytics
- Check API usage limits

## 🔑 **Quick Setup Commands for Server**

```bash
# 1. Navigate to project
cd /path/to/passionart/backend

# 2. Install dependencies
npm install @hubspot/api-client

# 3. Create .env with your values
echo "HUBSPOT_ACCESS_TOKEN=your_token_here" > .env

# 4. Start application
pm2 start app.js --name passionart-backend

# 5. Check status
pm2 status
```

## 📱 **Frontend Updates Needed**

1. Replace `YOUR_HUB_ID` in index.html with actual Hub ID
2. Update any hardcoded API URLs to point to your server
3. Test email verification flow
4. Verify HubSpot tracking is working

---

**📞 Need Help?**
- HubSpot API Documentation: https://developers.hubspot.com/docs/api/overview
- HubSpot Community: https://community.hubspot.com/
- Check server logs for detailed error messages
