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
    try {
      const course = await apiClient.post<Course>(`${this.endpoint}`, courseData);
      return {
        success: true,
        data: course
      };
    } catch (error) {
      console.error('Error creating course:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get all courses
   */
  async getAllCourses(): Promise<ApiResponse<Course[]>> {
    try {
      const courses = await apiClient.get<Course[]>(`${this.endpoint}`);
      return {
        success: true,
        data: courses
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get course by ID
   */
  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    try {
      const course = await apiClient.get<Course>(`${this.endpoint}/${courseId}`);
      return {
        success: true,
        data: course
      };
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update course (full update)
   */
  async updateCourse(courseId: string, courseData: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    try {
      const course = await apiClient.put<Course>(`${this.endpoint}/${courseId}`, courseData);
      return {
        success: true,
        data: course
      };
    } catch (error) {
      console.error('Error updating course:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Patch course (partial update)
   */
  async patchCourse(courseId: string, courseData: Partial<UpdateCourseRequest>): Promise<ApiResponse<Course>> {
    try {
      const course = await apiClient.patch<Course>(`${this.endpoint}/${courseId}`, courseData);
      return {
        success: true,
        data: course
      };
    } catch (error) {
      console.error('Error patching course:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete<void>(`${this.endpoint}/${courseId}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting course:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get courses by level
   */
  async getCoursesByLevel(level: 'Fundamental' | 'Intermediate' | 'Advanced'): Promise<ApiResponse<Course[]>> {
    try {
      const courses = await apiClient.get<Course[]>(`${this.endpoint}`, { level });
      return {
        success: true,
        data: courses
      };
    } catch (error) {
      console.error('Error fetching courses by level:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get active courses only
   */
  async getActiveCourses(): Promise<ApiResponse<Course[]>> {
    try {
      const courses = await apiClient.get<Course[]>(`${this.endpoint}`, { isActive: true });
      return {
        success: true,
        data: courses
      };
    } catch (error) {
      console.error('Error fetching active courses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const courseService = new CourseService();
