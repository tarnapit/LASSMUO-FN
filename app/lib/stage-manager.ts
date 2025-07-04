// Stage mechanics inspired by Duolingo
import { Question, StageData, StageProgress } from '../types/stage';
import { calculateXpReward, HEARTS_CONFIG } from '../data/gamification';

export interface StageSession {
  stageId: number;
  questions: Question[];
  currentQuestionIndex: number;
  hearts: number;
  score: number;
  xp: number;
  startTime: number;
  answers: Array<{
    questionId: number;
    userAnswer: any;
    isCorrect: boolean;
    timeSpent: number;
    hintsUsed: number;
  }>;
  mistakes: number;
  hintsUsed: number;
  isCompleted: boolean;
  isPerfect: boolean;
  completionTime: number;
}

export interface QuestionFeedback {
  type: 'correct' | 'incorrect' | 'timeout';
  message: string;
  explanation?: string;
  funFact?: string;
  encouragement?: string;
  correctAnswer?: string;
  xpEarned?: number;
  heartsLost?: number;
}

export class StageManager {
  private session: StageSession;
  private stageData: StageData;
  private playerStreak: number;

  constructor(stageData: StageData, playerStreak: number = 0) {
    this.stageData = stageData;
    this.playerStreak = playerStreak;
    this.session = this.initializeSession();
  }

  private initializeSession(): StageSession {
    return {
      stageId: this.stageData.id,
      questions: this.shuffleQuestions(this.stageData.questions),
      currentQuestionIndex: 0,
      hearts: this.stageData.healthSystem ? HEARTS_CONFIG.MAX_HEARTS : -1,
      score: 0,
      xp: 0,
      startTime: Date.now(),
      answers: [],
      mistakes: 0,
      hintsUsed: 0,
      isCompleted: false,
      isPerfect: false,
      completionTime: 0
    };
  }

  private shuffleQuestions(questions: Question[]): Question[] {
    // Mix different question types for variety
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getCurrentQuestion(): Question | null {
    if (this.session.currentQuestionIndex >= this.session.questions.length) {
      return null;
    }
    return this.session.questions[this.session.currentQuestionIndex];
  }

  getProgress(): { current: number; total: number; percentage: number } {
    const current = this.session.currentQuestionIndex;
    const total = this.session.questions.length;
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return { current, total, percentage };
  }

  submitAnswer(answer: any): QuestionFeedback {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error('No current question available');
    }

    const startTime = Date.now();
    const timeSpent = startTime - this.session.startTime;
    const isCorrect = this.checkAnswer(currentQuestion, answer);
    
    // Record the answer
    this.session.answers.push({
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeSpent,
      hintsUsed: this.session.hintsUsed
    });

    let feedback: QuestionFeedback;

    if (isCorrect) {
      feedback = this.handleCorrectAnswer(currentQuestion, timeSpent);
    } else {
      feedback = this.handleIncorrectAnswer(currentQuestion, answer);
    }

    // Move to next question or complete stage
    this.session.currentQuestionIndex++;
    
    if (this.session.currentQuestionIndex >= this.session.questions.length) {
      this.completeStage();
    }

    return feedback;
  }

  private checkAnswer(question: Question, answer: any): boolean {
    switch (question.type) {
      case 'multiple-choice':
        return question.answers.some(a => a.id === answer && a.isCorrect);
      
      case 'true-false':
        return question.correctAnswer === answer;
      
      case 'fill-blank':
        const userAnswer = answer.toLowerCase().trim();
        const correctAnswer = question.correctAnswer.toLowerCase().trim();
        return userAnswer === correctAnswer || 
               (question.alternatives?.some(alt => alt.toLowerCase().trim() === userAnswer) || false);
      
      case 'drag-drop':
        return this.checkDragDropAnswer(question, answer);
      
      case 'match-pairs':
        return this.checkMatchPairsAnswer(question, answer);
      
      default:
        return false;
    }
  }

  private checkDragDropAnswer(question: Question, answer: any): boolean {
    if (question.type !== 'drag-drop') return false;
    
    return question.dragItems.every(item => 
      answer[item.id] === item.correctPosition
    );
  }

  private checkMatchPairsAnswer(question: Question, answer: any): boolean {
    if (question.type !== 'match-pairs') return false;
    
    return question.pairs.every(pair => 
      answer[pair.left.id] === pair.right.id
    );
  }

  private handleCorrectAnswer(question: Question, timeSpent: number): QuestionFeedback {
    const baseXp = question.points;
    const isSpeedBonus = question.timeLimit ? timeSpent < question.timeLimit * 0.7 : false;
    const xpEarned = calculateXpReward(baseXp, this.playerStreak, true, isSpeedBonus);
    
    this.session.score += question.points;
    this.session.xp += xpEarned;

    // Get random encouragement
    const encouragements = this.stageData.character.encouragements || ['เยี่ยม!', 'ถูกต้อง!', 'ดีมาก!'];
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

    return {
      type: 'correct',
      message: encouragement,
      explanation: question.explanation,
      funFact: question.funFact,
      encouragement,
      xpEarned
    };
  }

