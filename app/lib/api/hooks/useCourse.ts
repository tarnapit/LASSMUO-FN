import { useCallback } from 'react';
import { useFetch, useMutation, useAsyncOperation } from './useApi';
import { courseService } from '../services';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../types';
import { ApiResponse } from '../config';

// Hook for fetching all courses
export function useCourses() {
  return useFetch(() => courseService.getAllCourses());
}

// Hook for fetching active courses only
export function useActiveCourses() {
  return useFetch(() => courseService.getActiveCourses());
}

// Hook for fetching courses by level
export function useCoursesByLevel(level: 'Fundamental' | 'Intermediate' | 'Advanced') {
  return useFetch(() => courseService.getCoursesByLevel(level), [level]);
}

// Hook for fetching a single course
export function useCourse(courseId: string) {
  return useFetch(() => courseService.getCourseById(courseId), [courseId]);
}

// Hook for creating a course
export function useCreateCourse() {
  return useMutation<ApiResponse<Course>, [CreateCourseRequest]>();
}

// Hook for updating a course
export function useUpdateCourse() {
  return useMutation<ApiResponse<Course>, [string, UpdateCourseRequest]>();
}

// Hook for patching a course
export function usePatchCourse() {
  return useMutation<ApiResponse<Course>, [string, Partial<UpdateCourseRequest>]>();
}

// Hook for deleting a course
export function useDeleteCourse() {
  return useMutation<ApiResponse<void>, [string]>();
}

// Combined hook for course management
export function useCourseManagement() {
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const patchCourse = usePatchCourse();
  const deleteCourse = useDeleteCourse();

  const create = useCallback(async (courseData: CreateCourseRequest) => {
    return await createCourse.mutate(courseService.createCourse, courseData);
  }, [createCourse]);

  const update = useCallback(async (courseId: string, courseData: UpdateCourseRequest) => {
    return await updateCourse.mutate(courseService.updateCourse, courseId, courseData);
  }, [updateCourse]);

  const patch = useCallback(async (courseId: string, courseData: Partial<UpdateCourseRequest>) => {
    return await patchCourse.mutate(courseService.patchCourse, courseId, courseData);
  }, [patchCourse]);

  const remove = useCallback(async (courseId: string) => {
    return await deleteCourse.mutate(courseService.deleteCourse, courseId);
  }, [deleteCourse]);

  return {
    create: {
      execute: create,
      loading: createCourse.loading,
      error: createCourse.error,
      success: createCourse.success,
      reset: createCourse.reset,
    },
    update: {
      execute: update,
      loading: updateCourse.loading,
      error: updateCourse.error,
      success: updateCourse.success,
      reset: updateCourse.reset,
    },
    patch: {
      execute: patch,
      loading: patchCourse.loading,
      error: patchCourse.error,
      success: patchCourse.success,
      reset: patchCourse.reset,
    },
    delete: {
      execute: remove,
      loading: deleteCourse.loading,
      error: deleteCourse.error,
      success: deleteCourse.success,
      reset: deleteCourse.reset,
    },
  };
}
