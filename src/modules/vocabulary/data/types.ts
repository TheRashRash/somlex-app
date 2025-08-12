export interface Category {
  id: string;
  nameSo: string;
  nameEn: string;
  icon: string;
  order?: number;
  createdAt?: Date;
}

export interface Word {
  id: string;
  categoryId: string;
  wordSo: string;
  wordEn: string;
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'conjunction';
  phonetic?: string;
  audioUrl?: string;
  examples?: WordExample[];
  createdAt?: Date;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface WordExample {
  so: string;
  en: string;
}

export interface VocabularySearchResult {
  words: Word[];
  categories: Category[];
  totalCount: number;
}

export interface CategoryWithStats extends Category {
  wordCount: number;
  learnedCount?: number;
  progressPercentage?: number;
}

// Store interfaces
export interface VocabularyState {
  categories: Category[];
  words: Word[];
  selectedCategory: Category | null;
  searchResults: Word[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export interface VocabularyActions {
  fetchCategories: () => Promise<void>;
  fetchWordsByCategory: (categoryId: string) => Promise<void>;
  searchWords: (term: string) => Promise<void>;
  setSelectedCategory: (category: Category | null) => void;
  clearSearch: () => void;
  clearError: () => void;
}

export interface VocabularyStore extends VocabularyState, VocabularyActions {}

// Navigation types
export interface VocabularyScreenProps {
  navigation: any; // Will be typed properly when integrated with app navigation
  route?: any;
}

// Component props
export interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
  categories?: Category[];
  loading?: boolean;
}

export interface WordCardProps {
  word: Word;
  onPress?: (word: Word) => void;
  showCategory?: boolean;
  compact?: boolean;
}

export interface WordListProps {
  words: Word[];
  onWordPress?: (word: Word) => void;
  loading?: boolean;
  emptyMessage?: string;
}
