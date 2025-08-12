import { create } from 'zustand';
import { QuizQuestion, QuizResult, QuizSession, QuizConfig, QuizState } from '../engine/types';
import { quizEngine } from '../engine/QuizEngine';
import { Word } from '../../vocabulary/data/types';
import { validateAnswer } from '../utils/helpers';

interface QuizStoreState {
  // Current quiz state
  currentSession: QuizSession | null;
  currentQuestionIndex: number;
  currentQuestion: QuizQuestion | null;
  quizState: QuizState;
  
  // Configuration
  config: QuizConfig;
  
  // UI state
  loading: boolean;
  error: string | null;
  showResult: boolean;
  selectedAnswer: string | null;
  
  // Timer
  timeLeft: number;
  startTime: number;
  
  // Actions
  startQuiz: (categoryId: string, words: Word[], config?: Partial<QuizConfig>) => void;
  answerQuestion: (answer: string) => void;
  nextQuestion: () => void;
  skipQuestion: () => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  endQuiz: () => QuizSession | null;
  resetQuiz: () => void;
  setSelectedAnswer: (answer: string | null) => void;
  
  // Timer actions
  startTimer: () => void;
  stopTimer: () => void;
  updateTimer: () => void;
  
  // Utility getters
  getCurrentQuestion: () => QuizQuestion | null;
  getProgress: () => number;
  canProceed: () => boolean;
  isLastQuestion: () => boolean;
}

const DEFAULT_CONFIG: QuizConfig = {
  questionCount: 10,
  timePerQuestion: 30,
  questionType: 'mixed',
  difficulty: 'medium'
};

