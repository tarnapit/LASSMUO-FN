// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

// Application Constants
export const APP_CONFIG = {
  name: 'LASSMUO',
  version: '1.0.0',
  description: 'Learning Astronomy Solar System Made Understanding Online',
};

// Authentication Constants
export const AUTH_CONFIG = {
  tokenKey: 'authToken',
  refreshTokenKey: 'refreshToken',
  userKey: 'user',
  tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

// Quiz Constants
export const QUIZ_CONFIG = {
  defaultQuestionCount: 10,
  maxQuestionCount: 50,
  timePerQuestion: 30, // seconds
  passingScore: 70, // percentage
};

// Learning Constants
export const LEARNING_CONFIG = {
  courseLevels: ['Fundamental', 'Intermediate', 'Advanced'] as const,
  minProgressPercentage: 0,
  maxProgressPercentage: 100,
};

// UI Constants
export const UI_CONFIG = {
  defaultPageSize: 10,
  maxPageSize: 100,
  loadingDelay: 300, // milliseconds
  toastDuration: 5000, // milliseconds
};

// Validation Constants
export const VALIDATION_CONFIG = {
  minPasswordLength: 8,
  maxPasswordLength: 128,
  minUsernameLength: 3,
  maxUsernameLength: 50,
  maxTitleLength: 100,
  maxDescriptionLength: 1000,
};

// File Upload Constants
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'text/plain'],
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  CREATE_SUCCESS: 'Created successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  QUIZ_SUBMIT_SUCCESS: 'Quiz submitted successfully!',
};

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/[id]',
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lessons/[id]',
  QUIZ: '/quiz',
  QUIZ_DETAIL: '/quiz/[id]',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  MINI_GAMES: '/mini-game',
  FRIENDS: '/friends',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lassmuo_auth_token',
  REFRESH_TOKEN: 'lassmuo_refresh_token',
  USER_DATA: 'lassmuo_user_data',
  THEME: 'lassmuo_theme',
  LANGUAGE: 'lassmuo_language',
  PROGRESS: 'lassmuo_progress',
};

// Theme Constants
export const THEME_CONFIG = {
  default: 'light',
  options: ['light', 'dark'] as const,
};

// Language Constants
export const LANGUAGE_CONFIG = {
  default: 'en',
  options: ['en', 'th'] as const,
};