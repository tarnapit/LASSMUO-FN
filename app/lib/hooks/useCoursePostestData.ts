'use client';

import { useState, useEffect } from 'react';
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
    moduleId: postest.courseId, // Use courseId as moduleId
    title: postest.title,
    description: postest.description || '',
    questions: questions,
    timeLimit: postest.timeLimit,
    passingScore: postest.passingScore || 75,
    maxAttempts: postest.maxAttempts || 3
  };
}

export function useCoursePostestData() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // Helper functions
    getQuizByModuleId: (moduleId: string) => quizzes.find(quiz => quiz.moduleId === moduleId),
    getQuizById: (quizId: string) => quizzes.find(quiz => quiz.id === quizId),
    getTotalQuestionsInQuiz: (quizId: string) => {
      const quiz = quizzes.find(q => q.id === quizId);
      return quiz ? quiz.questions.length : 0;
    },
    getMaxScoreInQuiz: (quizId: string) => {
      const quiz = quizzes.find(q => q.id === quizId);
      return quiz ? quiz.questions.reduce((total, q) => total + q.points, 0) : 0;
    }
  };
}