import { Quiz } from '../types/quiz';

export const quizzes: Quiz[] = [
  {
    id: 'solar-system-quiz',
    moduleId: 'solar-system',
    title: 'แบบทดสอบระบบสุริยะ',
    description: 'ทดสอบความเข้าใจเกี่ยวกับระบบสุริยะ ดาวเคราะห์ และวัตถุท้องฟ้าต่างๆ',
    timeLimit: 20,
    passingScore: 75,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'ดาวอาทิตย์คิดเป็นกี่เปอร์เซ็นต์ของมวลทั้งหมดในระบบสุริยะ?',
        type: 'multiple-choice',
        options: ['95.5%', '98.2%', '99.86%', '100%'],
        correctAnswer: 2,
        explanation: 'ดาวอาทิตย์มีมวลคิดเป็น 99.86% ของมวลทั้งหมดในระบบสุริยะ ทำให้มีแรงโน้มถ่วงที่ควบคุมการโคจรของวัตถุทั้งหมดในระบบ',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q2',
        question: 'ระบบสุริยะมีดาวเคราะห์ทั้งหมดกี่ดวง?',
        type: 'multiple-choice',
        options: ['7 ดวง', '8 ดวง', '9 ดวง', '10 ดวง'],
        correctAnswer: 1,
        explanation: 'ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง หลังจากที่ดาวพลูโตถูกจัดประเภทเป็นดาวเคราะห์แคระในปี 2006',
        difficulty: 'easy',
        points: 5
      },
      {
        id: 'q3',
        question: 'ดาวเคราะห์ใดต่อไปนี้เป็นดาวเคราะห์ในระบบภายใน?',
        type: 'multiple-choice',
        options: ['ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวอังคาร', 'ดาวเนปจูน'],
        correctAnswer: 2,
        explanation: 'ดาวอังคารเป็นดาวเคราะห์ในระบบภายใน (Inner Planet) ร่วมกับดาวพุธ ดาวศุกร์ และโลก ซึ่งมีพื้นผิวเป็นหิน',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q4',
        question: 'ดาวเคราะห์ในระบบภายนอกเป็นดาวเคราะห์ก๊าซทั้งหมด',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'ดาวเคราะห์ในระบบภายนอก (ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส ดาวเนปจูน) เป็นดาวเคราะห์ก๊าซหรือดาวเคราะห์น้ำแข็ง',
        difficulty: 'easy',
        points: 5
      },
      {
        id: 'q5',
        question: 'โลกเป็นดาวเคราะห์ลำดับที่เท่าไหร่จากดาวอาทิตย์?',
        type: 'multiple-choice',
        options: ['ลำดับที่ 2', 'ลำดับที่ 3', 'ลำดับที่ 4', 'ลำดับที่ 5'],
        correctAnswer: 1,
        explanation: 'โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดาวอาทิตย์ หลังจากดาวพุธและดาวศุกร์ และอยู่ในเขต Habitable Zone',
        difficulty: 'easy',
        points: 5
      },
      {
        id: 'q6',
        question: 'ดาวเคราะห์ใดมีวงแหวนที่สวยงามและเห็นได้ชัดเจนที่สุด?',
        type: 'multiple-choice',
        options: ['ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
        correctAnswer: 1,
        explanation: 'ดาวเสาร์มีวงแหวนที่สวยงามและเห็นได้ชัดเจนที่สุด ประกอบด้วยน้ำแข็งและฝุ่นหินขนาดเล็ก',
        difficulty: 'easy',
        points: 5
      },
      {
        id: 'q7',
        question: 'ดาวเคราะห์ใดที่มีอุณหภูมิสูงที่สุดในระบบสุริยะ?',
        type: 'multiple-choice',
        options: ['ดาวพุธ (ใกล้ดาวอาทิตย์ที่สุด)', 'ดาวศุกร์', 'ดาวอังคาร', 'โลก'],
        correctAnswer: 1,
        explanation: 'ดาวศุกร์มีอุณหภูมิสูงที่สุดถึง 462°C เนื่องจากมีบรรยากาศหนาแน่นที่เกิดภาวะเรือนกระจกรุนแรง',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q8',
        question: 'ระยะห่างเฉลี่ยจากโลกถึงดาวอาทิตย์เรียกว่าอะไร?',
        type: 'text',
        correctAnswer: 'astronomical unit',
        explanation: 'ระยะห่างเฉลี่ยจากโลกถึงดาวอาทิตย์ (150 ล้านกิโลเมตร) เรียกว่า Astronomical Unit หรือ AU',
        difficulty: 'hard',
        points: 15
      },
      {
        id: 'q9',
        question: 'ดาวเคราะห์ใดที่โคจรในทิศทางตรงข้ามกับดาวเคราะห์อื่นๆ?',
        type: 'multiple-choice',
        options: ['ดาวศุกร์', 'ดาวยูเรนัส', 'ดาวเนปจูน', 'ดาวพลูโต'],
        correctAnswer: 1,
        explanation: 'ดาวยูเรนัสโคจรแบบหมุนข้างและโคจรในทิศทางตรงข้ามกับดาวเคราะห์อื่นๆ เรียกว่า retrograde rotation',
        difficulty: 'hard',
        points: 15
      },
      {
        id: 'q10',
        question: 'ดาวเทียมธรรมชาติที่ใหญ่ที่สุดในระบบสุริยะคือ?',
        type: 'multiple-choice',
        options: ['ดวงจันทร์ของโลก', 'Ganymede ของดาวพฤหัสบดี', 'Titan ของดาวเสาร์', 'Europa ของดาวพฤหัสบดี'],
        correctAnswer: 1,
        explanation: 'Ganymede ดาวเทียมของดาวพฤหัสบดีเป็นดาวเทียมธรรมชาติที่ใหญ่ที่สุด มีขนาดใหญ่กว่าดาวพุธด้วยซ้ำ',
        difficulty: 'hard',
        points: 15
      }
    ]
  },
  {
    id: 'earth-structure-quiz',
    moduleId: 'earth-structure',
    title: 'แบบทดสอบโครงสร้างโลก',
    description: 'ทดสอบความเข้าใจเกี่ยวกับโครงสร้างภายในของโลก ชั้นบรรยากาศ และภูมิศาสตร์ธรณี',
    timeLimit: 18,
    passingScore: 75,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1',
        question: 'โลกมีโครงสร้างภายในแบ่งออกเป็นกี่ชั้นหลัก?',
        type: 'multiple-choice',
        options: ['3 ชั้น', '4 ชั้น', '5 ชั้น', '6 ชั้น'],
        correctAnswer: 1,
        explanation: 'โลกมีโครงสร้างภายในแบ่งออกเป็น 4 ชั้นหลัก ได้แก่ เปลือกโลก เนื้อโลก แกนกลางชั้นนอก และแกนกลางชั้นใน',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'q2',
        question: 'ชั้นใดของโลกที่เป็นของแข็งและบางที่สุด?',
        type: 'multiple-choice',
        options: ['เนื้อโลก', 'เปลือกโลก', 'แกนกลางชั้นนอก', 'แกนกลางชั้นใน'],
        correctAnswer: 1,
        explanation: 'เปลือกโลก (Crust) เป็นชั้นนอกสุดที่เป็นของแข็งและบางที่สุด มีความหนาเฉลี่ย 30-50 กิโลเมตรบนแผ่นดิน และ 5-10 กิโลเมตรใต้มหาสมุทร',
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
      },
      {
        id: 'q6',
        question: 'ชั้นบรรยากาศใดที่มีชั้นโอโซนซึ่งช่วยป้องกันรังสี UV?',
        type: 'multiple-choice',
        options: ['โทรโปสเฟียร์', 'สตราโตสเฟียร์', 'มีโซสเฟียร์', 'เทอร์โมสเฟียร์'],
        correctAnswer: 1,
        explanation: 'สตราโตสเฟียร์มีชั้นโอโซน (O₃) ที่ช่วยดูดซับและป้องกันรังสีอุลตราไวโอเลตจากดาวอาทิตย์',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q7',
        question: 'แผ่นเปลือกโลกเคลื่อนที่ด้วยความเร็วประมาณเท่าไหร่ต่อปี?',
        type: 'multiple-choice',
        options: ['2-10 เซนติเมตร', '2-10 เมตร', '2-10 กิโลเมตร', '20-100 กิโลเมตร'],
        correctAnswer: 0,
        explanation: 'แผ่นเปลือกโลกเคลื่อนที่ด้วยความเร็วประมาณ 2-10 เซนติเมตรต่อปี ซึ่งเท่ากับความเร็วการเจริญของเล็บมือ',
        difficulty: 'hard',
        points: 15
      },
      {
        id: 'q8',
        question: 'อุณหภูมิในแกนกลางของโลกสูงถึงกี่องศาเซลเซียส?',
        type: 'multiple-choice',
        options: ['1,000°C', '3,000°C', '6,000°C', '10,000°C'],
        correctAnswer: 2,
        explanation: 'อุณหภูมิในแกนกลางของโลกสูงถึงประมาณ 6,000°C ซึ่งร้อนเท่ากับพื้นผิวของดาวอาทิตย์',
        difficulty: 'hard',
        points: 15
      },
      {
        id: 'q9',
        question: 'ชั้นใดของโลกที่อยู่ในสถานะกึ่งเหลว?',
        type: 'text',
        correctAnswer: 'เนื้อโลก',
        explanation: 'เนื้อโลก (Mantle) อยู่ในสถานะกึ่งเหลวหรือพลาสมา เนื่องจากอุณหภูมิและความดันสูง ทำให้สามารถไหลได้อย่างช้าๆ',
        difficulty: 'medium',
        points: 10
      },
      {
        id: 'q10',
        question: 'การเคลื่อนที่ของแผ่นเปลือกโลกเรียกว่าอะไร?',
        type: 'text',
        correctAnswer: 'plate tectonics',
        explanation: 'การเคลื่อนที่ของแผ่นเปลือกโลกเรียกว่า Plate Tectonics หรือทฤษฎีการเคลื่อนที่ของแผ่นเปลือกโลก',
        difficulty: 'medium',
        points: 10
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

// ฟังก์ชันช่วยในการคำนวณคะแนนรวม
export function getTotalQuestionsInQuiz(quizId: string): number {
  const quiz = getQuizById(quizId);
  return quiz ? quiz.questions.length : 0;
}

// ฟังก์ชันช่วยในการคำนวณคะแนนเต็ม
export function getMaxScoreInQuiz(quizId: string): number {
  const quiz = getQuizById(quizId);
  return quiz ? quiz.questions.reduce((total, q) => total + q.points, 0) : 0;
}
