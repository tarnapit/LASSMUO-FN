// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: DifficultyLevel;
  questions: Question[];
  timeLimit?: number; // in seconds
  passScore: number; // percentage
  createdAt: Date;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  image?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  FILL_IN_BLANK = "fill_in_blank",
  MATCHING = "matching",
}

export enum QuizCategory {
  SOLAR_SYSTEM = "solar_system",
  STARS = "stars",
  GALAXIES = "galaxies",
  CONSTELLATIONS = "constellations",
  SPACE_EXPLORATION = "space_exploration",
  COSMOLOGY = "cosmology",
}

export enum DifficultyLevel {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  EXPERT = "expert",
}

// Learning Module Types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: DifficultyLevel;
  content: LearningContent[];
  estimatedTime: number; // in minutes
  prerequisites?: string[]; // module ids
  quiz?: string; // quiz id
}

export interface LearningContent {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  media?: MediaContent;
}

export enum ContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  INTERACTIVE = "interactive",
}

export interface MediaContent {
  url: string;
  alt?: string;
  caption?: string;
}

// Game Types
export interface MiniGame {
  id: string;
  title: string;
  description: string;
  type: GameType;
  difficulty: DifficultyLevel;
  maxScore: number;
  timeLimit?: number;
}

export enum GameType {
  PLANET_MATCH = "planet_match",
  CONSTELLATION_DRAW = "constellation_draw",
  SOLAR_SYSTEM_BUILDER = "solar_system_builder",
  ASTEROID_DODGE = "asteroid_dodge",
}

// Progress Types
export interface UserProgress {
  userId: string;
  moduleId: string;
  completed: boolean;
  score?: number;
  timeSpent: number; // in seconds
  completedAt?: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: UserAnswer[];
  completedAt: Date;
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
}

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  reward: {
    experience: number;
    badge?: string;
  };
}

export enum AchievementCategory {
  LEARNING = "learning",
  QUIZ = "quiz",
  SOCIAL = "social",
  EXPLORATION = "exploration",
}

export interface AchievementRequirement {
  type: "quiz_score" | "modules_completed" | "streak_days" | "total_experience";
  value: number;
  category?: QuizCategory;
}

// UI Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
