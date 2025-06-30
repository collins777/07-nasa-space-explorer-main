#!/bin/bash
# Script to prepare for GitHub push - replaces config.js with GitHub-safe version

echo "Preparing for GitHub push..."

# Backup current config
cp js/config.js js/config.local.js.backup

# Replace with GitHub-safe version
cp js/config.github.js js/config.js

echo "✅ Config file replaced with GitHub-safe version"
echo "📁 Your local config backed up as config.local.js.backup"
echo "🚀 Ready to push to GitHub!"
echo ""
echo "To restore local config after push:"
echo "   cp js/config.local.js.backup js/config.js"
