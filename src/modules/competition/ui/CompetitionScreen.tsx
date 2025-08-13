import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Animated } from 'react-native';
import { Button, Text, Card, IconButton, Chip, Surface, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompetitionStore } from '../store/competitionStore';
import { CompetitionMode } from '../types';

// African color palette
const AfricanColors = {
  primary: { main: '#B8860B', light: '#D4AF37', dark: '#8B6914' },
  secondary: { main: '#654321', light: '#8D6E63' },
  background: { primary: '#FFFEF7', card: '#FFFFFF', surface: '#FAF0E6' },
  text: { 
    primary: '#2F2F2F', 
    secondary: '#4A4A4A', 
    tertiary: '#666666',
    inverse: '#FFFFFF',
    onPrimary: '#FFFFFF'
  },
  accent: { 
    coral: '#D2691E', 
    terracotta: '#B8860B', 
    green: '#4CAF50', 
    red: '#F44336',
    blue: '#2196F3',
    purple: '#9C27B0'
  },
};

interface CompetitionScreenProps {
  onBack?: () => void;
}

export const CompetitionScreen: React.FC<CompetitionScreenProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'hub' | 'quickmatch' | 'leaderboard' | 'achievements'>('hub');
  const [selectedMode, setSelectedMode] = useState<CompetitionMode>('head_to_head');
  
  const { 
    currentPlayer, 
    leaderboard, 
    achievements, 
    initializePlayer,
    createRoom,
    joinRoom,
    loading,
    error
  } = useCompetitionStore();

  useEffect(() => {
    // Initialize player if not already done
    if (!currentPlayer) {
      initializePlayer('Ciyaaryahan', '👤');
    }
  }, [currentPlayer, initializePlayer]);

  const gameModesData = [
    {
      id: 'head_to_head',
      name: 'Hal iyo Hal',
      nameEn: '1v1 Head-to-Head',
      description: 'Tartam mid kale si toos ah',
      descriptionEn: 'Compete directly against one player',
      icon: '⚔️',
      color: AfricanColors.accent.red,
      maxPlayers: 2
    },
    {
      id: 'battle_royale',
      name: 'Dagaal Guud',
      nameEn: 'Battle Royale',
      description: '8 ciyaaryahan, mid keliya ayaa guulaysta',
      descriptionEn: '8 players, only one winner',
      icon: '👑',
      color: AfricanColors.accent.purple,
      maxPlayers: 8
    },
    {
      id: 'speed_round',
      name: 'Wareeg Degdeg',
      nameEn: 'Speed Round',
      description: 'Su\'aalaha degdegga ah',
      descriptionEn: 'Fast-paced rapid questions',
      icon: '⚡',
      color: AfricanColors.accent.blue,
      maxPlayers: 4
    },
    {
      id: 'practice_duel',
      name: 'Tartam Tababar',
      nameEn: 'Practice Duel',
      description: 'Tababar saaxibkaaga la\'aan dhibaato',
      descriptionEn: 'Practice with friends without pressure',
      icon: '🤝',
      color: AfricanColors.accent.green,
      maxPlayers: 2
    }
  ];

  const handleQuickMatch = async () => {
    if (!currentPlayer) return;
    
    // Try to join an existing room or create a new one
    try {
      await joinRoom('quick_match_room');
    } catch {
      await createRoom('Quick Match', selectedMode, {});
    }
    setCurrentView('quickmatch');
  };

  const handleCreateRoom = async (mode: CompetitionMode) => {
    if (!currentPlayer) return;
    
    await createRoom(`${mode} Room`, mode, {
      questionCount: mode === 'speed_round' ? 20 : 10,
      timePerQuestion: mode === 'speed_round' ? 15 : 30
    });
    setCurrentView('quickmatch');
  };

  // Quick Match/Room View
  if (currentView === 'quickmatch') {
    return (
      <QuickMatchScreen 
        onBack={() => setCurrentView('hub')}
        gameMode={selectedMode}
      />
    );
  }

  // Leaderboard View
  if (currentView === 'leaderboard') {
    return (
      <LeaderboardScreen 
        onBack={() => setCurrentView('hub')}
      />
    );
  }

  // Achievements View
  if (currentView === 'achievements') {
    return (
      <AchievementsScreen 
        onBack={() => setCurrentView('hub')}
      />
    );
  }

  // Main Hub View
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Beautiful African header */}
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
            🏆 Tartanka
          </Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            Competition Hub - Iskudir Ciyaaryahannada
          </Text>
        </View>
      </LinearGradient>

      {/* Player Profile Card */}
      {currentPlayer && (
        <Card style={styles.profileCard} mode="elevated">
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={60} 
              label={currentPlayer.avatar}
              style={{ backgroundColor: AfricanColors.primary.main }}
            />
            <View style={styles.profileInfo}>
              <Text variant="titleLarge" style={styles.playerName}>
                {currentPlayer.name}
              </Text>
              <Text variant="bodyMedium" style={styles.playerStats}>
                Heerka {currentPlayer.level} - Level {currentPlayer.level}
              </Text>
              <View style={styles.playerMeta}>
                <Chip icon="trophy" style={styles.statChip}>
                  {currentPlayer.score} dhibco
                </Chip>
                <Chip icon="target" style={styles.statChip}>
                  {currentPlayer.correctAnswers} saxan
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          🚀 Hawlaha Degdegga - Quick Actions
        </Text>
        
        <View style={styles.quickActionButtons}>
          <Button
            mode="contained"
            onPress={handleQuickMatch}
            style={styles.quickMatchButton}
            buttonColor={AfricanColors.accent.green}
            textColor={AfricanColors.text.inverse}
            icon="flash"
            loading={loading}
          >
            Tartam Degdeg - Quick Match
          </Button>
          
          <View style={styles.quickActionRow}>
            <Button
              mode="outlined"
              onPress={() => setCurrentView('leaderboard')}
              style={styles.quickActionBtn}
              icon="podium"
            >
              Liiska - Leaderboard
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => setCurrentView('achievements')}
              style={styles.quickActionBtn}
              icon="medal"
            >
              Guulaha - Achievements
            </Button>
          </View>
        </View>
      </View>

      {/* Game Modes */}
      <View style={styles.gameModesSection}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          🎮 Noocyada Ciyaarta - Game Modes
        </Text>
        
        <View style={styles.gameModesGrid}>
          {gameModesData.map((mode) => (
            <Card 
              key={mode.id} 
              style={styles.gameModeCard} 
              mode="elevated"
              onPress={() => handleCreateRoom(mode.id as CompetitionMode)}
            >
              <LinearGradient
                colors={[mode.color, `${mode.color}DD`]}
                style={styles.gameModeGradient}
              >
                <Card.Content style={styles.gameModeContent}>
                  <Text style={styles.gameModeIcon}>{mode.icon}</Text>
                  <Text variant="titleMedium" style={styles.gameModeTitle}>
                    {mode.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.gameModeTitleEn}>
                    {mode.nameEn}
                  </Text>
                  <Text variant="bodyMedium" style={styles.gameModeDescription}>
                    {mode.description}
                  </Text>
                  <Text variant="bodySmall" style={styles.gameModeDescriptionEn}>
                    {mode.descriptionEn}
                  </Text>
                  <View style={styles.gameModeFooter}>
                    <Chip style={styles.playersChip}>
                      {mode.maxPlayers} ciyaaryahan
                    </Chip>
                  </View>
                </Card.Content>
              </LinearGradient>
            </Card>
          ))}
        </View>
      </View>

      {/* Top Players Preview */}
      <Card style={styles.topPlayersCard} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.topPlayersTitle}>
            👑 Ciyaaryahannada Ugu Fiican - Top Players
          </Text>
          
          {leaderboard.slice(0, 3).map((player, index) => (
            <View key={player.id} style={styles.topPlayerItem}>
              <View style={styles.topPlayerRank}>
                <Text style={styles.rankEmoji}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </Text>
                <Text variant="bodySmall">{player.rank}</Text>
              </View>
              
              <Avatar.Text 
                size={32} 
                label={player.playerName.charAt(0)}
                style={{ backgroundColor: AfricanColors.primary.light }}
              />
              
              <View style={styles.topPlayerInfo}>
                <Text variant="bodyMedium" style={styles.topPlayerName}>
                  {player.playerName}
                </Text>
                <Text variant="bodySmall" style={styles.topPlayerScore}>
                  {player.score} dhibco - Level {player.level}
                </Text>
              </View>
            </View>
          ))}
          
          <Button
            mode="outlined"
            onPress={() => setCurrentView('leaderboard')}
            style={styles.viewAllButton}
            icon="arrow-right"
          >
            Dhammaan arag - View All
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Achievements */}
      <Card style={styles.achievementsPreviewCard} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.achievementsTitle}>
            🏅 Guulaha Dhowaan la Helay - Recent Achievements
          </Text>
          
          <View style={styles.achievementsList}>
            {achievements.slice(0, 2).map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text variant="bodyMedium" style={styles.achievementName}>
                    {achievement.nameSo}
                  </Text>
                  <Text variant="bodySmall" style={styles.achievementDescription}>
                    {achievement.descriptionSo}
                  </Text>
                </View>
                <Chip 
                  style={[
                    styles.rarityChip,
                    { backgroundColor: achievement.rarity === 'legendary' ? '#FFD700' : 
                                         achievement.rarity === 'epic' ? '#9C27B0' : 
                                         achievement.rarity === 'rare' ? '#2196F3' : '#4CAF50' }
                  ]}
                  textStyle={{ color: 'white', fontSize: 10 }}
                >
                  {achievement.rarity}
                </Chip>
              </View>
            ))}
          </View>
          
          <Button
            mode="outlined"
            onPress={() => setCurrentView('achievements')}
            style={styles.viewAllButton}
            icon="arrow-right"
          >
            Dhammaan arag - View All
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Quick Match Screen Component (placeholder)
const QuickMatchScreen: React.FC<{ onBack: () => void; gameMode: CompetitionMode }> = ({ onBack, gameMode }) => {
  return (
    <View style={styles.container}>
      <Text>Quick Match Screen for {gameMode}</Text>
      <Button onPress={onBack}>Back to Hub</Button>
    </View>
  );
};

