// Additional question types for enhanced learning experience
import { BaseQuestion } from '../types/stage';

// Audio-based question (for pronunciation or sound identification)
export interface AudioQuestion extends BaseQuestion {
  type: "audio";
  audioUrl: string;
  answers: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
    emoji?: string;
  }>;
}

// Image-based question (identify objects in images)
export interface ImageQuestion extends BaseQuestion {
  type: "image";
  imageUrl: string;
  hotspots?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isCorrect: boolean;
    label: string;
  }>;
  answers?: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
    emoji?: string;
  }>;
}

// Sequence/Order question (arrange items in correct order)
export interface SequenceQuestion extends BaseQuestion {
  type: "sequence";
  items: Array<{
    id: string;
    text: string;
    emoji?: string;
    correctPosition: number;
  }>;
  instruction: string;
}

// Multiple select question (select all correct answers)
export interface MultipleSelectQuestion extends BaseQuestion {
  type: "multiple-select";
  answers: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
    emoji?: string;
  }>;
  minCorrectAnswers: number;
  maxCorrectAnswers: number;
}

// Scale/Rating question (rate on a scale)
export interface ScaleQuestion extends BaseQuestion {
  type: "scale";
  scale: {
    min: number;
    max: number;
    step: number;
    labels: {
      min: string;
      max: string;
      middle?: string;
    };
  };
  correctRange: {
    min: number;
    max: number;
  };
}

// Categorization question (drag items into categories)
export interface CategorizationQuestion extends BaseQuestion {
  type: "categorization";
  categories: Array<{
    id: string;
    name: string;
    emoji?: string;
    color?: string;
  }>;
  items: Array<{
    id: string;
    text: string;
    emoji?: string;
    correctCategory: string;
  }>;
}

// Drawing/Sketch question (draw or mark on an image)
export interface DrawingQuestion extends BaseQuestion {
  type: "drawing";
  canvas: {
    backgroundImage?: string;
    width: number;
    height: number;
  };
  expectedDrawing?: {
    shapes: Array<{
      type: 'circle' | 'line' | 'arrow' | 'text';
      x: number;
      y: number;
      width?: number;
      height?: number;
      text?: string;
    }>;
  };
  allowedTools: Array<'pen' | 'eraser' | 'circle' | 'line' | 'arrow' | 'text'>;
}

// Simulation question (interactive simulation)
export interface SimulationQuestion extends BaseQuestion {
  type: "simulation";
  simulation: {
    type: 'solar-system' | 'planet-orbit' | 'moon-phases' | 'gravity';
    initialState: any;
    targetState: any;
    allowedActions: string[];
  };
  successCriteria: {
    tolerance: number;
    timeLimit?: number;
  };
}

// Extended question type union
export type ExtendedQuestion = 
  | AudioQuestion
  | ImageQuestion
  | SequenceQuestion
  | MultipleSelectQuestion
  | ScaleQuestion
  | CategorizationQuestion
  | DrawingQuestion
  | SimulationQuestion;

// Enhanced stage data with more question types
export interface EnhancedStageData {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  prerequisites: number[];
  totalStars: number;
  xpReward?: number;
  streakBonus?: boolean;
  healthSystem?: boolean;
  character: {
    name: string;
    avatar: string;
    introduction: string;
    learningContent: string;
    completionMessage: string;
    encouragements?: string[];
    hints?: string[];
  };
  questions: ExtendedQuestion[];
  rewards: {
    stars: number;
    points: number;
    xp?: number;
    gems?: number;
    badges?: string[];
    unlocksStages?: number[];
    achievementUnlocks?: string[];
  };
  // Interactive elements
  interactiveElements?: {
    animations?: Array<{
      id: string;
      type: 'planet-rotation' | 'orbital-motion' | 'moon-phases' | 'comet-tail';
      triggerCondition: 'correct-answer' | 'stage-complete' | 'always';
    }>;
    soundEffects?: Array<{
      id: string;
      audioUrl: string;
      triggerCondition: 'correct-answer' | 'incorrect-answer' | 'stage-complete';
    }>;
    particleEffects?: Array<{
      id: string;
      type: 'stars' | 'sparkles' | 'rocket-trail' | 'explosion';
      triggerCondition: 'correct-answer' | 'perfect-score' | 'stage-complete';
    }>;
  };
}

