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
  forceUnlockNextStage: (completedStageId: number) => Promise<boolean>;
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
          let progressData = null;
          if (apiResponse?.success && Array.isArray(apiResponse.data)) {
            progressData = apiResponse.data;
          } else if (Array.isArray(apiResponse)) {
            // Sometimes the response is directly an array
            progressData = apiResponse;
          } else if (apiResponse?.data && Array.isArray(apiResponse.data)) {
            progressData = apiResponse.data;
          }
          
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
            
            // Process unlock logic for consecutive stages based on completion
            const allStageIds = Object.keys(combinedProgress).map(id => parseInt(id)).sort((a, b) => a - b);
            
            // Ensure stages are unlocked in sequence based on previous completions
            for (let i = 0; i < allStageIds.length; i++) {
              const currentStageId = allStageIds[i];
              const currentStage = combinedProgress[currentStageId];
              
              if (currentStageId === 1) {
                // Stage 1 is always unlocked
                currentStage.isUnlocked = true;
              } else {
                // Check if previous stage is completed
                const previousStageId = currentStageId - 1;
                const previousStage = combinedProgress[previousStageId];
                
                if (previousStage && (previousStage.isCompleted || (previousStage.stars && previousStage.stars >= 1))) {
                  currentStage.isUnlocked = true;
                  console.log(`🔓 Stage ${currentStageId} unlocked because stage ${previousStageId} is completed`);
                }
              }
            }
          } else {
            console.log('No API progress data found or invalid format, using local data only');
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
          const apiData: any = {
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

          // Remove undefined values
          Object.keys(apiData).forEach(key => {
            if (apiData[key] === undefined) {
              delete apiData[key];
            }
          });

          const response = await userStageProgressService.upsertProgress(
            userId.toString(),
            stageId,
            apiData
          );

          if (!response?.success) {
            console.warn('Failed to sync progress to API:', response?.error || 'Unknown error');
          } else {
            console.log('✅ Progress synced to API successfully');
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
    try {
      const currentProgress = progress[stageId] || {} as StageProgressData;
      
      const progressUpdate: Partial<StageProgressData> = {
        isCompleted: true,
        bestScore: Math.max(currentProgress.bestScore || 0, score),
        stars: Math.max(currentProgress.stars || 0, stars),
        xpEarned: (currentProgress.xpEarned || 0) + xpEarned,
        lastAttempt: new Date(),
        attempts: (currentProgress.attempts || 0) + 1,
      };

      // Update current stage progress first
      const updateSuccess = await updateStageProgress(stageId, progressUpdate);
      
      if (updateSuccess && stars >= 1) {
        // Unlock next stage if earned at least 1 star
        const nextStageId = stageId + 1;
        
        console.log(`🔓 Unlocking next stage ${nextStageId} after completing stage ${stageId} with ${stars} stars`);
        
        // Create or update next stage progress to be unlocked
        const nextStageUpdate: Partial<StageProgressData> = {
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
        };

        // Update local state immediately for next stage
        setProgress(prev => ({
          ...prev,
          [nextStageId]: {
            ...prev[nextStageId],
            ...nextStageUpdate
          }
        }));

        // Also save to localStorage immediately
        const localProgress = progressManager.getProgress();
        if (!localProgress.stages) localProgress.stages = {};
        localProgress.stages[nextStageId] = {
          ...localProgress.stages[nextStageId],
          ...nextStageUpdate
        };
        progressManager.saveProgress(localProgress);

        // Try to sync with API
        if (userId) {
          try {
            console.log(`🔄 Syncing unlock of stage ${nextStageId} to API...`);
            
            // Create minimal progress record to unlock the stage
            const unlockApiData = {
              userId: userId.toString(),
              stageId: nextStageId,
              isCompleted: false,
              currentScore: 0,
              bestScore: 0,
              starsEarned: 0,
              attempts: 0,
            };

            await userStageProgressService.upsertProgress(
              userId.toString(),
              nextStageId,
              unlockApiData
            );
            
            console.log(`✅ Stage ${nextStageId} unlock synced to API successfully`);
          } catch (apiError) {
            console.warn(`⚠️ Failed to sync stage ${nextStageId} unlock to API, but saved locally:`, apiError);
          }
        }
      }

      return updateSuccess;
    } catch (err) {
      console.error('Error completing stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete stage');
      return false;
    }
  }, [progress, updateStageProgress, userId]);

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

  // Force unlock next stage (utility function)
  const forceUnlockNextStage = useCallback(async (completedStageId: number): Promise<boolean> => {
    const nextStageId = completedStageId + 1;
    
    try {
      console.log(`🔓 Force unlocking stage ${nextStageId} after completing stage ${completedStageId}`);
      
      const nextStageUpdate: Partial<StageProgressData> = {
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
      };

      return await updateStageProgress(nextStageId, nextStageUpdate);
    } catch (err) {
      console.error('Error force unlocking next stage:', err);
      return false;
    }
  }, [updateStageProgress]);

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
    forceUnlockNextStage,
  };
}