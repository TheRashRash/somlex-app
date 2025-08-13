import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Text, Snackbar } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { CategoryGrid } from './CategoryGrid';
import { WordCard } from './WordCard';
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

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          📚 Qaamuuska - Vocabulary
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Ku baro ereyada Af-Soomaaliga - Learn Somali words
        </ThemedText>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Raadi erayo - Search words..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          onClearIconPress={handleClearSearch}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {showSearchResults ? (
          renderSearchResults()
        ) : (
          <>
            <View style={styles.categoriesHeader}>
              <ThemedText type="subtitle" style={styles.categoriesTitle}>
                Qaybaha Ereyada - Word Categories
              </ThemedText>
              <ThemedText style={styles.categoriesSubtitle}>
                Doorso qayb si aad u barato ereyadeeda
              </ThemedText>
              <ThemedText style={styles.categoriesSubtitleEn}>
                Choose a category to learn its words
              </ThemedText>
            </View>
            
            <CategoryGrid
              onCategorySelect={handleCategorySelect}
              loading={loading}
            />
          </>
        )}
      </View>

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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: AfricanColors.background.surface,
  },
  title: {
    color: AfricanColors.primary.main,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: AfricanColors.background.surface,
    elevation: 2,
  },
  searchbar: {
    backgroundColor: 'white',
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  categoriesHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  categoriesTitle: {
    color: '#2E7D32',
    marginBottom: 4,
  },
  categoriesSubtitle: {
    color: '#333',
    fontSize: 14,
    marginBottom: 2,
  },
  categoriesSubtitleEn: {
    color: '#666',
    fontSize: 12,
  },
  searchResultsContainer: {
    flex: 1,
  },
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchResultsTitle: {
    color: '#1976D2',
    marginBottom: 4,
  },
  searchResultsCount: {
    color: '#666',
    fontSize: 14,
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#2E7D32',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  emptyTextEn: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  errorSnackbar: {
    backgroundColor: '#d32f2f',
  },
});
