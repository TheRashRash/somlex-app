import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Searchbar, Text, FAB, Snackbar, SegmentedButtons, IconButton } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { WordCard } from './WordCard';
import { useVocabularyActions } from '../store/vocabularyStore';
import { Word, Category } from '../data/types';
import { RouteProp } from '@react-navigation/native';
import { VocabularyStackParamList } from '../navigation/VocabularyNavigator';

type WordListScreenRouteProp = RouteProp<VocabularyStackParamList, 'WordList'>;

interface WordListScreenProps {
  route: WordListScreenRouteProp;
  navigation: any;
}

export const WordListScreen: React.FC<WordListScreenProps> = ({ 
  navigation, 
  route
}) => {
  const {
    words,
    selectedCategory,
    searchResults,
    loading,
    error,
    fetchWordsByCategory,
    searchWords,
    clearSearch,
    clearError
  } = useVocabularyActions();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'compact'>('card');
  const [refreshing, setRefreshing] = useState(false);

  // Get category info from route params
  const { category } = route.params;
  const categoryId = category.id;
  const categoryName = `${category.nameSo} - ${category.nameEn}`;

  useEffect(() => {
    if (categoryId) {
      fetchWordsByCategory(categoryId);
    }
  }, [categoryId, fetchWordsByCategory]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      await searchWords(query);
    } else {
      clearSearch();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (categoryId) {
      await fetchWordsByCategory(categoryId);
    }
    setRefreshing(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  };

  const handleWordPress = (word: Word) => {
    // TODO: Navigate to word detail screen or open quiz
    console.log('Word pressed:', word);
  };

  // Determine which words to display
  const displayWords = searchQuery.trim() ? searchResults : words;

  const renderWord = ({ item }: { item: Word }) => (
    <WordCard
      word={item}
      onPress={handleWordPress}
      compact={viewMode === 'compact'}
      showCategory={!!searchQuery}
    />
  );

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      {searchQuery.trim() ? (
        <>
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
        </>
      ) : (
        <>
          <Text variant="headlineSmall" style={styles.emptyIcon}>📚</Text>
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            Erayo ma jiraan - No Words Available
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Qaybtani erayo ma leh hadda
          </ThemedText>
          <ThemedText style={styles.emptyTextEn}>
            This category doesn't have words yet
          </ThemedText>
        </>
      )}
    </ThemedView>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Category Title */}
      {categoryName && !searchQuery && (
        <View style={styles.categoryHeader}>
          <ThemedText type="title" style={styles.categoryTitle}>
            {categoryName}
          </ThemedText>
          <ThemedText style={styles.wordCount}>
            {words.length} erayo - {words.length} words
          </ThemedText>
        </View>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <View style={styles.searchHeader}>
          <ThemedText type="subtitle" style={styles.searchTitle}>
            Natiijooyinka "{searchQuery}"
          </ThemedText>
          <ThemedText style={styles.searchCount}>
            {searchResults.length} natiijooyiin - {searchResults.length} results
          </ThemedText>
        </View>
      )}

      {/* View Mode Toggle */}
      {displayWords.length > 0 && (
        <View style={styles.controls}>
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode as any}
            buttons={[
              { value: 'card', label: 'Kard - Cards', icon: 'card-outline' },
              { value: 'compact', label: 'Kooban - Compact', icon: 'view-list' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Raadi erayo - Search words..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
        />
        {searchQuery && (
          <IconButton
            icon="close"
            size={20}
            onPress={handleClearSearch}
            style={styles.clearButton}
          />
        )}
      </View>

      {/* Word List */}
      <FlatList
        data={displayWords}
        renderItem={renderWord}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2E7D32']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Action Button */}
      {displayWords.length > 0 && (
        <FAB
          icon="school"
          label="Bilow Imtixaanka - Start Quiz"
          style={styles.fab}
          onPress={() => {
            // TODO: Navigate to quiz with current words
            console.log('Start quiz with words:', displayWords);
          }}
        />
      )}

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  searchbar: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchInput: {
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  categoryHeader: {
    marginBottom: 16,
  },
  categoryTitle: {
    color: '#2E7D32',
    marginBottom: 4,
  },
  wordCount: {
    color: '#666',
    fontSize: 14,
  },
  searchHeader: {
    marginBottom: 16,
  },
  searchTitle: {
    color: '#1976D2',
    marginBottom: 4,
  },
  searchCount: {
    color: '#666',
    fontSize: 14,
  },
  controls: {
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: 'white',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
  errorSnackbar: {
    backgroundColor: '#d32f2f',
  },
});
