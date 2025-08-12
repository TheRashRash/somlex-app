import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Card, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { useVocabularyStore } from '../store/vocabularyStore';
import { Category, CategoryGridProps } from '../data/types';

const { width } = Dimensions.get('window');
const cardMargin = 8;
const cardPadding = 16;
const numColumns = 2;
const cardWidth = (width - (cardPadding * 2) - (cardMargin * (numColumns + 1))) / numColumns;

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => (
  <Card 
    style={[styles.categoryCard, { width: cardWidth }]}
    onPress={() => onPress(category)}
    mode="elevated"
  >
    <Card.Content style={styles.cardContent}>
      <Text variant="headlineSmall" style={styles.icon}>
        {category.icon}
      </Text>
      <Text variant="bodyLarge" style={styles.nameSo}>
        {category.nameSo}
      </Text>
      <Text variant="bodyMedium" style={styles.nameEn}>
        {category.nameEn}
      </Text>
    </Card.Content>
  </Card>
);

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  onCategorySelect,
  categories: propCategories,
  loading: propLoading 
}) => {
  const { 
    categories: storeCategories, 
    loading: storeLoading, 
    error,
    fetchCategories,
    clearError 
  } = useVocabularyStore();

  // Use provided categories or fall back to store categories
  const categories = propCategories || storeCategories;
  const loading = propLoading !== undefined ? propLoading : storeLoading;

  useEffect(() => {
    // Only fetch if we don't have categories and none were provided
    if (!propCategories && storeCategories.length === 0 && !storeLoading) {
      fetchCategories();
    }
  }, [propCategories, storeCategories.length, storeLoading, fetchCategories]);

  const renderCategory = ({ item }: { item: Category }) => (
    <CategoryCard 
      category={item} 
      onPress={onCategorySelect} 
    />
  );

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyIcon}>📚</Text>
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        Qaybaha ma jiraan - No Categories Found
      </ThemedText>
      <ThemedText style={styles.emptyText}>
        Qaybaha ereyada ayaa la soo gelayaa
      </ThemedText>
      <ThemedText style={styles.emptyTextEn}>
        Vocabulary categories are being loaded
      </ThemedText>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <ThemedText style={styles.loadingText}>
          Qaybaha la soo rarayo... - Loading categories...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
      
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
  listContainer: {
    padding: cardPadding,
    paddingBottom: 20,
  },
  categoryCard: {
    margin: cardMargin,
    minHeight: 120,
    elevation: 3,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 12,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  nameSo: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E7D32',
    marginBottom: 4,
  },
  nameEn: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
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
  errorSnackbar: {
    backgroundColor: '#d32f2f',
  },
});
