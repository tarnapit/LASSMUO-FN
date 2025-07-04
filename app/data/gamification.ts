// Duolingo-style gamification features
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'streak' | 'xp' | 'perfect' | 'speed' | 'stages' | 'daily';
    target: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  };
  reward: {
    xp: number;
    gems: number;
    badge?: string;
  };
  isSecret?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  type: 'xp-goal' | 'perfect-run' | 'speed-run' | 'no-mistakes' | 'streak';
  target: number;
  reward: {
    xp: number;
    gems: number;
    badge?: string;
  };
  progress: number;
  isCompleted: boolean;
}

export interface League {
  id: string;
  name: string;
  icon: string;
  color: string;
  xpThreshold: number;
  rewards: {
    promotion: { xp: number; gems: number; badge?: string };
    topFinish: { xp: number; gems: number; badge?: string };
  };
}

// Achievements data
export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    name: 'ก้าวแรก',
    description: 'ทำด่านแรกให้เสร็จ',
    icon: '👶',
    condition: { type: 'stages', target: 1 },
    reward: { xp: 10, gems: 5 }
  },
  {
    id: 'planet-discoverer',
    name: 'นักค้นพบดาวเคราะห์',
    description: 'ทำด่านเกี่ยวกับดาวเคราะห์ครบ 2 ด่าน',
    icon: '🪐',
    condition: { type: 'stages', target: 2 },
    reward: { xp: 25, gems: 10, badge: 'planet-explorer' }
  },
  {
    id: 'streak-master',
    name: 'เซียนสตรีค',
    description: 'เรียนติดต่อกัน 7 วัน',
    icon: '🔥',
    condition: { type: 'streak', target: 7 },
    reward: { xp: 50, gems: 20, badge: 'fire-master' }
  },
  {
    id: 'perfect-student',
    name: 'นักเรียนเก่ง',
    description: 'ทำด่านได้คะแนนเต็ม 5 ครั้ง',
    icon: '⭐',
    condition: { type: 'perfect', target: 5 },
    reward: { xp: 30, gems: 15, badge: 'perfect-scholar' }
  },
  {
    id: 'speed-runner',
    name: 'นักวิ่งความเร็ว',
    description: 'ทำด่านเสร็จใน 30 วินาที',
    icon: '⚡',
    condition: { type: 'speed', target: 30 },
    reward: { xp: 40, gems: 15, badge: 'lightning-bolt' }
  },
  {
    id: 'daily-warrior',
    name: 'นักรบประจำวัน',
    description: 'ทำภารกิจรายวันครบ 30 วัน',
    icon: '🗡️',
    condition: { type: 'daily', target: 30, timeframe: 'monthly' },
    reward: { xp: 100, gems: 50, badge: 'warrior-spirit' }
  },
  {
    id: 'xp-collector',
    name: 'นักสะสม XP',
    description: 'รวบรวม XP ได้ 1000 คะแนน',
    icon: '💎',
    condition: { type: 'xp', target: 1000, timeframe: 'all-time' },
    reward: { xp: 75, gems: 25, badge: 'gem-collector' }
  },
  {
    id: 'astronomy-expert',
    name: 'ผู้เชี่ยวชาญดาราศาสตร์',
    description: 'ผ่านด่านทั้งหมด',
    icon: '🌌',
    condition: { type: 'stages', target: 5 },
    reward: { xp: 200, gems: 100, badge: 'cosmic-master' },
    isSecret: false
  },
  {
    id: 'space-explorer-elite',
    name: 'นักสำรวจอวกาศระดับสูง',
    description: 'ได้ดาว 3 ดวงในทุกด่าน',
    icon: '🚀',
    condition: { type: 'perfect', target: 15 }, // 3 stars × 5 stages
    reward: { xp: 300, gems: 150, badge: 'elite-explorer' },
    isSecret: true
  }
];

