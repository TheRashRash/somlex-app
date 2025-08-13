import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Text, Snackbar, Button, Card, IconButton, FAB } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { CategoryGrid } from './CategoryGrid';
import { WordCard } from './WordCard';
import { VocabularyLearningScreen } from './VocabularyLearningScreen';
import { TwoPlayerGameScreen } from './TwoPlayerGameScreen';
import { useVocabularyActions } from '../store/vocabularyStore';
import { Category, Word, VocabularyScreenProps } from '../data/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { VocabularyStackParamList } from '../navigation/VocabularyNavigator';
import { AfricanColors, AfricanSpacing } from '@/theme/africanTheme';
import { AfricanPatternBackground, AfricanBorder } from '@/theme/components/AfricanComponents';
import { LinearGradient } from 'expo-linear-gradient';

type VocabularyScreenNavigationProp = StackNavigationProp<VocabularyStackParamList, 'VocabularyHome'>;

export const VocabularyScreen: React.FC<VocabularyScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'learning' | 'game'>('home');
  
  const {
    categories,
    searchResults,
    loading,
    error,
    performSearch,
    selectCategoryAndFetchWords,
    clearSearch,
    clearError
  } = useVocabularyActions();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      await performSearch(query);
      setShowSearchResults(true);
    } else {
      clearSearch();
      setShowSearchResults(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
    setShowSearchResults(false);
  };

  const handleCategorySelect = async (category: Category) => {
    // If we have search active, clear it first
    if (showSearchResults) {
      handleClearSearch();
    }
    
    // Navigate to word list for this category
    (navigation as VocabularyScreenNavigationProp).navigate('WordList', { category });
  };

  const handleWordPress = (word: Word) => {
    // TODO: Navigate to word detail or quiz
    console.log('Selected word:', word);
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <ThemedView style={styles.emptySearchContainer}>
          <Text variant="headlineSmall" style={styles.emptyIcon}>🔍</Text>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            Lama helin natiijooyiin - No Results Found
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Raadi eray kale ama hubso qoraalka
          </ThemedText>
          <ThemedText style={styles.emptyTextEn}>
            Try a different word or check spelling
          </ThemedText>
        </ThemedView>
      );
    }

    return (
      <View style={styles.searchResultsContainer}>
        <View style={styles.searchResultsHeader}>
          <ThemedText type="subtitle" style={styles.searchResultsTitle}>
            Natiijooyinka "{searchQuery}"
          </ThemedText>
          <ThemedText style={styles.searchResultsCount}>
            {searchResults.length} natiijooyiin - {searchResults.length} results
          </ThemedText>
        </View>
        
        {searchResults.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onPress={handleWordPress}
            compact={true}
            showCategory={true}
          />
        ))}
      </View>
    );
  };

  // Render different views based on current state
  if (currentView === 'learning') {
    return <VocabularyLearningScreen onBack={() => setCurrentView('home')} />;
  }
  
  if (currentView === 'game') {
    return <TwoPlayerGameScreen onBack={() => setCurrentView('home')} />;
  }

  return (
    <ThemedView style={styles.container}>
      {/* Beautiful African header */}
      <LinearGradient
        colors={[AfricanColors.primary.light, AfricanColors.primary.main, AfricanColors.secondary.main]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text variant="displaySmall" style={styles.mainTitle}>
            📚 Qaamuuska
          </Text>
          <Text variant="titleMedium" style={styles.mainSubtitle}>
            Baro Ereyada Af-Soomaaliga - Learn Somali Vocabulary
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Action Cards */}
        <View style={styles.actionCardsSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            🚀 Hawlaha Degdegga - Quick Actions
          </Text>
          
          <View style={styles.actionCards}>
            {/* Learning Mode Card */}
            <Card style={styles.actionCard} mode="elevated" onPress={() => setCurrentView('learning')}>
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.actionCardGradient}
              >
                <Card.Content style={styles.actionCardContent}>
                  <Text style={styles.actionCardIcon}>📖</Text>
                  <Text variant="titleMedium" style={styles.actionCardTitle}>
                    Barasho - Learning
                  </Text>
                  <Text variant="bodyMedium" style={styles.actionCardDescription}>
                    Baro ereyada cusub qaybabaysan - Learn new words by category
                  </Text>
                </Card.Content>
              </LinearGradient>
            </Card>

            {/* Two Player Game Card */}
            <Card style={styles.actionCard} mode="elevated" onPress={() => setCurrentView('game')}>
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.actionCardGradient}
              >
                <Card.Content style={styles.actionCardContent}>
                  <Text style={styles.actionCardIcon}>🎮</Text>
                  <Text variant="titleMedium" style={styles.actionCardTitle}>
                    Ciyaar Laba Qof - 2-Player Game
                  </Text>
                  <Text variant="bodyMedium" style={styles.actionCardDescription}>
                    Tartam saaxiibkaaga - Compete with your friend
                  </Text>
                </Card.Content>
              </LinearGradient>
            </Card>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            🔍 Raadi Erayo - Search Words
          </Text>
          
          <Searchbar
            placeholder="Raadi erayo - Search words..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.modernSearchbar}
            inputStyle={styles.searchInput}
            onClearIconPress={handleClearSearch}
          />
          
          {showSearchResults && (
            <View style={styles.searchResultsWrapper}>
              {renderSearchResults()}
            </View>
          )}
        </View>

        {/* Categories Section - Only show if not searching */}
        {!showSearchResults && (
          <View style={styles.categoriesSection}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              📚 Qaybaha Ereyada - Word Categories
            </Text>
            <Text variant="bodyMedium" style={styles.sectionDescription}>
              Doorso qayb si aad u aragto ereyadeeda - Choose a category to browse words
            </Text>
            
            <CategoryGrid
              onCategorySelect={handleCategorySelect}
              loading={loading}
            />
          </View>
        )}

        {/* Tips Section */}
        <Card style={styles.tipsSection} mode="outlined">
          <Card.Content>
            <Text variant="titleMedium" style={styles.tipsTitle}>
              💡 Tilmaamaha - Learning Tips
            </Text>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🎯</Text>
              <Text variant="bodyMedium">
                Bilow qaybaha fudud sida "Salaamada" - Start with easy categories like "Greetings"
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🔊</Text>
              <Text variant="bodyMedium">
                Dhegayso codka ereyga si aad u barato lafudhka - Listen to pronunciation to learn correctly
              </Text>
            </View>
            
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>🏆</Text>
              <Text variant="bodyMedium">
                Ciyaar saaxiibkaaga si aad u kobato - Play with friends to improve faster
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Error Snackbar */}
      <Snackbar
        visible={!!error}
        onDismiss={clearError}
        duration={5000}
        style={styles.errorSnackbar}
      >
        {error}
      </Snackbar>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AfricanColors.background.primary,
  },
  
  // New Header Styles
  gradientHeader: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 180,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  mainTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mainSubtitle: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  
  // Section Styles
  sectionTitle: {
    color: AfricanColors.secondary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionDescription: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  
  // Action Cards
  actionCardsSection: {
    padding: 24,
  },
  actionCards: {
    gap: 16,
  },
  actionCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  actionCardGradient: {
    padding: 0,
  },
  actionCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  actionCardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  actionCardTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionCardDescription: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  
  // Search Section
  searchSection: {
    padding: 24,
    paddingTop: 0,
  },
  modernSearchbar: {
    backgroundColor: AfricanColors.background.card,
    elevation: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    fontSize: 16,
    color: AfricanColors.text.primary,
  },
  searchResultsWrapper: {
    marginTop: 16,
  },
  
  // Categories Section
  categoriesSection: {
    padding: 24,
    paddingTop: 0,
  },
  
  // Tips Section
  tipsSection: {
    margin: 24,
    marginTop: 0,
    borderColor: AfricanColors.accent.coral,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: AfricanColors.background.card,
  },
  tipsTitle: {
    color: AfricanColors.accent.coral,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  
  // Legacy styles (keeping for search results)
  searchResultsContainer: {
    backgroundColor: AfricanColors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: AfricanColors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: AfricanColors.accent.coral,
  },
  searchResultsTitle: {
    color: AfricanColors.primary.main,
    marginBottom: 4,
    fontWeight: '600',
  },
  searchResultsCount: {
    color: AfricanColors.text.secondary,
    fontSize: 14,
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: AfricanColors.background.card,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    color: AfricanColors.text.secondary,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: AfricanColors.primary.main,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 4,
    color: AfricanColors.text.primary,
  },
  emptyTextEn: {
    textAlign: 'center',
    color: AfricanColors.text.secondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  errorSnackbar: {
    backgroundColor: AfricanColors.accent.red || '#d32f2f',
  },
});
