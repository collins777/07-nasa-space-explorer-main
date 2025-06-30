@echo off
REM Script to prepare for GitHub push - replaces config.js with GitHub-safe version

echo Preparing for GitHub push...

REM Backup current config
copy js\config.js js\config.local.js.backup >nul

REM Replace with GitHub-safe version  
copy js\config.github.js js\config.js >nul

echo ✅ Config file replaced with GitHub-safe version
echo 📁 Your local config backed up as config.local.js.backup
echo 🚀 Ready to push to GitHub!
echo.
echo To restore local config after push:
echo    copy js\config.local.js.backup js\config.js
