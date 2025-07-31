export interface MiniGameQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'true-false' | 'drag-drop' | 'ordering';
  options?: string[]; // สำหรับ multiple-choice
  correctAnswer: string | number | string[]; // สำหรับ answer ที่หลากหลาย
  blanks?: string[]; // สำหรับ fill-blank
  pairs?: { left: string; right: string }[]; // สำหรับ matching
  items?: string[]; // สำหรับ ordering/drag-drop
  correctOrder?: number[]; // สำหรับ ordering
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: 'solar-system' | 'planets' | 'earth-structure' | 'astronomy' | 'general';
  timeBonus?: number; // คะแนนโบนัสถ้าตอบเร็ว
}

export interface MiniGameAttempt {
  id: string;
  gameId: string;
  userId?: string;
  gameMode: 'score-challenge' | 'time-rush' | 'random-quiz';
  answers: Record<string, any>; // questionId -> answer
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  timeSpent: number; // เวลาที่ใช้ (วินาที)
  bonusPoints: number; // คะแนนโบนัสจากการตอบเร็ว
  startedAt: Date;
  completedAt?: Date;
  questionTimes: Record<string, number>; // เวลาที่ใช้ตอบแต่ละข้อ
}

export interface GameSession {
  id: string;
  gameMode: 'score-challenge' | 'time-rush' | 'random-quiz';
  questions: MiniGameQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  score: number;
  timeRemaining?: number; // สำหรับ time-rush
  isActive: boolean;
  startedAt: Date;
  questionStartTime: number; // timestamp สำหรับคำนวณเวลาตอบแต่ละข้อ
}

export interface GameResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  timeSpent: number;
  bonusPoints: number;
  gameMode: 'score-challenge' | 'time-rush' | 'random-quiz';
  breakdown: {
    questionId: string;
    correct: boolean;
    points: number;
    timeSpent: number;
    bonusPoints: number;
  }[];
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  streakDays: number;
  achievements: string[];
  attempts: MiniGameAttempt[];
  lastPlayedAt?: Date;
  scoreChallengeBest: number;
  timeRushBest: number;
  randomQuizBest: number;
}
