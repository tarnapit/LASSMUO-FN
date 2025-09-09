export interface LearningModule {
  id: string;
  title: string;
  description: string;
  level: 'Fundamental' | 'Intermediate' | 'Advanced';
  chapters: Chapter[];
  estimatedTime: string;
  thumbnail?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: ChapterContent[];
  estimatedTime: string;
}

// กิจกรรมอินเตอร์แอคทีฟสำหรับการเรียนรู้
export interface InteractiveActivity {
  id: string;
  title: string;
  type: 'matching' | 'fill-blanks' | 'multiple-choice' | 'image-identification' | 'true-false' | 'sentence-ordering' | 'range-answer';
  instruction: string;
  data: MatchingData | FillBlanksData | MultipleChoiceData | ImageIdentificationData | TrueFalseData | SentenceOrderingData | RangeAnswerData;
  points?: number;
  timeLimit?: number; // วินาที
  difficulty?: 'easy' | 'medium' | 'hard'; // ระดับความยาก
  maxAttempts?: number; // จำนวนครั้งที่ลองได้สูงสุด
  passingScore?: number; // คะแนนขั้นต่ำที่ต้องได้
  feedback?: {
    correct: string;
    incorrect: string;
    hint?: string; // คำใบ้เมื่อตอบผิด
  };
}

// ข้อมูลสำหรับเกมจับคู่
export interface MatchingData {
  pairs: Array<{
    left: string;
    right: string;
    explanation?: string;
  }>;
}

// ข้อมูลสำหรับเติมคำในช่องว่าง
export interface FillBlanksData {
  sentence: string; // ประโยคที่มี {blank} แทนช่องว่าง
  options: string[];
  correctAnswers: string[];
  explanation?: string;
}

// ข้อมูลสำหรับปรนัยหลายตัวเลือก
export interface MultipleChoiceData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  image?: string;
}

// ข้อมูลสำหรับการระบุจากภาพ
export interface ImageIdentificationData {
  image: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// ข้อมูลสำหรับคำถามถูกผิด
export interface TrueFalseData {
  statement: string;
  correctAnswer: boolean;
  explanation?: string;
  image?: string;
}

// ข้อมูลสำหรับการเรียงลำดับประโยค
export interface SentenceOrderingData {
  instruction: string;
  sentences: string[];
  correctOrder: number[];
  explanation?: string;
}

// ข้อมูลสำหรับคำตอบตามช่วง
export interface RangeAnswerData {
  question: string;
  min: number;
  max: number;
  correctAnswer: number;
  tolerance?: number; // ค่าความผิดพลาดที่ยอมรับได้
  unit?: string;
  explanation?: string;
}

export interface ChapterContent {
  type: 'text' | 'image' | 'video' | 'interactive' | 'matching' | 'fill-blanks' | 'multiple-choice' | 'image-identification' | 'true-false' | 'sentence-ordering' | 'range-answer';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  // สำหรับกิจกรรมอินเตอร์แอคทีฟ
  activity?: InteractiveActivity;
  // บังคับให้ต้องทำกิจกรรมก่อนไปต่อ
  required?: boolean;
  // คะแนนขั้นต่ำที่ต้องได้เพื่อผ่าน
  minimumScore?: number;
}

export interface LearningProgress {
  moduleId: string;
  chapterId: string;
  completed: boolean;
  score?: number;
  completedAt?: Date;
  timeSpent?: number; // เวลาที่ใช้เรียน (นาที)
  readProgress?: number; // เปอร์เซ็นต์ที่อ่านแล้ว (0-100)
}

export interface ModuleProgress {
  moduleId: string;
  isStarted: boolean;
  isCompleted: boolean;
  completedChapters: string[];
  totalTimeSpent: number; // เวลารวมที่ใช้เรียน (นาที)
  completedAt?: Date;
  chapters: Record<string, LearningProgress>;
}
