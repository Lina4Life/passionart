# Default Admin Account Information for PassionArt

## Admin Login Credentials

**Email:** `admin@passionart.com`  
**Password:** `admin123`

## Creating the Admin Account

### Option 1: Automatic (Recommended)
After setting up the database, run:
```bash
node create_admin.js
```

### Option 2: Manual via API
Once your backend is running, make a POST request to register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@passionart.com",
    "password": "admin123",
    "userType": "admin",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### Option 3: Direct Database Insert
Connect to your database and run:
```sql
-- First, hash the password using bcrypt with salt rounds 10
-- The hashed version of 'admin123' is: $2b$10$example...

INSERT INTO users (email, password, user_type, is_active, is_verified) 
VALUES (
  'admin@passionart.com', 
  '$2b$10$YourHashedPasswordHere', 
  'admin', 
  true, 
  true
);
```

## Admin Features Access

Once logged in as admin, you'll have access to:

🎛️ **Management Dashboard** - `/management`
- Overview of all site activity
- User statistics and analytics
- Revenue and order tracking

👥 **User Management**
- View all registered users (Artists, Galleries, Collectors, Institutions)
- Activate/deactivate accounts
- View user profiles and details

🎨 **Product Management**
- Approve/reject artist submissions
- Feature/unfeature artworks
- Manage product categories
- Set pricing and availability

📝 **Article Management**
- Create, edit, and publish articles
- Manage article categories
- View article analytics

📧 **Newsletter Management**
- View subscriber list
- Send newsletters
- Manage subscriptions

🛒 **Order Management**
- Process orders
- Update order status
- Handle refunds and disputes

## Security Notes

⚠️ **IMPORTANT:** 
1. Change the default password immediately after first login
2. Use a strong, unique password
3. Consider enabling 2FA in production
4. Regularly review admin activity logs

## Next Steps

1. Set up your database with PostgreSQL
2. Run the admin creation script
3. Start your backend server
4. Log in and change the default password
5. Configure your admin dashboard preferences
