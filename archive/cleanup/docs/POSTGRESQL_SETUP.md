# PostgreSQL Setup Instructions for PassionArt Platform

## Option 1: Download and Install PostgreSQL Manually

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Choose PostgreSQL 17 (Windows x86-64)

2. **Install PostgreSQL:**
   - Run the downloaded installer
   - Follow the setup wizard
   - **IMPORTANT:** Remember the password you set for the 'postgres' user
   - Keep the default port: 5432
   - Install all components (PostgreSQL Server, pgAdmin 4, Command Line Tools)

3. **Verify Installation:**
   ```powershell
   # After installation, restart your terminal and try:
   psql --version
   ```

## Option 2: Use Docker (Alternative)

If you prefer Docker:
```powershell
# Pull and run PostgreSQL in Docker
docker run --name passionart-db -e POSTGRES_PASSWORD=admin123 -e POSTGRES_DB=passionart_db -p 5432:5432 -d postgres:17

# Connect to the container
docker exec -it passionart-db psql -U postgres -d passionart_db
```

## Step 2: Setup the Database

1. **Open Command Prompt/PowerShell as Administrator**

2. **Connect to PostgreSQL:**
   ```powershell
   # Replace 'your_password' with the password you set during installation
   psql -U postgres -h localhost
   ```

3. **Run the Database Setup Script:**
   ```sql
   # Copy and paste the contents of backend/database_setup.sql
   # Or run it directly:
   \i C:/Users/hp/Desktop/passionart/backend/database_setup.sql
   ```

## Step 3: Update Environment Variables (Already Done)

The `.env` file in the backend folder is already configured:
```
DB_HOST=localhost
DB_NAME=passionart_db
DB_USER=passionart_user
DB_PASSWORD=motdepasse
DB_PORT=5432
```

## Step 4: Test the Connection

1. **Restart your backend server** (nodemon will auto-restart)

2. **Test the API:**
   ```powershell
   # Test admin stats (should show real database counts)
   $headers = @{"Authorization"="Bearer test"}
   Invoke-RestMethod -Uri "http://localhost:3000/api/admin/stats" -Method GET -Headers $headers
   ```

3. **Check users in database:**
   ```powershell
   $headers = @{"Authorization"="Bearer test"}
   Invoke-RestMethod -Uri "http://localhost:3000/api/admin/users" -Method GET -Headers $headers
   ```

## What Changes After PostgreSQL Setup

✅ **Real Database Statistics:** Dashboard will show actual counts from database
✅ **Persistent User Data:** Users created via "Add User" will persist between server restarts
✅ **Password Visibility:** Eye icon will show actual stored passwords
✅ **Real Product/Article Data:** Sample data will be loaded from the database_setup.sql
✅ **Proper User Management:** Full CRUD operations with proper data persistence

## Current Status (Fallback Mode)

Since PostgreSQL is not installed yet, the backend is running in "fallback mode":
- Mock data is used for all operations
- User creation works but data resets on server restart
- Statistics are hardcoded values
- Password eye icon shows mock passwords

## Next Steps

1. Install PostgreSQL using Option 1 above
2. Run the database setup script
3. Restart the backend server
4. Test the real database integration
5. Create users and see them persist between server restarts

## Troubleshooting

If you encounter issues:
1. Make sure PostgreSQL service is running
2. Check the connection parameters in `.env`
3. Verify the database and user were created correctly
4. Check the backend terminal for connection errors
