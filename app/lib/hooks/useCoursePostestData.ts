'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { coursePostestService } from '../api/services/coursePostestService';
import { CoursePostest } from '../api/types';
import { Quiz, QuizQuestion } from '../../types/quiz';

// Adapter function to convert CoursePostest to Quiz format
function adaptCoursePostestToQuiz(postest: CoursePostest): Quiz {
  let questions: QuizQuestion[] = [];
  
  try {
    // Parse the question field (JSON)
    let questionData;
    
    if (typeof postest.question === 'string') {
      questionData = JSON.parse(postest.question);
    } else if (typeof postest.question === 'object' && postest.question !== null) {
      questionData = postest.question;
    } else {
      console.warn('Invalid question data format for postest:', postest.id);
      questionData = null;
    }
    
    if (!questionData) {
      console.warn('No question data found for postest:', postest.id);
      return {
        id: postest.id,
        moduleId: postest.courseId,
        title: postest.title,
        description: postest.description || '',
        questions: [],
        timeLimit: postest.timeLimit,
        passingScore: postest.passingScore || 75,
        maxAttempts: postest.maxAttempts || 3
      };
    }
    
    // If questions is an array (direct format)
    if (Array.isArray(questionData)) {
      questions = questionData.map((q: any, index: number) => ({
        id: q.id || `q${index + 1}`,
        question: q.question || '',
        type: q.type || 'multiple-choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'medium',
        points: q.points !== undefined ? q.points : 10,
        _originalCorrectAnswer: q._originalCorrectAnswer
      }));
    } else if (questionData && questionData.questions && Array.isArray(questionData.questions)) {
      // If questions is nested under 'questions' key
      questions = questionData.questions.map((q: any, index: number) => ({
        id: q.id || `q${index + 1}`,
        question: q.question || '',
        type: q.type || 'multiple-choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'medium',
        points: q.points !== undefined ? q.points : 10,
        _originalCorrectAnswer: q._originalCorrectAnswer
      }));
    } else {
      console.warn('Unexpected question data structure for postest:', postest.id, questionData);
    }
    
    console.log(`✅ [Adapter] Postest "${postest.title}" converted with ${questions.length} questions`);
    
  } catch (error) {
    console.error('❌ [Adapter] Error parsing postest questions for:', postest.id, error);
    questions = [];
  }

  return {
    id: postest.id,
    moduleId: postest.courseId, // Use courseId as moduleId for now
    title: postest.title,
    description: postest.description || '',
    questions: questions,
    timeLimit: postest.timeLimit,
    passingScore: postest.passingScore || 75,
    maxAttempts: postest.maxAttempts || 3
  };
}

// Create mapping between courseId and legacy moduleId for backward compatibility
function createCourseModuleMapping(quizzes: Quiz[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  // Create a reverse mapping based on quiz titles for backward compatibility
  quizzes.forEach(quiz => {
    if (quiz.title.includes('ระบบสุริยะ') || quiz.title.includes('Solar System')) {
      mapping[quiz.moduleId] = 'solar-system';
    } else if (quiz.title.includes('โครงสร้างโลก') || quiz.title.includes('Earth Structure')) {
      mapping[quiz.moduleId] = 'earth-structure';
    } else if (quiz.title.includes('การเกิดดาว') || quiz.title.includes('Stellar Evolution')) {
      mapping[quiz.moduleId] = 'stellar-evolution';
    } else if (quiz.title.includes('กาแลคซี่') || quiz.title.includes('Galaxies')) {
      mapping[quiz.moduleId] = 'galaxies-universe';
    }
  });
  
  console.log('📋 [Course Module Mapping]:', mapping);
  return mapping;
}

export function useCoursePostestData() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useMemo to prevent courseModuleMapping from changing unnecessarily
  const courseModuleMapping = useMemo(() => createCourseModuleMapping(quizzes), [quizzes]);

  // Memoize helper functions to prevent infinite re-renders
  const getQuizByModuleId = useCallback((moduleId: string) => {
    return quizzes.find(quiz => quiz.moduleId === moduleId);
  }, [quizzes]);

  const getQuizById = useCallback((quizId: string) => {
    return quizzes.find(quiz => quiz.id === quizId);
  }, [quizzes]);

  const getTotalQuestionsInQuiz = useCallback((quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.questions.length : 0;
  }, [quizzes]);

  const getMaxScoreInQuiz = useCallback((quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.questions.reduce((total, q) => total + q.points, 0) : 0;
  }, [quizzes]);

  const isQuizUnlockedByCourseProgress = useCallback(async (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return false;
    
    // This will be implemented to check actual course progress from API
    // For now, return true to unlock all quizzes for testing
    console.log(`🔓 [Quiz Unlock] Checking unlock status for quiz ${quizId} (courseId: ${quiz.moduleId})`);
    return true; // Temporary: unlock all quizzes
  }, [quizzes]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 [Course Postest] Fetching course postests from API...');
        
        // Fetch all course postests
        const postestsResponse = await coursePostestService.getAllCoursePostests();
        
        if (postestsResponse.success && postestsResponse.data) {
          console.log('✅ [Course Postest] Fetched successfully:', postestsResponse.data.length, 'postests');
          
          // Convert CoursePostest[] to Quiz[]
          const adaptedQuizzes = postestsResponse.data.map(adaptCoursePostestToQuiz);
          
          // Filter out quizzes with no questions (invalid data)
          const validQuizzes = adaptedQuizzes.filter(quiz => quiz.questions.length > 0);
          
          console.log('🔄 [Course Postest] Adapted quizzes:', {
            total: adaptedQuizzes.length,
            valid: validQuizzes.length,
            invalid: adaptedQuizzes.length - validQuizzes.length
          });
          
          setQuizzes(validQuizzes);
        } else {
          throw new Error(postestsResponse.error || 'Failed to fetch course postests');
        }
        
      } catch (err) {
        console.error('❌ [Course Postest] Error fetching from API, falling back to mock data:', err);
        
        // Fallback to mock data
        try {
          const { quizzes: mockQuizzes } = require('@/app/data/quizzes');
          setQuizzes(mockQuizzes || []);
          setError(null); // Clear error since we have fallback data
          console.log('✅ [Course Postest] Using mock quiz data as fallback');
        } catch (fallbackError) {
          console.error('❌ [Course Postest] Failed to load fallback quiz data:', fallbackError);
          setError('Failed to load quiz data');
          setQuizzes([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    quizzes,
    loading,
    error,
    courseModuleMapping, // Export mapping for use in progress system
    // Helper functions - now memoized to prevent infinite re-renders
    getQuizByModuleId,
    getQuizById,
    getTotalQuestionsInQuiz,
    getMaxScoreInQuiz,
    isQuizUnlockedByCourseProgress
  };
}