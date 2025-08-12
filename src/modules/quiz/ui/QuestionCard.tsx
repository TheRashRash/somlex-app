import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, ProgressBar, IconButton } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { QuizQuestion } from '../engine/types';
import { useTTS } from '../../vocabulary/utils/ttsUtils';
import { formatTimeDisplay, getRandomEncouragement, getRandomConsolation } from '../utils/helpers';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  selectedAnswer: string | null;
  showResult: boolean;
  onAnswer: (answer: string) => void;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  selectedAnswer,
  showResult,
  onAnswer,
  onSelectAnswer,
  onSubmit,
  onSkip
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { speakWord, stop } = useTTS();

  const progress = questionNumber / totalQuestions;
  const isTimeRunningOut = timeLeft <= 10;
  const hasSelectedAnswer = selectedAnswer !== null;

  const handleAnswerSelect = (answer: string) => {
    if (!showResult) {
      onSelectAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && !showResult) {
      onAnswer(selectedAnswer);
    }
  };

  const handleAudioPlay = async () => {
    if (question.type !== 'audio') return;
    
    if (isPlaying) {
      await stop();
      setIsPlaying(false);
      return;
    }
    
    try {
      setIsPlaying(true);
      // Extract the word from the question - this would need the actual word data
      // For now, we'll use the correct answer
      await speakWord(question.correctAnswer, {
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false)
      });
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  };

  const getButtonMode = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? "contained" : "outlined";
    }
    
    // Show result colors
    if (option === question.correctAnswer) {
      return "contained"; // Green for correct
    } else if (option === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return "contained"; // Red for incorrect selection
    } else {
      return "outlined"; // Neutral for others
    }
  };

  const getButtonColor = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? "#2E7D32" : undefined;
    }
    
    if (option === question.correctAnswer) {
      return "#4CAF50"; // Green
    } else if (option === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return "#F44336"; // Red
    }
    return undefined;
  };

  const renderResultMessage = () => {
    if (!showResult) return null;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    return (
      <View style={[styles.resultMessage, isCorrect ? styles.correctMessage : styles.incorrectMessage]}>
        <Text variant="bodyLarge" style={styles.resultText}>
          {isCorrect ? getRandomEncouragement() : getRandomConsolation()}
        </Text>
        {!isCorrect && (
          <Text variant="bodyMedium" style={styles.correctAnswerText}>
            Correct answer: {question.correctAnswer}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          {/* Header with progress and timer */}
          <View style={styles.header}>
            <Text variant="bodyMedium" style={styles.questionCounter}>
              Su'aal {questionNumber} / {totalQuestions}
            </Text>
            <Text 
              variant="bodyMedium" 
              style={[
                styles.timer,
                isTimeRunningOut && styles.timerUrgent
              ]}
            >
              ⏱️ {formatTimeDisplay(timeLeft)}
            </Text>
          </View>
          
          <ProgressBar 
            progress={progress} 
            style={styles.progressBar}
            color="#2E7D32"
          />

          {/* Question text and audio button */}
          <View style={styles.questionContainer}>
            <ThemedText type="subtitle" style={styles.questionText}>
              {question.question}
            </ThemedText>
            
            {question.type === 'audio' && (
              <IconButton
                icon={isPlaying ? "volume-high" : "volume-medium"}
                size={32}
                onPress={handleAudioPlay}
                iconColor={isPlaying ? "#2E7D32" : "#1976D2"}
                style={styles.audioButton}
              />
            )}
          </View>

          {/* Answer options */}
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <Button
                key={index}
                mode={getButtonMode(option)}
                onPress={() => handleAnswerSelect(option)}
                style={[
                  styles.optionButton,
                  { backgroundColor: getButtonColor(option) }
                ]}
                contentStyle={styles.optionContent}
                disabled={showResult}
                labelStyle={styles.optionLabel}
              >
                {option}
              </Button>
            ))}
          </View>

          {/* Result message */}
          {renderResultMessage()}

          {/* Action buttons */}
          {!showResult && (
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={onSkip}
                style={styles.skipButton}
                textColor="#666"
              >
                Ka bood - Skip
              </Button>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={!hasSelectedAnswer}
                style={[
                  styles.submitButton,
                  !hasSelectedAnswer && styles.submitButtonDisabled
                ]}
                buttonColor="#2E7D32"
              >
                Gudbi - Submit
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionCounter: {
    color: '#666',
    fontWeight: '500',
  },
  timer: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  timerUrgent: {
    color: '#F44336',
    // animation: 'pulse 1s infinite', // Removed for React Native compatibility
  },
  progressBar: {
    marginBottom: 24,
    height: 8,
    borderRadius: 4,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  questionText: {
    textAlign: 'center',
    color: '#1976D2',
    marginBottom: 16,
    lineHeight: 28,
  },
  audioButton: {
    backgroundColor: '#E3F2FD',
    marginTop: 8,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  optionContent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultMessage: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  correctMessage: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  incorrectMessage: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    borderWidth: 2,
  },
  resultText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  correctAnswerText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    borderColor: '#666',
  },
  submitButton: {
    flex: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});

export default QuestionCard;
