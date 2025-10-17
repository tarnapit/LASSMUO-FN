import { ModuleProgress } from './learning';
import { QuizProgress } from './quiz';
import { GameStats } from './mini-game';

// Updated to match database schema
export interface BaseQuestion {
  id: number;
  stageId: number;
  order: number;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  timeLimit: number;
  explanation?: string;
  funFact?: string;
  image?: string; // เพิ่มฟิลด์สำหรับรูปภาพประกอบ
  createdAt: string;
  updatedAt: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "MULTIPLE_CHOICE";
  payload: {
    options: Array<{
      id: number;
      text: string;
      isCorrect: boolean;
      emoji?: string;
    }>;
  };
}

export interface DragDropQuestion extends BaseQuestion {
  type: "DRAG_DROP";
  payload: {
    dragItems: Array<{
      id: string;
      text: string;
      emoji?: string;
      correctPosition: number;
    }>;
    dropZones: Array<{
      id: number;
      label: string;
    }>;
  };
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "FILL_BLANK";
  payload: {
    correctAnswer: string;
    alternatives?: string[];
    placeholder?: string;
    hints?: string[];
  };
}

export interface MatchPairsQuestion extends BaseQuestion {
  type: "MATCHING";
  payload: {
    pairs: Array<{
      left: { id: string; text: string; emoji?: string };
      right: { id: string; text: string; emoji?: string };
    }>;
  };
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "TRUE_FALSE";
  payload: {
    correctAnswer: boolean;
  };
}

export type Question = 
  | MultipleChoiceQuestion 
  | DragDropQuestion 
  | FillBlankQuestion 
  | MatchPairsQuestion 
  | TrueFalseQuestion;

// Updated Stage interface to match database
export interface Stage {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  totalStars: number;
  xpReward: number;
  streakBonus: boolean;
  healthSystem: boolean;
  rewards: any; // JSON field in database
  maxStars: number;
  requiredStarsToUnlockNext: number;
  createdAt: string;
  updatedAt: string;
}

export interface StageCharacter {
  id: number;
  stageId: number;
  name: string;
  avatar: string;
  introduction: string;
  learningContent: string;
  completionMessage: string;
  encouragements: string[]; // JSON array
  hints: string[]; // JSON array
  createdAt: string;
  updatedAt: string;
}

export interface StagePrerequisite {
  id: number;
  stageId: number;
  prerequisiteStageId: number;
  createdAt: string;
}

// Composite type for full stage data
export interface StageData {
  stage: Stage;
  character?: StageCharacter;
  prerequisites: StagePrerequisite[];
  questions: Question[];
}

export interface StageReward {
  stars: number;
  points: number;
  xp?: number;
  gems?: number;
  badges?: string[];
  unlocksStages?: number[];
  achievementUnlocks?: string[];
}

// User stage progress from database
export interface UserStageProgress {
  id: string;
  userId: string;
  stageId: number;
  isCompleted: boolean;
  currentScore: number;
  bestScore: number;
  starsEarned: number;
  attempts: number;
  lastAttemptAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface StageProgress {
  stageId: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  bestScore: number;
  attempts: number;
  lastAttempt?: Date;
  xpEarned: number;
  perfectRuns: number;
  averageTime: number;
  mistakeCount: number;
  hintsUsed: number;
  achievements: string[];
}

export interface PlayerProgress {
  totalStars: number;
  totalPoints: number;
  totalXp: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  maxHearts: number;
  completedStages: number[];
  currentStage: number;
  stages: Record<number, StageProgress>;
  achievements: string[];
  badges: string[];
  // เพิ่ม learning progress
  learningProgress?: {
    completedModules: string[];
    totalLearningTime: number; // เวลารวมที่ใช้เรียน (นาที)
    modules: Record<string, ModuleProgress>;
  };
  // เพิ่ม quiz progress
  quizProgress?: {
    quizzes: Record<string, QuizProgress>;
  };
  // เพิ่ม mini-game stats
  miniGameStats?: GameStats;
  // Duolingo-style features
  dailyGoal: {
    xpTarget: number;
    currentXp: number;
    isCompleted: boolean;
    streak: number;
  };
  weeklyProgress: {
    mondayXp: number;
    tuesdayXp: number;
    wednesdayXp: number;
    thursdayXp: number;
    fridayXp: number;
    saturdayXp: number;
    sundayXp: number;
  };
  league: {
    currentLeague: 'bronze' | 'silver' | 'gold' | 'sapphire' | 'ruby' | 'emerald' | 'amethyst' | 'pearl' | 'obsidian' | 'diamond';
    position: number;
    xpThisWeek: number;
  };
}
