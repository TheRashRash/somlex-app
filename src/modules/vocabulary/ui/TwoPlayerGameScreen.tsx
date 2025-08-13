import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Animated, Vibration } from 'react-native';
import { Button, Text, Card, IconButton, Avatar, Surface, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Word } from '../data/types';

// African color palette
const AfricanColors = {
  primary: { main: '#B8860B', light: '#D4AF37', dark: '#8B6914' },
  secondary: { main: '#654321', light: '#8D6E63' },
  background: { primary: '#FFFEF7', card: '#FFFFFF', surface: '#FAF0E6' },
  text: { 
    primary: '#2F2F2F', 
    secondary: '#4A4A4A', 
    inverse: '#FFFFFF',
    onPrimary: '#FFFFFF'
  },
  accent: { coral: '#D2691E', terracotta: '#B8860B', green: '#4CAF50', red: '#F44336' },
  player: { one: '#4CAF50', two: '#2196F3' }, // Green vs Blue
};

// Game vocabulary - mix of all categories for variety
const gameVocabulary: Word[] = [
  // Greetings
  {
    id: '1', categoryId: 'greetings', wordSo: 'Salaan', wordEn: 'Hello', 
    partOfSpeech: 'noun', phonetic: 'sa-la-an', difficulty: 'beginner',
    examples: [{ so: 'Salaan wanaagsan', en: 'Good greeting' }]
  },
  {
    id: '2', categoryId: 'greetings', wordSo: 'Nabadgelyo', wordEn: 'Goodbye', 
    partOfSpeech: 'noun', phonetic: 'na-bad-gel-yo', difficulty: 'beginner',
    examples: [{ so: 'Nabadgelyo walaalo', en: 'Goodbye brothers' }]
  },
  {
    id: '3', categoryId: 'greetings', wordSo: 'Mahadsanid', wordEn: 'Thank you', 
    partOfSpeech: 'noun', phonetic: 'ma-had-sa-nid', difficulty: 'beginner',
    examples: [{ so: 'Mahadsanid walaal', en: 'Thank you brother' }]
  },
  // Family
  {
    id: '4', categoryId: 'family', wordSo: 'Hooyo', wordEn: 'Mother', 
    partOfSpeech: 'noun', phonetic: 'hoo-yo', difficulty: 'beginner',
    examples: [{ so: 'Hooyada ayaa la jeclahay', en: 'Mother is loved' }]
  },
  {
    id: '5', categoryId: 'family', wordSo: 'Aabo', wordEn: 'Father', 
    partOfSpeech: 'noun', phonetic: 'aa-bo', difficulty: 'beginner',
    examples: [{ so: 'Aabaha waa nin wanaagsan', en: 'Father is a good man' }]
  },
  {
    id: '6', categoryId: 'family', wordSo: 'Walaal', wordEn: 'Sibling', 
    partOfSpeech: 'noun', phonetic: 'wa-la-al', difficulty: 'beginner',
    examples: [{ so: 'Walaalkay waa wiil fiican', en: 'My brother is a good boy' }]
  },
  // Numbers
  {
    id: '7', categoryId: 'numbers', wordSo: 'Hal', wordEn: 'One', 
    partOfSpeech: 'noun', phonetic: 'hal', difficulty: 'beginner',
    examples: [{ so: 'Hal qof ayaa yimid', en: 'One person came' }]
  },
  {
    id: '8', categoryId: 'numbers', wordSo: 'Laba', wordEn: 'Two', 
    partOfSpeech: 'noun', phonetic: 'la-ba', difficulty: 'beginner',
    examples: [{ so: 'Laba buug ayaan hayaa', en: 'I have two books' }]
  },
  {
    id: '9', categoryId: 'numbers', wordSo: 'Sadex', wordEn: 'Three', 
    partOfSpeech: 'noun', phonetic: 'sa-dex', difficulty: 'beginner',
    examples: [{ so: 'Sadex shalay ayaan cunay', en: 'I ate three yesterday' }]
  },
  // Colors
  {
    id: '10', categoryId: 'colors', wordSo: 'Cas', wordEn: 'Red', 
    partOfSpeech: 'adjective', phonetic: 'cas', difficulty: 'beginner',
    examples: [{ so: 'Tufaax cas', en: 'Red apple' }]
  },
  {
    id: '11', categoryId: 'colors', wordSo: 'Cagaar', wordEn: 'Green', 
    partOfSpeech: 'adjective', phonetic: 'ca-ga-ar', difficulty: 'beginner',
    examples: [{ so: 'Dhir cagaar ah', en: 'Green plant' }]
  },
  {
    id: '12', categoryId: 'colors', wordSo: 'Buluug', wordEn: 'Blue', 
    partOfSpeech: 'adjective', phonetic: 'bu-lu-ug', difficulty: 'beginner',
    examples: [{ so: 'Samada buluug ah', en: 'Blue sky' }]
  },
];

