"""
Authentication routes for CineFluent API
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from cinefluent.api.database import get_db
from cinefluent.api.config import get_settings
from .models import (
    UserRegister, UserLogin, Token, RefreshToken, 
    UserProfile, UpdateProfile, PasswordReset, 
    PasswordResetConfirm
)
from .utils import AuthUtils
from cinefluent.database_models import User

router = APIRouter()
security = HTTPBearer()
settings = get_settings()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Create user
        user = AuthUtils.create_user(
            db=db,
            email=user_data.email,
            password=user_data.password
        )
        
        # Create tokens
        access_token = AuthUtils.create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "is_premium": user.is_premium
            }
        )
        
        refresh_token = AuthUtils.create_refresh_token(
            data={"sub": str(user.id)}
        )
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_expire_minutes * 60
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = AuthUtils.authenticate_user(
        db=db,
        email=user_credentials.email,
        password=user_credentials.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token = AuthUtils.create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "is_premium": user.is_premium
        }
    )
    
    refresh_token = AuthUtils.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get current authenticated user"""
    return AuthUtils.get_current_user_from_token(credentials.credentials, db)


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    # Get user statistics
    from cinefluent.database_models import Streak, UserVocab
    
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    vocab_count = db.query(UserVocab).filter(
        UserVocab.user_id == current_user.id,
        UserVocab.mastered == True
    ).count()
    
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        is_premium=current_user.is_premium,
        created_at=current_user.created_at,
        words_learned=vocab_count,
        current_streak=streak.current_streak if streak else 0,
        longest_streak=streak.longest_streak if streak else 0,
        total_study_time=0,  # TODO: Implement study time tracking
        movies_completed=0   # TODO: Implement movie completion tracking
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user (client should delete tokens)"""
    return {"message": "Logged out successfully"}
