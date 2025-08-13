import { create } from 'zustand';
import { 
  CompetitionPlayer, 
  CompetitionRoom, 
  CompetitionStatus, 
  CompetitionMode,
  LeaderboardEntry,
  Achievement,
  Tournament,
  CompetitionResult,
  CompetitionQuestion,
  CompetitionAnswer
} from '../types';

interface CompetitionState {
  // Current player
  currentPlayer: CompetitionPlayer | null;
  
  // Room management
  currentRoom: CompetitionRoom | null;
  availableRooms: CompetitionRoom[];
  
  // Game state
  status: CompetitionStatus;
  isHost: boolean;
  
  // Current game
  currentQuestion: CompetitionQuestion | null;
  currentQuestionIndex: number;
  timeLeft: number;
  answers: CompetitionAnswer[];
  
  // Results
  gameResults: CompetitionResult[];
  
  // Social features
  leaderboard: LeaderboardEntry[];
  achievements: Achievement[];
  tournaments: Tournament[];
  
  // Loading and errors
  loading: boolean;
  error: string | null;
  
  // Actions
  initializePlayer: (name: string, avatar?: string) => void;
  createRoom: (name: string, gameMode: CompetitionMode, settings: any) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  setPlayerReady: (isReady: boolean) => void;
  startGame: () => Promise<void>;
  submitAnswer: (answer: string) => void;
  updateLeaderboard: () => Promise<void>;
  unlockAchievement: (achievementId: string) => void;
  resetGame: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Mock data for development
const mockAchievements: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    nameSo: 'Guusha Kowaad',
    description: 'Win your first competition',
    descriptionSo: 'Ku guulayso tartankaaga kowaad',
    icon: '🏆',
    category: 'performance',
    condition: 'win_first_game',
    points: 100,
    rarity: 'common'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    nameSo: 'Degdeg Qaraar',
    description: 'Answer 10 questions correctly in under 5 seconds each',
    descriptionSo: 'Ku jawaab 10 su\'aal si saxda ah gudahood 5 ilbiriqsi',
    icon: '⚡',
    category: 'performance',
    condition: 'fast_answers_10',
    points: 250,
    rarity: 'rare'
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    nameSo: 'Sayid Xariiqda',
    description: 'Get 20 correct answers in a row',
    descriptionSo: 'Hel 20 jawaab oo saxan oo isku xiga',
    icon: '🔥',
    category: 'streak',
    condition: 'streak_20',
    points: 500,
    rarity: 'epic'
  },
  {
    id: 'vocabulary_king',
    name: 'Vocabulary King',
    nameSo: 'Boqorka Ereyada',
    description: 'Master all vocabulary categories',
    descriptionSo: 'Ka taliye dhammaan qaybaha ereyada',
    icon: '👑',
    category: 'mastery',
    condition: 'master_all_categories',
    points: 1000,
    rarity: 'legendary'
  }
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    playerId: 'player1',
    playerName: 'Ahmed Hassan',
    score: 2850,
    gamesPlayed: 45,
    gamesWon: 32,
    winRate: 71.1,
    averageScore: 89.2,
    bestStreak: 15,
    totalCorrectAnswers: 402,
    level: 8,
    achievements: mockAchievements.slice(0, 2),
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    rank: 1
  },
  {
    id: '2',
    playerId: 'player2',
    playerName: 'Fatima Omar',
    score: 2640,
    gamesPlayed: 38,
    gamesWon: 28,
    winRate: 73.7,
    averageScore: 92.1,
    bestStreak: 12,
    totalCorrectAnswers: 356,
    level: 7,
    achievements: mockAchievements.slice(0, 3),
    lastActive: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    rank: 2
  },
  {
    id: '3',
    playerId: 'player3',
    playerName: 'Mohamed Ali',
    score: 2430,
    gamesPlayed: 42,
    gamesWon: 25,
    winRate: 59.5,
    averageScore: 85.7,
    bestStreak: 18,
    totalCorrectAnswers: 378,
    level: 6,
    achievements: mockAchievements.slice(0, 1),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    rank: 3
  }
];

