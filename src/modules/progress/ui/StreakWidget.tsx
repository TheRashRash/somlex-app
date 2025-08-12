// src/modules/progress/ui/StreakWidget.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { UserStats } from '../data/types';

interface StreakWidgetProps {
  stats: UserStats;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ stats }) => {
  const getDaysOfWeek = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();
    return days.map((day, index) => ({
      label: day,
      isToday: index === today,
      isActive: index <= today, // Simple mock for demo - in real app would check actual activity
    }));
  };

  const getStreakMessage = () => {
    if (stats.currentStreak === 0) {
      return "Start your learning streak today!";
    } else if (stats.currentStreak === 1) {
      return "Great start! Keep it going!";
    } else if (stats.currentStreak < 7) {
      return `${stats.currentStreak} days strong! 🔥`;
    } else {
      return `Amazing ${stats.currentStreak} day streak! 🚀`;
    }
  };

  const days = getDaysOfWeek();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <IconButton 
            icon="fire" 
            iconColor="#FF5722"
            size={32}
          />
          <View style={styles.streakInfo}>
            <Text variant="headlineSmall" style={styles.streakNumber}>
              {stats.currentStreak}
            </Text>
            <Text variant="bodyMedium" style={styles.streakLabel}>
              Day Streak
            </Text>
          </View>
        </View>

        <Text variant="bodyMedium" style={styles.message}>
          {getStreakMessage()}
        </Text>

        <View style={styles.weekContainer}>
          <Text variant="bodySmall" style={styles.weekTitle}>This Week</Text>
          <View style={styles.daysContainer}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <View style={[
                  styles.dayCircle,
                  day.isActive && styles.dayActive,
                  day.isToday && styles.dayToday,
                ]}>
                  <Text style={[
                    styles.dayText,
                    day.isActive && styles.dayTextActive,
                  ]}>
                    {day.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.personalBest}>
          <Text variant="bodySmall" style={styles.personalBestLabel}>
            Personal Best: {stats.longestStreak} days
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakInfo: {
    marginLeft: 8,
  },
  streakNumber: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  streakLabel: {
    color: '#666',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    color: '#4CAF50',
  },
  weekContainer: {
    marginBottom: 16,
  },
  weekTitle: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  dayActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  dayToday: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  dayTextActive: {
    color: 'white',
  },
  personalBest: {
    alignItems: 'center',
  },
  personalBestLabel: {
    color: '#666',
    fontStyle: 'italic',
  },
});
