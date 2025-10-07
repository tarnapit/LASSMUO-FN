import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';

// Basic UserCourseProgress types
interface UserCourseProgress {
  id?: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  score?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateUserCourseProgressRequest {
  userId: string;
  courseId: string;
  progress?: number;
  completed?: boolean;
  score?: number;
}

interface UpdateUserCourseProgressRequest {
  progress?: number;
  completed?: boolean;
  score?: number;
  completedAt?: string;
}

export class UserCourseProgressService {
  private endpoint = API_CONFIG.ENDPOINTS.USER_COURSE_PROGRESS;

  /**
   * Create a new user course progress
   */
  async createUserCourseProgress(progressData: CreateUserCourseProgressRequest): Promise<ApiResponse<UserCourseProgress>> {
    return apiClient.post<ApiResponse<UserCourseProgress>>(`${this.endpoint}`, progressData);
  }

  /**
   * Get all user course progress
   */
  async getAllUserCourseProgress(): Promise<ApiResponse<UserCourseProgress[]>> {
    return apiClient.get<ApiResponse<UserCourseProgress[]>>(`${this.endpoint}`);
  }

  /**
   * Get user course progress by ID
   */
  async getUserCourseProgressById(progressId: string): Promise<ApiResponse<UserCourseProgress>> {
    return apiClient.get<ApiResponse<UserCourseProgress>>(`${this.endpoint}/${progressId}`);
  }

  /**
   * Get user course progress by user ID
   */
  async getUserCourseProgressByUserId(userId: string): Promise<ApiResponse<UserCourseProgress[]>> {
    return apiClient.get<ApiResponse<UserCourseProgress[]>>(`${this.endpoint}`, { userId });
  }

  /**
   * Get user course progress by course ID
   */
  async getUserCourseProgressByCourseId(courseId: string): Promise<ApiResponse<UserCourseProgress[]>> {
    return apiClient.get<ApiResponse<UserCourseProgress[]>>(`${this.endpoint}`, { courseId });
  }

  /**
   * Get specific user's progress for specific course
   */
  async getUserProgressForCourse(userId: string, courseId: string): Promise<ApiResponse<UserCourseProgress>> {
    return apiClient.get<ApiResponse<UserCourseProgress>>(`${this.endpoint}`, { userId, courseId });
  }

  /**
   * Update user course progress (full update)
   */
  async updateUserCourseProgress(progressId: string, progressData: UpdateUserCourseProgressRequest): Promise<ApiResponse<UserCourseProgress>> {
    return apiClient.put<ApiResponse<UserCourseProgress>>(`${this.endpoint}/${progressId}`, progressData);
  }

  /**
   * Patch user course progress (partial update)
   */
  async patchUserCourseProgress(progressId: string, progressData: Partial<UpdateUserCourseProgressRequest>): Promise<ApiResponse<UserCourseProgress>> {
    return apiClient.patch<ApiResponse<UserCourseProgress>>(`${this.endpoint}/${progressId}`, progressData);
  }

  /**
   * Delete user course progress
   */
  async deleteUserCourseProgress(progressId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${progressId}`);
  }

  /**
   * Update progress percentage
   */
  async updateProgress(progressId: string, progressPercentage: number): Promise<ApiResponse<UserCourseProgress>> {
    return apiClient.patch<ApiResponse<UserCourseProgress>>(`${this.endpoint}/${progressId}`, { 
      progress: progressPercentage 
    });
  }

  /**
   * Mark course as completed
   */
  async markCourseCompleted(progressId: string, finalScore?: number): Promise<ApiResponse<UserCourseProgress>> {
    const updateData: Partial<UpdateUserCourseProgressRequest> = {
      completed: true,
      progress: 100,
      completedAt: new Date().toISOString()
    };
    
    if (finalScore !== undefined) {
      updateData.score = finalScore;
    }

    return apiClient.patch<ApiResponse<UserCourseProgress>>(`${this.endpoint}/${progressId}`, updateData);
  }

  /**
   * Get user progress statistics
   */
  async getUserProgressStats(userId: string): Promise<ApiResponse<{
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    averageScore: number;
    totalTimeSpent: number;
  }>> {
    return apiClient.get(`${this.endpoint}/stats/${userId}`);
  }

  /**
   * Get course completion leaderboard
   */
  async getCourseLeaderboard(courseId: string, limit: number = 10): Promise<ApiResponse<{
    userId: string;
    userName: string;
    progress: number;
    score: number;
    completedAt: string;
    rank: number;
  }[]>> {
    return apiClient.get(`${this.endpoint}/leaderboard/${courseId}`, { limit });
  }
}

// Export singleton instance
export const userCourseProgressService = new UserCourseProgressService();