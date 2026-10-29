@echo off
title Salah Auditor - Launcher
echo ===================================================
echo     Salah Auditor - Agri AI Verification Platform
echo ===================================================
echo.
echo Choose an option to start:
echo [1] Start Node.js Backend API (Port 5000)
echo [2] Start React Frontend (Vite)
echo [3] Start Both (Backend + Frontend)
echo.
set /p choice="Enter choice (1, 2, or 3): "

if "%choice%"=="1" (
    cd backend
    npm run dev
)
if "%choice%"=="2" (
    cd frontend
    npm run dev
)
if "%choice%"=="3" (
    start cmd /k "cd backend && npm run dev"
    start cmd /k "cd frontend && npm run dev"
)
pause
