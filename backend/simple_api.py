#!/usr/bin/env python3
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CineFluent API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "CineFluent API Working!", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/v1/auth/login")
def login(request: dict):
    print(f"Login: {request}")
    return {
        "access_token": "demo_token_12345",
        "refresh_token": "refresh_token_67890",
        "token_type": "bearer",
        "expires_in": 1800
    }

@app.post("/api/v1/auth/register")
def register(request: dict):
    print(f"Register: {request}")
    return {
        "access_token": "demo_token_12345", 
        "refresh_token": "refresh_token_67890",
        "token_type": "bearer",
        "expires_in": 1800
    }

@app.get("/api/v1/auth/me")
def get_me():
    return {
        "id": "demo_user_123",
        "email": "demo@example.com",
        "is_premium": False,
        "words_learned": 347,
        "current_streak": 23,
        "longest_streak": 45
    }

if __name__ == "__main__":
    print("🚀 Starting CineFluent API...")
    print("📍 http://localhost:8000")
    print("📚 http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    )
