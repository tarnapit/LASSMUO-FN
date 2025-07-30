import { MiniGameQuestion } from "../../../types/mini-game";

// ฟังก์ชันตรวจสอบคำตอบ
export const checkAnswer = (question: MiniGameQuestion, userAnswer: any): boolean => {
  switch (question.type) {
    case 'multiple-choice':
      return userAnswer === question.correctAnswer;
    
    case 'true-false':
      return userAnswer === question.correctAnswer;
    
    case 'fill-blank':
      if (Array.isArray(question.blanks)) {
        return question.blanks.some(blank => 
          String(userAnswer).toLowerCase().includes(blank.toLowerCase())
        );
      }
      return String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase();
    
    case 'matching':
      if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
        return question.correctAnswer.every(pair => userAnswer.includes(pair));
      }
      return false;
    
    case 'ordering':
      if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
        return JSON.stringify(question.correctAnswer) === JSON.stringify(userAnswer);
      }
      return false;
    
    default:
      return false;
  }
};

// ฟังก์ชันแปลงชื่อหมวดหมู่
export const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    'solar-system': 'ระบบสุริยะ',
    'planets': 'ดาวเคราะห์',
    'earth-structure': 'โครงสร้างโลก',
    'astronomy': 'ดาราศาสตร์',
    'general': 'ทั่วไป'
  };
  return categoryNames[category] || category;
};

// ฟังก์ชันแปลงระดับความยาก
export const getDifficultyName = (difficulty: string): string => {
  const difficultyNames: Record<string, string> = {
    'easy': 'ง่าย',
    'medium': 'ปานกลาง',
    'hard': 'ยาก'
  };
  return difficultyNames[difficulty] || difficulty;
};

// ฟังก์ชันแปลงสีตามระดับความยาก
export const getDifficultyColor = (difficulty: string): string => {
  const difficultyColors: Record<string, string> = {
    'easy': 'text-green-400',
    'medium': 'text-yellow-400',
    'hard': 'text-red-400'
  };
  return difficultyColors[difficulty] || 'text-gray-400';
};
