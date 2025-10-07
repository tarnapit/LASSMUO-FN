export interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  duration?: string;
  isActive?: boolean;
  level?: 'Fundamental' | 'Intermediate' | 'Advanced';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  price?: number;
  duration?: string;
  isActive?: boolean;
  level?: 'Fundamental' | 'Intermediate' | 'Advanced';
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

// Course Detail Types
export interface CourseDetail {
  id: string;
  courseId: string;
  content: string;
  objectives: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseDetailRequest {
  courseId: string;
  content: string;
  objectives: string;
}

export interface UpdateCourseDetailRequest extends Partial<CreateCourseDetailRequest> {}

// Course Lesson Types
export interface CourseLesson {
  id: string;
  courseId: string;
  lessonId: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseLessonRequest {
  courseId: string;
  lessonId: string;
  order: number;
}

export interface UpdateCourseLessonRequest extends Partial<CreateCourseLessonRequest> {}

export interface Stage {
  id: string;
  courseId?: string;
  name: string;
  description: string;
  order: number;
  unlockCondition?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStageRequest {
  courseId?: string;
  name: string;
  description: string;
  order: number;
  unlockCondition?: boolean;
}

export interface UpdateStageRequest extends Partial<CreateStageRequest> {}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'student' | 'teacher' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'teacher' | 'admin';
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  password?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
