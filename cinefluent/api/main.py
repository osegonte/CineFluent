"""
Stage 2: FastAPI Main Application for cinefluent
Core API, Authentication & Gamification Scaffold
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn

from cinefluent.database_models import Base
from cinefluent.api.config import get_settings
from cinefluent.api.database import get_db, engine, init_redis, DatabaseService
from cinefluent.auth.routes import router as auth_router
from cinefluent.movies.routes import router as movies_router
from cinefluent.learning.routes import router as learning_router
from cinefluent.gamification.routes import router as gamification_router
from cinefluent.users.routes import router as users_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting CineFluent API...")
    
    # Initialize Redis
    await init_redis()
    print("📊 Redis connection initialized")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("🗄️ Database tables created")
    
    print("✅ CineFluent API started successfully!")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down CineFluent API...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Language learning API using bilingual movie subtitles",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware (security)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)


# Health check endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to CineFluent API",
        "version": settings.app_version,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_health = DatabaseService.health_check()
    redis_health = await DatabaseService.redis_health_check()
    
    overall_status = "healthy" if (
        db_health["status"] == "healthy" and 
        redis_health["status"] == "healthy"
    ) else "unhealthy"
    
    return {
        "status": overall_status,
        "version": settings.app_version,
        "database": db_health,
        "redis": redis_health
    }


# Include routers
app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

app.include_router(
    users_router,
    prefix="/api/v1/users",
    tags=["Users"]
)

app.include_router(
    movies_router,
    prefix="/api/v1/movies",
    tags=["Movies"]
)

app.include_router(
    learning_router,
    prefix="/api/v1/learning",
    tags=["Learning"]
)

app.include_router(
    gamification_router,
    prefix="/api/v1/gamification",
    tags=["Gamification"]
)


if __name__ == "__main__":
    uvicorn.run(
        "cinefluent.api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.reload,
        log_level=settings.log_level.lower()
    )
