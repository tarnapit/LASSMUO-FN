import { Quiz } from '../types/quiz';

export const quizzes: Quiz[] = [
  {
    id: 'solar-system-quiz',
    moduleId: 'solar-system',
    title: 'แบบทดสอบระบบสุริยะ',
    description: 'ทดสอบความเข้าใจเกี่ยวกับระบบสุริยะและดาวเคราะห์ต่างๆ',
    timeLimit: 15,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'ดาวอาทิตย์คิดเป็นกี่เปอร์เซ็นต์ของมวลทั้งหมดในระบบสุริยะ?',
        type: 'multiple-choice',
        options: ['95.5%', '98.2%', '99.86%', '100%'],
        correctAnswer: 2,
        explanation: 'ดาวอาทิตย์มีมวลคิดเป็น 99.86% ของมวลทั้งหมดในระบบสุริยะ',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q2',
        question: 'ระบบสุริยะมีดาวเคราะห์ทั้งหมดกี่ดวง?',
        type: 'multiple-choice',
        options: ['7 ดวง', '8 ดวง', '9 ดวง', '10 ดวง'],
        correctAnswer: 1,
        explanation: 'ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง หลังจากที่ดาวพลูโตถูกจัดประเภทเป็นดาวเคราะห์แคระ',
        difficulty: 'easy',
        points: 5
      },
      {
        id: 'q3',
        question: 'ดาวเคราะห์ใดต่อไปนี้เป็นดาวเคราะห์ในระบบภายใน?',
        type: 'multiple-choice',
        options: ['ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวอังคาร', 'ดาวเนปจูน'],
        correctAnswer: 2,
        explanation: 'ดาวอังคารเป็นดาวเคราะห์ในระบบภายใน (Inner Planet) ร่วมกับดาวพุธ ดาวศุกร์ และโลก',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q4',
        question: 'ดาวเคราะห์ในระบบภายนอกเป็นดาวเคราะห์ก๊าซ',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'ดาวเคราะห์ในระบบภายนอก (ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส ดาวเนปจูน) เป็นดาวเคราะห์ก๊าซ',
        difficulty: 'easy',
        points: 5
      },
      {
        id: 'q5',
        question: 'โลกเป็นดาวเคราะห์ลำดับที่เท่าไหร่จากดาวอาทิตย์?',
        type: 'multiple-choice',
        options: ['ลำดับที่ 2', 'ลำดับที่ 3', 'ลำดับที่ 4', 'ลำดับที่ 5'],
        correctAnswer: 1,
        explanation: 'โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดาวอาทิตย์ หลังจากดาวพุธและดาวศุกร์',
        difficulty: 'easy',
        points: 5
      }
    ]
  },
  {
    id: 'earth-structure-quiz',
    moduleId: 'earth-structure',
    title: 'แบบทดสอบโครงสร้างโลก',
    description: 'ทดสอบความเข้าใจเกี่ยวกับโครงสร้างภายในของโลกและชั้นบรรยากาศ',
    timeLimit: 12,
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'โลกมีโครงสร้างภายในแบ่งออกเป็นกี่ชั้นหลัก?',
        type: 'multiple-choice',
        options: ['3 ชั้น', '4 ชั้น', '5 ชั้น', '6 ชั้น'],
        correctAnswer: 1,
        explanation: 'โลกมีโครงสร้างภายในแบ่งออกเป็น 4 ชั้นหลัก ได้แก่ เปลือกโลก เสื้อคลุมโลก แกนกลางชั้นนอก และแกนกลางชั้นใน',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'q2',
        question: 'ชั้นใดของโลกที่เป็นของแข็งและบางที่สุด?',
        type: 'multiple-choice',
        options: ['เสื้อคลุมโลก', 'เปลือกโลก', 'แกนกลางชั้นนอก', 'แกนกลางชั้นใน'],
        correctAnswer: 1,
        explanation: 'เปลือกโลก (Crust) เป็นชั้นนอกสุดที่เป็นของแข็งและบางที่สุด มีความหนาเฉลี่ย 30-50 กิโลเมตร',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q3',
        question: 'ชั้นบรรยากาศของโลกแบ่งออกเป็นกี่ชั้น?',
        type: 'multiple-choice',
        options: ['4 ชั้น', '5 ชั้น', '6 ชั้น', '7 ชั้น'],
        correctAnswer: 1,
        explanation: 'ชั้นบรรยากาศของโลกแบ่งออกเป็น 5 ชั้น คือ โทรโปสเฟียร์ สตราโตสเฟียร์ มีโซสเฟียร์ เทอร์โมสเฟียร์ และเอ็กโซสเฟียร์',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q4',
        question: 'สนามแม่เหล็กโลกเกิดจากการเคลื่อนไหวของเหล็กเหลวในแกนกลางชั้นนอก',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'สนามแม่เหล็กโลกเกิดจากการเคลื่อนไหวของเหล็กเหลวและนิกเกลในแกนกลางชั้นนอก ซึ่งสร้างกระแสไฟฟ้าและสนามแม่เหล็ก',
        difficulty: 'hard',
        points: 15
      },
      {
        id: 'q5',
        question: 'ชั้นบรรยากาศใดที่เราอาศัยอยู่และมีสภาพอากาศเกิดขึ้น?',
        type: 'multiple-choice',
        options: ['สตราโตสเฟียร์', 'โทรโปสเฟียร์', 'มีโซสเฟียร์', 'เทอร์โมสเฟียร์'],
        correctAnswer: 1,
        explanation: 'โทรโปสเฟียร์เป็นชั้นบรรยากาศที่เราอาศัยอยู่ และเป็นชั้นที่มีสภาพอากาศต่างๆ เกิดขึ้น เช่น เมฆ ฝน หิมะ',
        difficulty: 'easy',
        points: 5
      }
    ]
  },
  {
    id: 'stellar-evolution-quiz',
    moduleId: 'stellar-evolution',
    title: 'แบบทดสอบวิวัฒนาการของดาวฤกษ์',
    description: 'ทดสอบความเข้าใจเกี่ยวกับกระบวนการเกิดและวิวัฒนาการของดาวฤกษ์',
    timeLimit: 20,
    passingScore: 75,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'ดาวฤกษ์เกิดขึ้นจากการยุบตัวของอะไร?',
        type: 'multiple-choice',
        options: ['เมฆก๊าซและฝุ่น', 'ดาวเคราะห์เก่า', 'ดาวหาง', 'อุกกาบาต'],
        correctAnswer: 0,
        explanation: 'ดาวฤกษ์เกิดจากการยุบตัวของเมฆก๊าซและฝุ่นในอวกาศภายใต้แรงโน้มถ่วง',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q2',
        question: 'ดาวฤกษ์ขนาดใหญ่จะจบชีวิตด้วยการระเบิดเป็น Supernova',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'ดาวฤกษ์ขนาดใหญ่จะระเบิดเป็น Supernova เมื่อจบชีวิต และอาจกลายเป็น Neutron Star หรือ Black Hole',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q3',
        question: 'Main Sequence คือช่วงใดของดาวฤกษ์?',
        type: 'multiple-choice',
        options: ['ช่วงเกิด', 'ช่วงเผาไฮโดรเจน', 'ช่วงตาย', 'ช่วงระเบิด'],
        correctAnswer: 1,
        explanation: 'Main Sequence คือช่วงที่ดาวฤกษ์เผาไฮโดรเจนในแกนกลางเป็นฮีเลียม ซึ่งเป็นช่วงที่ยาวนานที่สุดในชีวิตของดาวฤกษ์',
        difficulty: 'hard',
        points: 15
      }
    ]
  },
  {
    id: 'galaxies-universe-quiz',
    moduleId: 'galaxies-universe',
    title: 'แบบทดสอบกาแล็กซีและจักรวาล',
    description: 'ทดสอบความเข้าใจเกี่ยวกับกาแล็กซีและโครงสร้างของจักรวาล',
    timeLimit: 25,
    passingScore: 80,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'กาแล็กซีของเราชื่ออะไร?',
        type: 'multiple-choice',
        options: ['Andromeda', 'Milky Way', 'Whirlpool', 'Sombrero'],
        correctAnswer: 1,
        explanation: 'กาแล็กซีของเราชื่อ Milky Way หรือทางช้างเผือก',
        difficulty: 'easy',
        points: 5
      },
      {
        id: 'q2',
        question: 'จักรวาลกำลังขยายตัว',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'จักรวาลกำลังขยายตัวตั้งแต่เหตุการณ์ Big Bang เมื่อประมาณ 13.8 พันล้านปีที่แล้ว',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q3',
        question: 'หลุมดำ (Black Hole) คืออะไร?',
        type: 'multiple-choice',
        options: [
          'ดาวฤกษ์ที่มีความหนาแน่นสูงมาก',
          'บริเวณที่แรงโน้มถ่วงแรงมากจนแสงไม่สามารถหลุดออกมาได้',
          'ดาวเคราะห์ที่มีสีดำ',
          'พื้นที่ว่างในอวกาศ'
        ],
        correctAnswer: 1,
        explanation: 'หลุมดำคือบริเวณที่แรงโน้มถ่วงแรงมากจนแสงไม่สามารถหลุดออกมาได้',
        difficulty: 'hard',
        points: 15
      }
    ]
  }
];

// ฟังก์ชันช่วยในการหา quiz ตาม moduleId
export function getQuizByModuleId(moduleId: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.moduleId === moduleId);
}

// ฟังก์ชันช่วยในการหา quiz ตาม quizId
export function getQuizById(quizId: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.id === quizId);
}
