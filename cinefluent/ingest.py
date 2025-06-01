#!/usr/bin/env python3
"""
Command-line interface for cinefluent subtitle ingestion
Usage: python -m cinefluent.ingest [command] [options]
"""

import asyncio
import argparse
import sys
import os
from pathlib import Path
from typing import Optional

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from cinefluent.database_models import Base
from cinefluent.ingestion_service import IngestionService, IngestionCLI

# Load environment variables
load_dotenv()


def get_database_session():
    """Create database session from environment variables"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")
    
    engine = create_engine(database_url)
    Session = sessionmaker(bind=engine)
    return Session()


async def cmd_upload(args):
    """Handle file upload command"""
    if not args.en_file or not args.de_file:
        print("Error: Both --en-file and --de-file are required")
        return 1
    
    en_file = Path(args.en_file)
    de_file = Path(args.de_file)
    
    if not en_file.exists():
        print(f"Error: English subtitle file not found: {en_file}")
        return 1
    
    if not de_file.exists():
        print(f"Error: German subtitle file not found: {de_file}")
        return 1
    
    try:
        session = get_database_session()
        service = IngestionService(session)
        
        print(f"Processing subtitles for '{args.title}'...")
        
        result = await service.ingest_manual_upload(
            movie_title=args.title,
            movie_year=args.year,
            en_file_path=en_file,
            de_file_path=de_file,
            imdb_id=args.imdb_id
        )
        
        if result['success']:
            print("✅ Ingestion successful!")
            print(f"   Movie: {result['movie_title']}")
            print(f"   English subtitles: {result['en_subtitles_count']}")
            print(f"   German subtitles: {result['de_subtitles_count']}")
            print(f"   Aligned pairs: {result['aligned_pairs_count']}")
            print(f"   Alignment quality: {result['alignment_quality']}")
            print(f"   Alignment score: {result['alignment_score']:.2f}")
        else:
            print("❌ Ingestion failed!")
            print(f"   Error: {result['error']}")
            return 1
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0


async def cmd_fetch(args):
    """Handle DeepSeek fetch command"""
    if not args.imdb_id:
        print("Error: --imdb-id is required for fetch command")
        return 1
    
    try:
        session = get_database_session()
        deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
        
        if not deepseek_api_key:
            print("Error: DEEPSEEK_API_KEY environment variable not set")
            return 1
        
        service = IngestionService(session, deepseek_api_key)
        
        print(f"Fetching subtitles for '{args.title}' (IMDb: {args.imdb_id})...")
        
        result = await service.ingest_deepseek_fetch(
            movie_title=args.title,
            imdb_id=args.imdb_id,
            movie_year=args.year
        )
        
        if result['success']:
            print("✅ Fetch successful!")
            print(f"   Movie: {result['movie_title']}")
            print(f"   English subtitles: {result['en_subtitles_count']}")
            print(f"   German subtitles: {result['de_subtitles_count']}")
            print(f"   Aligned pairs: {result['aligned_pairs_count']}")
            print(f"   Alignment quality: {result['alignment_quality']}")
            print(f"   Alignment score: {result['alignment_score']:.2f}")
        else:
            print("❌ Fetch failed!")
            print(f"   Error: {result['error']}")
            return 1
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0


async def cmd_single(args):
    """Handle single file ingestion (for testing)"""
    if not args.file:
        print("Error: --file is required")
        return 1
    
    if not args.lang:
        print("Error: --lang is required")
        return 1
    
    try:
        session = get_database_session()
        cli = IngestionCLI(session)
        
        await cli.ingest_file(
            movie_title=args.title,
            file_path=args.file,
            lang=args.lang,
            movie_year=args.year
        )
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0


def cmd_init_db(args):
    """Initialize database tables"""
    try:
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            raise ValueError("DATABASE_URL environment variable not set")
        
        engine = create_engine(database_url)
        
        print("Creating database tables...")
        Base.metadata.create_all(engine)
        print("✅ Database initialized successfully!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return 1
    
    return 0


def cmd_status(args):
    """Show database status"""
    try:
        session = get_database_session()
        
        # Count movies
        from cinefluent.database_models import Movie, Subtitle, SubtitlePair
        movie_count = session.query(Movie).count()
        subtitle_count = session.query(Subtitle).count()
        pair_count = session.query(SubtitlePair).count()
        
        print("📊 Database Status:")
        print(f"   Movies: {movie_count}")
        print(f"   Subtitles: {subtitle_count}")
        print(f"   Aligned pairs: {pair_count}")
        
        # Show recent movies
        recent_movies = session.query(Movie).order_by(Movie.created_at.desc()).limit(5).all()
        
        if recent_movies:
            print("\n🎬 Recent Movies:")
            for movie in recent_movies:
                en_count = session.query(Subtitle).filter(
                    Subtitle.movie_id == movie.id,
                    Subtitle.lang == 'en'
                ).count()
                de_count = session.query(Subtitle).filter(
                    Subtitle.movie_id == movie.id,
                    Subtitle.lang == 'de'
                ).count()
                print(f"   • {movie.title} ({movie.year}) - EN: {en_count}, DE: {de_count}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description="cinefluent subtitle ingestion CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Upload bilingual subtitle files
  python -m cinefluent.ingest upload "Inception" --en-file inception_en.srt --de-file inception_de.srt --year 2010
  
  # Fetch subtitles via DeepSeek API (premium)
  python -m cinefluent.ingest fetch "Interstellar" --imdb-id tt0816692 --year 2014
  
  # Process single file for testing
  python -m cinefluent.ingest single "Test Movie" --file test_en.srt --lang en
  
  # Initialize database
  python -m cinefluent.ingest init-db
  
  # Check status
  python -m cinefluent.ingest status
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Upload command
    upload_parser = subparsers.add_parser('upload', help='Upload bilingual subtitle files')
    upload_parser.add_argument('title', help='Movie title')
    upload_parser.add_argument('--en-file', required=True, help='English subtitle file')
    upload_parser.add_argument('--de-file', required=True, help='German subtitle file')
    upload_parser.add_argument('--year', type=int, help='Movie year')
    upload_parser.add_argument('--imdb-id', help='IMDb ID (optional)')
    
    # Fetch command
    fetch_parser = subparsers.add_parser('fetch', help='Fetch subtitles via DeepSeek API')
    fetch_parser.add_argument('title', help='Movie title')
    fetch_parser.add_argument('--imdb-id', required=True, help='IMDb ID')
    fetch_parser.add_argument('--year', type=int, help='Movie year')
    
    # Single file command
    single_parser = subparsers.add_parser('single', help='Process single subtitle file')
    single_parser.add_argument('title', help='Movie title')
    single_parser.add_argument('--file', required=True, help='Subtitle file path')
    single_parser.add_argument('--lang', required=True, choices=['en', 'de'], help='Language')
    single_parser.add_argument('--year', type=int, help='Movie year')
    
    # Database commands
    subparsers.add_parser('init-db', help='Initialize database tables')
    subparsers.add_parser('status', help='Show database status')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    # Handle database commands (sync)
    if args.command == 'init-db':
        return cmd_init_db(args)
    elif args.command == 'status':
        return cmd_status(args)
    
    # Handle async commands
    if args.command == 'upload':
        return asyncio.run(cmd_upload(args))
    elif args.command == 'fetch':
        return asyncio.run(cmd_fetch(args))
    elif args.command == 'single':
        return asyncio.run(cmd_single(args))
    
    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())