export const useCompetitionStore = create<CompetitionState>((set, get) => ({
  // Initial state
  currentPlayer: null,
  currentRoom: null,
  availableRooms: [],
  status: 'idle',
  isHost: false,
  currentQuestion: null,
  currentQuestionIndex: 0,
  timeLeft: 30,
  answers: [],
  gameResults: [],
  leaderboard: mockLeaderboard,
  achievements: mockAchievements,
  tournaments: [],
  loading: false,
  error: null,

  // Actions
  initializePlayer: (name: string, avatar?: string) => {
    const player: CompetitionPlayer = {
      id: `player_${Date.now()}`,
      name,
      avatar: avatar || '👤',
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      streakCount: 0,
      averageTime: 0,
      level: 1,
      isReady: false,
      isConnected: true
    };
    
    set({ currentPlayer: player, status: 'idle' });
  },

  createRoom: async (name: string, gameMode: CompetitionMode, settings: any) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;

    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const room: CompetitionRoom = {
        id: `room_${Date.now()}`,
        name,
        hostId: currentPlayer.id,
        players: [{ ...currentPlayer, isReady: false }],
        maxPlayers: gameMode === 'head_to_head' ? 2 : gameMode === 'battle_royale' ? 8 : 4,
        gameMode,
        category: 'all',
        difficulty: 'beginner',
        status: 'waiting',
        currentQuestionIndex: 0,
        questions: [],
        settings: {
          questionCount: 10,
          timePerQuestion: 30,
          pointsPerCorrect: 100,
          streakBonus: true,
          speedBonus: true,
          randomizeQuestions: true,
          ...settings
        },
        createdAt: new Date()
      };
      
      set({ 
        currentRoom: room, 
        isHost: true, 
        status: 'waiting',
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create room',
        loading: false 
      });
    }
  },

  joinRoom: async (roomId: string) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;

    set({ loading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock joining a room
      const room: CompetitionRoom = {
        id: roomId,
        name: 'Quick Match',
        hostId: 'other_player',
        players: [
          {
            id: 'other_player',
            name: 'Ahmed Hassan',
            avatar: '🧔',
            score: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            streakCount: 0,
            averageTime: 0,
            level: 5,
            isReady: true,
            isConnected: true
          },
          { ...currentPlayer, isReady: false }
        ],
        maxPlayers: 2,
        gameMode: 'head_to_head',
        category: 'all',
        difficulty: 'beginner',
        status: 'waiting',
        currentQuestionIndex: 0,
        questions: [],
        settings: {
          questionCount: 10,
          timePerQuestion: 30,
          pointsPerCorrect: 100,
          streakBonus: true,
          speedBonus: true,
          randomizeQuestions: true
        },
        createdAt: new Date()
      };
      
      set({ 
        currentRoom: room, 
        isHost: false, 
        status: 'waiting',
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to join room',
        loading: false 
      });
    }
  },

  leaveRoom: () => {
    set({ 
      currentRoom: null, 
      isHost: false, 
      status: 'idle',
      currentQuestion: null,
      currentQuestionIndex: 0,
      answers: [],
      timeLeft: 30
    });
  },

  setPlayerReady: (isReady: boolean) => {
    const { currentRoom, currentPlayer } = get();
    if (!currentRoom || !currentPlayer) return;

    const updatedPlayers = currentRoom.players.map(player => 
      player.id === currentPlayer.id 
        ? { ...player, isReady }
        : player
    );

    const updatedRoom = {
      ...currentRoom,
      players: updatedPlayers
    };

    set({ 
      currentRoom: updatedRoom,
      currentPlayer: { ...currentPlayer, isReady }
    });
  },

  startGame: async () => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    set({ loading: true });

    try {
      // Simulate game start
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock questions (in real app, these would come from API)
      const questions: CompetitionQuestion[] = [
        {
          id: 'q1',
          wordId: 'word1',
          question: 'Maxay ku tarjumantaa "Salaan" Ingiriisiga?',
          options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
          correctAnswer: 'Hello',
          type: 'so-to-en',
          timeLimit: 30,
          points: 100
        },
        {
          id: 'q2',
          wordId: 'word2',
          question: 'What does "Mother" mean in Somali?',
          options: ['Aabo', 'Hooyo', 'Walaal', 'Habaryar'],
          correctAnswer: 'Hooyo',
          type: 'en-to-so',
          timeLimit: 30,
          points: 100
        }
      ];

      const updatedRoom = {
        ...currentRoom,
        status: 'active' as const,
        questions,
        startedAt: new Date()
      };

      set({ 
        currentRoom: updatedRoom,
        status: 'playing',
        currentQuestion: questions[0],
        currentQuestionIndex: 0,
        timeLeft: 30,
        loading: false
      });

      // Start timer
      get().startTimer();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start game',
        loading: false 
      });
    }
  },

  startTimer: () => {
    const timer = setInterval(() => {
      const { timeLeft, status } = get();
      
      if (status !== 'playing') {
        clearInterval(timer);
        return;
      }
      
      if (timeLeft <= 1) {
        clearInterval(timer);
        get().submitAnswer(''); // Auto-submit empty answer
        return;
      }
      
      set({ timeLeft: timeLeft - 1 });
    }, 1000);
  },

  submitAnswer: (answer: string) => {
    const { currentPlayer, currentQuestion, currentRoom, currentQuestionIndex } = get();
    if (!currentPlayer || !currentQuestion || !currentRoom) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const timeSpent = 30 - get().timeLeft;
    
    const competitionAnswer: CompetitionAnswer = {
      playerId: currentPlayer.id,
      questionId: currentQuestion.id,
      answer,
      isCorrect,
      timeSpent,
      points: isCorrect ? currentQuestion.points : 0,
      timestamp: new Date()
    };

    const updatedAnswers = [...get().answers, competitionAnswer];
    set({ answers: updatedAnswers });

    // Move to next question or end game
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < currentRoom.questions.length) {
        set({
          currentQuestionIndex: nextIndex,
          currentQuestion: currentRoom.questions[nextIndex],
          timeLeft: 30
        });
        get().startTimer();
      } else {
        get().endGame();
      }
    }, 2000);
  },

  endGame: () => {
    const { currentRoom, answers, currentPlayer } = get();
    if (!currentRoom || !currentPlayer) return;

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalScore = answers.reduce((sum, a) => sum + a.points, 0);
    const averageTime = answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length;

    const result: CompetitionResult = {
      roomId: currentRoom.id,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      totalScore,
      correctAnswers,
      totalQuestions: answers.length,
      accuracy: (correctAnswers / answers.length) * 100,
      averageTime,
      rank: 1, // Would be calculated based on all players
      achievements: []
    };

    set({ 
      gameResults: [result],
      status: 'completed',
      currentQuestion: null
    });
  },

  updateLeaderboard: async () => {
    set({ loading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would fetch fresh leaderboard data
      set({ loading: false });
    } catch (error) {
      set({ 
        error: 'Failed to update leaderboard',
        loading: false 
      });
    }
  },

  unlockAchievement: (achievementId: string) => {
    const { achievements } = get();
    const updatedAchievements = achievements.map(achievement =>
      achievement.id === achievementId
        ? { ...achievement, unlockedAt: new Date() }
        : achievement
    );
    
    set({ achievements: updatedAchievements });
  },

  resetGame: () => {
    set({
      currentRoom: null,
      isHost: false,
      status: 'idle',
      currentQuestion: null,
      currentQuestionIndex: 0,
      timeLeft: 30,
      answers: [],
      gameResults: [],
      error: null
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  }
}));
