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