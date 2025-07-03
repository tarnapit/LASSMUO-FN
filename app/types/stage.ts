import { ModuleProgress } from './learning';

export interface Question {
  id: number;
  question: string;
  answers: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
  }>;
  explanation?: string;
  image?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

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
  };
  questions: Question[];
  totalStars: number;
}

export interface StageReward {
  stars: number;
  points: number;
  badges?: string[];
  unlocksStages?: number[];
}

export interface StageProgress {
  stageId: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  bestScore: number;
  attempts: number;
  lastAttempt?: Date;
}

export interface PlayerProgress {
  totalStars: number;
  totalPoints: number;
  completedStages: number[];
  currentStage: number;
  stages: Record<number, StageProgress>;
  // เพิ่ม learning progress
  learningProgress?: {
    completedModules: string[];
    totalLearningTime: number; // เวลารวมที่ใช้เรียน (นาที)
    modules: Record<string, ModuleProgress>;
  };
}
