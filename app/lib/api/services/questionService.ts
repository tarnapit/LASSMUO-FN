import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';

// Question types based on database schema
export interface Question {
  id: number;
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

export interface CreateQuestionRequest {
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

export interface UpdateQuestionRequest {
  stageId?: number;
  order?: number;
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCHING' | 'DRAG_DROP';
  question?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  points?: number;
  timeLimit?: number;
  payload?: any;
  explanation?: string;
  funFact?: string;
}

export class QuestionService {
  private endpoint = '/question';

  /**
   * Create a new question
   */
  async createQuestion(questionData: CreateQuestionRequest): Promise<ApiResponse<Question>> {
    return apiClient.post<ApiResponse<Question>>(this.endpoint, questionData);
  }

  /**
   * Get all questions
   */
  async getAllQuestions(): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(this.endpoint);
  }

  /**
   * Get question by ID
   */
  async getQuestionById(questionId: number): Promise<ApiResponse<Question>> {
    return apiClient.get<ApiResponse<Question>>(`${this.endpoint}/${questionId}`);
  }

  /**
   * Get questions by stage ID
   */
  async getQuestionsByStageId(stageId: number): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}?stageId=${stageId}`);
  }

  /**
   * Get questions by stage ID ordered by sequence
   */
  async getQuestionsOrderedByStage(stageId: number): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}?stageId=${stageId}&orderBy=order&sort=asc`);
  }

  /**
   * Get questions by difficulty
   */
  async getQuestionsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}?difficulty=${difficulty}`);
  }

  /**
   * Get questions by type
   */
  async getQuestionsByType(type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCHING' | 'DRAG_DROP'): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}?type=${type}`);
  }

  /**
   * Update question (full update)
   */
  async updateQuestion(questionId: number, questionData: UpdateQuestionRequest): Promise<ApiResponse<Question>> {
    return apiClient.put<ApiResponse<Question>>(`${this.endpoint}/${questionId}`, questionData);
  }

  /**
   * Patch question (partial update)
   */
  async patchQuestion(questionId: number, questionData: Partial<UpdateQuestionRequest>): Promise<ApiResponse<Question>> {
    return apiClient.patch<ApiResponse<Question>>(`${this.endpoint}/${questionId}`, questionData);
  }

  /**
   * Delete question
   */
  async deleteQuestion(questionId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${questionId}`);
  }

  /**
   * Get random questions for quiz generation
   */
  async getRandomQuestions(difficulty?: 'Easy' | 'Medium' | 'Hard', type?: string, count: number = 10): Promise<ApiResponse<Question[]>> {
    const params = new URLSearchParams();
    params.append('random', 'true');
    params.append('limit', count.toString());
    if (difficulty) params.append('difficulty', difficulty);
    if (type) params.append('type', type);
    
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}?${params.toString()}`);
  }

  /**
   * Validate answer for a question
   */
  async validateAnswer(questionId: number, answer: any): Promise<ApiResponse<{
    isCorrect: boolean;
    correctAnswer: any;
    explanation?: string;
    funFact?: string;
    points: number;
  }>> {
    return apiClient.post(`${this.endpoint}/${questionId}/validate`, { answer });
  }

  /**
   * Search questions by text
   */
  async searchQuestions(searchTerm: string): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}?search=${encodeURIComponent(searchTerm)}`);
  }

  /**
   * Bulk create questions
   */
  async bulkCreateQuestions(questions: CreateQuestionRequest[]): Promise<ApiResponse<Question[]>> {
    return apiClient.post<ApiResponse<Question[]>>(`${this.endpoint}/bulk-create`, { questions });
  }

  /**
   * Reorder questions in a stage
   */
  async reorderQuestions(stageId: number, questionOrders: { questionId: number; order: number }[]): Promise<ApiResponse<void>> {
    return apiClient.patch(`${this.endpoint}/reorder`, { stageId, orders: questionOrders });
  }

  /**
   * Get question statistics
   */
  async getQuestionStatistics(questionId: number): Promise<ApiResponse<{
    totalAttempts: number;
    correctAttempts: number;
    averageTime: number;
    successRate: number;
  }>> {
    return apiClient.get(`${this.endpoint}/${questionId}/statistics`);
  }
}

// Export singleton instance
export const questionService = new QuestionService();