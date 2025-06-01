"""
Gamification routes for CineFluent API
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from cinefluent.api.database import get_db
from cinefluent.auth.routes import get_current_user
from cinefluent.database_models import User, Streak, UserVocab
from .models import StreakInfo, ProgressStats

router = APIRouter()


@router.get("/streak", response_model=StreakInfo)
async def get_user_streak(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current streak information"""
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    
    if not streak:
        # Create initial streak record
        streak = Streak(user_id=current_user.id)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    
    return StreakInfo(
        user_id=current_user.id,
        current_streak=streak.current_streak,
        longest_streak=streak.longest_streak,
        last_active=streak.last_active
    )


@router.get("/progress", response_model=ProgressStats)
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive user progress statistics"""
    
    # Get streak info
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    
    # Get vocabulary stats
    total_vocab = db.query(UserVocab).filter(
        UserVocab.user_id == current_user.id
    ).count()
    
    mastered_vocab = db.query(UserVocab).filter(
        UserVocab.user_id == current_user.id,
        UserVocab.mastered == True
    ).count()
    
    return ProgressStats(
        user_id=current_user.id,
        current_streak=streak.current_streak if streak else 0,
        longest_streak=streak.longest_streak if streak else 0,
        words_learned=total_vocab,
        words_mastered=mastered_vocab,
        total_lessons_completed=0,  # Placeholder
        total_study_time_minutes=0,  # Placeholder
        movies_started=0,
        movies_completed=0,
        weekly_goal=150,
        weekly_progress=75,
        recent_activity=[]
    )
