import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

interface LessonScreenProps {
  navigation?: any;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation }) => {
  const [showTranslation, setShowTranslation] = useState(false);

  const handleComplete = () => {
    Alert.alert(
      "Great job! 🎉",
      "You've completed this lesson!",
      [{ text: "Continue", onPress: () => navigation?.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Toy Story - Scene 1</Text>
        <Text style={styles.progress}>1/4</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.subtitleCard}>
          <Text style={styles.timeStamp}>00:01:23</Text>
          <Text style={styles.englishText}>
            "Hello! I'm Woody, the sheriff of this place."
          </Text>
          
          {showTranslation ? (
            <Text style={styles.germanText}>
              "¡Hola! Soy Woody, el sheriff de este lugar."
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.revealButton}
              onPress={() => setShowTranslation(true)}
            >
              <Text style={styles.revealButtonText}>Tap to reveal Spanish</Text>
            </TouchableOpacity>
          )}
        </View>

        {showTranslation && (
          <View style={styles.vocabSection}>
            <Text style={styles.sectionTitle}>Key Vocabulary</Text>
            <View style={styles.vocabItem}>
              <Text style={styles.vocabEnglish}>Sheriff</Text>
              <Text style={styles.vocabSpanish}>Sheriff</Text>
            </View>
            <View style={styles.vocabItem}>
              <Text style={styles.vocabEnglish}>Place</Text>
              <Text style={styles.vocabSpanish}>Lugar</Text>
            </View>
          </View>
        )}

        {showTranslation && (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Lesson</Text>
          </TouchableOpacity>
        )}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  timeStamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  englishText: {
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.text,
    marginBottom: 16,
  },
  germanText: {
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
  },
  revealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  vocabSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  vocabItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vocabEnglish: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  vocabSpanish: {
    fontSize: 16,
    color: COLORS.primary,
  },
  completeButton: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
