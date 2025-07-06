export interface Course {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  level: 'Fundamental' | 'Intermediate' | 'Advanced';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  isActive: boolean;
  level: 'Fundamental' | 'Intermediate' | 'Advanced';
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface Stage {
  id: string;
  courseId: string;
  title: string;
  order: number;
  unlockCondition: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStageRequest {
  courseId: string;
  title: string;
  order: number;
  unlockCondition: boolean;
}

export interface UpdateStageRequest extends Partial<CreateStageRequest> {}

export interface Lesson {
  id: string;
  stageId?: string;
  title: string;
  content?: string;
  order?: number;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonRequest {
  stageId?: string;
  title: string;
  content?: string;
  order?: number;
  duration?: number;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

export interface Order {
  id: string;
  lessonId: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  lessonId: string;
  question: string;
  choices: string[];
  correctAnswer: string;
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  password?: string;
}

export interface Answer {
  id: string;
  userId: string;
  orderId: string;
  answer: string;
  isCorrect: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAnswerRequest {
  userId: string;
  orderId: string;
  answer: string;
  isCorrect: boolean;
}

export interface UpdateAnswerRequest extends Partial<CreateAnswerRequest> {}
