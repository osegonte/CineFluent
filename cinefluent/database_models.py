"""
Database models for cinefluent using SQLAlchemy
"""

from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
import uuid

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, Date, 
    Text, ForeignKey, UniqueConstraint, Index, DECIMAL
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship, Session
from sqlalchemy.sql import func

Base = declarative_base()


class Movie(Base):
    __tablename__ = "movies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    year = Column(Integer)
    imdb_id = Column(String(20))
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    subtitles = relationship("Subtitle", back_populates="movie", cascade="all, delete-orphan")
    subtitle_pairs = relationship("SubtitlePair", back_populates="movie", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Movie(title='{self.title}', year={self.year})>"


class Subtitle(Base):
    __tablename__ = "subtitles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), nullable=False)
    lang = Column(String(5), nullable=False)
    start_ts = Column(DECIMAL(10, 3), nullable=False)
    end_ts = Column(DECIMAL(10, 3), nullable=False)
    text = Column(Text, nullable=False)
    text_normalized = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    movie = relationship("Movie", back_populates="subtitles")
    en_pairs = relationship("SubtitlePair", foreign_keys="SubtitlePair.en_id", back_populates="en_subtitle")
    de_pairs = relationship("SubtitlePair", foreign_keys="SubtitlePair.de_id", back_populates="de_subtitle")
    
    # Indexes
    __table_args__ = (
        Index('idx_subtitles_movie_lang', 'movie_id', 'lang'),
        Index('idx_subtitles_timestamps', 'start_ts', 'end_ts'),
    )
    
    def __repr__(self):
        return f"<Subtitle(lang='{self.lang}', start={self.start_ts}, text='{self.text[:50]}...')>"


class SubtitlePair(Base):
    __tablename__ = "subtitle_pairs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), nullable=False)
    en_id = Column(UUID(as_uuid=True), ForeignKey("subtitles.id"), nullable=False)
    de_id = Column(UUID(as_uuid=True), ForeignKey("subtitles.id"), nullable=False)
    alignment_score = Column(DECIMAL(3, 2), default=1.0)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    movie = relationship("Movie", back_populates="subtitle_pairs")
    en_subtitle = relationship("Subtitle", foreign_keys=[en_id], back_populates="en_pairs")
    de_subtitle = relationship("Subtitle", foreign_keys=[de_id], back_populates="de_pairs")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('en_id', 'de_id', name='unique_subtitle_pair'),
        Index('idx_subtitle_pairs_movie', 'movie_id'),
    )
    
    def __repr__(self):
        return f"<SubtitlePair(movie_id={self.movie_id}, score={self.alignment_score})>"


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    vocab_progress = relationship("UserVocab", back_populates="user", cascade="all, delete-orphan")
    streak = relationship("Streak", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(email='{self.email}', premium={self.is_premium})>"


class Vocab(Base):
    __tablename__ = "vocab"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    word = Column(String(100), nullable=False)
    lang = Column(String(5), nullable=False)
    definition = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user_progress = relationship("UserVocab", back_populates="vocab", cascade="all, delete-orphan")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('word', 'lang', name='unique_word_lang'),
        Index('idx_vocab_word_lang', 'word', 'lang'),
    )
    
    def __repr__(self):
        return f"<Vocab(word='{self.word}', lang='{self.lang}')>"


class UserVocab(Base):
    __tablename__ = "user_vocab"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    vocab_id = Column(UUID(as_uuid=True), ForeignKey("vocab.id"), nullable=False)
    seen_count = Column(Integer, default=0)
    mastered = Column(Boolean, default=False)
    first_seen = Column(DateTime, default=func.now())
    last_seen = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="vocab_progress")
    vocab = relationship("Vocab", back_populates="user_progress")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('user_id', 'vocab_id', name='unique_user_vocab'),
        Index('idx_user_vocab_user', 'user_id'),
        Index('idx_user_vocab_mastered', 'user_id', 'mastered'),
    )
    
    def __repr__(self):
        return f"<UserVocab(user_id={self.user_id}, vocab_id={self.vocab_id}, mastered={self.mastered})>"


class Streak(Base):
    __tablename__ = "streaks"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_active = Column(Date)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="streak")
    
    def __repr__(self):
        return f"<Streak(user_id={self.user_id}, current={self.current_streak}, longest={self.longest_streak})>"


