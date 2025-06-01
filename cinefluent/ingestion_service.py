"""
Subtitle Ingestion Service for cinefluent
Handles file upload, DeepSeek API integration, and database storage
"""

import logging
import asyncio
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import uuid
import httpx
from decimal import Decimal

from sqlalchemy.orm import Session
from cinefluent.subtitle_processor import SubtitleProcessor, SubtitleCue, SubtitleValidator
from cinefluent.database_models import DatabaseManager, Movie, Subtitle, SubtitlePair

logger = logging.getLogger(__name__)


class IngestionService:
    """Main service for subtitle ingestion and processing"""
    
    def __init__(self, db_session: Session, deepseek_api_key: Optional[str] = None):
        self.db = DatabaseManager(db_session)
        self.processor = SubtitleProcessor()
        self.validator = SubtitleValidator()
        self.deepseek_api_key = deepseek_api_key
        
    async def ingest_manual_upload(self, 
                                 movie_title: str,
                                 movie_year: Optional[int],
                                 en_file_path: Path,
                                 de_file_path: Path,
                                 imdb_id: Optional[str] = None) -> Dict[str, any]:
        """
        Process manually uploaded subtitle files
        """
        try:
            logger.info(f"Starting manual ingestion for '{movie_title}' ({movie_year})")
            
            # Create or get movie record
            movie = self.db.get_movie_by_title(movie_title, movie_year)
            if not movie:
                movie = self.db.create_movie(movie_title, movie_year, imdb_id)
            
            # Process English subtitles
            en_cues = self.processor.parse_subtitle_file(en_file_path)
            en_validation = self.validator.validate_cues(en_cues)
            
            if not en_validation['valid']:
                return {
                    'success': False,
                    'error': f"English subtitles validation failed: {en_validation['error']}",
                    'details': en_validation
                }
            
            # Process German subtitles
            de_cues = self.processor.parse_subtitle_file(de_file_path)
            de_validation = self.validator.validate_cues(de_cues)
            
            if not de_validation['valid']:
                return {
                    'success': False,
                    'error': f"German subtitles validation failed: {de_validation['error']}",
                    'details': de_validation
                }
            
            # Align subtitles
            aligned_pairs = self.processor.align_subtitles(en_cues, de_cues)
            alignment_validation = self.validator.validate_alignment(aligned_pairs)
            
            if not alignment_validation['valid']:
                return {
                    'success': False,
                    'error': f"Subtitle alignment failed: {alignment_validation['error']}",
                    'details': alignment_validation
                }
            
            # Store in database
            result = await self._store_subtitles_and_pairs(movie, en_cues, de_cues, aligned_pairs)
            
            return {
                'success': True,
                'movie_id': str(movie.id),
                'movie_title': movie.title,
                'en_subtitles_count': len(en_cues),
                'de_subtitles_count': len(de_cues),
                'aligned_pairs_count': len(aligned_pairs),
                'alignment_quality': alignment_validation['quality'],
                'alignment_score': float(alignment_validation['alignment_rate']),
                'details': {
                    'en_validation': en_validation,
                    'de_validation': de_validation,
                    'alignment_validation': alignment_validation
                }
            }
            
        except Exception as e:
            logger.error(f"Manual ingestion failed: {e}")
            return {
                'success': False,
                'error': f"Ingestion failed: {str(e)}"
            }
    
    async def ingest_deepseek_fetch(self, 
                                   movie_title: str,
                                   imdb_id: str,
                                   movie_year: Optional[int] = None) -> Dict[str, any]:
        """
        Fetch subtitles via DeepSeek API (Premium feature)
        """
        if not self.deepseek_api_key:
            return {
                'success': False,
                'error': 'DeepSeek API key not configured'
            }
        
        try:
            logger.info(f"Starting DeepSeek fetch for '{movie_title}' (IMDb: {imdb_id})")
            
            # Create or get movie record
            movie = self.db.get_movie_by_title(movie_title, movie_year)
            if not movie:
                movie = self.db.create_movie(movie_title, movie_year, imdb_id)
            
            # Fetch subtitles from DeepSeek
            fetch_result = await self._fetch_subtitles_from_deepseek(imdb_id)
            
            if not fetch_result['success']:
                return fetch_result
            
            en_content = fetch_result['en_content']
            de_content = fetch_result['de_content']
            
            # Parse subtitle content
            en_cues = self._parse_subtitle_content(en_content)
            de_cues = self._parse_subtitle_content(de_content)
            
            # Validate
            en_validation = self.validator.validate_cues(en_cues)
            de_validation = self.validator.validate_cues(de_cues)
            
            if not en_validation['valid'] or not de_validation['valid']:
                return {
                    'success': False,
                    'error': 'Fetched subtitles validation failed',
                    'details': {
                        'en_validation': en_validation,
                        'de_validation': de_validation
                    }
                }
            
            # Align subtitles
            aligned_pairs = self.processor.align_subtitles(en_cues, de_cues)
            alignment_validation = self.validator.validate_alignment(aligned_pairs)
            
            # Store in database
            result = await self._store_subtitles_and_pairs(movie, en_cues, de_cues, aligned_pairs)
            
            return {
                'success': True,
                'source': 'deepseek',
                'movie_id': str(movie.id),
                'movie_title': movie.title,
                'en_subtitles_count': len(en_cues),
                'de_subtitles_count': len(de_cues),
                'aligned_pairs_count': len(aligned_pairs),
                'alignment_quality': alignment_validation['quality'],
                'alignment_score': float(alignment_validation['alignment_rate'])
            }
            
        except Exception as e:
            logger.error(f"DeepSeek fetch failed: {e}")
            return {
                'success': False,
                'error': f"DeepSeek fetch failed: {str(e)}"
            }
    
    async def _fetch_subtitles_from_deepseek(self, imdb_id: str) -> Dict[str, any]:
        """
        Fetch subtitles from DeepSeek API
        Note: This is a placeholder implementation - adjust based on actual DeepSeek API
        """
        try:
            async with httpx.AsyncClient() as client:
                # Fetch English subtitles
                en_response = await client.get(
                    f"https://api.deepseek.com/v1/subtitles/{imdb_id}/en",
                    headers={"Authorization": f"Bearer {self.deepseek_api_key}"},
                    timeout=30.0
                )
                
                if en_response.status_code != 200:
                    return {
                        'success': False,
                        'error': f"Failed to fetch English subtitles: {en_response.status_code}"
                    }
                
                # Fetch German subtitles
                de_response = await client.get(
                    f"https://api.deepseek.com/v1/subtitles/{imdb_id}/de",
                    headers={"Authorization": f"Bearer {self.deepseek_api_key}"},
                    timeout=30.0
                )
                
                if de_response.status_code != 200:
                    return {
                        'success': False,
                        'error': f"Failed to fetch German subtitles: {de_response.status_code}"
                    }
                
                return {
                    'success': True,
                    'en_content': en_response.text,
                    'de_content': de_response.text
                }
                
        except httpx.TimeoutException:
            return {
                'success': False,
                'error': 'DeepSeek API request timed out'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f"DeepSeek API error: {str(e)}"
            }
    
    def _parse_subtitle_content(self, content: str) -> List[SubtitleCue]:
        """Parse subtitle content from string"""
        import tempfile
        import os
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.srt', delete=False) as f:
            f.write(content)
            temp_path = Path(f.name)
        
        try:
            # Parse using processor
            cues = self.processor.parse_subtitle_file(temp_path)
            return cues
        finally:
            # Clean up temporary file
            os.unlink(temp_path)
    
    async def _store_subtitles_and_pairs(self, 
                                       movie: Movie,
                                       en_cues: List[SubtitleCue],
                                       de_cues: List[SubtitleCue],
                                       aligned_pairs: List[Tuple[SubtitleCue, SubtitleCue, float]]) -> Dict[str, any]:
        """Store subtitle cues and aligned pairs in database"""
        
        # Store English subtitles
        en_subtitle_map = {}
        for cue in en_cues:
            subtitle = self.db.create_subtitle(
                movie_id=movie.id,
                lang='en',
                start_ts=cue.start_time,
                end_ts=cue.end_time,
                text=cue.text,
                text_normalized=cue.text_normalized
            )
            en_subtitle_map[id(cue)] = subtitle.id
        
        # Store German subtitles
        de_subtitle_map = {}
        for cue in de_cues:
            subtitle = self.db.create_subtitle(
                movie_id=movie.id,
                lang='de',
                start_ts=cue.start_time,
                end_ts=cue.end_time,
                text=cue.text,
                text_normalized=cue.text_normalized
            )
            de_subtitle_map[id(cue)] = subtitle.id
        
        # Store aligned pairs
        pairs_created = 0
        for en_cue, de_cue, score in aligned_pairs:
            try:
                self.db.create_subtitle_pair(
                    movie_id=movie.id,
                    en_id=en_subtitle_map[id(en_cue)],
                    de_id=de_subtitle_map[id(de_cue)],
                    alignment_score=score
                )
                pairs_created += 1
            except Exception as e:
                logger.warning(f"Failed to create subtitle pair: {e}")
        
        return {
            'en_stored': len(en_cues),
            'de_stored': len(de_cues),
            'pairs_stored': pairs_created
        }


