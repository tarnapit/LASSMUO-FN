import { StageData } from '../types/stage';

export const stageData: Record<number, StageData> = {
  1: {
    id: 1,
    title: "ระบบสุริยะ",
    description: "เรียนรู้เกี่ยวกับดวงอาทิตย์และดาวเคราะห์ในระบบสุริยะ",
    thumbnail: "☀️",
    difficulty: 'easy',
    estimatedTime: "15 นาที",
    prerequisites: [],
    totalStars: 3,
    rewards: {
      stars: 3,
      points: 100,
      badges: ["solar-explorer"],
      unlocksStages: [2]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "สวัสดี! ฉันชื่อซิกโก้ นักสำรวจอวกาศ วันนี้เราจะมาเรียนรู้เกี่ยวกับระบบสุริยะกัน!",
      learningContent: "ระบบสุริยะของเราประกอบด้วยดวงอาทิตย์และดาวเคราะห์ 8 ดวง แต่ละดวงมีความพิเศษและลักษณะเฉพาะของตัวเอง มาเรียนรู้ไปพร้อมกันเถอะ!",
      completionMessage: "ยอดเยี่ยม! คุณได้เรียนรู้เกี่ยวกับระบบสุริยะเรียบร้อยแล้ว ตอนนี้คุณสามารถสำรวจดาวเคราะห์ในระบบภายในได้แล้ว!"
    },
    questions: [
      {
        id: 1,
        question: "ระบบสุริยะของเรามีดาวเคราะห์ทั้งหมดกี่ดวง?",
        difficulty: 'easy',
        points: 10,
        answers: [
          { id: 1, text: "6 ดวง", isCorrect: false },
          { id: 2, text: "7 ดวง", isCorrect: false },
          { id: 3, text: "8 ดวง", isCorrect: true },
          { id: 4, text: "9 ดวง", isCorrect: false },
        ],
        explanation: "ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง ได้แก่ ดาวพุธ ดาวศุกร์ โลก ดาวอังคาร ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน"
      },
      {
        id: 2,
        question: "ดาวเคราะห์ดวงใดที่อยู่ใกล้ดวงอาทิตย์ที่สุด?",
        difficulty: 'easy',
        points: 10,
        answers: [
          { id: 1, text: "ดาวศุกร์", isCorrect: false },
          { id: 2, text: "ดาวพุธ", isCorrect: true },
          { id: 3, text: "โลก", isCorrect: false },
          { id: 4, text: "ดาวอังคาร", isCorrect: false },
        ],
        explanation: "ดาวพุธ (Mercury) เป็นดาวเคราะห์ที่อยู่ใกล้ดวงอาทิตย์ที่สุด ห่างออกไปประมาณ 58 ล้านกิโลเมตร"
      },
      {
        id: 3,
        question: "ดาวเคราะห์ดวงใดที่มีขนาดใหญ่ที่สุดในระบบสุริยะ?",
        difficulty: 'medium',
        points: 15,
        answers: [
          { id: 1, text: "ดาวเสาร์", isCorrect: false },
          { id: 2, text: "ดาวพฤหัสบดี", isCorrect: true },
          { id: 3, text: "ดาวยูเรนัส", isCorrect: false },
          { id: 4, text: "ดาวเนปจูน", isCorrect: false },
        ],
        explanation: "ดาวพฤหัสบดี (Jupiter) เป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะ มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกันทั้งหมด"
      }
    ]
  },
  2: {
    id: 2,
    title: "ดาวเคราะห์ในระบบภายใน",
    description: "สำรวจดาวพุธ ดาวศุกร์ โลก และดาวอังคาร",
    thumbnail: "🌍",
    difficulty: 'easy',
    estimatedTime: "20 นาที",
    prerequisites: [1],
    totalStars: 3,
    rewards: {
      stars: 3,
      points: 150,
      badges: ["inner-planet-explorer"],
      unlocksStages: [3]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "ยินดีที่ได้พบกันอีกครั้ง! วันนี้เราจะมาสำรวจดาวเคราะห์ในระบบภายในกัน",
      learningContent: "ดาวเคราะห์ในระบบภายในประกอบด้วย 4 ดวง ได้แก่ ดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ดาวเคราะห์เหล่านี้เป็นดาวเคราะห์หินและอยู่ใกล้ดวงอาทิตย์",
      completionMessage: "เยี่ยมมาก! คุณได้เรียนรู้เกี่ยวกับดาวเคราะห์ในระบบภายในแล้ว ต่อไปมาสำรวจดาวเคราะห์ในระบบภายนอกกัน!"
    },
    questions: [
      {
        id: 1,
        question: "ดาวเคราะห์ดวงใดที่เรียกว่า 'ดาวเคราะห์สีแดง'?",
        difficulty: 'easy',
        points: 10,
        answers: [
          { id: 1, text: "ดาวศุกร์", isCorrect: false },
          { id: 2, text: "ดาวอังคาร", isCorrect: true },
          { id: 3, text: "ดาวพุธ", isCorrect: false },
          { id: 4, text: "โลก", isCorrect: false },
        ],
        explanation: "ดาวอังคาร (Mars) เรียกว่าดาวเคราะห์สีแดงเพราะมีธาตุเหล็กออกไซด์บนผิวหน้าที่ทำให้ดูเป็นสีแดง"
      },
      {
        id: 2,
        question: "ดาวเคราะห์ดวงใดที่ร้อนที่สุดในระบบสุริยะ?",
        difficulty: 'medium',
        points: 15,
        answers: [
          { id: 1, text: "ดาวพุธ", isCorrect: false },
          { id: 2, text: "ดาวศุกร์", isCorrect: true },
          { id: 3, text: "โลก", isCorrect: false },
          { id: 4, text: "ดาวอังคาร", isCorrect: false },
        ],
        explanation: "ดาวศุกร์ (Venus) เป็นดาวเคราะห์ที่ร้อนที่สุดในระบบสุริยะเพราะมีชั้นบรรยากาศหนาทึบที่กักเก็บความร้อน"
      },
      {
        id: 3,
        question: "โลกเป็นดาวเคราะห์ลำดับที่เท่าไหร่จากดวงอาทิตย์?",
        difficulty: 'easy',
        points: 10,
        answers: [
          { id: 1, text: "ลำดับที่ 2", isCorrect: false },
          { id: 2, text: "ลำดับที่ 3", isCorrect: true },
          { id: 3, text: "ลำดับที่ 4", isCorrect: false },
          { id: 4, text: "ลำดับที่ 5", isCorrect: false },
        ],
        explanation: "โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดวงอาทิตย์ อยู่ในระยะที่เหมาะสมกับการมีชีวิต"
      }
    ]
  },
  3: {
    id: 3,
    title: "ดาวเคราะห์ในระบบภายนอก",
    description: "ค้นพบดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน",
    thumbnail: "🪐",
    difficulty: 'medium',
    estimatedTime: "25 นาที",
    prerequisites: [2],
    totalStars: 3,
    rewards: {
      stars: 3,
      points: 200,
      badges: ["outer-planet-explorer"],
      unlocksStages: [4]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "ยอดเยี่ยม! ตอนนี้เรามาสำรวจดาวเคราะห์ยักษ์แก๊สในระบบภายนอกกัน",
      learningContent: "ดาวเคราะห์ในระบบภายนอกเป็นดาวเคราะห์ยักษ์ที่ประกอบด้วยแก๊สเป็นหลัก มีขนาดใหญ่และมีดวงจันทร์จำนวนมาก",
      completionMessage: "ยอดเยี่ยมมาก! คุณได้เรียนรู้เกี่ยวกับดาวเคราะห์ยักษ์แก๊สแล้ว ต่อไปมาเรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมกัน!"
    },
    questions: [
      {
        id: 1,
        question: "ดาวเคราะห์ดวงใดที่มีวงแหวนที่สวยงาม?",
        difficulty: 'easy',
        points: 10,
        answers: [
          { id: 1, text: "ดาวพฤหัสบดี", isCorrect: false },
          { id: 2, text: "ดาวเสาร์", isCorrect: true },
          { id: 3, text: "ดาวยูเรนัส", isCorrect: false },
          { id: 4, text: "ดาวเนปจูน", isCorrect: false },
        ],
        explanation: "ดาวเสาร์ (Saturn) มีวงแหวนที่สวยงามและเห็นได้ชัดเจนที่สุด ประกอบด้วยอนุภาคน้ำแข็งและหิน"
      },
      {
        id: 2,
        question: "ดาวเคราะห์ดวงใดที่หมุนรอบตัวเองในแนวข้าง?",
        difficulty: 'hard',
        points: 20,
        answers: [
          { id: 1, text: "ดาวพฤหัสบดี", isCorrect: false },
          { id: 2, text: "ดาวเสาร์", isCorrect: false },
          { id: 3, text: "ดาวยูเรนัส", isCorrect: true },
          { id: 4, text: "ดาวเนปจูน", isCorrect: false },
        ],
        explanation: "ดาวยูเรนัส (Uranus) หมุนรอบตัวเองในแนวข้าง แตกต่างจากดาวเคราะห์อื่นๆ ที่หมุนในแนวตั้ง"
      },
      {
        id: 3,
        question: "ดาวเคราะห์ดวงใดที่ไกลจากดวงอาทิตย์ที่สุด?",
        difficulty: 'medium',
        points: 15,
        answers: [
          { id: 1, text: "ดาวเสาร์", isCorrect: false },
          { id: 2, text: "ดาวยูเรนัส", isCorrect: false },
          { id: 3, text: "ดาวเนปจูน", isCorrect: true },
          { id: 4, text: "ดาวพลูโต", isCorrect: false },
        ],
        explanation: "ดาวเนปจูน (Neptune) เป็นดาวเคราะห์ที่ไกลจากดวงอาทิตย์ที่สุด ห่างออกไปประมาณ 4.5 พันล้านกิโลเมตร"
      }
    ]
  },
  4: {
    id: 4,
    title: "ดวงจันทร์และดาวเทียม",
    description: "เรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมของดาวเคราะห์",
    thumbnail: "🌙",
    difficulty: 'medium',
    estimatedTime: "30 นาที",
    prerequisites: [3],
    totalStars: 3,
    rewards: {
      stars: 3,
      points: 250,
      badges: ["moon-explorer"],
      unlocksStages: [5]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "สวัสดีอีกครั้ง! วันนี้เราจะมาเรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมต่างๆ กัน",
      learningContent: "ดวงจันทร์คือดาวเทียมธรรมชาติของโลก และดาวเคราะห์อื่นๆ ก็มีดาวเทียมของตัวเองมากมาย เรามาศึกษาความน่าสนใจของพวกมันกัน",
      completionMessage: "ยอดเยี่ยม! คุณได้เรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมแล้ว ตอนนี้คุณพร้อมที่จะสำรวจดาวหางแล้ว!"
    },
    questions: [
      {
        id: 1,
        question: "ดวงจันทร์โคจรรอบโลกใช้เวลากี่วัน?",
        difficulty: 'medium',
        points: 15,
        answers: [
          { id: 1, text: "27 วัน", isCorrect: true },
          { id: 2, text: "30 วัน", isCorrect: false },
          { id: 3, text: "365 วัน", isCorrect: false },
          { id: 4, text: "14 วัน", isCorrect: false },
        ],
        explanation: "ดวงจันทร์โคจรรอบโลกหนึ่งรอบใช้เวลาประมาณ 27.3 วัน เรียกว่าเดือนดาราจันทร์"
      },
      {
        id: 2,
        question: "ดาวเทียมของดาวพฤหัสบดีที่ใหญ่ที่สุดชื่อว่าอะไร?",
        difficulty: 'hard',
        points: 20,
        answers: [
          { id: 1, text: "ยูโรปา", isCorrect: false },
          { id: 2, text: "แกนีมีด", isCorrect: true },
          { id: 3, text: "ไอโอ", isCorrect: false },
          { id: 4, text: "คาลลิสโต", isCorrect: false },
        ],
        explanation: "แกนีมีด (Ganymede) เป็นดาวเทียมที่ใหญ่ที่สุดในระบบสุริยะ และเป็นดาวเทียมของดาวพฤหัสบดี"
      },
      {
        id: 3,
        question: "ดาวเทียมของดาวเสาร์ที่มีบรรยากาศหนาแน่นชื่อว่าอะไร?",
        difficulty: 'hard',
        points: 20,
        answers: [
          { id: 1, text: "ไททัน", isCorrect: true },
          { id: 2, text: "เอนเซลาดัส", isCorrect: false },
          { id: 3, text: "มีมาส", isCorrect: false },
          { id: 4, text: "ไฮเปอเรียน", isCorrect: false },
        ],
        explanation: "ไททัน (Titan) เป็นดาวเทียมของดาวเสาร์ที่มีบรรยากาศหนาแน่นและมีทะเลสาบของไฮโดรคาร์บอน"
      }
    ]
  },
  5: {
    id: 5,
    title: "ดาวหางและดาวเคราะห์น้อย",
    description: "สำรวจดาวหาง ดาวตก และดาวเคราะห์น้อยในระบบสุริยะ",
    thumbnail: "☄️",
    difficulty: 'hard',
    estimatedTime: "35 นาที",
    prerequisites: [4],
    totalStars: 3,
    rewards: {
      stars: 3,
      points: 300,
      badges: ["comet-hunter", "solar-system-master"],
      unlocksStages: []
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "ยินดีด้วย! นี่คือด่านสุดท้ายแล้ว เรามาเรียนรู้เกี่ยวกับดาวหางและวัตถุอวกาศอื่นๆ กัน",
      learningContent: "ดาวหาง ดาวตก และดาวเคราะห์น้อยเป็นวัตถุที่น่าสนใจในระบบสุริยะ พวกมันบอกเล่าประวัติศาสตร์การเกิดขึ้นของระบบสุริยะ",
      completionMessage: "ยอดเยี่ยมมาก! คุณผ่านการเรียนรู้ทั้งหมดแล้ว คุณเป็นผู้เชี่ยวชาญด้านดาราศาสตร์แล้ว!"
    },
    questions: [
      {
        id: 1,
        question: "ดาวหางส่วนใหญ่มาจากบริเวณใดของระบบสุริยะ?",
        difficulty: 'hard',
        points: 20,
        answers: [
          { id: 1, text: "เข็มขัดดาวเคราะห์น้อย", isCorrect: false },
          { id: 2, text: "เมฆออร์ต", isCorrect: true },
          { id: 3, text: "เข็มขัดไคเปอร์", isCorrect: false },
          { id: 4, text: "บริเวณดาวพฤหัสบดี", isCorrect: false },
        ],
        explanation: "ดาวหางส่วนใหญ่มาจากเมฆออร์ต (Oort Cloud) ซึ่งเป็นบริเวณที่อยู่ไกลจากดวงอาทิตย์มาก"
      },
      {
        id: 2,
        question: "ดาวเคราะห์น้อยที่ใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อยชื่อว่าอะไร?",
        difficulty: 'hard',
        points: 20,
        answers: [
          { id: 1, text: "วันเวสตา", isCorrect: false },
          { id: 2, text: "ปัลลาส", isCorrect: false },
          { id: 3, text: "เซเรส", isCorrect: true },
          { id: 4, text: "จูโน", isCorrect: false },
        ],
        explanation: "เซเรส (Ceres) เป็นดาวเคราะห์น้อยที่ใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อย และจัดอยู่ในประเภทดาวเคราะห์แคระ"
      },
      {
        id: 3,
        question: "ฝนดาวตกเกิดขึ้นเมื่อใด?",
        difficulty: 'medium',
        points: 15,
        answers: [
          { id: 1, text: "เมื่อโลกผ่านเศษซากของดาวหาง", isCorrect: true },
          { id: 2, text: "เมื่อดาวหางชนโลก", isCorrect: false },
          { id: 3, text: "เมื่อดาวเคราะห์น้อยระเบิด", isCorrect: false },
          { id: 4, text: "เมื่อดาวดวงใดดวงหนึ่งระเบิด", isCorrect: false },
        ],
        explanation: "ฝนดาวตกเกิดขึ้นเมื่อโลกโคจรผ่านเศษซากที่ดาวหางทิ้งไว้ในวงโคจร เศษซากจะเข้าสู่ชั้นบรรยากาศและไหม้เป็นดาวตก"
      }
    ]
  }
};
