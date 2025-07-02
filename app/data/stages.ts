import { StageData } from '../types/stage';

export const stageData: Record<number, StageData> = {
  1: {
    id: 1,
    title: "ระบบสุริยะ",
    description: "เรียนรู้เกี่ยวกับดวงอาทิตย์และดาวเคราะห์",
    character: {
      name: "Sigco",
      introduction: "hi my name is sigco",
      learningContent: "Today we going to learn about solar system"
    },
    questions: [
      {
        id: 1,
        question: "How many planet in SOLAR SYSTEM ?",
        answers: [
          { id: 1, text: "5", isCorrect: false },
          { id: 2, text: "6", isCorrect: false },
          { id: 3, text: "7", isCorrect: false },
          { id: 4, text: "8", isCorrect: true },
        ],
        explanation: "ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง"
      },
      {
        id: 2,
        question: "Which planet is closest to the Sun?",
        answers: [
          { id: 1, text: "Venus", isCorrect: false },
          { id: 2, text: "Mercury", isCorrect: true },
          { id: 3, text: "Earth", isCorrect: false },
          { id: 4, text: "Mars", isCorrect: false },
        ],
        explanation: "ดาวพุธ (Mercury) เป็นดาวเคราะห์ที่อยู่ใกล้ดวงอาทิตย์ที่สุด"
      }
    ]
  },
  2: {
    id: 2,
    title: "ดาวเคราะห์ใน",
    description: "สำรวจดาวพุธ ดาวศุกร์ โลก และดาวอังคาร",
    character: {
      name: "Sigco",
      introduction: "Welcome back! I'm Sigco",
      learningContent: "Let's explore the inner planets"
    },
    questions: [
      {
        id: 1,
        question: "Which planet is known as the Red Planet?",
        answers: [
          { id: 1, text: "Venus", isCorrect: false },
          { id: 2, text: "Mercury", isCorrect: false },
          { id: 3, text: "Mars", isCorrect: true },
          { id: 4, text: "Earth", isCorrect: false },
        ],
        explanation: "ดาวอังคาร (Mars) เรียกว่าดาวเคราะห์สีแดงเพราะมีสีแดงจากออกไซด์ของเหล็ก"
      }
    ]
  }
};
