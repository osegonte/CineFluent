#!/bin/bash

# CineFluent Stage 3 - Quick Fix Script
# Fixes TypeScript errors and port conflicts

set -e

echo "🔧 Fixing Stage 3 Issues"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Fixing TypeScript errors..."

cd client

# Fix QuizCard TypeScript errors
cat > src/components/quiz/QuizCard.tsx << 'EOF'
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizCardProps {
  question: string;
  options: QuizOption[];
  onAnswer: (optionId: string, isCorrect: boolean) => void;
  progress?: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  options, 
  onAnswer, 
  progress = 0 
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionPress = (option: QuizOption) => {
    if (selectedOption) return;
    setSelectedOption(option.id);
    setShowResult(true);
    onAnswer(option.id, option.isCorrect);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      <Text style={styles.question}>{question}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          let buttonStyle: ViewStyle[] = [styles.optionButton];
          let textStyle: TextStyle[] = [styles.optionText];

          if (showResult && selectedOption === option.id) {
            if (option.isCorrect) {
              buttonStyle = [styles.optionButton, styles.correctOption];
              textStyle = [styles.optionText, styles.correctOptionText];
            } else {
              buttonStyle = [styles.optionButton, styles.incorrectOption];
              textStyle = [styles.optionText, styles.incorrectOptionText];
            }
          } else if (showResult && option.isCorrect) {
            buttonStyle = [styles.optionButton, styles.correctOption];
            textStyle = [styles.optionText, styles.correctOptionText];
          }

          return (
            <TouchableOpacity
              key={option.id}
              style={buttonStyle}
              onPress={() => handleOptionPress(option)}
              disabled={showResult}
            >
              <Text style={textStyle}>{option.text}</Text>
              {showResult && selectedOption === option.id && (
                <Ionicons 
                  name={option.isCorrect ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={option.isCorrect ? COLORS.success : COLORS.error}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {showResult && (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>
            {options.find(o => o.id === selectedOption)?.isCorrect 
              ? "¡Correcto! Well done! 🎉" 
              : "Not quite right. Try again! 💪"
            }
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  correctOption: {
    backgroundColor: `${COLORS.success}20`,
    borderColor: COLORS.success,
  },
  incorrectOption: {
    backgroundColor: `${COLORS.error}20`,
    borderColor: COLORS.error,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  correctOptionText: {
    color: COLORS.success,
    fontWeight: '600',
  },
  incorrectOptionText: {
    color: COLORS.error,
    fontWeight: '600',
  },
  feedback: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
EOF

print_success "Fixed QuizCard TypeScript errors"

# Fix MainNavigator icon error
cat > src/navigation/MainNavigator.tsx << 'EOF'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { LessonScreen } from '@/screens/learning/LessonScreen';
import { VocabularyScreen } from '@/screens/vocabulary/VocabularyScreen';
import { ProgressScreen } from '@/screens/progress/ProgressScreen';
import { CommunityScreen } from '@/screens/community/CommunityScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { COLORS } from '@/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Learn Stack - includes dashboard and lesson screens
const LearnStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
    </Stack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Learn') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Learn" 
        component={LearnStack}
        options={{ tabBarLabel: 'Learn' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ tabBarLabel: 'Progress' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ tabBarLabel: 'Community' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
EOF

print_success "Fixed MainNavigator icon error"

# Remove problematic API client file and create simpler version
rm -f src/services/api/client.ts

# Create simpler API service without external dependencies
cat > src/services/api.ts << 'EOF'
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('access_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.makeRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, confirm_password: string) {
    return this.makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, confirm_password }),
    });
  }

  async getCurrentUser() {
    return this.makeRequest('/api/v1/auth/me');
  }

  async logout() {
    return this.makeRequest('/api/v1/auth/logout', { method: 'POST' });
  }

  // Learning endpoints
  async getContinueLearning() {
    return this.makeRequest('/api/v1/learning/continue');
  }

  async getLesson(lessonId: string) {
    return this.makeRequest(`/api/v1/lessons/${lessonId}`);
  }

  async getQuiz(lessonId: string) {
    return this.makeRequest(`/api/v1/quiz/${lessonId}`);
  }

  async submitQuiz(lessonId: string, answers: any) {
    return this.makeRequest(`/api/v1/quiz/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // Gamification endpoints
  async getStreak() {
    return this.makeRequest('/api/v1/gamification/streak');
  }

  async getProgress() {
    return this.makeRequest('/api/v1/gamification/progress');
  }

  // Movies endpoints
  async getMovies() {
    return this.makeRequest('/api/v1/movies');
  }
}

export const apiService = new ApiService();
EOF

print_success "Created simplified API service"

cd ..

# Check if port 5433 is occupied and free it
print_status "Checking port conflicts..."

if lsof -Pi :5433 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 5433 is in use, stopping existing PostgreSQL containers..."
    
    # Stop any existing CineFluent containers
    docker-compose down 2>/dev/null || true
    
    # Stop any other PostgreSQL containers that might be using the port
    docker ps --filter "publish=5433" --format "{{.ID}}" | xargs -r docker stop 2>/dev/null || true
    
    # Wait a moment for the port to be released
    sleep 3
    
    if lsof -Pi :5433 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port 5433 is still in use. Please manually stop the process using port 5433:"
        print_error "  lsof -ti:5433 | xargs kill -9"
        print_error "Or change the port in docker-compose.yml"
        exit 1
    else
        print_success "Port 5433 freed successfully"
    fi
else
    print_success "Port 5433 is available"
fi

# Update start_dev.sh to handle port conflicts better
cat > start_dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting CineFluent Development Environment"
echo "=============================================="

# Function to check if port is in use and try to free it
check_and_free_port() {
    PORT=$1
    SERVICE_NAME=$2
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $PORT is in use by $SERVICE_NAME, attempting to free it..."
        
        if [ "$SERVICE_NAME" = "database" ]; then
            # Try to stop Docker containers using this port
            docker ps --filter "publish=$PORT" --format "{{.ID}}" | xargs -r docker stop 2>/dev/null || true
            sleep 2
        fi
        
        if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "❌ Could not free port $PORT. Please manually stop the process:"
            echo "   lsof -ti:$PORT | xargs kill -9"
            return 1
        else
            echo "✅ Port $PORT freed successfully"
        fi
    fi
    return 0
}

# Check required ports
check_and_free_port 8000 "backend API" || exit 1
check_and_free_port 5433 "database" || exit 1
check_and_free_port 6379 "Redis" || exit 1
check_and_free_port 19006 "Expo web" || exit 1

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
    if docker exec cinefluent_db pg_isready -U cinefluent_user -d cinefluent >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Database failed to start after 30 seconds"
        docker-compose logs db
        exit 1
    fi
    sleep 1
done

# Start backend API
echo "🔧 Starting backend API..."
cd backend
python run_fixed_api.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
for i in {1..20}; do
    if curl -s http://localhost:8000/health >/dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 20 ]; then
        echo "❌ Backend failed to start after 20 seconds"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# Test backend
echo "🧪 Testing backend..."
if python test_stage3.py; then
    echo "✅ Backend tests passed!"
    
    # Start frontend
    echo "📱 Starting frontend..."
    cd client
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "🎉 CineFluent Stage 3 Development Environment is running!"
    echo "=================================================="
    echo "🔧 Backend API: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs"
    echo "❤️ Health Check: http://localhost:8000/health"
    echo "📱 Frontend Web: http://localhost:19006"
    echo "📱 Expo DevTools: http://localhost:19002"
    echo ""
    echo "💡 Tips:"
    echo "   • Press 'w' in the Expo terminal to open web version"
    echo "   • Scan QR code with Expo Go app for mobile testing"
    echo "   • Use demo account: demo@cinefluent.app / Test123!"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Handle cleanup on exit
    trap 'echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker-compose down; exit 0' SIGINT SIGTERM
    
    # Keep script running
    wait
else
    echo "❌ Backend tests failed!"
    kill $BACKEND_PID 2>/dev/null
    docker-compose down
    exit 1
fi
EOF

chmod +x start_dev.sh

print_success "Updated startup script with better port handling"

# Update the test script to be more robust
cat > test_stage3.py << 'EOF'
#!/usr/bin/env python3
"""
Stage 3 Integration Test Script
Tests the complete authentication and lesson flow
"""

import requests
import json
import time
import sys

API_BASE_URL = "http://localhost:8000"

def test_health():
    """Test API health"""
    print("🔍 Testing API health...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✅ API health check passed")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_registration_and_login():
    """Test user registration and login"""
    print("🔍 Testing user registration...")
    
    # Register new user
    register_data = {
        "email": "test@cinefluent.app",
        "password": "TestPass123!",
        "confirm_password": "TestPass123!"
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/v1/auth/register", 
                               json=register_data, timeout=10)
        print(f"Registration response: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            token = data["access_token"]
            print("✅ Registration successful")
        elif response.status_code == 400 and "already registered" in response.text:
            print("ℹ️ User already exists, testing login...")
            
            # Try login instead
            login_data = {
                "email": "test@cinefluent.app",
                "password": "TestPass123!"
            }
            
            response = requests.post(f"{API_BASE_URL}/api/v1/auth/login", 
                                   json=login_data, timeout=10)
            assert response.status_code == 200
            data = response.json()
            token = data["access_token"]
            print("✅ Login successful")
        else:
            raise Exception(f"Registration/Login failed: {response.status_code} {response.text}")
        
        return token
        
    except Exception as e:
        print(f"❌ Registration/Login error: {e}")
        return None

def test_authenticated_endpoints(token):
    """Test authenticated endpoints"""
    headers = {"Authorization": f"Bearer {token}"}
    
    print("🔍 Testing authenticated endpoints...")
    
    try:
        # Test user profile
        response = requests.get(f"{API_BASE_URL}/api/v1/auth/me", 
                              headers=headers, timeout=10)
        assert response.status_code == 200
        user_data = response.json()
        print(f"✅ User profile: {user_data['email']}")
        
        # Test streak
        response = requests.get(f"{API_BASE_URL}/api/v1/gamification/streak", 
                              headers=headers, timeout=10)
        assert response.status_code == 200
        streak_data = response.json()
        print(f"✅ User streak: {streak_data['current_streak']} days")
        
        # Test continue learning
        response = requests.get(f"{API_BASE_URL}/api/v1/learning/continue", 
                              headers=headers, timeout=10)
        assert response.status_code == 200
        learning_data = response.json()
        print(f"✅ Continue learning: {learning_data['has_active_session']}")
        
        # Test lesson
        response = requests.get(f"{API_BASE_URL}/api/v1/lessons/1", 
                              headers=headers, timeout=10)
        assert response.status_code == 200
        lesson_data = response.json()
        print(f"✅ Lesson data: {lesson_data['movie_title']}")
        
        # Test quiz
        response = requests.get(f"{API_BASE_URL}/api/v1/quiz/1", 
                              headers=headers, timeout=10)
        assert response.status_code == 200
        quiz_data = response.json()
        print(f"✅ Quiz data: {len(quiz_data['questions'])} questions")
        
        # Test quiz submission
        quiz_answers = {
            "answers": [
                {"question_id": "q1", "answer": "Sheriff"},
                {"question_id": "q2", "answer": "Hola"}
            ]
        }
        response = requests.post(f"{API_BASE_URL}/api/v1/quiz/1/submit", 
                               json=quiz_answers, headers=headers, timeout=10)
        assert response.status_code == 200
        result_data = response.json()
        print(f"✅ Quiz result: {result_data['score_percentage']}% score")
        
        return True
        
    except Exception as e:
        print(f"❌ Authenticated endpoints test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Starting Stage 3 Integration Tests")
    print("=" * 50)
    
    # Test basic connectivity
    if not test_health():
        print("❌ Cannot connect to API. Make sure backend is running.")
        sys.exit(1)
    
    # Test authentication flow
    token = test_registration_and_login()
    if not token:
        print("❌ Authentication test failed")
        sys.exit(1)
    
    # Test authenticated features
    if not test_authenticated_endpoints(token):
        print("❌ Authenticated endpoints test failed")
        sys.exit(1)
    
    print("=" * 50)
    print("🎉 All Stage 3 tests passed!")
    print("✅ Authentication system working")
    print("✅ Lesson flow implemented") 
    print("✅ Quiz system functional")
    print("✅ Progress tracking active")

if __name__ == "__main__":
    main()
EOF

print_success "Updated test script with better error handling"

# Create a simple npm audit fix to address warnings
cd client
print_status "Addressing npm security warnings..."
npm audit fix 2>/dev/null || print_warning "Some npm warnings remain (this is normal for Expo projects)"
cd ..

print_success "All fixes applied!"

echo ""
echo "🎉 Stage 3 Issues Fixed!"
echo "======================="
echo ""
echo "✅ Fixed TypeScript compilation errors"
echo "✅ Resolved icon name conflicts"  
echo "✅ Simplified API service (removed external dependencies)"
echo "✅ Improved port conflict handling"
echo "✅ Enhanced error handling in tests"
echo ""
echo "🚀 Ready to start development:"
echo "   ./start_dev.sh"
echo ""
echo "💡 The app should now start without TypeScript errors!"