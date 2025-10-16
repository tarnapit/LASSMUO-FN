// Main API index file - exports everything from the API package
export * from './config';
export * from './types';
export * from './client';
export * from './services';

// Import services for convenience
import { 
  courseService, 
  stageService, 
  userService 
} from './services';

// Export default API object with all services
export const api = {
  course: courseService,
  stage: stageService,
  user: userService,
};

// Default export
export default api;
