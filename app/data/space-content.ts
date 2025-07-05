// เนื้อหาเพิ่มเติมสำหรับมินิเกม
export interface ConstellationPattern {
  id: string;
  name: string;
  nameEn: string;
  stars: { x: number; y: number; brightness: number }[];
  connections: [number, number][];
  story: string;
  difficulty: 'easy' | 'medium' | 'hard';
  season: string;
  mythology: string;
}

export interface SpaceFact {
  id: string;
  category: 'shocking' | 'beautiful' | 'mysterious' | 'record' | 'discovery';
  title: string;
  description: string;
  emoji: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
}

export interface AsteroidWave {
  id: string;
  name: string;
  speed: number;
  density: number;
  specialEffect?: string;
  powerUps: string[];
  difficultyLevel: number;
}

// กลุ่มดาวในตำนาน
export const constellations: ConstellationPattern[] = [
  {
    id: 'ursa-major',
    name: 'หมีใหญ่',
    nameEn: 'Ursa Major (Big Dipper)',
    stars: [
      { x: 100, y: 150, brightness: 0.8 },
      { x: 150, y: 140, brightness: 0.9 },
      { x: 200, y: 130, brightness: 0.7 },
      { x: 250, y: 120, brightness: 0.8 },
      { x: 280, y: 170, brightness: 0.6 },
      { x: 300, y: 220, brightness: 0.9 },
      { x: 260, y: 260, brightness: 0.7 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]],
    story: 'รูปร่างคล้ายกระบวยน้ำ ใช้หาดาวเหนือได้',
    difficulty: 'easy',
    season: 'ตลอดปี',
    mythology: 'ในตำนานกรีก หมีใหญ่คือ Callisto นางงามที่ถูกแปลงร่างเป็นหมี'
  },
  {
    id: 'orion',
    name: 'นายพราน',
    nameEn: 'Orion',
    stars: [
      { x: 200, y: 100, brightness: 0.9 },
      { x: 180, y: 150, brightness: 0.8 },
      { x: 220, y: 150, brightness: 0.8 },
      { x: 160, y: 200, brightness: 1.0 },
      { x: 200, y: 200, brightness: 0.9 },
      { x: 240, y: 200, brightness: 0.8 },
      { x: 180, y: 250, brightness: 0.7 },
      { x: 220, y: 250, brightness: 0.7 }
    ],
    connections: [[0,1], [0,2], [1,3], [2,5], [3,4], [4,5], [3,6], [5,7]],
    story: 'นายพรานยืนถือดาบและโล่ มีเข็มขัด 3 ดวงเรียงกัน',
    difficulty: 'medium',
    season: 'ฤดูหนาว',
    mythology: 'นายพรานผู้กล้าหาญที่โอ้อวดจะล่าสัตว์ป่าทุกตัวบนโลก'
  },
  {
    id: 'cassiopeia',
    name: 'แคสสิโอเปีย',
    nameEn: 'Cassiopeia',
    stars: [
      { x: 100, y: 200, brightness: 0.8 },
      { x: 150, y: 180, brightness: 0.9 },
      { x: 200, y: 160, brightness: 0.8 },
      { x: 250, y: 180, brightness: 0.7 },
      { x: 300, y: 200, brightness: 0.8 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4]],
    story: 'รูปตัว W หรือ M เห็นได้ชัดในท้องฟ้าเหนือ',
    difficulty: 'easy',
    season: 'ตลอดปี',
    mythology: 'ราชินีผู้หยิ่งที่อวดลูกสาวสวยกว่านางฟ้าทั้งหลาย'
  },
  {
    id: 'scorpius',
    name: 'แมงป่อง',
    nameEn: 'Scorpius',
    stars: [
      { x: 150, y: 100, brightness: 1.0 },
      { x: 170, y: 130, brightness: 0.8 },
      { x: 190, y: 160, brightness: 0.7 },
      { x: 210, y: 190, brightness: 0.8 },
      { x: 240, y: 220, brightness: 0.6 },
      { x: 270, y: 240, brightness: 0.7 },
      { x: 300, y: 250, brightness: 0.8 },
      { x: 320, y: 270, brightness: 0.6 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7]],
    story: 'แมงป่องยักษ์ที่มีหางงุ้มโค้ง ดาว Antares เป็นหัวใจสีแดง',
    difficulty: 'hard',
    season: 'ฤดูร้อน',
    mythology: 'แมงป่องที่ฆ่านายพราน Orion ด้วยพิษ จึงไม่ปรากฏพร้อมกันในท้องฟ้า'
  }
];

