import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';

// Basic Question types - ใช้ any สำหรับตอนนี้เพื่อหลีกเลี่ยง type errors
interface Question {
  id?: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateQuestionRequest {
  question: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: string;
  category?: string;
}

interface UpdateQuestionRequest {
  question?: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: string;
  category?: string;
}

export class QuestionService {
  private endpoint = API_CONFIG.ENDPOINTS.QUESTION;

  /**
   * Create a new question
   */
  async createQuestion(questionData: CreateQuestionRequest): Promise<ApiResponse<Question>> {
    return apiClient.post<ApiResponse<Question>>(`${this.endpoint}`, questionData);
  }

  /**
   * Get all questions
   */
  async getAllQuestions(): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}`);
  }

  /**
   * Get question by ID
   */
  async getQuestionById(questionId: string): Promise<ApiResponse<Question>> {
    return apiClient.get<ApiResponse<Question>>(`${this.endpoint}/${questionId}`);
  }

  /**
   * Get questions by category
   */
  async getQuestionsByCategory(category: string): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}`, { category });
  }

  /**
   * Get questions by difficulty
   */
  async getQuestionsByDifficulty(difficulty: string): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}`, { difficulty });
  }

  /**
   * Update question (full update)
   */
  async updateQuestion(questionId: string, questionData: UpdateQuestionRequest): Promise<ApiResponse<Question>> {
    return apiClient.put<ApiResponse<Question>>(`${this.endpoint}/${questionId}`, questionData);
  }

  /**
   * Patch question (partial update)
   */
  async patchQuestion(questionId: string, questionData: Partial<UpdateQuestionRequest>): Promise<ApiResponse<Question>> {
    return apiClient.patch<ApiResponse<Question>>(`${this.endpoint}/${questionId}`, questionData);
  }

  /**
   * Delete question
   */
  async deleteQuestion(questionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${questionId}`);
  }

  /**
   * Get random questions for quiz generation
   */
  async getRandomQuestions(category?: string, difficulty?: string, count: number = 10): Promise<ApiResponse<Question[]>> {
    const params: any = { 
      random: true,
      limit: count 
    };
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}`, params);
  }

  /**
   * Validate answer for a question
   */
  async validateAnswer(questionId: string, answer: string): Promise<ApiResponse<{
    isCorrect: boolean;
    correctAnswer?: string;
    explanation?: string;
  }>> {
    return apiClient.post(`${this.endpoint}/${questionId}/validate`, { answer });
  }

  /**
   * Search questions by text
   */
  async searchQuestions(searchTerm: string): Promise<ApiResponse<Question[]>> {
    return apiClient.get<ApiResponse<Question[]>>(`${this.endpoint}`, { 
      search: searchTerm 
    });
  }

  /**
   * Bulk create questions
   */
  async bulkCreateQuestions(questions: CreateQuestionRequest[]): Promise<ApiResponse<Question[]>> {
    return apiClient.post<ApiResponse<Question[]>>(`${this.endpoint}/bulk-create`, { questions });
  }
}

// Export singleton instance
export const questionService = new QuestionService();