// Sample enhanced questions for astronomy learning
export const enhancedQuestions: ExtendedQuestion[] = [
  {
    id: 1,
    type: "image",
    question: "คลิกที่ดาวพฤหัสบดีในภาพระบบสุริยะ",
    difficulty: 'easy',
    points: 15,
    timeLimit: 30,
    imageUrl: "/images/solar-system-diagram.jpg",
    hotspots: [
      {
        id: "jupiter",
        x: 350,
        y: 200,
        width: 60,
        height: 60,
        isCorrect: true,
        label: "ดาวพฤหัสบดี"
      },
      {
        id: "saturn",
        x: 450,
        y: 200,
        width: 55,
        height: 55,
        isCorrect: false,
        label: "ดาวเสาร์"
      }
    ],
    explanation: "ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุดและอยู่ลำดับที่ 5 จากดวงอาทิตย์",
    funFact: "🪐 ดาวพฤหัสบดีมีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกันทั้งหมด!"
  },
  {
    id: 2,
    type: "sequence",
    question: "เรียงลำดับขั้นตอนการเกิดดาวหาง",
    difficulty: 'medium',
    points: 20,
    timeLimit: 45,
    instruction: "ลากเพื่อเรียงลำดับจาก 1 ถึง 4",
    items: [
      {
        id: "approach",
        text: "ดาวหางเข้าใกล้ดวงอาทิตย์",
        emoji: "☄️",
        correctPosition: 1
      },
      {
        id: "heat",
        text: "ความร้อนทำให้น้ำแข็งระเหย",
        emoji: "🔥",
        correctPosition: 2
      },
      {
        id: "tail",
        text: "เกิดหางดาวหาง",
        emoji: "✨",
        correctPosition: 3
      },
      {
        id: "visible",
        text: "มองเห็นได้จากโลก",
        emoji: "👁️",
        correctPosition: 4
      }
    ],
    explanation: "ดาวหางจะสร้างหางเมื่อเข้าใกล้ดวงอาทิตย์ เพราะความร้อนทำให้น้ำแข็งและแก๊สระเหยออกมา",
    funFact: "🌟 หางดาวหางมักจะชี้ออกจากดวงอาทิตย์เสมอ!"
  },
  {
    id: 3,
    type: "categorization",
    question: "จำแนกดาวเคราะห์ตามประเภท",
    difficulty: 'medium',
    points: 25,
    timeLimit: 60,
    categories: [
      {
        id: "inner",
        name: "ดาวเคราะห์ในระบบภายใน",
        emoji: "🌍",
        color: "#f59e0b"
      },
      {
        id: "outer",
        name: "ดาวเคราะห์ในระบบภายนอก",
        emoji: "🪐",
        color: "#3b82f6"
      }
    ],
    items: [
      {
        id: "mercury",
        text: "ดาวพุธ",
        emoji: "☿️",
        correctCategory: "inner"
      },
      {
        id: "venus",
        text: "ดาวศุกร์",
        emoji: "♀️",
        correctCategory: "inner"
      },
      {
        id: "earth",
        text: "โลก",
        emoji: "🌍",
        correctCategory: "inner"
      },
      {
        id: "mars",
        text: "ดาวอังคาร",
        emoji: "♂️",
        correctCategory: "inner"
      },
      {
        id: "jupiter",
        text: "ดาวพฤหัสบดี",
        emoji: "🪐",
        correctCategory: "outer"
      },
      {
        id: "saturn",
        text: "ดาวเสาร์",
        emoji: "🪐",
        correctCategory: "outer"
      },
      {
        id: "uranus",
        text: "ดาวยูเรนัส",
        emoji: "🌀",
        correctCategory: "outer"
      },
      {
        id: "neptune",
        text: "ดาวเนปจูน",
        emoji: "🌊",
        correctCategory: "outer"
      }
    ],
    explanation: "ดาวเคราะห์ในระบบภายในเป็นดาวเคราะห์หิน ส่วนในระบบภายนอกเป็นดาวเคราะห์แก๊ส",
    funFact: "🔬 ดาวเคราะห์หินมีพื้นผิวแข็ง ส่วนดาวเคราะห์แก๊สส่วนใหญ่เป็นแก๊ส!"
  },
  {
    id: 4,
    type: "multiple-select",
    question: "เลือกลักษณะที่ถูกต้องของดาวเสาร์ (เลือกได้หลายข้อ)",
    difficulty: 'hard',
    points: 30,
    timeLimit: 40,
    minCorrectAnswers: 2,
    maxCorrectAnswers: 4,
    answers: [
      {
        id: 1,
        text: "มีวงแหวนที่สวยงาม",
        isCorrect: true,
        emoji: "💍"
      },
      {
        id: 2,
        text: "เป็นดาวเคราะห์แก๊ส",
        isCorrect: true,
        emoji: "💨"
      },
      {
        id: 3,
        text: "มีดาวเทียมมากมาย",
        isCorrect: true,
        emoji: "🌙"
      },
      {
        id: 4,
        text: "อยู่ใกล้ดวงอาทิตย์ที่สุด",
        isCorrect: false,
        emoji: "☀️"
      },
      {
        id: 5,
        text: "มีสีแดง",
        isCorrect: false,
        emoji: "🔴"
      },
      {
        id: 6,
        text: "เป็นดาวเคราะห์ที่ใหญ่เป็นอันดับ 2",
        isCorrect: true,
        emoji: "🥈"
      }
    ],
    explanation: "ดาวเสาร์มีวงแหวนที่สวยงาม เป็นดาวเคราะห์แก๊ส มีดาวเทียมมากมาย และใหญ่เป็นอันดับ 2",
    funFact: "🪐 ดาวเสาร์เบากว่าน้ำ หากมีสระว่ายน้ำขนาดใหญ่เพียงพอ มันจะลอยได้!"
  },
  {
    id: 5,
    type: "scale",
    question: "ดวงอาทิตย์ร้อนประมาณกี่องศาเซลเซียส? (พื้นผิว)",
    difficulty: 'hard',
    points: 25,
    timeLimit: 30,
    scale: {
      min: 1000,
      max: 10000,
      step: 500,
      labels: {
        min: "1,000°C",
        max: "10,000°C",
        middle: "5,500°C"
      }
    },
    correctRange: {
      min: 5000,
      max: 6000
    },
    explanation: "พื้นผิวดวงอาทิตย์ร้อนประมาณ 5,500°C แต่แกนกลางร้อนถึง 15 ล้านองศา!",
    funFact: "🌡️ ดวงอาทิตย์ร้อนมากพอที่จะหลอมโลหะทุกชนิด!"
  },
  {
    id: 6,
    type: "simulation",
    question: "จำลองการโคจรของดาวเคราะห์รอบดวงอาทิตย์",
    difficulty: 'hard',
    points: 35,
    timeLimit: 90,
    simulation: {
      type: 'planet-orbit',
      initialState: {
        planets: [
          { name: 'Earth', position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } }
        ],
        sun: { position: { x: 0, y: 0 } }
      },
      targetState: {
        planets: [
          { name: 'Earth', orbitCompleted: true }
        ]
      },
      allowedActions: ['adjust-velocity', 'adjust-position']
    },
    successCriteria: {
      tolerance: 0.1,
      timeLimit: 60
    },
    explanation: "ดาวเคราะห์โคจรรอบดวงอาทิตย์ด้วยแรงโน้มถ่วง ความเร็วและทิศทางต้องสมดุลเพื่อให้โคจรเป็นวงกลม",
    funFact: "🌍 โลกเดินทางรอบดวงอาทิตย์ด้วยความเร็ว 30 กิโลเมตรต่อวินาที!"
  }
];

