#!/usr/bin/env node

// Simple test to validate our data model structure
const fs = require('fs');
const csv = require('csv-parser');

async function testDataModel() {
  console.log('🧪 Testing Data Model Structure...\n');
  
  // Test categories CSV
  console.log('📚 Validating categories.csv...');
  const categories = [];
  
  await new Promise((resolve) => {
    fs.createReadStream('./data/categories.csv')
      .pipe(csv())
      .on('data', (row) => {
        categories.push(row);
        console.log(`✅ ${row.nameEn} (${row.nameSo}) - ${row.icon}`);
      })
      .on('end', resolve);
  });
  
  console.log(`\n📊 Found ${categories.length} categories\n`);
  
  // Test words CSV
  console.log('📖 Validating words.csv...');
  const words = [];
  const categoryNames = new Set(categories.map(c => c.nameEn));
  
  await new Promise((resolve) => {
    fs.createReadStream('./data/words.csv')
      .pipe(csv())
      .on('data', (row) => {
        words.push(row);
        
        // Validate category exists
        if (!categoryNames.has(row.categoryName)) {
          console.warn(`⚠️  Warning: Category '${row.categoryName}' not found for word: ${row.wordEn}`);
        } else {
          console.log(`✅ ${row.wordSo} → ${row.wordEn} (${row.partOfSpeech}) [${row.categoryName}]`);
        }
      })
      .on('end', resolve);
  });
  
  console.log(`\n📊 Found ${words.length} words`);
  
  // Summary by category
  const wordsByCategory = {};
  words.forEach(word => {
    if (!wordsByCategory[word.categoryName]) {
      wordsByCategory[word.categoryName] = 0;
    }
    wordsByCategory[word.categoryName]++;
  });
  
  console.log('\n📈 Words by Category:');
  Object.entries(wordsByCategory).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} words`);
  });
  
  console.log('\n🎉 Data model validation complete!');
  
  // Test Firebase connection readiness
  console.log('\n🔥 Firebase Configuration Check:');
  const requiredEnvVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID'
  ];
  
  let allConfigured = true;
  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: configured`);
    } else {
      console.log(`❌ ${envVar}: missing`);
      allConfigured = false;
    }
  });
  
  if (allConfigured) {
    console.log('\n🎊 Ready to import data to Firebase!');
    console.log('   Run: npm run import-data');
  } else {
    console.log('\n⚠️  Firebase configuration incomplete.');
    console.log('   Update your .env file with Firebase credentials.');
  }
}

// Run the test
testDataModel().catch(console.error);
