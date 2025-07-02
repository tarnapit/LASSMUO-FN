export interface MiniGame {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Knowledge' | 'Memory' | 'Puzzle' | 'Action';
  estimatedTime: string;
  points: number;
}

export interface GameScore {
  gameId: string;
  userId?: string;
  score: number;
  timeSpent: number;
  completedAt: Date;
  difficulty: string;
}

export interface PlanetMatchGame {
  planets: Planet[];
  facts: string[];
  currentPlanet: Planet | null;
  currentFact: string | null;
  score: number;
  lives: number;
  timeLeft: number;
  gameState: 'waiting' | 'playing' | 'finished';
}

export interface Planet {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  facts: string[];
  image?: string;
}

export interface MemoryCard {
  id: string;
  content: string;
  type: 'planet' | 'fact';
  isFlipped: boolean;
  isMatched: boolean;
  pairId: string;
}

export interface SolarSystemQuiz {
  questions: QuizQuestion[];
  currentQuestion: number;
  score: number;
  timeLeft: number;
  answers: (string | null)[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
}
