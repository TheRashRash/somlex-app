export interface CompetitionPlayer {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  streakCount: number;
  averageTime: number;
  level: number;
  isReady: boolean;
  isConnected: boolean;
}

export interface CompetitionRoom {
  id: string;
  name: string;
  hostId: string;
  players: CompetitionPlayer[];
  maxPlayers: number;
  gameMode: CompetitionMode;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'waiting' | 'starting' | 'active' | 'completed';
  currentQuestionIndex: number;
  questions: CompetitionQuestion[];
  settings: CompetitionSettings;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface CompetitionQuestion {
  id: string;
  wordId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'so-to-en' | 'en-to-so' | 'audio';
  timeLimit: number;
  points: number;
}

export interface CompetitionAnswer {
  playerId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
  timestamp: Date;
}

export interface CompetitionResult {
  roomId: string;
  playerId: string;
  playerName: string;
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  averageTime: number;
  rank: number;
  achievements: string[];
}

export interface CompetitionSettings {
  questionCount: number;
  timePerQuestion: number;
  pointsPerCorrect: number;
  streakBonus: boolean;
  speedBonus: boolean;
  randomizeQuestions: boolean;
}

export interface LeaderboardEntry {
  id: string;
  playerId: string;
  playerName: string;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  averageScore: number;
  bestStreak: number;
  totalCorrectAnswers: number;
  level: number;
  achievements: Achievement[];
  lastActive: Date;
  rank: number;
}

export interface Achievement {
  id: string;
  name: string;
  nameSo: string;
  description: string;
  descriptionSo: string;
  icon: string;
  category: 'performance' | 'social' | 'streak' | 'mastery' | 'special';
  condition: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface Tournament {
  id: string;
  name: string;
  nameSo: string;
  description: string;
  descriptionSo: string;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  participants: string[];
  prizes: TournamentPrize[];
  rules: TournamentRules;
  status: 'upcoming' | 'active' | 'completed';
  leaderboard: LeaderboardEntry[];
}

export interface TournamentPrize {
  rank: number;
  name: string;
  nameSo: string;
  description: string;
  descriptionSo: string;
  icon: string;
  points: number;
}

export interface TournamentRules {
  gameMode: CompetitionMode;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  timePerQuestion: number;
  maxAttempts: number;
}

export type CompetitionMode = 
  | 'head_to_head'     // 1v1 real-time competition
  | 'battle_royale'    // Multi-player elimination
  | 'team_challenge'   // Team vs Team
  | 'speed_round'      // Fast-paced quick questions
  | 'survival'         // Keep answering until you fail
  | 'tournament'       // Bracket-style competition
  | 'daily_challenge'  // Daily challenge mode
  | 'practice_duel';   // Friendly practice match

export type CompetitionStatus = 'idle' | 'searching' | 'joining' | 'waiting' | 'playing' | 'completed' | 'disconnected';

// Event types for real-time communication
export interface CompetitionEvent {
  type: CompetitionEventType;
  roomId: string;
  playerId?: string;
  data?: any;
  timestamp: Date;
}

export type CompetitionEventType =
  | 'player_joined'
  | 'player_left' 
  | 'player_ready'
  | 'game_start'
  | 'question_start'
  | 'answer_submitted'
  | 'question_end'
  | 'game_end'
  | 'room_updated'
  | 'chat_message'
  | 'player_disconnected'
  | 'player_reconnected';

// UI Component Props
export interface CompetitionScreenProps {
  navigation: any;
  route?: any;
}

export interface LeaderboardScreenProps {
  navigation: any;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
}

export interface TournamentScreenProps {
  navigation: any;
  tournament?: Tournament;
}

export interface RoomBrowserProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
}

export interface GameRoomProps {
  room: CompetitionRoom;
  currentPlayer: CompetitionPlayer;
  onLeave: () => void;
}
