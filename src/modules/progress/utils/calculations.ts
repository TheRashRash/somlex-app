// src/modules/progress/utils/calculations.ts
import { WordProgress, UserStats, CategoryProgress } from '../data/types';

export const calculateLevel = (experiencePoints: number): number => {
  return Math.floor(experiencePoints / 100) + 1;
};

export const calculateXPForNextLevel = (level: number): number => {
  return level * 100;
};

export const calculateProgressPercentage = (
  currentXP: number,
  level: number
): number => {
  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const progressInLevel = currentXP - currentLevelXP;
  const totalForLevel = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.max(0, (progressInLevel / totalForLevel) * 100));
};

export const calculateAverageScore = (
  scores: number[]
): number => {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
};

export const calculateStrengthDistribution = (
  wordProgress: WordProgress[]
): { [key: number]: number } => {
  const distribution: { [key: number]: number } = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  };
  
  wordProgress.forEach(word => {
    distribution[word.strength] = (distribution[word.strength] || 0) + 1;
  });
  
  return distribution;
};

export const calculateCategoryProgress = (
  wordProgress: WordProgress[],
  categoryId: string
): CategoryProgress => {
  // This would normally filter by category, but we'll use all words for demo
  const categoryWords = wordProgress;
  
  const totalWords = categoryWords.length;
  const learnedWords = categoryWords.filter(word => word.strength >= 3).length;
  const masteredWords = categoryWords.filter(word => word.strength >= 5).length;
  
  const averageStrength = totalWords > 0 
    ? categoryWords.reduce((sum, word) => sum + word.strength, 0) / totalWords
    : 0;
    
  const lastStudied = categoryWords.length > 0
    ? new Date(Math.max(...categoryWords.map(word => word.lastSeen.getTime())))
    : new Date();

  return {
    categoryId,
    totalWords,
    learnedWords,
    masteredWords,
    averageStrength: Math.round(averageStrength * 100) / 100,
    lastStudied,
  };
};

export const getStudyRecommendations = (
  wordProgress: WordProgress[],
  userStats: UserStats
): string[] => {
  const recommendations: string[] = [];
  
  // Check streak
  if (userStats.currentStreak === 0) {
    recommendations.push("Start a new learning streak today! Even 5 minutes makes a difference.");
  } else if (userStats.currentStreak < 3) {
    recommendations.push("Keep building your streak! Consistency is key to language learning.");
  }
  
  // Check weak words
  const weakWords = wordProgress.filter(word => word.strength <= 2);
  if (weakWords.length > 0) {
    recommendations.push(`Review ${weakWords.length} challenging words to strengthen your vocabulary.`);
  }
  
  // Check study frequency
  if (userStats.studyTimeMinutes < 30 * userStats.currentStreak) {
    recommendations.push("Try to increase your daily study time for better retention.");
  }
  
  // Check quiz performance
  if (userStats.averageScore < 70) {
    recommendations.push("Focus on accuracy - review words before taking quizzes.");
  } else if (userStats.averageScore > 90) {
    recommendations.push("Excellent progress! Try learning new words to expand your vocabulary.");
  }
  
  // Level-based recommendations
  if (userStats.level < 5) {
    recommendations.push("Focus on building a strong foundation with basic vocabulary.");
  } else if (userStats.level >= 10) {
    recommendations.push("You're doing great! Consider advanced topics or conversation practice.");
  }
  
  return recommendations.slice(0, 3); // Return top 3 recommendations
};

export const calculateStudyStreak = (
  activityDates: Date[]
): { current: number; longest: number } => {
  if (activityDates.length === 0) {
    return { current: 0, longest: 0 };
  }
  
  // Sort dates in descending order
  const sortedDates = activityDates
    .map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if the most recent date is today or yesterday for current streak
  const mostRecent = sortedDates[0];
  if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
    currentStreak = 1;
    
    // Calculate current streak
    for (let i = 1; i < sortedDates.length; i++) {
      const current = sortedDates[i];
      const previous = sortedDates[i - 1];
      const dayDifference = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDifference === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak
  for (let i = 1; i < sortedDates.length; i++) {
    const current = sortedDates[i];
    const previous = sortedDates[i - 1];
    const dayDifference = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDifference === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
  
  return { current: currentStreak, longest: longestStreak };
};
