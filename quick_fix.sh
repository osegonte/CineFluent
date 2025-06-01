#!/bin/bash
# quick_fix.sh - Fix CineFluent client dependencies and structure

echo "🔧 Fixing CineFluent client setup..."

# Make sure we're in the client directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the client directory"
    exit 1
fi

# Step 1: Clean up existing installation
echo "🧹 Cleaning up existing installation..."
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force

# Step 2: Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/{navigation,hooks,components/{common,forms,ui,dashboard},screens/{auth,dashboard,vocabulary,leaderboard,profile},services/auth}

# Step 3: Install compatible dependencies with Expo
echo "📦 Installing Expo dependencies..."
npx expo install react-native-screens react-native-safe-area-context

# Step 4: Install other dependencies with legacy peer deps to avoid conflicts
echo "📦 Installing remaining dependencies..."
npm install --legacy-peer-deps

echo "✅ Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the navigation files from the artifacts above"
echo "2. Copy the auth service from the artifacts above"
echo "3. Copy the placeholder screens from the artifacts above"
echo "4. Create babel.config.js from the artifact above"
echo "5. Run: npm start"
echo ""
echo "🚀 Once all files are in place, test with:"
echo "   npm start"
echo "   Press 'w' for web development"