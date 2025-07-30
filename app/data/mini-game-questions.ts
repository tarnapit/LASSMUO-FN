import { MiniGameQuestion } from '../types/mini-game';

// คำถามแบบ Multiple Choice
export const multipleChoiceQuestions: MiniGameQuestion[] = [
  {
    id: 'mc-1',
    question: 'ดาวเคราะห์ดวงใดอยู่ใกล้ดวงอาทิตย์ที่สุด?',
    type: 'multiple-choice',
    options: ['ดาวพุธ', 'ดาวศุกร์', 'โลก', 'ดาวอังคาร'],
    correctAnswer: 0,
    explanation: 'ดาวพุธ (Mercury) เป็นดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุด ห่างเพียง 58 ล้านกิโลเมตร',
    difficulty: 'easy',
    points: 10,
    category: 'solar-system',
    timeBonus: 5
  },
  {
    id: 'mc-2',
    question: 'ระบบสุริยะมีดาวเคราะห์ทั้งหมดกี่ดวง?',
    type: 'multiple-choice',
    options: ['7 ดวง', '8 ดวง', '9 ดวง', '10 ดวง'],
    correctAnswer: 1,
    explanation: 'ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง หลังจากที่ดาวพลูโตถูกจัดประเภทเป็นดาวเคราะห์แคระในปี 2006',
    difficulty: 'easy',
    points: 10,
    category: 'solar-system',
    timeBonus: 5
  },
  {
    id: 'mc-3',
    question: 'ดาวเคราะห์ใดที่เรียกว่า "ดาวแดง"?',
    type: 'multiple-choice',
    options: ['ดาวพุธ', 'ดาวศุกร์', 'ดาวอังคาร', 'ดาวพฤหัสบดี'],
    correctAnswer: 2,
    explanation: 'ดาวอังคาร (Mars) เรียกว่า "ดาวแดง" เนื่องจากพื้นผิวมีสีแดงจากสนิมเหล็ก (Iron Oxide)',
    difficulty: 'easy',
    points: 10,
    category: 'planets',
    timeBonus: 5
  },
  {
    id: 'mc-4',
    question: 'ดาวเคราะห์ใดมีขนาดใหญ่ที่สุดในระบบสุริยะ?',
    type: 'multiple-choice',
    options: ['ดาวเสาร์', 'ดาวพฤหัสบดี', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
    correctAnswer: 1,
    explanation: 'ดาวพฤหัสบดี (Jupiter) เป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะ มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกันทั้งหมด',
    difficulty: 'medium',
    points: 15,
    category: 'planets',
    timeBonus: 7
  },
  {
    id: 'mc-5',
    question: 'ชั้นบรรยากาศของโลกชั้นใดที่มีโอโซน?',
    type: 'multiple-choice',
    options: ['โทรโปสเฟียร์', 'สตราโตสเฟียร์', 'มีโซสเฟียร์', 'เทอร์โมสเฟียร์'],
    correctAnswer: 1,
    explanation: 'ชั้นสตราโตสเฟียร์มีชั้นโอโซน (Ozone Layer) ที่ปกป้องโลกจากรังสีอัลตราไวโอเลตจากดวงอาทิตย์',
    difficulty: 'medium',
    points: 15,
    category: 'earth-structure',
    timeBonus: 7
  },
  {
    id: 'mc-6',
    question: 'ดาวเคราะห์ใดที่หมุนรอบแกนในทิศทางตรงข้ามกับดาวเคราะห์อื่นๆ?',
    type: 'multiple-choice',
    options: ['ดาวพุธ', 'ดาวศุกร์', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
    correctAnswer: 2,
    explanation: 'ดาวยูเรนัส หมุนรอบแกนในทิศทางตรงข้าม และมีแกนโลกเอียงถึง 98 องศา ทำให้เหมือนกลิ้งตามวงโคจร',
    difficulty: 'hard',
    points: 20,
    category: 'planets',
    timeBonus: 10
  },
  {
    id: 'mc-7',
    question: 'โลกเป็นดาวเคราะห์ลำดับที่เท่าไหร่จากดวงอาทิตย์?',
    type: 'multiple-choice',
    options: ['ลำดับที่ 2', 'ลำดับที่ 3', 'ลำดับที่ 4', 'ลำดับที่ 5'],
    correctAnswer: 1,
    explanation: 'โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดวงอาทิตย์ หลังจากดาวพุธและดาวศุกร์',
    difficulty: 'easy',
    points: 10,
    category: 'solar-system',
    timeBonus: 5
  },
  {
    id: 'mc-8',
    question: 'แกนกลางของโลกประกอบด้วยธาตุใดเป็นหลัก?',
    type: 'multiple-choice',
    options: ['ซิลิกอน', 'เหล็กและนิกเกิล', 'แมกนีเซียม', 'อลูมิเนียม'],
    correctAnswer: 1,
    explanation: 'แกนกลางของโลกประกอบด้วยเหล็กและนิกเกิลเป็นหลัก ทำให้เกิดสนามแม่เหล็กของโลก',
    difficulty: 'medium',
    points: 15,
    category: 'earth-structure',
    timeBonus: 7
  }
];

// คำถามแบบเติมคำ (Fill in the Blank)
export const fillBlankQuestions: MiniGameQuestion[] = [
  {
    id: 'fb-1',
    question: 'ชั้นของโลกที่มีสถานะเป็นของแข็งและบางที่สุดคือ ________',
    type: 'fill-blank',
    blanks: ['เปลือกโลก', 'Crust'],
    correctAnswer: 'เปลือกโลก',
    explanation: 'เปลือกโลก (Crust) เป็นชั้นนอกสุดที่เป็นของแข็งและบางที่สุด มีความหนาเฉลี่ย 30-50 กิโลเมตร',
    difficulty: 'medium',
    points: 15,
    category: 'earth-structure',
    timeBonus: 7
  },
  {
    id: 'fb-2',
    question: 'ดาวเคราะห์ที่มีวงแหวนที่สวยงามและชัดเจนที่สุดคือ ________',
    type: 'fill-blank',
    blanks: ['ดาวเสาร์', 'Saturn'],
    correctAnswer: 'ดาวเสาร์',
    explanation: 'ดาวเสาร์ (Saturn) มีระบบวงแหวนที่สวยงามและชัดเจนที่สุด ประกอบด้วยหิน น้ำแข็ง และฝุ่น',
    difficulty: 'easy',
    points: 10,
    category: 'planets',
    timeBonus: 5
  },
  {
    id: 'fb-3',
    question: 'ดาวอาทิตย์มีมวลคิดเป็น ________ % ของมวลทั้งหมดในระบบสุริยะ',
    type: 'fill-blank',
    blanks: ['99.86', '99.8'],
    correctAnswer: '99.86',
    explanation: 'ดาวอาทิตย์มีมวลคิดเป็น 99.86% ของมวลทั้งหมดในระบบสุริยะ ทำให้เป็นศูนย์กลางแรงโน้มถ่วง',
    difficulty: 'hard',
    points: 20,
    category: 'solar-system',
    timeBonus: 10
  },
  {
    id: 'fb-4',
    question: 'ชั้นบรรยากาศที่เราอาศัยอยู่เรียกว่า ________',
    type: 'fill-blank',
    blanks: ['โทรโปสเฟียร์', 'Troposphere'],
    correctAnswer: 'โทรโปสเฟียร์',
    explanation: 'โทรโปสเฟียร์ (Troposphere) เป็นชั้นบรรยากาศที่ใกล้พื้นผิวโลกที่สุด และเป็นที่เกิดสภาพอากาศต่างๆ',
    difficulty: 'medium',
    points: 15,
    category: 'earth-structure',
    timeBonus: 7
  }
];

// คำถามแบบจับคู่ (Matching)
export const matchingQuestions: MiniGameQuestion[] = [
  {
    id: "match-1",
    question: "จับคู่ดาวเคราะห์กับลักษณะเด่น",
    type: "matching",
    pairs: [
      { left: "ดาวพุธ", right: "ใกล้ดวงอาทิตย์ที่สุด" },
      { left: "ดาวศุกร์", right: "ร้อนที่สุดในระบบสุริยะ" },
      { left: "ดาวอังคาร", right: "ดาวแดง" },
      { left: "ดาวพฤหัสบดี", right: "ใหญ่ที่สุด" },
    ],
    correctAnswer: [
      "ดาวพุธ-ใกล้ดวงอาทิตย์ที่สุด",
      "ดาวศุกร์-ร้อนที่สุดในระบบสุริยะ",
      "ดาวอังคาร-ดาวแดง",
      "ดาวพฤหัสบดี-ใหญ่ที่สุด",
    ],
    explanation: "การจับคู่ดาวเคราะห์กับลักษณะเด่นของแต่ละดวง",
    difficulty: "medium",
    points: 20,
    category: "planets",
    timeBonus: 10,
  },
  {
    id: "match-2",
    question: "จับคู่ชั้นโลกกับลักษณะสำคัญ",
    type: "matching",
    pairs: [
      { left: "เปลือกโลก", right: "ชั้นที่เป็นของแข็งและบางที่สุด" },
      { left: "เนื้อโลก", right: "ชั้นที่หนาที่สุดและเป็นหิน" },
      { left: "แกนกลางชั้นนอก", right: "เป็นของเหลว ประกอบด้วยเหล็ก" },
      { left: "แกนกลางชั้นใน", right: "เป็นของแข็ง อุณหภูมิสูงที่สุด" },
    ],
    correctAnswer: [
      "เปลือกโลก-ชั้นที่เป็นของแข็งและบางที่สุด",
      "เนื้อโลก-ชั้นที่หนาที่สุดและเป็นหิน",
      "แกนกลางชั้นนอก-เป็นของเหลว ประกอบด้วยเหล็ก",
      "แกนกลางชั้นใน-เป็นของแข็ง อุณหภูมิสูงที่สุด",
    ],
    explanation: "การจับคู่ชั้นโครงสร้างภายในของโลกกับลักษณะสำคัญ",
    difficulty: "hard",
    points: 25,
    category: "earth-structure",
    timeBonus: 12,
  },
];

// คำถามแบบ True/False
export const trueFalseQuestions: MiniGameQuestion[] = [
  {
    id: 'tf-1',
    question: 'ดาวศุกร์เป็นดาวเคราะห์ที่ร้อนที่สุดในระบบสุริยะ',
    type: 'true-false',
    correctAnswer: 'true',
    explanation: 'ดาวศุกร์เป็นดาวเคราะห์ที่ร้อนที่สุด มีอุณหภูมิประมาณ 464°C เนื่องจากเอฟเฟกต์เรือนกระจก',
    difficulty: 'medium',
    points: 12,
    category: 'planets',
    timeBonus: 6
  },
  {
    id: 'tf-2',
    question: 'โลกมีชั้นบรรยากาศทั้งหมด 4 ชั้น',
    type: 'true-false',
    correctAnswer: 'false',
    explanation: 'โลกมีชั้นบรรยากาศ 5 ชั้น ได้แก่ โทรโปสเฟียร์ สตราโตสเฟียร์ มีโซสเฟียร์ เทอร์โมสเฟียร์ และเอ็กโซสเฟียร์',
    difficulty: 'medium',
    points: 12,
    category: 'earth-structure',
    timeBonus: 6
  },
  {
    id: 'tf-3',
    question: 'ดาวเคราะห์ในระบบภายนอกทั้งหมดเป็นดาวเคราะห์ก๊าซ',
    type: 'true-false',
    correctAnswer: 'true',
    explanation: 'ดาวเคราะห์ในระบบภายนอก (ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส ดาวเนปจูน) ล้วนเป็นดาวเคราะห์ก๊าซ',
    difficulty: 'easy',
    points: 10,
    category: 'solar-system',
    timeBonus: 5
  }
];

// คำถามแบบเรียงลำดับ (Ordering)
export const orderingQuestions: MiniGameQuestion[] = [
  {
    id: 'order-1',
    question: 'เรียงลำดับดาวเคราะห์จากใกล้ดวงอาทิตย์ไปไกลที่สุด',
    type: 'ordering',
    items: ['ดาวอังคาร', 'ดาวพุธ', 'โลก', 'ดาวศุกร์'],
    correctOrder: [1, 3, 0, 2], // ดาวพุธ, ดาวศุกร์, โลก, ดาวอังคาร
    correctAnswer: ['ดาวพุธ', 'ดาวศุกร์', 'โลก', 'ดาวอังคาร'],
    explanation: 'ลำดับดาวเคราะห์จากใกล้ดวงอาทิตย์: ดาวพุธ, ดาวศุกร์, โลก, ดาวอังคาร',
    difficulty: 'medium',
    points: 18,
    category: 'solar-system',
    timeBonus: 9
  },
  {
    id: 'order-2',
    question: 'เรียงลำดับชั้นโครงสร้างโลกจากนอกเข้าใน',
    type: 'ordering',
    items: ['แกนกลางชั้นใน', 'เนื้อโลก', 'เปลือกโลก', 'แกนกลางชั้นนอก'],
    correctOrder: [2, 1, 3, 0], // เปลือกโลก, เนื้อโลก, แกนกลางชั้นนอก, แกนกลางชั้นใน
    correctAnswer: ['เปลือกโลก', 'เนื้อโลก', 'แกนกลางชั้นนอก', 'แกนกลางชั้นใน'],
    explanation: 'ลำดับชั้นโครงสร้างโลกจากนอกเข้าใน: เปลือกโลก, เนื้อโลก, แกนกลางชั้นนอก, แกนกลางชั้นใน',
    difficulty: 'hard',
    points: 22,
    category: 'earth-structure',
    timeBonus: 11
  }
];

// รวมคำถามทั้งหมด
export const allMiniGameQuestions: MiniGameQuestion[] = [
  ...multipleChoiceQuestions,
  ...fillBlankQuestions,
  ...matchingQuestions,
  ...trueFalseQuestions,
  ...orderingQuestions
];

// ฟังก์ชันเลือกคำถามสำหรับแต่ละโหมด
export const getQuestionsForMode = (mode: 'score-challenge' | 'time-rush' | 'random-quiz'): MiniGameQuestion[] => {
  switch (mode) {
    case 'score-challenge':
      // โหมดสะสมคะแนน: หลากหลายประเภท 15 ข้อ
      return shuffleArray([
        ...multipleChoiceQuestions.slice(0, 5),
        ...fillBlankQuestions.slice(0, 3),
        ...matchingQuestions.slice(0, 2),
        ...trueFalseQuestions.slice(0, 3),
        ...orderingQuestions.slice(0, 2)
      ]);
    
    case 'time-rush':
      // โหมดท้าทายเวลา: เน้นคำถามที่ตอบได้เร็ว 25 ข้อ
      return shuffleArray([
        ...multipleChoiceQuestions,
        ...trueFalseQuestions,
        ...fillBlankQuestions.slice(0, 2)
      ]).slice(0, 25);
    
    case 'random-quiz':
      // โหมดทบทวนแบบสุ่ม: สุ่มจากทุกประเภท 12 ข้อ
      return shuffleArray(allMiniGameQuestions).slice(0, 12);
    
    default:
      return [];
  }
};

// ฟังก์ชันสุ่มอาเรย์
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// ฟังก์ชันคำนวณคะแนนโบนัสจากเวลา
export const calculateTimeBonus = (timeSpent: number, timeBonus: number): number => {
  // ถ้าตอบภายใน 5 วินาที จะได้โบนัสเต็ม
  // ถ้าตอบมากกว่า 15 วินาที จะไม่ได้โบนัส
  if (timeSpent <= 5) return timeBonus;
  if (timeSpent >= 15) return 0;
  
  // คำนวณโบนัสแบบเป็นอัตราส่วน
  const ratio = (15 - timeSpent) / 10;
  return Math.round(timeBonus * ratio);
};
