// Main API index file - exports everything from the API package
export * from './config';
export * from './types';
export * from './client';
export * from './services';

// Import services for convenience
import { 
  courseService, 
  stageService, 
  lessonService, 
  orderService, 
  userService, 
  answerService 
} from './services';

// Export default API object with all services
export const api = {
  course: courseService,
  stage: stageService,
  lesson: lessonService,
  order: orderService,
  user: userService,
  answer: answerService,
};

// Default export
export default api;
