# Temporary Server Setup Without HubSpot

## 🚀 **Deploy Without HubSpot First:**

1. **SSH to your server:**
   ```bash
   ssh root@217.154.119.33
   ```

2. **Navigate to your project:**
   ```bash
   cd /path/to/passionart
   git pull origin main
   cd backend
   ```

3. **Create minimal .env:**
   ```bash
   cat > .env << EOF
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your_secure_jwt_secret_here
   FRONTEND_URL=http://217.154.119.33
   
   # HubSpot - Will add later when we get access
   # HUBSPOT_ACCESS_TOKEN=
   # HUBSPOT_HUB_ID=146822551
   EOF
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the server:**
   ```bash
   pm2 stop all
   pm2 start app.js --name passionart-backend
   pm2 save
   ```

6. **Test it's working:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📝 **What Works Now:**
- ✅ Website tracking (with Hub ID 146822551)
- ✅ User registration
- ✅ Admin dashboard
- ✅ Database operations
- ❌ Email sending (needs HubSpot token)

## 🔄 **Add HubSpot Later:**
Once you get access to create the Private App:
1. Create the Private App
2. Get the Access Token
3. Add it to your .env file
4. Restart the server

This way your site works now, and you can add HubSpot email features later!
