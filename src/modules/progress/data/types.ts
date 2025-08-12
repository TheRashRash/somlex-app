// src/modules/progress/data/types.ts
export interface WordProgress {
  wordId: string;
  correctCount: number;
  incorrectCount: number;
  strength: number; // 0-5 scale
  lastSeen: Date;
  streak: number;
}

export interface CategoryProgress {
  categoryId: string;
  totalWords: number;
  learnedWords: number; // strength >= 3
  masteredWords: number; // strength >= 5
  averageStrength: number;
  lastStudied: Date;
}

export interface UserStats {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalQuizzesTaken: number;
  averageScore: number;
  studyTimeMinutes: number;
  lastActiveDate: Date;
  level: number;
  experiencePoints: number;
}
