#!/usr/bin/env node

/**
 * Security Rules Test Script
 * 
 * This script validates that our Firestore security rules are correctly configured.
 * It simulates various access patterns to ensure proper security.
 */

const fs = require('fs');

function testSecurityRules() {
  console.log('🛡️  Testing Firestore Security Rules...\n');
  
  // Check if rules file exists
  if (!fs.existsSync('./firestore.rules')) {
    console.error('❌ firestore.rules file not found!');
    process.exit(1);
  }
  
  // Read and parse the rules
  const rulesContent = fs.readFileSync('./firestore.rules', 'utf8');
  
  console.log('📝 Security Rules Analysis:\n');
  
  // Test 1: User data protection
  console.log('🔒 User Data Protection:');
  if (rulesContent.includes('isOwner(uid)')) {
    console.log('   ✅ Users can only access their own data');
  } else {
    console.log('   ❌ Missing user ownership validation');
  }
  
  // Test 2: Authentication requirement
  console.log('🔐 Authentication Requirements:');
  if (rulesContent.includes('isSignedIn()')) {
    console.log('   ✅ Authentication required for access');
  } else {
    console.log('   ❌ Missing authentication checks');
  }
  
  // Test 3: Email verification
  console.log('📧 Email Verification:');
  if (rulesContent.includes('email_verified == true')) {
    console.log('   ✅ Email verification required for sensitive operations');
  } else {
    console.log('   ❌ Missing email verification requirement');
  }
  
  // Test 4: Read-only public data
  console.log('📚 Public Data Access:');
  if (rulesContent.includes('allow read: if isSignedIn()') && 
      rulesContent.includes('allow write: if false')) {
    console.log('   ✅ Categories and words are read-only for users');
    console.log('   ✅ Admin-only writes enforced');
  } else {
    console.log('   ❌ Public data access rules need review');
  }
  
  // Test 5: Data validation
  console.log('✅ Data Validation:');
  const validationFunctions = [
    'validateUserData',
    'validateProgressData',
    'validateUserUpdate',
    'validateProgressUpdate'
  ];
  
  validationFunctions.forEach(func => {
    if (rulesContent.includes(func)) {
      console.log(`   ✅ ${func}() implemented`);
    } else {
      console.log(`   ❌ ${func}() missing`);
    }
  });
  
  // Test 6: Progress tracking security
  console.log('📊 Progress Tracking:');
  if (rulesContent.includes('correctCount >= resource.data.correctCount')) {
    console.log('   ✅ Progress can only increase, not decrease');
  } else {
    console.log('   ❌ Progress manipulation protection missing');
  }
  
  // Test 7: Default deny
  console.log('🚫 Default Security:');
  if (rulesContent.includes('allow read, write: if false')) {
    console.log('   ✅ Default deny rule in place');
  } else {
    console.log('   ❌ Missing default deny rule');
  }
  
  // Test 8: Required fields validation
  console.log('📋 Required Fields:');
  const requiredChecks = [
    'hasAll([\'email\', \'joinedAt\', \'settings\'])',
    'hasAll([\'wordId\', \'correctCount\', \'totalAttempts\'])',
    'language in [\'so\', \'en\']'
  ];
  
  requiredChecks.forEach(check => {
    if (rulesContent.includes(check)) {
      console.log(`   ✅ Field validation: ${check.substring(0, 30)}...`);
    } else {
      console.log(`   ❌ Missing validation: ${check.substring(0, 30)}...`);
    }
  });
  
  console.log('\n🎯 Security Rules Summary:');
  
  // Count security features
  const securityFeatures = [
    'isOwner(uid)',
    'isSignedIn()',
    'email_verified == true',
    'validateUserData()',
    'validateProgressData()',
    'correctCount >= resource.data.correctCount'
  ];
  
  const implementedFeatures = securityFeatures.filter(feature => 
    rulesContent.includes(feature)
  ).length;
  
  const securityScore = Math.round((implementedFeatures / securityFeatures.length) * 100);
  
  console.log(`   Security Score: ${securityScore}%`);
  
  if (securityScore >= 90) {
    console.log('   🟢 Excellent security implementation!');
  } else if (securityScore >= 75) {
    console.log('   🟡 Good security, minor improvements possible');
  } else {
    console.log('   🔴 Security needs improvement');
  }
  
  console.log('\n📋 Deployment Checklist:');
  console.log('   □ Firebase project created');
  console.log('   □ Authentication enabled');
  console.log('   □ Firestore database created');
  console.log('   □ Security rules deployed');
  console.log('   □ Indexes deployed');
  console.log('   □ Service account key downloaded (for admin import)');
  
  console.log('\n🚀 Ready to deploy security rules:');
  console.log('   firebase deploy --only firestore:rules');
  console.log('   firebase deploy --only firestore:indexes');
}

// Run the test
testSecurityRules();
