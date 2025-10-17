import { Stage, StageData, Question } from '../types/stage';

// Mock data for fallback when API is unavailable
export const stages: Record<number, {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  prerequisites: number[];
  totalStars: number;
  xpReward: number;
  streakBonus: boolean;
  healthSystem: boolean;
  rewards: any;
  character: {
    name: string;
    avatar: string;
    introduction: string;
    learningContent: string;
    completionMessage: string;
    encouragements: string[];
    hints: string[];
  };
  questions: Array<{
    id: number;
    type: "MULTIPLE_CHOICE" | "DRAG_DROP" | "FILL_BLANK" | "MATCHING" | "TRUE_FALSE";
    question: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    points: number;
    timeLimit: number;
    image?: string; // เพิ่มฟิลด์สำหรับรูปภาพประกอบ
    payload: any;
    explanation: string;
    funFact: string;
  }>;
}> = {
  1: {
    id: 1,
    title: "การรู้จักระบบสุริยะ - Multiple Choice Challenge",
    description: "เรียนรู้พื้นฐานของระบบสุริยะด้วยคำถามปรนัย",
    thumbnail: "☀️",
    difficulty: 'Easy',
    estimatedTime: "15 นาที",
    prerequisites: [],
    totalStars: 3,
    xpReward: 50,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 100,
      xp: 50,
      gems: 5,
      badges: ["solar-system-beginner"],
      unlocksStages: [2],
      achievementUnlocks: ["first-stage-complete"]
    },
    character: {
      name: "ดร.อาร์ตี้",
      avatar: "👨‍🚀",
      introduction: "🚀 สวัสดีครับ! ผมคือดร.อาร์ตี้ จะพาไปสำรวจจักรวาลกัน! ⭐",
      learningContent: "🎯 ด่านแรก: รู้จักระบบสุริยะ! \n\n☀️ เรียนรู้เกี่ยวกับดวงอาทิตย์และดาวเคราะห์ 8 ดวง\n🪐 ทำความเข้าใจลำดับและลักษณะของดาวเคราะห์\n🌟 ค้นพบข้อเท็จจริงน่าสนใจ",
      completionMessage: "🎉 ยอดเยี่ยม! คุณผ่านด่านแรกแล้ว!",
      encouragements: [
        "🔥 เก่งมาก! ไปต่อได้เลย! 🌟",
        "⚡ สุดยอด! ความรู้เยี่ยม! 🚀",
        "💫 ยอดเยี่ยม! คุณเป็นนักดาราศาสตร์! 🎯",
        "🌈 เก่งสุดๆ! เก็บประสบการณ์ได้! 👑"
      ],
      hints: [
        "🤔 ลองนึกถึงลำดับดาวเคราะห์จากดวงอาทิตย์ ☀️",
        "🌡️ ดาวไหนร้อนที่สุด? ใกล้ดวงอาทิตย์หรือเปล่า? 🔥",
        "🔍 ขนาดของดาวเคราะห์เป็นอย่างไร? 📏"
      ]
    },
    questions: [
      {
        id: 1,
        type: "MULTIPLE_CHOICE",
        question: "ระบบสุริยะของเรามีดาวเคราะห์ทั้งหมดกี่ดวง?",
        difficulty: 'Easy',
        points: 10,
        timeLimit: 30,
        image: "/images/stage/solar-system.png", // เพิ่มรูประบบสุริยะ
        payload: [
          { id: 1, text: "7 ดวง", emoji: "🌕", isCorrect: false },
          { id: 2, text: "8 ดวง", emoji: "🪐", isCorrect: true },
          { id: 3, text: "9 ดวง", emoji: "⭐", isCorrect: false },
          { id: 4, text: "10 ดวง", emoji: "🌟", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! ระบบสุริยะมีดาวเคราะห์ 8 ดวง ตั้งแต่พลูโตถูกจัดประเภทใหม่เป็นดาวเคราะห์แคระ",
        funFact: "🪐 พลูโตถูกค้นพบเมื่อปี 1930 แต่ถูกจัดเป็นดาวเคราะห์แคระในปี 2006!"
      },
      {
        id: 2,
        type: "MULTIPLE_CHOICE",
        question: "ดาวเคราะห์ใดอยู่ใกล้ดวงอาทิตย์ที่สุด?",
        difficulty: 'Medium',
        points: 15,
        timeLimit: 25,
        image: "/images/stage/venus.jpg", // เพิ่มรูปดาวศุกร์
        payload: [
          { id: 1, text: "ดาวศุกร์", emoji: "♀️", isCorrect: false },
          { id: 2, text: "ดาวพุธ", emoji: "☿️", isCorrect: true },
          { id: 3, text: "โลก", emoji: "🌍", isCorrect: false },
          { id: 4, text: "ดาวอังคาร", emoji: "♂️", isCorrect: false }
        ],
        explanation: "🎯 ใช่แล้ว! ดาวพุธเป็นดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุด ทำให้มีอุณหภูมิสูงมาก",
        funFact: "🔥 ดาวพุธมีอุณหภูมิกลางวันสูงถึง 427°C แต่กลางคืนหนาวถึง -173°C!"
      },
      {
        id: 3,
        type: "MULTIPLE_CHOICE",
        question: "ดาวเคราะห์ใดมีขนาดใหญ่ที่สุดในระบบสุริยะ?",
        difficulty: 'Easy',
        points: 10,
        timeLimit: 30,
        image: "/images/stage/saturn.jpg", // เพิ่มรูปดาวเสาร์
        payload: [
          { id: 1, text: "ดาวเสาร์", emoji: "🪐", isCorrect: false },
          { id: 2, text: "ดาวพฤหัสบดี", emoji: "🌌", isCorrect: true },
          { id: 3, text: "ดาวยูเรนัส", emoji: "🔵", isCorrect: false },
          { id: 4, text: "ดาวเนปจูน", emoji: "💙", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! ดาวพฤหัสบดีใหญ่ที่สุด มีมวลมากกว่าดาวเคราะห์อื่นรวมกันทั้งหมด",
        funFact: "🌪️ ดาวพฤหัสบดีมีพายุที่ใหญ่กว่าโลกทั้งดวง เรียกว่า Great Red Spot!"
      },
      {
        id: 4,
        type: "MULTIPLE_CHOICE",
        question: "ดาวเคราะห์ใดมีวงแหวนที่สวยงามที่สุด?",
        difficulty: 'Easy',
        points: 10,
        timeLimit: 30,
        image: "/images/stage/saturn.jpg", // เพิ่มรูปดาวเสาร์
        payload: [
          { id: 1, text: "ดาวพฤหัสบดี", emoji: "🌌", isCorrect: false },
          { id: 2, text: "ดาวเสาร์", emoji: "🪐", isCorrect: true },
          { id: 3, text: "ดาวยูเรนัส", emoji: "🔵", isCorrect: false },
          { id: 4, text: "ดาวเนปจูน", emoji: "💙", isCorrect: false }
        ],
        explanation: "🎯 ใช่แล้ว! ดาวเสาร์มีวงแหวนที่สวยงามและมองเห็นได้ชัดที่สุด",
        funFact: "💍 วงแหวนของดาวเสาร์ประกอบด้วยน้ำแข็งและหินเล็กๆ นับล้านชิ้น!"
      },
      {
        id: 5,
        type: "MULTIPLE_CHOICE",
        question: "ดวงอาทิตย์เป็นดาวประเภทใด?",
        difficulty: 'Easy',
        points: 10,
        timeLimit: 30,
        image: "/images/stage/solar-system.png", // เพิ่มรูประบบสุริยะ
        payload: [
          { id: 1, text: "ดาวเคราะห์", emoji: "🪐", isCorrect: false },
          { id: 2, text: "ดาวฤกษ์", emoji: "⭐", isCorrect: true },
          { id: 3, text: "ดาวเทียม", emoji: "🌙", isCorrect: false },
          { id: 4, text: "ดาวหาง", emoji: "☄️", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! ดวงอาทิตย์เป็นดาวฤกษ์ที่ผลิตแสงและความร้อนเอง",
        funFact: "☄️ หางดาวหางมักจะชี้ออกจากดวงอาทิตย์เสมอ ไม่ใช่ตามทิศทางที่เคลื่อนที่!"
      }
    ]
  },

  2: {
    id: 2,
    title: "ดาวเคราะห์ในระบบภายใน - Drag & Drop Challenge",
    description: "สำรวจดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ด้วยการลากและวาง",
    thumbnail: "🌍",
    difficulty: 'Easy',
    estimatedTime: "15 นาที",
    prerequisites: [1],
    totalStars: 3,
    xpReward: 60,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 120,
      xp: 60,
      gems: 8,
      badges: ["inner-planets-explorer"],
      unlocksStages: [3],
      achievementUnlocks: ["solar-system-explorer"]
    },
    character: {
      name: "นักสำรวจอวกาศ",
      avatar: "🚀",
      introduction: "🌍 ยินดีต้อนรับสู่ด่าน Drag & Drop! มาสำรวจดาวเคราะห์ภายในกัน! 🪐",
      learningContent: "🎯 ด่านที่ 2: จับคู่ดาวเคราะห์กับลักษณะเฉพาะ! \n\n🌍 เรียนรู้เกี่ยวกับดาวเคราะห์ 4 ดวงภายใน\n🌡️ ทำความเข้าใจอุณหภูมิและระยะห่าง\n🔍 จดจำลักษณะพิเศษของแต่ละดาว",
      completionMessage: "🎉 ยอดเยี่ยม! คุณผ่านด่าน Drag & Drop แล้ว!",
      encouragements: [
        "🔥 เก่งมาก! จับคู่ถูกต้อง! 🌟",
        "⚡ สุดยอด! ความรู้ดาวเคราะห์เยี่ยม! 🚀",
        "💫 ยอดเยี่ยม! คุณคือนักดาราศาสตร์ตัวจริง! 🎯",
        "🌈 เก่งสุดๆ! ไปต่อได้เลย! 👑"
      ],
      hints: [
        "🤔 ลองคิดถึงระยะห่างจากดวงอาทิตย์ ☀️",
        "🌡️ ดาวไหนร้อนที่สุด? เย็นที่สุด? 🔥❄️",
        "🔍 สีและขนาดของดาวเป็นอย่างไร? 🎨"
      ]
    },
    questions: [
      {
        id: 1,
        type: "DRAG_DROP",
        question: "จับคู่ดาวเคราะห์กับลักษณะเฉพาะของมัน",
        difficulty: 'Easy',
        points: 15,
        timeLimit: 45,
        payload: {
          dragItems: [
            { id: "1", text: "ดาวที่ใกล้ดวงอาทิตย์ที่สุด", emoji: "🔥" },
            { id: "2", text: "ดาวที่ร้อนที่สุดในระบบสุริยะ", emoji: "♨️" },
            { id: "3", text: "ดาวเคราะห์เดียวที่มีชีวิต", emoji: "🌱" },
            { id: "4", text: "ดาวสีแดงที่มีภูเขาไฟสูงที่สุด", emoji: "🏔️" }
          ],
          dropZones: [
            { id: 1, label: "ดาวพุธ ☿️" },
            { id: 2, label: "ดาวศุกร์ ♀️" },
            { id: 3, label: "โลก 🌍" },
            { id: 4, label: "ดาวอังคาร ♂️" }
          ],
          correctMatches: [
            { dragItemId: "1", dropZoneId: 1 },
            { dragItemId: "2", dropZoneId: 2 },
            { dragItemId: "3", dropZoneId: 3 },
            { dragItemId: "4", dropZoneId: 4 }
          ]
        },
        explanation: "🎯 ถูกต้อง! ดาวพุธใกล้ดวงอาทิตย์ที่สุด ดาวศุกร์ร้อนที่สุด โลกมีชีวิต และดาวอังคารมีภูเขาไฟโอลิมปัส มอนส์",
        funFact: "🌋 ภูเขาไฟโอลิมปัส มอนส์ บนดาวอังคารสูง 21 กม. เทียบกับเอเวอเรสต์เพียง 8.8 กม.!"
      }
    ]
  },

  3: {
    id: 3,
    title: "ดาวเคราะห์ยักษ์แก๊ส - Multiple Choice Expert",
    description: "เรียนรู้เกี่ยวกับดาวพฤหัสบดี เสาร์ ยูเรนัส และเนปจูน",
    thumbnail: "🪐",
    difficulty: 'Medium',
    estimatedTime: "20 นาที",
    prerequisites: [2],
    totalStars: 3,
    xpReward: 80,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 150,
      xp: 80,
      gems: 12,
      badges: ["gas-giant-expert"],
      unlocksStages: [4],
      achievementUnlocks: ["outer-system-explorer"]
    },
    character: {
      name: "โปรเฟสเซอร์กาแล็กซี่",
      avatar: "👨‍🔬",
      introduction: "🪐 สวัสดีครับ! มาเรียนรู้เกี่ยวกับดาวยักษ์แก๊สกันเถอะ! ⭐",
      learningContent: "🎯 ด่านที่ 3: ดาวเคราะห์ยักษ์แก๊สมหาศาล! \n\n🪐 ดาวพฤหัสบดีและเสาร์\n🌀 ยูเรนัสและเนปจูน\n💫 วงแหวนและดวงจันทร์มากมาย",
      completionMessage: "🎉 ยอดเยี่ยม! คุณเป็นผู้เชี่ยวชาญดาวยักษ์แก๊สแล้ว!",
      encouragements: [
        "🔥 เจ๋งสุดๆ! ความรู้ระดับโปร! 🌟",
        "⚡ สุดยอด! ดาวยักษ์ยอมรับความเก่ง! 🪐",
        "💫 ยอดเยี่ยม! นักดาราศาสตร์ระดับต้น! 🎯"
      ],
      hints: [
        "🤔 ดาวไหนมีวงแหวนสวยที่สุด? 💍",
        "🌀 ดาวไหนหมุนตะแคงข้าง? 🔄",
        "⭐ ดาวไหนใหญ่ที่สุดในระบบสุริยะ? 📏"
      ]
    },
    questions: [
      {
        id: 1,
        type: "MULTIPLE_CHOICE",
        question: "ดาวเคราะห์ใดใหญ่ที่สุดในระบบสุริยะ?",
        difficulty: 'Medium',
        points: 20,
        timeLimit: 30,
        payload: [
          { id: 1, text: "ดาวเสาร์", emoji: "🪐", isCorrect: false },
          { id: 2, text: "ดาวพฤหัสบดี", emoji: "🌌", isCorrect: true },
          { id: 3, text: "ดาวยูเรนัส", emoji: "🔵", isCorrect: false },
          { id: 4, text: "ดาวเนปจูน", emoji: "💙", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! ดาวพฤหัสบดีใหญ่ที่สุด มีมวลมากกว่าดาวเคราะห์อื่นรวมกันทั้งหมด!",
        funFact: "🌪️ ดาวพฤหัสบดีมีพายุที่ใหญ่กว่าโลกทั้งดวง เรียกว่า Great Red Spot!"
      }
    ]
  },

  4: {
    id: 4,
    title: "ดวงจันทร์และดาวเทียม - True/False Challenge",
    description: "ทดสอบความรู้เกี่ยวกับดวงจันทร์โลกและดาวเทียมธรรมชาติ",
    thumbnail: "🌙",
    difficulty: 'Medium',
    estimatedTime: "18 นาที",
    prerequisites: [3],
    totalStars: 3,
    xpReward: 70,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 140,
      xp: 70,
      gems: 10,
      badges: ["moon-master"],
      unlocksStages: [5],
      achievementUnlocks: ["satellite-specialist"]
    },
    character: {
      name: "ลูน่า",
      avatar: "🌙",
      introduction: "🌙 สวัสดีค่ะ! มาเรียนรู้เกี่ยวกับดวงจันทร์กันเถอะ! ✨",
      learningContent: "🎯 ด่านที่ 4: ดวงจันทร์และดาวเทียมมหัศจรรย์! \n\n🌙 ดวงจันทร์ของโลก\n🪐 ดาวเทียมธรรมชาติ\n🌊 อิทธิพลต่อน้ำขึ้นน้ำลง",
      completionMessage: "🎉 ยอดเยี่ยม! คุณเป็นผู้เชี่ยวชาญดวงจันทร์แล้ว!",
      encouragements: [
        "🔥 เก่งมาก! ความรู้จันทรา! 🌟",
        "⚡ สุดยอด! ดวงจันทร์ภูมิใจ! 🌙",
        "💫 ยอดเยี่ยม! นักดาราศาสตร์จันทรา! 🎯"
      ],
      hints: [
        "🤔 ดวงจันทร์ทำให้เกิดอะไรกับทะเล? 🌊",
        "🌙 ดวงจันทร์โคจรรอบโลกกี่วัน? 📅",
        "✨ ดวงจันทร์มีแสงเองหรือไม่? 💡"
      ]
    },
    questions: [
      {
        id: 1,
        type: "TRUE_FALSE",
        question: "ดวงจันทร์เป็นสาเหตุของน้ำขึ้นน้ำลงบนโลก",
        difficulty: 'Medium',
        points: 15,
        timeLimit: 25,
        payload: {
          correctAnswer: true
        },
        explanation: "🎯 ถูกต้อง! แรงโน้มถวงของดวงจันทร์ดึงมหาสมุทรทำให้เกิดน้ำขึ้นน้ำลง",
        funFact: "🌊 น้ำขึ้นน้ำลงเกิดขึ้นวันละ 2 ครั้ง ตามการโคจรของดวงจันทร์!"
      }
    ]
  },

  5: {
    id: 5,
    title: "ดาวหางและดาวเคราะห์น้อย - Mixed Challenge",
    description: "ทดสอบความรู้ครอบคลุมเกี่ยวกับดาวหางและดาวเคราะห์น้อย",
    thumbnail: "☄️",
    difficulty: 'Hard',
    estimatedTime: "25 นาที",
    prerequisites: [4],
    totalStars: 3,
    xpReward: 100,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 200,
      xp: 100,
      gems: 15,
      badges: ["comet-hunter", "asteroid-expert"],
      unlocksStages: [],
      achievementUnlocks: ["solar-system-master"]
    },
    character: {
      name: "คอสมิค",
      avatar: "☄️",
      introduction: "☄️ สวัสดีครับ! มาท้าทายด่านสุดท้ายกันเถอะ! 🌌",
      learningContent: "🎯 ด่านที่ 5: ดาวหางและดาวเคราะห์น้อยลึกลับ! \n\n☄️ ดาวหางและหางที่สวยงาม\n🪨 ดาวเคราะห์น้อยในเข็มขัด\n💥 อุกกาบาตที่ตกโลก",
      completionMessage: "🎉 ยิ่งใหญ่มาก! คุณเป็นมาสเตอร์ระบบสุริยะแล้ว!",
      encouragements: [
        "🔥 เทพมาก! ระดับกูรู! 🌟",
        "⚡ สุดยอด! จักรวาลยกย่อง! ☄️",
        "💫 ยอดเยี่ยม! มาสเตอร์แห่งอวกาศ! 🎯"
      ],
      hints: [
        "🤔 ดาวหางมาจากไหนของระบบสุริยะ? ❄️",
        "🪨 ดาวเคราะห์น้อยส่วนใหญ่อยู่ที่ไหน? 🌌",
        "💥 อุกกาบาตคืออะไรที่ตกถึงพื้นโลก? 🌍"
      ]
    },
    questions: [
      {
        id: 1,
        type: "MULTIPLE_CHOICE",
        question: "ดาวหางส่วนใหญ่มาจากบริเวณใดของระบบสุริยะ?",
        difficulty: 'Hard',
        points: 25,
        timeLimit: 35,
        image: "/images/stage/comet.jpg", // เพิ่มรูปดาวหาง
        payload: [
          { id: 1, text: "เข็มขัดดาวเคราะห์น้อย", emoji: "🪨", isCorrect: false },
          { id: 2, text: "เมฆออร์ต", emoji: "☁️", isCorrect: true },
          { id: 3, text: "วงแหวนของเสาร์", emoji: "🪐", isCorrect: false },
          { id: 4, text: "บรรยากาศของดาวพฤหัส", emoji: "🌪️", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! เมฆออร์ตคือบริเวณรอบนอกระบบสุริยะที่มีดาวหางมากมาย",
        funFact: "☄️ ดาวหางฮัลเลย์โคจรรอบดวงอาทิตย์ครั้งละ 76 ปี จะกลับมาใหม่ในปี 2061!"
      },
      {
        id: 2,
        type: "MULTIPLE_CHOICE",
        question: "ดาวเคราะห์น้อยส่วนใหญ่อยู่ในบริเวณใดของระบบสุริยะ?",
        difficulty: 'Hard',
        points: 25,
        timeLimit: 35,
        image: "/images/stage/asteroid_belt.jpg", // เพิ่มรูปเข็มขัดดาวเคราะห์น้อย
        payload: [
          { id: 1, text: "ระหว่างดาวอังคารและดาวพฤหัสบดี", emoji: "🔴", isCorrect: true },
          { id: 2, text: "ระหว่างโลกและดาวอังคาร", emoji: "🌍", isCorrect: false },
          { id: 3, text: "ระหว่างดาวเสาร์และดาวยูเรนัส", emoji: "🪐", isCorrect: false },
          { id: 4, text: "รอบนอกดาวเนปจูน", emoji: "💙", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! เข็มขัดดาวเคราะห์น้อยอยู่ระหว่างดาวอังคารและดาวพฤหัสบดี",
        funFact: "🪨 เซเรสเป็นดาวเคราะห์แคระที่ใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อย!"
      },
      {
        id: 3,
        type: "MULTIPLE_CHOICE",
        question: "อุกกาบาตคือสิ่งใด?",
        difficulty: 'Medium',
        points: 20,
        timeLimit: 30,
        image: "/images/stage/meteor_shower.jpg", // เพิ่มรูปฝนดาวตก
        payload: [
          { id: 1, text: "หินอวกาศที่ตกถึงพื้นโลก", emoji: "🪨", isCorrect: true },
          { id: 2, text: "ดาวเคราะห์น้อยในอวกาศ", emoji: "☄️", isCorrect: false },
          { id: 3, text: "แสงจากดาวหาง", emoji: "✨", isCorrect: false },
          { id: 4, text: "ส่วนหนึ่งของดาวเทียม", emoji: "🛰️", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! อุกกาบาตคือหินอวกาศที่ผ่านชั้นบรรยากาศและตกถึงพื้นโลก",
        funFact: "💥 อุกกาบาตส่วนใหญ่มีขนาดเล็กมาก แต่บางก้อนใหญ่พอที่จะสร้างหลุมอุกกาบาต!"
      },
      {
        id: 4,
        type: "MULTIPLE_CHOICE",
        question: "ดาวเคราะห์แคระ 'เซเรส' อยู่ที่ไหน?",
        difficulty: 'Hard',
        points: 25,
        timeLimit: 35,
        image: "/images/stage/ceres.jpg", // เพิ่มรูปเซเรส
        payload: [
          { id: 1, text: "เข็มขัดไคเปอร์", emoji: "❄️", isCorrect: false },
          { id: 2, text: "เข็มขัดดาวเคราะห์น้อย", emoji: "🪨", isCorrect: true },
          { id: 3, text: "เมฆออร์ต", emoji: "☁️", isCorrect: false },
          { id: 4, text: "ระหว่างดาวเนปจูนและพลูโต", emoji: "🌌", isCorrect: false }
        ],
        explanation: "🎯 ถูกต้อง! เซเรสเป็นดาวเคราะห์แคระที่อยู่ในเข็มขัดดาวเคราะห์น้อย",
        funFact: "🔍 เซเรสเป็นดาวเคราะห์แคระดวงแรกที่ถูกค้นพบ และใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อย!"
      },
      {
        id: 5,
        type: "TRUE_FALSE",
        question: "ดาวหางทุกดวงมีหางเสมอ",
        difficulty: 'Medium',
        points: 20,
        timeLimit: 25,
        image: "/images/stage/oort.jpg", // เพิ่มรูปเมฆออร์ต
        payload: {
          correctAnswer: false
        },
        explanation: "🎯 ผิด! ดาวหางจะมีหางเฉพาะเมื่ออยู่ใกล้ดวงอาทิตย์ ความร้อนทำให้น้ำแข็งและแก๊สระเหยออกมา",
        funFact: "❄️ เมื่อดาวหางอยู่ไกลจากดวงอาทิตย์ มันจะเป็นเพียงก้อนน้ำแข็งและหินโดยไม่มีหาง!"
      }
    ]
  }
};