import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';

// Stage types based on database schema
export interface Stage {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  totalStars: number;
  xpReward: number;
  streakBonus: boolean;
  healthSystem: boolean;
  rewards: any; // JSON field
  maxStars: number;
  requiredStarsToUnlockNext: number;
  createdAt: string;
  updatedAt: string;
}

export interface StageCharacter {
  id: number;
  stageId: number;
  name: string;
  avatar: string;
  introduction: string;
  learningContent: string;
  completionMessage: string;
  encouragements: any; // JSON array
  hints: any; // JSON array
  createdAt: string;
  updatedAt: string;
}

export interface StagePrerequisite {
  id: number;
  stageId: number;
  prerequisiteStageId: number;
  createdAt: string;
}

export interface CreateStageRequest {
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  totalStars: number;
  xpReward: number;
  streakBonus?: boolean;
  healthSystem?: boolean;
  rewards: any;
  maxStars: number;
  requiredStarsToUnlockNext: number;
}

export interface UpdateStageRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  estimatedTime?: string;
  totalStars?: number;
  xpReward?: number;
  streakBonus?: boolean;
  healthSystem?: boolean;
  rewards?: any;
  maxStars?: number;
  requiredStarsToUnlockNext?: number;
}

export interface CreateStageCharacterRequest {
  stageId: number;
  name: string;
  avatar: string;
  introduction: string;
  learningContent: string;
  completionMessage: string;
  encouragements: string[];
  hints: string[];
}

export class StageService {
  private endpoint = '/stage';
  private characterEndpoint = '/stage-character';
  private prerequisiteEndpoint = '/stage-prerequisite';

  // ===== Stage Management =====

  /**
   * Create a new stage
   */
  async createStage(stageData: CreateStageRequest): Promise<ApiResponse<Stage>> {
    return apiClient.post<ApiResponse<Stage>>(this.endpoint, stageData);
  }

  /**
   * Get all stages
   */
  async getAllStages(): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(this.endpoint);
  }

  /**
   * Get stage by ID
   */
  async getStageById(stageId: number): Promise<ApiResponse<Stage>> {
    return apiClient.get<ApiResponse<Stage>>(`${this.endpoint}/${stageId}`);
  }

  /**
   * Get stages ordered by difficulty
   */
  async getStagesOrderedByDifficulty(): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(`${this.endpoint}?orderBy=difficulty&sort=asc`);
  }

  /**
   * Get stages by difficulty level
   */
  async getStagesByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(`${this.endpoint}?difficulty=${difficulty}`);
  }

  /**
   * Update stage (full update)
   */
  async updateStage(stageId: number, stageData: UpdateStageRequest): Promise<ApiResponse<Stage>> {
    return apiClient.put<ApiResponse<Stage>>(`${this.endpoint}/${stageId}`, stageData);
  }

  /**
   * Patch stage (partial update)
   */
  async patchStage(stageId: number, stageData: Partial<UpdateStageRequest>): Promise<ApiResponse<Stage>> {
    return apiClient.patch<ApiResponse<Stage>>(`${this.endpoint}/${stageId}`, stageData);
  }

  /**
   * Delete stage
   */
  async deleteStage(stageId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${stageId}`);
  }

  // ===== Stage Characters =====

  /**
   * Create stage character
   */
  async createStageCharacter(characterData: CreateStageCharacterRequest): Promise<ApiResponse<StageCharacter>> {
    return apiClient.post<ApiResponse<StageCharacter>>(this.characterEndpoint, characterData);
  }

  /**
   * Get stage character by stage ID
   */
  async getStageCharacter(stageId: number): Promise<ApiResponse<StageCharacter>> {
    return apiClient.get<ApiResponse<StageCharacter>>(`${this.characterEndpoint}?stageId=${stageId}`);
  }

  /**
   * Update stage character
   */
  async updateStageCharacter(characterId: number, characterData: Partial<CreateStageCharacterRequest>): Promise<ApiResponse<StageCharacter>> {
    return apiClient.put<ApiResponse<StageCharacter>>(`${this.characterEndpoint}/${characterId}`, characterData);
  }

  /**
   * Delete stage character
   */
  async deleteStageCharacter(characterId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.characterEndpoint}/${characterId}`);
  }

  // ===== Stage Prerequisites =====

  /**
   * Get stage prerequisites
   */
  async getStagePrerequisites(stageId: number): Promise<ApiResponse<StagePrerequisite[]>> {
    return apiClient.get<ApiResponse<StagePrerequisite[]>>(`${this.prerequisiteEndpoint}?stageId=${stageId}`);
  }

  /**
   * Add stage prerequisite
   */
  async addStagePrerequisite(stageId: number, prerequisiteStageId: number): Promise<ApiResponse<StagePrerequisite>> {
    return apiClient.post<ApiResponse<StagePrerequisite>>(this.prerequisiteEndpoint, {
      stageId,
      prerequisiteStageId
    });
  }

  /**
   * Remove stage prerequisite
   */
  async removeStagePrerequisite(prerequisiteId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.prerequisiteEndpoint}/${prerequisiteId}`);
  }

  /**
   * Check if stage is unlocked for user
   */
  async isStageUnlocked(stageId: number, userId: string): Promise<ApiResponse<{
    isUnlocked: boolean;
    missingPrerequisites: number[];
    requiredStars: number;
    userStars: number;
  }>> {
    return apiClient.get(`${this.endpoint}/${stageId}/unlock-status?userId=${userId}`);
  }

  // ===== Utility Methods =====

  /**
   * Get stage with full details (including character and prerequisites)
   */
  async getStageWithDetails(stageId: number): Promise<ApiResponse<Stage & {
    character?: StageCharacter;
    prerequisites: StagePrerequisite[];
  }>> {
    return apiClient.get<ApiResponse<Stage & {
      character?: StageCharacter;
      prerequisites: StagePrerequisite[];
    }>>(`${this.endpoint}/${stageId}/details`);
  }

  /**
   * Get stage progression path
   */
  async getStageProgression(): Promise<ApiResponse<{
    stageId: number;
    title: string;
    difficulty: string;
    prerequisites: number[];
    unlocks: number[];
  }[]>> {
    return apiClient.get(`${this.endpoint}/progression`);
  }

  /**
   * Get recommended next stages for user
   */
  async getRecommendedStages(userId: string): Promise<ApiResponse<Stage[]>> {
    return apiClient.get<ApiResponse<Stage[]>>(`${this.endpoint}/recommended?userId=${userId}`);
  }
}

// Export singleton instance
export const stageService = new StageService();
