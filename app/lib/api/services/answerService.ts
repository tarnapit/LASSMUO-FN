import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  Answer, 
  CreateAnswerRequest, 
  UpdateAnswerRequest 
} from '../types';

export class AnswerService {
  private endpoint = API_CONFIG.ENDPOINTS.ANSWER;

  /**
   * Create a new answer
   */
  async createAnswer(answerData: CreateAnswerRequest): Promise<ApiResponse<Answer>> {
    return apiClient.post<ApiResponse<Answer>>(`${this.endpoint}/create`, answerData);
  }

  /**
   * Get all answers
   */
  async getAllAnswers(): Promise<ApiResponse<Answer[]>> {
    return apiClient.get<ApiResponse<Answer[]>>(`${this.endpoint}/get`);
  }

  /**
   * Get answer by ID
   */
  async getAnswerById(answerId: string): Promise<ApiResponse<Answer>> {
    return apiClient.get<ApiResponse<Answer>>(`${this.endpoint}/${answerId}`);
  }

  /**
   * Get answers by user ID
   */
  async getAnswersByUserId(userId: string): Promise<ApiResponse<Answer[]>> {
    return apiClient.get<ApiResponse<Answer[]>>(`${this.endpoint}`, { userId });
  }

  /**
   * Get answers by order ID (question)
   */
  async getAnswersByOrderId(orderId: string): Promise<ApiResponse<Answer[]>> {
    return apiClient.get<ApiResponse<Answer[]>>(`${this.endpoint}`, { orderId });
  }

  /**
   * Get answers by question ID  
   */
  async getAnswersByQuestionId(questionId: string): Promise<ApiResponse<Answer[]>> {
    return apiClient.get<ApiResponse<Answer[]>>(`${this.endpoint}/get`, { questionId });
  }

  /**
   * Get user's answer for specific question
   */
  async getUserAnswerForQuestion(userId: string, orderId: string): Promise<ApiResponse<Answer>> {
    return apiClient.get<ApiResponse<Answer>>(`${this.endpoint}`, { userId, orderId });
  }

  /**
   * Update answer (full update)
   */
  async updateAnswer(answerId: string, answerData: UpdateAnswerRequest): Promise<ApiResponse<Answer>> {
    return apiClient.put<ApiResponse<Answer>>(`${this.endpoint}/update/${answerId}`, answerData);
  }

  /**
   * Patch answer (partial update)
   */
  async patchAnswer(answerId: string, answerData: Partial<UpdateAnswerRequest>): Promise<ApiResponse<Answer>> {
    return apiClient.patch<ApiResponse<Answer>>(`${this.endpoint}/patch/${answerId}`, answerData);
  }

  /**
   * Delete answer
   */
  async deleteAnswer(answerId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/delete/${answerId}`);
  }

  /**
   * Submit multiple answers (quiz submission)
   */
  async submitQuizAnswers(answers: CreateAnswerRequest[]): Promise<ApiResponse<{
    answers: Answer[];
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    percentage: number;
  }>> {
    return apiClient.post(`${this.endpoint}/submit-quiz`, { answers });
  }

  /**
   * Get user's quiz results
   */
  async getUserQuizResults(userId: string, lessonId?: string): Promise<ApiResponse<{
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
    bestScore: number;
    recentAnswers: Answer[];
  }>> {
    const params = lessonId ? { userId, lessonId } : { userId };
    return apiClient.get(`${this.endpoint}/user-results`, params);
  }

  /**
   * Get answer statistics for a question
   */
  async getQuestionStats(orderId: string): Promise<ApiResponse<{
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    successRate: number;
    commonWrongAnswers: { answer: string; count: number }[];
  }>> {
    return apiClient.get(`${this.endpoint}/question-stats/${orderId}`);
  }

  /**
   * Get user's learning progress
   */
  async getUserProgress(userId: string): Promise<ApiResponse<{
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    progressPercentage: number;
    weakAreas: string[];
    strongAreas: string[];
  }>> {
    return apiClient.get(`${this.endpoint}/user-progress/${userId}`);
  }

  /**
   * Bulk create answers
   */
  async bulkCreateAnswers(answers: CreateAnswerRequest[]): Promise<ApiResponse<Answer[]>> {
    return apiClient.post<ApiResponse<Answer[]>>(`${this.endpoint}/bulk-create`, { answers });
  }

  /**
   * Get leaderboard based on answers
   */
  async getLeaderboard(courseId?: string, limit: number = 10): Promise<ApiResponse<{
    userId: string;
    userName: string;
    totalScore: number;
    correctAnswers: number;
    totalAnswers: number;
    rank: number;
  }[]>> {
    const params = courseId ? { courseId, limit } : { limit };
    return apiClient.get(`${this.endpoint}/leaderboard`, params);
  }
}

// Export singleton instance
export const answerService = new AnswerService();
