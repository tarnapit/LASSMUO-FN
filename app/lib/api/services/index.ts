// Export all services from a single index file
export { courseService, CourseService } from './courseService';
export { courseDetailService, CourseDetailService } from './courseDetailService';
export { courseLessonService, CourseLessonService } from './courseLessonService';
export { courseQuizService, CourseQuizService } from './courseQuizService';
export { stageService, StageService } from './stageService';
export { lessonService, LessonService } from './lessonService';
export { orderService, OrderService } from './orderService';
export { questionService, QuestionService } from './questionService';
export { userService, UserService } from './userService';
export { userCourseProgressService, UserCourseProgressService } from './userCourseProgressService';
export { answerService, AnswerService } from './answerService';
export { authService, AuthService } from './authService';

// Export types
export * from '../types';
export * from '../config';

// Export client
export { apiClient, ApiClient } from '../client';
