import { useCallback } from 'react';
import { useFetch, useMutation } from './useApi';
import { questionService, Question, CreateQuestionRequest } from '../services/questionService';
import { ApiResponse } from '../config';

// Hook for fetching questions by type
export function useQuestionsByType(type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCHING' | 'DRAG_DROP') {
  return useFetch(() => questionService.getQuestionsByType(type), [type]);
}

// Hook for fetching random questions
export function useRandomQuestions(difficulty?: 'Easy' | 'Medium' | 'Hard', type?: string, count: number = 10) {
  return useFetch(() => questionService.getRandomQuestions(difficulty, type, count), [difficulty, type, count]);
}

// Hook for quiz management with simplified functionality
export function useQuiz() {
  const createQuestion = useMutation<ApiResponse<Question>, [CreateQuestionRequest]>();
  const validateAnswer = useMutation<ApiResponse<{
    isCorrect: boolean;
    correctAnswer: any;
    explanation?: string;
    funFact?: string;
    points: number;
  }>, [number, any]>();

  const submitQuestion = useCallback(async (questionData: CreateQuestionRequest) => {
    return await createQuestion.mutate(questionService.createQuestion, questionData);
  }, [createQuestion]);

  const checkAnswer = useCallback(async (questionId: number, answer: any) => {
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
  const deleteQuestion = useMutation<ApiResponse<void>, [number]>();
  const bulkCreate = useMutation<ApiResponse<Question[]>, [CreateQuestionRequest[]]>();

  const createQuizQuestion = useCallback(async (questionData: CreateQuestionRequest) => {
    return await createQuestion.mutate(questionService.createQuestion, questionData);
  }, [createQuestion]);

  const deleteQuizQuestion = useCallback(async (questionId: number) => {
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
