@echo off
echo Stopping all servers...
taskkill /f /im "python.exe" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Backend - FastAPI" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Frontend - Vite" >nul 2>&1
echo Done. All servers stopped.
pause
