import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AfricanColors } from '@/theme/africanTheme';
import { StatusBar } from 'expo-status-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// African-themed navigation theme
const AfricanNavigationTheme = {
  dark: false,
  colors: {
    primary: AfricanColors.primary.main,
    background: AfricanColors.background.primary,
    card: AfricanColors.background.card,
    text: AfricanColors.text.primary,
    border: AfricanColors.neutral.mediumGray,
    notification: AfricanColors.accent.coral,
  },
};

// African-themed Paper theme
const AfricanPaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: AfricanColors.primary.main,
    primaryContainer: AfricanColors.primary.light,
    secondary: AfricanColors.secondary.main,
    secondaryContainer: AfricanColors.secondary.light,
    tertiary: AfricanColors.accent.terracotta,
    tertiaryContainer: AfricanColors.accent.coral,
    surface: AfricanColors.background.card,
    surfaceVariant: AfricanColors.background.surface,
    background: AfricanColors.background.primary,
    error: AfricanColors.semantic.error,
    errorContainer: '#FFEBEE',
    onPrimary: AfricanColors.text.inverse,
    onSecondary: AfricanColors.text.inverse,
    onTertiary: AfricanColors.text.inverse,
    onSurface: AfricanColors.text.primary,
    onSurfaceVariant: AfricanColors.text.secondary,
    onBackground: AfricanColors.text.primary,
    onError: AfricanColors.text.inverse,
    outline: AfricanColors.neutral.darkGray,
    outlineVariant: AfricanColors.neutral.mediumGray,
    inverseSurface: AfricanColors.text.primary,
    inverseOnSurface: AfricanColors.text.inverse,
    inversePrimary: AfricanColors.primary.light,
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(47, 47, 47, 0.4)',
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Add more fonts for better African typography when available
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={AfricanPaperTheme}>
      <ThemeProvider value={AfricanNavigationTheme}>
        <StatusBar style="dark" backgroundColor={AfricanColors.background.primary} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
