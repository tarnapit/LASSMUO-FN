import { MiniGame, Planet, QuizQuestion } from '../types/game';

export const miniGames: MiniGame[] = [
  {
    id: 'planet-match',
    title: 'จับคู่ดาวเคราะห์',
    description: 'จับคู่ดาวเคราะห์กับข้อเท็จจริงที่ถูกต้อง',
    thumbnail: '🪐',
    difficulty: 'Easy',
    category: 'Memory',
    estimatedTime: '5 นาที',
    points: 100
  },
  {
    id: 'solar-quiz',
    title: 'แบบทดสอบระบบสุริยะ',
    description: 'ทดสอบความรู้เกี่ยวกับระบบสุริยะ',
    thumbnail: '☀️',
    difficulty: 'Medium',
    category: 'Knowledge',
    estimatedTime: '10 นาที',
    points: 200
  },
  {
    id: 'space-memory',
    title: 'เกมจำภาพอวกาศ',
    description: 'จำตำแหน่งของวัตถุท้องฟ้าต่างๆ',
    thumbnail: '🌌',
    difficulty: 'Hard',
    category: 'Memory',
    estimatedTime: '8 นาที',
    points: 300
  },
  {
    id: 'planet-order',
    title: 'เรียงลำดับดาวเคราะห์',
    description: 'เรียงลำดับดาวเคราะห์จากใกล้ดวงอาทิตย์',
    thumbnail: '🌍',
    difficulty: 'Easy',
    category: 'Puzzle',
    estimatedTime: '3 นาที',
    points: 150
  }
];

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'ดาวพุธ',
    nameEn: 'Mercury',
    color: '#8C7853',
    size: 'small',
    facts: [
      'ดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุด',
      'มีอุณหภูมิสูงถึง 427°C',
      'ไม่มีชั้นบรรยากาศ'
    ]
  },
  {
    id: 'venus',
    name: 'ดาวศุกร์',
    nameEn: 'Venus',
    color: '#FFC649',
    size: 'medium',
    facts: [
      'ดาวเคราะห์ที่ร้อนที่สุดในระบบสุริยะ',
      'หมุนรอบตัวเองในทิศทางตรงข้าม',
      'เรียกว่าดาวประจำรุ่ง'
    ]
  },
  {
    id: 'earth',
    name: 'โลก',
    nameEn: 'Earth',
    color: '#6B93D6',
    size: 'medium',
    facts: [
      'ดาวเคราะห์เดียวที่มีชีวิต',
      'มีน้ำในสถานะของเหลว',
      'มีชั้นบรรยากาศที่เหมาะสม'
    ]
  },
  {
    id: 'mars',
    name: 'ดาวอังคาร',
    nameEn: 'Mars',
    color: '#C1440E',
    size: 'small',
    facts: [
      'เรียกว่าดาวเคราะห์สีแดง',
      'มีขั้วโลกเหมือนโลก',
      'มีภูเขาไฟที่ใหญ่ที่สุดในระบบสุริยะ'
    ]
  },
  {
    id: 'jupiter',
    name: 'ดาวพฤหัสบดี',
    nameEn: 'Jupiter',
    color: '#D8CA9D',
    size: 'large',
    facts: [
      'ดาวเคราะห์ที่ใหญ่ที่สุด',
      'มีจุดแดงใหญ่ที่เป็นพายุ',
      'มีดวงจันทร์มากกว่า 70 ดวง'
    ]
  },
  {
    id: 'saturn',
    name: 'ดาวเสาร์',
    nameEn: 'Saturn',
    color: '#FAD5A5',
    size: 'large',
    facts: [
      'มีวงแหวนที่สวยงาม',
      'ความหนาแน่นน้อยกว่าน้ำ',
      'มีดวงจันทร์ไททันที่มีบรรยากาศ'
    ]
  },
  {
    id: 'uranus',
    name: 'ดาวยูเรนัส',
    nameEn: 'Uranus',
    color: '#4FD0E3',
    size: 'large',
    facts: [
      'หมุนรอบตัวเองในแนวข้าง',
      'มีวงแหวนที่มองไม่เห็นง่าย',
      'อุณหภูมิเฉลี่ย -195°C'
    ]
  },
  {
    id: 'neptune',
    name: 'ดาวเนปจูน',
    nameEn: 'Neptune',
    color: '#4B70DD',
    size: 'large',
    facts: [
      'ดาวเคราะห์ที่ไกลที่สุด',
      'มีลมที่เร็วที่สุดในระบบสุริยะ',
      'ค้นพบโดยการคำนวณทางคณิตศาสตร์'
    ]
  }
];

export const solarQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'ดาวเคราะห์ดวงใดที่ใกล้ดวงอาทิตย์ที่สุด?',
    options: ['ดาวพุธ', 'ดาวศุกร์', 'โลก', 'ดาวอังคาร'],
    correctAnswer: 0,
    explanation: 'ดาวพุธเป็นดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุด ห่างออกไปประมาณ 58 ล้านกิโลเมตร'
  },
  {
    id: 'q2',
    question: 'ดาวเคราะห์ดวงใดที่มีขนาดใหญ่ที่สุดในระบบสุริยะ?',
    options: ['ดาวเสาร์', 'ดาวพฤหัสบดี', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
    correctAnswer: 1,
    explanation: 'ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุด มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกันทั้งหมด'
  },
  {
    id: 'q3',
    question: 'ดาวเคราะห์ดวงใดที่เรียกว่า "ดาวเคราะห์สีแดง"?',
    options: ['ดาวศุกร์', 'ดาวอังคาร', 'ดาวพฤหัสบดี', 'ดาวเสาร์'],
    correctAnswer: 1,
    explanation: 'ดาวอังคารเรียกว่าดาวเคราะห์สีแดงเพราะมีธาตุเหล็กออกไซด์บนผิวหน้า'
  },
  {
    id: 'q4',
    question: 'ดาวเคราะห์ดวงใดที่มีวงแหวนที่สวยงาม?',
    options: ['ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
    correctAnswer: 1,
    explanation: 'ดาวเสาร์มีวงแหวนที่สวยงามและเห็นได้ชัดเจนที่สุด ประกอบด้วยอนุภาคน้ำแข็งและหิน'
  },
  {
    id: 'q5',
    question: 'ดาวเคราะห์ดวงใดที่ร้อนที่สุดในระบบสุริยะ?',
    options: ['ดาวพุธ', 'ดาวศุกร์', 'โลก', 'ดาวอังคาร'],
    correctAnswer: 1,
    explanation: 'ดาวศุกร์ร้อนที่สุดเพราะมีชั้นบรรยากาศหนาทึบที่กักเก็บความร้อน'
  }
];

export const getMiniGameById = (id: string): MiniGame | undefined => {
  return miniGames.find(game => game.id === id);
};

export const getPlanetById = (id: string): Planet | undefined => {
  return planets.find(planet => planet.id === id);
};
