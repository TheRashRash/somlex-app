// src/modules/progress/ui/StatsCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { UserStats } from '../data/types';

interface StatsCardProps {
  stats: UserStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const getXPForNextLevel = (level: number) => level * 100;
  const currentLevelXP = (stats.level - 1) * 100;
  const nextLevelXP = getXPForNextLevel(stats.level);
  const progressToNextLevel = (stats.experiencePoints - currentLevelXP) / (nextLevelXP - currentLevelXP);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="headlineSmall" style={styles.title}>
          Your Progress
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="displaySmall" style={styles.statNumber}>
              {stats.level}
            </Text>
            <Text variant="bodyMedium">Level</Text>
          </View>

          <View style={styles.statItem}>
            <Text variant="displaySmall" style={styles.statNumber}>
              {stats.currentStreak}
            </Text>
            <Text variant="bodyMedium">Day Streak</Text>
          </View>

          <View style={styles.statItem}>
            <Text variant="displaySmall" style={styles.statNumber}>
              {stats.totalWordsLearned}
            </Text>
            <Text variant="bodyMedium">Words Learned</Text>
          </View>
        </View>

        <View style={styles.xpContainer}>
          <Text variant="bodyMedium" style={styles.xpText}>
            {stats.experiencePoints - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
          </Text>
          <ProgressBar 
            progress={progressToNextLevel} 
            style={styles.xpBar}
          />
        </View>

        <View style={styles.additionalStats}>
          <View style={styles.additionalStatRow}>
            <Text variant="bodyMedium">Quizzes Taken:</Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {stats.totalQuizzesTaken}
            </Text>
          </View>
          
          <View style={styles.additionalStatRow}>
            <Text variant="bodyMedium">Average Score:</Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {stats.averageScore}%
            </Text>
          </View>
          
          <View style={styles.additionalStatRow}>
            <Text variant="bodyMedium">Study Time:</Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {Math.round(stats.studyTimeMinutes / 60)}h {stats.studyTimeMinutes % 60}m
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#1976D2',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  xpContainer: {
    marginBottom: 24,
  },
  xpText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  xpBar: {
    height: 12,
    borderRadius: 6,
  },
  additionalStats: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  additionalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: 'bold',
  },
});
