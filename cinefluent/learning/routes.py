"""
Learning session routes for CineFluent API
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import uuid

from cinefluent.api.database import get_db
from cinefluent.auth.routes import get_current_user
from cinefluent.database_models import User, Movie, SubtitlePair, Subtitle
from .models import ContinueLearning, MovieProgress

router = APIRouter()


@router.get("/continue", response_model=ContinueLearning)
async def get_continue_learning(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get continue learning suggestions based on user's progress"""
    
    # Get movies with subtitle pairs
    movies_with_content = (
        db.query(Movie)
        .join(SubtitlePair)
        .group_by(Movie.id)
        .having(func.count(SubtitlePair.id) > 5)
        .limit(5)
        .all()
    )
    
    recent_movies = []
    
    for i, movie in enumerate(movies_with_content):
        total_scenes = db.query(SubtitlePair).filter(
            SubtitlePair.movie_id == movie.id
        ).count()
        
        # Simulate user progress
        completed_scenes = min(total_scenes, (i + 1) * 2)
        progress_percentage = (completed_scenes / total_scenes) * 100 if total_scenes > 0 else 0
        
        movie_progress = MovieProgress(
            movie_id=movie.id,
            movie_title=movie.title,
            total_scenes=total_scenes,
            completed_scenes=completed_scenes,
            progress_percentage=progress_percentage,
            current_scene=completed_scenes + 1,
            estimated_time_remaining_minutes=(total_scenes - completed_scenes) * 3,
            difficulty_level="beginner"
        )
        
        recent_movies.append(movie_progress)
    
    return ContinueLearning(
        has_active_session=len(recent_movies) > 0,
        recommended_movie=recent_movies[0] if recent_movies else None,
        recent_movies=recent_movies[:3],
        new_movie_suggestions=[]
    )
