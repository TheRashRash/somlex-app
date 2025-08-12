// src/modules/progress/data/repository.ts
import { 
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../../core/firebase';
import { WordProgress, CategoryProgress, UserStats } from './types';

class ProgressRepository {
  async updateWordProgress(
    userId: string, 
    wordId: string, 
    isCorrect: boolean
  ): Promise<void> {
    const progressRef = doc(db, 'users', userId, 'progress', wordId);
    
    try {
      const progressDoc = await getDoc(progressRef);
      const currentProgress = progressDoc.exists() 
        ? progressDoc.data() as WordProgress
        : {
            wordId,
            correctCount: 0,
            incorrectCount: 0,
            strength: 0,
            lastSeen: new Date(),
            streak: 0
          };

      const updatedProgress: WordProgress = {
        ...currentProgress,
        correctCount: isCorrect 
          ? currentProgress.correctCount + 1 
          : currentProgress.correctCount,
        incorrectCount: isCorrect 
          ? currentProgress.incorrectCount 
          : currentProgress.incorrectCount + 1,
        strength: Math.max(0, Math.min(5, 
          currentProgress.strength + (isCorrect ? 1 : -1)
        )),
        lastSeen: new Date(),
        streak: isCorrect 
          ? currentProgress.streak + 1 
          : 0
      };

      await setDoc(progressRef, updatedProgress);
      
      // Update user stats
      await this.updateUserStats(userId, isCorrect);
      
    } catch (error) {
      console.error('Error updating word progress:', error);
      throw error;
    }
  }

  async getUserProgress(userId: string): Promise<WordProgress[]> {
    try {
      const progressCollection = collection(db, 'users', userId, 'progress');
      const snapshot = await getDocs(progressCollection);
      return snapshot.docs.map(doc => doc.data() as WordProgress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const statsRef = doc(db, 'users', userId, 'stats', 'summary');
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        return statsDoc.data() as UserStats;
      }
      
      // Initialize default stats
      const defaultStats: UserStats = {
        totalWordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalQuizzesTaken: 0,
        averageScore: 0,
        studyTimeMinutes: 0,
        lastActiveDate: new Date(),
        level: 1,
        experiencePoints: 0
      };
      
      await setDoc(statsRef, defaultStats);
      return defaultStats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  private async updateUserStats(userId: string, isCorrect: boolean): Promise<void> {
    try {
      const statsRef = doc(db, 'users', userId, 'stats', 'summary');
      const xpGained = isCorrect ? 10 : 2; // Points for correct/incorrect answers
      
      await updateDoc(statsRef, {
        experiencePoints: increment(xpGained),
        lastActiveDate: serverTimestamp(),
        ...(isCorrect && {
          currentStreak: increment(1)
        })
      });
      
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  async recordQuizCompletion(
    userId: string, 
    score: number, 
    duration: number
  ): Promise<void> {
    try {
      const statsRef = doc(db, 'users', userId, 'stats', 'summary');
      
      await updateDoc(statsRef, {
        totalQuizzesTaken: increment(1),
        studyTimeMinutes: increment(Math.round(duration / 60)),
        experiencePoints: increment(score), // Bonus XP for completing quiz
        lastActiveDate: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error recording quiz completion:', error);
    }
  }
}

export const progressRepository = new ProgressRepository();
