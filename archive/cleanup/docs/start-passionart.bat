@echo off
echo ========================================
echo    PASSION-ART APPLICATION LAUNCHER
echo ========================================
echo.
echo Starting PassionArt servers...
echo.

REM Change to the project directory
cd /d "C:\Users\hp\Desktop\passionart"

echo [1/3] Stopping any existing Node processes...
taskkill /f /im node.exe >nul 2>&1

echo [2/3] Starting Backend Server (Port 5000)...
start "PassionArt Backend" cmd /k "cd backend && echo Backend Server Starting... && node app.js"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend Server (Port 5173)...
start "PassionArt Frontend" cmd /k "cd frontend && echo Frontend Server Starting... && npm run dev"

echo.
echo ========================================
echo     SERVERS LAUNCHED SUCCESSFULLY!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo Admin:    http://localhost:5173/admin
echo.
echo Login Credentials:
echo Email:    admin@passionart.com
echo Password: admin123
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open the application in default browser
start http://localhost:5173

echo.
echo Application opened in browser!
echo.
echo To stop the servers, close the terminal windows
echo or press Ctrl+C in each terminal.
echo.
pause
