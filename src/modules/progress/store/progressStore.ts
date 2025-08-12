// src/modules/progress/store/progressStore.ts
import { create } from 'zustand';
import { WordProgress, UserStats } from '../data/types';
import { progressRepository } from '../data/repository';

interface ProgressState {
  userProgress: WordProgress[];
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
  
  fetchUserProgress: (userId: string) => Promise<void>;
  fetchUserStats: (userId: string) => Promise<void>;
  updateWordProgress: (userId: string, wordId: string, isCorrect: boolean) => Promise<void>;
  recordQuizCompletion: (userId: string, score: number, duration: number) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  userProgress: [],
  userStats: null,
  loading: false,
  error: null,

  fetchUserProgress: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const progress = await progressRepository.getUserProgress(userId);
      set({ userProgress: progress, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchUserStats: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const stats = await progressRepository.getUserStats(userId);
      set({ userStats: stats, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateWordProgress: async (userId: string, wordId: string, isCorrect: boolean) => {
    try {
      await progressRepository.updateWordProgress(userId, wordId, isCorrect);
      // Refresh data
      get().fetchUserProgress(userId);
      get().fetchUserStats(userId);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  recordQuizCompletion: async (userId: string, score: number, duration: number) => {
    try {
      await progressRepository.recordQuizCompletion(userId, score, duration);
      // Refresh stats
      get().fetchUserStats(userId);
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
