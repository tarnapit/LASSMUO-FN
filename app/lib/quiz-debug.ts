/**
 * ฟังก์ชันสำหรับ debug และตรวจสอบ quiz data
 */

import { Quiz, QuizQuestion } from '../types/quiz';

export function validateQuizData(quiz: Quiz): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ตรวจสอบ quiz object
  if (!quiz) {
    errors.push('Quiz object is null or undefined');
    return { isValid: false, errors, warnings };
  }

  if (!quiz.id) {
    errors.push('Quiz missing id');
  }

  if (!quiz.questions || !Array.isArray(quiz.questions)) {
    errors.push('Quiz questions is not an array');
    return { isValid: false, errors, warnings };
  }

  if (quiz.questions.length === 0) {
    warnings.push('Quiz has no questions');
  }

  // ตรวจสอบแต่ละคำถาม
  quiz.questions.forEach((question, index) => {
    const questionErrors = validateQuestionData(question, index);
    errors.push(...questionErrors.errors);
    warnings.push(...questionErrors.warnings);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateQuestionData(question: QuizQuestion, index?: number): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const questionLabel = index !== undefined ? `Question ${index + 1}` : 'Question';

  if (!question) {
    errors.push(`${questionLabel}: Question object is null or undefined`);
    return { errors, warnings };
  }

  if (!question.id) {
    errors.push(`${questionLabel}: Missing id`);
  }

  if (!question.question || typeof question.question !== 'string') {
    errors.push(`${questionLabel}: Missing or invalid question text`);
  }

  if (!question.type) {
    errors.push(`${questionLabel}: Missing question type`);
  }

  // ตรวจสอบ multiple-choice questions
  if (question.type === 'multiple-choice') {
    if (!question.options || !Array.isArray(question.options)) {
      errors.push(`${questionLabel}: Multiple choice question missing options array`);
    } else {
      if (question.options.length < 2) {
        warnings.push(`${questionLabel}: Multiple choice question has less than 2 options`);
      }

      const correctAnswer = question.correctAnswer as number;
      if (typeof correctAnswer !== 'number') {
        errors.push(`${questionLabel}: Multiple choice question correctAnswer must be a number`);
      } else if (correctAnswer < 0 || correctAnswer >= question.options.length) {
        errors.push(`${questionLabel}: Multiple choice question correctAnswer index out of range`);
      }
    }
  }

  // ตรวจสอบ true-false questions
  if (question.type === 'true-false') {
    if (question.correctAnswer !== 'true' && question.correctAnswer !== 'false') {
      errors.push(`${questionLabel}: True-false question correctAnswer must be 'true' or 'false'`);
    }
  }

  // ตรวจสอบ text questions
  if (question.type === 'text') {
    if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
      errors.push(`${questionLabel}: Text question missing string correctAnswer`);
    }
  }

  if (!question.points || typeof question.points !== 'number' || question.points <= 0) {
    warnings.push(`${questionLabel}: Invalid or missing points value`);
  }

  if (!question.difficulty) {
    warnings.push(`${questionLabel}: Missing difficulty level`);
  }

  return { errors, warnings };
}

export function debugQuizShuffle(quiz: Quiz, seed?: string): void {
  console.group('🔍 Quiz Shuffle Debug');
  
  console.log('Original Quiz:', {
    id: quiz.id,
    title: quiz.title,
    questionsCount: quiz.questions?.length
  });

  const validation = validateQuizData(quiz);
  
  if (validation.errors.length > 0) {
    console.error('❌ Quiz Validation Errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Quiz Validation Warnings:', validation.warnings);
  }

  if (validation.isValid) {
    console.log('✅ Quiz data is valid');
  }

  // ตรวจสอบ questions แต่ละข้อ
  console.group('Questions Details:');
  quiz.questions.forEach((question, index) => {
    console.log(`Question ${index + 1}:`, {
      id: question.id,
      type: question.type,
      optionsCount: question.options?.length,
      correctAnswer: question.correctAnswer,
      hasQuestion: !!question.question
    });
  });
  console.groupEnd();

  console.groupEnd();
}