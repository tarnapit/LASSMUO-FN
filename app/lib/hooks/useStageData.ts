'use client';

import { useState, useEffect } from 'react';
import { stageService, userStageProgressService } from '../api/services';
import { Stage, UserStageProgress } from '../../types/stage';

// Hook for fetching all stages from API
export function useStageData() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await stageService.getAllStages();
        
        if (!response.success || !response.data) {
          throw new Error('Failed to fetch stages');
        }

        setStages(response.data);
        
      } catch (err) {
        console.error('Error fetching stages:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Fallback to mock data
        try {
          const { stageData } = require('../../data/stages');
          const mockStages = Object.values(stageData) as Stage[];
          setStages(mockStages);
          setError(null); // Clear error since we have fallback data
        } catch (fallbackError) {
          console.error('Failed to load fallback stage data:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await stageService.getAllStages();
      if (response.success && response.data) {
        setStages(response.data);
      }
    } catch (err) {
      console.error('Error refetching stages:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stages,
    loading,
    error,
    refetch,
  };
}

// Hook for fetching single stage by ID
export function useStageById(stageId: number) {
  const [stage, setStage] = useState<Stage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStage = async () => {
      if (!stageId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await stageService.getStageById(stageId);
        
        if (!response.success || !response.data) {
          throw new Error('Stage not found');
        }

        setStage(response.data);
        
      } catch (err) {
        console.error('Error fetching stage:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Fallback to mock data
        try {
          const { stageData } = require('../../data/stages');
          const mockStage = stageData[stageId];
          if (mockStage) {
            setStage(mockStage);
            setError(null);
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback stage data:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStage();
  }, [stageId]);

  return {
    stage,
    loading,
    error,
  };
}

// Hook for user stage progress
export function useUserStageProgress(userId?: number) {
  const [progress, setProgress] = useState<UserStageProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          // No user ID, use empty progress
          setProgress([]);
          return;
        }

        const response = await userStageProgressService.getUserProgress(userId.toString());
        
        if (response.success && response.data) {
          setProgress(response.data);
        } else {
          // No progress found, use empty array
          setProgress([]);
        }
        
      } catch (err) {
        console.error('Error fetching user progress:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setProgress([]); // Default to empty progress
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const refetch = async () => {
    if (userId) {
      setLoading(true);
      try {
        const response = await userStageProgressService.getUserProgress(userId.toString());
        if (response.success && response.data) {
          setProgress(response.data);
        }
      } catch (err) {
        console.error('Error refetching progress:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    progress,
    loading,
    error,
    refetch,
  };
}

// Hook for updating stage progress
export function useUpdateStageProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = async (progressData: { userId: number; stageId: number; [key: string]: any }) => {
    try {
      setLoading(true);
      setError(null);

      const { userId, stageId, ...progressUpdate } = progressData;
      const response = await userStageProgressService.upsertProgress(
        userId.toString(), 
        stageId, 
        progressUpdate
      );
      
      if (!response.success) {
        throw new Error('Failed to update progress');
      }

      return response;
      
    } catch (err) {
      console.error('Error updating stage progress:', err);
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