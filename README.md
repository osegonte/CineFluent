# 🎬 CineFluent

A language learning app using bilingual movie subtitles to teach vocabulary and conversation skills.

## 🏗️ Project Structure

```
cinefluent/
├── backend/              # Python FastAPI backend
│   ├── cinefluent/      # Core backend package
│   ├── sql/             # Database setup scripts  
│   ├── tests/           # Backend tests
│   ├── docker-compose.yml
│   └── .env             # Backend configuration
├── client/              # React Native frontend
│   ├── src/             # App source code
│   ├── assets/          # Images, icons, etc.
│   ├── app.json         # Expo configuration
│   └── package.json     # Dependencies
└── README.md           # This file
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -e .
docker-compose up -d      # Start PostgreSQL & Redis
python -m cinefluent.ingest init-db
python -m cinefluent.api.main
```

### Frontend Setup
```bash
cd client
npm install
npm start
# Press 'w' for web, or scan QR code for mobile
```

## 🎯 Features

### ✅ Implemented
- **Backend API**: Authentication, user management, gamification
- **Frontend App**: Dashboard, navigation, lesson flow
- **Database**: PostgreSQL with subtitle data models
- **Authentication**: JWT-based auth with secure storage

### 🚧 In Progress
- Interactive lessons with real movie content
- Vocabulary quiz system
- Progress tracking and streaks
- Community features

## 🛠️ Development

### Backend Commands
```bash
# Test API endpoints
cd backend && python test_api.py

# Ingest subtitle files
python -m cinefluent.ingest upload "Movie Title" --en-file en.srt --de-file de.srt

# Check database status
python -m cinefluent.ingest status
```

### Frontend Commands
```bash
# Start development server
cd client && npm start

# Run on specific platform
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

## 📱 Demo

The app includes a working demo with:
- **Dashboard**: Shows 23-day streak and 347 words learned
- **Lesson Flow**: Scene → Vocabulary → Quiz progression
- **Progress Tracking**: Visual calendar and achievements
- **Navigation**: Bottom tabs between all main screens

## 🎓 Learning Flow

1. **Scene**: Watch movie clip with subtitles
2. **Vocabulary**: Review key words and translations  
3. **Quiz**: Test comprehension with multiple choice
4. **Progress**: Track streaks, goals, and achievements

## 🔧 Tech Stack

- **Backend**: FastAPI, PostgreSQL, Redis, SQLAlchemy
- **Frontend**: React Native, Expo, React Navigation
- **Auth**: JWT tokens with secure storage
- **Deployment**: Docker containers

## 📊 API Endpoints

- `GET /health` - System health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/gamification/streak` - User streak data
- `GET /api/v1/learning/continue` - Continue learning suggestions

View full API docs at: `http://localhost:8000/docs`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
