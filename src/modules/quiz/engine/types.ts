export interface QuizQuestion {
  id: string;
  wordId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'so-to-en' | 'en-to-so' | 'audio';
}

export interface QuizResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizSession {
  id: string;
  categoryId: string;
  questions: QuizQuestion[];
  results: QuizResult[];
  startTime: Date;
  endTime?: Date;
  score: number;
}

export interface QuizConfig {
  questionCount: number;
  timePerQuestion: number; // in seconds
  questionType: 'so-to-en' | 'en-to-so' | 'mixed' | 'audio';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizPerformance {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTime: number;
  averageTime: number;
  grade: string;
  strengths: string[];
  weaknesses: string[];
}

// UI Component Props
export interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  timePerQuestion?: number;
}

export interface QuizScreenProps {
  categoryId: string;
  navigation: any;
  route?: any;
}

export interface ResultScreenProps {
  session: QuizSession;
  navigation: any;
  onRestart: () => void;
  onExit: () => void;
}

export type QuizState = 'idle' | 'starting' | 'active' | 'paused' | 'completed' | 'abandoned';
