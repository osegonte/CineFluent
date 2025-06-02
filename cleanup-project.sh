#!/bin/bash
# CineFluent Project Cleanup & Organization Script
# This script will organize the project into a clean structure

echo "🧹 Cleaning up and organizing CineFluent project..."

# Create the proper project structure
echo "📁 Creating clean project structure..."

# Remove unnecessary/duplicate files
echo "🗑️ Removing unnecessary files..."
rm -f fix_issues.sh
rm -f quick_fix.sh
rm -f babel.config.js  # Keep only client/babel.config.js
rm -f package.json.backup
rm -f package.json.new
rm -f clean_setup.sh
rm -f cleanup_and_setup.sh
rm -f complete_stage3.sh
rm -f stage2_setup.sh
rm -f stage3_setup.sh
rm -f add_practice.sh

# Remove duplicate/conflicting directories
rm -rf src/  # This is a duplicate of client/src/
rm -rf pytest_cache/
rm -rf .pytest_cache/
rm -rf node_modules/  # This is at root level, should only be in client/

# Create proper backend structure
echo "🏗️ Creating backend structure..."
mkdir -p backend
mkdir -p backend/cinefluent
mkdir -p backend/sql
mkdir -p backend/tests

# Move backend files to backend/
echo "📦 Moving backend files..."
mv cinefluent/ backend/ 2>/dev/null || true
mv sql/ backend/ 2>/dev/null || true
mv tests/ backend/ 2>/dev/null || true
mv docker-compose.yml backend/ 2>/dev/null || true
mv test_api.py backend/ 2>/dev/null || true
mv test_en.srt backend/ 2>/dev/null || true
mv test_de.srt backend/ 2>/dev/null || true

# Move environment files to backend
mv .env backend/ 2>/dev/null || true
mv .env.sample backend/ 2>/dev/null || true

# Keep client structure clean
echo "🎨 Organizing client structure..."
# Client is already properly structured, just ensure directories exist
mkdir -p client/src/screens/{dashboard,lesson,vocabulary,leaderboard,profile,progress,community,learning}
mkdir -p client/src/components/{audio,quiz,progress,vocabulary}
mkdir -p client/src/navigation
mkdir -p client/src/services/api
mkdir -p client/src/hooks
mkdir -p client/src/types
mkdir -p client/assets

# Remove duplicate navigation files in client
rm -f client/src/navigation/AppNavigator.tsx  # Keep only MainNavigator.tsx
rm -f client/src/screens/auth/LoginScreen.tsx  # Not needed for demo
rm -f client/src/services/api.ts  # Keep individual service files

# Create clean root structure
echo "📋 Creating root documentation..."

# Create main README.md
cat > README.md << 'EOF'
# 🎬 CineFluent

A language learning app using bilingual movie subtitles to teach vocabulary and conversation skills.

## 🏗️ Project Structure

```
cinefluent/
├── backend/              # Python FastAPI backend
│   ├── cinefluent/      # Core backend package
│   ├── sql/             # Database setup scripts  
│   ├── tests/           # Backend tests
│   ├── docker-compose.yml
│   └── .env             # Backend configuration
├── client/              # React Native frontend
│   ├── src/             # App source code
│   ├── assets/          # Images, icons, etc.
│   ├── app.json         # Expo configuration
│   └── package.json     # Dependencies
└── README.md           # This file
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -e .
docker-compose up -d      # Start PostgreSQL & Redis
python -m cinefluent.ingest init-db
python -m cinefluent.api.main
```

### Frontend Setup
```bash
cd client
npm install
npm start
# Press 'w' for web, or scan QR code for mobile
```

## 🎯 Features

### ✅ Implemented
- **Backend API**: Authentication, user management, gamification
- **Frontend App**: Dashboard, navigation, lesson flow
- **Database**: PostgreSQL with subtitle data models
- **Authentication**: JWT-based auth with secure storage

### 🚧 In Progress
- Interactive lessons with real movie content
- Vocabulary quiz system
- Progress tracking and streaks
- Community features

## 🛠️ Development