// Badges data
export const badges: Badge[] = [
  {
    id: 'solar-explorer',
    name: 'นักสำรวจระบบสุริยะ',
    description: 'เรียนรู้เกี่ยวกับระบบสุริยะ',
    icon: '☀️',
    rarity: 'common',
    category: 'learning'
  },
  {
    id: 'planet-explorer',
    name: 'นักสำรวจดาวเคราะห์',
    description: 'ค้นพบดาวเคราะห์ทั้งหมด',
    icon: '🪐',
    rarity: 'rare',
    category: 'discovery'
  },
  {
    id: 'fire-master',
    name: 'เซียนไฟ',
    description: 'รักษาสตรีครายวัน',
    icon: '🔥',
    rarity: 'epic',
    category: 'commitment'
  },
  {
    id: 'perfect-scholar',
    name: 'นักเรียนเก่ง',
    description: 'ทำได้อย่างสมบูรณ์แบบ',
    icon: '⭐',
    rarity: 'rare',
    category: 'achievement'
  },
  {
    id: 'lightning-bolt',
    name: 'สายฟ้า',
    description: 'ทำเสร็จอย่างรวดเร็ว',
    icon: '⚡',
    rarity: 'epic',
    category: 'speed'
  },
  {
    id: 'cosmic-master',
    name: 'จอมจักรวาล',
    description: 'เชี่ยวชาญเรื่องอวกาศ',
    icon: '🌌',
    rarity: 'legendary',
    category: 'mastery'
  },
  {
    id: 'elite-explorer',
    name: 'นักสำรวจระดับสูง',
    description: 'สำรวจอวกาศอย่างเชี่ยวชาญ',
    icon: '🚀',
    rarity: 'legendary',
    category: 'elite'
  }
];

// Leagues data
export const leagues: League[] = [
  {
    id: 'bronze',
    name: 'ลีกทองแดง',
    icon: '🥉',
    color: '#CD7F32',
    xpThreshold: 0,
    rewards: {
      promotion: { xp: 50, gems: 25 },
      topFinish: { xp: 100, gems: 50 }
    }
  },
  {
    id: 'silver',
    name: 'ลีกเงิน',
    icon: '🥈',
    color: '#C0C0C0',
    xpThreshold: 500,
    rewards: {
      promotion: { xp: 75, gems: 40 },
      topFinish: { xp: 150, gems: 75 }
    }
  },
  {
    id: 'gold',
    name: 'ลีกทอง',
    icon: '🥇',
    color: '#FFD700',
    xpThreshold: 1000,
    rewards: {
      promotion: { xp: 100, gems: 60 },
      topFinish: { xp: 200, gems: 100 }
    }
  },
  {
    id: 'sapphire',
    name: 'ลีกแซฟไฟร์',
    icon: '💙',
    color: '#0F52BA',
    xpThreshold: 2000,
    rewards: {
      promotion: { xp: 150, gems: 80 },
      topFinish: { xp: 300, gems: 150 }
    }
  },
  {
    id: 'ruby',
    name: 'ลีกทับทิม',
    icon: '❤️',
    color: '#E0115F',
    xpThreshold: 3500,
    rewards: {
      promotion: { xp: 200, gems: 100 },
      topFinish: { xp: 400, gems: 200 }
    }
  },
  {
    id: 'emerald',
    name: 'ลีกมรกต',
    icon: '💚',
    color: '#50C878',
    xpThreshold: 5500,
    rewards: {
      promotion: { xp: 250, gems: 125 },
      topFinish: { xp: 500, gems: 250 }
    }
  },
  {
    id: 'amethyst',
    name: 'ลีกอเมทิสต์',
    icon: '💜',
    color: '#9966CC',
    xpThreshold: 8000,
    rewards: {
      promotion: { xp: 300, gems: 150 },
      topFinish: { xp: 600, gems: 300 }
    }
  },
  {
    id: 'pearl',
    name: 'ลีกไข่มุก',
    icon: '🤍',
    color: '#F8F6F0',
    xpThreshold: 11000,
    rewards: {
      promotion: { xp: 400, gems: 200 },
      topFinish: { xp: 800, gems: 400 }
    }
  },
  {
    id: 'obsidian',
    name: 'ลีกหินอบซิเดียน',
    icon: '🖤',
    color: '#3C3C3C',
    xpThreshold: 15000,
    rewards: {
      promotion: { xp: 500, gems: 250 },
      topFinish: { xp: 1000, gems: 500 }
    }
  },
  {
    id: 'diamond',
    name: 'ลีกเพชร',
    icon: '💎',
    color: '#B9F2FF',
    xpThreshold: 20000,
    rewards: {
      promotion: { xp: 750, gems: 375 },
      topFinish: { xp: 1500, gems: 750, badge: 'diamond-master' }
    }
  }
];

