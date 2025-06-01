"""
Configuration settings for CineFluent API
"""

from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    app_name: str = "CineFluent API"
    app_version: str = "2.0.0"
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    reload: bool = True  # For development
    
    # Database Configuration
    database_url: str
    db_host: str = "localhost"
    db_port: int = 5433
    db_name: str = "cinefluent"
    db_user: str = "cinefluent_user"
    db_password: str = "cinefluent_pass"
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379"
    redis_host: str = "localhost"
    redis_port: int = 6379
    
    # Security Configuration
    secret_key: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # CORS Configuration
    cors_origins: list[str] = [
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "https://cinefluent.app",  # Production domain
    ]
    
    # DeepSeek API (Premium feature)
    deepseek_api_key: Optional[str] = None
    deepseek_base_url: str = "https://api.deepseek.com/v1"
    deepseek_rate_limit_rpm: int = 60
    
    # File Upload Configuration
    max_upload_size_mb: int = 10
    allowed_subtitle_formats: list[str] = ["srt", "vtt", "ass", "ssa", "sub"]
    
    # LibreOffice Configuration
    libreoffice_path: str = "/Applications/LibreOffice.app/Contents/MacOS/soffice"
    
    # Gamification Settings
    daily_streak_bonus: int = 10
    word_mastery_threshold: int = 5  # Number of correct answers to master a word
    leaderboard_cache_ttl: int = 300  # 5 minutes
    
    # Learning Session Settings
    default_session_length: int = 20  # Number of subtitle pairs per session
    difficulty_adjustment_threshold: float = 0.8  # 80% accuracy to increase difficulty
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "json"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Export for easy importing
settings = get_settings()
