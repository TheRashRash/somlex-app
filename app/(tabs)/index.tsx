import VocabularyTest from '@/test/VocabularyTest';
import QuizTest from '@/test/QuizTest';
import { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Text, Card, IconButton } from 'react-native-paper';
// Using inline African colors for now
const AfricanColors = {
  primary: { main: '#D4AF37', light: '#F4D03F' },
  secondary: { main: '#8B4513' },
  background: { primary: '#FFFEF7', card: '#FFFFFF', surface: '#FAF0E6' },
  text: { primary: '#2F2F2F', secondary: '#654321', tertiary: '#8B7355', inverse: '#FFFEF7' },
  accent: { coral: '#FF7F50', terracotta: '#D2691E' },
};
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [testMode, setTestMode] = useState<'menu' | 'vocabulary' | 'quiz'>('menu');

  if (testMode === 'vocabulary') {
    return <VocabularyTest />;
  }

  if (testMode === 'quiz') {
    return <QuizTest />;
  }

  return (
    <View style={styles.container}>
      {/* Beautiful African gradient header */}
      <LinearGradient
        colors={[AfricanColors.primary.light, AfricanColors.primary.main, AfricanColors.secondary.main]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text variant="displaySmall" style={styles.appName}>
            SOMLEX
          </Text>
          <Text variant="titleMedium" style={styles.tagline}>
            🌍 Baro Af-Soomaaliga
          </Text>
          <Text variant="bodyMedium" style={styles.taglineEn}>
            Learn Somali with African Beauty
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text variant="headlineSmall" style={styles.welcomeTitle}>
            Soo dhaweyn - Welcome! 🎉
          </Text>
          <Text variant="bodyLarge" style={styles.welcomeText}>
            Ku bilow safarkaaga barashada Af-Soomaaliga
          </Text>
          <Text variant="bodyMedium" style={styles.welcomeTextEn}>
            Start your journey learning the Somali language
          </Text>
        </View>

        {/* Module Cards */}
        <View style={styles.moduleSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Qaybaha Barashada - Learning Modules
          </Text>
          
          {/* Vocabulary Module Card */}
          <Card style={styles.moduleCard} mode="elevated">
            <Card.Content>
              <View style={styles.moduleCardContent}>
                <View style={styles.moduleIcon}>
                  <Text style={styles.moduleEmoji}>📚</Text>
                </View>
                <View style={styles.moduleInfo}>
                  <Text variant="titleMedium" style={styles.moduleTitle}>
                    Qaamuuska - Vocabulary
                  </Text>
                  <Text variant="bodyMedium" style={styles.moduleDescription}>
                    Ku baro ereyada Af-Soomaaliga oo dhegayso codka saxda ah
                  </Text>
                  <Text variant="bodySmall" style={styles.moduleDescriptionEn}>
                    Learn Somali words with authentic pronunciation
                  </Text>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => setTestMode('vocabulary')}
                style={styles.moduleButton}
                buttonColor={AfricanColors.secondary.main}
                textColor={AfricanColors.text.inverse}
              >
                Bilow - Start Learning
              </Button>
            </Card.Content>
          </Card>

          {/* Quiz Module Card */}
          <Card style={styles.moduleCard} mode="elevated">
            <Card.Content>
              <View style={styles.moduleCardContent}>
                <View style={styles.moduleIcon}>
                  <Text style={styles.moduleEmoji}>🧠</Text>
                </View>
                <View style={styles.moduleInfo}>
                  <Text variant="titleMedium" style={styles.moduleTitle}>
                    Imtixaanka - Quiz Engine
                  </Text>
                  <Text variant="bodyMedium" style={styles.moduleDescription}>
                    Tijaabi aqoontaada oo aragoo sida aad u horumareyso
                  </Text>
                  <Text variant="bodySmall" style={styles.moduleDescriptionEn}>
                    Test your knowledge and see your progress
                  </Text>
                </View>
              </View>
              <Button
                mode="contained"
                onPress={() => setTestMode('quiz')}
                style={styles.moduleButton}
                buttonColor={AfricanColors.accent.terracotta}
                textColor={AfricanColors.text.inverse}
              >
                Imtixaan qaado - Take Quiz
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Cultural Note */}
        <View style={styles.culturalSection}>
          <Card style={styles.culturalCard} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.culturalTitle}>
                🌟 Dhaqanka Soomaaliyeed - Somali Culture
              </Text>
              <Text variant="bodyMedium" style={styles.culturalText}>
                Afka Soomaaliga waa mid ka mid ah afafka ugu muhiimsan Geeska Afrika. 
                Barashada luqaddu waxay kuu furayaa albaabka dhaqanka iyo taariikhda qani ah.
              </Text>
              <Text variant="bodySmall" style={styles.culturalTextEn}>
                Somali is one of the most important languages in the Horn of Africa. 
                Learning the language opens doors to rich culture and history.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AfricanColors.background.primary,
  },
  
  // Header styles
  header: {
    paddingTop: 60, // Account for status bar
    paddingBottom: 24,
    paddingHorizontal: 24,
    minHeight: 200,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  appName: {
    color: AfricanColors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  taglineEn: {
    color: AfricanColors.background.card,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
    opacity: 0.9,
  },
  
  // Content styles
  content: {
    flex: 1,
  },
  
  // Welcome section
  welcomeSection: {
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    color: AfricanColors.primary.main,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeText: {
    color: AfricanColors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  welcomeTextEn: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Module section
  moduleSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: AfricanColors.secondary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  // Module cards
  moduleCard: {
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  moduleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AfricanColors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  moduleEmoji: {
    fontSize: 28,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    color: AfricanColors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  moduleDescription: {
    color: AfricanColors.text.secondary,
    marginBottom: 4,
    lineHeight: 22,
  },
  moduleDescriptionEn: {
    color: AfricanColors.text.tertiary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  moduleButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  
  // Cultural section
  culturalSection: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  culturalCard: {
    borderColor: AfricanColors.accent.coral,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: AfricanColors.background.surface,
  },
  culturalTitle: {
    color: AfricanColors.accent.coral,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  culturalText: {
    color: AfricanColors.text.primary,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  culturalTextEn: {
    color: AfricanColors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
});
