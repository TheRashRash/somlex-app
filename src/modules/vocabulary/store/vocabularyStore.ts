import { create } from 'zustand';
import { Word, Category, VocabularyStore } from '../data/types';
import { vocabularyRepository } from '../data/repository';

export const useVocabularyStore = create<VocabularyStore>((set, get) => ({
  // State
  categories: [],
  words: [],
  selectedCategory: null,
  searchResults: [],
  loading: false,
  error: null,
  searchTerm: '',

  // Actions
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await vocabularyRepository.getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Lama soo qaadi karin qaybaha - Failed to fetch categories', 
        loading: false 
      });
    }
  },

  fetchWordsByCategory: async (categoryId: string) => {
    set({ loading: true, error: null });
    try {
      const words = await vocabularyRepository.getAllWordsByCategory(categoryId);
      
      // Also fetch and set the selected category
      const category = await vocabularyRepository.getCategoryById(categoryId);
      
      set({ 
        words, 
        selectedCategory: category,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Lama soo qaadi karin ereyada - Failed to fetch words', 
        loading: false 
      });
    }
  },

  searchWords: async (term: string) => {
    set({ loading: true, error: null, searchTerm: term });
    try {
      if (!term.trim()) {
        set({ searchResults: [], loading: false });
        return;
      }
      
      const searchResults = await vocabularyRepository.searchWords(term);
      set({ searchResults, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Raadinta way fashilmay - Search failed', 
        loading: false 
      });
    }
  },

  setSelectedCategory: (category: Category | null) => {
    set({ selectedCategory: category });
  },

  clearSearch: () => {
    set({ searchResults: [], searchTerm: '' });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Additional helper hooks for specific use cases
export const useCategories = () => {
  const { categories, loading, error, fetchCategories } = useVocabularyStore();
  return { categories, loading, error, fetchCategories };
};

export const useWords = () => {
  const { words, selectedCategory, loading, error, fetchWordsByCategory } = useVocabularyStore();
  return { words, selectedCategory, loading, error, fetchWordsByCategory };
};

export const useSearch = () => {
  const { 
    searchResults, 
    searchTerm, 
    loading, 
    error, 
    searchWords, 
    clearSearch 
  } = useVocabularyStore();
  
  return { 
    searchResults, 
    searchTerm, 
    loading, 
    error, 
    searchWords, 
    clearSearch 
  };
};

// Enhanced store with additional methods
export const useVocabularyActions = () => {
  const store = useVocabularyStore();
  
  const refreshCategories = async () => {
    await store.fetchCategories();
  };
  
  const selectCategoryAndFetchWords = async (category: Category) => {
    store.setSelectedCategory(category);
    await store.fetchWordsByCategory(category.id);
  };
  
  const performSearch = async (term: string) => {
    if (term.length >= 2) { // Only search if term is 2+ characters
      await store.searchWords(term);
    } else {
      store.clearSearch();
    }
  };
  
  return {
    ...store,
    refreshCategories,
    selectCategoryAndFetchWords,
    performSearch,
  };
};
