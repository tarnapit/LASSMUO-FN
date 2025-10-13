import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';

// User Stage Progress types based on database schema
export interface UserStageProgress {
  id: string;
  userId: string;
  stageId: number;
  isCompleted: boolean;
  currentScore: number;
  bestScore: number;
  starsEarned: number;
  attempts: number;
  lastAttemptAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface CreateUserStageProgressRequest {
  userId: string;
  stageId: number;
  isCompleted?: boolean;
  currentScore?: number;
  bestScore?: number;
  starsEarned?: number;
  attempts?: number;
  lastAttemptAt?: string;
  completedAt?: string;
}

export interface UpdateUserStageProgressRequest {
  isCompleted?: boolean;
  currentScore?: number;
  bestScore?: number;
  starsEarned?: number;
  attempts?: number;
  lastAttemptAt?: string;
  completedAt?: string;
}

export class UserStageProgressService {
  private endpoint = '/user-stage-progress';

  /**
   * Create new user stage progress record
   */
  async createProgress(progressData: CreateUserStageProgressRequest): Promise<ApiResponse<UserStageProgress>> {
    return apiClient.post<ApiResponse<UserStageProgress>>(this.endpoint, progressData);
  }

  /**
   * Get all user stage progress records (admin only)
   * For regular users, use getUserProgress() instead
   */
  async getAllProgress(): Promise<ApiResponse<UserStageProgress[]>> {
    try {
      // Try without userId first (admin endpoint)
      return await apiClient.get<ApiResponse<UserStageProgress[]>>(this.endpoint);
    } catch (error) {
      // If fails, might need userId - return empty array for now
      console.warn('getAllProgress failed, might require admin privileges:', error);
      return {
        success: false,
        error: 'getAllProgress requires admin privileges or userId parameter',
        data: []
      } as ApiResponse<UserStageProgress[]>;
    }
  }

  /**
   * Get user stage progress by ID
   */
  async getProgressById(progressId: string): Promise<ApiResponse<UserStageProgress>> {
    return apiClient.get<ApiResponse<UserStageProgress>>(`${this.endpoint}/${progressId}`);
  }

  /**
   * Get all progress for a specific user
   */
  async getUserProgress(userId: string): Promise<ApiResponse<UserStageProgress[]>> {
    return apiClient.get<ApiResponse<UserStageProgress[]>>(`${this.endpoint}?userId=${userId}`);
  }

  /**
   * Get user progress for a specific stage
   */
  async getUserStageProgress(userId: string, stageId: number): Promise<ApiResponse<UserStageProgress | null>> {
    return apiClient.get<ApiResponse<UserStageProgress | null>>(`${this.endpoint}?userId=${userId}&stageId=${stageId}`);
  }

  /**
   * Get user's completed stages
   */
  async getUserCompletedStages(userId: string): Promise<ApiResponse<UserStageProgress[]>> {
    return apiClient.get<ApiResponse<UserStageProgress[]>>(`${this.endpoint}?userId=${userId}&isCompleted=true`);
  }

  /**
   * Get user's in-progress stages
   */
  async getUserInProgressStages(userId: string): Promise<ApiResponse<UserStageProgress[]>> {
    return apiClient.get<ApiResponse<UserStageProgress[]>>(`${this.endpoint}?userId=${userId}&isCompleted=false&attempts=>0`);
  }

  /**
   * Update user stage progress
   */
  async updateProgress(progressId: string, progressData: UpdateUserStageProgressRequest): Promise<ApiResponse<UserStageProgress>> {
    return apiClient.put<ApiResponse<UserStageProgress>>(`${this.endpoint}/${progressId}`, progressData);
  }

  /**
   * Update or create user stage progress (upsert)
   * First try to get existing progress, then update or create accordingly
   */
  async upsertProgress(userId: string, stageId: number, progressData: UpdateUserStageProgressRequest): Promise<ApiResponse<UserStageProgress>> {
    try {
      console.log('🔄 Upsert: Checking existing progress for user:', userId, 'stage:', stageId);
      
      // First, try to find existing progress for this user and stage
      const existingProgressResponse = await this.getUserStageProgress(userId, stageId);
      
      if (existingProgressResponse.success && existingProgressResponse.data) {
        // If exists, update it
        const existingProgress = existingProgressResponse.data;
        console.log('✅ Found existing progress, updating:', existingProgress.id);
        return await this.updateProgress(existingProgress.id, progressData);
      } else {
        // If doesn't exist, create new
        console.log('➕ No existing progress found, creating new for user:', userId, 'stage:', stageId);
        const createData: CreateUserStageProgressRequest = {
          userId,
          stageId,
          isCompleted: false,
          currentScore: 0,
          bestScore: 0,
          starsEarned: 0,
          attempts: 0,
          ...progressData
        };
        
        try {
          return await this.createProgress(createData);
        } catch (createError) {
          // If create fails due to unique constraint (race condition), try to get and update
          if (createError instanceof Error && 
              (createError.message.includes('Unique constraint') || 
               createError.message.includes('P2002'))) {
            
            console.log('⚠️ Create failed due to unique constraint (race condition), retrying get and update...');
            
            // Wait a bit for the other operation to complete
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Try to get existing progress again
            const retryResponse = await this.getUserStageProgress(userId, stageId);
            
            if (retryResponse.success && retryResponse.data) {
              console.log('✅ Found existing progress on retry, updating:', retryResponse.data.id);
              return await this.updateProgress(retryResponse.data.id, progressData);
            } else {
              console.error('❌ Still no existing progress found after unique constraint error');
              throw createError;
            }
          } else {
            throw createError;
          }
        }
      }
    } catch (error) {
      console.error('❌ Upsert failed completely:', error);
      throw error;
    }
  }

