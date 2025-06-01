#!/bin/bash
# Stage 2 Setup Script for CineFluent FastAPI Backend

echo "🚀 Setting up CineFluent Stage 2 - FastAPI Backend"

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p cinefluent/api
mkdir -p cinefluent/auth
mkdir -p cinefluent/movies
mkdir -p cinefluent/learning
mkdir -p cinefluent/gamification
mkdir -p cinefluent/users

# Create __init__.py files
echo "📝 Creating Python package files..."
touch cinefluent/api/__init__.py
touch cinefluent/auth/__init__.py
touch cinefluent/movies/__init__.py
touch cinefluent/learning/__init__.py
touch cinefluent/gamification/__init__.py
touch cinefluent/users/__init__.py

# Create placeholder route files
echo "🛣️ Creating route files..."

# Auth routes (main file created above)
echo "# Auth routes - see artifacts for full implementation" > cinefluent/auth/routes.py

# Movies routes
cat > cinefluent/movies/routes.py << 'EOF'
"""Movie management routes"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_movies():
    return {"message": "Movies endpoint - coming soon"}
EOF

# Users routes  
cat > cinefluent/users/routes.py << 'EOF'
"""User management routes"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_users():
    return {"message": "Users endpoint - coming soon"}
EOF

# Learning routes (main file created above)
echo "# Learning routes - see artifacts for full implementation" > cinefluent/learning/routes.py

# Gamification routes (main file created above)
echo "# Gamification routes - see artifacts for full implementation" > cinefluent/gamification/routes.py

# Create empty model files
touch cinefluent/movies/models.py
touch cinefluent/users/models.py
touch cinefluent/learning/models.py
touch cinefluent/gamification/models.py

# Update requirements.txt for Stage 2
echo "📦 Updating requirements.txt..."
cat >> requirements.txt << 'EOF'

# Stage 2 - FastAPI Backend
redis==5.0.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Additional dependencies for API
slowapi==0.1.9  # Rate limiting
email-validator==2.1.0
EOF

# Install new dependencies
echo "⬇️ Installing new dependencies..."
pip install redis python-jose[cryptography] passlib[bcrypt] slowapi email-validator

# Update .env with Stage 2 settings
echo "⚙️ Updating environment configuration..."
cat >> .env << 'EOF'

# Stage 2 - API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS Origins (add your frontend URLs)
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","https://cinefluent.app"]

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Gamification Settings
DAILY_STREAK_BONUS=10
WORD_MASTERY_THRESHOLD=5
LEADERBOARD_CACHE_TTL=300

# Learning Session Settings  
DEFAULT_SESSION_LENGTH=20
DIFFICULTY_ADJUSTMENT_THRESHOLD=0.8
EOF

echo "✅ Stage 2 directory structure created!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the FastAPI application code from the artifacts"
echo "2. Copy the authentication routes from the artifacts"
echo "3. Copy the gamification routes from the artifacts"
echo "4. Copy the learning routes from the artifacts"
echo "5. Run: python -m cinefluent.api.main"
echo ""
echo "🔗 API will be available at: http://localhost:8000"
echo "📚 API docs will be at: http://localhost:8000/docs"