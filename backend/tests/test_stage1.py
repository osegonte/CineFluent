"""
Test suite for cinefluent Stage 1 - Subtitle Processing Engine
"""

import pytest
import tempfile
import os
import sys
from pathlib import Path
from decimal import Decimal
from unittest.mock import Mock, patch
import uuid

# Import from the installed cinefluent package
from cinefluent.subtitle_processor import SubtitleProcessor, SubtitleCue, TextCleaner, SubtitleValidator
from cinefluent.database_models import Movie, Subtitle, SubtitlePair, DatabaseManager
from cinefluent.ingestion_service import IngestionService


class TestTextCleaner:
    """Test cases for text cleaning functionality"""
    
    def setup_method(self):
        self.cleaner = TextCleaner()
    
    def test_basic_cleaning(self):
        text = "<i>Hello, World!</i>"
        cleaned = self.cleaner.clean_text(text)
        assert cleaned == "hello, world!"
    
    def test_html_tag_removal(self):
        text = "<font color='red'>Red text</font>"
        cleaned = self.cleaner.clean_text(text)
        assert cleaned == "red text"
    
    def test_formatting_removal(self):
        text = "{\\an8}Top centered text"
        cleaned = self.cleaner.clean_text(text)
        assert cleaned == "top centered text"
    
    def test_whitespace_normalization(self):
        text = "Multiple    spaces   and\n\nnewlines"
        cleaned = self.cleaner.clean_text(text)
        assert cleaned == "multiple spaces and newlines"
    
    def test_empty_text(self):
        assert self.cleaner.clean_text("") == ""
        assert self.cleaner.clean_text(None) == ""


class TestSubtitleProcessor:
    """Test cases for subtitle processing"""
    
    def setup_method(self):
        self.processor = SubtitleProcessor()
    
    def create_test_srt_file(self, content: str) -> Path:
        """Helper to create temporary SRT file"""
        fd, path = tempfile.mkstemp(suffix='.srt')
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(content)
        return Path(path)
    
    def test_parse_valid_srt(self):
        srt_content = """1
00:00:01,000 --> 00:00:03,000
Hello, world!

2
00:00:04,000 --> 00:00:06,000
This is a test.
"""
        
        file_path = self.create_test_srt_file(srt_content)
        try:
            cues = self.processor.parse_subtitle_file(file_path)
            
            assert len(cues) == 2
            assert cues[0].text == "Hello, world!"
            assert cues[0].start_time == Decimal('1.0')
            assert cues[0].end_time == Decimal('3.0')
            assert cues[1].text == "This is a test."
            assert cues[1].start_time == Decimal('4.0')
            assert cues[1].end_time == Decimal('6.0')
        finally:
            os.unlink(file_path)
    
    def test_align_perfect_match(self):
        en_cues = [
            SubtitleCue(Decimal('1.0'), Decimal('3.0'), "Hello", "hello", 1),
            SubtitleCue(Decimal('4.0'), Decimal('6.0'), "World", "world", 2)
        ]
        
        de_cues = [
            SubtitleCue(Decimal('1.0'), Decimal('3.0'), "Hallo", "hallo", 1),
            SubtitleCue(Decimal('4.0'), Decimal('6.0'), "Welt", "welt", 2)
        ]
        
        aligned = self.processor.align_subtitles(en_cues, de_cues)
        
        assert len(aligned) == 2
        assert aligned[0][2] > 0.7  # High alignment score
        assert aligned[1][2] > 0.7


class TestSubtitleValidator:
    """Test cases for subtitle validation"""
    
    def setup_method(self):
        self.validator = SubtitleValidator()
    
    def test_validate_good_cues(self):
        cues = [
            SubtitleCue(Decimal('1.0'), Decimal('3.0'), "Hello", "hello", 1),
            SubtitleCue(Decimal('4.0'), Decimal('6.0'), "World", "world", 2)
        ]
        
        result = self.validator.validate_cues(cues)
        
        assert result['valid'] is True
        assert result['count'] == 2
        assert len(result['issues']) == 0
    
    def test_validate_empty_cues(self):
        result = self.validator.validate_cues([])
        
        assert result['valid'] is False
        assert 'No subtitle cues found' in result['error']


class TestIntegration:
    """Integration tests for the complete pipeline"""
    
    def test_end_to_end_processing(self):
        """Test complete subtitle processing pipeline"""
        processor = SubtitleProcessor()
        validator = SubtitleValidator()
        
        # Create test data
        en_cues = [
            SubtitleCue(Decimal('1.0'), Decimal('3.0'), "Hello", "hello", 1),
            SubtitleCue(Decimal('4.0'), Decimal('6.0'), "World", "world", 2)
        ]
        
        de_cues = [
            SubtitleCue(Decimal('1.0'), Decimal('3.0'), "Hallo", "hallo", 1),
            SubtitleCue(Decimal('4.0'), Decimal('6.0'), "Welt", "welt", 2)
        ]
        
        # Validate
        en_validation = validator.validate_cues(en_cues)
        de_validation = validator.validate_cues(de_cues)
        
        assert en_validation['valid']
        assert de_validation['valid']
        
        # Align
        aligned_pairs = processor.align_subtitles(en_cues, de_cues)
        alignment_validation = validator.validate_alignment(aligned_pairs)
        
        assert alignment_validation['valid']
        assert len(aligned_pairs) == 2
        assert alignment_validation['quality'] in ['excellent', 'good']


# Simple test to verify basic functionality
def test_basic_import():
    """Test that all modules can be imported"""
    assert SubtitleProcessor is not None
    assert TextCleaner is not None
    assert SubtitleValidator is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