  /**
   * Mark stage as completed
   */
  async completeStage(userId: string, stageId: number, finalScore: number, starsEarned: number): Promise<ApiResponse<UserStageProgress>> {
    const progressData: UpdateUserStageProgressRequest = {
      isCompleted: true,
      currentScore: finalScore,
      bestScore: finalScore,
      starsEarned,
      completedAt: new Date().toISOString()
    };
    
    return this.upsertProgress(userId, stageId, progressData);
  }

  /**
   * Record stage attempt
   */
  async recordAttempt(userId: string, stageId: number, score: number): Promise<ApiResponse<UserStageProgress>> {
    const currentTime = new Date().toISOString();
    
    try {
      // Get existing progress first
      const existingResponse = await this.getUserStageProgress(userId, stageId);
      
      if (existingResponse.success && existingResponse.data) {
        const existing = existingResponse.data;
        const progressData: UpdateUserStageProgressRequest = {
          currentScore: score,
          bestScore: Math.max(existing.bestScore || 0, score),
          attempts: (existing.attempts || 0) + 1,
          lastAttemptAt: currentTime
        };
        
        return this.updateProgress(existing.id, progressData);
      } else {
        // Create new if doesn't exist
        const progressData: UpdateUserStageProgressRequest = {
          currentScore: score,
          bestScore: score,
          attempts: 1,
          lastAttemptAt: currentTime
        };
        
        return this.upsertProgress(userId, stageId, progressData);
      }
    } catch (error) {
      console.error('Record attempt failed:', error);
      throw error;
    }
  }

  /**
   * Update best score if current score is better
   */
  async updateBestScore(userId: string, stageId: number, newScore: number): Promise<ApiResponse<UserStageProgress>> {
    try {
      const existingResponse = await this.getUserStageProgress(userId, stageId);
      
      if (existingResponse.success && existingResponse.data) {
        const existing = existingResponse.data;
        if (newScore > (existing.bestScore || 0)) {
          const progressData: UpdateUserStageProgressRequest = {
            bestScore: newScore,
            currentScore: newScore
          };
          
          return this.updateProgress(existing.id, progressData);
        }
        
        // Return existing as success response if no update needed
        return { success: true, data: existing } as ApiResponse<UserStageProgress>;
      } else {
        // Create new if doesn't exist
        return this.upsertProgress(userId, stageId, {
          currentScore: newScore,
          bestScore: newScore
        });
      }
    } catch (error) {
      console.error('Update best score failed:', error);
      throw error;
    }
  }

  /**
   * Delete user stage progress
   */
  async deleteProgress(progressId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${progressId}`);
  }

  /**
   * Reset user progress for a stage
   */
  async resetStageProgress(userId: string, stageId: number): Promise<ApiResponse<UserStageProgress>> {
    const progressData: UpdateUserStageProgressRequest = {
      isCompleted: false,
      currentScore: 0,
      bestScore: 0,
      starsEarned: 0,
      attempts: 0,
      lastAttemptAt: undefined,
      completedAt: undefined
    };
    
    return this.upsertProgress(userId, stageId, progressData);
  }

  /**
   * Get user's total statistics
   */
  async getUserStatistics(userId: string): Promise<ApiResponse<{
    totalStages: number;
    completedStages: number;
    inProgressStages: number;
    totalScore: number;
    totalStars: number;
    averageScore: number;
    completionRate: number;
    totalAttempts: number;
  }>> {
    return apiClient.get(`${this.endpoint}/user/${userId}/statistics`);
  }

  /**
   * Get stage completion statistics
   */
  async getStageStatistics(stageId: number): Promise<ApiResponse<{
    totalUsers: number;
    completedUsers: number;
    averageScore: number;
    averageAttempts: number;
    completionRate: number;
    stagePopularity: number;
  }>> {
    return apiClient.get(`${this.endpoint}/stage/${stageId}/statistics`);
  }

  /**
   * Get leaderboard for a stage
   */
  async getStageLeaderboard(stageId: number, limit: number = 10): Promise<ApiResponse<UserStageProgress[]>> {
    return apiClient.get<ApiResponse<UserStageProgress[]>>(`${this.endpoint}/leaderboard?stageId=${stageId}&limit=${limit}`);
  }

  /**
   * Get global leaderboard
   */
  async getGlobalLeaderboard(limit: number = 10): Promise<ApiResponse<{
    userId: string;
    totalScore: number;
    totalStars: number;
    completedStages: number;
    rank: number;
  }[]>> {
    return apiClient.get(`${this.endpoint}/leaderboard/global?limit=${limit}`);
  }

  /**
   * Check if user can access stage (prerequisites met)
   */
  async canAccessStage(userId: string, stageId: number): Promise<ApiResponse<{
    canAccess: boolean;
    missingPrerequisites: number[];
    requiredStars: number;
    userStars: number;
  }>> {
    return apiClient.get(`${this.endpoint}/access-check?userId=${userId}&stageId=${stageId}`);
  }

  /**
   * Get user's next recommended stages
   */
  async getRecommendedStages(userId: string): Promise<ApiResponse<{
    stageId: number;
    title: string;
    difficulty: string;
    reason: string;
    readinessScore: number;
  }[]>> {
    return apiClient.get(`${this.endpoint}/recommended?userId=${userId}`);
  }

  /**
   * Bulk update progress for multiple stages
   */
  async bulkUpdateProgress(updates: {
    userId: string;
    stageId: number;
    progressData: UpdateUserStageProgressRequest;
  }[]): Promise<ApiResponse<UserStageProgress[]>> {
    return apiClient.post<ApiResponse<UserStageProgress[]>>(`${this.endpoint}/bulk-update`, { updates });
  }
}

// Export singleton instance
export const userStageProgressService = new UserStageProgressService();