// src/modules/progress/ui/ProgressScreen.tsx
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useProgressStore } from '../store/progressStore';
import { StatsCard } from './StatsCard';
import { StreakWidget } from './StreakWidget';

interface ProgressScreenProps {
  userId: string;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ userId }) => {
  const { 
    userStats, 
    userProgress, 
    loading, 
    error, 
    fetchUserStats, 
    fetchUserProgress 
  } = useProgressStore();

  useEffect(() => {
    if (userId) {
      fetchUserStats(userId);
      fetchUserProgress(userId);
    }
  }, [userId, fetchUserStats, fetchUserProgress]);

  const getProgressSummary = () => {
    if (!userProgress.length) return null;

    const totalWords = userProgress.length;
    const learnedWords = userProgress.filter(word => word.strength >= 3).length;
    const masteredWords = userProgress.filter(word => word.strength >= 5).length;
    
    return {
      totalWords,
      learnedWords,
      masteredWords,
      learningRate: totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0,
      masteryRate: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0,
    };
  };

  const progressSummary = getProgressSummary();

  if (loading && !userStats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading your progress...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineLarge" style={styles.screenTitle}>
        Your Progress
      </Text>

      {userStats && (
        <>
          <StatsCard stats={userStats} />
          <StreakWidget stats={userStats} />
        </>
      )}

      {progressSummary && (
        <View style={styles.summaryCard}>
          <Text variant="headlineSmall" style={styles.summaryTitle}>
            Vocabulary Progress
          </Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="displaySmall" style={styles.summaryNumber}>
                {progressSummary.totalWords}
              </Text>
              <Text variant="bodyMedium">Total Words</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="displaySmall" style={styles.summaryNumber}>
                {progressSummary.learnedWords}
              </Text>
              <Text variant="bodyMedium">Learning</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text variant="displaySmall" style={styles.summaryNumber}>
                {progressSummary.masteredWords}
              </Text>
              <Text variant="bodyMedium">Mastered</Text>
            </View>
          </View>

          <View style={styles.rateContainer}>
            <View style={styles.rateItem}>
              <Text variant="bodyMedium">Learning Rate:</Text>
              <Text variant="bodyMedium" style={styles.rateValue}>
                {progressSummary.learningRate}%
              </Text>
            </View>
            
            <View style={styles.rateItem}>
              <Text variant="bodyMedium">Mastery Rate:</Text>
              <Text variant="bodyMedium" style={styles.rateValue}>
                {progressSummary.masteryRate}%
              </Text>
            </View>
          </View>
        </View>
      )}

      <Snackbar
        visible={!!error}
        onDismiss={() => {}}
        duration={4000}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  screenTitle: {
    textAlign: 'center',
    margin: 16,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#1976D2',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  rateContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rateValue: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
});
