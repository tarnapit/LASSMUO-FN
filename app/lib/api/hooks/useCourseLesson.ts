import { useCallback } from 'react';
import { courseLessonService } from '../services';
import { CourseLesson, CreateCourseLessonRequest, UpdateCourseLessonRequest } from '../types';
import { ApiResponse } from '../config';
import { useApi, useMutation, useFetch } from './useApi';

// Hook for getting all course lessons
export function useCourseLessons() {
  return useFetch(
    () => courseLessonService.getAllCourseLessons(),
    []
  );
}

// Hook for getting course lessons by course ID
export function useCourseLessonsByCourseId(courseId: string | null) {
  return useFetch(
    () => courseId ? courseLessonService.getCourseLessonsByCourseId(courseId) : Promise.resolve(null),
    [courseId]
  );
}

// Hook for getting course lesson by lesson ID
export function useCourseLessonByLessonId(lessonId: string | null) {
  return useFetch(
    () => lessonId ? courseLessonService.getCourseLessonByLessonId(lessonId) : Promise.resolve(null),
    [lessonId]
  );
}

// Hook for creating course lesson
export function useCreateCourseLesson() {
  return useMutation<ApiResponse<CourseLesson>, [CreateCourseLessonRequest]>();
}

// Hook for updating course lesson
export function useUpdateCourseLesson() {
  return useMutation<ApiResponse<CourseLesson>, [string, UpdateCourseLessonRequest]>();
}

// Hook for patching course lesson
export function usePatchCourseLesson() {
  return useMutation<ApiResponse<CourseLesson>, [string, Partial<UpdateCourseLessonRequest>]>();
}

// Hook for deleting course lesson
export function useDeleteCourseLesson() {
  return useMutation<ApiResponse<void>, [string]>();
}

// Comprehensive hook for course lesson operations
export function useCourseLessonOperations() {
  const createMutation = useCreateCourseLesson();
  const updateMutation = useUpdateCourseLesson();
  const patchMutation = usePatchCourseLesson();
  const deleteMutation = useDeleteCourseLesson();

  const createCourseLesson = useCallback(async (data: CreateCourseLessonRequest) => {
    return createMutation.mutate(courseLessonService.createCourseLesson, data);
  }, [createMutation]);

  const updateCourseLesson = useCallback(async (id: string, data: UpdateCourseLessonRequest) => {
    return updateMutation.mutate(courseLessonService.updateCourseLesson, id, data);
  }, [updateMutation]);

  const patchCourseLesson = useCallback(async (id: string, data: Partial<UpdateCourseLessonRequest>) => {
    return patchMutation.mutate(courseLessonService.patchCourseLesson, id, data);
  }, [patchMutation]);

  const deleteCourseLesson = useCallback(async (id: string) => {
    return deleteMutation.mutate(courseLessonService.deleteCourseLesson, id);
  }, [deleteMutation]);

  const getCourseLessonsOrdered = useCallback(async (courseId: string) => {
    return courseLessonService.getCourseLessonsOrdered(courseId);
  }, []);

  return {
    createCourseLesson,
    updateCourseLesson,
    patchCourseLesson,
    deleteCourseLesson,
    getCourseLessonsOrdered,
    creating: createMutation.loading,
    updating: updateMutation.loading,
    patching: patchMutation.loading,
    deleting: deleteMutation.loading,
    createError: createMutation.error,
    updateError: updateMutation.error,
    patchError: patchMutation.error,
    deleteError: deleteMutation.error,
    createSuccess: createMutation.success,
    updateSuccess: updateMutation.success,
    patchSuccess: patchMutation.success,
    deleteSuccess: deleteMutation.success,
  };
}