// Leaderboard Screen Component (placeholder)
const LeaderboardScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <Text>Leaderboard Screen</Text>
      <Button onPress={onBack}>Back to Hub</Button>
    </View>
  );
};

// Achievements Screen Component (placeholder)
const AchievementsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <Text>Achievements Screen</Text>
      <Button onPress={onBack}>Back to Hub</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AfricanColors.background.primary,
  },
  
  // Header styles
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
  
  // Profile card
  profileCard: {
    margin: 24,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 8,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    color: AfricanColors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  playerStats: {
    color: AfricanColors.text.secondary,
    marginBottom: 8,
  },
  playerMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    backgroundColor: AfricanColors.background.surface,
  },
  
  // Sections
  sectionTitle: {
    color: AfricanColors.secondary.main,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Quick Actions
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickActionButtons: {
    gap: 12,
  },
  quickMatchButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionBtn: {
    flex: 1,
    borderRadius: 8,
  },
  
  // Game Modes
  gameModesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  gameModesGrid: {
    gap: 16,
  },
  gameModeCard: {
    borderRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  gameModeGradient: {
    padding: 0,
  },
  gameModeContent: {
    padding: 20,
    alignItems: 'center',
  },
  gameModeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  gameModeTitle: {
    color: AfricanColors.text.inverse,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gameModeTitleEn: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.9,
  },
  gameModeDescription: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.9,
  },
  gameModeDescriptionEn: {
    color: AfricanColors.text.inverse,
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 12,
    opacity: 0.8,
  },
  gameModeFooter: {
    alignItems: 'center',
  },
  playersChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Top Players
  topPlayersCard: {
    margin: 24,
    marginBottom: 16,
    borderColor: AfricanColors.accent.coral,
    borderWidth: 1,
    borderRadius: 16,
  },
  topPlayersTitle: {
    color: AfricanColors.accent.coral,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  topPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  topPlayerRank: {
    alignItems: 'center',
    marginRight: 12,
  },
  rankEmoji: {
    fontSize: 20,
  },
  topPlayerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  topPlayerName: {
    fontWeight: '600',
    color: AfricanColors.text.primary,
  },
  topPlayerScore: {
    color: AfricanColors.text.secondary,
  },
  
  // Achievements Preview
  achievementsPreviewCard: {
    margin: 24,
    borderColor: AfricanColors.primary.main,
    borderWidth: 1,
    borderRadius: 16,
  },
  achievementsTitle: {
    color: AfricanColors.primary.main,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementsList: {
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontWeight: '600',
    color: AfricanColors.text.primary,
    marginBottom: 2,
  },
  achievementDescription: {
    color: AfricanColors.text.secondary,
  },
  rarityChip: {
    marginLeft: 8,
  },
  
  viewAllButton: {
    borderRadius: 8,
  },
});

export default CompetitionScreen;
