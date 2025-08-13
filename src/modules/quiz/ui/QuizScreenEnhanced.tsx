import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Animated, Vibration } from 'react-native';
import { Button, Text, Card, IconButton, ProgressBar, Chip, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { QuizQuestion, QuizResult, QuizConfig } from '../engine/types';
import { ResultScreen } from './ResultScreen';
import { useQuizStore } from '../store/quizStore';
import { Word } from '../../vocabulary/data/types';
import { formatTimeDisplay, getRandomEncouragement, getRandomConsolation } from '../utils/helpers';
import { useTTS } from '../../vocabulary/utils/ttsUtils';

// Fixed African color palette with proper contrast ratios
const AfricanColors = {
  primary: { main: '#B8860B', light: '#D4AF37', dark: '#8B6914' },
  secondary: { main: '#654321', light: '#8D6E63' },
  background: { primary: '#FFFEF7', card: '#FFFFFF', surface: '#FAF0E6' },
  text: { 
    primary: '#2F2F2F', 
    secondary: '#4A4A4A', 
    tertiary: '#666666',
    inverse: '#FFFFFF',
    onPrimary: '#FFFFFF'
  },
  accent: { 
    coral: '#D2691E', 
    terracotta: '#B8860B', 
    green: '#4CAF50', 
    red: '#F44336',
    blue: '#2196F3'
  },
};

// Enhanced sample vocabulary for quiz with better variety
const enhancedVocabulary: Word[] = [
  // Greetings
  { id: '1', categoryId: 'greetings', wordSo: 'Salaan', wordEn: 'Hello', partOfSpeech: 'noun', phonetic: 'sa-la-an', difficulty: 'beginner', examples: [{ so: 'Salaan wanaagsan', en: 'Good greeting' }] },
  { id: '2', categoryId: 'greetings', wordSo: 'Nabadgelyo', wordEn: 'Goodbye', partOfSpeech: 'noun', phonetic: 'na-bad-gel-yo', difficulty: 'beginner', examples: [{ so: 'Nabadgelyo walaalo', en: 'Goodbye brothers' }] },
  { id: '3', categoryId: 'greetings', wordSo: 'Mahadsanid', wordEn: 'Thank you', partOfSpeech: 'noun', phonetic: 'ma-had-sa-nid', difficulty: 'beginner', examples: [{ so: 'Mahadsanid walaal', en: 'Thank you brother' }] },
  { id: '4', categoryId: 'greetings', wordSo: 'Waan ka xumaahay', wordEn: 'I am sorry', partOfSpeech: 'phrase', phonetic: 'waan ka xu-ma-hay', difficulty: 'intermediate', examples: [{ so: 'Waan ka xumaahay', en: 'I am sorry' }] },
  
  // Family
  { id: '5', categoryId: 'family', wordSo: 'Hooyo', wordEn: 'Mother', partOfSpeech: 'noun', phonetic: 'hoo-yo', difficulty: 'beginner', examples: [{ so: 'Hooyada ayaa la jeclahay', en: 'Mother is loved' }] },
  { id: '6', categoryId: 'family', wordSo: 'Aabo', wordEn: 'Father', partOfSpeech: 'noun', phonetic: 'aa-bo', difficulty: 'beginner', examples: [{ so: 'Aabaha waa nin wanaagsan', en: 'Father is a good man' }] },
  { id: '7', categoryId: 'family', wordSo: 'Walaal', wordEn: 'Sibling', partOfSpeech: 'noun', phonetic: 'wa-la-al', difficulty: 'beginner', examples: [{ so: 'Walaalkay waa wiil fiican', en: 'My brother is a good boy' }] },
  { id: '8', categoryId: 'family', wordSo: 'Habaryar', wordEn: 'Aunt (maternal)', partOfSpeech: 'noun', phonetic: 'ha-bar-yar', difficulty: 'intermediate', examples: [{ so: 'Habaryartayda waa macallin', en: 'My aunt is a teacher' }] },
  
  // Numbers
  { id: '9', categoryId: 'numbers', wordSo: 'Hal', wordEn: 'One', partOfSpeech: 'noun', phonetic: 'hal', difficulty: 'beginner', examples: [{ so: 'Hal qof ayaa yimid', en: 'One person came' }] },
  { id: '10', categoryId: 'numbers', wordSo: 'Laba', wordEn: 'Two', partOfSpeech: 'noun', phonetic: 'la-ba', difficulty: 'beginner', examples: [{ so: 'Laba buug ayaan hayaa', en: 'I have two books' }] },
  { id: '11', categoryId: 'numbers', wordSo: 'Sadex', wordEn: 'Three', partOfSpeech: 'noun', phonetic: 'sa-dex', difficulty: 'beginner', examples: [{ so: 'Sadex shalay ayaan cunay', en: 'I ate three yesterday' }] },
  { id: '12', categoryId: 'numbers', wordSo: 'Toban', wordEn: 'Ten', partOfSpeech: 'noun', phonetic: 'to-ban', difficulty: 'intermediate', examples: [{ so: 'Toban buug', en: 'Ten books' }] },
  
  // Colors
  { id: '13', categoryId: 'colors', wordSo: 'Cas', wordEn: 'Red', partOfSpeech: 'adjective', phonetic: 'cas', difficulty: 'beginner', examples: [{ so: 'Tufaax cas', en: 'Red apple' }] },
  { id: '14', categoryId: 'colors', wordSo: 'Cagaar', wordEn: 'Green', partOfSpeech: 'adjective', phonetic: 'ca-ga-ar', difficulty: 'beginner', examples: [{ so: 'Dhir cagaar ah', en: 'Green plant' }] },
  { id: '15', categoryId: 'colors', wordSo: 'Buluug', wordEn: 'Blue', partOfSpeech: 'adjective', phonetic: 'bu-lu-ug', difficulty: 'beginner', examples: [{ so: 'Samada buluug ah', en: 'Blue sky' }] },
  { id: '16', categoryId: 'colors', wordSo: 'Jaale', wordEn: 'Yellow', partOfSpeech: 'adjective', phonetic: 'ja-le', difficulty: 'intermediate', examples: [{ so: 'Ubax jaale ah', en: 'Yellow flower' }] },
  
  // Actions/Verbs
  { id: '17', categoryId: 'actions', wordSo: 'Socod', wordEn: 'Walk', partOfSpeech: 'verb', phonetic: 'so-cod', difficulty: 'intermediate', examples: [{ so: 'Waxaan socdaa', en: 'I am walking' }] },
  { id: '18', categoryId: 'actions', wordSo: 'Cun', wordEn: 'Eat', partOfSpeech: 'verb', phonetic: 'cun', difficulty: 'beginner', examples: [{ so: 'Waxaan cunayaa', en: 'I am eating' }] },
  { id: '19', categoryId: 'actions', wordSo: 'Cab', wordEn: 'Drink', partOfSpeech: 'verb', phonetic: 'cab', difficulty: 'beginner', examples: [{ so: 'Biyo cab', en: 'Drink water' }] },
  { id: '20', categoryId: 'actions', wordSo: 'Baro', wordEn: 'Learn', partOfSpeech: 'verb', phonetic: 'ba-ro', difficulty: 'intermediate', examples: [{ so: 'Af-Soomaali baro', en: 'Learn Somali' }] },
];

interface QuizScreenEnhancedProps {
  onBack?: () => void;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  words?: Word[];
}

export const QuizScreenEnhanced: React.FC<QuizScreenEnhancedProps> = ({
  onBack,
  category = 'all',
  difficulty = 'beginner',
  words: providedWords
}) => {
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // Animation values
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTime = useRef<number>(Date.now());

  // TTS
  const { speakWord, stop: stopTTS } = useTTS();

  // Get words for quiz
  const getQuizWords = () => {
    if (providedWords && providedWords.length > 0) {
      return providedWords;
    }
    
    let filtered = enhancedVocabulary;
    
    if (category !== 'all') {
      filtered = filtered.filter(word => word.categoryId === category);
    }
    
    if (difficulty) {
      filtered = filtered.filter(word => word.difficulty === difficulty);
    }
    
    return filtered;
  };

  // Generate quiz questions
  const generateQuestions = (words: Word[], count: number = 8): QuizQuestion[] => {
    if (words.length < 4) {
      throw new Error('Need at least 4 words to generate quiz questions');
    }

    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, Math.min(count, words.length));
    const allWords = words;
    
    return selectedWords.map((word, index) => {
      // Randomly choose question type
      const questionTypes = ['so-to-en', 'en-to-so'];
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)] as 'so-to-en' | 'en-to-so';
      
      // Get wrong options (distractors)
      const wrongWords = allWords
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      let question: string;
      let options: string[];
      let correctAnswer: string;
      
      if (questionType === 'so-to-en') {
        question = `Maxay ku tarjumantaa Ingiriisiga "${word.wordSo}"? - What does "${word.wordSo}" mean in English?`;
        correctAnswer = word.wordEn;
        options = [correctAnswer, ...wrongWords.map(w => w.wordEn)]
          .sort(() => Math.random() - 0.5);
      } else {
        question = `Maxay ku tarjumantaa Soomaaliga "${word.wordEn}"? - What does "${word.wordEn}" mean in Somali?`;
        correctAnswer = word.wordSo;
        options = [correctAnswer, ...wrongWords.map(w => w.wordSo)]
          .sort(() => Math.random() - 0.5);
      }

      return {
        id: `q_${index + 1}`,
        wordId: word.id,
        question,
        options,
        correctAnswer,
        type: questionType,
        word // Add word reference for TTS
      } as QuizQuestion & { word: Word };
    });
  };

  // Start quiz
  const handleStartQuiz = () => {
    try {
      setLoading(true);
      const words = getQuizWords();
      
      if (words.length < 4) {
        Alert.alert(
          'Ma ku filna - Not Enough Words',
          'Erayo badan ayaa loo baahan yahay imtixaanka - More words needed for the quiz',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const quizQuestions = generateQuestions(words, 8);
      setQuestions(quizQuestions);
      setCurrentQuestionIndex(0);
      setResults([]);
      setScore(0);
      setQuizStarted(true);
      setIsCompleted(false);
      setTimeLeft(30);
      setSelectedAnswer(null);
      setShowResult(false);
      questionStartTime.current = Date.now();
      
      // Start timer
      startTimer();
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      setLoading(false);
    } catch (error) {
      console.error('Error starting quiz:', error);
      Alert.alert('Khalad - Error', 'Quiz bilaawin ma lagu karo - Cannot start quiz');
      setLoading(false);
    }
  };

  // Timer management
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimeUp = () => {
    stopTimer();
    if (!showResult) {
      handleAnswer(''); // Auto-submit as wrong answer
    }
  };

  // Handle answer submission
  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    stopTimer();
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentQuestion = questions[currentQuestionIndex] as QuizQuestion & { word: Word };
    const isCorrect = answer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    const timeSpent = Date.now() - questionStartTime.current;
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent
    };
    
    setResults(prev => [...prev, result]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      Vibration.vibrate(100); // Success haptic feedback
      
      // Success animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Vibration.vibrate([100, 50, 100]); // Error haptic pattern
    }
    
    // Auto-advance after showing result
    setTimeout(() => {
      handleNextQuestion();
    }, 2500);
  };

  // Move to next question or complete quiz
  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
      questionStartTime.current = Date.now();
      
      // Update progress animation
      Animated.timing(progressAnim, {
        toValue: (nextIndex + 1) / questions.length,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      startTimer();
    } else {
      // Quiz completed
      setIsCompleted(true);
      setQuizStarted(false);
    }
  };

  // Handle pronunciation
  const handlePronunciation = async () => {
    const currentQuestion = questions[currentQuestionIndex] as QuizQuestion & { word: Word };
    if (currentQuestion?.word) {
      try {
        await speakWord(currentQuestion.word.wordSo, {
          onDone: () => {},
          onError: (error) => console.warn('TTS Error:', error)
        });
      } catch (error) {
        console.warn('TTS Error:', error);
      }
    }
  };

  // Exit quiz confirmation
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
            stopTimer();
            setQuizStarted(false);
            setIsCompleted(false);
            onBack && onBack();
          }
        }
      ]
    );
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    setIsCompleted(false);
    handleStartQuiz();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopTTS();
    };
  }, []);

  // Show results screen if completed
  if (isCompleted && results.length > 0) {
    const mockSession = {
      id: `session_${Date.now()}`,
      categoryId: category,
      questions: questions,
      results: results,
      startTime: new Date(),
      endTime: new Date(),
      score: Math.round((score / questions.length) * 100)
    };

    return (
      <ResultScreen
        session={mockSession}
        navigation={{ goBack: () => setIsCompleted(false) }}
        onRestart={handleRestartQuiz}
        onExit={onBack || (() => setIsCompleted(false))}
      />
    );
  }

  // Show active quiz
  if (quizStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex] as QuizQuestion & { word: Word };
    const progress = (currentQuestionIndex + 1) / questions.length;
    const isTimeRunningOut = timeLeft <= 10;

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
                🧠 Imtixaan - Quiz
              </Text>
              <View style={{ width: 40 }} />
            </View>
            
            <View style={styles.quizInfo}>
              <Text variant="bodyMedium" style={styles.questionCounter}>
                Su'aal {currentQuestionIndex + 1} / {questions.length} - Question {currentQuestionIndex + 1} of {questions.length}
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
            
            <Animated.View style={styles.progressContainer}>
              <ProgressBar
                progress={progress}
                color={AfricanColors.background.card}
                style={styles.progressBar}
              />
            </Animated.View>
          </View>
        </LinearGradient>

        {/* Question Content */}
        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Card style={styles.questionCard} mode="elevated">
              <Card.Content style={styles.questionCardContent}>
                {/* Question Text */}
                <Text variant="headlineSmall" style={styles.questionText}>
                  {currentQuestion.question}
                </Text>

                {/* Pronunciation Button */}
                {currentQuestion.word && (
                  <Button
                    mode="outlined"
                    onPress={handlePronunciation}
                    style={styles.pronunciationButton}
                    icon="volume-high"
                    textColor={AfricanColors.accent.blue}
                  >
                    🔊 Dhegayso - Listen
                  </Button>
                )}

                {/* Answer Options */}
                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map((option, index) => {
                    let buttonStyle = styles.optionButton;
                    let buttonColor = undefined;
                    let textColor = AfricanColors.text.primary;
                    
                    if (showResult) {
                      if (option === currentQuestion.correctAnswer) {
                        buttonColor = AfricanColors.accent.green;
                        textColor = AfricanColors.text.inverse;
                      } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                        buttonColor = AfricanColors.accent.red;
                        textColor = AfricanColors.text.inverse;
                      }
                    } else if (selectedAnswer === option) {
                      buttonColor = AfricanColors.primary.light;
                      textColor = AfricanColors.text.inverse;
                    }

                    return (
                      <Button
                        key={index}
                        mode={selectedAnswer === option ? "contained" : "outlined"}
                        onPress={() => !showResult && setSelectedAnswer(option)}
                        style={[buttonStyle, { backgroundColor: buttonColor }]}
                        textColor={textColor}
                        disabled={showResult}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </View>

                {/* Result Message */}
                {showResult && (
                  <Surface style={[
                    styles.resultMessage,
                    selectedAnswer === currentQuestion.correctAnswer ? styles.correctMessage : styles.incorrectMessage
                  ]}>
                    <Text variant="titleMedium" style={styles.resultText}>
                      {selectedAnswer === currentQuestion.correctAnswer 
                        ? getRandomEncouragement() 
                        : getRandomConsolation()
                      }
                    </Text>
                    {selectedAnswer !== currentQuestion.correctAnswer && (
                      <Text variant="bodyMedium" style={styles.correctAnswerText}>
                        Jawaabta saxda ah: {currentQuestion.correctAnswer} - Correct answer: {currentQuestion.correctAnswer}
                      </Text>
                    )}
                  </Surface>
                )}

                {/* Submit Button */}
                {!showResult && (
                  <Button
                    mode="contained"
                    onPress={() => selectedAnswer && handleAnswer(selectedAnswer)}
                    disabled={!selectedAnswer}
                    style={styles.submitButton}
                    buttonColor={AfricanColors.secondary.main}
                    textColor={AfricanColors.text.inverse}
                  >
                    Gudbi - Submit ({selectedAnswer ? '✓' : '?'})
                  </Button>
                )}
              </Card.Content>
            </Card>
          </Animated.View>
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

            {/* Quiz Stats */}
            <View style={styles.quizStats}>
              <Chip icon="format-list-numbered" style={styles.statChip}>
                8 Su'aalood - 8 Questions
              </Chip>
              <Chip icon="timer" style={styles.statChip}>
                30s Qof kasta - 30s Each
              </Chip>
              <Chip icon="trophy" style={styles.statChip}>
                Natiijooyiin - Results
              </Chip>
            </View>

            {/* Features */}
            <View style={styles.features}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🔊</Text>
                <Text variant="bodyMedium">Dhegayso lafudhka - Listen to pronunciation</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text variant="bodyMedium">Raaco natiijooyinkaaga - Track your results</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text variant="bodyMedium">Hel talooyinka waxbarashada - Get study recommendations</Text>
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
              icon="play"
            >
              Bilow Imtixaanka - Start Quiz
            </Button>
          </Card.Content>
        </Card>
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
  
  quizStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  statChip: {
    backgroundColor: AfricanColors.background.surface,
  },
  
  features: {
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
    marginBottom: 12,
  },
  quizTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  quizInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  questionCounter: {
    color: AfricanColors.text.inverse,
    opacity: 0.9,
  },
  timer: {
    color: AfricanColors.text.inverse,
    fontWeight: '600',
  },
  timerUrgent: {
    color: '#FFD54F',
    textShadowColor: 'rgba(255, 87, 34, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  questionContent: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  questionCardContent: {
    padding: 24,
  },
  questionText: {
    color: AfricanColors.primary.main,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 32,
  },
  
  pronunciationButton: {
    marginBottom: 24,
    borderColor: AfricanColors.accent.blue,
    borderRadius: 8,
  },
  
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  
  resultMessage: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  correctMessage: {
    backgroundColor: '#E8F5E8',
  },
  incorrectMessage: {
    backgroundColor: '#FFEBEE',
  },
  resultText: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  correctAnswerText: {
    textAlign: 'center',
    color: AfricanColors.text.secondary,
    fontStyle: 'italic',
  },
  
  submitButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
});

export default QuizScreenEnhanced;
