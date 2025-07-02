import { Friend, Badge, Leaderboard, GroupSession } from '../types/friends';

export const badges: Badge[] = [
  {
    id: 'first-login',
    name: 'ผู้สำรวจใหม่',
    description: 'เข้าสู่ระบบครั้งแรก',
    icon: '🚀',
    rarity: 'common'
  },
  {
    id: 'quiz-master',
    name: 'เซียนแบบทดสอบ',
    description: 'ทำแบบทดสอบได้คะแนนเต็ม 10 ครั้ง',
    icon: '🧠',
    rarity: 'rare'
  },
  {
    id: 'planet-expert',
    name: 'ผู้เชี่ยวชาญดาวเคราะห์',
    description: 'เรียนจบบทเรียนระบบสุริยะ',
    icon: '🪐',
    rarity: 'epic'
  },
  {
    id: 'space-explorer',
    name: 'นักสำรวจอวกาศ',
    description: 'เรียนจบทุกบทเรียน',
    icon: '🌌',
    rarity: 'legendary'
  },
  {
    id: 'social-butterfly',
    name: 'คนสังคม',
    description: 'มีเพื่อน 10 คน',
    icon: '🦋',
    rarity: 'rare'
  },
  {
    id: 'team-player',
    name: 'นักเล่นทีม',
    description: 'เล่นกับเพื่อน 50 ครั้ง',
    icon: '🤝',
    rarity: 'epic'
  }
];

export const friends: Friend[] = [
  {
    id: '1',
    username: 'space_explorer_01',
    displayName: 'น้องมิกซ์',
    avatar: '👩‍🚀',
    status: 'online',
    lastSeen: new Date(),
    level: 15,
    totalScore: 2450,
    currentActivity: 'เรียนบทเรียนระบบสุริยะ',
    badges: [badges[0], badges[1], badges[4]]
  },
  {
    id: '2',
    username: 'cosmic_kid',
    displayName: 'ปลื้มใจ',
    avatar: '👨‍🚀',
    status: 'playing',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    level: 12,
    totalScore: 1890,
    currentActivity: 'เล่นเกมจับคู่ดาวเคราะห์',
    badges: [badges[0], badges[2]]
  },
  {
    id: '3',
    username: 'star_gazer',
    displayName: 'น้องดาว',
    avatar: '🧑‍🚀',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    level: 18,
    totalScore: 3120,
    badges: [badges[0], badges[1], badges[2], badges[4]]
  },
  {
    id: '4',
    username: 'moon_walker',
    displayName: 'พี่จันทร์',
    avatar: '👩‍🔬',
    status: 'online',
    lastSeen: new Date(),
    level: 22,
    totalScore: 4200,
    currentActivity: 'ทำแบบทดสอบขั้นสูง',
    badges: [badges[0], badges[1], badges[2], badges[3], badges[4], badges[5]]
  },
  {
    id: '5',
    username: 'asteroid_hunter',
    displayName: 'ก้อนหิน',
    avatar: '👨‍🔬',
    status: 'online',
    lastSeen: new Date(),
    level: 8,
    totalScore: 980,
    currentActivity: 'ดูรายการเพื่อน',
    badges: [badges[0]]
  },
  {
    id: '6',
    username: 'galaxy_master',
    displayName: 'อาจารย์กาแล็กซี่',
    avatar: '👨‍🏫',
    status: 'offline',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    level: 25,
    totalScore: 5800,
    badges: [badges[0], badges[1], badges[2], badges[3], badges[4], badges[5]]
  }
];

export const leaderboard: Leaderboard = {
  period: 'weekly',
  lastUpdated: new Date(),
  entries: [
    { rank: 1, user: friends[5], score: 5800, change: 0 },
    { rank: 2, user: friends[3], score: 4200, change: +1 },
    { rank: 3, user: friends[2], score: 3120, change: -1 },
    { rank: 4, user: friends[0], score: 2450, change: +2 },
    { rank: 5, user: friends[1], score: 1890, change: -1 },
    { rank: 6, user: friends[4], score: 980, change: -1 }
  ]
};

export const groupSessions: GroupSession[] = [
  {
    id: 'session-1',
    name: 'เรียนรู้ระบบสุริยะร่วมกัน',
    type: 'learning',
    hostId: friends[3].id,
    participants: [friends[3], friends[0], friends[1]],
    maxParticipants: 4,
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    activity: { moduleId: 'solar-system' }
  },
  {
    id: 'session-2',
    name: 'แข่งขันแบบทดสอบ',
    type: 'quiz',
    hostId: friends[2].id,
    participants: [friends[2]],
    maxParticipants: 6,
    status: 'waiting',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    activity: { quizId: 'solar-quiz' }
  },
  {
    id: 'session-3',
    name: 'เกมจับคู่ดาวเคราะห์',
    type: 'game',
    hostId: friends[4].id,
    participants: [friends[4], friends[0]],
    maxParticipants: 4,
    status: 'waiting',
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    activity: { gameId: 'planet-match' }
  }
];

export const getFriendById = (id: string): Friend | undefined => {
  return friends.find(friend => friend.id === id);
};

export const getOnlineFriends = (): Friend[] => {
  return friends.filter(friend => friend.status === 'online');
};

export const getBadgesByRarity = (rarity: string): Badge[] => {
  return badges.filter(badge => badge.rarity === rarity);
};
