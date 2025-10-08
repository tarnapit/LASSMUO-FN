import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';

// Mini Game types based on database schema
export interface MiniGameQuestion {
  id: string;
  stageId: number;
  order: number;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCHING' | 'DRAG_DROP';
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  timeLimit: number;
  payload: any; // JSON data containing question specifics
  explanation?: string;
  funFact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MiniGameResult {
  id: string;
  userId: string;
  stageId: number;
  score: number;
  timeSpent: number;
  completed: boolean;
  createdAt: string;
}

export interface CreateMiniGameQuestionRequest {
  stageId: number;
  order: number;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCHING' | 'DRAG_DROP';
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  timeLimit: number;
  payload: any;
  explanation?: string;
  funFact?: string;
}

export interface CreateMiniGameResultRequest {
  userId: string;
  stageId: number;
  score: number;
  timeSpent: number;
  completed: boolean;
}

export class MiniGameService {
  private questionEndpoint = `${API_CONFIG.BASE_URL}/mini-game-questions`;
  private resultEndpoint = `${API_CONFIG.BASE_URL}/mini-game-results`;

  // ===== Mini Game Questions =====

  /**
   * Create a new mini game question
   */
  async createQuestion(questionData: CreateMiniGameQuestionRequest): Promise<ApiResponse<MiniGameQuestion>> {
    return apiClient.post<ApiResponse<MiniGameQuestion>>(this.questionEndpoint, questionData);
  }

  /**
   * Get all mini game questions
   */
  async getAllQuestions(): Promise<ApiResponse<MiniGameQuestion[]>> {
    return apiClient.get<ApiResponse<MiniGameQuestion[]>>(this.questionEndpoint);
  }

  /**
   * Get questions by stage ID
   */
  async getQuestionsByStageId(stageId: number): Promise<ApiResponse<MiniGameQuestion[]>> {
    return apiClient.get<ApiResponse<MiniGameQuestion[]>>(`${this.questionEndpoint}?stageId=${stageId}`);
  }

  /**
   * Get questions by stage ID ordered by sequence
   */
  async getQuestionsOrderedByStage(stageId: number): Promise<ApiResponse<MiniGameQuestion[]>> {
    return apiClient.get<ApiResponse<MiniGameQuestion[]>>(`${this.questionEndpoint}?stageId=${stageId}&orderBy=order&sort=asc`);
  }

  /**
   * Get question by ID
   */
  async getQuestionById(questionId: string): Promise<ApiResponse<MiniGameQuestion>> {
    return apiClient.get<ApiResponse<MiniGameQuestion>>(`${this.questionEndpoint}/${questionId}`);
  }

  /**
   * Update mini game question
   */
  async updateQuestion(questionId: string, questionData: Partial<CreateMiniGameQuestionRequest>): Promise<ApiResponse<MiniGameQuestion>> {
    return apiClient.put<ApiResponse<MiniGameQuestion>>(`${this.questionEndpoint}/${questionId}`, questionData);
  }

