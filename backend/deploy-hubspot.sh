#!/bin/bash

# PassionArt HubSpot Production Deployment Script
# Run this script on your server to deploy with HubSpot integration

echo "🚀 Starting PassionArt HubSpot Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the backend directory."
    exit 1
fi

print_status "Found package.json, proceeding with deployment..."

# Stop any existing processes
print_status "Stopping existing Node.js processes..."
pkill -f node 2>/dev/null || true
pm2 stop all 2>/dev/null || true

# Install/update dependencies
print_status "Installing dependencies..."
npm install

# Check if HubSpot package is installed
if npm list @hubspot/api-client >/dev/null 2>&1; then
    print_status "✅ HubSpot API client is installed"
else
    print_error "❌ HubSpot API client not found, installing..."
    npm install @hubspot/api-client
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Creating template..."
    cat > .env << EOF
# HubSpot Configuration - REPLACE WITH YOUR VALUES
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
HUBSPOT_HUB_ID=your_hub_id_here

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret - REPLACE WITH SECURE SECRET
JWT_SECRET=your_secure_jwt_secret_here

# Frontend URL - UPDATE WITH YOUR DOMAIN
FRONTEND_URL=http://217.154.119.33

# Database Configuration (if using PostgreSQL)
# DB_HOST=localhost
# DB_NAME=passionart
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_PORT=5432
EOF
    print_error "❌ Please edit the .env file with your actual HubSpot credentials!"
    print_error "   Edit with: nano .env"
    print_error "   You need to add your HUBSPOT_ACCESS_TOKEN and HUBSPOT_HUB_ID"
    exit 1
else
    print_status "✅ .env file exists"
fi

# Check if HubSpot credentials are configured
if grep -q "your_hubspot_access_token_here" .env; then
    print_error "❌ HubSpot credentials not configured in .env file!"
    print_error "   Please edit .env and add your actual HubSpot access token"
    print_error "   Edit with: nano .env"
    exit 1
fi

# Create uploads directory if it doesn't exist
print_status "Creating uploads directory..."
mkdir -p uploads

# Set proper permissions
print_status "Setting permissions..."
chmod 755 uploads

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 process manager..."
    npm install -g pm2
fi

# Start the application with PM2
print_status "Starting PassionArt backend with PM2..."
pm2 start app.js --name "passionart-backend" --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
pm2 startup

print_status "✅ Deployment completed!"
print_status ""
print_status "🔧 Next steps:"
print_status "1. Verify your .env file has correct HubSpot credentials"
print_status "2. Update frontend index.html with your HubSpot Hub ID"
print_status "3. Test the API endpoints:"
print_status "   curl http://localhost:5000/api/hubspot/test"
print_status ""
print_status "📊 Monitor with:"
print_status "   pm2 status"
print_status "   pm2 logs passionart-backend"
print_status ""
print_status "🌐 Your API should be available at: http://217.154.119.33:5000"

# Show current status
print_status "Current PM2 status:"
pm2 status
