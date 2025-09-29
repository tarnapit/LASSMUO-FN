import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services';
import { LoginRequest, LoginResponse, AuthUser } from '../types';
import { useMutation } from './useApi';

// Hook for authentication state
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      setLoading(true);
      authService.initializeAuth();
      const currentUser = authService.getCurrentUser();
      const isLoggedIn = authService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(isLoggedIn);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const updateAuthState = useCallback((userData: AuthUser | null, authenticated: boolean) => {
    setUser(userData);
    setIsAuthenticated(authenticated);
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    updateAuthState,
  };
}

// Hook for login functionality
export function useLogin() {
  const loginMutation = useMutation<LoginResponse, [LoginRequest]>();
  const { updateAuthState } = useAuth();

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await loginMutation.mutate(authService.login, credentials);
      
      if (response.success && response.user) {
        updateAuthState(response.user as AuthUser, true);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [loginMutation, updateAuthState]);

  return {
    login,
    loading: loginMutation.loading,
    error: loginMutation.error,
    success: loginMutation.success,
    data: loginMutation.data,
  };
}

// Hook for logout functionality
export function useLogout() {
  const { updateAuthState } = useAuth();

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      updateAuthState(null, false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, clear local state
      updateAuthState(null, false);
    }
  }, [updateAuthState]);

  return logout;
}

// Hook for token refresh
export function useTokenRefresh() {
  const refreshMutation = useMutation<LoginResponse, []>();
  const { updateAuthState } = useAuth();

  const refreshToken = useCallback(async () => {
    try {
      const response = await refreshMutation.mutate(authService.refreshToken);
      
      if (response.success && response.user) {
        updateAuthState(response.user as AuthUser, true);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      updateAuthState(null, false);
      throw error;
    }
  }, [refreshMutation, updateAuthState]);

  return {
    refreshToken,
    loading: refreshMutation.loading,
    error: refreshMutation.error,
  };
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShouldRedirect(true);
    } else {
      setShouldRedirect(false);
    }
  }, [isAuthenticated, loading]);

  return {
    isAuthenticated,
    loading,
    shouldRedirect,
  };
}

// Hook for checking permissions/roles
export function usePermissions() {
  const { user } = useAuth();

  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return user?.role ? roles.includes(user.role) : false;
  }, [user]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  const isTeacher = useCallback(() => {
    return hasRole('teacher');
  }, [hasRole]);

  const isStudent = useCallback(() => {
    return hasRole('student');
  }, [hasRole]);

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent,
    userRole: user?.role,
  };
}