// client/src/screens/learning/LessonScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { VocabCard } from '@/components/vocabulary/VocabCard';
import { QuizCard } from '@/components/quiz/QuizCard';
import { COLORS } from '@/constants';

interface LessonScreenProps {
  navigation: any;
  route: {
    params: {
      movieTitle: string;
      sceneTitle: string;
    };
  };
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const { movieTitle, sceneTitle } = route.params;

  const subtitleData = {
    spanish: "¡Hola! Soy Woody, el sheriff de este lugar.",
    english: "Hello! I'm Woody, the sheriff of this place."
  };

  const vocabulary = [
    { word: "Hola", translation: "Hello", difficulty: "basic" as const },
    { word: "Soy", translation: "I am", difficulty: "basic" as const },
    { word: "Sheriff", translation: "Sheriff", difficulty: "intermediate" as const },
    { word: "Lugar", translation: "Place", difficulty: "basic" as const },
  ];

  const quizQuestion = {
    question: "What does 'sheriff' mean in English?",
    options: [
      { id: "1", text: "Teacher", isCorrect: false },
      { id: "2", text: "Sheriff", isCorrect: true },
      { id: "3", text: "Doctor", isCorrect: false },
      { id: "4", text: "Friend", isCorrect: false },
    ]
  };

  if (showQuiz) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{movieTitle} - Scene 1</Text>
            <Text style={styles.headerSubtitle}>{sceneTitle}</Text>
          </View>
        </View>

        <QuizCard
          question={quizQuestion.question}
          options={quizQuestion.options}
          onAnswer={(optionId, isCorrect) => {
            console.log('Quiz answer:', { optionId, isCorrect });
            // Handle quiz completion
            setTimeout(() => setShowQuiz(false), 2000);
          }}
          progress={65}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{movieTitle} - Scene 1</Text>
          <Text style={styles.headerSubtitle}>{sceneTitle}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Audio Player */}
        <AudioPlayer />

        {/* Subtitle Display */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleSpanish}>{subtitleData.spanish}</Text>
          <Text style={styles.subtitleEnglish}>{subtitleData.english}</Text>
        </View>

        {/* Vocabulary Section */}
        <VocabCard 
          vocab={vocabulary}
          onWordPress={(word) => console.log('Vocab word pressed:', word)}
        />

        {/* Take Quiz Button */}
        <TouchableOpacity 
          style={styles.quizButton}
          onPress={() => setShowQuiz(true)}
        >
          <Text style={styles.quizButtonText}>Take Quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// client/src/screens/dashboard/DashboardScreen.tsx - Updated
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StreakWidget } from '@/components/progress/StreakWidget';
import { COLORS } from '@/constants';

