export interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  duration?: string;
  estimatedTime?: number;
  coverImage?: string;
  isActive?: boolean;
  level?: 'Fundamental' | 'Intermediate' | 'Advanced';
  createdAt?: string;
  createAt?: string;
  updatedAt?: string;
  courseLesson?: CourseLesson[];
  coursePostest?: CoursePostest[];
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
  courseId?: string;
  courseLessonId?: string;
  content: any; // เปลี่ยนเป็น any เพื่อรองรับ JSON object
  type?: string;
  objectives?: string;
  ImageUrl?: string;
  imageUrl?: string;
  required?: boolean;
  score?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseDetailRequest {
  courseId: string;
  content: string;
  objectives: string;
}

export interface UpdateCourseDetailRequest extends Partial<CreateCourseDetailRequest> {}

// Course Postest Types
export interface CoursePostest {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  maxAttempts?: number;
  question: any; // JSON field
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCoursePostestRequest {
  courseId: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  maxAttempts?: number;
  question: any;
}

export interface UpdateCoursePostestRequest extends Partial<CreateCoursePostestRequest> {}

// Course Lesson Types
export interface CourseLesson {
  id: string;
  courseId: string;
  lessonId?: string;
  title?: string;
  order?: number;
  estimatedTime?: number;
  createdAt?: string;
  updatedAt?: string;
  courseDetail?: CourseDetail[];
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
