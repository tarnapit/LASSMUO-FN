import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  Course, 
  CreateCourseRequest, 
  UpdateCourseRequest 
} from '../types';

export class CourseService {
  private endpoint = API_CONFIG.ENDPOINTS.COURSE;

  /**
   * Create a new course
   */
  async createCourse(courseData: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return apiClient.post<ApiResponse<Course>>(`${this.endpoint}`, courseData);
  }

  /**
   * Get all courses
   */
  async getAllCourses(): Promise<ApiResponse<Course[]>> {
    return apiClient.get<ApiResponse<Course[]>>(`${this.endpoint}`);
  }

  /**
   * Get course by ID
   */
  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    return apiClient.get<ApiResponse<Course>>(`${this.endpoint}/${courseId}`);
  }

  /**
   * Update course (full update)
   */
  async updateCourse(courseId: string, courseData: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    return apiClient.put<ApiResponse<Course>>(`${this.endpoint}/${courseId}`, courseData);
  }

  /**
   * Patch course (partial update)
   */
  async patchCourse(courseId: string, courseData: Partial<UpdateCourseRequest>): Promise<ApiResponse<Course>> {
    return apiClient.patch<ApiResponse<Course>>(`${this.endpoint}/${courseId}`, courseData);
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${courseId}`);
  }

  /**
   * Get courses by level
   */
  async getCoursesByLevel(level: 'Fundamental' | 'Intermediate' | 'Advanced'): Promise<ApiResponse<Course[]>> {
    return apiClient.get<ApiResponse<Course[]>>(`${this.endpoint}`, { level });
  }

  /**
   * Get active courses only
   */
  async getActiveCourses(): Promise<ApiResponse<Course[]>> {
    return apiClient.get<ApiResponse<Course[]>>(`${this.endpoint}`, { isActive: true });
  }
}

// Export singleton instance
export const courseService = new CourseService();
