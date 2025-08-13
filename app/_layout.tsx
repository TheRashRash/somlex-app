import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// African-inspired colors
const AfricanColors = {
  primary: '#D4AF37', // Golden
  secondary: '#8B4513', // Saddle brown
  background: '#FFFEF7', // Warm white
  surface: '#FAF0E6', // Linen
  text: '#2F2F2F', // Soft black
  accent: '#D2691E', // Terracotta
};

// Simplified African theme
const AfricanNavigationTheme = {
  dark: false,
  colors: {
    primary: AfricanColors.primary,
    background: AfricanColors.background,
    card: '#FFFFFF',
    text: AfricanColors.text,
    border: '#D2B48C',
    notification: '#FF7F50',
  },
};

const AfricanPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: AfricanColors.primary,
    secondary: AfricanColors.secondary,
    background: AfricanColors.background,
    surface: '#FFFFFF',
  },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={AfricanPaperTheme}>
      <ThemeProvider value={AfricanNavigationTheme}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