export const useQuizStore = create<QuizStoreState>((set, get) => ({
  // Initial state
  currentSession: null,
  currentQuestionIndex: 0,
  currentQuestion: null,
  quizState: 'idle',
  config: DEFAULT_CONFIG,
  loading: false,
  error: null,
  showResult: false,
  selectedAnswer: null,
  timeLeft: DEFAULT_CONFIG.timePerQuestion,
  startTime: 0,

  // Actions
  startQuiz: (categoryId: string, words: Word[], configOverrides?: Partial<QuizConfig>) => {
    try {
      set({ loading: true, error: null });
      
      const config = { ...DEFAULT_CONFIG, ...configOverrides };
      const questions = quizEngine.generateQuestions(
        words, 
        config.questionCount, 
        config.questionType
      );
      
      const session: QuizSession = {
        id: `quiz_${Date.now()}`,
        categoryId,
        questions,
        results: [],
        startTime: new Date(),
        score: 0
      };
      
      set({
        currentSession: session,
        currentQuestionIndex: 0,
        currentQuestion: questions[0] || null,
        quizState: 'active',
        config,
        timeLeft: config.timePerQuestion,
        startTime: Date.now(),
        loading: false,
        selectedAnswer: null,
        showResult: false
      });

      // Start timer
      get().startTimer();
    } catch (error) {
      console.error('Error starting quiz:', error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to start quiz',
        quizState: 'idle'
      });
    }
  },

  answerQuestion: (answer: string) => {
    const state = get();
    const { currentSession, currentQuestionIndex, currentQuestion, startTime } = state;
    
    if (!currentSession || !currentQuestion || state.quizState !== 'active') return;

    const isCorrect = validateAnswer(answer, currentQuestion.correctAnswer);
    const timeSpent = Date.now() - startTime;
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent
    };

    const updatedResults = [...currentSession.results, result];
    const updatedSession = {
      ...currentSession,
      results: updatedResults,
      score: quizEngine.calculateScore(updatedResults)
    };

    set({ 
      currentSession: updatedSession,
      selectedAnswer: answer,
      showResult: true
    });

    // Auto-advance after showing result
    setTimeout(() => {
      get().nextQuestion();
    }, 2000);
  },

  nextQuestion: () => {
    const state = get();
    const { currentSession, currentQuestionIndex } = state;
    
    if (!currentSession) return;

    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < currentSession.questions.length) {
      // Move to next question
      set({
        currentQuestionIndex: nextIndex,
        currentQuestion: currentSession.questions[nextIndex],
        selectedAnswer: null,
        showResult: false,
        timeLeft: state.config.timePerQuestion,
        startTime: Date.now()
      });
    } else {
      // Quiz completed
      get().endQuiz();
    }
  },

  skipQuestion: () => {
    const state = get();
    const { currentQuestion } = state;
    
    if (currentQuestion) {
      // Answer with empty string (incorrect)
      get().answerQuestion('');
    }
  },

  pauseQuiz: () => {
    set({ quizState: 'paused' });
    get().stopTimer();
  },

  resumeQuiz: () => {
    set({ quizState: 'active', startTime: Date.now() });
    get().startTimer();
  },

  endQuiz: () => {
    const { currentSession } = get();
    if (!currentSession) return null;
    
    const completedSession = {
      ...currentSession,
      endTime: new Date()
    };
    
    set({
      currentSession: completedSession,
      quizState: 'completed',
      currentQuestion: null
    });
    
    get().stopTimer();
    return completedSession;
  },

  resetQuiz: () => {
    get().stopTimer();
    set({
      currentSession: null,
      currentQuestionIndex: 0,
      currentQuestion: null,
      quizState: 'idle',
      config: DEFAULT_CONFIG,
      loading: false,
      error: null,
      showResult: false,
      selectedAnswer: null,
      timeLeft: DEFAULT_CONFIG.timePerQuestion,
      startTime: 0
    });
  },

  setSelectedAnswer: (answer: string | null) => {
    set({ selectedAnswer: answer });
  },

  // Timer actions
  startTimer: () => {
    const timer = setInterval(() => {
      get().updateTimer();
    }, 1000);
    
    // Store timer ID for cleanup
    (get() as any).timerId = timer;
  },

  stopTimer: () => {
    const timerId = (get() as any).timerId;
    if (timerId) {
      clearInterval(timerId);
      (get() as any).timerId = null;
    }
  },

  updateTimer: () => {
    const state = get();
    if (state.quizState !== 'active') return;
    
    const newTimeLeft = state.timeLeft - 1;
    
    if (newTimeLeft <= 0) {
      // Time's up - auto-submit current answer or skip
      const currentAnswer = state.selectedAnswer || '';
      if (currentAnswer) {
        get().answerQuestion(currentAnswer);
      } else {
        get().skipQuestion();
      }
    } else {
      set({ timeLeft: newTimeLeft });
    }
  },

  // Utility getters
  getCurrentQuestion: () => {
    const { currentQuestion } = get();
    return currentQuestion;
  },

  getProgress: () => {
    const { currentSession, currentQuestionIndex } = get();
    if (!currentSession) return 0;
    return (currentQuestionIndex + 1) / currentSession.questions.length;
  },

  canProceed: () => {
    const { selectedAnswer, showResult } = get();
    return selectedAnswer !== null || showResult;
  },

  isLastQuestion: () => {
    const { currentSession, currentQuestionIndex } = get();
    if (!currentSession) return false;
    return currentQuestionIndex === currentSession.questions.length - 1;
  }
}));

// Cleanup timer when store is destroyed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const store = useQuizStore.getState();
    if ((store as any).timerId) {
      clearInterval((store as any).timerId);
    }
  });
}

// Helper hooks
export const useCurrentQuestion = () => {
  const store = useQuizStore();
  return store.currentQuestion;
};

export const useQuizProgress = () => {
  const store = useQuizStore();
  return {
    current: store.currentQuestionIndex + 1,
    total: store.currentSession?.questions.length || 0,
    progress: store.getProgress()
  };
};

export const useQuizTimer = () => {
  const store = useQuizStore();
  return {
    timeLeft: store.timeLeft,
    totalTime: store.config.timePerQuestion,
    isRunning: store.quizState === 'active'
  };
};

export const useQuizResults = () => {
  const store = useQuizStore();
  return {
    session: store.currentSession,
    isCompleted: store.quizState === 'completed',
    score: store.currentSession?.score || 0,
    results: store.currentSession?.results || []
  };
};
