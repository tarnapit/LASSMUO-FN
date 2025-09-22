/**
 * Quiz utility functions สำหรับจัดการการ shuffle คำถามและตัวเลือก
 */

import { Quiz, QuizQuestion } from '../types/quiz';

/**
 * ฟังก์ชัน shuffle array โดยใช้ Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * สร้าง mapping สำหรับ track การเปลี่ยนแปลงตำแหน่งของตัวเลือก
 */
export interface OptionMapping {
  originalIndex: number;
  shuffledIndex: number;
}

/**
 * สร้าง seeded random number generator เพื่อให้ shuffle แบบเดิมในแต่ละครั้งที่ทำ quiz
 */
export function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    const result = Math.abs(hash / 233280); // ใช้ Math.abs เพื่อป้องกันค่า negative
    // ตรวจสอบให้แน่ใจว่าค่าอยู่ระหว่าง 0-1
    return Math.min(Math.max(result, 0), 0.9999999);
  };
}

/**
 * Shuffle questions ในแบบทดสอบ
 */
export function shuffleQuestions(quiz: Quiz, seed?: string): Quiz {
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    console.warn('Invalid quiz or no questions to shuffle');
    return quiz;
  }

  const random = seed ? seededRandom(seed) : Math.random;
  const shuffledQuestions = [...quiz.questions];
  
  // Fisher-Yates shuffle with custom random function and validation
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const randomValue = random();
    const j = Math.floor(randomValue * (i + 1));
    
    // ตรวจสอบให้แน่ใจว่า j อยู่ในช่วงที่ถูกต้อง
    if (j < 0 || j > i || !Number.isInteger(j)) {
      console.error(`Invalid j value in shuffleQuestions: ${j}, randomValue: ${randomValue}, i: ${i}`);
      continue;
    }
    
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }
  
  return {
    ...quiz,
    questions: shuffledQuestions
  };
}

/**
 * Shuffle options ของคำถาม multiple-choice และสร้าง mapping
 */
export function shuffleQuestionOptions(question: QuizQuestion, seed?: string): {
  question: QuizQuestion;
  optionMapping: OptionMapping[];
} {
  // ตรวจสอบความถูกต้องของ question object
  console.log('shuffleQuestionOptions called with:', { 
    questionId: question?.id, 
    questionType: question?.type, 
    hasOptions: !!question?.options,
    optionsLength: question?.options?.length 
  });

  if (!question || typeof question !== 'object') {
    console.error('Invalid question object:', question);
    return { question: question || {} as QuizQuestion, optionMapping: [] };
  }

  if (question.type !== 'multiple-choice' || !question.options || question.options.length === 0) {
    console.log('Question not shuffleable:', { type: question.type, hasOptions: !!question.options });
    return { question, optionMapping: [] };
  }

  // ตรวจสอบว่า options เป็น array และมี element
  if (!Array.isArray(question.options)) {
    console.error('Question options is not an array:', question.options);
    return { question, optionMapping: [] };
  }

  const random = seed ? seededRandom(seed + question.id) : Math.random;
  const options = [...question.options];
  
  // ตรวจสอบว่า correctAnswer เป็น number และอยู่ในช่วงที่ถูกต้อง
  const correctAnswerIndex = question.correctAnswer as number;
  if (typeof correctAnswerIndex !== 'number' || 
      correctAnswerIndex < 0 || 
      correctAnswerIndex >= options.length) {
    console.warn(`Invalid correctAnswer for question ${question.id}:`, correctAnswerIndex);
    return { question, optionMapping: [] };
  }
  
  // สร้าง mapping เริ่มต้นแบบปลอดภัย
  const optionMapping: OptionMapping[] = [];
  for (let i = 0; i < options.length; i++) {
    optionMapping.push({
      originalIndex: i,
      shuffledIndex: i
    });
  }

  console.log('Initial optionMapping created:', optionMapping);

  // Fisher-Yates shuffle with safe mapping tracking
  for (let i = options.length - 1; i > 0; i--) {
    const randomValue = random();
    const j = Math.floor(randomValue * (i + 1));
    
    // ตรวจสอบให้แน่ใจว่า j อยู่ในช่วงที่ถูกต้อง
    if (j < 0 || j > i || !Number.isInteger(j)) {
      console.error(`Invalid j value: ${j}, randomValue: ${randomValue}, i: ${i}`);
      continue;
    }
    
    console.log(`Shuffle step: i=${i}, j=${j}, randomValue=${randomValue}, mappingBefore:`, { 
      iMapping: optionMapping[i], 
      jMapping: optionMapping[j] 
    });
    
    // Swap options
    const tempOption = options[i];
    options[i] = options[j];
    options[j] = tempOption;
    
    // ตรวจสอบว่า mapping ที่จะ swap มีอยู่จริง
    if (!optionMapping[i] || !optionMapping[j] || i >= optionMapping.length || j >= optionMapping.length) {
      console.error(`Missing mapping at index ${i} or ${j}:`, { 
        i: optionMapping[i], 
        j: optionMapping[j],
        arrayLength: optionMapping.length 
      });
      continue;
    }
    
    // Swap mapping objects safely
    const tempMapping = optionMapping[i];
    optionMapping[i] = optionMapping[j];
    optionMapping[j] = tempMapping;
    
    // อัปเดต shuffledIndex อย่างปลอดภัย
    if (optionMapping[i] && typeof optionMapping[i] === 'object') {
      optionMapping[i].shuffledIndex = i;
    }
    if (optionMapping[j] && typeof optionMapping[j] === 'object') {
      optionMapping[j].shuffledIndex = j;
    }

    console.log(`After swap:`, { 
      iMapping: optionMapping[i], 
      jMapping: optionMapping[j] 
    });
  }

  console.log('Final optionMapping before findIndex:', optionMapping);

  // หา correct answer ใหม่หลัง shuffle
  const newCorrectIndex = optionMapping.findIndex(mapping => 
    mapping && typeof mapping === 'object' && mapping.originalIndex === correctAnswerIndex
  );
  
  // ตรวจสอบว่าหา newCorrectIndex ได้หรือไม่
  if (newCorrectIndex === -1) {
    console.error(`Could not find new correct index for question ${question.id}`);
    return { 
      question: { ...question, options },
      optionMapping: [] 
    };
  }
  
  return {
    question: {
      ...question,
      options,
      correctAnswer: newCorrectIndex,
      _originalCorrectAnswer: correctAnswerIndex
    },
    optionMapping
  };
}/**
 * Shuffle ทั้ง quiz (คำถามและตัวเลือก)
 */