  private handleIncorrectAnswer(question: Question, answer: any): QuestionFeedback {
    this.session.mistakes++;
    
    let heartsLost = 0;
    if (this.session.hearts > 0) {
      this.session.hearts--;
      heartsLost = 1;
    }

    // End stage if no hearts left
    if (this.session.hearts === 0) {
      this.session.isCompleted = true;
      this.session.completionTime = Date.now() - this.session.startTime;
    }

    return {
      type: 'incorrect',
      message: 'คำตอบไม่ถูกต้อง',
      explanation: question.explanation,
      correctAnswer: this.getCorrectAnswerText(question),
      heartsLost
    };
  }

  private getCorrectAnswerText(question: Question): string {
    switch (question.type) {
      case 'multiple-choice':
        const correctAnswer = question.answers.find(a => a.isCorrect);
        return correctAnswer ? correctAnswer.text : '';
      
      case 'true-false':
        return question.correctAnswer ? 'จริง' : 'เท็จ';
      
      case 'fill-blank':
        return question.correctAnswer;
      
      default:
        return '';
    }
  }

  private completeStage(): void {
    this.session.isCompleted = true;
    this.session.completionTime = Date.now() - this.session.startTime;
    this.session.isPerfect = this.session.mistakes === 0;
    
    // Calculate final XP with bonuses
    if (this.session.isPerfect) {
      this.session.xp += this.stageData.xpReward || 0;
    }
  }

  useHint(): string | null {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion || !currentQuestion.hints) {
      return null;
    }

    const hints = currentQuestion.hints;
    const hintIndex = Math.min(this.session.hintsUsed, hints.length - 1);
    this.session.hintsUsed++;
    
    return hints[hintIndex];
  }

  getSession(): StageSession {
    return { ...this.session };
  }

  getResults(): StageResults {
    if (!this.session.isCompleted) {
      throw new Error('Stage not completed yet');
    }

    const totalQuestions = this.session.questions.length;
    const correctAnswers = this.session.answers.filter(a => a.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    // Calculate stars (1-3 based on performance)
    let stars = 1;
    if (accuracy >= 80 && this.session.mistakes <= 2) stars = 2;
    if (accuracy >= 95 && this.session.mistakes === 0) stars = 3;
    
    return {
      stageId: this.session.stageId,
      completed: this.session.isCompleted,
      stars,
      score: this.session.score,
      xp: this.session.xp,
      totalQuestions,
      correctAnswers,
      accuracy,
      mistakes: this.session.mistakes,
      hintsUsed: this.session.hintsUsed,
      completionTime: this.session.completionTime,
      isPerfect: this.session.isPerfect,
      achievements: this.calculateAchievements()
    };
  }

  private calculateAchievements(): string[] {
    const achievements: string[] = [];
    
    if (this.session.isPerfect) {
      achievements.push('perfect-run');
    }
    
    if (this.session.completionTime < 60000) { // Under 1 minute
      achievements.push('speed-demon');
    }
    
    if (this.session.hintsUsed === 0) {
      achievements.push('no-help-needed');
    }
    
    return achievements;
  }
}

export interface StageResults {
  stageId: number;
  completed: boolean;
  stars: number;
  score: number;
  xp: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  mistakes: number;
  hintsUsed: number;
  completionTime: number;
  isPerfect: boolean;
  achievements: string[];
}

// Utility functions for stage management
export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${remainingSeconds}s`;
};

export const getStageStatusColor = (progress: StageProgress): string => {
  if (!progress.isUnlocked) return '#94a3b8'; // gray
  if (!progress.isCompleted) return '#3b82f6'; // blue
  if (progress.stars === 3) return '#eab308'; // gold
  if (progress.stars === 2) return '#6b7280'; // silver
  return '#a3a3a3'; // bronze
};

export const getStageStatusIcon = (progress: StageProgress): string => {
  if (!progress.isUnlocked) return '🔒';
  if (!progress.isCompleted) return '⭕';
  if (progress.stars === 3) return '🏆';
  if (progress.stars === 2) return '🥈';
  return '🥉';
};

// Question type specific utilities
export const getQuestionTypeIcon = (type: string): string => {
  switch (type) {
    case 'multiple-choice': return '📝';
    case 'true-false': return '✅';
    case 'fill-blank': return '📝';
    case 'drag-drop': return '🎯';
    case 'match-pairs': return '🔗';
    default: return '❓';
  }
};

export const getQuestionDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy': return '#10b981'; // green
    case 'medium': return '#f59e0b'; // yellow
    case 'hard': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
};