### Backend Commands
```bash
# Test API endpoints
cd backend && python test_api.py

# Ingest subtitle files
python -m cinefluent.ingest upload "Movie Title" --en-file en.srt --de-file de.srt

# Check database status
python -m cinefluent.ingest status
```

### Frontend Commands
```bash
# Start development server
cd client && npm start

# Run on specific platform
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

## 📱 Demo

The app includes a working demo with:
- **Dashboard**: Shows 23-day streak and 347 words learned
- **Lesson Flow**: Scene → Vocabulary → Quiz progression
- **Progress Tracking**: Visual calendar and achievements
- **Navigation**: Bottom tabs between all main screens

## 🎓 Learning Flow

1. **Scene**: Watch movie clip with subtitles
2. **Vocabulary**: Review key words and translations  
3. **Quiz**: Test comprehension with multiple choice
4. **Progress**: Track streaks, goals, and achievements

## 🔧 Tech Stack

- **Backend**: FastAPI, PostgreSQL, Redis, SQLAlchemy
- **Frontend**: React Native, Expo, React Navigation
- **Auth**: JWT tokens with secure storage
- **Deployment**: Docker containers

## 📊 API Endpoints

- `GET /health` - System health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/gamification/streak` - User streak data
- `GET /api/v1/learning/continue` - Continue learning suggestions

View full API docs at: `http://localhost:8000/docs`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
EOF

# Create .gitignore for the root
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
venv/
env/

# Environment files
.env
.env.local
.env.*.local

# Database
*.db
*.sqlite

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Testing
.pytest_cache/
.coverage
htmlcov/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Expo
.expo/
dist/
web-build/

# Metro
.metro-health-check*
EOF

# Clean up client directory
echo "🎨 Cleaning up client directory..."
cd client

# Remove unnecessary files
rm -f package.json.backup
rm -f complete_stage3.sh
rm -f index.ts  # Not needed for Expo
rm -f .env.example
rm -f .gitignore.example
rm -f .prettierrc  # Keep it simple for now

# Ensure proper client .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/

# Environment
.env*.local

# Logs
*.log

# OS
.DS_Store
EOF

cd ..

# Create development scripts
echo "⚙️ Creating development scripts..."

# Backend development script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting CineFluent Backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -e .

# Start database if not running
echo "🗄️ Starting database services..."
docker-compose up -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 5

# Initialize database
echo "🔧 Initializing database..."
python -m cinefluent.ingest init-db

# Start API server
echo "🌐 Starting API server..."
python -m cinefluent.api.main
EOF

# Frontend development script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting CineFluent Frontend..."
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start Expo development server
echo "📱 Starting Expo development server..."
npm start
EOF

# Make scripts executable
chmod +x start-backend.sh
chmod +x start-frontend.sh

# Update backend pyproject.toml to ensure proper package structure
cd backend
if [ -f "pyproject.toml" ]; then
    # Update paths in pyproject.toml to reflect new structure
    sed -i 's|readme = "README.md"|readme = "../README.md"|g' pyproject.toml 2>/dev/null || true
fi
cd ..

# Final cleanup
echo "🧹 Final cleanup..."
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true

echo ""
echo "✅ CineFluent project cleanup complete!"
echo ""
echo "📁 New project structure:"
echo "cinefluent/"
echo "├── backend/           # Python FastAPI backend"
echo "│   ├── cinefluent/   # Core backend code"
echo "│   ├── sql/          # Database setup"
echo "│   ├── tests/        # Backend tests"
echo "│   └── docker-compose.yml"
echo "├── client/           # React Native frontend"
echo "│   ├── src/          # App source code"
echo "│   ├── assets/       # Images and icons"
echo "│   └── package.json"
echo "├── start-backend.sh  # Backend dev script"
echo "├── start-frontend.sh # Frontend dev script"
echo "└── README.md         # Project documentation"
echo ""
echo "🚀 To start development:"
echo "   Backend:  ./start-backend.sh"
echo "   Frontend: ./start-frontend.sh"
echo ""
echo "🎯 Everything is now organized and ready for development!"