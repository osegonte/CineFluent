#!/bin/bash

echo "🚀 Starting CineFluent Development Environment"
echo "=============================================="

# Function to check if port is in use and try to free it
check_and_free_port() {
    PORT=$1
    SERVICE_NAME=$2
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $PORT is in use by $SERVICE_NAME, attempting to free it..."
        
        if [ "$SERVICE_NAME" = "database" ]; then
            # Try to stop Docker containers using this port
            docker ps --filter "publish=$PORT" --format "{{.ID}}" | xargs -r docker stop 2>/dev/null || true
            sleep 2
        fi
        
        if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "❌ Could not free port $PORT. Please manually stop the process:"
            echo "   lsof -ti:$PORT | xargs kill -9"
            return 1
        else
            echo "✅ Port $PORT freed successfully"
        fi
    fi
    return 0
}

# Check required ports
check_and_free_port 8000 "backend API" || exit 1
check_and_free_port 5433 "database" || exit 1
check_and_free_port 6379 "Redis" || exit 1
check_and_free_port 19006 "Expo web" || exit 1

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
    if docker exec cinefluent_db pg_isready -U cinefluent_user -d cinefluent >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Database failed to start after 30 seconds"
        docker-compose logs db
        exit 1
    fi
    sleep 1
done

# Start backend API
echo "🔧 Starting backend API..."
cd backend
python run_fixed_api.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
for i in {1..20}; do
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 20 ]; then
        echo "❌ Backend failed to start after 20 seconds"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# Test backend
echo "🧪 Testing backend..."
if python test_stage3.py; then
    echo "✅ Backend tests passed!"
    
    # Start frontend
    echo "📱 Starting frontend..."
    cd client
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "🎉 CineFluent Stage 3 Development Environment is running!"
    echo "=================================================="
    echo "🔧 Backend API: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs"
    echo "❤️ Health Check: http://localhost:8000/health"
    echo "📱 Frontend Web: http://localhost:19006"
    echo "📱 Expo DevTools: http://localhost:19002"
    echo ""
    echo "💡 Tips:"
    echo "   • Press 'w' in the Expo terminal to open web version"
    echo "   • Scan QR code with Expo Go app for mobile testing"
    echo "   • Use demo account: demo@cinefluent.app / Test123!"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Handle cleanup on exit
    trap 'echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker-compose down; exit 0' SIGINT SIGTERM
    
    # Keep script running
    wait
else
    echo "❌ Backend tests failed!"
    kill $BACKEND_PID 2>/dev/null
    docker-compose down
    exit 1
fi