interface Player {
  id: 1 | 2;
  name: string;
  score: number;
  avatar: string;
  color: string;
}

interface GameState {
  currentPlayer: 1 | 2;
  currentWord: Word;
  gameWords: Word[];
  round: number;
  maxRounds: number;
  isGameOver: boolean;
  showAnswer: boolean;
}

interface TwoPlayerGameScreenProps {
  onBack?: () => void;
}

export const TwoPlayerGameScreen: React.FC<TwoPlayerGameScreenProps> = ({ onBack }) => {
  const [gameSetup, setGameSetup] = useState(true);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Ciyaaryahan 1 - Player 1', score: 0, avatar: '👤', color: AfricanColors.player.one },
    { id: 2, name: 'Ciyaaryahan 2 - Player 2', score: 0, avatar: '👥', color: AfricanColors.player.two },
  ]);
  
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 1,
    currentWord: gameVocabulary[0],
    gameWords: [],
    round: 1,
    maxRounds: 10,
    isGameOver: false,
    showAnswer: false,
  });

  const [animatedScore1] = useState(new Animated.Value(0));
  const [animatedScore2] = useState(new Animated.Value(0));

  // Initialize game
  const startGame = (maxRounds: number = 10) => {
    const shuffledWords = [...gameVocabulary].sort(() => Math.random() - 0.5);
    setGameState({
      currentPlayer: 1,
      currentWord: shuffledWords[0],
      gameWords: shuffledWords.slice(0, maxRounds),
      round: 1,
      maxRounds,
      isGameOver: false,
      showAnswer: false,
    });
    setGameSetup(false);
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
  };

  // Handle correct answer
  const handleCorrectAnswer = () => {
    const currentPlayer = players.find(p => p.id === gameState.currentPlayer)!;
    const newScore = currentPlayer.score + 1;
    
    // Update score with animation
    const animatedValue = gameState.currentPlayer === 1 ? animatedScore1 : animatedScore2;
    Animated.spring(animatedValue, {
      toValue: newScore,
      useNativeDriver: false,
    }).start();
    
    // Update players
    setPlayers(prev => 
      prev.map(p => 
        p.id === gameState.currentPlayer 
          ? { ...p, score: newScore }
          : p
      )
    );
    
    // Provide haptic feedback
    Vibration.vibrate(100);
    
    nextTurn(true);
  };

  // Handle wrong answer
  const handleWrongAnswer = () => {
    setGameState(prev => ({ ...prev, showAnswer: true }));
    
    setTimeout(() => {
      nextTurn(false);
    }, 2000); // Show answer for 2 seconds
  };

  // Move to next turn
  const nextTurn = (wasCorrect: boolean) => {
    const nextRound = gameState.round + 1;
    const nextPlayer: 1 | 2 = gameState.currentPlayer === 1 ? 2 : 1;
    
    if (nextRound > gameState.maxRounds) {
      endGame();
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      currentPlayer: nextPlayer,
      currentWord: prev.gameWords[nextRound - 1],
      round: nextRound,
      showAnswer: false,
    }));
  };

  // End game and show results
  const endGame = () => {
    setGameState(prev => ({ ...prev, isGameOver: true }));
    
    const winner = players[0].score > players[1].score 
      ? players[0] 
      : players[0].score < players[1].score 
        ? players[1] 
        : null;
    
    const message = winner 
      ? `🎉 ${winner.name} ayaa guuleystay! - ${winner.name} won!\n\nDhibcaha: ${players[0].score} - ${players[1].score}\nScores: ${players[0].score} - ${players[1].score}`
      : `🤝 Ismiidaaminta! - It's a tie!\n\nLabada ciyaaryahan ayaa isku mid ah: ${players[0].score} - ${players[1].score}\nBoth players tied: ${players[0].score} - ${players[1].score}`;
    
    Alert.alert(
      'Ciyaarta Dhamaatay - Game Over',
      message,
      [
        { text: 'Dib u ciyaar - Play Again', onPress: () => setGameSetup(true) },
        { text: 'Dhamaan - Finish', onPress: onBack }
      ]
    );
  };

  // Render game setup screen
  if (gameSetup) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[AfricanColors.primary.light, AfricanColors.primary.main, AfricanColors.secondary.main]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {onBack && (
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={onBack}
                iconColor={AfricanColors.text.inverse}
                style={styles.backButton}
              />
            )}
            <Text variant="displaySmall" style={styles.title}>
              🎮 Tartanka Laba Ciyaaryahan
            </Text>
            <Text variant="titleMedium" style={styles.subtitle}>
              Two-Player Vocabulary Competition
            </Text>
          </View>
        </LinearGradient>

        {/* Setup Content */}
        <View style={styles.content}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Qorsheynta Ciyaarta - Game Setup
          </Text>
          
          {/* Player Setup */}
          <View style={styles.playersSetup}>
            {players.map((player, index) => (
              <Card key={player.id} style={[styles.playerSetupCard, { borderColor: player.color }]}>
                <Card.Content style={styles.playerSetupContent}>
                  <Avatar.Text 
                    size={60} 
                    label={`${player.id}`}
                    style={{ backgroundColor: player.color }}
                  />
                  <Text variant="titleMedium" style={styles.playerName}>
                    {player.name}
                  </Text>
                  <Text variant="bodyMedium" style={styles.playerDescription}>
                    {player.id === 1 ? 'Cagaar - Green Player' : 'Buluug - Blue Player'}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>

          {/* Game Rules */}
          <Card style={styles.rulesCard} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.rulesTitle}>
                📋 Xeerarka Ciyaarta - Game Rules
              </Text>
              
              <View style={styles.rule}>
                <Text style={styles.ruleIcon}>1️⃣</Text>
                <Text variant="bodyMedium">Labada ciyaaryahan ayaa iska cadaadinaya - Two players compete against each other</Text>
              </View>
              
              <View style={styles.rule}>
                <Text style={styles.ruleIcon}>2️⃣</Text>
                <Text variant="bodyMedium">Eray kasta waxaa loo soo bandhigayaa ciyaaryahan kasta - Each word is shown to each player</Text>
              </View>
              
              <View style={styles.rule}>
                <Text style={styles.ruleIcon}>3️⃣</Text>
                <Text variant="bodyMedium">Haddii aad saxda ku qosho, dhibco ayaad helaysaa - If you get it right, you earn a point</Text>
              </View>
              
              <View style={styles.rule}>
                <Text style={styles.ruleIcon}>🏆</Text>
                <Text variant="bodyMedium">Kan ugu dhibcaha badan ayaa guulaysta - The player with most points wins</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Round Selection */}
          <View style={styles.roundSelection}>
            <Text variant="titleMedium" style={styles.roundTitle}>
              Doorso Tirada Wareegga - Choose Number of Rounds
            </Text>
            
            <View style={styles.roundButtons}>
              <Button 
                mode="contained" 
                onPress={() => startGame(5)}
                style={styles.roundButton}
                buttonColor={AfricanColors.accent.green}
              >
                5 Wareeg - 5 Rounds
              </Button>
              
              <Button 
                mode="contained" 
                onPress={() => startGame(10)}
                style={styles.roundButton}
                buttonColor={AfricanColors.primary.main}
              >
                10 Wareeg - 10 Rounds
              </Button>
              
              <Button 
                mode="contained" 
                onPress={() => startGame(15)}
                style={styles.roundButton}
                buttonColor={AfricanColors.accent.coral}
              >
                15 Wareeg - 15 Rounds
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Game Over Screen
  if (gameState.isGameOver) {
    const winner = players[0].score > players[1].score 
      ? players[0] 
      : players[0].score < players[1].score 
        ? players[1] 
        : null;

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={winner ? [winner.color, AfricanColors.primary.main] : [AfricanColors.primary.light, AfricanColors.primary.main]}
          style={styles.gameOverHeader}
        >
          <Text variant="displayMedium" style={styles.gameOverTitle}>
            {winner ? '🎉 Guul!' : '🤝 Ismiidaamin!'}
          </Text>
          <Text variant="headlineSmall" style={styles.gameOverSubtitle}>
            {winner ? `${winner.name} Wins!` : "It's a Tie!"}
          </Text>
        </LinearGradient>
        
        <View style={styles.finalScores}>
          {players.map(player => (
            <Card 
              key={player.id}
              style={[
                styles.finalScoreCard,
                winner?.id === player.id && styles.winnerCard
              ]}
            >
              <Card.Content style={styles.finalScoreContent}>
                <Avatar.Text 
                  size={80} 
                  label={`${player.score}`}
                  style={{ backgroundColor: player.color }}
                />
                <Text variant="titleLarge" style={styles.finalPlayerName}>
                  {player.name}
                </Text>
                <Text variant="bodyLarge">
                  {player.score} dhibco - {player.score} points
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
        
        <View style={styles.gameOverButtons}>
          <Button 
            mode="contained" 
            onPress={() => setGameSetup(true)}
            style={styles.playAgainButton}
            buttonColor={AfricanColors.accent.green}
            icon="refresh"
          >
            Dib u Ciyaar - Play Again
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={onBack}
            style={styles.finishButton}
          >
            Dhamaan - Finish
          </Button>
        </View>
      </View>
    );
  }

  // Main Game Screen
  const currentPlayer = players.find(p => p.id === gameState.currentPlayer)!;
  
  return (
    <View style={styles.container}>
      {/* Game Header */}
      <LinearGradient
        colors={[currentPlayer.color, AfricanColors.primary.main]}
        style={styles.gameHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.gameHeaderContent}>
          <View style={styles.gameHeaderTop}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => setGameSetup(true)}
              iconColor={AfricanColors.text.inverse}
            />
            <Text variant="titleMedium" style={styles.gameTitle}>
              Wareeg {gameState.round} / {gameState.maxRounds}
            </Text>
            <View style={{ width: 40 }} />
          </View>
          
          <Text variant="headlineSmall" style={styles.currentPlayerText}>
            Wareegga: {currentPlayer.name}
          </Text>
          
          {/* Score Display */}
          <View style={styles.scoreDisplay}>
            {players.map(player => (
              <View key={player.id} style={styles.scoreItem}>
                <Avatar.Text 
                  size={40} 
                  label={`${player.score}`}
                  style={{ backgroundColor: player.color }}
                />
                <Text variant="bodySmall" style={styles.scoreLabel}>
                  Ciyaaryahan {player.id}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Word Display */}
      <ScrollView style={styles.gameContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.wordCard} mode="elevated">
          <Card.Content style={styles.wordContent}>
            <Text variant="displayMedium" style={styles.wordSomali}>
              {gameState.currentWord.wordSo}
            </Text>
            
            <Text variant="titleMedium" style={styles.phonetic}>
              📢 {gameState.currentWord.phonetic}
            </Text>
            
            {gameState.showAnswer ? (
              <View style={styles.answerSection}>
                <Text variant="headlineSmall" style={styles.englishWord}>
                  ✅ {gameState.currentWord.wordEn}
                </Text>
                
                {gameState.currentWord.examples && gameState.currentWord.examples[0] && (
                  <View style={styles.exampleSection}>
                    <Text variant="bodyLarge" style={styles.exampleSomali}>
                      "{gameState.currentWord.examples[0].so}"
                    </Text>
                    <Text variant="bodyMedium" style={styles.exampleEnglish}>
                      "{gameState.currentWord.examples[0].en}"
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Text variant="titleMedium" style={styles.questionText}>
                Maxay tarjumaaddu tahay Ingiriisiga? - What is the English translation?
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Game Controls */}
        {!gameState.showAnswer && (
          <View style={styles.gameControls}>
            <Button
              mode="contained"
              onPress={handleCorrectAnswer}
              style={styles.correctButton}
              buttonColor={AfricanColors.accent.green}
              textColor={AfricanColors.text.inverse}
              icon="check"
            >
              Sax! - Correct!
            </Button>

            <Button
              mode="contained"
              onPress={handleWrongAnswer}
              style={styles.wrongButton}
              buttonColor={AfricanColors.accent.red}
              textColor={AfricanColors.text.inverse}
              icon="close"
            >
              Khalad - Wrong
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AfricanColors.background.primary,
  },
  
  // Setup screen styles
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    minHeight: 200,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: -20,
    left: -8,
  },
  title: {
    color: AfricanColors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  content: {
    padding: 24,
  },
  sectionTitle: {
    color: AfricanColors.secondary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  
  playersSetup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  playerSetupCard: {
    flex: 0.48,
    borderWidth: 2,
    borderRadius: 16,
  },
  playerSetupContent: {
    alignItems: 'center',
    padding: 16,
  },
  playerName: {
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  playerDescription: {
    textAlign: 'center',
    color: AfricanColors.text.secondary,
  },
  
  rulesCard: {
    marginBottom: 24,
    borderColor: AfricanColors.accent.coral,
    borderWidth: 1,
    borderRadius: 16,
  },
  rulesTitle: {
    color: AfricanColors.accent.coral,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  
  roundSelection: {
    alignItems: 'center',
  },
  roundTitle: {
    color: AfricanColors.text.primary,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  roundButtons: {
    width: '100%',
  },
  roundButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  
  // Game screen styles
  gameHeader: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  gameHeaderContent: {
    alignItems: 'center',
  },
  gameHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  gameTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  currentPlayerText: {
    color: AfricanColors.text.inverse,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: AfricanColors.text.inverse,
    marginTop: 4,
    fontSize: 12,
  },
  
  gameContent: {
    flex: 1,
    padding: 16,
  },
  wordCard: {
    marginBottom: 24,
    borderRadius: 20,
    elevation: 8,
  },
  wordContent: {
    padding: 32,
    alignItems: 'center',
  },
  wordSomali: {
    color: AfricanColors.primary.main,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  phonetic: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  questionText: {
    color: AfricanColors.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  answerSection: {
    alignItems: 'center',
  },
  englishWord: {
    color: AfricanColors.accent.green,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  exampleSection: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: AfricanColors.background.surface,
    borderRadius: 12,
    marginTop: 8,
  },
  exampleSomali: {
    color: AfricanColors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  exampleEnglish: {
    color: AfricanColors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  gameControls: {
    alignItems: 'center',
  },
  correctButton: {
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 16,
    minWidth: 200,
  },
  wrongButton: {
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
  },
  
  // Game Over styles
  gameOverHeader: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 200,
  },
  gameOverTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameOverSubtitle: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  finalScores: {
    padding: 24,
    alignItems: 'center',
  },
  finalScoreCard: {
    marginBottom: 16,
    borderRadius: 16,
    width: '100%',
    maxWidth: 300,
  },
  winnerCard: {
    borderWidth: 3,
    borderColor: AfricanColors.accent.green,
  },
  finalScoreContent: {
    alignItems: 'center',
    padding: 24,
  },
  finalPlayerName: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  gameOverButtons: {
    padding: 24,
    alignItems: 'center',
  },
  playAgainButton: {
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
  },
  finishButton: {
    borderRadius: 12,
    minWidth: 200,
  },
});

export default TwoPlayerGameScreen;