# Database utility functions
class DatabaseManager:
    """Utility class for database operations"""
    
    def __init__(self, session: Session):
        self.session = session
    
    def create_movie(self, title: str, year: Optional[int] = None, imdb_id: Optional[str] = None) -> Movie:
        """Create a new movie record"""
        movie = Movie(title=title, year=year, imdb_id=imdb_id)
        self.session.add(movie)
        self.session.commit()
        return movie
    
    def create_subtitle(self, movie_id: uuid.UUID, lang: str, start_ts: Decimal, 
                       end_ts: Decimal, text: str, text_normalized: str) -> Subtitle:
        """Create a new subtitle record"""
        subtitle = Subtitle(
            movie_id=movie_id,
            lang=lang,
            start_ts=start_ts,
            end_ts=end_ts,
            text=text,
            text_normalized=text_normalized
        )
        self.session.add(subtitle)
        self.session.commit()
        return subtitle
    
    def create_subtitle_pair(self, movie_id: uuid.UUID, en_id: uuid.UUID, 
                           de_id: uuid.UUID, alignment_score: float) -> SubtitlePair:
        """Create a subtitle pair record"""
        pair = SubtitlePair(
            movie_id=movie_id,
            en_id=en_id,
            de_id=de_id,
            alignment_score=Decimal(str(alignment_score))
        )
        self.session.add(pair)
        self.session.commit()
        return pair
    
    def get_movie_by_title(self, title: str, year: Optional[int] = None) -> Optional[Movie]:
        """Find movie by title and optional year"""
        query = self.session.query(Movie).filter(Movie.title == title)
        if year:
            query = query.filter(Movie.year == year)
        return query.first()
    
    def get_subtitles_by_movie_and_lang(self, movie_id: uuid.UUID, lang: str) -> List[Subtitle]:
        """Get all subtitles for a movie in a specific language"""
        return self.session.query(Subtitle).filter(
            Subtitle.movie_id == movie_id,
            Subtitle.lang == lang
        ).order_by(Subtitle.start_ts).all()
    
    def get_subtitle_pairs_by_movie(self, movie_id: uuid.UUID) -> List[SubtitlePair]:
        """Get all subtitle pairs for a movie"""
        return self.session.query(SubtitlePair).filter(
            SubtitlePair.movie_id == movie_id
        ).all()
    
    def update_user_streak(self, user_id: uuid.UUID) -> Streak:
        """Update user's daily streak"""
        today = date.today()
        streak = self.session.query(Streak).filter(Streak.user_id == user_id).first()
        
        if not streak:
            streak = Streak(user_id=user_id, last_active=today, current_streak=1, longest_streak=1)
            self.session.add(streak)
        else:
            # Check if last active was yesterday (continue streak) or today (already counted)
            if streak.last_active == today:
                # Already active today, no change
                pass
            elif streak.last_active == today - datetime.timedelta(days=1):
                # Continue streak
                streak.current_streak += 1
                streak.longest_streak = max(streak.longest_streak, streak.current_streak)
                streak.last_active = today
            else:
                # Streak broken, reset
                streak.current_streak = 1
                streak.last_active = today
        
        self.session.commit()
        return streak
    
    def get_leaderboard(self, limit: int = 10) -> List[dict]:
        """Get leaderboard data"""
        from sqlalchemy import text
        
        query = text("""
            SELECT 
                u.email,
                COALESCE(s.current_streak, 0) as current_streak,
                COALESCE(s.longest_streak, 0) as longest_streak,
                COALESCE(vocab_stats.mastered_count, 0) as words_mastered
            FROM users u
            LEFT JOIN streaks s ON u.id = s.user_id
            LEFT JOIN (
                SELECT 
                    user_id,
                    COUNT(*) as mastered_count
                FROM user_vocab 
                WHERE mastered = TRUE 
                GROUP BY user_id
            ) vocab_stats ON u.id = vocab_stats.user_id
            ORDER BY s.longest_streak DESC, vocab_stats.mastered_count DESC
            LIMIT :limit
        """)
        
        result = self.session.execute(query, {"limit": limit})
        return [dict(row) for row in result]