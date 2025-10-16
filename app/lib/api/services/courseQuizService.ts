import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';

// Basic CourseQuiz types
interface CourseQuiz {
  id?: string;
  courseId: string;
  title: string;
  questions?: any[];
  totalQuestions?: number;
  timeLimit?: number;
  passingScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateCourseQuizRequest {
  courseId: string;
  title: string;
  questions?: any[];
  timeLimit?: number;
  passingScore?: number;
}

interface UpdateCourseQuizRequest {
  title?: string;
  questions?: any[];
  timeLimit?: number;
  passingScore?: number;
}

export class CourseQuizService {
  private endpoint = API_CONFIG.ENDPOINTS.COURSE_QUIZ;

  /**
   * Create a new course quiz
   */
  async createCourseQuiz(courseQuizData: CreateCourseQuizRequest): Promise<ApiResponse<CourseQuiz>> {
    return apiClient.post<ApiResponse<CourseQuiz>>(`${this.endpoint}`, courseQuizData);
  }

  /**
   * Get all course quizzes
   */
  async getAllCourseQuizzes(): Promise<ApiResponse<CourseQuiz[]>> {
    return apiClient.get<ApiResponse<CourseQuiz[]>>(`${this.endpoint}`);
  }

  /**
   * Get course quiz by ID
   */
  async getCourseQuizById(courseQuizId: string): Promise<ApiResponse<CourseQuiz>> {
    return apiClient.get<ApiResponse<CourseQuiz>>(`${this.endpoint}/${courseQuizId}`);
  }

  /**
   * Get course quizzes by course ID
   */
  async getCourseQuizzesByCourseId(courseId: string): Promise<ApiResponse<CourseQuiz[]>> {
    return apiClient.get<ApiResponse<CourseQuiz[]>>(`${this.endpoint}`, { courseId });
  }

  /**
   * Update course quiz (full update)
   */
  async updateCourseQuiz(courseQuizId: string, courseQuizData: UpdateCourseQuizRequest): Promise<ApiResponse<CourseQuiz>> {
    return apiClient.put<ApiResponse<CourseQuiz>>(`${this.endpoint}/${courseQuizId}`, courseQuizData);
  }

  /**
   * Patch course quiz (partial update)
   */
  async patchCourseQuiz(courseQuizId: string, courseQuizData: Partial<UpdateCourseQuizRequest>): Promise<ApiResponse<CourseQuiz>> {
    return apiClient.patch<ApiResponse<CourseQuiz>>(`${this.endpoint}/${courseQuizId}`, courseQuizData);
  }

  /**
   * Delete course quiz
   */
  async deleteCourseQuiz(courseQuizId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${courseQuizId}`);
  }

  /**
   * Get course quizzes ordered by sequence
   */
  async getCourseQuizzesOrdered(courseId: string): Promise<ApiResponse<CourseQuiz[]>> {
    return apiClient.get<ApiResponse<CourseQuiz[]>>(`${this.endpoint}`, { 
      courseId, 
      sortBy: 'order',
      sortOrder: 'asc' 
    });
  }
}

// Export singleton instance
export const courseQuizService = new CourseQuizService();