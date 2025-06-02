#!/usr/bin/env python3
"""
Simple API runner for CineFluent - bypasses module import issues
"""
import os
import sys
import uvicorn
from pathlib import Path

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

# Set environment variables
os.environ.setdefault('DATABASE_URL', 'postgresql://cinefluent_user:cinefluent_pass@localhost:5433/cinefluent')

def create_app():
    """Create FastAPI app with minimal configuration"""
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI(
        title="CineFluent API",
        version="2.0.0",
        description="Language learning API using bilingual movie subtitles",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Health check endpoint
    @app.get("/")
    async def root():
        return {
            "message": "Welcome to CineFluent API",
            "version": "2.0.0",
            "status": "running",
            "docs": "/docs"
        }
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        try:
            # Test database connection
            import psycopg2
            from dotenv import load_dotenv
            load_dotenv()
            
            conn = psycopg2.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                port=os.getenv('DB_PORT', '5433'),
                user=os.getenv('DB_USER', 'cinefluent_user'),
                password=os.getenv('DB_PASSWORD', 'cinefluent_pass'),
                database=os.getenv('DB_NAME', 'cinefluent')
            )
            conn.close()
            db_status = "healthy"
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"
        
        return {
            "status": "healthy",
            "version": "2.0.0",
            "database": {"status": db_status},
            "redis": {"status": "not tested"}
        }
    
    # Demo API endpoints
    @app.get("/api/v1/movies")
    async def list_movies():
        return {
            "movies": [
                {"id": 1, "title": "Toy Story", "language": "Spanish", "difficulty": "Beginner"},
                {"id": 2, "title": "Finding Nemo", "language": "French", "difficulty": "Intermediate"}
            ]
        }
    
    @app.get("/api/v1/learning/continue")
    async def continue_learning():
        return {
            "has_active_session": True,
            "recommended_movie": {
                "movie_id": "1",
                "movie_title": "Toy Story",
                "total_scenes": 12,
                "completed_scenes": 8,
                "progress_percentage": 65,
                "current_scene": 9,
                "estimated_time_remaining_minutes": 15,
                "difficulty_level": "beginner"
            },
            "recent_movies": [],
            "new_movie_suggestions": []
        }
    
    return app

if __name__ == "__main__":
    print("🚀 Starting CineFluent API server...")
    print("📍 Backend API: http://localhost:8000")
    print("📚 API docs: http://localhost:8000/docs")
    print("❤️ Health check: http://localhost:8000/health")
    print("")
    
    app = create_app()
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
