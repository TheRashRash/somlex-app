import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useAuthStore, initializeAuthListener } from '@/modules/auth';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { Button } from 'react-native-paper';
import { AuthFlow } from '@/modules/auth/ui/AuthFlow';

// Placeholder for main app content when authenticated
const AuthenticatedContent = () => {
  const { logout, user } = useAuthStore();
  
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>🎉 Welcome to Somlex!</ThemedText>
      <ThemedText style={{ marginBottom: 10 }}>Email: {user?.email}</ThemedText>
      <ThemedText style={{ marginBottom: 20 }}>You are now authenticated!</ThemedText>
      <Button mode="contained" onPress={logout}>Sign Out</Button>
    </ThemedView>
  );
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
