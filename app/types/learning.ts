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

export interface ChapterContent {
  type: 'text' | 'image' | 'video' | 'interactive';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
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
