import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { WordCard } from '../modules/vocabulary/ui/WordCard';
import { Word } from '../modules/vocabulary/data/types';

// Mock word data for testing
const mockWords: Word[] = [
  {
    id: '1',
    categoryId: 'greetings',
    wordSo: 'Salaan',
    wordEn: 'Hello',
    partOfSpeech: 'noun',
    phonetic: 'sa-la-an',
    examples: [
      { so: 'Salaan wanaagsan', en: 'Good greeting' },
    ],
    difficulty: 'beginner',
  },
  {
    id: '2',
    categoryId: 'greetings',
    wordSo: 'Nabadgelyo',
    wordEn: 'Goodbye',
    partOfSpeech: 'noun',
    phonetic: 'na-bad-gel-yo',
    examples: [
      { so: 'Nabadgelyo walaalo', en: 'Goodbye brothers' },
    ],
    difficulty: 'beginner',
  },
  {
    id: '3',
    categoryId: 'family',
    wordSo: 'Hooyo',
    wordEn: 'Mother',
    partOfSpeech: 'noun',
    phonetic: 'hoo-yo',
    examples: [
      { so: 'Hooyada ayaa la jeclahay', en: 'Mother is loved' },
    ],
    difficulty: 'beginner',
  },
];

interface VocabularyTestProps {
  onBack?: () => void;
}

export default function VocabularyTest({ onBack }: VocabularyTestProps) {
  const handleWordPress = (word: Word) => {
    console.log('Word pressed:', word.wordSo);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={onBack}
            style={styles.backButton}
          />
        )}
        <Text variant="headlineMedium" style={styles.title}>
          🧪 Vocabulary Component Test
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Testing WordCard with TTS functionality
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Full WordCard View
        </Text>
        {mockWords.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onPress={handleWordPress}
            compact={false}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Compact WordCard View
        </Text>
        {mockWords.map((word) => (
          <WordCard
            key={`compact-${word.id}`}
            word={word}
            onPress={handleWordPress}
            compact={true}
            showCategory={true}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  title: {
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    color: '#2E7D32',
    marginBottom: 16,
    fontWeight: 'bold',
  },
});
