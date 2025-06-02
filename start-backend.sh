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
pip install -r requirements.txt

# Start database services
echo "🗄️ Starting database services..."
docker-compose up -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 10

# Initialize database
echo "🔧 Initializing database..."
python init_db.py

# Start API server using simple script
echo ""
echo "🌐 Starting API server..."
python run_api.py
