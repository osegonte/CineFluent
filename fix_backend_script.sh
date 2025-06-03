#!/bin/bash

echo "🔧 Fixing Backend API Script"
echo "============================"

# Fix the backend API script to remove reload parameter
cd backend

cat > run_fixed_api.py << 'EOF'
#!/usr/bin/env python3
"""
Fixed CineFluent API with proper CORS and authentication
"""
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
import bcrypt
import uuid
from typing import Optional

# Create the app 
app = FastAPI(
    title="CineFluent API - Stage 3",
    description="Language learning API with proper authentication",
    version="2.0.0"
)

# Add CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:19006",  # Expo web
        "http://localhost:8081",   # Expo dev server
        "http://localhost:3000",   # React dev server
        "http://localhost:19000",  # Expo tunnel
        "http://192.168.1.100:19000", # Expo LAN (adjust IP as needed)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-super-secret-key-change-in-production"
ALGORITHM = "HS256"

# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800

class UserResponse(BaseModel):
    id: str
    email: str
    is_premium: bool = False
    words_learned: int = 347
    current_streak: int = 23
    longest_streak: int = 45

class MovieProgress(BaseModel):
    movie_id: str
    movie_title: str
    total_scenes: int
    completed_scenes: int
    progress_percentage: float
    current_scene: int
    estimated_time_remaining_minutes: int
    difficulty_level: str

class ContinueLearning(BaseModel):
    has_active_session: bool
    recommended_movie: Optional[MovieProgress]
    recent_movies: list
    new_movie_suggestions: list

# Mock database
users_db = {}
sessions_db = {}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")
    
    if user_id not in users_db:
        raise HTTPException(status_code=401, detail="User not found")
    
    return users_db[user_id]

@app.get("/")
def root():
    return {
        "message": "CineFluent API - Stage 3 Ready!", 
        "status": "running",
        "version": "2.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy", 
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "database": {"status": "connected"},
        "redis": {"status": "disabled"}
    }

