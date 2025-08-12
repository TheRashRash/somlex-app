import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { QuestionCard } from '../modules/quiz/ui/QuestionCard';
import { ResultScreen } from '../modules/quiz/ui/ResultScreen';
import { useQuizStore } from '../modules/quiz/store/quizStore';
import { Word } from '../modules/vocabulary/data/types';
import { QuizSession } from '../modules/quiz/engine/types';

// Mock word data for testing
const mockWords: Word[] = [
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
];

// Mock quiz session for results testing
const mockQuizSession: QuizSession = {
  id: 'test_quiz_123',
  categoryId: 'greetings',
  questions: [],
  results: [
    {
      questionId: 'q_1',
      userAnswer: 'Hello',
      correctAnswer: 'Hello',
      isCorrect: true,
      timeSpent: 5000,
    },
    {
      questionId: 'q_2',
      userAnswer: 'Hello',
      correctAnswer: 'Goodbye',
      isCorrect: false,
      timeSpent: 8000,
    },
    {
      questionId: 'q_3',
      userAnswer: 'Mother',
      correctAnswer: 'Mother',
      isCorrect: true,
      timeSpent: 4000,
    },
  ],
  startTime: new Date(Date.now() - 60000),
  endTime: new Date(),
  score: 67,
};

export default function QuizTest() {
  const [testView, setTestView] = useState<'menu' | 'quiz' | 'results'>('menu');
  const [mockSelectedAnswer, setMockSelectedAnswer] = useState<string | null>(null);
  const [showMockResult, setShowMockResult] = useState(false);
  
  const { 
    startQuiz, 
    currentQuestion, 
    currentSession,
    quizState,
    selectedAnswer,
    showResult,
    answerQuestion,
    setSelectedAnswer,
    resetQuiz
  } = useQuizStore();

  const handleStartRealQuiz = () => {
    resetQuiz();
    startQuiz('greetings', mockWords, { questionCount: 5, timePerQuestion: 30 });
    setTestView('quiz');
  };

  const handleShowResults = () => {
    setTestView('results');
  };

  const handleBackToMenu = () => {
    resetQuiz();
    setTestView('menu');
  };

  const handleRestartQuiz = () => {
    resetQuiz();
    startQuiz('greetings', mockWords, { questionCount: 5, timePerQuestion: 30 });
  };

  // Mock question for standalone testing
  const mockQuestion = {
    id: 'mock_q_1',
    wordId: '1',
    question: 'What is the English translation of "Salaan"?',
    options: ['Hello', 'Goodbye', 'Please', 'Thank you'],
    correctAnswer: 'Hello',
    type: 'so-to-en' as const,
  };

  const renderMenu = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          🧪 Quiz Engine Test
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Testing quiz functionality and components
        </Text>
      </View>

      <Card style={styles.section} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quiz Components
          </Text>
          
          <Button 
            mode="contained" 
            onPress={handleStartRealQuiz}
            style={styles.testButton}
            icon="play"
          >
            Start Real Quiz (5 Questions)
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={handleShowResults}
            style={styles.testButton}
            icon="chart-line"
          >
            View Mock Results Screen
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.section} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Standalone Question Card Test
          </Text>
          
          <QuestionCard
            question={mockQuestion}
            questionNumber={1}
            totalQuestions={5}
            timeLeft={25}
            selectedAnswer={mockSelectedAnswer}
            showResult={showMockResult}
            onAnswer={(answer) => {
              console.log('Mock answer:', answer);
              setMockSelectedAnswer(answer);
              setShowMockResult(true);
              setTimeout(() => setShowMockResult(false), 3000);
            }}
            onSelectAnswer={setMockSelectedAnswer}
            onSubmit={() => {
              if (mockSelectedAnswer) {
                console.log('Mock submit:', mockSelectedAnswer);
                setShowMockResult(true);
                setTimeout(() => setShowMockResult(false), 3000);
              }
            }}
            onSkip={() => {
              console.log('Mock skip');
              setMockSelectedAnswer('');
              setShowMockResult(true);
              setTimeout(() => setShowMockResult(false), 3000);
            }}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderQuiz = () => {
    if (!currentQuestion) {
      return (
        <View style={styles.centerContainer}>
          <Text variant="headlineSmall">Quiz Loading...</Text>
          <Button onPress={handleBackToMenu} style={styles.backButton}>
            Back to Menu
          </Button>
        </View>
      );
    }

    if (quizState === 'completed') {
      return (
        <ResultScreen
          session={currentSession}
          navigation={{ goBack: handleBackToMenu }}
          onRestart={handleRestartQuiz}
          onExit={handleBackToMenu}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.quizHeader}>
          <Text variant="titleMedium" style={styles.quizTitle}>
            Live Quiz Test - Question {(currentSession?.results.length || 0) + 1}
          </Text>
          <Button onPress={handleBackToMenu} mode="outlined" compact>
            Back
          </Button>
        </View>
        
        <QuestionCard
          question={currentQuestion}
          questionNumber={(currentSession?.results.length || 0) + 1}
          totalQuestions={currentSession?.questions.length || 5}
          timeLeft={30}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          onAnswer={answerQuestion}
          onSelectAnswer={setSelectedAnswer}
          onSubmit={() => selectedAnswer && answerQuestion(selectedAnswer)}
          onSkip={() => answerQuestion('')}
        />
      </View>
    );
  };

  const renderResults = () => (
    <ResultScreen
      session={mockQuizSession}
      navigation={{ goBack: handleBackToMenu }}
      onRestart={handleStartRealQuiz}
      onExit={handleBackToMenu}
    />
  );

  switch (testView) {
    case 'quiz':
      return renderQuiz();
    case 'results':
      return renderResults();
    default:
      return renderMenu();
  }
}

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
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
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
    backgroundColor: 'white',
  },
  sectionTitle: {
    color: '#2E7D32',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  testButton: {
    marginBottom: 12,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  quizTitle: {
    color: '#2E7D32',
  },
  backButton: {
    marginTop: 16,
  },
});
