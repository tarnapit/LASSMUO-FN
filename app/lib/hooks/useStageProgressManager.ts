'use client';

import { useState, useEffect, useCallback } from 'react';
import { userStageProgressService } from '../api/services';
import { progressManager } from '../progress';
import { authManager } from '../auth';

export interface StageProgressData {
  stageId: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
  bestScore: number;
  attempts: number;
  lastAttempt?: Date;
  xpEarned: number;
  perfectRuns: number;
  averageTime: number;
  mistakeCount: number;
  hintsUsed: number;
  achievements: string[];
}

export interface UseStageProgressManagerReturn {
  progress: { [stageId: number]: StageProgressData };
  loading: boolean;
  error: string | null;
  updateStageProgress: (stageId: number, progressUpdate: Partial<StageProgressData>) => Promise<boolean>;
  completeStage: (stageId: number, score: number, stars: number, xpEarned: number) => Promise<boolean>;
  recordAttempt: (stageId: number, score: number) => Promise<boolean>;
  resetStageProgress: (stageId: number) => Promise<boolean>;
  syncWithAPI: () => Promise<boolean>;
  refreshProgress: () => void;
}

export function useStageProgressManager(userId?: string | number): UseStageProgressManagerReturn {
  const [progress, setProgress] = useState<{ [stageId: number]: StageProgressData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load progress from both API and localStorage
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let combinedProgress: { [stageId: number]: StageProgressData } = {};

      // First, load from localStorage
      const localProgress = progressManager.getProgress();
      if (localProgress?.stages) {
        Object.entries(localProgress.stages).forEach(([stageId, stageData]: [string, any]) => {
          combinedProgress[parseInt(stageId)] = {
            stageId: parseInt(stageId),
            isUnlocked: stageData.isUnlocked || false,
            isCompleted: stageData.isCompleted || false,
            stars: stageData.stars || 0,
            bestScore: stageData.bestScore || 0,
            attempts: stageData.attempts || 0,
            lastAttempt: stageData.lastAttempt ? new Date(stageData.lastAttempt) : undefined,
            xpEarned: stageData.xpEarned || 0,
            perfectRuns: stageData.perfectRuns || 0,
            averageTime: stageData.averageTime || 0,
            mistakeCount: stageData.mistakeCount || 0,
            hintsUsed: stageData.hintsUsed || 0,
            achievements: stageData.achievements || [],
          };
        });
      }

      // If user is logged in, try to load from API and merge
      if (userId) {
        try {
          console.log('Loading progress from API for user:', userId);
          const apiResponse = await userStageProgressService.getUserProgress(userId.toString());
          
          // Check if response has data
          const progressData = apiResponse?.data || apiResponse;
          if (progressData && Array.isArray(progressData)) {
            console.log('API progress loaded:', progressData);
            
            // Merge API data with local data (API takes precedence for completed stages)
            progressData.forEach((apiProgress: any) => {
              const stageId = apiProgress.stageId;
              const existingProgress = combinedProgress[stageId] || {} as StageProgressData;
              
              combinedProgress[stageId] = {
                stageId,
                isUnlocked: apiProgress.isCompleted || existingProgress.isUnlocked || stageId === 1,
                isCompleted: apiProgress.isCompleted || existingProgress.isCompleted,
                stars: Math.max(apiProgress.starsEarned || 0, existingProgress.stars || 0),
                bestScore: Math.max(apiProgress.bestScore || 0, existingProgress.bestScore || 0),
                attempts: Math.max(apiProgress.attempts || 0, existingProgress.attempts || 0),
                lastAttempt: apiProgress.lastAttemptAt ? new Date(apiProgress.lastAttemptAt) : existingProgress.lastAttempt,
                xpEarned: existingProgress.xpEarned || 0,
                perfectRuns: existingProgress.perfectRuns || 0,
                averageTime: existingProgress.averageTime || 0,
                mistakeCount: existingProgress.mistakeCount || 0,
                hintsUsed: existingProgress.hintsUsed || 0,
                achievements: existingProgress.achievements || [],
              };
            });
          } else {
            console.log('No API progress data found, using local data only');
          }
        } catch (apiError) {
          console.warn('Failed to load progress from API, using local data only:', apiError);
        }
      }

      // Ensure stage 1 is always unlocked
      if (!combinedProgress[1]) {
        combinedProgress[1] = {
          stageId: 1,
          isUnlocked: true,
          isCompleted: false,
          stars: 0,
          bestScore: 0,
          attempts: 0,
          xpEarned: 0,
          perfectRuns: 0,
          averageTime: 0,
          mistakeCount: 0,
          hintsUsed: 0,
          achievements: [],
        };
      } else {
        combinedProgress[1].isUnlocked = true;
      }

      // console.log('Combined progress loaded:', combinedProgress); // Reduce logging
      setProgress(combinedProgress);

    } catch (err) {
      console.error('Error loading stage progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initialize progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Update stage progress
  const updateStageProgress = useCallback(async (
    stageId: number, 
    progressUpdate: Partial<StageProgressData>
  ): Promise<boolean> => {
    try {
      const currentProgress = progress[stageId] || {
        stageId,
        isUnlocked: false,
        isCompleted: false,
        stars: 0,
        bestScore: 0,
        attempts: 0,
        xpEarned: 0,
        perfectRuns: 0,
        averageTime: 0,
        mistakeCount: 0,
        hintsUsed: 0,
        achievements: [],
      };

      const updatedProgress = { ...currentProgress, ...progressUpdate };

      // Update local state
      setProgress(prev => ({
        ...prev,
        [stageId]: updatedProgress
      }));

      // Update localStorage
      const localProgress = progressManager.getProgress();
      if (!localProgress.stages) localProgress.stages = {};
      localProgress.stages[stageId] = updatedProgress;
      progressManager.saveProgress(localProgress);

      // Update API if user is logged in
      if (userId) {
        try {
          const apiData = {
            userId: userId.toString(),
            stageId,
            isCompleted: updatedProgress.isCompleted,
            currentScore: updatedProgress.bestScore,
            bestScore: updatedProgress.bestScore,
            starsEarned: updatedProgress.stars,
            attempts: updatedProgress.attempts,
            lastAttemptAt: updatedProgress.lastAttempt?.toISOString(),
            completedAt: updatedProgress.isCompleted ? new Date().toISOString() : undefined,
          };

          const response = await userStageProgressService.upsertProgress(
            userId.toString(),
            stageId,
            apiData
          );

          if (!response.success) {
            console.warn('Failed to sync progress to API:', response.error);
          }
        } catch (apiError) {
          console.warn('API sync failed, progress saved locally only:', apiError);
        }
      }

      console.log(`Stage ${stageId} progress updated:`, updatedProgress);
      return true;

    } catch (err) {
      console.error('Error updating stage progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      return false;
    }
  }, [progress, userId]);

  // Complete stage
  const completeStage = useCallback(async (
    stageId: number,
    score: number,
    stars: number,
    xpEarned: number
  ): Promise<boolean> => {
    const progressUpdate: Partial<StageProgressData> = {
      isCompleted: true,
      bestScore: Math.max(progress[stageId]?.bestScore || 0, score),
      stars: Math.max(progress[stageId]?.stars || 0, stars),
      xpEarned: (progress[stageId]?.xpEarned || 0) + xpEarned,
      lastAttempt: new Date(),
    };

    // Unlock next stage
    const nextStageId = stageId + 1;
    if (stars >= 1) { // Need at least 1 star to unlock next stage
      setProgress(prev => ({
        ...prev,
        [nextStageId]: {
          ...prev[nextStageId],
          stageId: nextStageId,
          isUnlocked: true,
          isCompleted: false,
          stars: 0,
          bestScore: 0,
          attempts: 0,
          xpEarned: 0,
          perfectRuns: 0,
          averageTime: 0,
          mistakeCount: 0,
          hintsUsed: 0,
          achievements: [],
        }
      }));
    }

    return updateStageProgress(stageId, progressUpdate);
  }, [progress, updateStageProgress]);

  // Record attempt
  const recordAttempt = useCallback(async (
    stageId: number,
    score: number
  ): Promise<boolean> => {
    const currentProgress = progress[stageId];
    const progressUpdate: Partial<StageProgressData> = {
      attempts: (currentProgress?.attempts || 0) + 1,
      bestScore: Math.max(currentProgress?.bestScore || 0, score),
      lastAttempt: new Date(),
    };

    return updateStageProgress(stageId, progressUpdate);
  }, [progress, updateStageProgress]);

  // Reset stage progress
  const resetStageProgress = useCallback(async (stageId: number): Promise<boolean> => {
    const progressUpdate: Partial<StageProgressData> = {
      isCompleted: false,
      stars: 0,
      bestScore: 0,
      attempts: 0,
      xpEarned: 0,
      perfectRuns: 0,
      averageTime: 0,
      mistakeCount: 0,
      hintsUsed: 0,
      achievements: [],
      lastAttempt: undefined,
    };

    return updateStageProgress(stageId, progressUpdate);
  }, [updateStageProgress]);

  // Sync with API
  const syncWithAPI = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      console.log('Syncing progress with API...');
      await loadProgress();
      return true;
    } catch (err) {
      console.error('Failed to sync with API:', err);
      return false;
    }
  }, [userId, loadProgress]);

  // Refresh progress
  const refreshProgress = useCallback(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    error,
    updateStageProgress,
    completeStage,
    recordAttempt,
    resetStageProgress,
    syncWithAPI,
    refreshProgress,
  };
}