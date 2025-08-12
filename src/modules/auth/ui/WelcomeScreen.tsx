import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { ThemedView } from '@/shared/ui/ThemedView';
import { ThemedText } from '@/shared/ui/ThemedText';
import { AuthScreenProps } from '../types';

export const WelcomeScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          SOMLEX
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Baro Af-Soomaaliga - Learn Somali
        </Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>
              Soo Dhawoow! 👋
            </Text>
            <Text variant="bodyLarge" style={styles.welcomeText}>
              Ku bilow barashada ereyada Af-Soomaaliga ah si fudud oo xiiso leh
            </Text>
            <Text variant="bodyMedium" style={styles.welcomeTextEn}>
              Start learning Somali vocabulary in a fun and easy way
            </Text>

            <View style={styles.features}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📚</Text>
                <Text variant="bodyMedium">250+ erayo - 250+ words</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text variant="bodyMedium">Su'aalo macaan - Fun quizzes</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text variant="bodyMedium">Horumar la raaco - Track progress</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={[styles.button, styles.primaryButton]}
          labelStyle={styles.buttonText}
        >
          Soo Gal - Sign In
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Akoon Cusub - Sign Up
        </Button>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 16,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  welcomeTextEn: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  features: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 6,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
