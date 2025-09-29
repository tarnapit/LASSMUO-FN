import { apiClient } from '../client';
import { API_CONFIG, ApiResponse } from '../config';
import { 
  LoginRequest, 
  LoginResponse, 
  AuthUser 
} from '../types';

export class AuthService {
  private endpoint = API_CONFIG.ENDPOINTS.AUTH;

  /**
   * User login
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(`${this.endpoint}/users`, loginData);
      
      // Store token in localStorage if login successful
      if (response.success && response.token) {
        if (typeof window !== 'undefined') {
          // เก็บ token ในหลายชื่อเพื่อความเข้ากันได้
          localStorage.setItem('astronomy_app_token', response.token);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('token', response.token);
          
          if (response.user) {
            localStorage.setItem('astronomy_app_user', JSON.stringify(response.user));
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
        // Set token in API client
        apiClient.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      // Clear local storage - ลบทุก token variants
      if (typeof window !== 'undefined') {
        localStorage.removeItem('astronomy_app_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('astronomy_app_user');
        localStorage.removeItem('currentUser');
      }
      
      // Remove token from API client
      apiClient.removeAuthToken();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('astronomy_app_user') || 
                      localStorage.getItem('currentUser');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('astronomy_app_token') || 
             localStorage.getItem('authToken') || 
             localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Initialize auth state (call this on app startup)
   */
  initializeAuth(): void {
    const token = this.getAuthToken();
    if (token) {
      apiClient.setAuthToken(token);
    }
  }

  /**
   * Refresh token (if backend supports it)
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(`${this.endpoint}/refresh`);
      
      if (response.success && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('astronomy_app_token', response.token);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('token', response.token);
        }
        apiClient.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await this.logout();
      throw error;
    }
  }

  /**
   * Set token manually (for testing purposes)
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('astronomy_app_token', token);
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token);
    }
    apiClient.setAuthToken(token);
  }

  /**
   * Get token info (for debugging)
   */
  getTokenInfo(): { hasToken: boolean; tokenLength?: number; tokenPreview?: string } {
    const token = this.getAuthToken();
    if (!token) {
      return { hasToken: false };
    }
    
    return {
      hasToken: true,
      tokenLength: token.length,
      tokenPreview: `${token.substring(0, 10)}...${token.substring(token.length - 5)}`
    };
  }
}

// Export singleton instance
export const authService = new AuthService();