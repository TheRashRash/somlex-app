import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { AppRoot } from './components/AppRoot';

export default function App() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return <AppRoot />;
}
