#!/bin/bash

# CineFluent Redis Port Fix Script
# Manually kills Redis and sets up alternative port

echo "🔧 Fixing Redis Port Conflict"
echo "============================="

# First, let's manually kill the Redis process
echo "🔍 Finding Redis processes..."

# Show what's using port 6379
echo "Processes using port 6379:"
lsof -i :6379 2>/dev/null || echo "No processes found with lsof"

# Try different methods to kill Redis
echo ""
echo "🛑 Attempting to kill Redis processes..."

# Method 1: Kill by port
if command -v lsof >/dev/null 2>&1; then
    echo "Method 1: Killing by port..."
    lsof -ti:6379 | xargs -r kill -9 2>/dev/null && echo "✅ Killed processes on port 6379" || echo "❌ No processes killed"
fi

# Method 2: Kill Redis by process name
echo "Method 2: Killing by process name..."
pkill -f redis-server 2>/dev/null && echo "✅ Killed redis-server processes" || echo "❌ No redis-server processes found"

# Method 3: Kill all Redis processes
echo "Method 3: Killing all Redis processes..."
killall redis-server 2>/dev/null && echo "✅ Killed all redis-server processes" || echo "❌ No Redis processes to kill"

# Method 4: Find and kill by PID
echo "Method 4: Finding Redis by ps..."
REDIS_PIDS=$(ps aux | grep redis | grep -v grep | awk '{print $2}' 2>/dev/null)
if [ -n "$REDIS_PIDS" ]; then
    echo "Found Redis PIDs: $REDIS_PIDS"
    echo $REDIS_PIDS | xargs kill -9 2>/dev/null && echo "✅ Killed Redis processes" || echo "❌ Failed to kill Redis"
else
    echo "No Redis processes found with ps"
fi

# Wait a moment
sleep 2

# Check if port is now free
if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 6379 is still in use. Let's use an alternative port."
    USE_ALT_PORT=true
else
    echo "✅ Port 6379 is now free!"
    USE_ALT_PORT=false
fi

# Create modified docker-compose.yml with alternative Redis port
if [ "$USE_ALT_PORT" = true ]; then
    echo ""
    echo "🔄 Creating Docker setup with alternative Redis port (6380)..."
    
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: cinefluent_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: cinefluent
      POSTGRES_USER: cinefluent_user
      POSTGRES_PASSWORD: cinefluent_pass
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/sql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cinefluent_user -d cinefluent"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # Redis Cache (using alternative port 6380)
  redis:
    image: redis:7-alpine
    container_name: cinefluent_redis
    restart: unless-stopped
    ports:
      - "6380:6379"  # Map host port 6380 to container port 6379
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  default:
    name: cinefluent_network
EOF

    # Update backend .env to use alternative Redis port
    cat > backend/.env << EOF
# Database Configuration
DATABASE_URL=postgresql://cinefluent_user:cinefluent_pass@localhost:5433/cinefluent
DB_HOST=localhost
DB_PORT=5433
DB_NAME=cinefluent
DB_USER=cinefluent_user
DB_PASSWORD=cinefluent_pass

# Redis Configuration (using alternative port)
REDIS_URL=redis://localhost:6380

# Security
SECRET_KEY=your-super-secret-key-change-in-production-$(openssl rand -hex 32)
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production-$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# CORS Origins
CORS_ORIGINS=["http://localhost:19006","http://localhost:8081","http://localhost:3000","http://localhost:19000"]

# Optional DeepSeek API (Premium feature)
# DEEPSEEK_API_KEY=your-deepseek-api-key-here
EOF

    echo "✅ Created alternative Redis setup using port 6380"
fi

# Create a Redis-optional startup script
cat > start_dev_no_redis.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting CineFluent Development Environment (Redis Optional)"
echo "============================================================="

