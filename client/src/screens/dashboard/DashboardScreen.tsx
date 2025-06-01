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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>Language Learner! 👋</Text>
        </View>

        <View style={styles.statsSection}>
          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.statCard}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity style={styles.movieCard} onPress={() => navigation?.navigate('Lesson')}>
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
            <TouchableOpacity style={styles.playButton} onPress={() => navigation?.navigate('Lesson')}>
              <Ionicons name="play" size={16} color="white" />
              <Text style={styles.playButtonText}>Continue</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.quickStartCard} onPress={() => navigation?.navigate('Lesson')}>
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
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingVertical: 20 },
  greeting: { fontSize: 16, color: COLORS.textSecondary },
  userName: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  statsSection: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 30 },
  statCard: { flex: 1, padding: 20, borderRadius: 12, alignItems: 'center' },
  statCardWhite: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: 'white', marginVertical: 8 },
  statNumberDark: { color: COLORS.text },
  statLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  statLabelDark: { color: COLORS.textSecondary },
  section: { paddingHorizontal: 20, marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
  movieCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6, marginBottom: 20 },
  movieIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  movieInfo: { flex: 1 },
  movieTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  movieSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressText: { fontSize: 12, color: COLORS.textSecondary },
  playButton: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 4 },
  playButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  quickStartCard: { backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  quickStartTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 12, marginBottom: 4 },
  quickStartText: { fontSize: 14, color: COLORS.textSecondary },
});
