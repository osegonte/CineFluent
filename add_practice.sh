#!/bin/bash
# Add Real Practice Functionality to CineFluent

echo "🎯 Adding real practice functionality..."

# 1. Create directories
mkdir -p src/screens/{dashboard,lesson,vocabulary,leaderboard,profile}
mkdir -p src/navigation
mkdir -p src/constants

# 2. Create constants
cat > src/constants/index.ts << 'EOF'
export const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
} as const;
EOF

# 3. Create working dashboard with navigation
cat > src/screens/dashboard/DashboardScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

interface DashboardScreenProps {
  navigation?: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const handleStartPractice = () => {
    navigation?.navigate('Lesson');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>Language Learner! 👋</Text>
        </View>

        <View style={styles.statsSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.statCard}
          >
            <Ionicons name="flame" size={24} color="white" />
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </LinearGradient>

          <View style={[styles.statCard, styles.statCardWhite]}>
            <Ionicons name="book" size={24} color={COLORS.primary} />
            <Text style={[styles.statNumber, styles.statNumberDark]}>347</Text>
            <Text style={[styles.statLabel, styles.statLabelDark]}>Words Learned</Text>
          </View>
        </View>

        {/* Continue Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity style={styles.movieCard} onPress={handleStartPractice}>
            <View style={styles.movieIcon}>
              <Ionicons name="film" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>Toy Story • Scene 1</Text>
              <Text style={styles.movieSubtitle}>Spanish • Beginner</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65% complete</Text>
            </View>
            <TouchableOpacity style={styles.playButton} onPress={handleStartPractice}>
              <Ionicons name="play" size={16} color="white" />
              <Text style={styles.playButtonText}>Continue</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Quick Start */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.quickStartCard} onPress={handleStartPractice}>
            <Ionicons name="flash" size={32} color={COLORS.primary} />
            <Text style={styles.quickStartTitle}>Quick Practice</Text>
            <Text style={styles.quickStartText}>Start a 5-minute lesson</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statCardWhite: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  statNumberDark: {
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  statLabelDark: {
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  movieCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  movieIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  movieSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quickStartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  quickStartText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
EOF

# 4. Create interactive lesson screen
cat > src/screens/lesson/LessonScreen.tsx << 'EOF'
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

// Sample lesson data
const lessonData = [
  {
    id: 1,
    english: "Hello! I'm Woody, the sheriff of this place.",
    spanish: "¡Hola! Soy Woody, el sheriff de este lugar.",
    timeStamp: "00:01:23",
    vocabulary: [
      { english: "Hello", spanish: "Hola", difficulty: "basic" },
      { english: "Sheriff", spanish: "Sheriff", difficulty: "intermediate" },
      { english: "Place", spanish: "Lugar", difficulty: "basic" }
    ]
  },
  {
    id: 2,
    english: "What does 'sheriff' mean in English?",
    spanish: "¿Qué significa 'sheriff' en inglés?",
    timeStamp: "00:01:45",
    vocabulary: [
      { english: "What", spanish: "Qué", difficulty: "basic" },
      { english: "Mean", spanish: "Significa", difficulty: "intermediate" },
    ]
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "What does 'sheriff' mean in English?",
    options: ["Teacher", "Sheriff", "Doctor", "Friend"],
    correct: "Sheriff"
  }
];

interface LessonScreenProps {
  navigation?: any;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<'scene' | 'vocabulary' | 'quiz'>('scene');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);

  const currentLesson = lessonData[currentIndex];
  const isLastLesson = currentIndex === lessonData.length - 1;

  const handleRevealTranslation = () => {
    setShowTranslation(true);
    setWordsLearned(prev => prev + currentLesson.vocabulary.length);
  };

  const handleNextStep = () => {
    if (currentStep === 'scene') {
      setCurrentStep('vocabulary');
    } else if (currentStep === 'vocabulary') {
      setCurrentStep('quiz');
    } else {
      handleLessonComplete();
    }
  };

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
    const correct = quizQuestions.find(q => q.id === questionId)?.correct === answer;
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleLessonComplete = () => {
    const finalScore = (score / quizQuestions.length) * 100;
    Alert.alert(
      "¡Correcto! Well done! 🎉",
      `You scored ${Math.round(finalScore)}% and learned ${wordsLearned} words!`,
      [
        { 
          text: "Continue Learning", 
          onPress: () => {
            if (!isLastLesson) {
              setCurrentIndex(prev => prev + 1);
              setCurrentStep('scene');
              setShowTranslation(false);
            } else {
              navigation?.goBack();
            }
          }
        }
      ]
    );
  };

  const renderSceneView = () => (
    <ScrollView style={styles.content}>
      <View style={styles.sceneCard}>
        <View style={styles.movieHeader}>
          <Text style={styles.movieTitle}>Toy Story - Scene 1</Text>
          <Text style={styles.timeStamp}>{currentLesson.timeStamp}</Text>
        </View>

        {/* Audio Visualization */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.audioViz}
        >
          <Ionicons name="play" size={32} color="white" />
          <Text style={styles.audioText}>Audio visualization</Text>
          <View style={styles.audioControls}>
            <Ionicons name="play-skip-back" size={20} color="white" />
            <Ionicons name="play" size={24} color="white" />
            <Ionicons name="play-skip-forward" size={20} color="white" />
            <Ionicons name="volume-high" size={20} color="white" />
          </View>
        </LinearGradient>

        {/* Subtitle Text */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.englishText}>{currentLesson.english}</Text>
          {showTranslation && (
            <Text style={styles.spanishText}>{currentLesson.spanish}</Text>
          )}
        </View>

        {!showTranslation && (
          <TouchableOpacity 
            style={styles.revealButton}
            onPress={handleRevealTranslation}
          >
            <Text style={styles.revealButtonText}>Tap to reveal Spanish</Text>
          </TouchableOpacity>
        )}
      </View>

      {showTranslation && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Continue Learning</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  const renderVocabularyView = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>📚 Key Vocabulary</Text>
      {currentLesson.vocabulary.map((word, index) => (
        <View key={index} style={styles.vocabCard}>
          <View style={styles.vocabContent}>
            <Text style={styles.vocabEnglish}>{word.english}</Text>
            <Text style={styles.vocabSpanish}>{word.spanish}</Text>
          </View>
          <View style={[styles.difficultyBadge, 
            { backgroundColor: word.difficulty === 'basic' ? COLORS.success : 
              word.difficulty === 'intermediate' ? COLORS.warning : COLORS.error }
          ]}>
            <Text style={styles.difficultyText}>{word.difficulty}</Text>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
        <Text style={styles.nextButtonText}>Take Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderQuizView = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Quick Quiz</Text>
      {quizQuestions.map((question) => (
        <View key={question.id} style={styles.quizCard}>
          <Text style={styles.questionText}>{question.question}</Text>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                quizAnswers[question.id] === option && styles.selectedOption
              ]}
              onPress={() => handleQuizAnswer(question.id, option)}
            >
              <Text style={[
                styles.optionText,
                quizAnswers[question.id] === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {Object.keys(quizAnswers).length === quizQuestions.length && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Complete Lesson</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentStep === 'scene' ? 'Learn' : 
           currentStep === 'vocabulary' ? 'Vocabulary' : 'Quiz'}
        </Text>
        <Text style={styles.progress}>
          {currentIndex + 1}/{lessonData.length}
        </Text>
      </View>

      {/* Step Indicators */}
      <View style={styles.stepIndicator}>
        <View style={[styles.step, currentStep === 'scene' && styles.activeStep]}>
          <Text style={styles.stepText}>Scene</Text>
        </View>
        <View style={[styles.step, currentStep === 'vocabulary' && styles.activeStep]}>
          <Text style={styles.stepText}>Vocabulary</Text>
        </View>
        <View style={[styles.step, currentStep === 'quiz' && styles.activeStep]}>
          <Text style={styles.stepText}>Quiz</Text>
        </View>
      </View>

      {/* Content */}
      {currentStep === 'scene' && renderSceneView()}
      {currentStep === 'vocabulary' && renderVocabularyView()}
      {currentStep === 'quiz' && renderQuizView()}

      {/* Stats Footer */}
      <View style={styles.statsFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{wordsLearned}</Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{score}</Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>65%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progress: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  step: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.border,
  },
  activeStep: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    fontSize: 12,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sceneCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  timeStamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  audioViz: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  audioText: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
  },
  audioControls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  subtitleContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  englishText: {
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.text,
    marginBottom: 12,
  },
  spanishText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  revealButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  revealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 20,
  },
  vocabCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vocabContent: {
    flex: 1,
  },
  vocabEnglish: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  vocabSpanish: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  questionText: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsFooter: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 16,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
EOF

# 5. Create placeholder screens
for screen in vocabulary leaderboard profile; do
  screen_name="$(tr '[:lower:]' '[:upper:]' <<< ${screen:0:1})${screen:1}"
  cat > "src/screens/${screen}/${screen_name}Screen.tsx" << EOF
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';

export const ${screen_name}Screen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>${screen_name}</Text>
      <Text style={styles.subtitle}>Coming soon!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
EOF
done

# 6. Create MainNavigator
cat > src/navigation/MainNavigator.tsx << 'EOF'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { VocabularyScreen } from '@/screens/vocabulary/VocabularyScreen';
import { LeaderboardScreen } from '@/screens/leaderboard/LeaderboardScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { LessonScreen } from '@/screens/lesson/LessonScreen';
import { COLORS } from '@/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} />
    <Stack.Screen name="Lesson" component={LessonScreen} />
  </Stack.Navigator>
);

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Vocabulary') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Vocabulary" component={VocabularyScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
EOF

# 7. Update App.tsx to use navigation
cat > App.tsx << 'EOF'
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainNavigator } from './src/navigation/MainNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
EOF

# 8. Update tsconfig.json for proper path resolution
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ]
}
EOF

# 9. Update babel.config.js for path resolution
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
EOF

echo "✅ Real practice functionality added!"
echo ""
echo "🎯 What you can now do:"
echo "   • Navigate between screens with bottom tabs"
echo "   • Tap 'Continue' or 'Quick Practice' on Dashboard"
echo "   • Go through Scene → Vocabulary → Quiz flow"
echo "   • See progress tracking and scores"
echo "   • Complete full lessons with feedback"
echo ""
echo "🚀 To test:"
echo "   1. Stop current expo process (Ctrl+C)"
echo "   2. Fix duplicate files issue:"
echo "      cd .. && mv package.json package.json.backup"
echo "      cd client"
echo "   3. Restart: npm start"
echo "   4. Press 'w' for web or scan QR code"
echo "   5. Tap 'Continue' button to start practicing!"