// ข้อเท็จจริงอวกาศที่น่าทึ่ง
export const spaceFacts: SpaceFact[] = [
  {
    id: 'neutron-star',
    category: 'shocking',
    title: 'นิวตรอนสตาร์หนักมหาศาล!',
    description: 'นิวตรอนสตาร์เพียง 1 ช้อนชา หนักเท่าภูเขาเอเวอเรสต์ 900 ล้านตัน! ความหนาแน่นสุดขีดที่จินตนาการไม่ถึง',
    emoji: '🌟',
    difficulty: 'expert'
  },
  {
    id: 'diamond-rain',
    category: 'beautiful',
    title: 'ฝนเพชรบนดาวเนปจูนและดาวยูเรนัส',
    description: 'ความกดดันและอุณหภูมิสุดขั้วทำให้คาร์บอนกลายเป็นเพชร ตกลงมาเป็นฝนเพชรที่สวยงามและล้ำค่า',
    emoji: '💎',
    difficulty: 'intermediate'
  },
  {
    id: 'sound-in-space',
    category: 'mysterious',
    title: 'อวกาศไม่มีเสียง... จริงหรือ?',
    description: 'อวกาศไม่มีอากาศจึงไม่มีเสียง แต่ NASA แปลงคลื่นแม่เหล็กจากดาวเคราะห์เป็นเสียงได้ กลายเป็นเพลงอวกาศที่ลึกลับ',
    emoji: '🔇',
    difficulty: 'beginner'
  },
  {
    id: 'galactic-year',
    category: 'record',
    title: 'ปีกาแล็กซี่ยาวนานมหาศาล',
    description: 'ระบบสุริยะใช้เวลา 225-250 ล้านปี ในการโคจรรอบใจกลางกาแล็กซี่ครบ 1 รอบ เรียกว่า "ปีกาแล็กซี่"',
    emoji: '🌌',
    difficulty: 'intermediate'
  },
  {
    id: 'water-in-space',
    category: 'discovery',
    title: 'น้ำในอวกาศมากกว่าที่คิด!',
    description: 'ค้นพบน้ำในรูปไอน้ำลอยอยู่ในอวกาศ และในดวงจันทร์หลายดวง มีน้ำมากกว่าในมหาสมุทรโลกทั้งหมด',
    emoji: '💧',
    difficulty: 'beginner'
  },
  {
    id: 'black-hole-time',
    category: 'mysterious',
    title: 'หลุมดำบิดเบือนเวลา',
    description: 'ยิ่งเข้าใกล้หลุมดำ เวลาจะยิ่งช้าลง ถ้าตกลงไป จะเห็นจักรวาลเร่งความเร็วและแก่ชราในพริบตา',
    emoji: '🕳️',
    difficulty: 'expert'
  },
  {
    id: 'mars-sunset',
    category: 'beautiful',
    title: 'พระอาทิตย์ตกสีฟ้าบนดาวอังคาร',
    description: 'บรรยากาศบางและฝุ่นละอองบนดาวอังคาร ทำให้พระอาทิตย์ตกเป็นสีฟ้า ตรงข้ามกับโลกที่เป็นสีแดง-ส้ม',
    emoji: '🌅',
    difficulty: 'beginner'
  },
  {
    id: 'space-smell',
    category: 'shocking',
    title: 'อวกาศมีกลิ่น!?',
    description: 'นักบินอวกาศรายงานว่าชุดอวกาศมีกลิ่น "เหล็กร้อน" และ "เนื้อย่าง" หลังกลับจากการเดินอวกาศ',
    emoji: '👃',
    difficulty: 'intermediate'
  }
];

