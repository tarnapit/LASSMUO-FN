export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'online' | 'offline' | 'playing';
  lastSeen: Date;
  level: number;
  totalScore: number;
  currentActivity?: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: Friend;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface GroupSession {
  id: string;
  name: string;
  type: 'learning' | 'quiz' | 'game';
  hostId: string;
  participants: Friend[];
  maxParticipants: number;
  status: 'waiting' | 'active' | 'finished';
  createdAt: Date;
  activity?: {
    moduleId?: string;
    gameId?: string;
    quizId?: string;
  };
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  user: Friend;
  score: number;
  change: number; // +/- from previous ranking
}
