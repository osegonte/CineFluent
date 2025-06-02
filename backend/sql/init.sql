-- Create cinefluent database schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Movies table
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    year INTEGER,
    imdb_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subtitles table
CREATE TABLE subtitles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    lang VARCHAR(5) NOT NULL,
    start_ts DECIMAL(10, 3) NOT NULL,
    end_ts DECIMAL(10, 3) NOT NULL,
    text TEXT NOT NULL,
    text_normalized TEXT, -- cleaned version for alignment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subtitle pairs table (aligned EN-DE subtitles)
CREATE TABLE subtitle_pairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    en_id UUID NOT NULL REFERENCES subtitles(id) ON DELETE CASCADE,
    de_id UUID NOT NULL REFERENCES subtitles(id) ON DELETE CASCADE,
    alignment_score DECIMAL(3, 2) DEFAULT 1.0, -- confidence in alignment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(en_id, de_id)
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vocabulary table
CREATE TABLE vocab (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word VARCHAR(100) NOT NULL,
    lang VARCHAR(5) NOT NULL,
    definition TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(word, lang)
);

-- User vocabulary progress
CREATE TABLE user_vocab (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vocab_id UUID NOT NULL REFERENCES vocab(id) ON DELETE CASCADE,
    seen_count INTEGER DEFAULT 0,
    mastered BOOLEAN DEFAULT FALSE,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, vocab_id)
);

-- User streaks
CREATE TABLE streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_active DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for performance
CREATE INDEX idx_subtitles_movie_lang ON subtitles(movie_id, lang);
CREATE INDEX idx_subtitles_timestamps ON subtitles(start_ts, end_ts);
CREATE INDEX idx_subtitle_pairs_movie ON subtitle_pairs(movie_id);
CREATE INDEX idx_user_vocab_user ON user_vocab(user_id);
CREATE INDEX idx_user_vocab_mastered ON user_vocab(user_id, mastered);
CREATE INDEX idx_vocab_word_lang ON vocab(word, lang);

-- Insert sample data for testing
INSERT INTO movies (title, year, imdb_id) VALUES 
('Inception', 2010, 'tt1375666'),
('Interstellar', 2014, 'tt0816692');

-- Create a view for leaderboards
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.id,
    u.email,
    s.current_streak,
    s.longest_streak,
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
ORDER BY s.longest_streak DESC, vocab_stats.mastered_count DESC;