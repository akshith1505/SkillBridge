@echo off
title SkillBridge - AI Industry Skill Alignment Platform
echo ====================================================================
echo   SkillBridge - AI Industry Skill Alignment Platform
echo   Next-Gen Workforce & Skill Intelligence Platform
echo ====================================================================
echo.
echo Starting SkillBridge Frontend Development Server...
echo The application will open in your default browser automatically!
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo ====================================================================
echo.

cd /d "%~dp0frontend"
npm run dev
pause