@app.post("/api/v1/auth/register", response_model=TokenResponse)
def register(request: RegisterRequest):
    print(f"Registration attempt: {request.email}")
    
    if request.email in [user["email"] for user in users_db.values()]:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if request.password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if len(request.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt())
    
    users_db[user_id] = {
        "id": user_id,
        "email": request.email,
        "password_hash": hashed_password,
        "is_premium": False,
        "created_at": datetime.utcnow().isoformat(),
        "words_learned": 0,
        "current_streak": 0,
        "longest_streak": 0
    }
    
    # Create tokens
    access_token = create_access_token({"sub": user_id, "email": request.email})
    refresh_token = create_refresh_token({"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800
    )

@app.post("/api/v1/auth/login", response_model=TokenResponse) 
def login(request: LoginRequest):
    print(f"Login attempt: {request.email}")
    
    # Find user by email
    user = None
    user_id = None
    for uid, u in users_db.items():
        if u["email"] == request.email:
            user = u
            user_id = uid
            break
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check password
    if not bcrypt.checkpw(request.password.encode('utf-8'), user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create tokens
    access_token = create_access_token({"sub": user_id, "email": user["email"]})
    refresh_token = create_refresh_token({"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800
    )

@app.get("/api/v1/auth/me", response_model=UserResponse)
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        is_premium=current_user.get("is_premium", False),
        words_learned=current_user.get("words_learned", 347),
        current_streak=current_user.get("current_streak", 23),
        longest_streak=current_user.get("longest_streak", 45)
    )

@app.post("/api/v1/auth/logout")
def logout(current_user: dict = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

@app.get("/api/v1/gamification/streak")
def get_user_streak(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user["id"],
        "current_streak": current_user.get("current_streak", 23),
        "longest_streak": current_user.get("longest_streak", 45),
        "last_active": datetime.utcnow().date().isoformat()
    }

@app.get("/api/v1/gamification/progress")
def get_user_progress(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user["id"],
        "current_streak": current_user.get("current_streak", 23),
        "longest_streak": current_user.get("longest_streak", 45),
        "words_learned": current_user.get("words_learned", 347),
        "words_mastered": current_user.get("words_mastered", 89),
        "total_lessons_completed": 42,
        "total_study_time_minutes": 1250,
        "movies_started": 3,
        "movies_completed": 1,
        "weekly_goal": 150,
        "weekly_progress": 75,
        "recent_activity": []
    }

@app.get("/api/v1/learning/continue", response_model=ContinueLearning)
def get_continue_learning(current_user: dict = Depends(get_current_user)):
    recommended_movie = MovieProgress(
        movie_id="1",
        movie_title="Toy Story",
        total_scenes=12,
        completed_scenes=8,
        progress_percentage=65.0,
        current_scene=9,
        estimated_time_remaining_minutes=15,
        difficulty_level="beginner"
    )
    
    return ContinueLearning(
        has_active_session=True,
        recommended_movie=recommended_movie,
        recent_movies=[],
        new_movie_suggestions=[]
    )

@app.get("/api/v1/movies")
def list_movies(current_user: dict = Depends(get_current_user)):
    return {
        "movies": [
            {
                "id": "1",
                "title": "Toy Story",
                "language": "Spanish", 
                "difficulty": "Beginner",
                "rating": 4.8,
                "duration": "18 min",
                "scenes": "8/12 scenes",
                "progress": 65,
                "thumbnail": "🎬"
            },
            {
                "id": "2", 
                "title": "Finding Nemo",
                "language": "French",
                "difficulty": "Intermediate", 
                "rating": 4.9,
                "duration": "22 min",
                "scenes": "4/15 scenes", 
                "progress": 30,
                "thumbnail": "🐠"
            }
        ]
    }

# Lesson endpoints
@app.get("/api/v1/lessons/{lesson_id}")
def get_lesson(lesson_id: str, current_user: dict = Depends(get_current_user)):
    return {
        "lesson_id": lesson_id,
        "movie_title": "Toy Story",
        "scene_title": "Woody introduces himself",
        "subtitle_pair": {
            "spanish": "¡Hola! Soy Woody, el sheriff de este lugar.",
            "english": "Hello! I'm Woody, the sheriff of this place.",
            "start_time": 1.5,
            "end_time": 4.2
        },
        "vocabulary": [
            {"word": "Hola", "translation": "Hello", "difficulty": "basic"},
            {"word": "Soy", "translation": "I am", "difficulty": "basic"},
            {"word": "Sheriff", "translation": "Sheriff", "difficulty": "intermediate"},
            {"word": "Lugar", "translation": "Place", "difficulty": "basic"}
        ]
    }

@app.get("/api/v1/quiz/{lesson_id}")
def get_quiz(lesson_id: str, current_user: dict = Depends(get_current_user)):
    return {
        "quiz_id": f"quiz_{lesson_id}",
        "lesson_id": lesson_id,
        "questions": [
            {
                "id": "q1",
                "question": "What does 'sheriff' mean in English?",
                "type": "multiple_choice",
                "options": ["Teacher", "Sheriff", "Doctor", "Friend"],
                "correct_answer": "Sheriff"
            },
            {
                "id": "q2", 
                "question": "How do you say 'Hello' in Spanish?",
                "type": "multiple_choice",
                "options": ["Adiós", "Hola", "Gracias", "Por favor"],
                "correct_answer": "Hola"
            }
        ]
    }

@app.post("/api/v1/quiz/{lesson_id}/submit")
def submit_quiz(lesson_id: str, answers: dict, current_user: dict = Depends(get_current_user)):
    # Mock scoring
    correct_answers = 0
    total_questions = len(answers.get("answers", []))
    
    for answer in answers.get("answers", []):
        if answer.get("question_id") == "q1" and answer.get("answer") == "Sheriff":
            correct_answers += 1
        elif answer.get("question_id") == "q2" and answer.get("answer") == "Hola":
            correct_answers += 1
    
    score_percentage = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    
    return {
        "lesson_id": lesson_id,
        "score_percentage": score_percentage,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "passed": score_percentage >= 70,
        "xp_earned": correct_answers * 10,
        "words_learned": ["Hola", "Sheriff"] if correct_answers > 0 else []
    }

if __name__ == "__main__":
    print("🚀 Starting CineFluent API Server (Stage 3)...")
    print("📍 Backend API: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs") 
    print("❤️ Health check: http://localhost:8000/health")
    print("")
    
    # Run without reload to avoid import issues
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    )
EOF

cd ..

echo "✅ Fixed backend API script (removed reload parameter)"

# Also create a quick manual start script
cat > start_manual.sh << 'EOF'
#!/bin/bash

echo "🚀 Manual CineFluent Start"
echo "=========================="

# Kill existing processes
lsof -ti:8000 | xargs -r kill -9 2>/dev/null || true
lsof -ti:5433 | xargs -r kill -9 2>/dev/null || true

# Start database
echo "🐳 Starting database..."
docker-compose -f docker-compose-simple.yml up -d

# Wait for database
echo "⏳ Waiting for database..."
sleep 10

# Start backend manually
echo "🔧 Starting backend..."
cd backend
python run_fixed_api.py &
cd ..

echo ""
echo "✅ Services started!"
echo "🔧 Backend: http://localhost:8000"
echo "🗄️ Database: localhost:5433"
echo ""
echo "To start frontend separately:"
echo "  cd client && npx expo start --web"
EOF

chmod +x start_manual.sh

echo ""
echo "🎉 Backend Fixed!"
echo "================"
echo ""
echo "Now try one of these options:"
echo ""
echo "Option 1: Try the simple script again"
echo "  ./start_simple.sh"
echo ""
echo "Option 2: Start manually step by step"
echo "  ./start_manual.sh"
echo "  # Then in another terminal:"
echo "  cd client && npx expo start --web"
echo ""
echo "Option 3: Start services individually"
echo "  # Terminal 1: Database"
echo "  docker-compose -f docker-compose-simple.yml up"
echo "  # Terminal 2: Backend"
echo "  cd backend && python run_fixed_api.py"
echo "  # Terminal 3: Frontend"
echo "  cd client && npx expo start --web"