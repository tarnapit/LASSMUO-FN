import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  CoursePostest, 
  CreateCoursePostestRequest, 
  UpdateCoursePostestRequest 
} from '../types';

export class CoursePostestService {
  private endpoint = 'coursePostest';

  /**
   * Create a new course postest
   */
  async createCoursePostest(postestData: CreateCoursePostestRequest): Promise<ApiResponse<CoursePostest>> {
    try {
      const postest = await apiClient.post<CoursePostest>(`${this.endpoint}`, postestData);
      return {
        success: true,
        data: postest
      };
    } catch (error) {
      console.error('Error creating course postest:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create course postest'
      };
    }
  }

  /**
   * Get all course postests
   */
  async getAllCoursePostests(): Promise<ApiResponse<CoursePostest[]>> {
    try {
      const postests = await apiClient.get<CoursePostest[]>(`${this.endpoint}`);
      return {
        success: true,
        data: postests
      };
    } catch (error) {
      console.error('Error fetching course postests:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch course postests'
      };
    }
  }

  /**
   * Get course postest by ID
   */
  async getCoursePostestById(id: string): Promise<ApiResponse<CoursePostest>> {
    try {
      const postest = await apiClient.get<CoursePostest>(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: postest
      };
    } catch (error) {
      console.error('Error fetching course postest:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch course postest'
      };
    }
  }

  /**
   * Get course postests by course ID
   */
  async getCoursePostestsByCourseId(courseId: string): Promise<ApiResponse<CoursePostest[]>> {
    try {
      const postests = await apiClient.get<CoursePostest[]>(`${this.endpoint}?courseId=${courseId}`);
      return {
        success: true,
        data: postests
      };
    } catch (error) {
      console.error('Error fetching course postests by course ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch course postests'
      };
    }
  }

  /**
   * Update course postest
   */
  async updateCoursePostest(id: string, updateData: UpdateCoursePostestRequest): Promise<ApiResponse<CoursePostest>> {
    try {
      const postest = await apiClient.put<CoursePostest>(`${this.endpoint}/${id}`, updateData);
      return {
        success: true,
        data: postest
      };
    } catch (error) {
      console.error('Error updating course postest:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update course postest'
      };
    }
  }

  /**
   * Delete course postest
   */
  async deleteCoursePostest(id: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: undefined
      };
    } catch (error) {
      console.error('Error deleting course postest:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete course postest'
      };
    }
  }
}

// Export singleton instance
export const coursePostestService = new CoursePostestService();