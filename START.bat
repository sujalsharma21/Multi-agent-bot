@echo off
title Multi-Bot AI Platform
color 0A
set ROOT=%~dp0
if "%ROOT:~-1%"=="\" set ROOT=%ROOT:~0,-1%

echo Starting Ollama...
where ollama >nul 2>&1
if %errorlevel%==0 (
    start "MB-Ollama" /min cmd /k "ollama serve"
    timeout /t 3 /nobreak >nul
) else (
    echo Ollama not found - download from https://ollama.com/download
)

echo Starting Backend...
if not exist "%ROOT%\.venv\Scripts\python.exe" (
    echo [ERROR] .venv not found & pause & exit /b
)
start "MB-Backend" /min cmd /c "cd /d "%ROOT%\backend" && "%ROOT%\.venv\Scripts\python.exe" -m uvicorn main:app"
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "MB-Frontend" /min cmd /c "cd /d "%ROOT%\frontend" && npm run dev"
timeout /t 5 /nobreak >nul

start http://localhost:5173
echo All running! Close this window anytime.
timeout /t 3 /nobreak >nul
exit
