import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { QuestionCard } from './QuestionCard';
import { useQuizStore, useQuizProgress, useQuizTimer } from '../store/quizStore';
import { useVocabularyActions } from '../../vocabulary/store/vocabularyStore';
import { Word } from '../../vocabulary/data/types';
import { QuizScreenProps, QuizConfig } from '../engine/types';

export const QuizScreen: React.FC<QuizScreenProps> = ({ categoryId, navigation, route }) => {
  const {
    currentQuestion,
    selectedAnswer,
    showResult,
    quizState,
    loading,
    error,
    startQuiz,
    answerQuestion,
    setSelectedAnswer,
    skipQuestion,
    pauseQuiz,
    resumeQuiz,
    resetQuiz
  } = useQuizStore();

  const { current, total } = useQuizProgress();
  const { timeLeft } = useQuizTimer();
  const { words, selectedCategory } = useVocabularyActions();

  // Get category and config from route params
  const category = route?.params?.category || selectedCategory;
  const quizConfig: Partial<QuizConfig> = route?.params?.config || {};

  useEffect(() => {
    // Start quiz when component mounts
    if (words.length > 0) {
      startQuiz(categoryId, words, quizConfig);
    } else {
      // Fetch words if not already loaded
      // This would typically come from the category selection
    }
  }, [words, categoryId, startQuiz]);

  useEffect(() => {
    // Handle Android back button
    const backAction = () => {
      if (quizState === 'active') {
        Alert.alert(
          'Jooji Imtixaanka - Quit Quiz',
          'Ma hubtaa inaad doonayso in aad joojiso imtixaanka? - Are you sure you want to quit the quiz?',
          [
            {
              text: 'Maya - No',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Haa - Yes',
              onPress: () => {
                resetQuiz();
                navigation.goBack();
              },
            },
          ],
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [quizState, navigation, resetQuiz]);

  const handleAnswer = (answer: string) => {
    answerQuestion(answer);
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      answerQuestion(selectedAnswer);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Ka bood Su\'aasha - Skip Question',
      'Ma doonayaa in aad ka booddto su\'aasha? - Do you want to skip this question?',
      [
        { text: 'Maya - No', style: 'cancel' },
        { text: 'Haa - Yes', onPress: skipQuestion },
      ],
    );
  };

  const handlePause = () => {
    pauseQuiz();
  };

  const handleResume = () => {
    resumeQuiz();
  };

  const handleQuit = () => {
    Alert.alert(
      'Jooji Imtixaanka - Quit Quiz',
      'Ma hubtaa inaad doonayso in aad joojiso imtixaanka? - Are you sure you want to quit the quiz?',
      [
        { text: 'Maya - No', style: 'cancel' },
        { 
          text: 'Haa - Yes', 
          onPress: () => {
            resetQuiz();
            navigation.goBack();
          } 
        },
      ],
    );
  };

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <ThemedText style={styles.loadingText}>
          Diyaarinta Imtixaanka... - Preparing Quiz...
        </ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>
          ❌ Khalad ayaa dhacay - Error Occurred
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error}
        </ThemedText>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Dib u noqo - Go Back
        </Button>
      </ThemedView>
    );
  }

  // Paused state
  if (quizState === 'paused') {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.pausedTitle}>
          ⏸️ Imtixaanka waa joojay - Quiz Paused
        </ThemedText>
        <ThemedText style={styles.pausedMessage}>
          Su'aal {current} / {total}
        </ThemedText>
        <View style={styles.pausedButtons}>
          <Button
            mode="contained"
            onPress={handleResume}
            style={styles.resumeButton}
          >
            Sii wad - Resume
          </Button>
          <Button
            mode="outlined"
            onPress={handleQuit}
            style={styles.quitButton}
          >
            Jooji - Quit
          </Button>
        </View>
      </ThemedView>
    );
  }

  // Completed state - navigate to results
  if (quizState === 'completed') {
    // This should be handled by navigation to ResultScreen
    // For now, show a simple completion message
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.completedTitle}>
          🎉 Imtixaanka waa dhamaaddy - Quiz Completed!
        </ThemedText>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Natiijooyinka arag - View Results
        </Button>
      </ThemedView>
    );
  }

  // No current question
  if (!currentQuestion) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="title" style={styles.errorTitle}>
          Khalad - Error
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          Su'aalo ma jiraan - No questions available
        </ThemedText>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Dib u noqo - Go Back
        </Button>
      </ThemedView>
    );
  }

  // Active quiz state
  return (
    <ThemedView style={styles.container}>
      {/* Header with category name and pause button */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <ThemedText type="defaultSemiBold" style={styles.categoryName}>
            {category?.nameSo || 'Imtixaan'} - {category?.nameEn || 'Quiz'}
          </ThemedText>
          <ThemedText style={styles.progress}>
            Su'aal {current} / {total}
          </ThemedText>
        </View>
        <Button
          mode="outlined"
          onPress={handlePause}
          style={styles.pauseButton}
          compact
        >
          ⏸️
        </Button>
      </View>

      {/* Question Card */}
      <View style={styles.questionContainer}>
        <QuestionCard
          question={currentQuestion}
          questionNumber={current}
          totalQuestions={total}
          timeLeft={timeLeft}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswer={handleAnswer}
          onSelectAnswer={handleSelectAnswer}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
        />
      </View>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <Button
          mode="outlined"
          onPress={handleQuit}
          style={styles.quitBottomButton}
          textColor="#F44336"
        >
          Jooji - Quit
        </Button>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerInfo: {
    flex: 1,
  },
  categoryName: {
    color: '#2E7D32',
    fontSize: 16,
  },
  progress: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  pauseButton: {
    borderColor: '#666',
  },
  questionContainer: {
    flex: 1,
  },
  bottomActions: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    alignItems: 'center',
  },
  quitBottomButton: {
    borderColor: '#F44336',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorTitle: {
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#2E7D32',
  },
  pausedTitle: {
    color: '#1976D2',
    marginBottom: 16,
    textAlign: 'center',
  },
  pausedMessage: {
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  pausedButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  resumeButton: {
    backgroundColor: '#2E7D32',
  },
  quitButton: {
    borderColor: '#F44336',
  },
  completedTitle: {
    color: '#2E7D32',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default QuizScreen;
