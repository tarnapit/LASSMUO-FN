import { useCallback } from 'react';
import { useFetch, useMutation } from './useApi';
import { orderService, answerService } from '../services';
import { Order, Answer, CreateOrderRequest, CreateAnswerRequest } from '../types';
import { ApiResponse } from '../config';

// Hook for fetching orders by lesson
export function useOrdersByLesson(lessonId: string) {
  return useFetch(() => orderService.getOrdersByLessonId(lessonId), [lessonId]);
}

// Hook for fetching random orders for quiz
export function useRandomOrdersForQuiz(lessonId: string, count: number = 10) {
  return useFetch(() => orderService.getRandomOrders(lessonId, count), [lessonId, count]);
}

// Hook for quiz management
export function useQuiz() {
  const submitAnswers = useMutation<ApiResponse<{
    answers: Answer[];
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    percentage: number;
  }>, [CreateAnswerRequest[]]>();

  const validateAnswer = useMutation<ApiResponse<{
    isCorrect: boolean;
    correctAnswer?: string;
    explanation?: string;
  }>, [string, string]>();

  const submitQuiz = useCallback(async (answers: CreateAnswerRequest[]) => {
    return await submitAnswers.mutate(answerService.submitQuizAnswers, answers);
  }, [submitAnswers]);

  const checkAnswer = useCallback(async (orderId: string, answer: string) => {
    return await validateAnswer.mutate(orderService.validateAnswer, orderId, answer);
  }, [validateAnswer]);

  return {
    submit: {
      execute: submitQuiz,
      loading: submitAnswers.loading,
      error: submitAnswers.error,
      success: submitAnswers.success,
      data: submitAnswers.data,
      reset: submitAnswers.reset,
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

// Hook for fetching user's quiz results (in quiz context)
export function useQuizUserResults(userId: string, lessonId?: string) {
  return useFetch(() => answerService.getUserQuizResults(userId, lessonId), [userId, lessonId]);
}

// Hook for fetching user's progress (in quiz context)
export function useQuizUserProgress(userId: string) {
  return useFetch(() => answerService.getUserProgress(userId), [userId]);
}

// Hook for fetching quiz statistics
export function useQuizStats(orderId: string) {
  return useFetch(() => answerService.getQuestionStats(orderId), [orderId]);
}

// Hook for fetching leaderboard (in quiz context)
export function useQuizLeaderboard(courseId?: string, limit: number = 10) {
  return useFetch(() => answerService.getLeaderboard(courseId, limit), [courseId, limit]);
}

// Hook for creating quiz questions
export function useQuizManagement() {
  const createOrder = useMutation<ApiResponse<Order>, [CreateOrderRequest]>();
  const bulkCreateOrders = useMutation<ApiResponse<Order[]>, [CreateOrderRequest[]]>();
  const deleteOrder = useMutation<ApiResponse<void>, [string]>();

  const createQuestion = useCallback(async (questionData: CreateOrderRequest) => {
    return await createOrder.mutate(orderService.createOrder, questionData);
  }, [createOrder]);

  const createMultipleQuestions = useCallback(async (questions: CreateOrderRequest[]) => {
    return await bulkCreateOrders.mutate(orderService.bulkCreateOrders, questions);
  }, [bulkCreateOrders]);

  const deleteQuestion = useCallback(async (orderId: string) => {
    return await deleteOrder.mutate(orderService.deleteOrder, orderId);
  }, [deleteOrder]);

  return {
    createQuestion: {
      execute: createQuestion,
      loading: createOrder.loading,
      error: createOrder.error,
      success: createOrder.success,
      data: createOrder.data,
      reset: createOrder.reset,
    },
    bulkCreate: {
      execute: createMultipleQuestions,
      loading: bulkCreateOrders.loading,
      error: bulkCreateOrders.error,
      success: bulkCreateOrders.success,
      data: bulkCreateOrders.data,
      reset: bulkCreateOrders.reset,
    },
    delete: {
      execute: deleteQuestion,
      loading: deleteOrder.loading,
      error: deleteOrder.error,
      success: deleteOrder.success,
      reset: deleteOrder.reset,
    },
  };
}
