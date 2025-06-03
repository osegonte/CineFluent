#!/bin/bash
echo "🔍 Debugging Authentication Issue..."
echo "======================================"

# Test backend health
echo "1. Testing backend health..."
curl -s http://localhost:8000/health | python3 -m json.tool || echo "❌ Backend not responding"

echo -e "\n2. Testing auth registration endpoint..."
# Test registration with curl
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "confirm_password": "Test123!"
  }' | python3 -m json.tool

echo -e "\n3. Testing CORS headers..."
curl -v -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:8000/api/v1/auth/register

echo -e "\n4. Frontend environment check..."
echo "Frontend should be calling: http://localhost:8000/api/v1"
cat client/.env | grep API || echo "No .env file found"

echo -e "\n5. Check if backend is actually running..."
ps aux | grep python | grep api || echo "No API process found"

echo -e "\n🎯 Debugging complete!"
echo "Check browser console (F12) for JavaScript errors"
echo "Backend should be at: http://localhost:8000"
echo "Frontend should be at: http://localhost:8081"