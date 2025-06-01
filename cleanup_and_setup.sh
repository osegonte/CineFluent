#!/bin/bash
# cleanup_and_setup.sh - Clean up CineFluent project and set up Stage 3

echo "🧹 Cleaning up CineFluent project..."

# Remove obsolete files
echo "Removing obsolete files..."
rm -rf cinefluent.egg-info/
rm -f babel.config.js  # Keep only client/babel.config.js
rm -f fix_text_cleaner.py
rm -f quick_fix.sh
rm -rf src/  # Duplicate of client/src/
rm -f requirements.txt  # Using pyproject.toml

# Create new project structure
echo "Creating new project structure..."
mkdir -p backend
mkdir -p backend/sql
mkdir -p backend/tests

# Move backend files
echo "Moving backend files..."
mv cinefluent/ backend/
mv tests/ backend/
mv docker-compose.yml backend/
mv .env backend/
mv .env.sample backend/
mv pyproject.toml backend/
mv sql/ backend/

# Update client dependencies
echo "Updating client dependencies..."
cd client

# Create missing directories
mkdir -p src/components/{audio,quiz,progress,vocabulary}
mkdir -p src/screens/{learning,progress,community}

# Clean and reinstall client dependencies
echo "Cleaning node_modules..."
rm -rf node_modules package-lock.json

echo "Installing client dependencies..."
npm install --legacy-peer-deps

# Go back to root
cd ..

echo "✅ Project cleanup complete!"
echo ""
echo "📁 New project structure:"
echo "cinefluent/"
echo "├── backend/           # Python FastAPI backend"
echo "│   ├── cinefluent/   # Core backend code"
echo "│   ├── tests/        # Backend tests"
echo "│   ├── sql/          # Database setup"
echo "│   └── docker-compose.yml"
echo "├── client/           # React Native app"
echo "│   ├── src/          # App source code"
echo "│   └── package.json"
echo "└── README.md"
echo ""
echo "🚀 Next steps:"
echo "1. Start the backend:"
echo "   cd backend"
echo "   python -m venv venv"
echo "   source venv/bin/activate  # or venv\\Scripts\\activate on Windows"
echo "   pip install -e ."
echo "   docker-compose up -d"
echo "   python -m cinefluent.ingest init-db"
echo "   python -m cinefluent.api.main"
echo ""
echo "2. Start the client (in a new terminal):"
echo "   cd client"
echo "   npm start"
echo "   # Press 'w' for web, 'i' for iOS, 'a' for Android"
echo ""
echo "📋 Files that need to be created/updated:"
echo "- Copy the component files from the artifacts above"
echo "- Copy the updated screen files from the artifacts above"
echo "- Update the navigation files"
echo ""
echo "🎯 Your app will then match the UI mockups with:"
echo "- Interactive quiz components"
echo "- Audio player with visualization"
echo "- Progress tracking with streaks and calendar"
echo "- Community chat interface"
echo "- Modern, polished UI design"