// Question validation functions
export const validateExtendedQuestion = (question: ExtendedQuestion): boolean => {
  const baseValidation = question.id > 0 && 
                        question.question.length > 0 && 
                        question.points > 0;
  
  if (!baseValidation) return false;
  
  switch (question.type) {
    case 'audio':
      return Boolean(question.audioUrl) && question.answers.length > 0;
    
    case 'image':
      const hasValidImageUrl = Boolean(question.imageUrl && question.imageUrl.length > 0);
      const hasValidContent = Boolean(
        (question.hotspots && question.hotspots.length > 0) ||
        (question.answers && question.answers.length > 0)
      );
      return hasValidImageUrl && hasValidContent;
    
    case 'sequence':
      return question.items.length > 1 && 
             question.items.every(item => item.correctPosition > 0);
    
    case 'multiple-select':
      return question.answers.length > 0 && 
             question.answers.some(a => a.isCorrect) &&
             question.minCorrectAnswers > 0 &&
             question.maxCorrectAnswers <= question.answers.filter(a => a.isCorrect).length;
    
    case 'scale':
      return question.scale.min < question.scale.max &&
             question.correctRange.min >= question.scale.min &&
             question.correctRange.max <= question.scale.max;
    
    case 'categorization':
      return question.categories.length > 0 &&
             question.items.length > 0 &&
             question.items.every(item => 
               question.categories.some(cat => cat.id === item.correctCategory)
             );
    
    case 'drawing':
      return Boolean(question.canvas) && question.allowedTools.length > 0;
    
    case 'simulation':
      return Boolean(question.simulation.type) &&
             Boolean(question.simulation.initialState) &&
             Boolean(question.simulation.targetState);
    
    default:
      return true;
  }
};

// Question type specific scoring
export const calculateQuestionScore = (question: ExtendedQuestion, userAnswer: any, timeSpent: number): number => {
  let baseScore = question.points;
  
  // Time bonus for quick answers
  if (question.timeLimit && timeSpent < question.timeLimit * 0.5) {
    baseScore *= 1.2;
  }
  
  // Complexity bonus for harder question types
  const complexityMultiplier: Record<ExtendedQuestion['type'], number> = {
    'audio': 1.1,
    'image': 1.2,
    'sequence': 1.3,
    'multiple-select': 1.4,
    'scale': 1.1,
    'categorization': 1.5,
    'drawing': 1.6,
    'simulation': 2.0
  };
  
  baseScore *= complexityMultiplier[question.type] || 1.0;
  
  return Math.round(baseScore);
};
