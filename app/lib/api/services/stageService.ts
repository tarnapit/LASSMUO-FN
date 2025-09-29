import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  Stage, 
  CreateStageRequest, 
  UpdateStageRequest 
} from '../types';

export class StageService {
  private endpoint = API_CONFIG.ENDPOINTS.STAGE;

  /**
   * Create a new stage
   */
  async createStage(stageData: CreateStageRequest): Promise<ApiResponse<Stage>> {
    return apiClient.post<ApiResponse<Stage>>(`${this.endpoint}/create`, stageData);
  }

  /**
   * Get all stages
   */
  async getAllStages(): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(`${this.endpoint}/getAll`);
  }

  /**
   * Get stage by ID
   */
  async getStageById(stageId: string): Promise<ApiResponse<Stage>> {
    return apiClient.get<ApiResponse<Stage>>(`${this.endpoint}/getById/${stageId}`);
  }

  /**
   * Get stages by course ID
   */
  async getStagesByCourseId(courseId: string): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(`${this.endpoint}`, { courseId });
  }

  /**
   * Update stage (full update)
   */
  async updateStage(stageId: string, stageData: UpdateStageRequest): Promise<ApiResponse<Stage>> {
    return apiClient.put<ApiResponse<Stage>>(`${this.endpoint}/update/${stageId}`, stageData);
  }

  /**
   * Patch stage (partial update)
   */
  async patchStage(stageId: string, stageData: Partial<UpdateStageRequest>): Promise<ApiResponse<Stage>> {
    return apiClient.patch<ApiResponse<Stage>>(`${this.endpoint}/patch/${stageId}`, stageData);
  }

  /**
   * Delete stage
   */
  async deleteStage(stageId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/delete/${stageId}`);
  }

  /**
   * Get stages ordered by sequence
   */
  async getStagesOrdered(courseId: string): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(`${this.endpoint}`, { 
      courseId, 
      sortBy: 'order',
      sortOrder: 'asc' 
    });
  }

  /**
   * Get unlocked stages for a course
   */
  async getUnlockedStages(courseId: string): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(`${this.endpoint}`, { 
      courseId, 
      unlockCondition: true 
    });
  }
}

// Export singleton instance
export const stageService = new StageService();
