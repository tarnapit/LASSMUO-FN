import { MiniGameQuestion } from "../../../types/mini-game";

// ฟังก์ชันตรวจสอบคำตอบ
export const checkAnswer = (question: MiniGameQuestion, userAnswer: any): boolean => {
  if (userAnswer === null || userAnswer === undefined) return false;
  
  switch (question.type) {
    case 'multiple-choice':
      return userAnswer === question.correctAnswer;
    
    case 'true-false':
      return String(userAnswer) === String(question.correctAnswer);
    
    case 'fill-blank':
      if (Array.isArray(question.blanks)) {
        return question.blanks.some(blank => 
          String(userAnswer).toLowerCase().includes(blank.toLowerCase())
        );
      }
      return String(userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase();
    
    case 'matching':
      if (!question.pairs || !question.correctAnswer) return false;
      
      // Handle different formats of userAnswer
      let userPairs: string[] = [];
      if (Array.isArray(userAnswer)) {
        userPairs = userAnswer;
      } else if (typeof userAnswer === 'object') {
        // Convert object format to expected string format
        userPairs = Object.entries(userAnswer).map(([leftId, rightId]) => {
          // Find the actual text values from pairs
          const leftPair = question.pairs?.find(p => (p as any).left?.id === leftId || (p as any).left === leftId);
          const rightPair = question.pairs?.find(p => (p as any).right?.id === rightId || (p as any).right === rightId);
          
          // Get text values
          const leftText = (leftPair as any)?.left?.text || (leftPair as any)?.left || leftId;
          const rightText = (rightPair as any)?.right?.text || (rightPair as any)?.right || rightId;
          
          return `${leftText}-${rightText}`;
        });
      }
      
      const correctPairs = question.correctAnswer as string[];
      return correctPairs.every(pair => userPairs.includes(pair)) && 
             userPairs.length === correctPairs.length;
    
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
