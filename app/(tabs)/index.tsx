import VocabularyTest from '@/test/VocabularyTest';
import QuizTest from '@/test/QuizTest';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  const [testMode, setTestMode] = useState<'menu' | 'vocabulary' | 'quiz'>('menu');

  if (testMode === 'vocabulary') {
    return <VocabularyTest />;
  }

  if (testMode === 'quiz') {
    return <QuizTest />;
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        🧪 Somlex Module Tests
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Choose a module to test
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => setTestMode('vocabulary')}
          style={styles.testButton}
          icon="book-open"
        >
          📚 Vocabulary Module
        </Button>
        
        <Button 
          mode="contained" 
          onPress={() => setTestMode('quiz')}
          style={styles.testButton}
          icon="help-circle"
          buttonColor="#1976D2"
        >
          🧠 Quiz Engine Module
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  testButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
});
