"""
Pydantic models for gamification endpoints
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
import uuid


class StreakInfo(BaseModel):
    """User streak information"""
    user_id: uuid.UUID
    current_streak: int
    longest_streak: int
    last_active: Optional[date]
    
    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    """Leaderboard entry"""
    rank: int
    user_id: uuid.UUID
    email: str  # Masked for privacy
    current_streak: int
    longest_streak: int
    words_mastered: int
    is_current_user: bool = False


class Leaderboard(BaseModel):
    """Leaderboard response"""
    entries: List[LeaderboardEntry]
    current_user_rank: Optional[int] = None
    total_users: int


class Achievement(BaseModel):
    """Achievement definition"""
    id: str
    name: str
    description: str
    icon: str
    difficulty: str = Field(..., regex="^(bronze|silver|gold|platinum)$")
    requirement: int  # Threshold to unlock
    category: str = Field(..., regex="^(streak|vocabulary|movies|time)$")


class UserAchievement(BaseModel):
    """User achievement status"""
    achievement_id: str
    user_id: uuid.UUID
    earned: bool
    earned_at: Optional[datetime] = None
    progress: int  # Current progress toward achievement
    achievement: Achievement
    
    class Config:
        from_attributes = True


class ProgressStats(BaseModel):
    """User progress statistics"""
    user_id: uuid.UUID
    
    # Streak information
    current_streak: int
    longest_streak: int
    
    # Learning statistics
    words_learned: int
    words_mastered: int
    total_lessons_completed: int
    total_study_time_minutes: int
    
    # Movie progress
    movies_started: int
    movies_completed: int
    
    # Weekly progress
    weekly_goal: int  # minutes
    weekly_progress: int  # minutes completed this week
    
    # Daily activity (for calendar view)
    recent_activity: List[dict]  # List of daily activity


class DailyActivity(BaseModel):
    """Daily learning activity"""
    date: date
    lessons_completed: int
    study_time_minutes: int
    words_learned: int
    streak_maintained: bool


class UpdateStreak(BaseModel):
    """Update streak request"""
    activity_completed: bool = True


class WeeklyGoal(BaseModel):
    """Weekly goal setting"""
    goal_minutes: int = Field(..., ge=5, le=600)  # 5 minutes to 10 hours per week


class LearningSession(BaseModel):
    """Learning session record"""
    user_id: uuid.UUID
    movie_id: uuid.UUID
    duration_minutes: int
    words_encountered: int
    words_learned: int
    accuracy_percentage: float
    completed_at: datetime
    
    class Config:
        from_attributes = True