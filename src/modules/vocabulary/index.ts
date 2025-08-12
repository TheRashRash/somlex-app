// UI Components
export { CategoryGrid } from './ui/CategoryGrid';
export { WordCard } from './ui/WordCard';
export { WordListScreen } from './ui/WordListScreen';
export { VocabularyScreen } from './ui/VocabularyScreen';

// Navigation
export { VocabularyNavigator } from './navigation/VocabularyNavigator';
export type { VocabularyStackParamList } from './navigation/VocabularyNavigator';

// Store
export { 
  useVocabularyStore,
  useCategories,
  useWords,
  useSearch,
  useVocabularyActions
} from './store/vocabularyStore';

// Repository
export { vocabularyRepository } from './data/repository';

// Utils
export { ttsManager, useTTS } from './utils/ttsUtils';

// Types
export type {
  Category,
  Word,
  WordExample,
  VocabularySearchResult,
  CategoryWithStats,
  VocabularyState,
  VocabularyActions,
  VocabularyStore,
  VocabularyScreenProps,
  CategoryGridProps,
  WordCardProps,
  WordListProps,
} from './data/types';
