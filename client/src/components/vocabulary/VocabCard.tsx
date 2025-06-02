import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants';

interface VocabItem {
  word: string;
  translation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

interface VocabCardProps {
  vocab: VocabItem[];
  onWordPress?: (word: string) => void;
}

export const VocabCard: React.FC<VocabCardProps> = ({ vocab, onWordPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return COLORS.success;
      case 'intermediate': return COLORS.warning;
      case 'advanced': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Key Vocabulary</Text>
      
      {vocab.map((item, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.vocabItem}
          onPress={() => onWordPress?.(item.word)}
        >
          <View style={styles.vocabContent}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.translation}>{item.translation}</Text>
          </View>
          
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(item.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  vocabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  vocabContent: {
    flex: 1,
  },
  word: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  translation: {
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
    textTransform: 'uppercase',
  },
});
