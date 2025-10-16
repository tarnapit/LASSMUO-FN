// Export all services from a single index file
export { courseService, CourseService } from './courseService';
export { courseDetailService, CourseDetailService } from './courseDetailService';
export { courseLessonService, CourseLessonService } from './courseLessonService';
export { courseQuizService, CourseQuizService } from './courseQuizService';
export { coursePostestService, CoursePostestService } from './coursePostestService';
export { stageService, StageService } from './stageService';
export { questionService, QuestionService } from './questionService';
export { miniGameService, MiniGameService } from './miniGameService';
export { userService, UserService } from './userService';
export { userCourseProgressService, UserCourseProgressService } from './userCourseProgressService';
export { userStageProgressService, UserStageProgressService } from './userStageProgressService';
export { authService, AuthService } from './authService';

// Export types
export * from '../types';
export * from '../config';

// Export client
export { apiClient, ApiClient } from '../client';
