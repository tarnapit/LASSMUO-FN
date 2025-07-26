import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  Lesson, 
  CreateLessonRequest, 
  UpdateLessonRequest 
} from '../types';

export class LessonService {
  private endpoint = API_CONFIG.ENDPOINTS.LESSON;

  /**
   * Create a new lesson
   */
  async createLesson(lessonData: CreateLessonRequest): Promise<ApiResponse<Lesson>> {
    return apiClient.post<ApiResponse<Lesson>>(`${this.endpoint}/createLesson`, lessonData);
  }

  /**
   * Get all lessons
   */
  async getAllLessons(): Promise<ApiResponse<Lesson[]>> {
    return apiClient.get<ApiResponse<Lesson[]>>(`${this.endpoint}`);
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(lessonId: string): Promise<ApiResponse<Lesson>> {
    return apiClient.get<ApiResponse<Lesson>>(`${this.endpoint}/${lessonId}`);
  }

  /**
   * Get lessons by stage ID
   */
  async getLessonsByStageId(stageId: string): Promise<ApiResponse<Lesson[]>> {
    return apiClient.get<ApiResponse<Lesson[]>>(`${this.endpoint}`, { stageId });
  }

  /**
   * Update lesson (full update)
   */
  async updateLesson(lessonId: string, lessonData: UpdateLessonRequest): Promise<ApiResponse<Lesson>> {
    return apiClient.put<ApiResponse<Lesson>>(`${this.endpoint}/update/${lessonId}`, lessonData);
  }

  /**
   * Patch lesson (partial update)
   */
  async patchLesson(lessonId: string, lessonData: Partial<UpdateLessonRequest>): Promise<ApiResponse<Lesson>> {
    return apiClient.patch<ApiResponse<Lesson>>(`${this.endpoint}/patchLesson/${lessonId}`, lessonData);
  }

  /**
   * Delete lesson
   */
  async deleteLesson(lessonId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/deleteLesson/${lessonId}`);
  }

  /**
   * Get lessons ordered by sequence
   */
  async getLessonsOrdered(stageId: string): Promise<ApiResponse<Lesson[]>> {
    return apiClient.get<ApiResponse<Lesson[]>>(`${this.endpoint}`, { 
      stageId, 
      sortBy: 'order',
      sortOrder: 'asc' 
    });
  }

  /**
   * Search lessons by title or content
   */
  async searchLessons(searchTerm: string): Promise<ApiResponse<Lesson[]>> {
    return apiClient.get<ApiResponse<Lesson[]>>(`${this.endpoint}`, { 
      search: searchTerm 
    });
  }

  /**
   * Get lesson duration statistics
   */
  async getLessonStats(lessonId: string): Promise<ApiResponse<{
    totalDuration: number;
    completionRate: number;
    averageScore: number;
  }>> {
    return apiClient.get(`${this.endpoint}/${lessonId}/stats`);
  }
}

// Export singleton instance
export const lessonService = new LessonService();
