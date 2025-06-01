"""
Subtitle Processing Engine for cinefluent
Handles parsing, cleaning, and alignment of bilingual subtitles
"""

import re
import logging
from typing import List, Dict, Tuple, Optional
from pathlib import Path
from dataclasses import dataclass
from decimal import Decimal

import srt
import pysubs2
from Levenshtein import distance as edit_distance

logger = logging.getLogger(__name__)


@dataclass
class SubtitleCue:
    """Represents a single subtitle cue"""
    start_time: Decimal  # seconds
    end_time: Decimal    # seconds
    text: str
    text_normalized: str
    index: int = 0


class SubtitleProcessor:
    """Main subtitle processing engine"""
    
    # Timestamp tolerance for alignment (in seconds)
    ALIGNMENT_TOLERANCE = 0.05
    
    def __init__(self):
        self.text_cleaner = TextCleaner()
    
    def parse_subtitle_file(self, file_path: Path, encoding: str = 'utf-8') -> List[SubtitleCue]:
        """
        Parse subtitle file and return list of cues
        Supports .srt, .vtt, .ass, .ssa formats
        """
        try:
            # Try SRT format first
            if file_path.suffix.lower() == '.srt':
                return self._parse_srt(file_path, encoding)
            else:
                # Use pysubs2 for other formats
                return self._parse_with_pysubs2(file_path, encoding)
                
        except Exception as e:
            logger.error(f"Failed to parse subtitle file {file_path}: {e}")
            raise
    
    def _parse_srt(self, file_path: Path, encoding: str) -> List[SubtitleCue]:
        """Parse SRT file using srt library"""
        with open(file_path, 'r', encoding=encoding) as f:
            subtitle_generator = srt.parse(f.read())
            
        cues = []
        for subtitle in subtitle_generator:
            start_sec = self._timedelta_to_seconds(subtitle.start)
            end_sec = self._timedelta_to_seconds(subtitle.end)
            
            text = subtitle.content.strip()
            text_normalized = self.text_cleaner.clean_text(text)
            
            cues.append(SubtitleCue(
                start_time=Decimal(str(start_sec)),
                end_time=Decimal(str(end_sec)),
                text=text,
                text_normalized=text_normalized,
                index=subtitle.index
            ))
        
        return cues
    
    def _parse_with_pysubs2(self, file_path: Path, encoding: str) -> List[SubtitleCue]:
        """Parse subtitle file using pysubs2 library"""
        subs = pysubs2.load(str(file_path), encoding=encoding)
        
        cues = []
        for i, line in enumerate(subs, 1):
            start_sec = line.start / 1000.0  # pysubs2 uses milliseconds
            end_sec = line.end / 1000.0
            
            text = line.text.strip()
            text_normalized = self.text_cleaner.clean_text(text)
            
            cues.append(SubtitleCue(
                start_time=Decimal(str(start_sec)),
                end_time=Decimal(str(end_sec)),
                text=text,
                text_normalized=text_normalized,
                index=i
            ))
        
        return cues
    
    def align_subtitles(self, en_cues: List[SubtitleCue], de_cues: List[SubtitleCue]) -> List[Tuple[SubtitleCue, SubtitleCue, float]]:
        """
        Align English and German subtitle cues based on timestamps
        Returns list of (en_cue, de_cue, alignment_score) tuples
        """
        aligned_pairs = []
        
        # Create indices for faster lookup
        de_by_time = {cue.start_time: cue for cue in de_cues}
        
        for en_cue in en_cues:
            best_match = None
            best_score = 0.0
            
            # Look for exact timestamp match first
            for de_cue in de_cues:
                time_diff = abs(float(en_cue.start_time - de_cue.start_time))
                
                if time_diff <= self.ALIGNMENT_TOLERANCE:
                    # Calculate alignment score based on time proximity and text similarity
                    time_score = 1.0 - (time_diff / self.ALIGNMENT_TOLERANCE)
                    text_score = self._text_similarity(en_cue.text_normalized, de_cue.text_normalized)
                    combined_score = (time_score * 0.7) + (text_score * 0.3)
                    
                    if combined_score > best_score:
                        best_score = combined_score
                        best_match = de_cue
            
            if best_match and best_score > 0.5:  # Minimum confidence threshold
                aligned_pairs.append((en_cue, best_match, best_score))
        
        return aligned_pairs
    
    def _text_similarity(self, text1: str, text2: str) -> float:
        """Calculate text similarity using edit distance"""
        if not text1 or not text2:
            return 0.0
        
        max_len = max(len(text1), len(text2))
        if max_len == 0:
            return 1.0
        
        edit_dist = edit_distance(text1, text2)
        similarity = 1.0 - (edit_dist / max_len)
        return max(0.0, similarity)
    
    def _timedelta_to_seconds(self, td) -> float:
        """Convert timedelta to seconds"""
        return td.total_seconds()


