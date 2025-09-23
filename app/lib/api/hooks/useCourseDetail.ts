import { useCallback } from 'react';
import { courseDetailService } from '../services';
import { CourseDetail, CreateCourseDetailRequest, UpdateCourseDetailRequest } from '../types';
import { ApiResponse } from '../config';
import { useApi, useMutation, useFetch } from './useApi';

// Hook for getting all course details
export function useCourseDetails() {
  return useFetch(
    () => courseDetailService.getAllCourseDetails(),
    []
  );
}

// Hook for getting course detail by course ID
export function useCourseDetailByCourseId(courseId: string | null) {
  return useFetch(
    () => courseId ? courseDetailService.getCourseDetailByCourseId(courseId) : Promise.resolve(null),
    [courseId]
  );
}

// Hook for creating course detail
export function useCreateCourseDetail() {
  return useMutation<ApiResponse<CourseDetail>, [CreateCourseDetailRequest]>();
}

// Hook for updating course detail
export function useUpdateCourseDetail() {
  return useMutation<ApiResponse<CourseDetail>, [string, UpdateCourseDetailRequest]>();
}

// Hook for patching course detail
export function usePatchCourseDetail() {
  return useMutation<ApiResponse<CourseDetail>, [string, Partial<UpdateCourseDetailRequest>]>();
}

// Hook for deleting course detail
export function useDeleteCourseDetail() {
  return useMutation<ApiResponse<void>, [string]>();
}

// Comprehensive hook for course detail operations
export function useCourseDetailOperations() {
  const createMutation = useCreateCourseDetail();
  const updateMutation = useUpdateCourseDetail();
  const patchMutation = usePatchCourseDetail();
  const deleteMutation = useDeleteCourseDetail();

  const createCourseDetail = useCallback(async (data: CreateCourseDetailRequest) => {
    return createMutation.mutate(courseDetailService.createCourseDetail, data);
  }, [createMutation]);

  const updateCourseDetail = useCallback(async (id: string, data: UpdateCourseDetailRequest) => {
    return updateMutation.mutate(courseDetailService.updateCourseDetail, id, data);
  }, [updateMutation]);

  const patchCourseDetail = useCallback(async (id: string, data: Partial<UpdateCourseDetailRequest>) => {
    return patchMutation.mutate(courseDetailService.patchCourseDetail, id, data);
  }, [patchMutation]);

  const deleteCourseDetail = useCallback(async (id: string) => {
    return deleteMutation.mutate(courseDetailService.deleteCourseDetail, id);
  }, [deleteMutation]);

  return {
    createCourseDetail,
    updateCourseDetail,
    patchCourseDetail,
    deleteCourseDetail,
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