import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  CourseLesson, 
  CreateCourseLessonRequest, 
  UpdateCourseLessonRequest 
} from '../types';

export class CourseLessonService {
  private endpoint = API_CONFIG.ENDPOINTS.COURSE_LESSON;

  /**
   * Create a new course lesson
   */
  async createCourseLesson(courseLessonData: CreateCourseLessonRequest): Promise<ApiResponse<CourseLesson>> {
    return apiClient.post<ApiResponse<CourseLesson>>(`${this.endpoint}`, courseLessonData);
  }

  /**
   * Get all course lessons
   */
  async getAllCourseLessons(): Promise<ApiResponse<CourseLesson[]>> {
    return apiClient.get<ApiResponse<CourseLesson[]>>(`${this.endpoint}`);
  }

  /**
   * Get course lesson by ID
   */
  async getCourseLessonById(courseLessonId: string): Promise<ApiResponse<CourseLesson>> {
    return apiClient.get<ApiResponse<CourseLesson>>(`${this.endpoint}/${courseLessonId}`);
  }

  /**
   * Get course lessons by course ID
   */
  async getCourseLessonsByCourseId(courseId: string): Promise<ApiResponse<CourseLesson[]>> {
    return apiClient.get<ApiResponse<CourseLesson[]>>(`${this.endpoint}`, { courseId });
  }

  /**
   * Get course lesson by lesson ID
   */
  async getCourseLessonByLessonId(lessonId: string): Promise<ApiResponse<CourseLesson>> {
    return apiClient.get<ApiResponse<CourseLesson>>(`${this.endpoint}`, { lessonId });
  }

  /**
   * Update course lesson (full update)
   */
  async updateCourseLesson(courseLessonId: string, courseLessonData: UpdateCourseLessonRequest): Promise<ApiResponse<CourseLesson>> {
    return apiClient.put<ApiResponse<CourseLesson>>(`${this.endpoint}/update/${courseLessonId}`, courseLessonData);
  }

  /**
   * Patch course lesson (partial update)
   */
  async patchCourseLesson(courseLessonId: string, courseLessonData: Partial<UpdateCourseLessonRequest>): Promise<ApiResponse<CourseLesson>> {
    return apiClient.patch<ApiResponse<CourseLesson>>(`${this.endpoint}/patch/${courseLessonId}`, courseLessonData);
  }

  /**
   * Delete course lesson
   */
  async deleteCourseLesson(courseLessonId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${courseLessonId}`);
  }

  /**
   * Get course lessons ordered by sequence
   */
  async getCourseLessonsOrdered(courseId: string): Promise<ApiResponse<CourseLesson[]>> {
    return apiClient.get<ApiResponse<CourseLesson[]>>(`${this.endpoint}`, { 
      courseId, 
      sortBy: 'order',
      sortOrder: 'asc' 
    });
  }
}

// Export singleton instance
export const courseLessonService = new CourseLessonService();