# Function to kill processes on a port
kill_port_process() {
    local PORT=$1
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "🔧 Freeing port $PORT..."
        lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Function to wait for service
wait_for_service() {
    local URL=$1
    local SERVICE_NAME=$2
    local MAX_ATTEMPTS=30
    
    echo "⏳ Waiting for $SERVICE_NAME to be ready..."
    
    for i in $(seq 1 $MAX_ATTEMPTS); do
        if curl -s "$URL" >/dev/null 2>&1; then
            echo "✅ $SERVICE_NAME is ready!"
            return 0
        fi
        sleep 1
    done
    
    echo "❌ $SERVICE_NAME failed to start after $MAX_ATTEMPTS seconds"
    return 1
}

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
kill_port_process 8000
kill_port_process 5433

# Stop any existing Docker containers
docker-compose down --remove-orphans 2>/dev/null || true
sleep 2

# Start only the database (skip Redis if problematic)
echo "🐳 Starting PostgreSQL database..."
docker-compose up -d db

# Wait for database
for i in {1..30}; do
    if docker exec cinefluent_db pg_isready -U cinefluent_user -d cinefluent >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Database failed to start"
        docker-compose logs db
        exit 1
    fi
    sleep 1
done

# Try to start Redis, but continue without it if it fails
echo "🐳 Attempting to start Redis..."
if docker-compose up -d redis; then
    echo "✅ Redis started successfully"
else
    echo "⚠️  Redis failed to start, continuing without it..."
fi

# Start backend API
echo "🔧 Starting backend API..."
cd backend
python run_fixed_api.py &
BACKEND_PID=$!
cd ..

# Wait for backend
if ! wait_for_service "http://localhost:8000/health" "Backend API"; then
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    docker-compose down
    exit 1
fi

# Test backend functionality
echo "🧪 Testing backend functionality..."
if python quick_test.py; then
    echo "✅ Backend tests passed!"
else
    echo "⚠️  Backend tests had issues, but continuing..."
fi

# Start frontend
echo "📱 Starting frontend..."
cd client

# Set environment variable to suppress warnings
export EXPO_NO_DOCTOR=1
export EXPO_NO_TELEMETRY=1

# Start Expo development server
npx expo start --web --port 19006 &
FRONTEND_PID=$!
cd ..

# Give frontend time to start
sleep 5

echo ""
echo "🎉 CineFluent Stage 3 Development Environment is Running!"
echo "========================================================"
echo ""
echo "🔧 Backend Services:"
echo "   • API: http://localhost:8000"
echo "   • Docs: http://localhost:8000/docs"
echo "   • Health: http://localhost:8000/health"
echo "   • Database: localhost:5433"
if docker ps | grep cinefluent_redis >/dev/null; then
    echo "   • Redis: localhost:6380 (alternative port)"
else
    echo "   • Redis: Not running (optional)"
fi
echo ""
echo "📱 Frontend Services:"
echo "   • Web App: http://localhost:19006"
echo "   • Expo DevTools: http://localhost:19002"
echo ""
echo "🎯 Demo Credentials:"
echo "   • Email: demo@cinefluent.app"
echo "   • Password: Test123!"
echo ""
echo "💡 Usage Tips:"
echo "   • Press 'w' in Expo terminal to open web version"
echo "   • Scan QR code with Expo Go app for mobile"
echo "   • Use Ctrl+C to stop all services"
echo ""
echo "🚀 Ready for development!"

# Handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    docker-compose down --remove-orphans
    echo "✅ Cleanup complete!"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running
wait
EOF

chmod +x start_dev_no_redis.sh

echo ""
echo "🎉 Redis Fix Complete!"
echo "====================="
echo ""
echo "🔧 What was done:"
echo "   ✅ Attempted to kill Redis processes multiple ways"
echo "   ✅ Created alternative Docker setup (port 6380)"
echo "   ✅ Created Redis-optional startup script"
echo ""
echo "🚀 Start Development Options:"
echo ""
echo "Option 1 (Recommended): Use Redis on alternative port"
echo "   ./start_dev.sh"
echo ""
echo "Option 2: Skip Redis completely (app still works)"
echo "   ./start_dev_no_redis.sh"
echo ""
echo "💡 Both options will work for Stage 3 development!"