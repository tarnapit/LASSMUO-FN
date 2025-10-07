import { useCallback } from 'react';
import { useFetch, useMutation } from './useApi';
import { questionService } from '../services';
import { ApiResponse } from '../config';

// Basic types for questions (using local interface since not exported from main types)
interface Question {
  id?: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateQuestionRequest {
  question: string;
  options?: string[];
  correctAnswer?: string;
  difficulty?: string;
  category?: string;
}

// Hook for fetching questions by category
export function useQuestionsByCategory(category: string) {
  return useFetch(() => questionService.getQuestionsByCategory(category), [category]);
}

// Hook for fetching random questions
export function useRandomQuestions(category?: string, difficulty?: string, count: number = 10) {
  return useFetch(() => questionService.getRandomQuestions(category, difficulty, count), [category, difficulty, count]);
}

// Hook for quiz management with simplified functionality
export function useQuiz() {
  const createQuestion = useMutation<ApiResponse<Question>, [CreateQuestionRequest]>();
  const validateAnswer = useMutation<ApiResponse<{
    isCorrect: boolean;
    correctAnswer?: string;
    explanation?: string;
  }>, [string, string]>();

  const submitQuestion = useCallback(async (questionData: CreateQuestionRequest) => {
    return await createQuestion.mutate(questionService.createQuestion, questionData);
  }, [createQuestion]);

  const checkAnswer = useCallback(async (questionId: string, answer: string) => {
    return await validateAnswer.mutate(questionService.validateAnswer, questionId, answer);
  }, [validateAnswer]);

  return {
    submit: {
      execute: submitQuestion,
      loading: createQuestion.loading,
      error: createQuestion.error,
      success: createQuestion.success,
      data: createQuestion.data,
      reset: createQuestion.reset,
    },
    validate: {
      execute: checkAnswer,
      loading: validateAnswer.loading,
      error: validateAnswer.error,
      success: validateAnswer.success,
      data: validateAnswer.data,
      reset: validateAnswer.reset,
    },
  };
}

// Hook for creating quiz questions
export function useQuizManagement() {
  const createQuestion = useMutation<ApiResponse<Question>, [CreateQuestionRequest]>();
  const deleteQuestion = useMutation<ApiResponse<void>, [string]>();
  const bulkCreate = useMutation<ApiResponse<Question[]>, [CreateQuestionRequest[]]>();

  const createQuizQuestion = useCallback(async (questionData: CreateQuestionRequest) => {
    return await createQuestion.mutate(questionService.createQuestion, questionData);
  }, [createQuestion]);

  const deleteQuizQuestion = useCallback(async (questionId: string) => {
    return await deleteQuestion.mutate(questionService.deleteQuestion, questionId);
  }, [deleteQuestion]);

  const bulkCreateQuestions = useCallback(async (questions: CreateQuestionRequest[]) => {
    return await bulkCreate.mutate(questionService.bulkCreateQuestions, questions);
  }, [bulkCreate]);

  return {
    createQuestion: {
      execute: createQuizQuestion,
      loading: createQuestion.loading,
      error: createQuestion.error,
      success: createQuestion.success,
      data: createQuestion.data,
      reset: createQuestion.reset,
    },
    delete: {
      execute: deleteQuizQuestion,
      loading: deleteQuestion.loading,
      error: deleteQuestion.error,
      success: deleteQuestion.success,
      reset: deleteQuestion.reset,
    },
    bulkCreate: {
      execute: bulkCreateQuestions,
      loading: bulkCreate.loading,
      error: bulkCreate.error,
      success: bulkCreate.success,
      data: bulkCreate.data,
      reset: bulkCreate.reset,
    },
  };
}