// Daily challenges generator
export const generateDailyChallenge = (date: string): DailyChallenge => {
  const challenges = [
    {
      type: 'xp-goal' as const,
      title: 'เก็บ XP',
      description: 'รวบรวม XP ให้ได้ 100 คะแนน',
      icon: '⭐',
      target: 100,
      reward: { xp: 25, gems: 10 }
    },
    {
      type: 'perfect-run' as const,
      title: 'การทำที่สมบูรณ์แบบ',
      description: 'ทำด่านให้ได้คะแนนเต็ม 1 ครั้ง',
      icon: '🎯',
      target: 1,
      reward: { xp: 50, gems: 15 }
    },
    {
      type: 'speed-run' as const,
      title: 'ความเร็วสูง',
      description: 'ทำด่านให้เสร็จภายใน 45 วินาที',
      icon: '⚡',
      target: 45,
      reward: { xp: 40, gems: 12 }
    },
    {
      type: 'no-mistakes' as const,
      title: 'ไม่มีข้อผิดพลาด',
      description: 'ทำด่านโดยไม่ตอบผิดเลย',
      icon: '✨',
      target: 1,
      reward: { xp: 35, gems: 15 }
    }
  ];

  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  
  return {
    id: `daily-${date}`,
    date,
    ...randomChallenge,
    progress: 0,
    isCompleted: false
  };
};

// XP calculation functions
export const calculateXpReward = (baseXp: number, streak: number, perfectRun: boolean, speedBonus: boolean): number => {
  let totalXp = baseXp;
  
  // Streak bonus (up to 50% extra)
  if (streak > 0) {
    const streakBonus = Math.min(streak * 0.05, 0.5);
    totalXp += baseXp * streakBonus;
  }
  
  // Perfect run bonus (25% extra)
  if (perfectRun) {
    totalXp += baseXp * 0.25;
  }
  
  // Speed bonus (15% extra)
  if (speedBonus) {
    totalXp += baseXp * 0.15;
  }
  
  return Math.round(totalXp);
};

// Hearts system
export const HEARTS_CONFIG = {
  MAX_HEARTS: 5,
  HEARTS_REFILL_TIME: 30 * 60 * 1000, // 30 minutes in milliseconds
  HEART_COST_TO_REFILL: 350, // gems needed to refill all hearts
};

// Shop items
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'hearts' | 'xp-boost' | 'streak-freeze' | 'gems' | 'cosmetic';
  price: number;
  currency: 'gems' | 'real-money';
  effect?: {
    duration?: number; // in minutes
    multiplier?: number;
  };
}

export const shopItems: ShopItem[] = [
  {
    id: 'refill-hearts',
    name: 'เติมหัวใจ',
    description: 'เติมหัวใจให้เต็ม',
    icon: '❤️',
    type: 'hearts',
    price: 350,
    currency: 'gems'
  },
  {
    id: 'xp-boost-1h',
    name: 'เพิ่ม XP 1 ชั่วโมง',
    description: 'ได้ XP เพิ่ม 2 เท่า เป็นเวลา 1 ชั่วโมง',
    icon: '⚡',
    type: 'xp-boost',
    price: 100,
    currency: 'gems',
    effect: { duration: 60, multiplier: 2 }
  },
  {
    id: 'streak-freeze',
    name: 'แช่แข็งสตรีค',
    description: 'ป้องกันสตรีคขาดในวันหนึ่ง',
    icon: '🧊',
    type: 'streak-freeze',
    price: 200,
    currency: 'gems'
  },
  {
    id: 'gems-pack-small',
    name: 'อัญมณี (เล็ก)',
    description: '100 อัญมณี',
    icon: '💎',
    type: 'gems',
    price: 99, // baht
    currency: 'real-money'
  },
  {
    id: 'gems-pack-medium',
    name: 'อัญมณี (กลาง)',
    description: '500 อัญมณี (โบนัส 50!)',
    icon: '💎',
    type: 'gems',
    price: 399, // baht
    currency: 'real-money'
  },
  {
    id: 'gems-pack-large',
    name: 'อัญมณี (ใหญ่)',
    description: '1200 อัญมณี (โบนัส 200!)',
    icon: '💎',
    type: 'gems',
    price: 999, // baht
    currency: 'real-money'
  }
];
