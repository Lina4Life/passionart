# PassionArt Application Launcher
# PowerShell script to start both backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PASSION-ART APPLICATION LAUNCHER" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectPath = "C:\Users\hp\Desktop\passionart"
Set-Location $projectPath

Write-Host "[1/3] Stopping any existing Node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

Write-Host "[2/3] Starting Backend Server (Port 5000)..." -ForegroundColor Green
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\hp\Desktop\passionart\backend"
    node app.js
}

# Wait for backend to start
Start-Sleep -Seconds 3

Write-Host "[3/3] Starting Frontend Server (Port 5173)..." -ForegroundColor Green
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\hp\Desktop\passionart\frontend"
    npm run dev
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     SERVERS LAUNCHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  " -NoNewline; Write-Host "http://localhost:5000" -ForegroundColor Blue
Write-Host "Frontend: " -NoNewline; Write-Host "http://localhost:5173" -ForegroundColor Blue  
Write-Host "Admin:    " -NoNewline; Write-Host "http://localhost:5173/admin" -ForegroundColor Blue
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Yellow
Write-Host "Email:    admin@passionart.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""

# Wait for user input
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Application opened in browser!" -ForegroundColor Green
Write-Host ""
Write-Host "Job IDs for server management:" -ForegroundColor Yellow
Write-Host "Backend Job ID:  $($backendJob.Id)" -ForegroundColor White
Write-Host "Frontend Job ID: $($frontendJob.Id)" -ForegroundColor White
Write-Host ""
Write-Host "To stop servers, run: Stop-Job $($backendJob.Id), $($frontendJob.Id)" -ForegroundColor Yellow
Write-Host "Or simply close this PowerShell window." -ForegroundColor Yellow
Write-Host ""

# Keep script running
Write-Host "Press Ctrl+C to stop all servers and exit..." -ForegroundColor Red
try {
    while ($true) {
        Start-Sleep -Seconds 5
        # Check if jobs are still running
        if ((Get-Job -Id $backendJob.Id).State -eq "Failed") {
            Write-Host "Backend server stopped unexpectedly!" -ForegroundColor Red
        }
        if ((Get-Job -Id $frontendJob.Id).State -eq "Failed") {
            Write-Host "Frontend server stopped unexpectedly!" -ForegroundColor Red
        }
    }
} finally {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Id $backendJob.Id, $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id, $frontendJob.Id -ErrorAction SilentlyContinue
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Green
}
