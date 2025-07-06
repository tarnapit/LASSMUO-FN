// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888',
  ENDPOINTS: {
    COURSE: '/course',
    STAGE: '/stage', 
    LESSON: '/lesson',
    ORDER: '/order',
    USER: '/users',
    ANSWER: '/answer',
    HEALTH: '/health'
  },
  TIMEOUT: 5000, // ลดเวลา timeout ลง
  MAX_RETRIES: 2, // ลดจำนวนการ retry
  RETRY_DELAY: 1000,
  HEALTH_CHECK_INTERVAL: 60000, // เพิ่มช่วงเวลาตรวจสอบ
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}
