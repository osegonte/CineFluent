import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

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
  }
];

const quizQuestions = [
  { id: 1, question: "What does 'sheriff' mean in English?", options: ["Teacher", "Sheriff", "Doctor", "Friend"], correct: "Sheriff" }
];

interface LessonScreenProps {
  navigation?: any;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<'scene' | 'vocabulary' | 'quiz'>('scene');
  const [showTranslation, setShowTranslation] = useState(false);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState(0);

  const currentLesson = lessonData[0];

  const handleRevealTranslation = () => {
    setShowTranslation(true);
    setWordsLearned(currentLesson.vocabulary.length);
  };

  const handleNextStep = () => {
    if (currentStep === 'scene') setCurrentStep('vocabulary');
    else if (currentStep === 'vocabulary') setCurrentStep('quiz');
    else handleLessonComplete();
  };

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
    const correct = quizQuestions.find(q => q.id === questionId)?.correct === answer;
    if (correct) setScore(prev => prev + 1);
  };

  const handleLessonComplete = () => {
    const finalScore = (score / quizQuestions.length) * 100;
    Alert.alert(
      "¡Correcto! Well done! 🎉",
      `You scored ${Math.round(finalScore)}% and learned ${wordsLearned} words!`,
      [{ text: "Continue Learning", onPress: () => navigation?.goBack() }]
    );
  };

  const renderSceneView = () => (
    <ScrollView style={styles.content}>
      <View style={styles.sceneCard}>
        <View style={styles.movieHeader}>
          <Text style={styles.movieTitle}>Toy Story - Scene 1</Text>
          <Text style={styles.timeStamp}>{currentLesson.timeStamp}</Text>
        </View>

        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.audioViz}>
          <Ionicons name="play" size={32} color="white" />
          <Text style={styles.audioText}>Audio visualization</Text>
          <View style={styles.audioControls}>
            <Ionicons name="play-skip-back" size={20} color="white" />
            <Ionicons name="play" size={24} color="white" />
            <Ionicons name="play-skip-forward" size={20} color="white" />
            <Ionicons name="volume-high" size={20} color="white" />
          </View>
        </LinearGradient>

        <View style={styles.subtitleContainer}>
          <Text style={styles.englishText}>{currentLesson.english}</Text>
          {showTranslation && <Text style={styles.spanishText}>{currentLesson.spanish}</Text>}
        </View>

        {!showTranslation ? (
          <TouchableOpacity style={styles.revealButton} onPress={handleRevealTranslation}>
            <Text style={styles.revealButtonText}>Tap to reveal Spanish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        )}
      </View>
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
          <View style={[styles.difficultyBadge, { backgroundColor: word.difficulty === 'basic' ? COLORS.success : COLORS.warning }]}>
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
              style={[styles.optionButton, quizAnswers[question.id] === option && styles.selectedOption]}
              onPress={() => handleQuizAnswer(question.id, option)}
            >
              <Text style={[styles.optionText, quizAnswers[question.id] === option && styles.selectedOptionText]}>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentStep === 'scene' ? 'Learn' : currentStep === 'vocabulary' ? 'Vocabulary' : 'Quiz'}
        </Text>
        <Text style={styles.progress}>1/1</Text>
      </View>

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

      {currentStep === 'scene' && renderSceneView()}
      {currentStep === 'vocabulary' && renderVocabularyView()}
      {currentStep === 'quiz' && renderQuizView()}

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
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  progress: { fontSize: 14, color: COLORS.textSecondary },
  stepIndicator: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  step: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.border },
  activeStep: { backgroundColor: COLORS.primary },
  stepText: { fontSize: 12, color: COLORS.text },
  content: { flex: 1, paddingHorizontal: 20 },
  sceneCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginVertical: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  movieHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  movieTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  timeStamp: { fontSize: 12, color: COLORS.textSecondary },
  audioViz: { height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  audioText: { color: 'white', fontSize: 14, marginTop: 8 },
  audioControls: { flexDirection: 'row', gap: 16, marginTop: 12 },
  subtitleContainer: { padding: 16, backgroundColor: COLORS.background, borderRadius: 8 },
  englishText: { fontSize: 18, lineHeight: 26, color: COLORS.text, marginBottom: 12 },
  spanishText: { fontSize: 16, lineHeight: 24, color: COLORS.primary, fontStyle: 'italic' },
  revealButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  revealButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginVertical: 20 },
  vocabCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  vocabContent: { flex: 1 },
  vocabEnglish: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  vocabSpanish: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  difficultyText: { fontSize: 10, color: 'white', fontWeight: '600' },
  quizCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  questionText: { fontSize: 18, color: COLORS.text, marginBottom: 20, textAlign: 'center' },
  optionButton: { backgroundColor: COLORS.background, borderRadius: 8, padding: 16, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  selectedOption: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionText: { fontSize: 16, color: COLORS.text, textAlign: 'center' },
  selectedOptionText: { color: 'white', fontWeight: '600' },
  nextButton: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginVertical: 20 },
  nextButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  statsFooter: { flexDirection: 'row', backgroundColor: 'white', paddingVertical: 16, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: COLORS.border },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
});
