import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../types';

export class UserService {
  private endpoint = API_CONFIG.ENDPOINTS.USER;

  /**
   * Create a new user (register)
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>(`${this.endpoint}/create`, userData);
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>(`${this.endpoint}/get`);
  }

  /**
   * Get all users without authentication (public endpoint)
   */
  async getAllUsersPublic(): Promise<ApiResponse<User[]>> {
    // ลองหา endpoint อื่นที่ไม่ต้องการ auth ก่อน
    try {
      // ลอง endpoint ที่ไม่ต้องการ auth
      return await apiClient.get<ApiResponse<User[]>>(`${this.endpoint}`);
    } catch (error) {
      // ถ้าไม่ได้ ลอง endpoint อื่น
      return await apiClient.get<ApiResponse<User[]>>(`${this.endpoint}/all`);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`${this.endpoint}/${userId}`);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`${this.endpoint}/email/${email}`);
  }

  /**
   * Update user (full update)
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`${this.endpoint}/update/${userId}`, userData);
  }

  /**
   * Patch user (partial update)
   */
  async patchUser(userId: string, userData: Partial<UpdateUserRequest>): Promise<ApiResponse<User>> {
    return apiClient.patch<ApiResponse<User>>(`${this.endpoint}/patch/${userId}`, userData);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/delete/${userId}`);
  }

  /**
   * Login user
   */
  async loginUser(email: string, password: string): Promise<ApiResponse<{
    user: User;
    token: string;
    refreshToken?: string;
  }>> {
    // ใช้ endpoint ที่ถูกต้องตาม backend route
    return apiClient.post(`/login/users`, { email, password });
  }

  /**
   * Logout user
   */
  async logoutUser(): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.endpoint}/logout`);
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`${this.endpoint}/${userId}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.endpoint}/reset-password`, { email });
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.endpoint}/verify-email`, { token });
  }



  /**
   * Search users
   */
  async searchUsers(searchTerm: string): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>(`${this.endpoint}/get`, { 
      search: searchTerm 
    });
  }

  /**
   * Update user avatar
   */
  async updateAvatar(userId: string, avatarFile: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return apiClient.upload(`${this.endpoint}/${userId}/avatar`, formData);
  }
}

// Export singleton instance
export const userService = new UserService();
