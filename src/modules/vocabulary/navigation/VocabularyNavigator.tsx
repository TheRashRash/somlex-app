import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { VocabularyScreen } from '../ui/VocabularyScreen';
import { WordListScreen } from '../ui/WordListScreen';
import { useVocabularyActions } from '../store/vocabularyStore';
import { Category, Word } from '../data/types';

export type VocabularyStackParamList = {
  VocabularyHome: undefined;
  WordList: { category: Category };
  WordDetail: { word: Word };
};

const Stack = createStackNavigator<VocabularyStackParamList>();

export const VocabularyNavigator: React.FC = () => {
  const { fetchCategories } = useVocabularyActions();

  useEffect(() => {
    // Load categories when the navigator mounts
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Stack.Navigator
      initialRouteName="VocabularyHome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="VocabularyHome"
        component={VocabularyScreen}
        options={{
          title: '📚 Qaamuuska - Vocabulary',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="WordList"
        component={WordListScreen}
        options={({ route }) => ({
          title: `${route.params.category.nameSo} - ${route.params.category.nameEn}`,
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default VocabularyNavigator;
