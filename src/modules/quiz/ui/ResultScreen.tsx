import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, ProgressBar, Divider, Chip } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { ResultScreenProps } from '../engine/types';
import { quizEngine } from '../engine/QuizEngine';
import { useProgressStore } from '../../progress/store/progressStore';
import { 
  formatTime, 
  getPerformanceColor, 
  getPerformanceEmoji, 
  getMotivationalMessage,
  calculateStreak,
  generateStudyPlan 
} from '../utils/helpers';

export const ResultScreen: React.FC<ResultScreenProps> = ({ 
  session, 
  navigation, 
  onRestart, 
  onExit 
}) => {
  const { recordQuizCompletion, updateWordProgress } = useProgressStore();

  // Mock user ID for testing - in real app would come from auth context
  const TEST_USER_ID = 'test-user-123';

  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.errorText}>
          Khalad - Natiijooyin ma jiraan - Error - No results available
        </ThemedText>
      </ThemedView>
    );
  }

  // Calculate performance metrics
  const performance = quizEngine.getPerformanceAnalysis(session.results, []);
  const streak = calculateStreak(session.results);
  const studyPlan = generateStudyPlan(session.results, session.categoryId);
  const recommendations = quizEngine.getStudyRecommendations(session.results, []);

  // Record progress when component mounts
  useEffect(() => {
    const recordProgress = async () => {
      try {
        // Record quiz completion
        const quizDuration = performance.totalTime;
        await recordQuizCompletion(TEST_USER_ID, performance.accuracy, quizDuration);

        // Record individual word progress
        for (const result of session.results) {
          // Extract word ID from question or use question text as fallback
          const wordId = result.question.word?.id || result.question.somali || 'unknown';
          await updateWordProgress(TEST_USER_ID, wordId, result.isCorrect);
        }

        console.log('Progress recorded successfully');
      } catch (error) {
        console.error('Error recording progress:', error);
      }
    };

    recordProgress();
  }, [session, performance, recordQuizCompletion, updateWordProgress]);

  const renderScoreCard = () => (
    <Card style={styles.scoreCard} mode="elevated">
      <Card.Content style={styles.scoreContent}>
        <View style={styles.scoreHeader}>
          <Text variant="headlineLarge" style={styles.gradeEmoji}>
            {getPerformanceEmoji(performance.grade)}
          </Text>
          <View style={styles.scoreInfo}>
            <Text variant="displaySmall" style={[styles.score, { color: getPerformanceColor(performance.accuracy) }]}>
              {performance.accuracy}%
            </Text>
            <Text variant="titleMedium" style={styles.grade}>
              Darajo: {performance.grade}
            </Text>
          </View>
        </View>
        
        <ProgressBar 
          progress={performance.accuracy / 100} 
          style={styles.progressBar}
          color={getPerformanceColor(performance.accuracy)}
        />
        
        <ThemedText style={styles.motivationalMessage}>
          {getMotivationalMessage(performance)}
        </ThemedText>
      </Card.Content>
    </Card>
  );

  const renderStatsCard = () => (
    <Card style={styles.statsCard} mode="outlined">
      <Card.Content>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          📊 Xisaabta Guud - Overall Statistics
        </ThemedText>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text variant="bodyLarge" style={styles.statNumber}>
              {performance.correctAnswers}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Saxan - Correct
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="bodyLarge" style={styles.statNumber}>
              {performance.totalQuestions - performance.correctAnswers}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Qaldan - Wrong
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="bodyLarge" style={styles.statNumber}>
              {performance.averageTime}s
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Celcelis - Average
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text variant="bodyLarge" style={styles.statNumber}>
              {formatTime(performance.totalTime)}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Guud ahaan - Total
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderStreakCard = () => {
    if (streak.current === 0) return null;
    
    return (
      <Card style={styles.streakCard} mode="outlined">
        <Card.Content>
          <View style={styles.streakHeader}>
            <Text variant="bodyLarge">
              {streak.type === 'correct' ? '🔥' : '❄️'} 
            </Text>
            <ThemedText type="defaultSemiBold" style={styles.streakTitle}>
              {streak.type === 'correct' 
                ? `Xariiq fiican: ${streak.current}` 
                : `Dhibaato: ${streak.current}`
              }
            </ThemedText>
          </View>
          <ThemedText style={styles.streakDescription}>
            {streak.type === 'correct' 
              ? 'Jawaabaha saxda ah ee isku xiga' 
              : 'Jawaabaha qaldamka ah ee isku xiga'
            }
          </ThemedText>
        </Card.Content>
      </Card>
    );
  };

  const renderPerformanceAnalysis = () => (
    <Card style={styles.analysisCard} mode="outlined">
      <Card.Content>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          🎯 Falanqaynta Waxqabadka - Performance Analysis
        </ThemedText>
        
        {performance.strengths.length > 0 && (
          <View style={styles.analysisSection}>
            <ThemedText type="defaultSemiBold" style={styles.analysisLabel}>
              💪 Awoodaha - Strengths:
            </ThemedText>
            <View style={styles.chipContainer}>
              {performance.strengths.map((strength, index) => (
                <Chip key={index} style={styles.strengthChip} textStyle={styles.chipText}>
                  {strength}
                </Chip>
              ))}
            </View>
          </View>
        )}
        
        {performance.weaknesses.length > 0 && (
          <View style={styles.analysisSection}>
            <ThemedText type="defaultSemiBold" style={styles.analysisLabel}>
              📚 Hagaajinta u baahan - Areas to improve:
            </ThemedText>
            <View style={styles.chipContainer}>
              {performance.weaknesses.map((weakness, index) => (
                <Chip key={index} style={styles.weaknessChip} textStyle={styles.chipText}>
                  {weakness}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderRecommendations = () => (
    <Card style={styles.recommendationsCard} mode="outlined">
      <Card.Content>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          💡 Talooyinka Waxbarashada - Study Recommendations
        </ThemedText>
        
        {recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationBullet}>•</Text>
            <ThemedText style={styles.recommendationText}>
              {recommendation}
            </ThemedText>
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  const renderStudyPlan = () => (
    <Card style={styles.studyPlanCard} mode="outlined">
      <Card.Content>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          📅 Qorshaha Waxbarashada - Study Plan
        </ThemedText>
        
        {studyPlan.map((planItem, index) => (
          <View key={index} style={styles.planItem}>
            <ThemedText style={styles.planText}>
              {planItem}
            </ThemedText>
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        mode="outlined"
        onPress={onRestart}
        style={styles.restartButton}
        icon="refresh"
      >
        Dib u bilow - Restart
      </Button>
      
      <Button
        mode="contained"
        onPress={onExit}
        style={styles.exitButton}
        icon="home"
        buttonColor="#2E7D32"
      >
        Guriga - Home
      </Button>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            🎉 Natiijooyinka Imtixaanka
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Quiz Results
          </ThemedText>
        </View>

        {renderScoreCard()}
        {renderStatsCard()}
        {renderStreakCard()}
        {renderPerformanceAnalysis()}
        {renderRecommendations()}
        {renderStudyPlan()}
        {renderActionButtons()}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  scoreCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  scoreContent: {
    alignItems: 'center',
    padding: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 20,
  },
  gradeEmoji: {
    fontSize: 48,
  },
  scoreInfo: {
    alignItems: 'center',
  },
  score: {
    fontWeight: 'bold',
    fontSize: 36,
  },
  grade: {
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  motivationalMessage: {
    textAlign: 'center',
    color: '#333',
    lineHeight: 20,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#2E7D32',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#1976D2',
    fontSize: 20,
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  streakCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  streakTitle: {
    color: '#1976D2',
  },
  streakDescription: {
    color: '#666',
    fontSize: 14,
  },
  analysisCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  analysisSection: {
    marginBottom: 16,
  },
  analysisLabel: {
    marginBottom: 8,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  strengthChip: {
    backgroundColor: '#E8F5E8',
  },
  weaknessChip: {
    backgroundColor: '#FFEBEE',
  },
  chipText: {
    fontSize: 12,
  },
  recommendationsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  recommendationBullet: {
    color: '#2E7D32',
    marginRight: 8,
    fontSize: 16,
  },
  recommendationText: {
    flex: 1,
    color: '#333',
    lineHeight: 20,
  },
  studyPlanCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  planItem: {
    marginBottom: 8,
  },
  planText: {
    color: '#333',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 16,
  },
  restartButton: {
    flex: 1,
    borderColor: '#1976D2',
  },
  exitButton: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    color: '#F44336',
  },
});

export default ResultScreen;
