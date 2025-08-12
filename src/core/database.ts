import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Category, Word, UserProgress } from './types';

// Collection references
export const collections = {
  users: 'users',
  categories: 'categories',
  words: 'words',
  progress: 'progress',
} as const;

// User services
export const userService = {
  async create(uid: string, userData: Omit<User, 'id' | 'joinedAt'>) {
    const userDoc = {
      ...userData,
      joinedAt: Timestamp.now(),
    };
    await setDoc(doc(db, collections.users, uid), userDoc);
    return { id: uid, ...userDoc };
  },

  async get(uid: string) {
    const userDoc = await getDoc(doc(db, collections.users, uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  },

  async update(uid: string, updates: Partial<User>) {
    await setDoc(doc(db, collections.users, uid), updates, { merge: true });
  },
};

// Category services
export const categoryService = {
  async create(categoryData: Omit<Category, 'id' | 'createdAt'>) {
    const docData = {
      ...categoryData,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, collections.categories), docData);
    return { id: docRef.id, ...docData };
  },

  async getAll() {
    const querySnapshot = await getDocs(
      query(collection(db, collections.categories), orderBy('nameEn'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  },

  async get(categoryId: string) {
    const categoryDoc = await getDoc(doc(db, collections.categories, categoryId));
    if (categoryDoc.exists()) {
      return { id: categoryDoc.id, ...categoryDoc.data() } as Category;
    }
    return null;
  },
};

// Word services
export const wordService = {
  async create(wordData: Omit<Word, 'id' | 'createdAt'>) {
    const docData = {
      ...wordData,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, collections.words), docData);
    return { id: docRef.id, ...docData };
  },

  async getByCategory(categoryId: string) {
    const querySnapshot = await getDocs(
      query(
        collection(db, collections.words),
        where('categoryId', '==', categoryId),
        orderBy('wordEn')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Word[];
  },

  async getAll() {
    const querySnapshot = await getDocs(
      query(collection(db, collections.words), orderBy('wordEn'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Word[];
  },

  async get(wordId: string) {
    const wordDoc = await getDoc(doc(db, collections.words, wordId));
    if (wordDoc.exists()) {
      return { id: wordDoc.id, ...wordDoc.data() } as Word;
    }
    return null;
  },
};

// User Progress services
export const progressService = {
  async create(uid: string, progressData: Omit<UserProgress, 'id'>) {
    const docData = {
      ...progressData,
      lastReviewed: Timestamp.now(),
      nextReview: Timestamp.now(),
    };
    const docRef = await addDoc(
      collection(db, collections.users, uid, collections.progress),
      docData
    );
    return { id: docRef.id, ...docData };
  },

  async update(uid: string, progressId: string, updates: Partial<UserProgress>) {
    const updateData = {
      ...updates,
      lastReviewed: Timestamp.now(),
    };
    await setDoc(
      doc(db, collections.users, uid, collections.progress, progressId),
      updateData,
      { merge: true }
    );
  },

  async getUserProgress(uid: string) {
    const querySnapshot = await getDocs(
      collection(db, collections.users, uid, collections.progress)
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as UserProgress[];
  },

  async getWordProgress(uid: string, wordId: string) {
    const querySnapshot = await getDocs(
      query(
        collection(db, collections.users, uid, collections.progress),
        where('wordId', '==', wordId)
      )
    );
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserProgress;
    }
    return null;
  },
};
