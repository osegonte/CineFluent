#!/bin/bash
echo "🔧 Fixing Expo Version Compatibility Issues..."
echo "=============================================="

cd client

# Fix the React Native version compatibility
echo "📦 Fixing React Native version..."
npx expo install --fix

# Update to correct versions for SDK 49
echo "📦 Installing correct package versions for SDK 49..."
npx expo install react-native@0.72.10

# Clear cache and restart
echo "🧹 Clearing cache..."
npx expo start --clear

echo ""
echo "✅ Version compatibility fixed!"
echo "🌐 The web version should now work properly"
echo "📱 Press 'w' to open in browser when Metro finishes bundling"