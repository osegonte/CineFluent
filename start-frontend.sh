#!/bin/bash
echo "🎨 Starting CineFluent Frontend..."
cd client

# Clear node_modules and reinstall for clean state
echo "🧹 Cleaning up node_modules..."
rm -rf node_modules package-lock.json

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start Expo development server
echo ""
echo "📱 Starting Expo development server..."
echo "🌐 Web: http://localhost:19006"
echo "📱 Mobile: Use Expo Go app to scan QR code"
echo ""
npm start
