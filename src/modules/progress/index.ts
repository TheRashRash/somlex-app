// src/modules/progress/index.ts

// UI Components
export { ProgressScreen } from './ui/ProgressScreen';
export { StatsCard } from './ui/StatsCard';
export { StreakWidget } from './ui/StreakWidget';

// Store
export { useProgressStore } from './store/progressStore';

// Data Types
export type { 
  WordProgress, 
  CategoryProgress, 
  UserStats 
} from './data/types';

// Repository
export { progressRepository } from './data/repository';

// Utilities
export {
  calculateLevel,
  calculateXPForNextLevel,
  calculateProgressPercentage,
  calculateAverageScore,
  calculateStrengthDistribution,
  calculateCategoryProgress,
  getStudyRecommendations,
  calculateStudyStreak,
} from './utils/calculations';