  /**
   * Delete mini game question
   */
  async deleteQuestion(questionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.questionEndpoint}/${questionId}`);
  }

  /**
   * Get questions by difficulty
   */
  async getQuestionsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<ApiResponse<MiniGameQuestion[]>> {
    return apiClient.get<ApiResponse<MiniGameQuestion[]>>(`${this.questionEndpoint}?difficulty=${difficulty}`);
  }

  /**
   * Get questions by type
   */
  async getQuestionsByType(type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCHING' | 'DRAG_DROP'): Promise<ApiResponse<MiniGameQuestion[]>> {
    return apiClient.get<ApiResponse<MiniGameQuestion[]>>(`${this.questionEndpoint}?type=${type}`);
  }

  /**
   * Get random questions for mini games
   */
  async getRandomQuestions(count: number = 10, difficulty?: 'Easy' | 'Medium' | 'Hard'): Promise<ApiResponse<MiniGameQuestion[]>> {
    const params = new URLSearchParams();
    params.append('random', 'true');
    params.append('limit', count.toString());
    if (difficulty) {
      params.append('difficulty', difficulty);
    }
    return apiClient.get<ApiResponse<MiniGameQuestion[]>>(`${this.questionEndpoint}?${params.toString()}`);
  }

  // ===== Mini Game Results =====

  /**
   * Create a new mini game result
   */
  async createResult(resultData: CreateMiniGameResultRequest): Promise<ApiResponse<MiniGameResult>> {
    return apiClient.post<ApiResponse<MiniGameResult>>(this.resultEndpoint, resultData);
  }

  /**
   * Get all results
   */
  async getAllResults(): Promise<ApiResponse<MiniGameResult[]>> {
    return apiClient.get<ApiResponse<MiniGameResult[]>>(this.resultEndpoint);
  }

  /**
   * Get results by user ID
   */
  async getResultsByUserId(userId: string): Promise<ApiResponse<MiniGameResult[]>> {
    return apiClient.get<ApiResponse<MiniGameResult[]>>(`${this.resultEndpoint}?userId=${userId}`);
  }

  /**
   * Get results by stage ID
   */
  async getResultsByStageId(stageId: number): Promise<ApiResponse<MiniGameResult[]>> {
    return apiClient.get<ApiResponse<MiniGameResult[]>>(`${this.resultEndpoint}?stageId=${stageId}`);
  }

  /**
   * Get user's result for specific stage
   */
  async getUserStageResult(userId: string, stageId: number): Promise<ApiResponse<MiniGameResult | null>> {
    return apiClient.get<ApiResponse<MiniGameResult | null>>(`${this.resultEndpoint}?userId=${userId}&stageId=${stageId}&latest=true`);
  }

  /**
   * Get user's best score for a stage
   */
  async getUserBestScore(userId: string, stageId: number): Promise<ApiResponse<MiniGameResult | null>> {
    return apiClient.get<ApiResponse<MiniGameResult | null>>(`${this.resultEndpoint}?userId=${userId}&stageId=${stageId}&bestScore=true`);
  }

  /**
   * Get leaderboard for a stage
   */
  async getStageLeaderboard(stageId: number, limit: number = 10): Promise<ApiResponse<MiniGameResult[]>> {
    return apiClient.get<ApiResponse<MiniGameResult[]>>(`${this.resultEndpoint}?stageId=${stageId}&orderBy=score&sort=desc&limit=${limit}`);
  }

  /**
   * Get user's completed stages
   */
  async getUserCompletedStages(userId: string): Promise<ApiResponse<MiniGameResult[]>> {
    return apiClient.get<ApiResponse<MiniGameResult[]>>(`${this.resultEndpoint}?userId=${userId}&completed=true`);
  }

  /**
   * Update mini game result
   */
  async updateResult(resultId: string, resultData: Partial<CreateMiniGameResultRequest>): Promise<ApiResponse<MiniGameResult>> {
    return apiClient.put<ApiResponse<MiniGameResult>>(`${this.resultEndpoint}/${resultId}`, resultData);
  }

  /**
   * Delete mini game result
   */
  async deleteResult(resultId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.resultEndpoint}/${resultId}`);
  }

  // ===== Utility Methods =====

  /**
   * Validate answer for a mini game question
   */
  async validateAnswer(questionId: string, userAnswer: any): Promise<ApiResponse<{
    isCorrect: boolean;
    correctAnswer: any;
    explanation?: string;
    funFact?: string;
    points: number;
  }>> {
    return apiClient.post(`${this.questionEndpoint}/${questionId}/validate`, { answer: userAnswer });
  }

  /**
   * Get stage statistics
   */
  async getStageStatistics(stageId: number): Promise<ApiResponse<{
    totalQuestions: number;
    averageScore: number;
    completionRate: number;
    averageTime: number;
    popularityRank: number;
  }>> {
    return apiClient.get(`${this.questionEndpoint}/stage/${stageId}/statistics`);
  }

  /**
   * Get user progress across all stages
   */
  async getUserProgress(userId: string): Promise<ApiResponse<{
    totalStagesCompleted: number;
    totalScore: number;
    averageScore: number;
    completionPercentage: number;
    currentStreak: number;
    badges: string[];
  }>> {
    return apiClient.get(`${this.resultEndpoint}/user/${userId}/progress`);
  }
}

// Export singleton instance
export const miniGameService = new MiniGameService();