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
    xpReward: 50,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 100,
      xp: 50,
      gems: 5,
      badges: ["solar-explorer"],
      unlocksStages: [2],
      achievementUnlocks: ["first-steps"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "สวัสดี! ฉันชื่อซิกโก้ นักสำรวจอวกาศ วันนี้เราจะมาเรียนรู้เกี่ยวกับระบบสุริยะกัน!",
      learningContent: "ระบบสุริยะของเราประกอบด้วยดวงอาทิตย์และดาวเคราะห์ 8 ดวง แต่ละดวงมีความพิเศษและลักษณะเฉพาะของตัวเอง มาเรียนรู้ไปพร้อมกันเถอะ!",
      completionMessage: "ยอดเยี่ยม! คุณได้เรียนรู้เกี่ยวกับระบบสุริยะเรียบร้อยแล้ว ตอนนี้คุณสามารถสำรวจดาวเคราะห์ในระบบภายในได้แล้ว!",
      encouragements: [
        "เยี่ยมมาก! 🌟",
        "ถูกต้องแล้ว! 🎉",
        "ยอดเยี่ยม! 🚀",
        "เก่งมาก! ⭐"
      ],
      hints: [
        "ลองดูจำนวนดาวเคราะห์ในระบบสุริยะสิ 🤔",
        "คิดถึงดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุด 🌞",
        "ดาวเคราะห์ดวงไหนที่ใหญ่ที่สุดนะ? 🪐"
      ]
    },
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "ระบบสุริยะของเรามีดาวเคราะห์ทั้งหมดกี่ดวง?",
        difficulty: 'easy',
        points: 10,
        timeLimit: 30,
        image: "solar-system.jpg",
        animation: "planet-count",
        answers: [
          { id: 1, text: "6 ดวง", isCorrect: false, emoji: "6️⃣" },
          { id: 2, text: "7 ดวง", isCorrect: false, emoji: "7️⃣" },
          { id: 3, text: "8 ดวง", isCorrect: true, emoji: "8️⃣" },
          { id: 4, text: "9 ดวง", isCorrect: false, emoji: "9️⃣" },
        ],
        explanation: "ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง ได้แก่ ดาวพุธ ดาวศุกร์ โลก ดาวอังคาร ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน",
        funFact: "💡 ดาวพลูโตเคยเป็นดาวเคราะห์ดวงที่ 9 แต่ถูกจัดเป็นดาวเคราะห์แคระในปี 2006!"
      },
      {
        id: 2,
        type: "drag-drop",
        question: "ลากดาวเคราะห์ต่อไปนี้ไปยังตำแหน่งที่ถูกต้องตามลำดับจากดวงอาทิตย์",
        difficulty: 'easy',
        points: 15,
        timeLimit: 45,
        dragItems: [
          { id: "mercury", text: "ดาวพุธ", emoji: "☿️", correctPosition: 1 },
          { id: "venus", text: "ดาวศุกร์", emoji: "♀️", correctPosition: 2 },
          { id: "earth", text: "โลก", emoji: "🌍", correctPosition: 3 },
          { id: "mars", text: "ดาวอังคาร", emoji: "♂️", correctPosition: 4 }
        ],
        dropZones: [
          { id: 1, label: "ใกล้ที่สุด" },
          { id: 2, label: "ที่ 2" },
          { id: 3, label: "ที่ 3" },
          { id: 4, label: "ที่ 4" }
        ],
        explanation: "ลำดับดาวเคราะห์จากดวงอาทิตย์: ดาวพุธ → ดาวศุกร์ → โลก → ดาวอังคาร",
        funFact: "🌟 วิธีจำง่ายๆ: 'พุธ ศุกร์ โลก อังคาร พฤหัส เสาร์ ยูเรนัส เนปจูน'"
      },
      {
        id: 3,
        type: "fill-blank",
        question: "ดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะคือ ___________",
        difficulty: 'medium',
        points: 20,
        timeLimit: 25,
        correctAnswer: "ดาวพฤหัสบดี",
        alternatives: ["พฤหัสบดี", "Jupiter", "jupiter"],
        placeholder: "พิมพ์ชื่อดาวเคราะห์...",
        hints: ["เป็นดาวเคราะห์แก๊ส", "มีมวลมากกว่าดาวเคราะห์อื่นรวมกัน", "มีดาวเทียมมากมาย"],
        explanation: "ดาวพฤหัสบดี (Jupiter) เป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะ มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกันทั้งหมด",
        funFact: "🪐 ดาวพฤหัสบดีใหญ่มากจนสามารถใส่โลกได้มากกว่า 1,300 ดวง!"
      },
      {
        id: 4,
        type: "match-pairs",
        question: "จับคู่ดาวเคราะห์กับคุณสมบัติเด่นของมัน",
        difficulty: 'medium',
        points: 25,
        timeLimit: 60,
        pairs: [
          { left: { id: "venus", text: "ดาวศุกร์", emoji: "♀️" }, right: { id: "hottest", text: "ร้อนที่สุด", emoji: "🔥" } },
          { left: { id: "mars", text: "ดาวอังคาร", emoji: "♂️" }, right: { id: "red", text: "สีแดง", emoji: "🔴" } },
          { left: { id: "saturn", text: "ดาวเสาร์", emoji: "🪐" }, right: { id: "rings", text: "มีวงแหวน", emoji: "💍" } },
          { left: { id: "earth", text: "โลก", emoji: "🌍" }, right: { id: "life", text: "มีสิ่งมีชีวิต", emoji: "🌱" } }
        ],
        explanation: "แต่ละดาวเคราะห์มีคุณสมบัติเด่นที่แตกต่างกัน ทำให้แต่ละดวงมีเอกลักษณ์เฉพาะตัว",
        funFact: "🌟 ดาวศุกร์ร้อนกว่าดาวพุธแม้จะอยู่ไกลกว่า เพราะมีชั้นบรรยากาศหนาทึบ!"
      },
      {
        id: 5,
        type: "true-false",
        question: "ดวงอาทิตย์เป็นดาวเคราะห์ดวงหนึ่งในระบบสุริยะ",
        difficulty: 'easy',
        points: 10,
        timeLimit: 20,
        correctAnswer: false,
        explanation: "ดวงอาทิตย์ไม่ใช่ดาวเคราะห์ แต่เป็นดาวฤกษ์ที่เป็นศูนย์กลางของระบบสุริยะ ให้แสงสว่างและความร้อนแก่ดาวเคราะห์ทั้งหมด",
        funFact: "☀️ ดวงอาทิตย์มีมวลมากกว่า 99% ของมวลทั้งหมดในระบบสุริยะ!"
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
    xpReward: 75,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 150,
      xp: 75,
      gems: 8,
      badges: ["inner-planet-explorer"],
      unlocksStages: [3],
      achievementUnlocks: ["planet-discoverer"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "ยินดีที่ได้พบกันอีกครั้ง! วันนี้เราจะมาสำรวจดาวเคราะห์ในระบบภายในกัน",
      learningContent: "ดาวเคราะห์ในระบบภายในประกอบด้วย 4 ดวง ได้แก่ ดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ดาวเคราะห์เหล่านี้เป็นดาวเคราะห์หินและอยู่ใกล้ดวงอาทิตย์",
      completionMessage: "เยี่ยมมาก! คุณได้เรียนรู้เกี่ยวกับดาวเคราะห์ในระบบภายในแล้ว ต่อไปมาสำรวจดาวเคราะห์ในระบบภายนอกกัน!",
      encouragements: [
        "สุดยอด! 🌟",
        "เก่งจริงๆ! 🎯",
        "ยอดเยี่ยม! 🚀",
        "ถูกต้อง! 🌍"
      ],
      hints: [
        "ดาวเคราะห์สีแดงคือดาวไหนนะ? 🔴",
        "ดาวใดที่ร้อนที่สุดเอ่ย? 🔥",
        "โลกอยู่ลำดับที่เท่าไหร่จากดวงอาทิตย์? 🌍"
      ]
    },
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "ดาวเคราะห์ดวงใดที่เรียกว่า 'ดาวเคราะห์สีแดง'?",
        difficulty: 'easy',
        points: 10,
        timeLimit: 25,
        image: "red-planet.jpg",
        answers: [
          { id: 1, text: "ดาวศุกร์", isCorrect: false, emoji: "♀️" },
          { id: 2, text: "ดาวอังคาร", isCorrect: true, emoji: "♂️" },
          { id: 3, text: "ดาวพุธ", isCorrect: false, emoji: "☿️" },
          { id: 4, text: "โลก", isCorrect: false, emoji: "🌍" },
        ],
        explanation: "ดาวอังคาร (Mars) เรียกว่าดาวเคราะห์สีแดงเพราะมีธาตุเหล็กออกไซด์บนผิวหน้าที่ทำให้ดูเป็นสีแดง",
        funFact: "🔴 ดาวอังคารมีพายุฝุ่นที่สามารถครอบคลุมดาวเคราะห์ทั้งดวงได้!"
      },
      {
        id: 2,
        type: "fill-blank",
        question: "ดาวเคราะห์ที่ร้อนที่สุดในระบบสุริยะคือ ___________",
        difficulty: 'medium',
        points: 15,
        timeLimit: 30,
        correctAnswer: "ดาวศุกร์",
        alternatives: ["ศุกร์", "Venus", "venus"],
        placeholder: "พิมพ์ชื่อดาวเคราะห์...",
        hints: ["ไม่ใช่ดาวที่ใกล้ดวงอาทิตย์ที่สุด", "มีบรรยากาศหนาทึบ", "เป็นดาวเคราะห์ลำดับที่ 2"],
        explanation: "ดาวศุกร์ (Venus) เป็นดาวเคราะห์ที่ร้อนที่สุดในระบบสุริยะเพราะมีชั้นบรรยากาศหนาทึบที่กักเก็บความร้อน",
        funFact: "🔥 ดาวศุกร์ร้อนถึง 470°C - ร้อนพอที่จะหลอมตะกั่วได้!"
      },
      {
        id: 3,
        type: "drag-drop",
        question: "เรียงลำดับดาวเคราะห์ในระบบภายในจากใกล้ดวงอาทิตย์ที่สุด",
        difficulty: 'easy',
        points: 20,
        timeLimit: 45,
        dragItems: [
          { id: "mercury", text: "ดาวพุธ", emoji: "☿️", correctPosition: 1 },
          { id: "venus", text: "ดาวศุกร์", emoji: "♀️", correctPosition: 2 },
          { id: "earth", text: "โลก", emoji: "🌍", correctPosition: 3 },
          { id: "mars", text: "ดาวอังคาร", emoji: "♂️", correctPosition: 4 }
        ],
        dropZones: [
          { id: 1, label: "ใกล้ที่สุด" },
          { id: 2, label: "ที่ 2" },
          { id: 3, label: "ที่ 3" },
          { id: 4, label: "ไกลที่สุด" }
        ],
        explanation: "ลำดับดาวเคราะห์ในระบบภายใน: ดาวพุธ → ดาวศุกร์ → โลก → ดาวอังคาร",
        funFact: "🌟 ดาวเคราะห์ในระบบภายในเรียกอีกชื่อว่า 'ดาวเคราะห์หิน' เพราะมีพื้นผิวแข็ง!"
      },
      {
        id: 4,
        type: "true-false",
        question: "โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดวงอาทิตย์",
        difficulty: 'easy',
        points: 10,
        timeLimit: 20,
        correctAnswer: true,
        explanation: "ถูกต้อง! โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดวงอาทิตย์ อยู่ในระยะที่เหมาะสมกับการมีชีวิต",
        funFact: "🌍 โลกอยู่ใน 'โซนที่อยู่อาศัยได้' หรือ Goldilocks Zone ที่มีอุณหภูมิพอดีสำหรับน้ำเหลว!"
      },
      {
        id: 5,
        type: "match-pairs",
        question: "จับคู่ดาวเคราะห์กับคุณสมบัติเด่น",
        difficulty: 'medium',
        points: 25,
        timeLimit: 50,
        pairs: [
          { left: { id: "mercury", text: "ดาวพุธ", emoji: "☿️" }, right: { id: "smallest", text: "เล็กที่สุด", emoji: "🤏" } },
          { left: { id: "venus", text: "ดาวศุกร์", emoji: "♀️" }, right: { id: "hottest", text: "ร้อนที่สุด", emoji: "🔥" } },
          { left: { id: "earth", text: "โลก", emoji: "🌍" }, right: { id: "life", text: "มีสิ่งมีชีวิต", emoji: "🌱" } },
          { left: { id: "mars", text: "ดาวอังคาร", emoji: "♂️" }, right: { id: "red", text: "สีแดง", emoji: "🔴" } }
        ],
        explanation: "แต่ละดาวเคราะห์ในระบบภายในมีลักษณะเฉพาะที่แตกต่างกัน",
        funFact: "✨ ดาวพุธมีแกนหมุนที่เอียงน้อยที่สุด ทำให้ไม่มีฤดูกาล!"
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
        type: "multiple-choice",
        question: "ดาวเคราะห์ดวงใดที่มีวงแหวนที่สวยงาม?",
        difficulty: 'easy',
        points: 10,
        timeLimit: 25,
        answers: [
          { id: 1, text: "ดาวพฤหัสบดี", isCorrect: false, emoji: "🪐" },
          { id: 2, text: "ดาวเสาร์", isCorrect: true, emoji: "🪐" },
          { id: 3, text: "ดาวยูเรนัส", isCorrect: false, emoji: "🌀" },
          { id: 4, text: "ดาวเนปจูน", isCorrect: false, emoji: "🌊" },
        ],
        explanation: "ดาวเสาร์ (Saturn) มีวงแหวนที่สวยงามและเห็นได้ชัดเจนที่สุด ประกอบด้วยอนุภาคน้ำแข็งและหิน",
        funFact: "💍 วงแหวนของดาวเสาร์กว้างถึง 282,000 กิโลเมตร แต่หนาเพียง 1 กิโลเมตร!"
      },
      {
        id: 2,
        type: "fill-blank",
        question: "ดาวเคราะห์ที่หมุนรอบตัวเองในแนวข้างคือ ___________",
        difficulty: 'hard',
        points: 20,
        timeLimit: 35,
        correctAnswer: "ดาวยูเรนัส",
        alternatives: ["ยูเรนัส", "Uranus", "uranus"],
        placeholder: "พิมพ์ชื่อดาวเคราะห์...",
        hints: ["เป็นดาวเคราะห์น้ำแข็ง", "มีวงแหวนแต่มองไม่เห็นชัด", "เป็นดาวเคราะห์ลำดับที่ 7"],
        explanation: "ดาวยูเรนัส (Uranus) หมุนรอบตัวเองในแนวข้าง แตกต่างจากดาวเคราะห์อื่นๆ ที่หมุนในแนวตั้ง",
        funFact: "🌀 ดาวยูเรนัสเอียงมากจนฤดูกาลหนึ่งฤดูใช้เวลา 21 ปีโลก!"
      },
      {
        id: 3,
        type: "drag-drop",
        question: "เรียงลำดับดาวเคราะห์ยักษ์แก๊สจากใกล้ไปไกล",
        difficulty: 'medium',
        points: 15,
        timeLimit: 40,
        dragItems: [
          { id: "jupiter", text: "ดาวพฤหัสบดี", emoji: "🪐", correctPosition: 1 },
          { id: "saturn", text: "ดาวเสาร์", emoji: "🪐", correctPosition: 2 },
          { id: "uranus", text: "ดาวยูเรนัส", emoji: "🌀", correctPosition: 3 },
          { id: "neptune", text: "ดาวเนปจูน", emoji: "🌊", correctPosition: 4 }
        ],
        dropZones: [
          { id: 1, label: "ใกล้ที่สุด" },
          { id: 2, label: "ที่ 2" },
          { id: 3, label: "ที่ 3" },
          { id: 4, label: "ไกลที่สุด" }
        ],
        explanation: "ลำดับดาวเคราะห์ยักษ์แก๊ส: ดาวพฤหัสบดี → ดาวเสาร์ → ดาวยูเรนัส → ดาวเนปจูน",
        funFact: "🌟 ดาวเคราะห์ยักษ์ทั้ง 4 ดวงมีดาวเทียมและวงแหวนทั้งหมด!"
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
    xpReward: 100,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 250,
      xp: 100,
      gems: 12,
      badges: ["moon-explorer"],
      unlocksStages: [5],
      achievementUnlocks: ["satellite-specialist"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "สวัสดีอีกครั้ง! วันนี้เราจะมาเรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมต่างๆ กัน",
      learningContent: "ดวงจันทร์คือดาวเทียมธรรมชาติของโลก และดาวเคราะห์อื่นๆ ก็มีดาวเทียมของตัวเองมากมาย เรามาศึกษาความน่าสนใจของพวกมันกัน",
      completionMessage: "ยอดเยี่ยม! คุณได้เรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมแล้ว ตอนนี้คุณพร้อมที่จะสำรวจดาวหางแล้ว!",
      encouragements: [
        "ยอดเยี่ยม! 🌙",
        "เก่งมาก! 🛰️",
        "สุดยอด! ⭐",
        "ถูกต้อง! 🎯"
      ],
      hints: [
        "ดวงจันทร์ใช้เวลาเท่าไหร่ในการโคจรรอบโลก? 🌙",
        "ดาวเทียมไหนใหญ่ที่สุดในระบบสุริยะ? 🪐",
        "ดาวเทียมไหนที่มีบรรยากาศ? 🌫️"
      ]
    },
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "ดวงจันทร์โคจรรอบโลกใช้เวลากี่วัน?",
        difficulty: 'medium',
        points: 15,
        timeLimit: 30,
        answers: [
          { id: 1, text: "27 วัน", isCorrect: true, emoji: "🌙" },
          { id: 2, text: "30 วัน", isCorrect: false, emoji: "📅" },
          { id: 3, text: "365 วัน", isCorrect: false, emoji: "🗓️" },
          { id: 4, text: "14 วัน", isCorrect: false, emoji: "⏰" },
        ],
        explanation: "ดวงจันทร์โคจรรอบโลกหนึ่งรอบใช้เวลาประมาณ 27.3 วัน เรียกว่าเดือนดาราจันทร์",
        funFact: "🌙 ดวงจันทร์ค่อยๆ ห่างออกจากโลกทุกปีประมาณ 3.8 เซนติเมตร!"
      },
      {
        id: 2,
        type: "fill-blank",
        question: "ดาวเทียมที่ใหญ่ที่สุดในระบบสุริยะชื่อ ___________",
        difficulty: 'hard',
        points: 20,
        timeLimit: 35,
        correctAnswer: "แกนีมีด",
        alternatives: ["Ganymede", "ganymede"],
        placeholder: "พิมพ์ชื่อดาวเทียม...",
        hints: ["เป็นดาวเทียมของดาวพฤหัสบดี", "ใหญ่กว่าดาวพุธ", "ชื่อมาจากเทพกรีก"],
        explanation: "แกนีมีด (Ganymede) เป็นดาวเทียมที่ใหญ่ที่สุดในระบบสุริยะ และเป็นดาวเทียมของดาวพฤหัสบดี",
        funFact: "🪐 แกนีมีดใหญ่กว่าดาวพุธและมีสนามแม่เหล็กเป็นดาวเทียมเดียว!"
      },
      {
        id: 3,
        type: "match-pairs",
        question: "จับคู่ดาวเทียมกับดาวเคราะห์ที่เป็นเจ้าของ",
        difficulty: 'hard',
        points: 25,
        timeLimit: 60,
        pairs: [
          { left: { id: "moon", text: "ดวงจันทร์", emoji: "🌙" }, right: { id: "earth", text: "โลก", emoji: "🌍" } },
          { left: { id: "titan", text: "ไททัน", emoji: "🌫️" }, right: { id: "saturn", text: "ดาวเสาร์", emoji: "🪐" } },
          { left: { id: "europa", text: "ยูโรปา", emoji: "🧊" }, right: { id: "jupiter", text: "ดาวพฤหัสบดี", emoji: "🪐" } },
          { left: { id: "phobos", text: "โฟบอส", emoji: "🌑" }, right: { id: "mars", text: "ดาวอังคาร", emoji: "♂️" } }
        ],
        explanation: "แต่ละดาวเคราะห์มีดาวเทียมที่โดดเด่นและมีคุณสมบัติพิเศษ",
        funFact: "🛰️ ไททัน เป็นดาวเทียมเดียวที่มีบรรยากาศหนาแน่นและทะเลสาบของไฮโดรคาร์บอน!"
      },
      {
        id: 4,
        type: "true-false",
        question: "ดาวอังคารมีดาวเทียม 2 ดวง คือ โฟบอส และ ไดมอส",
        difficulty: 'medium',
        points: 15,
        timeLimit: 25,
        correctAnswer: true,
        explanation: "ถูกต้อง! ดาวอังคารมีดาวเทียม 2 ดวง คือ โฟบอส (Phobos) และ ไดมอส (Deimos) ซึ่งมีขนาดเล็กมาก",
        funFact: "🌑 โฟบอสโคจรรอบดาวอังคารเร็วกว่าการหมุนของดาวอังคาร จึงขึ้นทางตะวันตกตกทางตะวันออก!"
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
    xpReward: 150,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 300,
      xp: 150,
      gems: 20,
      badges: ["comet-hunter", "solar-system-master"],
      unlocksStages: [],
      achievementUnlocks: ["astronomy-expert", "space-explorer-elite"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "ยินดีด้วย! นี่คือด่านสุดท้ายแล้ว เรามาเรียนรู้เกี่ยวกับดาวหางและวัตถุอวกาศอื่นๆ กัน",
      learningContent: "ดาวหาง ดาวตก และดาวเคราะห์น้อยเป็นวัตถุที่น่าสนใจในระบบสุริยะ พวกมันบอกเล่าประวัติศาสตร์การเกิดขึ้นของระบบสุริยะ",
      completionMessage: "ยอดเยี่ยมมาก! คุณผ่านการเรียนรู้ทั้งหมดแล้ว คุณเป็นผู้เชี่ยวชาญด้านดาราศาสตร์แล้ว!",
      encouragements: [
        "ยอดเยี่ยมมาก! ☄️",
        "เชี่ยวชาญแล้ว! 🏆",
        "สุดยอด! 🌟",
        "ปรบมือ! 👏"
      ],
      hints: [
        "ดาวหางมาจากไหน? ☄️",
        "ดาวเคราะห์น้อยที่ใหญ่ที่สุดคือ? 🪨",
        "ฝนดาวตกเกิดขึ้นอย่างไร? 🌠"
      ]
    },
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "ดาวหางส่วนใหญ่มาจากบริเวณใดของระบบสุริยะ?",
        difficulty: 'hard',
        points: 20,
        timeLimit: 40,
        answers: [
          { id: 1, text: "เข็มขัดดาวเคราะห์น้อย", isCorrect: false, emoji: "🪨" },
          { id: 2, text: "เมฆออร์ต", isCorrect: true, emoji: "☄️" },
          { id: 3, text: "เข็มขัดไคเปอร์", isCorrect: false, emoji: "🌌" },
          { id: 4, text: "บริเวณดาวพฤหัสบดี", isCorrect: false, emoji: "🪐" },
        ],
        explanation: "ดาวหางส่วนใหญ่มาจากเมฆออร์ต (Oort Cloud) ซึ่งเป็นบริเวณที่อยู่ไกลจากดวงอาทิตย์มาก",
        funFact: "☄️ เมฆออร์ตไกลจากดวงอาทิตย์ถึง 50,000 เท่าของระยะโลกกับดวงอาทิตย์!"
      },
      {
        id: 2,
        type: "fill-blank",
        question: "ดาวเคราะห์น้อยที่ใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อยชื่อ ___________",
        difficulty: 'hard',
        points: 20,
        timeLimit: 35,
        correctAnswer: "เซเรส",
        alternatives: ["Ceres", "ceres"],
        placeholder: "พิมพ์ชื่อดาวเคราะห์น้อย...",
        hints: ["เป็นดาวเคราะห์แคระ", "อยู่ระหว่างดาวอังคารและดาวพฤหัสบดี", "ชื่อมาจากเทพีโรมัน"],
        explanation: "เซเรส (Ceres) เป็นดาวเคราะห์น้อยที่ใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อย และจัดอยู่ในประเภทดาวเคราะห์แคระ",
        funFact: "🪨 เซเรสมีขนาดใหญ่มากจนมีแรงโน้มถ่วงเพียงพอให้มีรูปร่างกลม!"
      },
      {
        id: 3,
        type: "drag-drop",
        question: "เรียงลำดับขนาดจากเล็กไปใหญ่",
        difficulty: 'medium',
        points: 15,
        timeLimit: 45,
        dragItems: [
          { id: "meteoroid", text: "ดาวตก", emoji: "🌠", correctPosition: 1 },
          { id: "asteroid", text: "ดาวเคราะห์น้อย", emoji: "🪨", correctPosition: 2 },
          { id: "comet", text: "ดาวหาง", emoji: "☄️", correctPosition: 3 },
          { id: "dwarf-planet", text: "ดาวเคราะห์แคระ", emoji: "🌑", correctPosition: 4 }
        ],
        dropZones: [
          { id: 1, label: "เล็กที่สุด" },
          { id: 2, label: "ที่ 2" },
          { id: 3, label: "ที่ 3" },
          { id: 4, label: "ใหญ่ที่สุด" }
        ],
        explanation: "ลำดับขนาดโดยทั่วไป: ดาวตก < ดาวเคราะห์น้อย < ดาวหาง < ดาวเคราะห์แคระ",
        funFact: "🌌 วัตถุทั้งหมดนี้เป็นซากเหลือจากการเกิดระบบสุริยะเมื่อ 4.6 พันล้านปีก่อน!"
      },
      {
        id: 4,
        type: "true-false",
        question: "ฝนดาวตกเกิดขึ้นเมื่อโลกโคจรผ่านเศษซากของดาวหาง",
        difficulty: 'medium',
        points: 15,
        timeLimit: 25,
        correctAnswer: true,
        explanation: "ถูกต้อง! ฝนดาวตกเกิดขึ้นเมื่อโลกโคจรผ่านเศษซากที่ดาวหางทิ้งไว้ในวงโคจร เศษซากจะเข้าสู่ชั้นบรรยากาศและไหม้เป็นดาวตก",
        funFact: "🌠 ฝนดาวตกเพอร์เซอิดส์ในเดือนสิงหาคมมาจากเศษซากของดาวหางสวิฟต์-ทัตเทิล!"
      },
      {
        id: 5,
        type: "match-pairs",
        question: "จับคู่คำศัพท์กับความหมาย",
        difficulty: 'hard',
        points: 25,
        timeLimit: 60,
        pairs: [
          { left: { id: "meteoroid", text: "ดาวตก", emoji: "🌠" }, right: { id: "space-rock", text: "หินขนาดเล็กในอวกาศ", emoji: "🪨" } },
          { left: { id: "meteor", text: "ดาวหลน", emoji: "✨" }, right: { id: "burning-trail", text: "แสงที่เห็นในท้องฟ้า", emoji: "💫" } },
          { left: { id: "meteorite", text: "อุกกาบาต", emoji: "🪨" }, right: { id: "ground-rock", text: "หินที่ตกถึงพื้นโลก", emoji: "🌍" } },
          { left: { id: "comet-tail", text: "หางดาวหาง", emoji: "☄️" }, right: { id: "gas-dust", text: "แก๊สและฝุ่นจากดาวหาง", emoji: "💨" } }
        ],
        explanation: "คำศัพท์เหล่านี้ใช้เรียกวัตถุอวกาศในช่วงต่างๆ ของการเดินทาง",
        funFact: "💎 อุกกาบาตบางก้อนมีค่ามากกว่าทองคำ เพราะมีแร่ธาตุหายากจากอวกาศ!"
      }
    ]
  }
};
