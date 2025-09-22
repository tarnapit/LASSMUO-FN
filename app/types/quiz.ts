export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'text';
  options?: string[]; // สำหรับ multiple-choice
  correctAnswer: string | number; // index สำหรับ multiple-choice, text สำหรับ text type
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  _originalCorrectAnswer?: number; // เก็บ index ต้นฉบับก่อน shuffle (สำหรับ multiple-choice)
}

export interface Quiz {
  id: string;
  moduleId: string; // เชื่อมโยงกับ learning module
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // เวลาในการทำ quiz (นาที)
  passingScore: number; // คะแนนขั้นต่ำที่ผ่าน (เปอร์เซ็นต์)
  maxAttempts?: number; // จำนวนครั้งสูงสุดที่ทำได้
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId?: string;
  answers: Record<string, string | number>; // questionId -> answer
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // เวลาที่ใช้ (วินาที)
  attemptNumber: number;
}

export interface QuizProgress {
  quizId: string;
  attempts: QuizAttempt[];
  bestScore: number;
  bestPercentage: number;
  totalAttempts: number;
  passed: boolean;
  lastAttemptAt?: Date;
}

export interface QuizSession {
  sessionKey: string;
  quizId: string;
  shuffledQuiz: Quiz;
  questionMappings: { [questionId: string]: OptionMapping[] };
  startedAt: Date;
}

export interface OptionMapping {
  originalIndex: number;
  shuffledIndex: number;
}
