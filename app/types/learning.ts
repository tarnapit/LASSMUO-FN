// Learning types updated to match database schema

// Core Learning Module type based on Course table
export interface LearningModule {
  id: string; // Course.id
  title: string; // Course.title
  description: string; // Course.description
  level: 'Fundamental' | 'Intermediate' | 'Advanced'; // Course.level
  estimatedTime: string; // Course.estimatedTime in minutes, display as string
  coverImage?: string; // Course.coverImage
  isActive: boolean; // Course.isActive
  createAt: string; // Course.createAt
  chapters: Chapter[]; // From CourseLesson
}

// Chapter based on CourseLesson table
export interface Chapter {
  id: string; // CourseLesson.id
  courseId: string; // CourseLesson.courseId
  title: string; // CourseLesson.title
  estimatedTime: string; // CourseLesson.estimatedTime
  content: ChapterContent[]; // From CourseDetail
  createdAt: string; // CourseLesson.createdAt
  updatedAt?: string; // CourseLesson.updatedAt
}

// Chapter content based on CourseDetail table
export interface ChapterContent {
  id: string; // CourseDetail.id
  courseLessonId: string; // CourseDetail.courseLessonId
  type: 'text' | 'image' | 'video' | 'interactive' | 'quiz';
  content: string; // CourseDetail.content
  imageUrl?: string; // CourseDetail.ImageUrl
  required: boolean; // CourseDetail.required
  score: number; // CourseDetail.score
  createdAt: string; // CourseDetail.createdAt
  updatedAt: string; // CourseDetail.updatedAt
  // สำหรับกิจกรรม quiz
  activity?: InteractiveActivity;
  // คะแนนขั้นต่ำที่ต้องได้เพื่อผ่าน
  minimumScore?: number;
}

// Quiz activity based on CourseQuiz table
export interface InteractiveActivity {
  id: string; // CourseQuiz.id
  courseDetailId: string; // CourseQuiz.courseDetailId
  title: string; // CourseQuiz.title
  type: 'multiple-choice' | 'fill-blanks' | 'matching' | 'sentence-ordering' | 'true-false' | 'image-identification' | 'range-answer'; // CourseQuiz.type
  instruction: string; // CourseQuiz.instruction
  maxAttempts: number; // CourseQuiz.maxAttempts
  passingScore: number; // CourseQuiz.passingScore
  timeLimite: number; // CourseQuiz.timeLimite (note: typo in DB)
  difficulty: 'Easy' | 'Medium' | 'Hard'; // CourseQuiz.difficulty
  data: any; // CourseQuiz.data (JSON field)
  point: number; // CourseQuiz.point
  feedback: any; // CourseQuiz.feedback (JSON field)
  createdAt: string; // CourseQuiz.createdAt
  updatedAt: string; // CourseQuiz.updatedAt
}

// กิจกรรมอินเตอร์แอคทีฟสำหรับการเรียนรู้ (Legacy types for compatibility)
export interface MatchingData {
  pairs: Array<{
    left: string;
    right: string;
    explanation?: string;
  }>;
}

export interface FillBlanksData {
  sentence: string; // ประโยคที่มี {blank} แทนช่องว่าง
  options: string[];
  correctAnswers: string[];
  explanation?: string;
}

export interface MultipleChoiceData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  image?: string;
}

export interface ImageIdentificationData {
  image: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TrueFalseData {
  statement: string;
  correctAnswer: boolean;
  explanation?: string;
  image?: string;
}

export interface SentenceOrderingData {
  instruction: string;
  sentences: string[];
  correctOrder: number[];
  explanation?: string;
}

export interface RangeAnswerData {
  question: string;
  min: number;
  max: number;
  correctAnswer: number;
  tolerance?: number; // ค่าความผิดพลาดที่ยอมรับได้
  unit?: string;
  explanation?: string;
}

// User progress based on UserCourseProgress table
export interface LearningProgress {
  id: string; // UserCourseProgress.id
  userId: string; // UserCourseProgress.userId
  courseId: string; // UserCourseProgress.courseId
  courseLessonId: string; // UserCourseProgress.courseLessonId
  courseDetailId: string; // UserCourseProgress.courseDetailId
  isCompleted: boolean; // UserCourseProgress.isCompleted
  score: number; // UserCourseProgress.score
  createdAt: string; // UserCourseProgress.createdAt
  // Additional computed fields
  moduleId?: string;
  chapterId?: string;
  completed?: boolean;
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
  chapters: Record<string, ChapterProgress>;
}

// Chapter progress เฉพาะสำหรับ local storage
export interface ChapterProgress {
  moduleId: string;
  chapterId: string;
  completed: boolean;
  readProgress: number; // เปอร์เซ็นต์ที่อ่านแล้ว (0-100)
  timeSpent: number; // เวลาที่ใช้เรียน (นาที)
  completedAt?: Date;
}
