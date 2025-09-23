import { useCallback } from 'react';
import { answerService } from '../services';
import { Answer, CreateAnswerRequest, UpdateAnswerRequest } from '../types';
import { ApiResponse } from '../config';
import { useApi, useMutation, useFetch } from './useApi';

// Hook for getting all answers
export function useAnswers() {
  return useFetch(
    () => answerService.getAllAnswers(),
    []
  );
}

// Hook for getting answer by ID
export function useAnswerById(answerId: string | null) {
  return useFetch(
    () => answerId ? answerService.getAnswerById(answerId) : Promise.resolve(null),
    [answerId]
  );
}

// Hook for getting answers by user ID
export function useAnswersByUserId(userId: string | null) {
  return useFetch(
    () => userId ? answerService.getAnswersByUserId(userId) : Promise.resolve(null),
    [userId]
  );
}

// Hook for getting answers by question ID
export function useAnswersByQuestionId(questionId: string | null) {
  return useFetch(
    () => questionId ? answerService.getAnswersByQuestionId(questionId) : Promise.resolve(null),
    [questionId]
  );
}

// Hook for creating answer
export function useCreateAnswer() {
  return useMutation<ApiResponse<Answer>, [CreateAnswerRequest]>();
}

// Hook for updating answer
export function useUpdateAnswer() {
  return useMutation<ApiResponse<Answer>, [string, UpdateAnswerRequest]>();
}

// Hook for patching answer
export function usePatchAnswer() {
  return useMutation<ApiResponse<Answer>, [string, Partial<UpdateAnswerRequest>]>();
}

// Hook for deleting answer
export function useDeleteAnswer() {
  return useMutation<ApiResponse<void>, [string]>();
}

// Hook for submitting quiz answers
export function useSubmitQuiz() {
  return useMutation<ApiResponse<{
    answers: Answer[];
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    percentage: number;
  }>, [CreateAnswerRequest[]]>();
}

// Comprehensive hook for answer operations
export function useAnswerOperations() {
  const createMutation = useCreateAnswer();
  const updateMutation = useUpdateAnswer();
  const patchMutation = usePatchAnswer();
  const deleteMutation = useDeleteAnswer();
  const submitQuizMutation = useSubmitQuiz();

  const createAnswer = useCallback(async (data: CreateAnswerRequest) => {
    return createMutation.mutate(answerService.createAnswer, data);
  }, [createMutation]);

  const updateAnswer = useCallback(async (id: string, data: UpdateAnswerRequest) => {
    return updateMutation.mutate(answerService.updateAnswer, id, data);
  }, [updateMutation]);

  const patchAnswer = useCallback(async (id: string, data: Partial<UpdateAnswerRequest>) => {
    return patchMutation.mutate(answerService.patchAnswer, id, data);
  }, [patchMutation]);

  const deleteAnswer = useCallback(async (id: string) => {
    return deleteMutation.mutate(answerService.deleteAnswer, id);
  }, [deleteMutation]);

  const submitQuizAnswers = useCallback(async (answers: CreateAnswerRequest[]) => {
    return submitQuizMutation.mutate(answerService.submitQuizAnswers, answers);
  }, [submitQuizMutation]);

  return {
    createAnswer,
    updateAnswer,
    patchAnswer,
    deleteAnswer,
    submitQuizAnswers,
    creating: createMutation.loading,
    updating: updateMutation.loading,
    patching: patchMutation.loading,
    deleting: deleteMutation.loading,
    submitting: submitQuizMutation.loading,
    createError: createMutation.error,
    updateError: updateMutation.error,
    patchError: patchMutation.error,
    deleteError: deleteMutation.error,
    submitError: submitQuizMutation.error,
    createSuccess: createMutation.success,
    updateSuccess: updateMutation.success,
    patchSuccess: patchMutation.success,
    deleteSuccess: deleteMutation.success,
    submitSuccess: submitQuizMutation.success,
    submitData: submitQuizMutation.data,
  };
}

// Hook for user progress tracking
export function useUserProgress(userId: string | null) {
  return useFetch(
    () => userId ? answerService.getUserProgress(userId) : Promise.resolve(null),
    [userId]
  );
}

// Hook for quiz results
export function useQuizResults(userId: string | null, lessonId?: string) {
  return useFetch(
    () => userId ? answerService.getUserQuizResults(userId, lessonId) : Promise.resolve(null),
    [userId, lessonId]
  );
}

// Hook for leaderboard
export function useLeaderboard(courseId?: string, limit: number = 10) {
  return useFetch(
    () => answerService.getLeaderboard(courseId, limit),
    [courseId, limit]
  );
}

// Hook for question statistics
export function useQuestionStats(questionId: string | null) {
  return useFetch(
    () => questionId ? answerService.getQuestionStats(questionId) : Promise.resolve(null),
    [questionId]
  );
}