export const DashboardScreen: React.FC = ({ navigation }: any) => {
  const continueMovies = [
    {
      id: 1,
      title: "Toy Story",
      language: "Spanish",
      difficulty: "Beginner",
      progress: 65,
      thumbnail: "🎬"
    },
    {
      id: 2,
      title: "Finding Nemo",
      language: "French",
      difficulty: "Intermediate",
      progress: 30,
      thumbnail: "🐠"
    }
  ];

  const exploreMovies = [
    {
      id: 3,
      title: "Toy Story",
      language: "Spanish",
      difficulty: "Beginner",
      rating: 4.8,
      duration: "18 min",
      scenes: "8/12 scenes",
      progress: 65,
      thumbnail: "🎬"
    },
    {
      id: 4,
      title: "Finding Nemo",
      language: "French",
      difficulty: "Intermediate",
      rating: 4.9,
      duration: "22 min",
      scenes: "4/15 scenes",
      progress: 30,
      thumbnail: "🐠"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>Language Learner! 👋</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StreakWidget 
            currentStreak={23}
            longestStreak={45}
            wordsLearned={347}
          />
        </View>

        {/* Continue Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          {continueMovies.map((movie) => (
            <TouchableOpacity 
              key={movie.id}
              style={styles.continueCard}
              onPress={() => navigation.navigate('Lesson', {
                movieTitle: movie.title,
                sceneTitle: "Woody introduces himself"
              })}
            >
              <View style={styles.movieThumbnail}>
                <Text style={styles.thumbnailIcon}>{movie.thumbnail}</Text>
              </View>
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                <Text style={styles.movieMeta}>{movie.language} • {movie.difficulty}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${movie.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{movie.progress}%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.continueButton}>
                <Ionicons name="play" size={16} color="white" />
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explore Movies Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Movies</Text>
            <View style={styles.languageFilters}>
              <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
                <Text style={styles.filterTextActive}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterText}>Spanish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterText}>French</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterText}>German</Text>
              </TouchableOpacity>
            </View>
          </View>

          {exploreMovies.map((movie) => (
            <TouchableOpacity 
              key={movie.id}
              style={styles.exploreCard}
              onPress={() => navigation.navigate('Lesson', {
                movieTitle: movie.title,
                sceneTitle: "Woody introduces himself"
              })}
            >
              <View style={styles.movieThumbnail}>
                <Text style={styles.thumbnailIcon}>{movie.thumbnail}</Text>
              </View>
              <View style={styles.exploreMovieInfo}>
                <View style={styles.exploreHeader}>
                  <Text style={styles.movieTitle}>{movie.title}</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={12} color="#ffd700" />
                    <Text style={styles.ratingText}>{movie.rating}</Text>
                  </View>
                </View>
                <View style={styles.languageBadge}>
                  <Text style={styles.languageBadgeText}>{movie.language}</Text>
                  <Text style={styles.difficultyBadgeText}>{movie.difficulty}</Text>
                </View>
                <View style={styles.movieStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.statText}>{movie.duration}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="film-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.statText}>{movie.scenes}</Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${movie.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{movie.progress}%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.continueButton}>
                <Ionicons name="play" size={16} color="white" />
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// client/src/screens/progress/ProgressScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export const ProgressScreen: React.FC = () => {
  const weeklyGoal = { current: 3, target: 5 };
  const achievements = [
    { id: 1, title: "First Movie", description: "Complete your first movie", earned: true },
    { id: 2, title: "Week Warrior", description: "7-day learning streak", earned: true },
    { id: 3, title: "Vocabulary Master", description: "Learn 100 words", earned: false },
  ];

  // Activity calendar data (simplified)
  const activityDays = Array.from({ length: 35 }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.3,
    intensity: Math.floor(Math.random() * 4) + 1
  }));

  const getActivityColor = (intensity: number) => {
    const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
    return colors[intensity];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={COLORS.error} />
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="book" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>347</Text>
            <Text style={styles.statLabel}>Words Learned</Text>
          </View>
        </View>

        {/* Weekly Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Goal</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalText}>{weeklyGoal.current}/{weeklyGoal.target}</Text>
              <Text style={styles.goalSubtext}>2 more lessons to reach your goal</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={[
                styles.goalProgressFill, 
                { width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }
              ]} />
            </View>
          </View>
        </View>

        {/* Learning Activity Calendar */}
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <Ionicons name="calendar" size={20} color={COLORS.text} />
            <Text style={styles.sectionTitle}>Learning Activity</Text>
          </View>
          <View style={styles.calendar}>
            <View style={styles.weekdays}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {activityDays.map((day, index) => (
                <View 
                  key={index}
                  style={[
                    styles.calendarDay,
                    { backgroundColor: day.active ? getActivityColor(day.intensity) : '#ebedf0' }
                  ]}
                />
              ))}
            </View>
            <View style={styles.activityLegend}>
              <Text style={styles.legendText}>Less</Text>
              <View style={styles.legendDots}>
                {[1, 2, 3, 4].map(level => (
                  <View 
                    key={level}
                    style={[styles.legendDot, { backgroundColor: getActivityColor(level) }]}
                  />
                ))}
              </View>
              <Text style={styles.legendText}>More</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.achievementHeader}>
            <Ionicons name="trophy" size={20} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={[
                styles.achievementIcon,
                { backgroundColor: achievement.earned ? COLORS.success : COLORS.border }
              ]}>
                <Ionicons 
                  name={achievement.earned ? "checkmark" : "star-outline"} 
                  size={20} 
                  color={achievement.earned ? "white" : COLORS.textSecondary} 
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[
                  styles.achievementTitle,
                  { opacity: achievement.earned ? 1 : 0.6 }
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  { opacity: achievement.earned ? 1 : 0.6 }
                ]}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.earned && (
                <Text style={styles.earnedBadge}>Earned</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// client/src/screens/community/CommunityScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export const CommunityScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'leaderboard'>('chat');
  const [message, setMessage] = useState('');

  const posts = [
    {
      id: 1,
      user: "Sarah Chen",
      initials: "SC",
      time: "2m ago",
      content: "Just finished Toy Story in Spanish! The vocabulary was perfect for beginners 🎬",
      likes: 12
    },
    {
      id: 2,
      user: "Miguel Rodriguez",
      initials: "MR",
      time: "15m ago",
      content: "Does anyone know where I can watch Finding Nemo with French subtitles?",
      likes: 5
    },
    {
      id: 3,
      user: "Emma Thompson",
      initials: "ET",
      time: "1h ago",
      content: "Tip: Use the 'Export to Anki' feature after each lesson. It's been a game changer for retention! 📚",
      likes: 23
    },
    {
      id: 4,
      user: "Akira Tanaka",
      initials: "AT",
      time: "2h ago",
      content: "45-day streak achieved! This app makes learning so addictive 🔥",
      likes: 18
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with fellow learners</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Ionicons name="chatbubbles-outline" size={20} color={activeTab === 'chat' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Ionicons name="trophy-outline" size={20} color={activeTab === 'leaderboard' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chat' ? (
        <>
          <ScrollView style={styles.chatContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userInitials}>{post.initials}</Text>
                  </View>
                  <View style={styles.postInfo}>
                    <Text style={styles.userName}>{post.user}</Text>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.likeButton}>
                    <Ionicons name="heart-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.likeCount}>{post.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Share your progress or ask for help..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.leaderboardContainer}>
          <Text style={styles.comingSoon}>Leaderboard Coming Soon! 🏆</Text>
        </View>
      )}
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoon: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  languageFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  continueCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  exploreCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  movieThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  thumbnailIcon: {
    fontSize: 24,
  },
  movieInfo: {
    flex: 1,
  },
  exploreMovieInfo: {
    flex: 1,
  },
  exploreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  movieMeta: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  languageBadge: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  languageBadgeText: {
    fontSize: 12,
    color: COLORS.primary,
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyBadgeText: {
    fontSize: 12,
    color: COLORS.success,
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  movieStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    minWidth: 30,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  subtitleContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitleSpanish: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleEnglish: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quizButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Progress Screen Styles
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    marginBottom: 12,
  },
  goalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  goalSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  goalProgress: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  calendar: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 20,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  calendarDay: {
    width: 20,
    height: 20,
    borderRadius: 2,
    marginBottom: 2,
  },
  activityLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  legendDots: {
    flexDirection: 'row',
    gap: 2,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  achievementDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  earnedBadge: {
    backgroundColor: COLORS.success,
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  // Community Screen Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.background,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitials: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  postInfo: {
    flex: 1,
  },
  userName: {