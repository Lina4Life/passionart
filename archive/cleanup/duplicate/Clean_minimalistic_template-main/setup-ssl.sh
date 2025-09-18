#!/bin/bash

# SSL Certificate Setup Script for PassionArt
# Run this after basic server setup

echo "🔒 Setting up SSL Certificate with Let's Encrypt..."

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop Nginx temporarily
sudo systemctl stop nginx

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy Nginx configuration
sudo cp nginx-config.conf /etc/nginx/sites-available/passionart

# Enable the site
sudo ln -s /etc/nginx/sites-available/passionart /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start services
sudo systemctl start nginx
sudo systemctl enable nginx

# Start PassionArt with PM2
cd /var/www/passionart
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Set up automatic SSL renewal
sudo crontab -e
# Add this line: 0 12 * * * /usr/bin/certbot renew --quiet

echo "✅ SSL Certificate setup complete!"
echo "🚀 Your site should now be live at https://yourdomain.com"
