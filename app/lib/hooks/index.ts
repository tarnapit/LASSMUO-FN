// Export all hooks from a central location
export * from './useStageData';
export * from './useStageProgressManager';
export * from './useLearningData';
export * from './useCoursePostestData';
export * from './useQuizUnlockManager';

// Re-export specific hooks from useDataAdapter to avoid conflicts
export { 
  useLearningData as useDataAdapterLearning,
  useQuizData,
  useMiniGameData,
  useUserProgress
} from './useDataAdapter';