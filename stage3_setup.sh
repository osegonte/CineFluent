# CineFluent Stage 3 - Installation & Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Stage 2 backend running on `http://localhost:8000`
- iOS Simulator (for iOS testing) or Android Emulator (for Android testing)

### 1. Setup Project Structure

```bash
# From your CineFluent root directory
chmod +x stage3_setup.sh
./stage3_setup.sh
```

This creates the React Native client structure in the `client/` directory.

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Copy Application Files

Copy the following files from the artifacts into your `client/` directory:

#### Main App Files
- Copy `App.tsx` to `client/App.tsx`
- Copy `babel.config.js` to `client/babel.config.js`

#### Services & API Integration
- Copy authentication service to `client/src/services/`
- Copy API clients to `client/src/services/api/`
- Copy custom hooks to `client/src/hooks/`

#### Navigation
- Copy navigation files to `client/src/navigation/`

#### Screens
- Copy auth screens to `client/src/screens/auth/`
- Copy dashboard screen to `client/src/screens/dashboard/`
- Copy other screens to their respective directories

#### Components
- Copy UI components to `client/src/components/`

### 4. Install Additional Dependencies

```bash
# Install babel plugin for path resolution
npm install --save-dev babel-plugin-module-resolver

# Install React Navigation dependencies for Expo
npx expo install react-native-screens react-native-safe-area-context
```

### 5. Start Development Server

```bash
# Start the Expo development server
npm start
```

## 📱 Testing the Application

### Backend Verification
Before testing the client, ensure your Stage 2 backend is running:

```bash
# In your main CineFluent directory
python -m cinefluent.api.main
```

Visit http://localhost:8000/health to confirm it's working.

### Client Testing Options

#### 1. Web Testing (Easiest)
```bash
npm start
# Press 'w' to open in web browser
```

#### 2. iOS Simulator
```bash
npm start
# Press 'i' to open iOS simulator
```

#### 3. Android Emulator
```bash
npm start
# Press 'a' to open Android emulator
```

#### 4. Physical Device
```bash
npm start
# Scan QR code with Expo Go app
```

## 🧪 Feature Testing Checklist

### Authentication Flow
- [ ] Register new account with valid email/password
- [ ] Login with existing credentials
- [ ] Validate password requirements
- [ ] Handle registration/login errors
- [ ] Auto-login on app restart (if previously logged in)
- [ ] Logout functionality

### Dashboard Screen
- [ ] Display user greeting with email prefix
- [ ] Show current streak count
- [ ] Display words learned count
- [ ] Continue learning card (shows empty state initially)
- [ ] Weekly goal progress
- [ ] Pull-to-refresh functionality

### Navigation
- [ ] Bottom tab navigation works
- [ ] All 4 tabs accessible (Dashboard, Vocabulary, Leaderboard, Profile)
- [ ] Tab icons display correctly
- [ ] Active/inactive tab states

### API Integration
- [ ] Authentication tokens stored securely
- [ ] API calls include Bearer token
- [ ] Handle 401 errors (auto logout)
- [ ] Loading states during API calls
- [ ] Error handling for network issues

### Placeholder Screens
- [ ] Vocabulary screen displays practice options
- [ ] Leaderboard shows mock data and tabs
- [ ] Profile screen shows user info and settings
- [ ] All interactive elements respond to taps

## 🐛 Common Issues & Solutions

### Build Errors

**Module resolution issues:**
```bash
# Clear Expo cache
expo r -c
```

**Metro bundler issues:**
```bash
# Reset Metro cache
npx expo start -c
```

### API Connection Issues

**Cannot connect to backend:**
1. Ensure backend is running on port 8000
2. Check `.env` file has correct `EXPO_PUBLIC_API_BASE_URL`
3. For physical device testing, use your computer's IP:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000
   ```

**CORS errors:**
1. Verify backend CORS settings include your client URL
2. Check `cinefluent/api/config.py` CORS origins

### Authentication Issues

**Tokens not persisting:**
- Ensure `expo-secure-store` is properly installed
- Check device/simulator supports secure storage

**Login/Register failing:**
- Verify backend `/api/v1/auth/` endpoints are working
- Test with curl or Postman first
- Check network connectivity

### UI Issues

**Fonts not loading:**
```bash
# Restart with cache clearing
expo start -c
```

**Icons not displaying:**
- Ensure `@expo/vector-icons` is installed
- Try restarting the development server

## 📊 Performance Testing

### Memory Usage
- Monitor app memory usage during navigation
- Check for memory leaks when switching tabs
- Test with multiple API calls

### Network Efficiency
- Verify API calls are cached appropriately
- Check that images load efficiently
- Test offline behavior

### Animation Performance
- Test smooth transitions between screens
- Verify button press animations work
- Check loading spinner performance

## 🚀 Building for Production

### Development Build
```bash
# Create development build
expo build:ios --type simulator
expo build:android --type apk
```

### Production Build
```bash
# Configure app.json for production
expo build:ios --type app-store
expo build:android --type app-bundle
```

## 📈 Next Steps After Stage 3

Once basic client is working:

1. **Implement Lesson View Screen**
   - Subtitle display with translations
   - Quiz functionality
   - Progress tracking

2. **Add Real API Integration**
   - Replace mock data with real API calls
   - Implement error boundaries
   - Add retry logic

3. **Enhanced UI/UX**
   - Add animations and micro-interactions
   - Implement pull-to-refresh
   - Add haptic feedback

4. **Offline Support**
   - Cache lesson data
   - Offline progress tracking
   - Sync when online

5. **Push Notifications**
   - Daily streak reminders
   - New content alerts
   - Achievement notifications

## 🎯 Success Criteria

Your Stage 3 client is successful when:

- [ ] User can register and login
- [ ] Dashboard displays personalized data
- [ ] All navigation works smoothly
- [ ] API integration is functional
- [ ] App runs on iOS, Android, and Web
- [ ] No critical performance issues
- [ ] Authentication persists across sessions

## 📞 Getting Help

If you encounter issues:

1. Check the browser/device console for errors
2. Verify backend API is responding correctly
3. Test API endpoints independently with curl/Postman
4. Check Expo documentation for platform-specific issues
5. Review React Navigation docs for navigation problems

The foundation is now ready for building the complete lesson and vocabulary features in future iterations!