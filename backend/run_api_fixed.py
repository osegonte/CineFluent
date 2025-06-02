#!/usr/bin/env python3
"""
Fixed API runner for CineFluent
"""
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create the app 
app = FastAPI(title="CineFluent API - Demo")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:19006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    confirm_password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800

@app.get("/")
def root():
    return {"message": "CineFluent API - Working!", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy", "version": "demo"}

@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login(request: LoginRequest):
    print(f"Login attempt: {request.email}")
    if request.email and request.password:
        return TokenResponse(
            access_token="demo_token_12345",
            refresh_token="refresh_token_67890",
            expires_in=1800
        )
    return {"error": "Invalid credentials"}

@app.post("/api/v1/auth/register", response_model=TokenResponse) 
def register(request: RegisterRequest):
    print(f"Registration attempt: {request.email}")
    if request.email and request.password == request.confirm_password:
        return TokenResponse(
            access_token="demo_token_12345",
            refresh_token="refresh_token_67890",
            expires_in=1800
        )
    return {"error": "Registration failed"}

@app.get("/api/v1/auth/me")
def get_current_user():
    return {
        "id": "demo_user_123",
        "email": "demo@example.com",
        "is_premium": False,
        "words_learned": 347,
        "current_streak": 23,
        "longest_streak": 45
    }

if __name__ == "__main__":
    print("🚀 Starting CineFluent API server...")
    print("📍 Backend API: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs")
    print("❤️ Health check: http://localhost:8000/health")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
