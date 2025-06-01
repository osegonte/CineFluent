import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export const DashboardScreen: React.FC = () => {
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
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </LinearGradient>

          <View style={[styles.statCard, styles.statCardWhite]}>
            <Ionicons name="book" size={24} color={COLORS.primary} />
            <Text style={[styles.statNumber, styles.statNumberDark]}>0</Text>
            <Text style={[styles.statLabel, styles.statLabelDark]}>Words Learned</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Learning</Text>
          <TouchableOpacity style={styles.startCard}>
            <Ionicons name="film-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.startTitle}>Choose Your First Movie</Text>
            <Text style={styles.startText}>
              Begin learning languages through movie subtitles
            </Text>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Get Started</Text>
            </View>
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
  startCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  startText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
