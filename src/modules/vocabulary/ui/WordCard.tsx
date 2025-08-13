import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card, Text, Chip, IconButton } from 'react-native-paper';
import { ThemedText } from '@/shared/ui/ThemedText';
import { Word, WordCardProps } from '../data/types';
import { useTTS } from '../utils/ttsUtils';
import { AfricanColors } from '@/theme/africanTheme';

export const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  onPress, 
  showCategory = false,
  compact = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { speakWord: ttsSpeak, stop: ttsStop, isSpeaking } = useTTS();

  const handlePress = () => {
    if (onPress) {
      onPress(word);
    } else {
      // Default behavior: flip the card
      setIsFlipped(!isFlipped);
    }
  };

  const handleFlip = (e: any) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const speakWord = async (e: any) => {
    e.stopPropagation();
    
    if (isPlaying) {
      // Stop current speech
      await ttsStop();
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    try {
      await ttsSpeak(word.wordSo, {
        onStart: () => setIsPlaying(true),
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
      });
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  };

  // Sync with global TTS state
  useEffect(() => {
    const checkTTSState = () => {
      setIsPlaying(isSpeaking());
    };
    
    const interval = setInterval(checkTTSState, 100);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const getPartOfSpeechColor = (pos?: string) => {
    switch (pos) {
      case 'noun': return '#2196F3';
      case 'verb': return '#4CAF50';
      case 'adjective': return '#FF9800';
      case 'adverb': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getPartOfSpeechLabel = (pos?: string) => {
    switch (pos) {
      case 'noun': return 'Magac - Noun';
      case 'verb': return 'Ficil - Verb';
      case 'adjective': return 'Tilmaan - Adjective';
      case 'adverb': return 'Xaalad - Adverb';
      case 'preposition': return 'Jar - Preposition';
      case 'pronoun': return 'Badalye - Pronoun';
      case 'conjunction': return 'Xiriir - Conjunction';
      default: return pos;
    }
  };

  if (compact) {
    return (
      <Card style={styles.compactCard} onPress={handlePress} mode="outlined">
        <Card.Content style={styles.compactContent}>
          <View style={styles.compactMainRow}>
            <View style={styles.compactWords}>
              <ThemedText type="defaultSemiBold" style={styles.compactSomali}>
                {word.wordSo}
              </ThemedText>
              <ThemedText style={styles.compactEnglish}>
                {word.wordEn}
              </ThemedText>
            </View>
            <IconButton
              icon={isPlaying ? "volume-high" : "volume-medium"}
              size={20}
              onPress={speakWord}
              disabled={isPlaying}
              iconColor={isPlaying ? "#2E7D32" : "#666"}
              style={styles.compactTtsButton}
            />
          </View>
          {word.partOfSpeech && (
            <Chip 
              compact 
              style={[
                styles.compactChip, 
                { backgroundColor: getPartOfSpeechColor(word.partOfSpeech) }
              ]}
              textStyle={styles.chipText}
            >
              {getPartOfSpeechLabel(word.partOfSpeech)}
            </Chip>
          )}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card} onPress={handlePress} mode="elevated">
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {!isFlipped ? (
              <View style={styles.wordContainer}>
                <ThemedText type="title" style={styles.somaliWord}>
                  {word.wordSo}
                </ThemedText>
                <Text variant="bodySmall" style={styles.language}>
                  Af-Soomaali
                </Text>
                {word.phonetic && (
                  <Text variant="bodySmall" style={styles.phoneticInline}>
                    /{word.phonetic}/
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.wordContainer}>
                <ThemedText type="title" style={styles.englishWord}>
                  {word.wordEn}
                </ThemedText>
                <Text variant="bodySmall" style={styles.language}>
                  English
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.headerButtons}>
            <IconButton
              icon={isPlaying ? "volume-high" : "volume-medium"}
              size={24}
              onPress={speakWord}
              disabled={isPlaying}
              iconColor={isPlaying ? "#2E7D32" : "#666"}
              style={styles.ttsButton}
            />
            <IconButton
              icon={isFlipped ? 'eye-off' : 'eye'}
              size={20}
              onPress={handleFlip}
              iconColor="#666"
            />
          </View>
        </View>

        {/* Part of Speech */}
        {word.partOfSpeech && (
          <Chip 
            style={[
              styles.posChip, 
              { backgroundColor: getPartOfSpeechColor(word.partOfSpeech) }
            ]}
            textStyle={styles.chipText}
          >
            {getPartOfSpeechLabel(word.partOfSpeech)}
          </Chip>
        )}


        {/* Translation (shown when flipped) */}
        {isFlipped && (
          <View style={styles.translation}>
            <ThemedText type="defaultSemiBold" style={styles.translationText}>
              {word.wordSo} → {word.wordEn}
            </ThemedText>
          </View>
        )}

        {/* Examples (if available) */}
        {word.examples && word.examples.length > 0 && (
          <View style={styles.examples}>
            <Text variant="bodySmall" style={styles.examplesTitle}>
              Tusaalooyin - Examples:
            </Text>
            {word.examples.slice(0, 1).map((example, index) => (
              <View key={index} style={styles.example}>
                <Text variant="bodySmall" style={styles.exampleSo}>
                  "{example.so}"
                </Text>
                <Text variant="bodySmall" style={styles.exampleEn}>
                  "{example.en}"
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Flip hint */}
        <Text variant="bodySmall" style={styles.flipHint}>
          Riix si aad u aragto tarjumaadda - Tap to see translation
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  wordContainer: {
    alignItems: 'flex-start',
  },
  somaliWord: {
    color: '#B8860B', // Darker gold for better contrast
    fontWeight: 'bold',
    fontSize: 24,
  },
  englishWord: {
    color: '#654321', // Dark brown for better contrast
    fontWeight: 'bold',
    fontSize: 24,
  },
  language: {
    color: '#666',
    marginTop: 4,
  },
  posChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  phonetic: {
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  translation: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  translationText: {
    textAlign: 'center',
    color: '#333',
  },
  examples: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  examplesTitle: {
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  example: {
    marginBottom: 6,
  },
  exampleSo: {
    color: '#333',
    fontStyle: 'italic',
  },
  exampleEn: {
    color: '#666',
    fontStyle: 'italic',
    fontSize: 11,
  },
  flipHint: {
    textAlign: 'center',
    color: '#999',
    marginTop: 12,
    fontSize: 10,
  },
  
  // Header button styles
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ttsButton: {
    marginRight: -8,
  },
  phoneticInline: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
    fontSize: 12,
  },
  
  // Compact styles
  compactCard: {
    marginVertical: 4,
    marginHorizontal: 16,
    elevation: 1,
  },
  compactContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  compactMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  compactWords: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactSomali: {
    color: '#2E7D32',
    fontSize: 16,
  },
  compactEnglish: {
    color: '#666',
    fontSize: 14,
  },
  compactChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  compactTtsButton: {
    marginLeft: 8,
  },
});
