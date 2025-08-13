import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Text, Card, IconButton, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { QuestionCard } from './QuestionCard';
import { ResultScreen } from './ResultScreen';
import { useQuizStore } from '../store/quizStore';
import { Word } from '../../vocabulary/data/types';

// African color palette
const AfricanColors = {
  primary: { main: '#D4AF37', light: '#F4D03F' },
  secondary: { main: '#8B4513' },
  background: { primary: '#FFFEF7', card: '#FFFFFF', surface: '#FAF0E6' },
  text: { primary: '#2F2F2F', secondary: '#654321', inverse: '#FFFEF7' },
  accent: { coral: '#FF7F50', terracotta: '#D2691E' },
};

// Sample Somali vocabulary for quiz
const sampleWords: Word[] = [
  {
    id: '1',
    categoryId: 'greetings',
    wordSo: 'Salaan',
    wordEn: 'Hello',
    partOfSpeech: 'noun',
    phonetic: 'sa-la-an',
    examples: [{ so: 'Salaan wanaagsan', en: 'Good greeting' }],
    difficulty: 'beginner',
  },
  {
    id: '2',
    categoryId: 'greetings',
    wordSo: 'Nabadgelyo',
    wordEn: 'Goodbye',
    partOfSpeech: 'noun',
    phonetic: 'na-bad-gel-yo',
    examples: [{ so: 'Nabadgelyo walaalo', en: 'Goodbye brothers' }],
    difficulty: 'beginner',
  },
  {
    id: '3',
    categoryId: 'family',
    wordSo: 'Hooyo',
    wordEn: 'Mother',
    partOfSpeech: 'noun',
    phonetic: 'hoo-yo',
    examples: [{ so: 'Hooyada ayaa la jeclahay', en: 'Mother is loved' }],
    difficulty: 'beginner',
  },
  {
    id: '4',
    categoryId: 'family',
    wordSo: 'Aabo',
    wordEn: 'Father',
    partOfSpeech: 'noun',
    phonetic: 'aa-bo',
    examples: [{ so: 'Aabaha waa nin wanaagsan', en: 'Father is a good man' }],
    difficulty: 'beginner',
  },
  {
    id: '5',
    categoryId: 'numbers',
    wordSo: 'Hal',
    wordEn: 'One',
    partOfSpeech: 'noun',
    phonetic: 'hal',
    examples: [{ so: 'Hal qof ayaa yimid', en: 'One person came' }],
    difficulty: 'beginner',
  },
  {
    id: '6',
    categoryId: 'numbers',
    wordSo: 'Laba',
    wordEn: 'Two',
    partOfSpeech: 'noun',
    phonetic: 'la-ba',
    examples: [{ so: 'Laba buug ayaan hayaa', en: 'I have two books' }],
    difficulty: 'beginner',
  },
  {
    id: '7',
    categoryId: 'colors',
    wordSo: 'Cas',
    wordEn: 'Red',
    partOfSpeech: 'adjective',
    phonetic: 'cas',
    examples: [{ so: 'Tufaax cas', en: 'Red apple' }],
    difficulty: 'beginner',
  },
  {
    id: '8',
    categoryId: 'colors',
    wordSo: 'Cagaar',
    wordEn: 'Green',
    partOfSpeech: 'adjective',
    phonetic: 'ca-ga-ar',
    examples: [{ so: 'Dhir cagaar ah', en: 'Green plant' }],
    difficulty: 'beginner',
  },
];

interface QuizScreenProductionProps {
  onBack?: () => void;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export const QuizScreenProduction: React.FC<QuizScreenProductionProps> = ({
  onBack,
  category = 'all',
  difficulty = 'beginner'
}) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const {
    startQuiz,
    currentQuestion,
    currentSession,
    quizState,
    selectedAnswer,
    showResult,
    answerQuestion,
    setSelectedAnswer,
    resetQuiz,
    loading,
    error
  } = useQuizStore();

  // Filter words based on category and difficulty
  const getFilteredWords = () => {
    let filtered = sampleWords;
    
    if (category !== 'all') {
      filtered = filtered.filter(word => word.categoryId === category);
    }
    
    if (difficulty) {
      filtered = filtered.filter(word => word.difficulty === difficulty);
    }
    
    return filtered;
  };

  const handleStartQuiz = () => {
    const words = getFilteredWords();
    if (words.length < 3) {
      Alert.alert(
        'Ma ku filna - Not Enough Words',
        'Erayo badan ayaa loo baahan yahay imtixaanka - More words needed for the quiz',
        [{ text: 'OK' }]
      );
      return;
    }
    
    resetQuiz();
    startQuiz(category, words, {
      questionCount: Math.min(10, words.length),
      timePerQuestion: 30,
      questionType: 'mixed',
      difficulty: difficulty
    });
    setQuizStarted(true);
    setCurrentProgress(0);
  };

  const handleAnswer = (answer: string) => {
    answerQuestion(answer);
    // Update progress
    if (currentSession) {
      const progress = ((currentSession.results.length + 1) / currentSession.questions.length) * 100;
      setCurrentProgress(progress);
    }
  };

  const handleBackToStart = () => {
    resetQuiz();
    setQuizStarted(false);
    setCurrentProgress(0);
  };

