#!/usr/bin/env python3
"""
Simple database initialization script
"""
import os
import psycopg2
from dotenv import load_dotenv

def init_database():
    """Initialize database with basic tables"""
    load_dotenv()
    
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5433'),
            user=os.getenv('DB_USER', 'cinefluent_user'),
            password=os.getenv('DB_PASSWORD', 'cinefluent_pass'),
            database=os.getenv('DB_NAME', 'cinefluent')
        )
        
        cursor = conn.cursor()
        
        # Create basic tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movies (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                year INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                is_premium BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Insert demo data
        cursor.execute("""
            INSERT INTO movies (title, year) VALUES 
            ('Toy Story', 2010),
            ('Finding Nemo', 2014)
            ON CONFLICT DO NOTHING;
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✅ Database initialized successfully!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")

if __name__ == "__main__":
    init_database()
