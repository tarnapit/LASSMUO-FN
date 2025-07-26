import { useCallback } from 'react';
import { useFetch, useMutation } from './useApi';
import { stageService } from '../services';
import { Stage, CreateStageRequest, UpdateStageRequest } from '../types';
import { ApiResponse } from '../config';

// Hook for fetching all stages
export function useStages() {
  return useFetch(() => stageService.getAllStages());
}

// Hook for fetching stages by course
export function useStagesByCourse(courseId: string) {
  return useFetch(() => stageService.getStagesByCourseId(courseId), [courseId]);
}

// Hook for fetching a single stage
export function useStage(stageId: string) {
  return useFetch(() => stageService.getStageById(stageId), [stageId]);
}

// Hook for fetching ordered stages
export function useOrderedStages(courseId: string) {
  return useFetch(() => stageService.getStagesOrdered(courseId), [courseId]);
}

// Hook for stage management
export function useStageManagement() {
  const createStage = useMutation<ApiResponse<Stage>, [CreateStageRequest]>();
  const updateStage = useMutation<ApiResponse<Stage>, [string, UpdateStageRequest]>();
  const patchStage = useMutation<ApiResponse<Stage>, [string, Partial<UpdateStageRequest>]>();
  const deleteStage = useMutation<ApiResponse<void>, [string]>();

  const create = useCallback(async (stageData: CreateStageRequest) => {
    return await createStage.mutate(stageService.createStage, stageData);
  }, [createStage]);

  const update = useCallback(async (stageId: string, stageData: UpdateStageRequest) => {
    return await updateStage.mutate(stageService.updateStage, stageId, stageData);
  }, [updateStage]);

  const patch = useCallback(async (stageId: string, stageData: Partial<UpdateStageRequest>) => {
    return await patchStage.mutate(stageService.patchStage, stageId, stageData);
  }, [patchStage]);

  const remove = useCallback(async (stageId: string) => {
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
