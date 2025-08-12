// src/modules/progress/ProgressTest.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { ProgressScreen, useProgressStore, StatsCard, StreakWidget } from './index';

// Mock user ID for testing
const TEST_USER_ID = 'test-user-123';

// Mock stats for demonstration
const mockStats = {
  totalWordsLearned: 156,
  currentStreak: 7,
  longestStreak: 21,
  totalQuizzesTaken: 34,
  averageScore: 78,
  studyTimeMinutes: 420, // 7 hours
  lastActiveDate: new Date(),
  level: 5,
  experiencePoints: 450,
};

const mockWordProgress = [
  {
    wordId: 'word1',
    correctCount: 8,
    incorrectCount: 2,
    strength: 4,
    lastSeen: new Date(),
    streak: 3,
  },
  {
    wordId: 'word2',
    correctCount: 5,
    incorrectCount: 5,
    strength: 2,
    lastSeen: new Date(),
    streak: 1,
  },
  {
    wordId: 'word3',
    correctCount: 12,
    incorrectCount: 1,
    strength: 5,
    lastSeen: new Date(),
    streak: 8,
  },
  {
    wordId: 'word4',
    correctCount: 3,
    incorrectCount: 7,
    strength: 1,
    lastSeen: new Date(),
    streak: 0,
  },
];

export const ProgressTest: React.FC = () => {
  const { updateWordProgress, recordQuizCompletion, userStats } = useProgressStore();

  const simulateWordAnswer = (isCorrect: boolean) => {
    const randomWordId = `word${Math.floor(Math.random() * 4) + 1}`;
    updateWordProgress(TEST_USER_ID, randomWordId, isCorrect);
    console.log(`Simulated ${isCorrect ? 'correct' : 'incorrect'} answer for ${randomWordId}`);
  };

  const simulateQuizCompletion = () => {
    const score = Math.floor(Math.random() * 40) + 60; // Score between 60-100
    const duration = Math.floor(Math.random() * 300) + 120; // Duration between 2-7 minutes
    recordQuizCompletion(TEST_USER_ID, score, duration);
    console.log(`Simulated quiz completion: ${score}% in ${duration} seconds`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Progress Module Test
      </Text>

      <Card style={styles.testCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Demo Components
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Testing with mock data to show Progress Module components
          </Text>

          {/* Demo Stats Card */}
          <StatsCard stats={mockStats} />

          {/* Demo Streak Widget */}
          <StreakWidget stats={mockStats} />
        </Card.Content>
      </Card>

      <Card style={styles.testCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Interactive Testing
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Simulate progress updates (requires Firebase connection)
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={[styles.button, styles.correctButton]}
              onPress={() => simulateWordAnswer(true)}
            >
              Correct Answer
            </Button>

            <Button
              mode="contained"
              style={[styles.button, styles.incorrectButton]}
              onPress={() => simulateWordAnswer(false)}
            >
              Incorrect Answer
            </Button>

            <Button
              mode="contained"
              style={[styles.button, styles.quizButton]}
              onPress={simulateQuizCompletion}
            >
              Complete Quiz
            </Button>
          </View>

          {userStats && (
            <View style={styles.currentStats}>
              <Text variant="titleMedium" style={styles.statsTitle}>
                Current Stats:
              </Text>
              <Text>Level: {userStats.level}</Text>
              <Text>XP: {userStats.experiencePoints}</Text>
              <Text>Streak: {userStats.currentStreak}</Text>
              <Text>Quizzes: {userStats.totalQuizzesTaken}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.testCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Full Progress Screen
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Complete progress screen with live data
          </Text>

          <ProgressScreen userId={TEST_USER_ID} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    textAlign: 'center',
    margin: 20,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  testCard: {
    margin: 16,
    elevation: 4,
  },
  cardTitle: {
    marginBottom: 8,
    color: '#1976D2',
  },
  description: {
    marginBottom: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    marginVertical: 4,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#F44336',
  },
  quizButton: {
    backgroundColor: '#FF9800',
  },
  currentStats: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  statsTitle: {
    marginBottom: 8,
    color: '#1976D2',
  },
});
