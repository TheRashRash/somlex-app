import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Button, Text, Card, IconButton, Chip, FAB } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { WordCard } from './WordCard';
import { Word } from '../data/types';

// Fixed African color palette with proper contrast ratios
const AfricanColors = {
  primary: { main: '#B8860B', light: '#D4AF37' }, // Darker gold for better contrast
  secondary: { main: '#654321' }, // Dark brown
  background: { primary: '#FFFEF7', card: '#FFFFFF', surface: '#FAF0E6' },
  text: { 
    primary: '#2F2F2F', // Dark text for light backgrounds
    secondary: '#4A4A4A', // Medium dark for secondary text
    tertiary: '#666666', // Lighter gray for subtle text
    inverse: '#FFFFFF', // White for dark backgrounds
    onPrimary: '#FFFFFF', // White text on primary colors
    onSecondary: '#FFFFFF' // White text on secondary colors
  },
  accent: { coral: '#D2691E', terracotta: '#B8860B' }, // Better contrast versions
};

// Expanded Somali vocabulary organized by categories
const vocabularyData: { [category: string]: Word[] } = {
  greetings: [
    {
      id: '1',
      categoryId: 'greetings',
      wordSo: 'Salaan',
      wordEn: 'Hello',
      partOfSpeech: 'noun',
      phonetic: 'sa-la-an',
      examples: [{ so: 'Salaan wanaagsan', en: 'Good greeting' }],
      difficulty: 'beginner',
    },
    {
      id: '2',
      categoryId: 'greetings',
      wordSo: 'Nabadgelyo',
      wordEn: 'Goodbye',
      partOfSpeech: 'noun',
      phonetic: 'na-bad-gel-yo',
      examples: [{ so: 'Nabadgelyo walaalo', en: 'Goodbye brothers' }],
      difficulty: 'beginner',
    },
    {
      id: '3',
      categoryId: 'greetings',
      wordSo: 'Mahadsanid',
      wordEn: 'Thank you',
      partOfSpeech: 'noun',
      phonetic: 'ma-had-sa-nid',
      examples: [{ so: 'Mahadsanid walaal', en: 'Thank you brother' }],
      difficulty: 'beginner',
    },
  ],
  family: [
    {
      id: '4',
      categoryId: 'family',
      wordSo: 'Hooyo',
      wordEn: 'Mother',
      partOfSpeech: 'noun',
      phonetic: 'hoo-yo',
      examples: [{ so: 'Hooyada ayaa la jeclahay', en: 'Mother is loved' }],
      difficulty: 'beginner',
    },
    {
      id: '5',
      categoryId: 'family',
      wordSo: 'Aabo',
      wordEn: 'Father',
      partOfSpeech: 'noun',
      phonetic: 'aa-bo',
      examples: [{ so: 'Aabaha waa nin wanaagsan', en: 'Father is a good man' }],
      difficulty: 'beginner',
    },
    {
      id: '6',
      categoryId: 'family',
      wordSo: 'Walaal',
      wordEn: 'Sibling',
      partOfSpeech: 'noun',
      phonetic: 'wa-la-al',
      examples: [{ so: 'Walaalkay waa wiil fiican', en: 'My brother is a good boy' }],
      difficulty: 'beginner',
    },
  ],
  numbers: [
    {
      id: '7',
      categoryId: 'numbers',
      wordSo: 'Hal',
      wordEn: 'One',
      partOfSpeech: 'noun',
      phonetic: 'hal',
      examples: [{ so: 'Hal qof ayaa yimid', en: 'One person came' }],
      difficulty: 'beginner',
    },
    {
      id: '8',
      categoryId: 'numbers',
      wordSo: 'Laba',
      wordEn: 'Two',
      partOfSpeech: 'noun',
      phonetic: 'la-ba',
      examples: [{ so: 'Laba buug ayaan hayaa', en: 'I have two books' }],
      difficulty: 'beginner',
    },
    {
      id: '9',
      categoryId: 'numbers',
      wordSo: 'Sadex',
      wordEn: 'Three',
      partOfSpeech: 'noun',
      phonetic: 'sa-dex',
      examples: [{ so: 'Sadex shalay ayaan cunay', en: 'I ate three yesterday' }],
      difficulty: 'beginner',
    },
  ],
  colors: [
    {
      id: '10',
      categoryId: 'colors',
      wordSo: 'Cas',
      wordEn: 'Red',
      partOfSpeech: 'adjective',
      phonetic: 'cas',
      examples: [{ so: 'Tufaax cas', en: 'Red apple' }],
      difficulty: 'beginner',
    },
    {
      id: '11',
      categoryId: 'colors',
      wordSo: 'Cagaar',
      wordEn: 'Green',
      partOfSpeech: 'adjective',
      phonetic: 'ca-ga-ar',
      examples: [{ so: 'Dhir cagaar ah', en: 'Green plant' }],
      difficulty: 'beginner',
    },
    {
      id: '12',
      categoryId: 'colors',
      wordSo: 'Buluug',
      wordEn: 'Blue',
      partOfSpeech: 'adjective',
      phonetic: 'bu-lu-ug',
      examples: [{ so: 'Samada buluug ah', en: 'Blue sky' }],
      difficulty: 'beginner',
    },
  ],
};

