# PassionArt Database Setup Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "PassionArt Database Setup" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Check if PostgreSQL is installed
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "PostgreSQL not found in PATH. Please install PostgreSQL first." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

Write-Host "PostgreSQL found: $($psqlPath.Source)" -ForegroundColor Green

# Set database credentials from .env file
$DB_USER = "passionart_user"
$DB_NAME = "passionart"
$DB_PASSWORD = "motdepasse"

Write-Host "`nStep 1: Creating database and user..." -ForegroundColor Yellow

# Create database and user (you'll need to enter postgres password)
Write-Host "Please enter your PostgreSQL superuser (postgres) password when prompted:"
& psql -U postgres -c "CREATE DATABASE $DB_NAME;"
& psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
& psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
& psql -U postgres -c "ALTER USER $DB_USER CREATEDB;"

Write-Host "`nStep 2: Setting up tables and sample data..." -ForegroundColor Yellow

# Run the setup script
$env:PGPASSWORD = $DB_PASSWORD
& psql -U $DB_USER -d $DB_NAME -f "database_setup.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDatabase setup completed successfully!" -ForegroundColor Green
    Write-Host "Your database is ready with:" -ForegroundColor Cyan
    Write-Host "- All required tables created" -ForegroundColor Cyan
    Write-Host "- Sample categories and articles added" -ForegroundColor Cyan
    Write-Host "- Database user: $DB_USER" -ForegroundColor Cyan
    Write-Host "- Database name: $DB_NAME" -ForegroundColor Cyan
    
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Start your backend server: cd backend && npm run dev" -ForegroundColor White
    Write-Host "2. Your .env file is already configured correctly" -ForegroundColor White
    Write-Host "3. Test the connection by checking http://localhost:3000/api/health" -ForegroundColor White
} else {
    Write-Host "`nDatabase setup failed. Please check the error messages above." -ForegroundColor Red
}

# Clean up environment variable
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