class TextCleaner:
    """Handles text cleaning and normalization for alignment"""
    
    def __init__(self):
        # Regex patterns for cleaning
        self.html_tag_pattern = re.compile(r'<[^>]+>')
        self.formatting_pattern = re.compile(r'\{[^}]*\}')
        self.punctuation_pattern = re.compile(r'[^\w\s]')
        self.whitespace_pattern = re.compile(r'\s+')
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize subtitle text for alignment
        Removes HTML tags, formatting, excessive punctuation
        """
        if not text:
            return ""
        
        # Remove HTML tags
        text = self.html_tag_pattern.sub('', text)
        
        # Remove subtitle formatting codes
        text = self.formatting_pattern.sub('', text)
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove excessive punctuation (keep basic punctuation for sentence structure)
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        
        # Normalize whitespace
        text = self.whitespace_pattern.sub(' ', text)
        
        return text.strip()


class SubtitleValidator:
    """Validates subtitle files and alignment quality"""
    
    @staticmethod
    def validate_cues(cues: List[SubtitleCue]) -> Dict[str, any]:
        """Validate subtitle cues and return quality metrics"""
        if not cues:
            return {
                'valid': False,
                'error': 'No subtitle cues found',
                'count': 0
            }
        
        issues = []
        
        # Check for timing issues
        for i, cue in enumerate(cues):
            if cue.start_time >= cue.end_time:
                issues.append(f"Cue {i+1}: Start time >= end time")
            
            if i > 0 and cue.start_time < cues[i-1].end_time:
                issues.append(f"Cue {i+1}: Overlaps with previous cue")
        
        # Check for empty text
        empty_cues = [i+1 for i, cue in enumerate(cues) if not cue.text.strip()]
        if empty_cues:
            issues.append(f"Empty text in cues: {empty_cues}")
        
        return {
            'valid': len(issues) == 0,
            'issues': issues,
            'count': len(cues),
            'duration': float(cues[-1].end_time - cues[0].start_time) if cues else 0
        }
    
    @staticmethod
    def validate_alignment(aligned_pairs: List[Tuple[SubtitleCue, SubtitleCue, float]]) -> Dict[str, any]:
        """Validate alignment quality"""
        if not aligned_pairs:
            return {
                'valid': False,
                'error': 'No aligned pairs found',
                'alignment_rate': 0.0
            }
        
        total_pairs = len(aligned_pairs)
        high_confidence = sum(1 for _, _, score in aligned_pairs if score > 0.8)
        medium_confidence = sum(1 for _, _, score in aligned_pairs if 0.6 <= score <= 0.8)
        low_confidence = sum(1 for _, _, score in aligned_pairs if score < 0.6)
        
        avg_score = sum(score for _, _, score in aligned_pairs) / total_pairs
        
        return {
            'valid': avg_score > 0.6,
            'alignment_rate': avg_score,
            'total_pairs': total_pairs,
            'high_confidence': high_confidence,
            'medium_confidence': medium_confidence,
            'low_confidence': low_confidence,
            'quality': 'excellent' if avg_score > 0.9 else 'good' if avg_score > 0.7 else 'fair' if avg_score > 0.5 else 'poor'
        }


# Export main classes
__all__ = ['SubtitleProcessor', 'SubtitleCue', 'TextCleaner', 'SubtitleValidator']