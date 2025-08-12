# Data Model & Import Guide

## 📊 Firestore Collections

### Users Collection: `users`
```
users/{uid}/
├── email: string
├── joinedAt: Timestamp
└── settings: {
    language: 'so' | 'en',
    notifications: boolean,
    darkMode: boolean
}
```

### Categories Collection: `categories`
```
categories/{categoryId}/
├── nameSo: string      // Somali name
├── nameEn: string      // English name  
├── icon: string        // Emoji icon
└── createdAt: Timestamp
```

### Words Collection: `words`
```
words/{wordId}/
├── categoryId: string      // Reference to category
├── wordSo: string         // Somali word
├── wordEn: string         // English word
├── partOfSpeech: string   // noun, verb, adjective, etc.
└── createdAt: Timestamp
```

### User Progress: `users/{uid}/progress`
```
users/{uid}/progress/{progressId}/
├── wordId: string         // Reference to word
├── correctCount: number   // Times answered correctly
├── totalAttempts: number  // Total quiz attempts
├── strength: string       // 'weak', 'medium', 'strong'
├── lastReviewed: Timestamp
└── nextReview: Timestamp
```

## 🔄 Data Import

### Prerequisites
1. **Firebase Project**: Create a Firebase project with Firestore enabled
2. **Environment Variables**: Configure `.env` with Firebase credentials
3. **Authentication**: Enable Email/Password authentication

### Import Process

1. **Install Dependencies**:
   ```bash
   npm install csv-parser --save-dev
   ```

2. **Prepare Data Files**:
   - `data/categories.csv` - Category definitions
   - `data/words.csv` - Word translations

3. **Run Import Script**:
   ```bash
   npm run import-data
   ```

### Import Script Features
- ✅ **Checks existing data** before importing
- ✅ **Creates category references** for words
- ✅ **Batch processing** with progress updates
- ✅ **Error handling** with detailed logging
- ✅ **Environment validation**

### Sample Data Included
- **10 Categories**: Animals, Food, Family, Body, Colors, Numbers, Time, Places, Activities, Clothing
- **50 Words**: Basic Somali-English vocabulary
- **Expandable**: Easy to add more categories and words

## 🔧 Usage in App

### Import Services
```typescript
import { 
  categoryService, 
  wordService, 
  progressService 
} from '@/core/database';
```

### Example Usage
```typescript
// Get all categories
const categories = await categoryService.getAll();

// Get words by category
const words = await wordService.getByCategory(categoryId);

// Track user progress
await progressService.create(uid, {
  wordId: word.id,
  correctCount: 1,
  totalAttempts: 1,
  strength: 'weak'
});
```

## 📁 File Structure
```
somlex-app/
├── data/
│   ├── categories.csv
│   └── words.csv
├── scripts/
│   └── importData.js
├── src/core/
│   ├── types.ts        // TypeScript interfaces
│   └── database.ts     // Firestore services
└── docs/
    └── DATA_MODEL.md   // This file
```
