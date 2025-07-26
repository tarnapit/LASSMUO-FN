import { useCallback } from 'react';
import { useFetch, useMutation } from './useApi';
import { lessonService } from '../services';
import { Lesson, CreateLessonRequest, UpdateLessonRequest } from '../types';
import { ApiResponse } from '../config';

// Hook for fetching all lessons
export function useLessons() {
  return useFetch(() => lessonService.getAllLessons());
}

// Hook for fetching lessons by stage
export function useLessonsByStage(stageId: string) {
  return useFetch(() => lessonService.getLessonsByStageId(stageId), [stageId]);
}

// Hook for fetching a single lesson
export function useLesson(lessonId: string) {
  return useFetch(() => lessonService.getLessonById(lessonId), [lessonId]);
}

// Hook for fetching ordered lessons
export function useOrderedLessons(stageId: string) {
  return useFetch(() => lessonService.getLessonsOrdered(stageId), [stageId]);
}

// Hook for lesson management
export function useLessonManagement() {
  const createLesson = useMutation<ApiResponse<Lesson>, [CreateLessonRequest]>();
  const updateLesson = useMutation<ApiResponse<Lesson>, [string, UpdateLessonRequest]>();
  const patchLesson = useMutation<ApiResponse<Lesson>, [string, Partial<UpdateLessonRequest>]>();
  const deleteLesson = useMutation<ApiResponse<void>, [string]>();

  const create = useCallback(async (lessonData: CreateLessonRequest) => {
    return await createLesson.mutate(lessonService.createLesson, lessonData);
  }, [createLesson]);

  const update = useCallback(async (lessonId: string, lessonData: UpdateLessonRequest) => {
    return await updateLesson.mutate(lessonService.updateLesson, lessonId, lessonData);
  }, [updateLesson]);

  const patch = useCallback(async (lessonId: string, lessonData: Partial<UpdateLessonRequest>) => {
    return await patchLesson.mutate(lessonService.patchLesson, lessonId, lessonData);
  }, [patchLesson]);

  const remove = useCallback(async (lessonId: string) => {
    return await deleteLesson.mutate(lessonService.deleteLesson, lessonId);
  }, [deleteLesson]);

  return {
    create: {
      execute: create,
      loading: createLesson.loading,
      error: createLesson.error,
      success: createLesson.success,
      reset: createLesson.reset,
    },
    update: {
      execute: update,
      loading: updateLesson.loading,
      error: updateLesson.error,
      success: updateLesson.success,
      reset: updateLesson.reset,
    },
    patch: {
      execute: patch,
      loading: patchLesson.loading,
      error: patchLesson.error,
      success: patchLesson.success,
      reset: patchLesson.reset,
    },
    delete: {
      execute: remove,
      loading: deleteLesson.loading,
      error: deleteLesson.error,
      success: deleteLesson.success,
      reset: deleteLesson.reset,
    },
  };
}
