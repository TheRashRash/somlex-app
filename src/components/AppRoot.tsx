import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { PaperProvider, Button, Card } from 'react-native-paper';
import { useAuthStore, initializeAuthListener } from '@/modules/auth';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { AuthFlow } from '@/modules/auth/ui/AuthFlow';
import { VocabularyTest } from '@/modules/vocabulary/VocabularyTest';
import { QuizTest } from '@/modules/quiz/QuizTest';
import { ProgressTest } from '@/modules/progress/ProgressTest';

// Module testing interface when authenticated
const AuthenticatedContent = () => {
  const { logout, user } = useAuthStore();
  const [currentModule, setCurrentModule] = useState<'home' | 'vocabulary' | 'quiz' | 'progress'>('home');

  const HomeScreen = () => (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 20 }}>🎉 Somlex App</ThemedText>
      <ThemedText style={{ textAlign: 'center', marginBottom: 10 }}>Welcome, {user?.email}</ThemedText>
      <ThemedText style={{ textAlign: 'center', marginBottom: 30 }}>Choose a module to test:</ThemedText>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={{ margin: 8 }}>
          <Card.Content>
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>📚 Vocabulary Module</ThemedText>
            <ThemedText style={{ marginBottom: 15 }}>Test word cards with TTS and flip animations</ThemedText>
            <Button mode="contained" onPress={() => setCurrentModule('vocabulary')}>Test Vocabulary</Button>
          </Card.Content>
        </Card>

        <Card style={{ margin: 8 }}>
          <Card.Content>
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>🎯 Quiz Module</ThemedText>
            <ThemedText style={{ marginBottom: 15 }}>Take interactive quizzes with performance analysis</ThemedText>
            <Button mode="contained" onPress={() => setCurrentModule('quiz')}>Test Quiz</Button>
          </Card.Content>
        </Card>

        <Card style={{ margin: 8 }}>
          <Card.Content>
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>📊 Progress Module</ThemedText>
            <ThemedText style={{ marginBottom: 15 }}>View stats, streaks, and track learning progress</ThemedText>
            <Button mode="contained" onPress={() => setCurrentModule('progress')}>Test Progress</Button>
          </Card.Content>
        </Card>

        <Button mode="outlined" onPress={logout} style={{ marginTop: 20 }}>Sign Out</Button>
      </ScrollView>
    </ThemedView>
  );

  // Render appropriate module or home screen
  if (currentModule === 'vocabulary') {
    return <VocabularyTest onBack={() => setCurrentModule('home')} />;
  }
  if (currentModule === 'quiz') {
    return <QuizTest onBack={() => setCurrentModule('home')} />;
  }
  if (currentModule === 'progress') {
    return (
      <ThemedView style={{ flex: 1 }}>
        <Button mode="text" onPress={() => setCurrentModule('home')} style={{ alignSelf: 'flex-start', margin: 10 }}>
          ← Back to Home
        </Button>
        <ProgressTest />
      </ThemedView>
    );
  }

  return <HomeScreen />;
};

// Loading screen component
const LoadingScreen = () => {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">SOMLEX</ThemedText>
      <ThemedText>Baro Af-Soomaaliga - Learn Somali</ThemedText>
      <ThemedText style={{ marginTop: 20 }}>Loading...</ThemedText>
    </ThemedView>
  );
};

export const AppRoot: React.FC = () => {
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase auth listener
    const unsubscribe = initializeAuthListener();
    return unsubscribe;
  }, []);

  return (
    <PaperProvider>
      {loading ? (
        <LoadingScreen />
      ) : isAuthenticated ? (
        <AuthenticatedContent />
      ) : (
        <AuthFlow />
      )}
    </PaperProvider>
  );
};
