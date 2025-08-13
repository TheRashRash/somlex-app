import VocabularyTest from '@/test/VocabularyTest';
import QuizTest from '@/test/QuizTest';
import { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Text, Card, IconButton } from 'react-native-paper';
import { AfricanGradient, AfricanPatternBackground, AfricanBorder, AfricanCard } from '@/theme/components/AfricanComponents';
import { AfricanColors, AfricanSpacing, AfricanBorderRadius, AfricanShadows } from '@/theme/africanTheme';
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
        <AfricanPatternBackground pattern="geometric" opacity={0.15}>
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
            <AfricanBorder pattern="diamonds" color={AfricanColors.background.card} />
          </View>
        </AfricanPatternBackground>
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
          <AfricanCard variant="elevated" pattern={true} style={styles.moduleCard}>
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
          </AfricanCard>

          {/* Quiz Module Card */}
          <AfricanCard variant="elevated" pattern={true} style={styles.moduleCard}>
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
          </AfricanCard>
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
    paddingBottom: AfricanSpacing.lg,
    paddingHorizontal: AfricanSpacing.lg,
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
    marginBottom: AfricanSpacing.sm,
  },
  tagline: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: AfricanSpacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  taglineEn: {
    color: AfricanColors.background.card,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: AfricanSpacing.md,
    opacity: 0.9,
  },
  
  // Content styles
  content: {
    flex: 1,
  },
  
  // Welcome section
  welcomeSection: {
    padding: AfricanSpacing.lg,
    alignItems: 'center',
  },
  welcomeTitle: {
    color: AfricanColors.primary.main,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: AfricanSpacing.sm,
  },
  welcomeText: {
    color: AfricanColors.text.primary,
    textAlign: 'center',
    marginBottom: AfricanSpacing.xs,
    fontWeight: '500',
  },
  welcomeTextEn: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Module section
  moduleSection: {
    paddingHorizontal: AfricanSpacing.lg,
    paddingBottom: AfricanSpacing.xl,
  },
  sectionTitle: {
    color: AfricanColors.secondary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: AfricanSpacing.lg,
  },
  
  // Module cards
  moduleCard: {
    marginBottom: AfricanSpacing.lg,
    borderRadius: AfricanBorderRadius.xl,
    ...AfricanShadows.lg,
  },
  moduleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AfricanSpacing.md,
  },
  moduleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AfricanColors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AfricanSpacing.md,
    ...AfricanShadows.sm,
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
    marginBottom: AfricanSpacing.xs,
  },
  moduleDescription: {
    color: AfricanColors.text.secondary,
    marginBottom: AfricanSpacing.xs,
    lineHeight: 22,
  },
  moduleDescriptionEn: {
    color: AfricanColors.text.tertiary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  moduleButton: {
    borderRadius: AfricanBorderRadius.md,
    marginTop: AfricanSpacing.sm,
  },
  
  // Cultural section
  culturalSection: {
    paddingHorizontal: AfricanSpacing.lg,
    paddingBottom: AfricanSpacing['2xl'],
  },
  culturalCard: {
    borderColor: AfricanColors.accent.coral,
    borderWidth: 2,
    borderRadius: AfricanBorderRadius.lg,
    backgroundColor: AfricanColors.background.surface,
  },
  culturalTitle: {
    color: AfricanColors.accent.coral,
    fontWeight: '600',
    marginBottom: AfricanSpacing.sm,
    textAlign: 'center',
  },
  culturalText: {
    color: AfricanColors.text.primary,
    lineHeight: 24,
    marginBottom: AfricanSpacing.sm,
    textAlign: 'center',
  },
  culturalTextEn: {
    color: AfricanColors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
});
