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
