import { StageData } from '../types/stage';

export const stageData: Record<number, StageData> = {
  1: {
    id: 1,
    title: "การรู้จักระบบสุริยะ - Multiple Choice Challenge",
    description: "เรียนรู้พื้นฐานของระบบสุริยะด้วยคำถามปรนัย",
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
      badges: ["multiple-choice-master"],
      unlocksStages: [2],
      achievementUnlocks: ["first-steps"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "🌟 ยินดีต้อนรับสู่ด่าน Multiple Choice! ทดสอบความรู้พื้นฐานกันเถอะ! 🚀",
      learningContent: "🎯 ด่านที่ 1: ทดสอบความรู้พื้นฐานด้วยคำถามแบบเลือกตอบ! \n\n⭐ เรียนรู้เกี่ยวกับดาวเคราะห์ทั้ง 8 ดวง\n🌡️ ทำความเข้าใจอุณหภูมิและสภาพแวดล้อม\n💫 จดจำลักษณะเด่นของแต่ละดาว",
      completionMessage: "🎉 ยอดเยี่ยม! คุณผ่านด่าน Multiple Choice แล้ว!",
      encouragements: [
        "🔥 เจ๋งสุดๆ! คำตอบถูกต้อง! 🌟",
        "⚡ สุดยอด! พลังสมองเต็มเปี่ยม! 🚀",
        "💫 ยอดเยี่ยม! คุณคือนักเรียนตัวจริง! 🎯",
        "🌈 เก่งมาก! ไปต่อได้เลย! 👑"
      ],
      hints: [
        "🤔 ลองนับดูว่ามีกี่ดวงในระบบสุริยะ? ⭐",
        "☀️ คิดถึงดาวที่ใกล้ดวงอาทิตย์ที่สุด 🏃‍♂️",
        "🪐 ลองนึกถึงดาวยักษ์ที่มีแรงโน้มถวงมหาศาล 💪"
      ]
    },
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "ระบบสุริยะมีดาวเคราะห์กี่ดวง?",
        difficulty: 'easy',
        points: 10,
        timeLimit: 30,
        answers: [
          { id: 1, text: "7 ดวง", isCorrect: false, emoji: "7️⃣" },
          { id: 2, text: "8 ดวง", isCorrect: true, emoji: "8️⃣" },
          { id: 3, text: "9 ดวง", isCorrect: false, emoji: "9️⃣" },
          { id: 4, text: "10 ดวง", isCorrect: false, emoji: "🔢" },
        ],
        explanation: "🎉 ถูกต้อง! ระบบสุริยะมีดาวเคราะห์ 8 ดวง: พุธ ศุกร์ โลก อังคาร พฤหัสบดี เสาร์ ยูเรนัส เนปจูน",
        funFact: "💡 ดาวพลูโตเคยเป็นดาวเคราะห์ดวงที่ 9 แต่ปี 2006 ถูกจัดเป็นดาวเคราะห์แคระ!"
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "ดาวเคราะห์ดวงใดที่ร้อนที่สุด?",
        difficulty: 'medium',
        points: 15,
        timeLimit: 25,
        answers: [
          { id: 1, text: "ดาวพุธ", isCorrect: false, emoji: "☿️" },
          { id: 2, text: "ดาวศุกร์", isCorrect: true, emoji: "♀️" },
          { id: 3, text: "โลก", isCorrect: false, emoji: "🌍" },
          { id: 4, text: "ดาวอังคาร", isCorrect: false, emoji: "♂️" },
        ],
        explanation: "🔥 ถูกต้อง! ดาวศุกร์ร้อนที่สุดเพราะมีเรือนกระจกธรรมชาติ",
        funFact: "🌋 ดาวศุกร์ร้อนถึง 470°C หลอมตะกั่วได้!"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "ดาวเคราะห์ดวงใดที่มีวงแหวนสวยงามที่สุด?",
        difficulty: 'easy',
        points: 10,
        timeLimit: 20,
        answers: [
          { id: 1, text: "ดาวพฤหัสบดี", isCorrect: false, emoji: "🪐" },
          { id: 2, text: "ดาวเสาร์", isCorrect: true, emoji: "🪐" },
          { id: 3, text: "ดาวยูเรนัส", isCorrect: false, emoji: "🌀" },
          { id: 4, text: "ดาวเนปจูน", isCorrect: false, emoji: "🌊" },
        ],
        explanation: "💎 เยี่ยม! ดาวเสาร์มีวงแหวนที่สวยงามและมองเห็นได้ชัดจากโลก",
        funFact: "✨ วงแหวนของดาวเสาร์กว้าง 282,000 กิโลเมตร แต่หนาเพียง 1 กิโลเมตร!"
      },
      {
        id: 4,
        type: "multiple-choice",
        question: "โลกเป็นดาวเคราะห์ลำดับที่เท่าไหร่จากดวงอาทิตย์?",
        difficulty: 'easy',
        points: 10,
        timeLimit: 15,
        answers: [
          { id: 1, text: "ลำดับที่ 2", isCorrect: false, emoji: "2️⃣" },
          { id: 2, text: "ลำดับที่ 3", isCorrect: true, emoji: "3️⃣" },
          { id: 3, text: "ลำดับที่ 4", isCorrect: false, emoji: "4️⃣" },
          { id: 4, text: "ลำดับที่ 5", isCorrect: false, emoji: "5️⃣" },
        ],
        explanation: "🎯 ถูกต้อง! โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดวงอาทิตย์ อยู่ในโซนที่เหมาะกับการมีชีวิต",
        funFact: "🌱 โลกอยู่ใน 'Goldilocks Zone' ที่มีอุณหภูมิพอดีสำหรับน้ำเหลว!"
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "ดาวเคราะห์ดวงใดที่เรียกว่า 'ดาวเคราะห์สีแดง'?",
        difficulty: 'easy',
        points: 10,
        timeLimit: 20,
        answers: [
          { id: 1, text: "ดาวศุกร์", isCorrect: false, emoji: "♀️" },
          { id: 2, text: "ดาวอังคาร", isCorrect: true, emoji: "♂️" },
          { id: 3, text: "ดาวพฤหัสบดี", isCorrect: false, emoji: "🪐" },
          { id: 4, text: "ดาวเสาร์", isCorrect: false, emoji: "🪐" },
        ],
        explanation: "⚔️ สุดยอด! ดาวอังคารเรียกว่า 'Red Planet' เพราะพื้นผิวเต็มไปด้วยสนิมเหล็ก",
        funFact: "🌪️ ดาวอังคารมีพายุฝุ่นที่ใหญ่ที่สุดและสามารถครอบคลุมดาวเคราะห์ทั้งดวง!"
      }
    ]
  },
  2: {
    id: 2,
    title: "ดาวเคราะห์ในระบบภายใน - Drag & Drop Challenge",
    description: "สำรวจดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ด้วยการลากและวาง",
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
      badges: ["drag-drop-master"],
      unlocksStages: [3],
      achievementUnlocks: ["planet-discoverer"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "🎊 ยินดีต้อนรับกลับมา นักสำรวจผู้กล้า! การผจญภัยครั้งนี้จะยิ่งตื่นเต้นกว่าเดิม! 🌟 วันนี้เราจะมาสำรวจ 'โลกใกล้บ้าน' 4 ดวงด้วยการลากและวาง! 🤯✨",
      learningContent: "🏰 ยินดีต้อนรับสู่ 'ย่านใกล้บ้าน' ของเรา! \n\n🔥 ดาวพุธ - นักวิ่งจอมเร็ว ใกล้ดวงอาทิตย์ที่สุด!\n💃 ดาวศุกร์ - เจ้าหญิงแห่งไฟ สวยงามแต่อันตราย!\n🏡 โลก - บ้านสวยงามของเรา โอเอซิสแห่งชีวิต!\n⚔️ ดาวอังคาร - นักรบสีแดง ที่อาจมีสิ่งมีชีวิต!\n\n🎯 ในด่านนี้คุณจะได้ฝึกการลากและวางเพื่อจัดเรียงข้อมูล!",
      completionMessage: "🏆 AMAZING! คุณคือนักสำรวจระดับตำนาน! ความรู้เกี่ยวกับดาวเคราะห์ใกล้บ้านครบสมบูรณ์แล้ว! 🌟",
      encouragements: [
        "🔥 พลังระเบิด! คุณเจ๋งสุดขีด! 💥",
        "⚡ เหนือชั้น! สมองอัจฉริยะเลย! 🧠✨",
        "🌟 สุดยอด! คุณคือตำนานนักสำรวจ! 🏆",
        "🚀 ยอดเยี่ยม! พิชิตอวกาศได้แล้ว! 🎯"
      ],
      hints: [
        "🔴 ลองคิดถึงดาวที่มีสีเหมือนเลือด... น่ากลัวมั้ย? 😈",
        "🔥 ดาวไหนที่มีเรือนกระจกธรรมชาติที่ร้อนสุดๆ? ♨️",
        "🌍 บ้านเราอยู่ลำดับที่เท่าไหร่นับจากดวงอาทิตย์? 🏠"
      ]
    },
    questions: [
      {
        id: 1,
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
        id: 2,
        type: "drag-drop",
        question: "จับคู่ดาวเคราะห์กับคุณสมบัติเด่น",
        difficulty: 'medium',
        points: 25,
        timeLimit: 60,
        dragItems: [
          { id: "mercury-small", text: "เล็กที่สุด", emoji: "🤏", correctPosition: 1 },
          { id: "venus-hot", text: "ร้อนที่สุด", emoji: "🔥", correctPosition: 2 },
          { id: "earth-life", text: "มีสิ่งมีชีวิต", emoji: "🌱", correctPosition: 3 },
          { id: "mars-red", text: "สีแดง", emoji: "🔴", correctPosition: 4 }
        ],
        dropZones: [
          { id: 1, label: "ดาวพุธ ☿️" },
          { id: 2, label: "ดาวศุกร์ ♀️" },
          { id: 3, label: "โลก 🌍" },
          { id: 4, label: "ดาวอังคาร ♂️" }
        ],
        explanation: "แต่ละดาวเคราะห์ในระบบภายในมีลักษณะเฉพาะที่แตกต่างกัน",
        funFact: "✨ ดาวพุธมีแกนหมุนที่เอียงน้อยที่สุด ทำให้ไม่มีฤดูกาล!"
      }
    ]
  },
  3: {
    id: 3,
    title: "ดาวเคราะห์ในระบบภายนอก - Fill in the Blanks",
    description: "ค้นพบดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน ด้วยการเติมคำ",
    thumbnail: "🪐",
    difficulty: 'medium',
    estimatedTime: "25 นาที",
    prerequisites: [2],
    totalStars: 3,
    xpReward: 100,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 200,
      xp: 100,
      gems: 10,
      badges: ["fill-blank-master"],
      unlocksStages: [4],
      achievementUnlocks: ["outer-planet-explorer"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "🎆 ยินดีต้อนรับสู่การเดินทางที่ยิ่งใหญ่ที่สุด! วันนี้เราจะออกสำรวจ 'ดินแดนแห่งยักษ์' ที่ไกลออกไป! 🌌 ด้วยการเติมคำในช่องว่าง!",
      learningContent: "🪐 ยินดีต้อนรับสู่ 'อาณาจักรแห่งยักษ์'! \n\n👑 ดาวพฤหัสบดี - จักรพรรดิแห่งระบบสุริยะ มีจุดแดงยักษ์!\n💍 ดาวเสาร์ - เจ้าแห่งวงแหวนที่สวยงามล้ำ!\n🌀 ดาวยูเรนัส - นักกายกรรมที่หมุนข้าง มีสีฟ้าปริศนา!\n🌊 ดาวเนปจูน - จอมลมแรงแห่งขอบระบบ!",
      completionMessage: "🏆 LEGENDARY! คุณคือนักสำรวจระดับตำนาน! พิชิตดินแดนแห่งยักษ์ได้สำเร็จ! 🌟",
      encouragements: [
        "🔥 ยอดเยี่ยม! เติมคำถูกต้อง! 💪",
        "⚡ สุดยอด! ความจำแม่นมาก! 🧠",
        "🌟 เจ๋งสุดๆ! คิดได้เร็วมาก! 🚀",
        "🎯 เพอร์เฟค! ทักษะการเติมคำยอดเยี่ยม! 👑"
      ],
      hints: [
        "🪐 ลองนึกถึงดาวยักษ์ที่มีแรงโน้มถวงมหาศาล... 💪",
        "💍 คิดถึงดาวที่มีวงแหวนสวยงามที่สุด... 💎",
        "🌀 ดาวใดที่หมุนแบบแปลกๆ เอียงข้าง? 🤸"
      ]
    },
    questions: [
      {
        id: 1,
        type: "fill-blank",
        question: "ดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะคือ ___________",
        difficulty: 'easy',
        points: 15,
        timeLimit: 25,
        correctAnswer: "ดาวพฤหัสบดี",
        alternatives: ["พฤหัสบดี", "Jupiter", "jupiter"],
        placeholder: "พิมพ์ชื่อดาวยักษ์...",
        hints: ["🪐 เป็นดาวเคราะห์แก๊สยักษ์ที่มีพายุอันโด่งดัง", "⚡ มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกัน"],
        explanation: "🎉 ยอดเยี่ยม! ดาวพฤหัสบดี (Jupiter) คือราชาแห่งดาวเคราะห์!",
        funFact: "🤯 ดาวพฤหัสบดีใหญ่มากจนสามารถใส่โลกได้มากกว่า 1,300 ดวง!"
      },
      {
        id: 2,
        type: "fill-blank",
        question: "ดาวเคราะห์ที่มีวงแหวนสวยงามที่สุดคือ ___________",
        difficulty: 'easy',
        points: 15,
        timeLimit: 20,
        correctAnswer: "ดาวเสาร์",
        alternatives: ["เสาร์", "Saturn", "saturn"],
        placeholder: "พิมพ์ชื่อดาวแห่งวงแหวน...",
        hints: ["💍 มีวงแหวนที่มองเห็นได้ชัดจากโลก", "💎 เรียกว่า 'อัญมณีแห่งระบบสุริยะ'"],
        explanation: "💍 สุดยอด! ดาวเสาร์ (Saturn) คือ 'อัญมณีแห่งระบบสุริยะ'",
        funFact: "✨ วงแหวนประกอบด้วยน้ำแข็ง หิน และฝุ่นนับพันล้านชิ้น!"
      },
      {
        id: 3,
        type: "fill-blank",
        question: "ดาวเคราะห์ที่หมุนข้างแบบไม่เหมือนใครคือ ___________",
        difficulty: 'hard',
        points: 20,
        timeLimit: 30,
        correctAnswer: "ดาวยูเรนัส",
        alternatives: ["ยูเรนัส", "Uranus", "uranus"],
        placeholder: "พิมพ์ชื่อดาวนักกายกรรม...",
        hints: ["🧊 เป็นดาวเคราะห์น้ำแข็งที่มีสีฟ้าปริศนา", "🤸 หมุนแกนเอียง 98 องศา"],
        explanation: "🎯 ยอดเยี่ยม! ดาวยูเรนัส (Uranus) เป็น 'นักกายกรรมแห่งอวกาศ'!",
        funFact: "🌀 เอียงมากจนฤดูกาลหนึ่งฤดูยาวนาน 21 ปีโลก!"
      }
    ]
  },
  4: {
    id: 4,
    title: "ดวงจันทร์และดาวเทียม - Matching Challenge",
    description: "เรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมของดาวเคราะห์ด้วยการจับคู่",
    thumbnail: "🌙",
    difficulty: 'medium',
    estimatedTime: "30 นาที",
    prerequisites: [3],
    totalStars: 3,
    xpReward: 125,
    streakBonus: true,
    healthSystem: true,
    rewards: {
      stars: 3,
      points: 250,
      xp: 125,
      gems: 12,
      badges: ["matching-master"],
      unlocksStages: [5],
      achievementUnlocks: ["satellite-specialist"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "🌙 ยินดีต้อนรับสู่การผจญภัยใหม่! วันนี้เราจะไปสำรวจ 'เพื่อนร่วมทาง' ของดาวเคราะห์! 🛰️",
      learningContent: "🌙 ยินดีต้อนรับสู่ 'ราชอาณาจักรดาวเทียม'! \n\n🌍 ดวงจันทร์ - เพื่อนซี้ของโลก ที่ควบคุมคลื่นและเวลา!\n🪐 ไททัน - ดาวเทียมลึกลับที่มีทะเลสาบไฮโดรคาร์บอน!\n🧊 ยูโรปา - โลกน้ำแข็งที่อาจมีสิ่งมีชีวิตใต้น้ำ!",
      completionMessage: "🎆 EXCELLENT! คุณคือนักสำรวจดาวเทียมระดับเซียน!",
      encouragements: [
        "🌙 LUNAR POWER! พลังดวงจันทร์! ✨",
        "🛰️ SATELLITE MASTER! เซียนดาวเทียม! 🎯",
        "⭐ COSMIC GENIUS! อัจฉริยะแห่งจักรวาล! 💫",
        "🎆 MOON WALKER! นักเดินดวงจันทร์! 👨‍🚀"
      ],
      hints: [
        "🌙 ลองคิดถึงดวงจันทร์ที่เราเห็นทุกคืน... ใช้เวลาเกือบเดือน! 🗓️",
        "🪐 ดาวเทียมยักษ์ของดาวพฤหัสบดี... ใหญ่กว่าดาวพุธเสียอีก! 💪",
        "🌫️ ดาวเทียมที่มีหมอกหนาเหมือนโลกยุคแรก... 🌍"
      ]
    },
    questions: [
      {
        id: 1,
        type: "match-pairs",
        question: "จับคู่ดาวเทียมกับดาวเคราะห์เจ้าของ",
        difficulty: 'medium',
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
        id: 2,
        type: "match-pairs",
        question: "จับคู่ดาวเทียมกับลักษณะเด่น",
        difficulty: 'hard',
        points: 30,
        timeLimit: 75,
        pairs: [
          { left: { id: "moon", text: "ดวงจันทร์", emoji: "🌙" }, right: { id: "tides", text: "ควบคุมกระแสน้ำ", emoji: "🌊" } },
          { left: { id: "io", text: "ไอโอ", emoji: "🌋" }, right: { id: "volcanoes", text: "ภูเขาไฟกำมะถัน", emoji: "🌋" } },
          { left: { id: "ganymede", text: "แกนีมีด", emoji: "🔵" }, right: { id: "largest", text: "ดาวเทียมใหญ่ที่สุด", emoji: "👑" } },
          { left: { id: "enceladus", text: "เอนเซลาดัส", emoji: "💎" }, right: { id: "ice-geysers", text: "ไกเซอร์น้ำแข็ง", emoji: "⛲" } }
        ],
        explanation: "ดาวเทียมแต่ละดวงมีความพิเศษและลักษณะที่น่าทึ่งแตกต่างกัน",
        funFact: "💎 เอนเซลาดัสพ่นน้ำแข็งออกมาจากขั้วโลกใต้ บ่งชี้ว่าอาจมีมหาสมุทรใต้พื้นผิว!"
      }
    ]
  },
  5: {
    id: 5,
    title: "ดาวหางและดาวเคราะห์น้อย - True or False Challenge",
    description: "สำรวจดาวหาง ดาวตก และดาวเคราะห์น้อยในระบบสุริยะ ด้วยคำถามจริง-เท็จ",
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
      badges: ["true-false-master", "solar-system-complete"],
      unlocksStages: [],
      achievementUnlocks: ["astronomy-expert", "space-explorer-elite"]
    },
    character: {
      name: "ซิกโก้",
      avatar: "🚀",
      introduction: "🎆 CONGRATULATIONS! คุณมาถึงด่านสุดท้ายแล้ว! นี่คือการทดสอบขั้นสุดท้ายเพื่อเป็น 'ปรมาจารย์แห่งระบบสุริยะ'! 🌟",
      learningContent: "☄️ ยินดีต้อนรับสู่ 'โลกแห่งนักเดินทาง'! \n\n🌠 ดาวหาง - นักเดินทางน้ำแข็งที่มาจากขอบระบบสุริยะ!\n✨ ดาวตก - นักแสดงแสงไฟในท้องฟ้ายามค่ำคืน!\n🪨 ดาวเคราะห์น้อย - ซากปริศนาจากอดีตอันไกลโพ้น!",
      completionMessage: "🎆🏆 ULTIMATE ACHIEVEMENT! 🏆🎆\n\nคุณไม่ใช่แค่นักเรียน... คุณคือ 'ปรมาจารย์แห่งระบบสุริยะ' แล้ว! 🌟",
      encouragements: [
        "🔥 ULTIMATE POWER! คุณคือตำนาน! ⚡",
        "🏆 LEGENDARY! ปรมาจารย์แท้จริง! 👑",
        "💎 PERFECT! เพชรผู้พิชิตอวกาศ! 💫",
        "👑 CHAMPION! จักรพรรดิแห่งความรู้! 🎆"
      ],
      hints: [
        "🌌 คิดถึงขอบไกลของระบบสุริยะ... หนาวและมืด 🧊",
        "🪨 ลองนึกถึงดาวเคราะห์แคระที่มีชื่อเสียง... 💫",
        "🌠 เศษซากจากไหนที่เข้ามาในชั้นบรรยากาศ? 💨"
      ]
    },
    questions: [
      {
        id: 1,
        type: "true-false",
        question: "ดาวหางมาจากเมฆออร์ตที่ขอบระบบสุริยะ",
        difficulty: 'hard',
        points: 20,
        timeLimit: 30,
        correctAnswer: true,
        explanation: "🎯 ถูกต้อง! เมฆออร์ต (Oort Cloud) คือ 'ตู้เย็นยักษ์' ของระบบสุริยะ!",
        funFact: "🤯 เมฆออร์ตไกลจากดวงอาทิตย์ถึง 50,000 เท่าของระยะโลก-ดวงอาทิตย์!"
      },
      {
        id: 2,
        type: "true-false",
        question: "ฝนดาวตกเกิดจากโลกโคจรผ่านเศษซากของดาวหาง",
        difficulty: 'medium',
        points: 15,
        timeLimit: 25,
        correctAnswer: true,
        explanation: "🎆 ถูกต้อง! ฝนดาวตกคือ 'การแสดงแสงไฟธรรมชาติ' ที่เกิดเมื่อโลกโคจรผ่านเศษซาก!",
        funFact: "🌠 ดาวตกพุ่งด้วยความเร็ว 59 กม./วินาที - เร็วกว่าชิ้นกระสุน 150 เท่า!"
      },
      {
        id: 3,
        type: "true-false",
        question: "เซเรสเป็นดาวเคราะห์แคระที่ใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อย",
        difficulty: 'hard',
        points: 25,
        timeLimit: 35,
        correctAnswer: true,
        explanation: "🎉 สุดยอด! เซเรส (Ceres) คือ 'ราชินีแห่งเข็มขัดดาวเคราะห์น้อย'!",
        funFact: "💎 เซเรสอาจมีมหาสมุทรใต้ดิน! น้ำเหลวมากกว่าน้ำจืดทั้งหมดบนโลก!"
      },
      {
        id: 4,
        type: "true-false", 
        question: "ดาวเคราะห์น้อยทั้งหมดอยู่ระหว่างดาวอังคารและดาวพฤหัสบดี",
        difficulty: 'medium',
        points: 15,
        timeLimit: 20,
        correctAnswer: false,
        explanation: "❌ ไม่ถูกต้อง! ส่วนใหญ่อยู่ในเข็มขัดดาวเคราะห์น้อย แต่มีบางดวงกระจายอยู่ทั่วระบบสุริยะ",
        funFact: "🌌 มีดาวเคราะห์น้อยบางดวงที่มีวงโคจรใกล้โลก เรียกว่า Near-Earth Objects (NEOs)!"
      },
      {
        id: 5,
        type: "true-false",
        question: "หางดาวหางเกิดจากแรงลมสุริยะ",
        difficulty: 'hard',
        points: 20,
        timeLimit: 30,
        correctAnswer: true,
        explanation: "🎯 ถูกต้อง! หางดาวหางเกิดจากแรงลมสุริยะ (Solar Wind) ที่พัดเศษน้ำแข็งและแก๊สให้เป็นหาง",
        funFact: "☄️ หางดาวหางมักจะชี้ออกจากดวงอาทิตย์เสมอ ไม่ใช่ตามทิศทางที่เคลื่อนที่!"
      }
    ]
  }
};
