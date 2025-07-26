import { useCallback } from 'react';
import { useFetch, useMutation } from './useApi';
import { userService } from '../services';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { ApiResponse } from '../config';

// Hook for fetching all users
export function useUsers() {
  return useFetch(() => userService.getAllUsers());
}

// Hook for fetching a single user
export function useUser(userId: string) {
  return useFetch(() => userService.getUserById(userId), [userId]);
}

// Hook for fetching user by email
export function useUserByEmail(email: string) {
  return useFetch(() => userService.getUserByEmail(email), [email]);
}

// Hook for fetching user profile with additional data
export function useUserProfile(userId: string) {
  return useFetch(() => userService.getUserProfile(userId), [userId]);
}

// Hook for user authentication
export function useAuth() {
  const loginMutation = useMutation<ApiResponse<{
    user: User;
    token: string;
    refreshToken?: string;
  }>, [string, string]>();

  const registerMutation = useMutation<ApiResponse<User>, [CreateUserRequest]>();
  const logoutMutation = useMutation<ApiResponse<void>, []>();

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginMutation.mutate(userService.loginUser, email, password);
    if (result.data?.token) {
      // Store token in localStorage or secure storage
      localStorage.setItem('authToken', result.data.token);
      // Set token in API client
      const { apiClient } = await import('../client');
      apiClient.setAuthToken(result.data.token);
    }
    return result;
  }, [loginMutation]);

  const register = useCallback(async (userData: CreateUserRequest) => {
    return await registerMutation.mutate(userService.createUser, userData);
  }, [registerMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutate(userService.logoutUser);
    } finally {
      // Always remove token regardless of API call success
      localStorage.removeItem('authToken');
      const { apiClient } = await import('../client');
      apiClient.removeAuthToken();
    }
  }, [logoutMutation]);

  return {
    login: {
      execute: login,
      loading: loginMutation.loading,
      error: loginMutation.error,
      success: loginMutation.success,
      data: loginMutation.data,
      reset: loginMutation.reset,
    },
    register: {
      execute: register,
      loading: registerMutation.loading,
      error: registerMutation.error,
      success: registerMutation.success,
      data: registerMutation.data,
      reset: registerMutation.reset,
    },
    logout: {
      execute: logout,
      loading: logoutMutation.loading,
      error: logoutMutation.error,
      success: logoutMutation.success,
      reset: logoutMutation.reset,
    },
  };
}

// Hook for user management operations
export function useUserManagement() {
  const updateUser = useMutation<ApiResponse<User>, [string, UpdateUserRequest]>();
  const patchUser = useMutation<ApiResponse<User>, [string, Partial<UpdateUserRequest>]>();
  const deleteUser = useMutation<ApiResponse<void>, [string]>();
  const changePassword = useMutation<ApiResponse<void>, [string, string, string]>();

  const update = useCallback(async (userId: string, userData: UpdateUserRequest) => {
    return await updateUser.mutate(userService.updateUser, userId, userData);
  }, [updateUser]);

  const patch = useCallback(async (userId: string, userData: Partial<UpdateUserRequest>) => {
    return await patchUser.mutate(userService.patchUser, userId, userData);
  }, [patchUser]);

  const remove = useCallback(async (userId: string) => {
    return await deleteUser.mutate(userService.deleteUser, userId);
  }, [deleteUser]);

  const updatePassword = useCallback(async (userId: string, currentPassword: string, newPassword: string) => {
    return await changePassword.mutate(userService.changePassword, userId, currentPassword, newPassword);
  }, [changePassword]);

  return {
    update: {
      execute: update,
      loading: updateUser.loading,
      error: updateUser.error,
      success: updateUser.success,
      reset: updateUser.reset,
    },
    patch: {
      execute: patch,
      loading: patchUser.loading,
      error: patchUser.error,
      success: patchUser.success,
      reset: patchUser.reset,
    },
    delete: {
      execute: remove,
      loading: deleteUser.loading,
      error: deleteUser.error,
      success: deleteUser.success,
      reset: deleteUser.reset,
    },
    changePassword: {
      execute: updatePassword,
      loading: changePassword.loading,
      error: changePassword.error,
      success: changePassword.success,
      reset: changePassword.reset,
    },
  };
}