const categories = [
  { id: 'greetings', nameSo: 'Salaamada', nameEn: 'Greetings', icon: '👋', color: '#4CAF50' },
  { id: 'family', nameSo: 'Qoyska', nameEn: 'Family', icon: '👨‍👩‍👧‍👦', color: '#FF9800' },
  { id: 'numbers', nameSo: 'Tirooyinka', nameEn: 'Numbers', icon: '🔢', color: '#2196F3' },
  { id: 'colors', nameSo: 'Midabada', nameEn: 'Colors', icon: '🎨', color: '#9C27B0' },
];

interface VocabularyLearningScreenProps {
  onBack?: () => void;
}

export const VocabularyLearningScreen: React.FC<VocabularyLearningScreenProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'categories' | 'learning'>('categories');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentWordIndex(0);
    setViewMode('learning');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setViewMode('categories');
    setCurrentWordIndex(0);
  };

  const handleWordLearned = (wordId: string) => {
    setLearnedWords(prev => new Set([...prev, wordId]));
    
    const currentWords = selectedCategory ? vocabularyData[selectedCategory] : [];
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Category completed
      Alert.alert(
        'Hambalyo! - Congratulations! 🎉',
        `Waxaad dhamaysay qaybta "${categories.find(c => c.id === selectedCategory)?.nameSo}" - You completed the "${categories.find(c => c.id === selectedCategory)?.nameEn}" category!`,
        [
          { 
            text: 'Sii wad - Continue', 
            onPress: () => {
              setCurrentWordIndex(0);
              setLearnedWords(new Set());
            }
          },
          { text: 'Dib u noqo - Go Back', onPress: handleBackToCategories }
        ]
      );
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const handleNextWord = () => {
    const currentWords = selectedCategory ? vocabularyData[selectedCategory] : [];
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  // Categories view
  if (viewMode === 'categories') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Beautiful African header */}
        <LinearGradient
          colors={[AfricanColors.primary.light, AfricanColors.primary.main, AfricanColors.secondary.main]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {onBack && (
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={onBack}
                iconColor={AfricanColors.text.inverse}
                style={styles.backButton}
              />
            )}
            <Text variant="displaySmall" style={styles.title}>
              📚 Qaamuuska
            </Text>
            <Text variant="titleMedium" style={styles.subtitle}>
              Baro Ereyada - Learn Vocabulary
            </Text>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.content}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Qaybaha Ereyada - Word Categories
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Doorso qayb si aad u barato ereyadeeda - Choose a category to learn its words
          </Text>

          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const wordsCount = vocabularyData[category.id]?.length || 0;
              const learnedCount = vocabularyData[category.id]?.filter(word => 
                learnedWords.has(word.id)
              ).length || 0;

              return (
                <Card
                  key={category.id}
                  style={[styles.categoryCard, { borderLeftColor: category.color }]}
                  mode="elevated"
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <Card.Content style={styles.categoryContent}>
                    <View style={styles.categoryHeader}>
                      <Text style={[styles.categoryIcon, { color: category.color }]}>
                        {category.icon}
                      </Text>
                      <View style={styles.categoryProgress}>
                        <Text variant="bodySmall" style={styles.progressText}>
                          {learnedCount}/{wordsCount}
                        </Text>
                      </View>
                    </View>
                    <Text variant="titleMedium" style={styles.categoryTitle}>
                      {category.nameSo}
                    </Text>
                    <Text variant="bodyMedium" style={styles.categorySubtitle}>
                      {category.nameEn} • {wordsCount} erayo
                    </Text>
                    
                    {learnedCount > 0 && (
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { 
                              width: `${(learnedCount / wordsCount) * 100}%`,
                              backgroundColor: category.color 
                            }
                          ]} 
                        />
                      </View>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </View>

          {/* Learning Tips */}
          <Card style={styles.tipsCard} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.tipsTitle}>
                💡 Tilmaamaha Barashada - Learning Tips
              </Text>
              <View style={styles.tip}>
                <Text style={styles.tipIcon}>🔊</Text>
                <Text variant="bodyMedium">Dhegayso codka ereyga - Listen to word pronunciation</Text>
              </View>
              <View style={styles.tip}>
                <Text style={styles.tipIcon}>🔄</Text>
                <Text variant="bodyMedium">Riix kaararka si aad u aragto tarjumaadda - Tap cards to see translation</Text>
              </View>
              <View style={styles.tip}>
                <Text style={styles.tipIcon}>📝</Text>
                <Text variant="bodyMedium">Ku celceli ereyada - Practice words repeatedly</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    );
  }

  // Learning view
  const currentWords = selectedCategory ? vocabularyData[selectedCategory] : [];
  const currentWord = currentWords[currentWordIndex];
  const currentCategory = categories.find(c => c.id === selectedCategory);

  if (!currentWord || !currentCategory) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineSmall">Khalad ayaa dhacay - Error occurred</Text>
        <Button onPress={handleBackToCategories} style={styles.backButton}>
          Dib u noqo - Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Learning Header */}
      <LinearGradient
        colors={[AfricanColors.primary.light, AfricanColors.primary.main]}
        style={styles.learningHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.learningHeaderContent}>
          <View style={styles.learningHeaderTop}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={handleBackToCategories}
              iconColor={AfricanColors.text.inverse}
            />
            <Text variant="titleMedium" style={styles.learningTitle}>
              {currentCategory.nameSo} - {currentCategory.nameEn}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <Text variant="bodyMedium" style={styles.progressText}>
            Eray {currentWordIndex + 1} / {currentWords.length} - Word {currentWordIndex + 1} of {currentWords.length}
          </Text>
          
          <View style={styles.progressIndicator}>
            <View 
              style={[
                styles.progressIndicatorFill, 
                { width: `${((currentWordIndex + 1) / currentWords.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>

      {/* Word Card */}
      <ScrollView style={styles.learningContent} showsVerticalScrollIndicator={false}>
        <WordCard
          word={currentWord}
          onPress={() => {}}
          compact={false}
        />

        {/* Learning Controls */}
        <View style={styles.learningControls}>
          <Button
            mode="contained"
            onPress={() => handleWordLearned(currentWord.id)}
            style={styles.learnedButton}
            buttonColor={AfricanColors.accent.terracotta}
            textColor={AfricanColors.text.inverse}
            icon="check"
          >
            Waan bartay - I Learned It
          </Button>

          <View style={styles.navigationControls}>
            <Button
              mode="outlined"
              onPress={handlePreviousWord}
              disabled={currentWordIndex === 0}
              style={styles.navButton}
              icon="chevron-left"
            >
              Hore - Previous
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleNextWord}
              disabled={currentWordIndex === currentWords.length - 1}
              style={styles.navButton}
              icon="chevron-right"
            >
              Xiga - Next
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AfricanColors.background.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Categories view styles
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 200,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: -20,
    left: -8,
  },
  title: {
    color: AfricanColors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  content: {
    padding: 24,
  },
  sectionTitle: {
    color: AfricanColors.secondary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  
  categoriesGrid: {
    marginBottom: 24,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryContent: {
    padding: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryProgress: {
    backgroundColor: AfricanColors.background.surface,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryTitle: {
    color: AfricanColors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  categorySubtitle: {
    color: AfricanColors.text.secondary,
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: AfricanColors.background.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    color: AfricanColors.text.tertiary,
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Tips section
  tipsCard: {
    borderColor: AfricanColors.accent.coral,
    borderWidth: 1,
    borderRadius: 16,
  },
  tipsTitle: {
    color: AfricanColors.accent.coral,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  
  // Learning view styles
  learningHeader: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  learningHeaderContent: {
    alignItems: 'center',
  },
  learningHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  learningTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressIndicator: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginTop: 12,
  },
  progressIndicatorFill: {
    height: '100%',
    backgroundColor: AfricanColors.background.card,
    borderRadius: 3,
  },
  
  learningContent: {
    flex: 1,
    padding: 16,
  },
  learningControls: {
    marginTop: 24,
    alignItems: 'center',
  },
  learnedButton: {
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 24,
    minWidth: 200,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  navButton: {
    flex: 0.45,
    borderRadius: 8,
  },
});

export default VocabularyLearningScreen;
