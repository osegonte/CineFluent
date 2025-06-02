#!/bin/bash
echo "🎨 Starting CineFluent Frontend & Testing Authentication..."
echo "================================================="

# Navigate to client directory
cd client

# Install dependencies if needed
echo "📦 Installing frontend dependencies..."
npm install

# Start the Expo development server
echo "📱 Starting Expo development server..."
echo ""
echo "🎯 Next Steps:"
echo "1. After Expo starts, press 'w' to open in web browser"
echo "2. Test the authentication flow:"
echo "   - Try creating a new account"
echo "   - Try logging in with your credentials"
echo "   - Backend API is running at: http://localhost:8000"
echo ""
echo "🔧 If you encounter issues:"
echo "   - Check backend is running: curl http://localhost:8000/health"
echo "   - Check API docs: http://localhost:8000/docs"
echo ""

npm start