export function shuffleQuiz(quiz: Quiz, seed?: string): {
  quiz: Quiz;
  questionMappings: { [questionId: string]: OptionMapping[] };
} {
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    console.error('Invalid quiz provided to shuffleQuiz');
    return { quiz, questionMappings: {} };
  }

  try {
    // ใช้ timestamp + quiz id เป็น base seed หากไม่ได้ระบุ
    const baseSeed = seed || `${Date.now()}-${quiz.id}`;
    console.log('Shuffling quiz with seed:', baseSeed);
    
    // Shuffle questions
    const shuffledQuiz = shuffleQuestions(quiz, baseSeed);
    console.log('Questions shuffled, count:', shuffledQuiz.questions.length);
    
    // Shuffle options และเก็บ mapping
    const questionMappings: { [questionId: string]: OptionMapping[] } = {};
    const questionsWithShuffledOptions: QuizQuestion[] = [];
    
    for (let i = 0; i < shuffledQuiz.questions.length; i++) {
      const question = shuffledQuiz.questions[i];
      
      if (!question || !question.id) {
        console.warn(`Invalid question at index ${i}:`, question);
        // เก็บ question เดิมไว้โดยไม่ shuffle
        questionsWithShuffledOptions.push(question);
        questionMappings[question?.id || `unknown-${i}`] = [];
        continue;
      }

      try {
        console.log(`Shuffling question ${i + 1}/${shuffledQuiz.questions.length}: ${question.id} (${question.type})`);
        
        const result = shuffleQuestionOptions(question, baseSeed);
        
        if (result && result.question) {
          questionsWithShuffledOptions.push(result.question);
          questionMappings[question.id] = result.optionMapping || [];
          console.log(`✅ Question ${question.id} shuffled successfully`);
        } else {
          console.warn(`❌ Failed to shuffle question ${question.id}, using original`);
          questionsWithShuffledOptions.push(question);
          questionMappings[question.id] = [];
        }
      } catch (error) {
        console.error(`Error shuffling question ${question.id}:`, error);
        // fallback: ใช้ question เดิมไม่ shuffle
        questionsWithShuffledOptions.push(question);
        questionMappings[question.id] = [];
      }
    }
    
    const result = {
      quiz: {
        ...shuffledQuiz,
        questions: questionsWithShuffledOptions
      },
      questionMappings
    };
    
    console.log('Quiz shuffle completed:', {
      originalQuestions: quiz.questions.length,
      shuffledQuestions: result.quiz.questions.length,
      mappingsCreated: Object.keys(result.questionMappings).length
    });
    
    return result;
  } catch (error) {
    console.error('Error in shuffleQuiz:', error);
    return { quiz, questionMappings: {} };
  }
}

/**
 * แปลงคำตอบจาก shuffled index กลับเป็น original index
 */
export function convertShuffledAnswerToOriginal(
  questionId: string,
  shuffledAnswer: number,
  questionMappings: { [questionId: string]: OptionMapping[] }
): number {
  const mapping = questionMappings[questionId];
  if (!mapping) return shuffledAnswer;
  
  const originalMapping = mapping.find(m => m.shuffledIndex === shuffledAnswer);
  return originalMapping ? originalMapping.originalIndex : shuffledAnswer;
}

/**
 * ตรวจสอบคำตอบโดยใช้ original index
 */
export function checkAnswerWithMapping(
  question: QuizQuestion,
  userAnswer: string | number,
  questionMappings: { [questionId: string]: OptionMapping[] }
): boolean {
  if (question.type === 'multiple-choice') {
    const originalAnswer = convertShuffledAnswerToOriginal(
      question.id,
      userAnswer as number,
      questionMappings
    );
    const originalCorrectAnswer = (question as any)._originalCorrectAnswer || question.correctAnswer;
    return originalAnswer === originalCorrectAnswer;
  }
  
  if (question.type === 'true-false') {
    return userAnswer === question.correctAnswer;
  }
  
  if (question.type === 'text') {
    const correctAnswer = (question.correctAnswer as string).toLowerCase().trim();
    const userAnswerText = (userAnswer as string || '').toLowerCase().trim();
    return userAnswerText === correctAnswer;
  }
  
  return false;
}

/**
 * สร้าง unique session key สำหรับแต่ละครั้งที่เริ่มทำ quiz
 */
export function generateQuizSessionKey(quizId: string): string {
  return `${quizId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}