// คลื่นลูกอุกกาบาตสำหรับเกม Asteroid Dodge
export const asteroidWaves: AsteroidWave[] = [
  {
    id: 'gentle-shower',
    name: 'ฝนดาวเคราะห์น้อยเบาๆ',
    speed: 1.0,
    density: 0.3,
    powerUps: ['shield', 'speed-boost'],
    difficultyLevel: 1
  },
  {
    id: 'metal-storm',
    name: 'พายุเหล็กจากดาวเคราะห์น้อย',
    speed: 1.5,
    density: 0.5,
    specialEffect: 'magnetic-pull',
    powerUps: ['shield', 'laser', 'slow-motion'],
    difficultyLevel: 3
  },
  {
    id: 'ice-comet-trail',
    name: 'หางดาวหางน้ำแข็ง',
    speed: 2.0,
    density: 0.4,
    specialEffect: 'ice-crystals',
    powerUps: ['freeze-time', 'shield', 'teleport'],
    difficultyLevel: 4
  },
  {
    id: 'volcanic-debris',
    name: 'เศษภูเขาไฟอวกาศ',
    speed: 1.8,
    density: 0.7,
    specialEffect: 'fire-trail',
    powerUps: ['fire-immunity', 'boost', 'phase-through'],
    difficultyLevel: 5
  },
  {
    id: 'crystalline-field',
    name: 'สนามผลึกพลังงาน',
    speed: 2.5,
    density: 0.6,
    specialEffect: 'energy-burst',
    powerUps: ['energy-shield', 'crystal-power', 'time-warp'],
    difficultyLevel: 7
  },
  {
    id: 'final-frontier',
    name: 'เขตแดนสุดท้าย',
    speed: 3.0,
    density: 0.8,
    specialEffect: 'chaos-field',
    powerUps: ['ultimate-shield', 'god-mode', 'reality-breach'],
    difficultyLevel: 10
  }
];

// ไอเทมและพาวเวอร์อัพ
export interface PowerUp {
  id: string;
  name: string;
  description: string;
  emoji: string;
  duration: number; // วินาที
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect: string;
}

export const powerUps: PowerUp[] = [
  {
    id: 'shield',
    name: 'เกราะพลังงาน',
    description: 'ป้องกันการชนครั้งหนึ่ง',
    emoji: '🛡️',
    duration: 0,
    rarity: 'common',
    effect: 'one-time-protection'
  },
  {
    id: 'speed-boost',
    name: 'เครื่องยนต์จรวด',
    description: 'เร่งความเร็วเป็น 2 เท่า',
    emoji: '🚀',
    duration: 5,
    rarity: 'common',
    effect: 'double-speed'
  },
  {
    id: 'slow-motion',
    name: 'ช่วงเวลาช้า',
    description: 'ทำให้เวลาช้าลง',
    emoji: '⏱️',
    duration: 3,
    rarity: 'rare',
    effect: 'slow-time'
  },
  {
    id: 'teleport',
    name: 'วาร์ปอวกาศ',
    description: 'เทเลพอร์ตไปตำแหน่งสุ่ม',
    emoji: '🌀',
    duration: 0,
    rarity: 'epic',
    effect: 'instant-teleport'
  },
  {
    id: 'time-warp',
    name: 'บิดเบือนเวลา',
    description: 'ทำให้เวลาหยุดชั่วคราว',
    emoji: '⚡',
    duration: 2,
    rarity: 'legendary',
    effect: 'freeze-time'
  }
];

// ข้อมูลยานอวกาศ
export interface Spacecraft {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockScore: number;
  stats: {
    speed: number;
    agility: number;
    durability: number;
    special: string;
  };
}

