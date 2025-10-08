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
   * Get all user stage progress records
   */
  async getAllProgress(): Promise<ApiResponse<UserStageProgress[]>> {
    return apiClient.get<ApiResponse<UserStageProgress[]>>(this.endpoint);
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
   */
  async upsertProgress(userId: string, stageId: number, progressData: UpdateUserStageProgressRequest): Promise<ApiResponse<UserStageProgress>> {
    return apiClient.post<ApiResponse<UserStageProgress>>(`${this.endpoint}/upsert`, {
      userId,
      stageId,
      ...progressData
    });
  }

  /**
   * Mark stage as completed
   */
  async completeStage(userId: string, stageId: number, finalScore: number, starsEarned: number): Promise<ApiResponse<UserStageProgress>> {
    return apiClient.patch<ApiResponse<UserStageProgress>>(`${this.endpoint}/complete`, {
      userId,
      stageId,
      isCompleted: true,
      currentScore: finalScore,
      bestScore: finalScore,
      starsEarned,
      completedAt: new Date().toISOString()
    });
  }

  /**
   * Record stage attempt
   */
  async recordAttempt(userId: string, stageId: number, score: number): Promise<ApiResponse<UserStageProgress>> {
    const currentTime = new Date().toISOString();
    
    return apiClient.patch<ApiResponse<UserStageProgress>>(`${this.endpoint}/attempt`, {
      userId,
      stageId,
      currentScore: score,
      lastAttemptAt: currentTime,
      $inc: { attempts: 1 } // Increment attempts counter
    });
  }

  /**
   * Update best score if current score is better
   */
  async updateBestScore(userId: string, stageId: number, newScore: number): Promise<ApiResponse<UserStageProgress>> {
    return apiClient.patch<ApiResponse<UserStageProgress>>(`${this.endpoint}/best-score`, {
      userId,
      stageId,
      newScore
    });
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
    return apiClient.patch<ApiResponse<UserStageProgress>>(`${this.endpoint}/reset`, {
      userId,
      stageId,
      isCompleted: false,
      currentScore: 0,
      bestScore: 0,
      starsEarned: 0,
      attempts: 0,
      lastAttemptAt: null,
      completedAt: null
    });
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