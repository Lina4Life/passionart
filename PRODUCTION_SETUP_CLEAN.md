# 🔧 Quick Production Setup for 217.154.119.33

## Current Status ✅
- **Server**: http://217.154.119.33/ (LIVE)
- **Backend**: Likely running on port 3001
- **Database**: SQLite with 31 users
- **HubSpot**: Integrated with your private app token

## Immediate Action Items

### 1. Update Backend Environment (.env)
```bash
# On your server:
cd /var/www/passionart/backend
nano .env

# Add these production values:
NODE_ENV=production
PORT=3001
CORS_ORIGINS=http://217.154.119.33
FRONTEND_URL=http://217.154.119.33
BACKEND_URL=http://217.154.119.33:3001

# Your existing tokens:
HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here
RESEND_API_KEY=your_resend_key_here
```

### 2. Update Frontend API Configuration
```bash
# Update frontend/src/services/api.js
const API_BASE_URL = 'http://217.154.119.33:3001/api';
```

### 3. Pull Latest Changes on Server
```bash
# SSH to your server
ssh root@217.154.119.33

# Navigate to your app
cd /var/www/passionart

# Pull latest code
git pull origin main

# Install dependencies (if needed)
cd backend && npm install
cd ../frontend && npm install && npm run build
```

### 4. Restart Services
```bash
# If using PM2:
pm2 restart all

# If using systemctl:
sudo systemctl restart your-app-name

# If running manually:
pkill node
cd /var/www/passionart/backend && npm start &
```

## Security Improvements (Recommended)

### 1. Set Up HTTPS (SSL)
```bash
# Install certbot
sudo apt update
sudo apt install certbot

# If you get a domain name later:
sudo certbot --nginx -d yourdomain.com
```

### 2. Configure Firewall
```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3001  # Your backend
sudo ufw enable
```

### 3. Secure Database
```bash
# Set proper permissions
chmod 600 /var/www/passionart/backend/data/passionart.db
chown www-data:www-data /var/www/passionart/backend/data/passionart.db
```

## Production Monitoring

### Health Check URLs
- Frontend: http://217.154.119.33/
- Backend API: http://217.154.119.33:3001/api/health
- Database Admin: http://217.154.119.33/admin

### Quick Tests
```bash
# Test backend
curl http://217.154.119.33:3001/api/health

# Test database
curl http://217.154.119.33:3001/api/database/info

# Test HubSpot integration
curl -X POST http://217.154.119.33:3001/api/hybrid-email/test
```

## Backup Strategy
```bash
# Daily database backup
0 2 * * * /usr/bin/sqlite3 /var/www/passionart/backend/data/passionart.db ".backup /backups/passionart-$(date +\%Y\%m\%d).db"

# Weekly uploads backup
0 3 * * 0 tar -czf /backups/uploads-$(date +\%Y\%m\%d).tar.gz /var/www/passionart/backend/uploads/
```

## Performance Tips
1. **Enable Gzip compression** (already in nginx-config.conf)
2. **Set up CDN** for static assets
3. **Database optimization**:
   ```sql
   PRAGMA journal_mode=WAL;
   PRAGMA synchronous=NORMAL;
   PRAGMA cache_size=10000;
   ```

## Estimated Costs

### Budget Deployment ($5-15/month)
- VPS: $5/month (DigitalOcean)
- Domain: $10-15/year
- SSL: Free (Let's Encrypt)

### Professional Deployment ($20-50/month)
- Managed hosting: $20-30/month
- CDN: $5-10/month  
- Monitoring: $5-15/month
- Backup service: $5/month

---

Your PassionArt platform is production-ready! 🚀
