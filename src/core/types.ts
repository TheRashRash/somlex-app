// Firestore Data Model Types

export interface User {
  id: string;
  email: string;
  joinedAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  language: 'so' | 'en';
  notifications: boolean;
  darkMode: boolean;
}

export interface Category {
  id: string;
  nameSo: string;
  nameEn: string;
  icon: string;
  createdAt: Date;
}

export interface Word {
  id: string;
  categoryId: string;
  wordSo: string;
  wordEn: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'conjunction';
  createdAt: Date;
}

export interface UserProgress {
  id: string;
  wordId: string;
  correctCount: number;
  totalAttempts: number;
  strength: 'weak' | 'medium' | 'strong';
  lastReviewed: Date;
  nextReview: Date;
}

// CSV Import Types
export interface WordCSVRow {
  categoryId: string;
  wordSo: string;
  wordEn: string;
  partOfSpeech: string;
}

export interface CategoryCSVRow {
  nameSo: string;
  nameEn: string;
  icon: string;
}
