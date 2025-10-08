'use client';

import { useState, useEffect } from 'react';
import { courseService } from '../api/services';
import { LearningModule, Chapter, ChapterContent } from '../../types/learning';

// Custom hook for learning modules with real API data
export function useLearningModuleData() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningModules = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses from API
        const coursesResponse = await courseService.getAllCourses();
        
        if (!coursesResponse.success || !coursesResponse.data) {
          throw new Error('Failed to fetch courses');
        }

        const courses = coursesResponse.data;
        
        // Convert courses to learning modules format with basic structure
        const learningModules: LearningModule[] = courses.map((course: any) => ({
          id: course.id.toString(),
          title: course.title || 'Untitled Course',
          description: course.description || 'No description available',
          level: course.level || 'Fundamental' as const,
          estimatedTime: '30 minutes', // Default value
          coverImage: '/images/space/default-course.jpg', // Default image
          isActive: course.isActive ?? true,
          createAt: course.createdAt || new Date().toISOString(),
          chapters: [], // Will be populated when needed
        }));

        setModules(learningModules.filter(module => module.isActive));
        
      } catch (err) {
        console.error('Error fetching learning modules:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Fallback to mock data on error
        try {
          const { learningModules } = require('../../data/learning-modules');
          setModules(learningModules);
          setError(null); // Clear error since we have fallback data
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLearningModules();
  }, []);

  return {
    modules,
    loading,
    error,
  };
}

// Hook for detailed learning module with chapters
export function useLearningModuleDetail(moduleId: string) {
  const [module, setModule] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetail = async () => {
      if (!moduleId) return;

      try {
        setLoading(true);
        setError(null);

        // Get course by ID
        const courseResponse = await courseService.getCourseById(moduleId);
        
        if (!courseResponse.success || !courseResponse.data) {
          throw new Error('Course not found');
        }

        const course = courseResponse.data;
        
        // Build basic module structure
        const detailedModule: LearningModule = {
          id: course.id.toString(),
          title: course.title || 'Untitled Course',
          description: course.description || 'No description available',
          level: course.level || 'Fundamental' as const,
          estimatedTime: '30 minutes',
          coverImage: '/images/space/default-course.jpg',
          isActive: course.isActive ?? true,
          createAt: course.createdAt || new Date().toISOString(),
          chapters: [], // Basic empty chapters for now
        };

        setModule(detailedModule);
        
      } catch (err) {
        console.error('Error fetching module detail:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Fallback to mock data
        try {
          const { learningModules } = require('../../data/learning-modules');
          const mockModule = learningModules.find((m: any) => m.id === moduleId);
          if (mockModule) {
            setModule(mockModule);
            setError(null);
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback module:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetail();
  }, [moduleId]);

  return {
    module,
    loading,
    error,
  };
}

// Hook for user learning progress - simplified version
export function useUserLearningProgress(userId?: number) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          // No user ID, return empty progress
          setProgress(null);
          return;
        }

        // For now, just return null to use localStorage fallback
        // TODO: Implement when user progress API is ready
        setProgress(null);
        
      } catch (err) {
        console.error('Error fetching user progress:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  return {
    progress,
    loading,
    error,
  };
}

// Hook for updating learning progress - simplified version
export function useUpdateLearningProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = async (progressData: any) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual progress update when API is ready
      // For now, just log the progress data
      console.log('Progress update (mock):', progressData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
      
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProgress,
    loading,
    error,
  };
}