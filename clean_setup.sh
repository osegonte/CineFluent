cat > clean_setup.sh << 'EOF'
#!/bin/bash
echo "🧹 Complete clean setup..."

# Remove everything
rm -rf node_modules package-lock.json app.json app.config.js

# Create minimal app.json WITHOUT problematic plugins
cat > app.json << 'EOL'
{
  "expo": {
    "name": "CineFluent",
    "slug": "cinefluent", 
    "version": "1.0.0",
    "orientation": "portrait",
    "splash": {
      "backgroundColor": "#6366f1"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#6366f1"
      }
    },
    "web": {
      "bundler": "metro"
    }
  }
}
EOL

# Create minimal package.json
cat > package.json << 'EOL'
{
  "name": "cinefluent-client",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/stack": "^6.3.29",
    "expo": "~49.0.15",
    "expo-linear-gradient": "~12.3.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-gesture-handler": "~2.12.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-screens": "~3.22.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "typescript": "^5.1.3"
  },
  "private": true
}
EOL

npm install
EOF