#!/bin/bash

# PassionArt Production Deployment Script
# Run this on your Ubuntu/Debian server

echo "🚀 Starting PassionArt Production Deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Clone your repository
cd /var/www
sudo git clone https://github.com/Lina4Life/passionart.git
sudo chown -R $USER:$USER /var/www/passionart

# Navigate to project
cd passionart

# Install backend dependencies
cd backend
npm install --production

# Install frontend dependencies and build
cd ../frontend
npm install
npm run build

# Create PM2 ecosystem file
cd ..
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'passionart-backend',
    script: './backend/app.js',
    cwd: '/var/www/passionart',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Set up environment variables
cat > backend/.env << EOF
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_NAME=passionart
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=5432

# HubSpot Configuration
HUBSPOT_ACCESS_TOKEN=your_hubspot_token

# Resend Configuration  
RESEND_API_KEY=your_resend_key

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
EOF

echo "✅ Basic setup complete!"
echo "📝 Next steps:"
echo "1. Configure your domain in Nginx"
echo "2. Set up SSL certificate"
echo "3. Configure your database"
echo "4. Update environment variables"
echo "5. Start the application with PM2"
