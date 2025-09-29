import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  CourseDetail, 
  CreateCourseDetailRequest, 
  UpdateCourseDetailRequest 
} from '../types';

export class CourseDetailService {
  private endpoint = API_CONFIG.ENDPOINTS.COURSE_DETAIL;

  /**
   * Create a new course detail
   */
  async createCourseDetail(courseDetailData: CreateCourseDetailRequest): Promise<ApiResponse<CourseDetail>> {
    return apiClient.post<ApiResponse<CourseDetail>>(`${this.endpoint}/create`, courseDetailData);
  }

  /**
   * Get all course details
   */
  async getAllCourseDetails(): Promise<ApiResponse<CourseDetail[]>> {
    return apiClient.get<ApiResponse<CourseDetail[]>>(`${this.endpoint}/all`);
  }

  /**
   * Get course detail by course ID
   */
  async getCourseDetailByCourseId(courseId: string): Promise<ApiResponse<CourseDetail>> {
    return apiClient.get<ApiResponse<CourseDetail>>(`${this.endpoint}`, { courseId });
  }

  /**
   * Update course detail (full update)
   */
  async updateCourseDetail(courseDetailId: string, courseDetailData: UpdateCourseDetailRequest): Promise<ApiResponse<CourseDetail>> {
    return apiClient.put<ApiResponse<CourseDetail>>(`${this.endpoint}/update/${courseDetailId}`, courseDetailData);
  }

  /**
   * Patch course detail (partial update)
   */
  async patchCourseDetail(courseDetailId: string, courseDetailData: Partial<UpdateCourseDetailRequest>): Promise<ApiResponse<CourseDetail>> {
    return apiClient.patch<ApiResponse<CourseDetail>>(`${this.endpoint}/patch/${courseDetailId}`, courseDetailData);
  }

  /**
   * Delete course detail
   */
  async deleteCourseDetail(courseDetailId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/delete/${courseDetailId}`);
  }
}

// Export singleton instance
export const courseDetailService = new CourseDetailService();