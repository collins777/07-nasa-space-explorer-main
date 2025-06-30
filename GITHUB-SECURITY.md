# 🔐 GitHub Security Guide

## Quick Setup for GitHub Push

Your NASA API key is currently embedded in the code for local development. Before pushing to GitHub, follow these steps:

### Option 1: Automatic (Recommended)
```bash
# On Windows:
prepare-for-github.bat

# On Mac/Linux:
./prepare-for-github.sh
```

### Option 2: Manual
1. **Before pushing to GitHub:**
   ```bash
   # Backup your local config
   cp js/config.js js/config.local.js.backup
   
   # Use GitHub-safe version
   cp js/config.github.js js/config.js
   ```

2. **After pushing, restore your local config:**
   ```bash
   cp js/config.local.js.backup js/config.js
   ```

## How It Works

### Local Development (current setup)
- Your API key is stored in `config.js` for immediate use
- Key automatically saved to localStorage on first run
- Full functionality with your personal rate limits

### GitHub Version
- Uses `DEMO_KEY` as default
- Prompts users to enter their own API key
- No sensitive data in repository

## Files Explained

- `js/config.js` - Your local version (contains API key)
- `js/config.github.js` - GitHub-safe version (no API key)
- `js/config.local.js.backup` - Automatic backup of your local config

## Security Features

✅ API key auto-stored in localStorage  
✅ GitHub-safe fallback version available  
✅ Automatic backup system  
✅ No sensitive data in git history  

Your app works locally with your API key, but GitHub gets a clean version! 🚀
