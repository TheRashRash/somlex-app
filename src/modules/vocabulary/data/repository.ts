import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc,
  limit,
  startAfter,
  DocumentSnapshot,
  CollectionReference,
  Query
} from 'firebase/firestore';
import { db } from '@/core/firebase';
import { Word, Category, VocabularySearchResult } from './types';

class VocabularyRepository {
  private wordsCollection = collection(db, 'words');
  private categoriesCollection = collection(db, 'categories');

  /**
   * Fetch all categories ordered by name
   */
  async getCategories(): Promise<Category[]> {
    try {
      const q = query(this.categoriesCollection, orderBy('nameEn', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Lama soo qaadi karin qaybaha - Failed to fetch categories');
    }
  }

  /**
   * Fetch a single category by ID
   */
  async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      const categoryDoc = await getDoc(doc(this.categoriesCollection, categoryId));
      if (categoryDoc.exists()) {
        return { id: categoryDoc.id, ...categoryDoc.data() } as Category;
      }
      return null;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Lama soo qaadi karin qaybtaa - Failed to fetch category');
    }
  }

  /**
   * Fetch words by category with pagination support
   */
  async getWordsByCategory(
    categoryId: string, 
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{ words: Word[]; hasMore: boolean; lastDoc?: DocumentSnapshot }> {
    try {
      let q: Query = query(
        this.wordsCollection,
        where('categoryId', '==', categoryId),
        orderBy('wordEn', 'asc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const words = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Word[];

      const hasMore = snapshot.docs.length === pageSize;
      const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

      return { words, hasMore, lastDoc: newLastDoc };
    } catch (error) {
      console.error('Error fetching words by category:', error);
      throw new Error('Lama soo qaadi karin ereyada - Failed to fetch words');
    }
  }

  /**
   * Get all words for a category (for small datasets)
   */
  async getAllWordsByCategory(categoryId: string): Promise<Word[]> {
    try {
      const q = query(
        this.wordsCollection, 
        where('categoryId', '==', categoryId),
        orderBy('wordEn', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Word[];
    } catch (error) {
      console.error('Error fetching all words by category:', error);
      throw new Error('Lama soo qaadi karin ereyada - Failed to fetch words');
    }
  }

  /**
   * Search words by term (searches both Somali and English)
   * Note: This is a simple implementation. For production, consider using Algolia or similar
   */
  async searchWords(searchTerm: string, limitCount: number = 50): Promise<Word[]> {
    try {
      if (!searchTerm.trim()) {
        return [];
      }

      // Get all words and filter client-side (not ideal for large datasets)
      // TODO: Implement proper full-text search with Algolia or Firestore extensions
      const snapshot = await getDocs(
        query(this.wordsCollection, limit(500)) // Limit to prevent large reads
      );
      
      const allWords = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Word[];
      
      const term = searchTerm.toLowerCase().trim();
      
      return allWords
        .filter(word => 
          word.wordSo.toLowerCase().includes(term) ||
          word.wordEn.toLowerCase().includes(term) ||
          word.partOfSpeech?.toLowerCase().includes(term)
        )
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error searching words:', error);
      throw new Error('Lama raadoon karin ereyada - Failed to search words');
    }
  }

  /**
   * Get random words for learning
   */
  async getRandomWords(count: number = 10): Promise<Word[]> {
    try {
      // Simple implementation - get all words and shuffle
      // TODO: Implement proper random selection for large datasets
      const snapshot = await getDocs(
        query(this.wordsCollection, limit(100))
      );
      
      const words = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Word[];

      // Shuffle array and return requested count
      const shuffled = words.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Error fetching random words:', error);
      throw new Error('Lama soo qaadi karin ereyada - Failed to fetch random words');
    }
  }

  /**
   * Get word count by category
   */
  async getWordCountByCategory(categoryId: string): Promise<number> {
    try {
      const q = query(
        this.wordsCollection,
        where('categoryId', '==', categoryId)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting word count:', error);
      return 0;
    }
  }

  /**
   * Get categories with word counts
   */
  async getCategoriesWithStats(): Promise<Array<Category & { wordCount: number }>> {
    try {
      const categories = await this.getCategories();
      const categoriesWithStats = await Promise.all(
        categories.map(async (category) => {
          const wordCount = await this.getWordCountByCategory(category.id);
          return { ...category, wordCount };
        })
      );
      return categoriesWithStats;
    } catch (error) {
      console.error('Error fetching categories with stats:', error);
      throw new Error('Lama soo qaadi karin xogta qaybaha - Failed to fetch category statistics');
    }
  }

  /**
   * Advanced search with filters
   */
  async advancedSearch(
    searchTerm: string,
    categoryId?: string,
    partOfSpeech?: string,
    difficulty?: string
  ): Promise<VocabularySearchResult> {
    try {
      let baseQuery = this.wordsCollection;
      const constraints: any[] = [];

      if (categoryId) {
        constraints.push(where('categoryId', '==', categoryId));
      }
      
      if (partOfSpeech) {
        constraints.push(where('partOfSpeech', '==', partOfSpeech));
      }

      if (difficulty) {
        constraints.push(where('difficulty', '==', difficulty));
      }

      constraints.push(limit(100));

      const q = query(baseQuery, ...constraints);
      const snapshot = await getDocs(q);
      
      let words = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Word[];

      // Apply text search if provided
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        words = words.filter(word =>
          word.wordSo.toLowerCase().includes(term) ||
          word.wordEn.toLowerCase().includes(term)
        );
      }

      return {
        words,
        categories: [], // TODO: Implement category search if needed
        totalCount: words.length
      };
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw new Error('Raadinta horumaraysan way fashilmay - Advanced search failed');
    }
  }
}

export const vocabularyRepository = new VocabularyRepository();
