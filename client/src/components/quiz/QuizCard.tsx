import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
          let buttonStyle = styles.optionButton;
          let textStyle = styles.optionText;

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
