"""
Pydantic models for learning session endpoints
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


class SubtitlePairResponse(BaseModel):
    """Subtitle pair for learning"""
    id: uuid.UUID
    movie_id: uuid.UUID
    en_text: str
    de_text: str
    start_time: float  # seconds
    end_time: float    # seconds
    alignment_score: float
    
    class Config:
        from_attributes = True


class VocabularyItem(BaseModel):
    """Vocabulary item with difficulty"""
    word: str
    translation: str
    difficulty: str = Field(..., pattern="^(basic|intermediate|advanced)$")
    definition: Optional[str] = None
    example_sentence: Optional[str] = None


class LessonContent(BaseModel):
    """Complete lesson content"""
    lesson_id: uuid.UUID
    movie_title: str
    movie_year: Optional[int]
    subtitle_pair: SubtitlePairResponse
    key_vocabulary: List[VocabularyItem]
    audio_available: bool = False
    lesson_number: int
    total_lessons: int


class QuizQuestion(BaseModel):
    """Quiz question for vocabulary"""
    question_id: str
    question_text: str
    question_type: str = Field(..., pattern="^(multiple_choice|translation|fill_blank)$")
    options: Optional[List[str]] = None  # For multiple choice
    correct_answer: str
    target_word: str


class LessonSession(BaseModel):
    """Learning session request"""
    movie_id: Optional[uuid.UUID] = None
    difficulty_level: str = Field("beginner", pattern="^(beginner|intermediate|advanced)$")
    session_length: int = Field(20, ge=5, le=50)  # Number of subtitle pairs


class QuizAnswer(BaseModel):
    """User's quiz answer"""
    question_id: str
    user_answer: str
    time_taken_seconds: float


class LessonProgress(BaseModel):
    """Lesson progress update"""
    lesson_id: uuid.UUID
    completed: bool
    quiz_answers: List[QuizAnswer]
    study_time_seconds: int
    words_learned: List[str]  # Words user marked as learned


class LessonResult(BaseModel):
    """Lesson completion result"""
    lesson_id: uuid.UUID
    score_percentage: float
    words_correct: int
    words_total: int
    time_taken_minutes: int
    streak_updated: bool
    xp_earned: int
    next_lesson_available: bool


class MovieProgress(BaseModel):
    """Movie learning progress"""
    movie_id: uuid.UUID
    movie_title: str
    total_scenes: int
    completed_scenes: int
    progress_percentage: float
    current_scene: int
    estimated_time_remaining_minutes: int
    difficulty_level: str


class ContinueLearning(BaseModel):
    """Continue learning response"""
    has_active_session: bool
    recommended_movie: Optional[MovieProgress] = None
    recent_movies: List[MovieProgress]
    new_movie_suggestions: List[Dict[str, Any]]  # Fixed: any -> Any


class VocabularyDrill(BaseModel):
    """Vocabulary drilling session"""
    session_id: uuid.UUID
    words: List[VocabularyItem]
    session_type: str = Field(..., pattern="^(review|new_words|mixed)$")
    total_questions: int
    

class DrillAnswer(BaseModel):
    """Vocabulary drill answer"""
    word: str
    user_answer: str
    correct: bool
    time_taken_seconds: float


class DrillResult(BaseModel):
    """Vocabulary drill result"""
    session_id: uuid.UUID
    correct_answers: int
    total_questions: int
    accuracy_percentage: float
    words_mastered: List[str]
    words_to_review: List[str]
    session_time_minutes: int