class IngestionCLI:
    """Command-line interface for subtitle ingestion"""
    
    def __init__(self, db_session: Session):
        self.service = IngestionService(db_session)
    
    async def ingest_file(self, 
                         movie_title: str,
                         file_path: str,
                         lang: str,
                         movie_year: Optional[int] = None) -> None:
        """CLI command for single file ingestion"""
        
        if lang not in ['en', 'de']:
            print(f"Error: Language must be 'en' or 'de', got '{lang}'")
            return
        
        file_path = Path(file_path)
        if not file_path.exists():
            print(f"Error: File not found: {file_path}")
            return
        
        print(f"Processing {lang} subtitles for '{movie_title}'...")
        
        try:
            # Parse the file
            cues = self.service.processor.parse_subtitle_file(file_path)
            validation = self.service.validator.validate_cues(cues)
            
            if not validation['valid']:
                print(f"Validation failed: {validation['error']}")
                return
            
            # Store in database
            movie = self.service.db.get_movie_by_title(movie_title, movie_year)
            if not movie:
                movie = self.service.db.create_movie(movie_title, movie_year)
            
            for cue in cues:
                self.service.db.create_subtitle(
                    movie_id=movie.id,
                    lang=lang,
                    start_ts=cue.start_time,
                    end_ts=cue.end_time,
                    text=cue.text,
                    text_normalized=cue.text_normalized
                )
            
            print(f"Successfully stored {len(cues)} {lang} subtitles for '{movie_title}'")
            print(f"Validation: {validation['count']} cues, {validation['duration']:.1f}s duration")
            
        except Exception as e:
            print(f"Error: {e}")


# Export main classes
__all__ = ['IngestionService', 'IngestionCLI']