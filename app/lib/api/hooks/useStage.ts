import { useCallback } from 'react';
import { useFetch, useMutation } from './useApi';
import { stageService } from '../services';
import { Stage as ApiStage, CreateStageRequest, UpdateStageRequest } from '../services/stageService';
import { ApiResponse } from '../config';

// Hook for fetching all stages
export function useStages() {
  return useFetch(() => stageService.getAllStages());
}

// Hook for fetching stages by difficulty
export function useStagesByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard') {
  return useFetch(() => stageService.getStagesByDifficulty(difficulty), [difficulty]);
}

// Hook for fetching a single stage
export function useStage(stageId: string) {
  return useFetch(async () => {
    try {
      console.log('🎯 useStage: Fetching stage by ID:', stageId);
      const response = await stageService.getAllStages();
      
      // Handle different response structures
      const responseAny = response as any;
      let stages = responseAny.stages || responseAny.data || response;
      
      console.log('🎯 useStage: Response structure:', { 
        hasStages: !!responseAny.stages, 
        hasData: !!responseAny.data,
        isArray: Array.isArray(stages)
      });
      
      if (Array.isArray(stages)) {
        const stage = stages.find((s: ApiStage) => s.id === parseInt(stageId));
        console.log('🎯 useStage: Found stage:', stage);
        
        if (stage) {
          return { success: true, data: stage };
        } else {
          throw new Error(`Stage with ID ${stageId} not found`);
        }
      }
      
      throw new Error('Invalid stages data format');
    } catch (error) {
      console.error('🔥 useStage: Error fetching stage:', error);
      // Fallback to mock data
      const { stageData } = await import('../../../data/stages');
      const stage = Object.values(stageData).find((s: any) => s.id === parseInt(stageId));
      if (stage) {
        return { success: true, data: stage };
      }
      throw error;
    }
  }, [stageId]);
}

// Hook for fetching ordered stages by difficulty
export function useOrderedStages() {
  return useFetch(() => stageService.getStagesOrderedByDifficulty());
}

// Hook for stage management
export function useStageManagement() {
  const createStage = useMutation<ApiResponse<ApiStage>, [CreateStageRequest]>();
  const updateStage = useMutation<ApiResponse<ApiStage>, [number, UpdateStageRequest]>();
  const patchStage = useMutation<ApiResponse<ApiStage>, [number, Partial<UpdateStageRequest>]>();
  const deleteStage = useMutation<ApiResponse<void>, [number]>();

  const create = useCallback(async (stageData: CreateStageRequest) => {
    return await createStage.mutate(stageService.createStage, stageData);
  }, [createStage]);

  const update = useCallback(async (stageId: number, stageData: UpdateStageRequest) => {
    return await updateStage.mutate(stageService.updateStage, stageId, stageData);
  }, [updateStage]);

  const patch = useCallback(async (stageId: number, stageData: Partial<UpdateStageRequest>) => {
    return await patchStage.mutate(stageService.patchStage, stageId, stageData);
  }, [patchStage]);

  const remove = useCallback(async (stageId: number) => {
    return await deleteStage.mutate(stageService.deleteStage, stageId);
  }, [deleteStage]);

  return {
    create: {
      execute: create,
      loading: createStage.loading,
      error: createStage.error,
      success: createStage.success,
      reset: createStage.reset,
    },
    update: {
      execute: update,
      loading: updateStage.loading,
      error: updateStage.error,
      success: updateStage.success,
      reset: updateStage.reset,
    },
    patch: {
      execute: patch,
      loading: patchStage.loading,
      error: patchStage.error,
      success: patchStage.success,
      reset: patchStage.reset,
    },
    delete: {
      execute: remove,
      loading: deleteStage.loading,
      error: deleteStage.error,
      success: deleteStage.success,
      reset: deleteStage.reset,
    },
  };
}
