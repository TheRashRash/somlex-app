#!/usr/bin/env node

/**
 * Admin Import Script
 * 
 * This script uses Firebase Admin SDK to bypass security rules
 * and import data directly. Use this for initial data seeding.
 * 
 * Usage:
 * 1. Download service account key from Firebase Console
 * 2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 * 3. Run: npm run admin-import
 */

const fs = require('fs');
const csv = require('csv-parser');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Service account key should be set via GOOGLE_APPLICATION_CREDENTIALS env var
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
  });
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK');
  console.error('   Make sure GOOGLE_APPLICATION_CREDENTIALS is set to your service account key path');
  console.error('   Error:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Import categories with admin privileges
async function adminImportCategories() {
  console.log('🔐 Admin importing categories...');
  
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
          const batch = db.batch();
          
          for (const category of categories) {
            const docRef = db.collection('categories').doc();
            const docData = {
              nameSo: category.nameSo,
              nameEn: category.nameEn,
              icon: category.icon,
              createdAt: admin.firestore.Timestamp.now(),
            };
            
            batch.set(docRef, docData);
            categoryMap.set(category.nameEn, docRef.id);
            console.log(`✅ Prepared category: ${category.nameEn} (${category.nameSo})`);
          }
          
          await batch.commit();
          console.log(`🎉 Admin imported ${categories.length} categories successfully!`);
          resolve(categoryMap);
        } catch (error) {
          console.error('❌ Error in admin category import:', error);
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Import words with admin privileges
async function adminImportWords(categoryMap) {
  console.log('🔐 Admin importing words...');
  
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
          const batchSize = 500; // Firestore batch limit
          let batch = db.batch();
          let batchCount = 0;
          
          for (const word of words) {
            const categoryId = categoryMap.get(word.categoryName);
            
            if (!categoryId) {
              console.warn(`⚠️  Category '${word.categoryName}' not found, skipping word: ${word.wordEn}`);
              continue;
            }
            
            const docRef = db.collection('words').doc();
            const docData = {
              categoryId: categoryId,
              wordSo: word.wordSo,
              wordEn: word.wordEn,
              partOfSpeech: word.partOfSpeech,
              createdAt: admin.firestore.Timestamp.now(),
            };
            
            batch.set(docRef, docData);
            batchCount++;
            importedCount++;
            
            // Commit batch when it reaches the limit
            if (batchCount >= batchSize) {
              await batch.commit();
              console.log(`📝 Committed batch of ${batchCount} words...`);
              batch = db.batch();
              batchCount = 0;
            }
          }
          
          // Commit remaining items
          if (batchCount > 0) {
            await batch.commit();
            console.log(`📝 Committed final batch of ${batchCount} words...`);
          }
          
          console.log(`🎉 Admin imported ${importedCount} words successfully!`);
          resolve();
        } catch (error) {
          console.error('❌ Error in admin word import:', error);
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Check existing data with admin privileges
async function adminCheckExistingData() {
  try {
    const categoriesSnapshot = await db.collection('categories').get();
    const wordsSnapshot = await db.collection('words').get();
    
    return {
      categories: categoriesSnapshot.size,
      words: wordsSnapshot.size,
    };
  } catch (error) {
    console.error('❌ Error checking existing data:', error);
    return { categories: 0, words: 0 };
  }
}

// Main admin import function
async function adminMain() {
  console.log('🚀 Starting ADMIN data import...\n');
  
  // Check if we have the required configuration
  if (!process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('❌ Missing EXPO_PUBLIC_FIREBASE_PROJECT_ID environment variable.');
    process.exit(1);
  }
  
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('❌ Missing GOOGLE_APPLICATION_CREDENTIALS environment variable.');
    console.error('   Download service account key from Firebase Console');
    console.error('   Set: export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"');
    process.exit(1);
  }
  
  console.log(`🔥 Connected to Firebase project: ${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}`);
  console.log(`🔐 Using service account: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}\n`);
  
  try {
    // Check existing data
    const existing = await adminCheckExistingData();
    console.log(`📊 Current database state:`);
    console.log(`   Categories: ${existing.categories}`);
    console.log(`   Words: ${existing.words}\n`);
    
    if (existing.categories > 0 || existing.words > 0) {
      console.log('⚠️  Warning: Data already exists in the database.');
      console.log('   This script will add new data without removing existing data.\n');
    }
    
    // Import categories first
    const categoryMap = await adminImportCategories();
    console.log('');
    
    // Then import words
    await adminImportWords(categoryMap);
    console.log('');
    
    // Final status
    const final = await adminCheckExistingData();
    console.log(`🎊 Admin import completed successfully!`);
    console.log(`📊 Final database state:`);
    console.log(`   Categories: ${final.categories}`);
    console.log(`   Words: ${final.words}`);
    
  } catch (error) {
    console.error('💥 Admin import failed:', error);
    process.exit(1);
  } finally {
    // Clean up
    process.exit(0);
  }
}

// Run the admin import if this script is executed directly
if (require.main === module) {
  adminMain().catch(console.error);
}
