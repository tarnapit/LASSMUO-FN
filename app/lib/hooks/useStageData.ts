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

        console.log('Fetching stages from API...');
        const response = await stageService.getAllStages();
        
        // Check if response has data (API response structure can be: {stages: Array}, {data: Array}, or direct Array)
        if (response) {
          let stagesData;
          
          // The API returns raw JSON, so we need to check the actual response structure
          const responseAny = response as any;
          
          if (responseAny.stages && Array.isArray(responseAny.stages)) {
            stagesData = responseAny.stages;
          } else if (responseAny.data && Array.isArray(responseAny.data)) {
            stagesData = responseAny.data;
          } else if (Array.isArray(responseAny)) {
            stagesData = responseAny;
          } else {
            throw new Error('Invalid stages data format received from API');
          }
          
          console.log('Stages fetched successfully:', stagesData);
          setStages(stagesData);
          setError(null);
        } else {
          throw new Error('No stages data received from API');
        }
        
      } catch (err) {
        console.error('Error fetching stages from API:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Fallback to mock data
        console.log('Falling back to mock data...');
        try {
          const { stageData } = require('../../data/stages');
          const mockStages = Object.values(stageData) as Stage[];
          console.log('Mock stages loaded:', mockStages);
          setStages(mockStages);
          setError(null); // Clear error since we have fallback data
        } catch (fallbackError) {
          console.error('Failed to load fallback stage data:', fallbackError);
          setError('Failed to load stage data from both API and mock sources');
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
        setError(null);
      } else {
        throw new Error(response.error || 'Failed to refetch stages');
      }
    } catch (err) {
      console.error('Error refetching stages:', err);
      setError(err instanceof Error ? err.message : 'Failed to refetch stages');
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

        // Since backend doesn't have /stage/{id} endpoint, get all stages and filter
        console.log('Fetching stage by ID from all stages...');
        const response = await stageService.getAllStages();
        
        // Parse the response to get stages array
        let stagesData;
        const responseAny = response as any;
        
        if (responseAny.stages && Array.isArray(responseAny.stages)) {
          stagesData = responseAny.stages;
        } else if (responseAny.data && Array.isArray(responseAny.data)) {
          stagesData = responseAny.data;
        } else if (Array.isArray(responseAny)) {
          stagesData = responseAny;
        } else {
          throw new Error('No stages data received from API');
        }

        // Find the specific stage by ID
        const foundStage = stagesData.find((stage: any) => stage.id === stageId);
        
        if (foundStage) {
          console.log('Stage found successfully:', foundStage);
          setStage(foundStage);
          setError(null);
        } else {
          throw new Error(`Stage with ID ${stageId} not found`);
        }
        
      } catch (err) {
        console.error('Error fetching stage:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        // Fallback to mock data
        try {
          const { stageData } = require('../../data/stages');
          const mockStage = stageData[stageId];
          if (mockStage) {
            console.log('Using mock stage data for ID:', stageId);
            setStage(mockStage);
            setError(null);
          } else {
            console.error('Mock stage not found for ID:', stageId);
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

// Hook for user stage progress with enhanced API integration
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
          console.log('No user ID provided, using empty progress');
          setProgress([]);
          return;
        }

        console.log('Fetching user stage progress for user:', userId);
        const response = await userStageProgressService.getUserProgress(userId.toString());
        
        if (response.success && response.data) {
          console.log('User progress fetched successfully:', response.data);
          setProgress(response.data);
        } else {
          console.log('No progress found or API error, using empty progress');
          setProgress([]);
        }
        
      } catch (err) {
        console.error('Error fetching user progress from API:', err);
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
          setError(null);
        } else {
          setProgress([]);
        }
      } catch (err) {
        console.error('Error refetching progress:', err);
        setError(err instanceof Error ? err.message : 'Failed to refetch progress');
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

// Hook for updating stage progress with enhanced API integration
export function useUpdateStageProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = async (progressData: { 
    userId: number; 
    stageId: number; 
    isCompleted?: boolean;
    currentScore?: number;
    bestScore?: number;
    starsEarned?: number;
    attempts?: number;
    lastAttemptAt?: string;
    completedAt?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const { userId, stageId, ...progressUpdate } = progressData;
      
      console.log('Updating stage progress:', { userId, stageId, progressUpdate });
      
      const response = await userStageProgressService.upsertProgress(
        userId.toString(), 
        stageId, 
        progressUpdate
      );
      
      if (response.success) {
        console.log('Stage progress updated successfully:', response.data);
        return response;
      } else {
        throw new Error(response.error || 'Failed to update progress');
      }
      
    } catch (err) {
      console.error('Error updating stage progress:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const completeStage = async (userId: number, stageId: number, finalScore: number, starsEarned: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Completing stage:', { userId, stageId, finalScore, starsEarned });
      
      const response = await userStageProgressService.completeStage(
        userId.toString(),
        stageId,
        finalScore,
        starsEarned
      );
      
      if (response.success) {
        console.log('Stage completed successfully:', response.data);
        return response;
      } else {
        throw new Error(response.error || 'Failed to complete stage');
      }
      
    } catch (err) {
      console.error('Error completing stage:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const recordAttempt = async (userId: number, stageId: number, score: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Recording stage attempt:', { userId, stageId, score });
      
      const response = await userStageProgressService.recordAttempt(
        userId.toString(),
        stageId,
        score
      );
      
      if (response.success) {
        console.log('Stage attempt recorded successfully:', response.data);
        return response;
      } else {
        throw new Error(response.error || 'Failed to record attempt');
      }
      
    } catch (err) {
      console.error('Error recording stage attempt:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProgress,
    completeStage,
    recordAttempt,
    loading,
    error,
  };
}