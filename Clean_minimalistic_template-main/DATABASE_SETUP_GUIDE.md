# PostgreSQL Installation and Setup Guide for PassionArt

## Option 1: Install PostgreSQL Locally (Recommended for Development)

### Step 1: Install PostgreSQL
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the 'postgres' user
4. Make sure to install pgAdmin (included in the installer)

### Step 2: Add PostgreSQL to PATH
1. Find your PostgreSQL installation (usually `C:\Program Files\PostgreSQL\16\bin`)
2. Add this path to your Windows PATH environment variable
3. Restart your PowerShell/Command Prompt

### Step 3: Run Database Setup
1. Open PowerShell as Administrator
2. Navigate to your project: `cd "C:\Users\hp\Desktop\passionart"`
3. Run: `.\setup_database.ps1`
4. Enter your postgres password when prompted

## Option 2: Use Docker (Alternative)

If you prefer Docker, create this docker-compose.yml file:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: passionart
      POSTGRES_USER: passionart_user
      POSTGRES_PASSWORD: motdepasse
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database_setup.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose up -d
```

## Option 3: Manual Database Setup

If the script doesn't work, you can manually create the database:

1. Open pgAdmin or psql command line
2. Connect as postgres user
3. Run these commands:
   ```sql
   CREATE DATABASE passionart;
   CREATE USER passionart_user WITH PASSWORD 'motdepasse';
   GRANT ALL PRIVILEGES ON DATABASE passionart TO passionart_user;
   ALTER USER passionart_user CREATEDB;
   ```
4. Connect to the passionart database
5. Copy and paste the contents of `database_setup.sql`

## Verify Setup

After installation, test your connection:
```bash
psql -U passionart_user -d passionart -c "SELECT COUNT(*) FROM articles;"
```

You should see: `count: 8` (the sample articles)

## Environment Variables

Your `.env` file is already configured correctly:
```
DB_HOST=localhost
DB_NAME=passionart
DB_USER=passionart_user
DB_PASSWORD=motdepasse
DB_PORT=5432
```

## Next Steps

1. Start your backend server: `cd backend && npm start`
2. Test the API health endpoint: http://localhost:3000/api/health
3. Your database is ready for the full application!
