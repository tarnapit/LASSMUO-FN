import { ModuleProgress } from './learning';
import { QuizProgress } from './quiz';

export interface BaseQuestion {
  id: number;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number;
  explanation?: string;
  image?: string;
  animation?: string;
  funFact?: string;
  hints?: string[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  answers: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
    emoji?: string;
  }>;
}

export interface DragDropQuestion extends BaseQuestion {
  type: "drag-drop";
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
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "fill-blank";
  correctAnswer: string;
  alternatives?: string[];
  placeholder?: string;
}

export interface MatchPairsQuestion extends BaseQuestion {
  type: "match-pairs";
  pairs: Array<{
    left: { id: string; text: string; emoji?: string };
    right: { id: string; text: string; emoji?: string };
  }>;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  correctAnswer: boolean;
}

export type Question = 
  | MultipleChoiceQuestion 
  | DragDropQuestion 
  | FillBlankQuestion 
  | MatchPairsQuestion 
  | TrueFalseQuestion;

export interface StageData {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  prerequisites: number[];
  rewards: StageReward;
  character: {
    name: string;
    avatar: string;
    introduction: string;
    learningContent: string;
    completionMessage: string;
    encouragements?: string[];
    hints?: string[];
  };
  questions: Question[];
  totalStars: number;
  xpReward?: number;
  streakBonus?: boolean;
  healthSystem?: boolean;
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
