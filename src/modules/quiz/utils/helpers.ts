import { QuizResult, QuizPerformance } from '../engine/types';

/**
 * Format time in milliseconds to readable format
 */
export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

/**
 * Format time for display (MM:SS)
 */
export const formatTimeDisplay = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get performance color based on accuracy
 */
export const getPerformanceColor = (accuracy: number): string => {
  if (accuracy >= 90) return '#4CAF50'; // Green
  if (accuracy >= 80) return '#8BC34A'; // Light Green  
  if (accuracy >= 70) return '#FFC107'; // Amber
  if (accuracy >= 60) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

/**
 * Get performance emoji based on grade
 */
export const getPerformanceEmoji = (grade: string): string => {
  switch (grade) {
    case 'A+': return '🏆';
    case 'A': return '⭐';
    case 'A-': return '🌟';
    case 'B+': return '👍';
    case 'B': return '👌';
    case 'B-': return '😊';
    case 'C+': return '🙂';
    case 'C': return '😐';
    case 'C-': return '😕';
    case 'D': return '😔';
    case 'F': return '😞';
    default: return '📚';
  }
};

/**
 * Get motivational message based on performance
 */
export const getMotivationalMessage = (performance: QuizPerformance): string => {
  const { accuracy, grade } = performance;
  
  if (accuracy >= 95) {
    return "Shabeelkan aad u fiican! Perfect score! - Excellent work!";
  } else if (accuracy >= 90) {
    return "Aad ayaad u hagaagsan tahay! - You're doing great!";
  } else if (accuracy >= 80) {
    return "Waxaad ku socotaa jid fiican! - You're on the right track!";
  } else if (accuracy >= 70) {
    return "Hagaag, laakiin waxaad u baahan tahay in aad badan ka barto - Good, but you need more practice";
  } else if (accuracy >= 60) {
    return "Ku sii wad! Waxbarasho badan ayaad u baahan tahay - Keep going! You need more study";
  } else {
    return "Ha niyad jabin! Billow mar kale - Don't give up! Start again";
  }
};

/**
 * Calculate streak of correct/incorrect answers
 */
export const calculateStreak = (results: QuizResult[]): { 
  current: number, 
  longest: number, 
  type: 'correct' | 'incorrect' | 'none' 
} => {
  if (results.length === 0) {
    return { current: 0, longest: 0, type: 'none' };
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let streakType: 'correct' | 'incorrect' | 'none' = 'none';
  
  // Calculate current streak (from the end)
  const lastResult = results[results.length - 1];
  const isCorrectStreak = lastResult.isCorrect;
  
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].isCorrect === isCorrectStreak) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  let lastWasCorrect: boolean | null = null;
  
  for (const result of results) {
    if (lastWasCorrect === null || lastWasCorrect === result.isCorrect) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
    lastWasCorrect = result.isCorrect;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    type: isCorrectStreak ? 'correct' : 'incorrect'
  };
};

/**
 * Generate study plan recommendations
 */
export const generateStudyPlan = (
  results: QuizResult[], 
  category: string,
  weeklyGoal: number = 3
): string[] => {
  const accuracy = results.length > 0 
    ? (results.filter(r => r.isCorrect).length / results.length) * 100 
    : 0;

  const plan: string[] = [];
  
  if (accuracy < 50) {
    plan.push(`📚 Dedicate 15-20 minutes daily to ${category} vocabulary`);
    plan.push(`🔄 Review flashcards 3 times per day`);
    plan.push(`🎧 Listen to pronunciations 5-10 times per word`);
    plan.push(`📝 Write each word 5 times to memorize spelling`);
  } else if (accuracy < 70) {
    plan.push(`📖 Study ${category} words for 10-15 minutes daily`);
    plan.push(`🔁 Review incorrect answers from this quiz`);
    plan.push(`🎯 Take a quiz every 2-3 days`);
    plan.push(`💭 Use words in example sentences`);
  } else if (accuracy < 90) {
    plan.push(`⚡ Quick 5-10 minute daily reviews`);
    plan.push(`🎯 Take quizzes 2-3 times per week`);
    plan.push(`🔄 Focus on speed and accuracy`);
    plan.push(`📈 Try more challenging categories`);
  } else {
    plan.push(`🏆 Excellent! Maintain with light review`);
    plan.push(`🚀 Challenge yourself with advanced categories`);
    plan.push(`👨‍🏫 Help others or teach what you've learned`);
    plan.push(`📅 Weekly review to maintain knowledge`);
  }

  return plan;
};

/**
 * Get difficulty recommendation based on performance
 */
export const getDifficultyRecommendation = (
  recentPerformances: QuizPerformance[]
): 'easy' | 'medium' | 'hard' => {
  if (recentPerformances.length === 0) return 'easy';
  
  const averageAccuracy = recentPerformances.reduce((sum, p) => sum + p.accuracy, 0) / recentPerformances.length;
  const averageTime = recentPerformances.reduce((sum, p) => sum + p.averageTime, 0) / recentPerformances.length;
  
  // If consistently high accuracy and fast responses, recommend harder difficulty
  if (averageAccuracy >= 90 && averageTime <= 8) {
    return 'hard';
  } else if (averageAccuracy >= 75 && averageTime <= 12) {
    return 'medium';
  } else {
    return 'easy';
  }
};

/**
 * Validate quiz answer
 */
export const validateAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  // Normalize answers by trimming whitespace and converting to lowercase
  const normalizedUser = userAnswer.trim().toLowerCase();
  const normalizedCorrect = correctAnswer.trim().toLowerCase();
  
  return normalizedUser === normalizedCorrect;
};

/**
 * Get random encouraging message
 */
export const getRandomEncouragement = (): string => {
  const messages = [
    "Sidaas ayey tahay! - That's right!",
    "Aad ayaad u fiican tahay! - You're very good!",
    "Hagaag! - Correct!",
    "Shaabash! - Well done!",
    "Ku sii wad! - Keep going!",
    "Fiican! - Good!",
    "Waa hagaag! - That's correct!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Get random consolation message for wrong answers
 */
export const getRandomConsolation = (): string => {
  const messages = [
    "Ma jirto dhibaato! - No problem!",
    "Isku day mar kale! - Try again!",
    "Waxbarasho ayay tahay! - It's learning!",
    "Ku sii wad! - Keep going!",
    "Markale ayaad heli doontaa! - You'll get it next time!",
    "Hagaag, baro! - That's okay, learn!",
    "Khalad kasta waa barashada! - Every mistake is learning!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};
