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