  const handleExitQuiz = () => {
    Alert.alert(
      'Jooji Imtixaanka - Exit Quiz?',
      'Ma hubtaa inaad doonayso in aad joojiso imtixaanka? - Are you sure you want to exit the quiz?',
      [
        { text: 'Maya - No', style: 'cancel' },
        { 
          text: 'Haa - Yes',
          style: 'destructive',
          onPress: () => {
            resetQuiz();
            setQuizStarted(false);
            onBack && onBack();
          }
        }
      ]
    );
  };

  // Show results screen if quiz is completed
  if (quizState === 'completed' && currentSession) {
    return (
      <ResultScreen
        session={currentSession}
        navigation={{ goBack: handleBackToStart }}
        onRestart={handleStartQuiz}
        onExit={onBack || handleBackToStart}
      />
    );
  }

  // Show quiz in progress
  if (quizStarted && currentQuestion && quizState === 'active') {
    const questionNumber = (currentSession?.results.length || 0) + 1;
    const totalQuestions = currentSession?.questions.length || 0;

    return (
      <View style={styles.container}>
        {/* Quiz Header */}
        <LinearGradient
          colors={[AfricanColors.primary.light, AfricanColors.primary.main]}
          style={styles.quizHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={handleExitQuiz}
                iconColor={AfricanColors.text.inverse}
              />
              <Text variant="titleMedium" style={styles.quizTitle}>
                Imtixaan - Quiz
              </Text>
              <View style={{ width: 40 }} />
            </View>
            
            <Text variant="bodyMedium" style={styles.questionCounter}>
              Su'aal {questionNumber} / {totalQuestions} - Question {questionNumber} of {totalQuestions}
            </Text>
            
            <ProgressBar
              progress={currentProgress / 100}
              color={AfricanColors.background.card}
              style={styles.progressBar}
            />
          </View>
        </LinearGradient>

        {/* Question Content */}
        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <QuestionCard
            question={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            timeLeft={30} // This would come from timer
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onAnswer={handleAnswer}
            onSelectAnswer={setSelectedAnswer}
            onSubmit={() => selectedAnswer && handleAnswer(selectedAnswer)}
            onSkip={() => handleAnswer('')}
          />
        </ScrollView>
      </View>
    );
  }

  // Show quiz start screen
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Beautiful African header */}
      <LinearGradient
        colors={[AfricanColors.primary.light, AfricanColors.primary.main, AfricanColors.secondary.main]}
        style={styles.startHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.startHeaderContent}>
          {onBack && (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={onBack}
              iconColor={AfricanColors.text.inverse}
              style={styles.backButton}
            />
          )}
          <Text variant="displaySmall" style={styles.startTitle}>
            🧠 Imtixaan
          </Text>
          <Text variant="titleMedium" style={styles.startSubtitle}>
            Tijaabi Aqoontaada - Test Your Knowledge
          </Text>
        </View>
      </LinearGradient>

      {/* Quiz Information */}
      <View style={styles.startContent}>
        <Card style={styles.infoCard} mode="elevated">
          <Card.Content>
            <Text variant="headlineSmall" style={styles.infoTitle}>
              Diyaarka Imtixaanka! 🎯
            </Text>
            <Text variant="bodyLarge" style={styles.infoText}>
              Ku baro aqoontaada ereyada Af-Soomaaliga ah
            </Text>
            <Text variant="bodyMedium" style={styles.infoTextEn}>
              Test your knowledge of Somali vocabulary words
            </Text>

            <View style={styles.quizFeatures}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📝</Text>
                <Text variant="bodyMedium">10 su'aalood - 10 questions</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>⏱️</Text>
                <Text variant="bodyMedium">30 ilbiriqsi qof walba - 30 seconds each</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🏆</Text>
                <Text variant="bodyMedium">Natiijooyiin iyo dhalanteed - Results & scoring</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text variant="bodyMedium">Raaco horumarkaaga - Track your progress</Text>
              </View>
            </View>

            <Text variant="bodyMedium" style={styles.readyText}>
              Ma diyaar u tahay? - Are you ready?
            </Text>

            <Button
              mode="contained"
              onPress={handleStartQuiz}
              disabled={loading}
              loading={loading}
              style={styles.startButton}
              buttonColor={AfricanColors.secondary.main}
              textColor={AfricanColors.text.inverse}
              labelStyle={styles.startButtonText}
            >
              Bilow Imtixaanka - Start Quiz
            </Button>
          </Card.Content>
        </Card>

        {error && (
          <Card style={styles.errorCard} mode="outlined">
            <Card.Content>
              <Text variant="bodyMedium" style={styles.errorText}>
                ⚠️ {error}
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AfricanColors.background.primary,
  },
  
  // Start screen styles
  startHeader: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 200,
  },
  startHeaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: -20,
    left: -8,
  },
  startTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  startSubtitle: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Content styles
  startContent: {
    padding: 24,
  },
  infoCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  infoTitle: {
    color: AfricanColors.primary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: AfricanColors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoTextEn: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  
  // Features
  quizFeatures: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  
  readyText: {
    color: AfricanColors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 24,
  },
  
  startButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Quiz active styles
  quizHeader: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  quizTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  questionCounter: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.9,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  questionContent: {
    flex: 1,
  },
  
  // Error styles
  errorCard: {
    marginTop: 16,
    borderColor: AfricanColors.accent.coral,
    borderWidth: 1,
  },
  errorText: {
    color: AfricanColors.accent.coral,
    textAlign: 'center',
  },
});

export default QuizScreenProduction;
