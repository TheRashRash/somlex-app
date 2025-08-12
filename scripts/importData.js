#!/usr/bin/env node

const fs = require('fs');
const csv = require('csv-parser');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp, getDocs } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import categories first
async function importCategories() {
  console.log('📚 Importing categories...');
  
  const categories = [];
  const categoryMap = new Map();
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('./data/categories.csv')
      .pipe(csv())
      .on('data', (row) => {
        categories.push(row);
      })
      .on('end', async () => {
        try {
          for (const category of categories) {
            const docData = {
              nameSo: category.nameSo,
              nameEn: category.nameEn,
              icon: category.icon,
              createdAt: Timestamp.now(),
            };
            
            const docRef = await addDoc(collection(db, 'categories'), docData);
            categoryMap.set(category.nameEn, docRef.id);
            console.log(`✅ Added category: ${category.nameEn} (${category.nameSo})`);
          }
          
          console.log(`🎉 Imported ${categories.length} categories successfully!`);
          resolve(categoryMap);
        } catch (error) {
          console.error('❌ Error importing categories:', error);
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Import words with category IDs
async function importWords(categoryMap) {
  console.log('📖 Importing words...');
  
  const words = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('./data/words.csv')
      .pipe(csv())
      .on('data', (row) => {
        words.push(row);
      })
      .on('end', async () => {
        try {
          let importedCount = 0;
          
          for (const word of words) {
            const categoryId = categoryMap.get(word.categoryName);
            
            if (!categoryId) {
              console.warn(`⚠️  Category '${word.categoryName}' not found, skipping word: ${word.wordEn}`);
              continue;
            }
            
            const docData = {
              categoryId: categoryId,
              wordSo: word.wordSo,
              wordEn: word.wordEn,
              partOfSpeech: word.partOfSpeech,
              createdAt: Timestamp.now(),
            };
            
            await addDoc(collection(db, 'words'), docData);
            importedCount++;
            
            if (importedCount % 10 === 0) {
              console.log(`📝 Imported ${importedCount} words so far...`);
            }
          }
          
          console.log(`🎉 Imported ${importedCount} words successfully!`);
          resolve();
        } catch (error) {
          console.error('❌ Error importing words:', error);
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Check if data already exists
async function checkExistingData() {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const wordsSnapshot = await getDocs(collection(db, 'words'));
    
    return {
      categories: categoriesSnapshot.size,
      words: wordsSnapshot.size,
    };
  } catch (error) {
    console.error('❌ Error checking existing data:', error);
    return { categories: 0, words: 0 };
  }
}

// Main import function
async function main() {
  console.log('🚀 Starting data import...\n');
  
  // Check if we have the required environment variables
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Missing Firebase configuration. Please check your .env file.');
    process.exit(1);
  }
  
  console.log(`🔥 Connected to Firebase project: ${firebaseConfig.projectId}\n`);
  
  try {
    // Check existing data
    const existing = await checkExistingData();
    console.log(`📊 Current database state:`);
    console.log(`   Categories: ${existing.categories}`);
    console.log(`   Words: ${existing.words}\n`);
    
    if (existing.categories > 0 || existing.words > 0) {
      console.log('⚠️  Warning: Data already exists in the database.');
      console.log('   This script will add new data without removing existing data.\n');
    }
    
    // Import categories first
    const categoryMap = await importCategories();
    console.log('');
    
    // Then import words
    await importWords(categoryMap);
    console.log('');
    
    // Final status
    const final = await checkExistingData();
    console.log(`🎊 Import completed successfully!`);
    console.log(`📊 Final database state:`);
    console.log(`   Categories: ${final.categories}`);
    console.log(`   Words: ${final.words}`);
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Run the import if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}
