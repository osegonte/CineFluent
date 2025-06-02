# CineFluent Backend

Language learning API using bilingual movie subtitles.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start services
docker-compose up -d

# Initialize database
python -m cinefluent.ingest init-db

# Start API server
python -m cinefluent.api.main
```

## API Documentation

Visit http://localhost:8000/docs for interactive API documentation.
