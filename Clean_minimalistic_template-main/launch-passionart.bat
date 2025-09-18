@echo off
title PassionArt Launcher
color 0A

echo.
echo  ██████╗  █████╗ ███████╗███████╗██╗ ██████╗ ███╗   ██╗      █████╗ ██████╗ ████████╗
echo  ██╔══██╗██╔══██╗██╔════╝██╔════╝██║██╔═══██╗████╗  ██║     ██╔══██╗██╔══██╗╚══██╔══╝
echo  ██████╔╝███████║███████╗███████╗██║██║   ██║██╔██╗ ██║     ███████║██████╔╝   ██║   
echo  ██╔═══╝ ██╔══██║╚════██║╚════██║██║██║   ██║██║╚██╗██║     ██╔══██║██╔══██╗   ██║   
echo  ██║     ██║  ██║███████║███████║██║╚██████╔╝██║ ╚████║     ██║  ██║██║  ██║   ██║   
echo  ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
echo.
echo                               Application Launcher v1.0
echo  ================================================================================
echo.

REM Change to project directory
cd /d "C:\Users\hp\Desktop\passionart"

echo  [INFO] Stopping any existing servers...
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo  [INFO] Starting Backend Server on Port 5000...
start "PassionArt Backend - DO NOT CLOSE" cmd /k "title PassionArt Backend Server && color 0E && echo. && echo ========================================== && echo    PASSION-ART BACKEND SERVER && echo    Port: 5000 && echo ========================================== && echo. && cd backend && node app.js"

echo  [INFO] Waiting for backend to initialize...
timeout /t 4 /nobreak >nul

echo  [INFO] Starting Frontend Server on Port 5173...
start "PassionArt Frontend - DO NOT CLOSE" cmd /k "title PassionArt Frontend Server && color 0B && echo. && echo ========================================== && echo    PASSION-ART FRONTEND SERVER && echo    Port: 5173 && echo ========================================== && echo. && cd frontend && npm run dev"

echo  [INFO] Waiting for frontend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo  ================================================================================
echo                               LAUNCH COMPLETE!
echo  ================================================================================
echo.
echo   Backend Server:  http://localhost:5000
echo   Frontend App:    http://localhost:5173
echo   Admin Panel:     http://localhost:5173/admin
echo.
echo   Default Admin Login:
echo   ► Email:    admin@passionart.com
echo   ► Password: admin123
echo.
echo  ================================================================================
echo.
echo  [READY] Press any key to open PassionArt in your browser...
pause >nul

echo  [ACTION] Opening PassionArt in your default browser...
start http://localhost:5173

echo.
echo  [SUCCESS] PassionArt is now running!
echo.
echo  IMPORTANT: Keep the server windows open while using the application.
echo            Close them to stop the servers.
echo.
echo  Press any key to exit this launcher...
pause >nul