export const spacecrafts: Spacecraft[] = [
  {
    id: 'basic-pod',
    name: 'แคปซูลเบื้องต้น',
    description: 'ยานเริ่มต้นที่เชื่อถือได้',
    emoji: '🛸',
    unlockScore: 0,
    stats: {
      speed: 3,
      agility: 3,
      durability: 3,
      special: 'none'
    }
  },
  {
    id: 'speed-fighter',
    name: 'ไฟท์เตอร์สปีด',
    description: 'เร็วและคล่องตัว',
    emoji: '✈️',
    unlockScore: 500,
    stats: {
      speed: 5,
      agility: 5,
      durability: 2,
      special: 'speed-trail'
    }
  },
  {
    id: 'tank-cruiser',
    name: 'ครูเซอร์ถังเหล็ก',
    description: 'ทนทานและแข็งแกร่ง',
    emoji: '🚁',
    unlockScore: 1000,
    stats: {
      speed: 2,
      agility: 2,
      durability: 5,
      special: 'armor-plating'
    }
  },
  {
    id: 'stealth-phantom',
    name: 'ฟานท่อมล่องหน',
    description: 'หลบหลีกได้ยอดเยี่ยม',
    emoji: '👻',
    unlockScore: 2000,
    stats: {
      speed: 4,
      agility: 5,
      durability: 3,
      special: 'phase-dodge'
    }
  },
  {
    id: 'ultimate-starship',
    name: 'ยานดาวอุลติเมท',
    description: 'ยานในตำนาน สมบูรณ์แบบ',
    emoji: '🌟',
    unlockScore: 5000,
    stats: {
      speed: 5,
      agility: 5,
      durability: 5,
      special: 'reality-breach'
    }
  }
];

// เควสและภารกิจ
export interface Mission {
  id: string;
  title: string;
  description: string;
  objective: string;
  reward: {
    points: number;
    unlock?: string;
    badge?: string;
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

export const missions: Mission[] = [
  {
    id: 'first-steps',
    title: 'ก้าวแรกสู่อวกาศ',
    description: 'เล่นมินิเกมครั้งแรก',
    objective: 'เล่นเกมใดก็ได้ 1 เกม',
    reward: {
      points: 50,
      badge: 'space-rookie'
    },
    difficulty: 'easy'
  },
  {
    id: 'planet-master',
    title: 'มาสเตอร์ดาวเคราะห์',
    description: 'เชี่ยวชาญเกมจับคู่ดาวเคราะห์',
    objective: 'ได้คะแนนเต็ม 100 ในเกม Planet Match',
    reward: {
      points: 200,
      unlock: 'expert-mode',
      badge: 'planet-expert'
    },
    difficulty: 'medium'
  },
  {
    id: 'quiz-champion',
    title: 'แชมป์ควิซระบบสุริยะ',
    description: 'ตอบคำถามได้ครบทุกข้อ',
    objective: 'ตอบถูก 12/12 ข้อในเกม Solar Quiz',
    reward: {
      points: 300,
      unlock: 'master-quiz',
      badge: 'quiz-master'
    },
    difficulty: 'hard'
  },
  {
    id: 'asteroid-survivor',
    title: 'ผู้รอดหลุมดำ',
    description: 'หลบหลีกอุกกาบาตระดับมหากาพย์',
    objective: 'รอดชีวิตในเกม Asteroid Dodge นาน 5 นาที',
    reward: {
      points: 500,
      unlock: 'ultimate-spacecraft',
      badge: 'space-survivor'
    },
    difficulty: 'extreme'
  }
];

export const getConstellationById = (id: string) => 
  constellations.find(constellation => constellation.id === id);

export const getSpaceFactsByCategory = (category: string) => 
  spaceFacts.filter(fact => fact.category === category);

export const getRandomSpaceFact = () => 
  spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

export const getAsteroidWaveByLevel = (level: number) => 
  asteroidWaves.find(wave => wave.difficultyLevel === level) || asteroidWaves[0];

export const getPowerUpById = (id: string) => 
  powerUps.find(powerUp => powerUp.id === id);

export const getSpacecraftById = (id: string) => 
  spacecrafts.find(spacecraft => spacecraft.id === id);

export const getMissionById = (id: string) => 
  missions.find(mission => mission.id === id);
