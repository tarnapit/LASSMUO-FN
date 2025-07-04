import { PlayerProgress, StageProgress } from '../types/stage';
import { ModuleProgress, LearningProgress } from '../types/learning';
import { QuizProgress, QuizAttempt } from '../types/quiz';
import { authManager } from './auth';

class ProgressManager {
  private tempProgressKey = 'astronomy_temp_progress';
  private userProgressKey = 'astronomy_user_progress';

  // ดึงข้อมูล progress ปัจจุบัน
  getProgress(): PlayerProgress {
    if (authManager.isLoggedIn()) {
      // ถ้าล็อกอินแล้ว ดึงข้อมูลจาก user progress
      return this.getUserProgress();
    } else {
      // ถ้ายังไม่ล็อกอิน ดึงข้อมูลจาก session storage (ชั่วคราว)
      return this.getTempProgress();
    }
  }

  // บันทึก progress
  saveProgress(progress: PlayerProgress): void {
    if (authManager.isLoggedIn()) {
      // ถ้าล็อกอินแล้ว บันทึกถาวร
      this.saveUserProgress(progress);
    } else {
      // ถ้ายังไม่ล็อกอิน บันทึกชั่วคราว
      this.saveTempProgress(progress);
    }
  }

  // ดึงข้อมูล progress ชั่วคราว (sessionStorage - หายเมื่อปิดแท็บ)
  private getTempProgress(): PlayerProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    const saved = sessionStorage.getItem(this.tempProgressKey);
    if (saved) {
      return JSON.parse(saved);
    }

    // ถ้าไม่มีข้อมูล ให้เริ่มต้นด้วย stage 1 ปลดล็อก
    return this.getDefaultProgress();
  }

  // บันทึก progress ชั่วคราว
  private saveTempProgress(progress: PlayerProgress): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.tempProgressKey, JSON.stringify(progress));
    }
  }

  // ดึงข้อมูล progress ของผู้ใช้ที่ล็อกอิน
  private getUserProgress(): PlayerProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    const user = authManager.getCurrentUser();
    if (!user) {
      return this.getDefaultProgress();
    }

    const userKey = `${this.userProgressKey}_${user.id}`;
    const saved = localStorage.getItem(userKey);
    
    if (saved) {
      return JSON.parse(saved);
    }

    // ถ้าไม่มีข้อมูล และมี temp progress อยู่ ให้ migrate ข้อมูล
    const tempProgress = this.getTempProgress();
    if (tempProgress.totalStars > 0 || tempProgress.completedStages.length > 0) {
      this.saveUserProgress(tempProgress);
      this.clearTempProgress();
      return tempProgress;
    }

    return this.getDefaultProgress();
  }

  // บันทึก progress ของผู้ใช้ที่ล็อกอิน
  private saveUserProgress(progress: PlayerProgress): void {
    if (typeof window === 'undefined') return;

    const user = authManager.getCurrentUser();
    if (!user) return;

    const userKey = `${this.userProgressKey}_${user.id}`;
    localStorage.setItem(userKey, JSON.stringify(progress));
  }

  // ลบข้อมูล progress ชั่วคราว
  private clearTempProgress(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.tempProgressKey);
    }
  }

  // Progress เริ่มต้น - stage 1 ปลดล็อกอยู่แล้ว
  private getDefaultProgress(): PlayerProgress {
    return {
      totalStars: 0,
      totalPoints: 0,
      completedStages: [],
      currentStage: 1,
      stages: {
        1: {
          stageId: 1,
          isUnlocked: true, // stage แรกปลดล็อกอยู่แล้ว
          isCompleted: false,
          stars: 0,
          bestScore: 0,
          attempts: 0
        }
      },
      learningProgress: {
        completedModules: [],
        totalLearningTime: 0,
        modules: {}
      },
      quizProgress: {
        quizzes: {}
      }
    };
  }

  // ====== Quiz Progress Methods ======
  
  // บันทึก quiz attempt
  saveQuizAttempt(quizId: string, attempt: QuizAttempt): void {
    const progress = this.getProgress();
    
    // สร้าง quiz progress structure ถ้ายังไม่มี
    if (!progress.quizProgress) {
      progress.quizProgress = { quizzes: {} };
    }
    
    if (!progress.quizProgress.quizzes[quizId]) {
      progress.quizProgress.quizzes[quizId] = {
        quizId,
        attempts: [],
        bestScore: 0,
        bestPercentage: 0,
        totalAttempts: 0,
        passed: false
      };
    }
    
    const quizProgress = progress.quizProgress.quizzes[quizId];
    
    // เพิ่ม attempt ใหม่
    quizProgress.attempts.push(attempt);
    quizProgress.totalAttempts = quizProgress.attempts.length;
    quizProgress.lastAttemptAt = attempt.completedAt;
    
    // อัพเดทคะแนนดีที่สุด
    quizProgress.bestScore = Math.max(quizProgress.bestScore, attempt.score);
    quizProgress.bestPercentage = Math.max(quizProgress.bestPercentage, attempt.percentage);
    
    // อัพเดทสถานะผ่าน
    const previouslyPassed = quizProgress.passed;
    quizProgress.passed = quizProgress.attempts.some(a => a.passed);
    
    // ถ้าผ่าน quiz เป็นครั้งแรก ให้อัพเดท module progress
    if (!previouslyPassed && quizProgress.passed && attempt.passed) {
      const moduleId = this.getModuleIdByQuizId(quizId);
      if (moduleId) {
        this.completeModuleByQuiz(moduleId);
        console.log(`Module ${moduleId} marked as completed due to quiz ${quizId} completion`);
      }
    }
    
    this.saveProgress(progress);
    
    // อัพเดท progress แบบ force เพื่อให้แน่ใจว่า UI จะ refresh
    if (typeof window !== 'undefined') {
      // Trigger a custom event เพื่อบอกให้ components อื่นๆ รู้ว่ามีการอัพเดท progress
      window.dispatchEvent(new CustomEvent('progressUpdated', { 
        detail: { type: 'quiz', quizId, moduleId: this.getModuleIdByQuizId(quizId) }
      }));
    }
  }
  
  // ดึงข้อมูล quiz progress
  getQuizProgress(quizId: string): QuizProgress | null {
    const progress = this.getProgress();
    return progress.quizProgress?.quizzes[quizId] || null;
  }
  
  // ดึงข้อมูล quiz progress ทั้งหมด
  getAllQuizProgress(): Record<string, QuizProgress> {
    const progress = this.getProgress();
    return progress.quizProgress?.quizzes || {};
  }
  
  // ตรวจสอบว่าสามารถทำ quiz ซ้ำได้หรือไม่
  canRetakeQuiz(quizId: string, maxAttempts?: number): boolean {
    if (!maxAttempts) return true;
    
    const quizProgress = this.getQuizProgress(quizId);
    if (!quizProgress) return true;
    
    return quizProgress.totalAttempts < maxAttempts;
  }
  
  // รีเซ็ต quiz progress (สำหรับการพัฒนา/ทดสอบ)
  resetQuizProgress(quizId?: string): void {
    const progress = this.getProgress();
    
    if (!progress.quizProgress) return;
    
    if (quizId) {
      // รีเซ็ตเฉพาะ quiz ที่ระบุ
      delete progress.quizProgress.quizzes[quizId];
    } else {
      // รีเซ็ตทั้งหมด
      progress.quizProgress.quizzes = {};
    }
    
    this.saveProgress(progress);
  }

  // มิเกรตข้อมูล quiz จาก localStorage เก่า
  migrateOldQuizData(): void {
    if (typeof window === 'undefined') return;

    const progress = this.getProgress();
    let hasUpdates = false;

    // รายชื่อ quiz ที่ทราบ
    const knownQuizzes = ['solar-system-quiz', 'earth-structure-quiz', 'stellar-evolution-quiz', 'galaxies-universe-quiz'];

    knownQuizzes.forEach(quizId => {
      const oldKey = `quiz-progress-${quizId}`;
      const oldData = localStorage.getItem(oldKey);
      
      if (oldData) {
        try {
          const oldProgress = JSON.parse(oldData);
          
          // ตรวจสอบว่ามีข้อมูลใหม่แล้วหรือไม่
          if (!progress.quizProgress) {
            progress.quizProgress = { quizzes: {} };
          }
          
          if (!progress.quizProgress.quizzes[quizId] && oldProgress.attempts && oldProgress.attempts.length > 0) {
            // แปลงข้อมูลเก่าเป็นรูปแบบใหม่
            progress.quizProgress.quizzes[quizId] = {
              quizId: oldProgress.quizId,
              attempts: oldProgress.attempts,
              bestScore: oldProgress.bestScore,
              bestPercentage: oldProgress.bestPercentage,
              totalAttempts: oldProgress.totalAttempts,
              passed: oldProgress.passed,
              lastAttemptAt: oldProgress.lastAttemptAt ? new Date(oldProgress.lastAttemptAt) : undefined
            };
            
            hasUpdates = true;
            
            // ถ้าผ่าน quiz แล้ว ให้อัพเดท module progress
            if (oldProgress.passed) {
              const moduleId = this.getModuleIdByQuizId(quizId);
              if (moduleId) {
                this.completeModuleByQuiz(moduleId);
              }
            }
            
            console.log(`Migrated quiz data for ${quizId}:`, oldProgress);
          }
          
          // ลบข้อมูลเก่า
          localStorage.removeItem(oldKey);
        } catch (error) {
          console.error(`Error migrating quiz data for ${quizId}:`, error);
        }
      }
    });

    if (hasUpdates) {
      this.saveProgress(progress);
      console.log('Quiz data migration completed');
    }
  }

  // ฟังก์ชันช่วยเพื่อรับ module id จาก quiz id
  private getModuleIdByQuizId(quizId: string): string | null {
    // ข้อมูลการแมป quiz กับ module (ควรมาจาก quizzes.ts แต่เพื่อความง่ายเราจะ hardcode)
    const quizModuleMapping: Record<string, string> = {
      'solar-system-quiz': 'solar-system',
      'earth-structure-quiz': 'earth-structure',
      'stellar-evolution-quiz': 'stellar-evolution',
      'galaxies-universe-quiz': 'galaxies-universe'
    };
    
    return quizModuleMapping[quizId] || null;
  }

  // อัพเดท module progress เมื่อทำ quiz ผ่าน
  completeModuleByQuiz(moduleId: string): void {
    const progress = this.getProgress();
    
    // สร้าง learning progress structure ถ้ายังไม่มี
    if (!progress.learningProgress) {
      progress.learningProgress = {
        completedModules: [],
        totalLearningTime: 0,
        modules: {}
      };
    }

    // สร้าง module progress ถ้ายังไม่มี
    if (!progress.learningProgress.modules[moduleId]) {
      progress.learningProgress.modules[moduleId] = {
        moduleId,
        isStarted: true,
        isCompleted: false,
        completedChapters: [],
        totalTimeSpent: 0,
        chapters: {}
      };
    }

    const moduleProgress = progress.learningProgress.modules[moduleId];
    
    // ถ้ายังไม่เสร็จ ให้เสร็จสิ้น module
    if (!moduleProgress.isCompleted) {
      moduleProgress.isCompleted = true;
      moduleProgress.completedAt = new Date();

      // เพิ่มใน completed modules ถ้ายังไม่มี
      if (!progress.learningProgress.completedModules.includes(moduleId)) {
        progress.learningProgress.completedModules.push(moduleId);
      }

      // ถ้ายังไม่ได้เรียนเนื้อหาทั้งหมด ให้อัพเดทเป็นเสร็จ (เพื่อให้แสดง 100%)
      // สมมุติว่า Solar System มี 3 chapters
      const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
      expectedChapters.forEach(chapterId => {
        if (!moduleProgress.completedChapters.includes(chapterId)) {
          moduleProgress.completedChapters.push(chapterId);
        }
        
        // เพิ่ม chapter progress ถ้ายังไม่มี
        if (!moduleProgress.chapters[chapterId]) {
          moduleProgress.chapters[chapterId] = {
            chapterId,
            moduleId,
            completed: true,
            readProgress: 100,
            timeSpent: 0,
            completedAt: new Date()
          };
        } else {
          moduleProgress.chapters[chapterId].completed = true;
          moduleProgress.chapters[chapterId].readProgress = 100;
        }
      });
    }

    this.saveProgress(progress);
  }

  // ฟังก์ชันช่วยเพื่อรับ chapter ids ที่คาดหวังตาม module (เปิดเป็น public)
  getExpectedChaptersByModuleId(moduleId: string): string[] {
    try {
      // อ่านข้อมูลจาก learning modules จริง
      const { learningModules } = require('../data/learning-modules');
      const module = learningModules.find((m: any) => m.id === moduleId);
      
      if (module && module.chapters) {
        return module.chapters.map((chapter: any) => chapter.id);
      }
    } catch (error) {
      console.warn('Error loading learning modules data, using fallback:', error);
    }
    
    // Fallback ถ้าอ่านข้อมูลไม่ได้
    const moduleChapters: Record<string, string[]> = {
      'solar-system': ['chapter-1', 'chapter-2', 'chapter-3'],
      'earth-structure': ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4'],
      'stellar-evolution': ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4'],
      'galaxies-universe': ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4']
    };
    
    return moduleChapters[moduleId] || [];
  }

  // ====== Stage Progress Methods ======

  // อัพเดท progress เมื่อจบด่าน
  completeStage(stageId: number, stars: number, score: number): PlayerProgress {
    const progress = this.getProgress();
    
    // อัพเดท stage ปัจจุบัน
    if (!progress.stages[stageId]) {
      progress.stages[stageId] = {
        stageId,
        isUnlocked: true,
        isCompleted: false,
        stars: 0,
        bestScore: 0,
        attempts: 0
      };
    }

    const stageProgress = progress.stages[stageId];
    const previousBestScore = stageProgress.bestScore;
    const previousStars = stageProgress.stars;
    
    stageProgress.attempts++;
    stageProgress.lastAttempt = new Date();
    
    // อัพเดทคะแนนดีที่สุด
    stageProgress.bestScore = Math.max(stageProgress.bestScore, score);
    
    // ตรวจสอบว่าผ่านด่านหรือไม่ (ต้องได้อย่างน้อย 1 คะแนน)
    if (score > 0) {
      stageProgress.isCompleted = true;
      // อัพเดทจำนวนดาว (เลือกจำนวนที่มากกว่า)
      stageProgress.stars = Math.max(stageProgress.stars, stars);

      // เพิ่มในรายการ completed stages ถ้าไม่มีและเป็นครั้งแรกที่ผ่าน
      if (!progress.completedStages.includes(stageId)) {
        progress.completedStages.push(stageId);
      }

      // อัพเดท total points (เฉพาะเมื่อได้คะแนนดีกว่าเดิม)
      if (score > previousBestScore) {
        const scoreDifference = score - previousBestScore;
        progress.totalPoints += scoreDifference;
      }

      // ปลดล็อก stage ถัดไป (เฉพาะเมื่อผ่านด่าน)
      const nextStageId = stageId + 1;
      if (nextStageId <= 5) {
        if (!progress.stages[nextStageId]) {
          progress.stages[nextStageId] = {
            stageId: nextStageId,
            isUnlocked: true,
            isCompleted: false,
            stars: 0,
            bestScore: 0,
            attempts: 0
          };
        } else {
          progress.stages[nextStageId].isUnlocked = true;
        }
      }
    }

    // อัพเดท total stars โดยนับจากทุก stage
    progress.totalStars = Object.values(progress.stages).reduce((sum, stage) => sum + stage.stars, 0);

    // บันทึก progress
    this.saveProgress(progress);
    
    return progress;
  }

  // ====== Learning Progress Methods ======

  // เริ่มการเรียน module ใหม่
  startLearningModule(moduleId: string): void {
    const progress = this.getProgress();
    
    if (!progress.learningProgress) {
      progress.learningProgress = {
        completedModules: [],
        totalLearningTime: 0,
        modules: {}
      };
    }

    if (!progress.learningProgress.modules[moduleId]) {
      progress.learningProgress.modules[moduleId] = {
        moduleId,
        isStarted: true,
        isCompleted: false,
        completedChapters: [],
        totalTimeSpent: 0,
        chapters: {}
      };
    } else {
      progress.learningProgress.modules[moduleId].isStarted = true;
    }

    this.saveProgress(progress);
  }

  // อัพเดต progress ของ chapter
  updateChapterProgress(
    moduleId: string, 
    chapterId: string, 
    readProgress: number = 100,
    timeSpent: number = 0,
    isCompleted: boolean = true
  ): PlayerProgress {
    const progress = this.getProgress();
    
    if (!progress.learningProgress) {
      progress.learningProgress = {
        completedModules: [],
        totalLearningTime: 0,
        modules: {}
      };
    }

    if (!progress.learningProgress.modules[moduleId]) {
      this.startLearningModule(moduleId);
    }

    const moduleProgress = progress.learningProgress.modules[moduleId];

    // อัพเดท chapter progress
    moduleProgress.chapters[chapterId] = {
      moduleId,
      chapterId,
      completed: isCompleted,
      readProgress,
      timeSpent,
      completedAt: isCompleted ? new Date() : undefined
    };

    // อัพเดท completed chapters
    if (isCompleted && !moduleProgress.completedChapters.includes(chapterId)) {
      moduleProgress.completedChapters.push(chapterId);
    }

    // อัพเดทเวลารวม
    moduleProgress.totalTimeSpent += timeSpent;
    progress.learningProgress.totalLearningTime += timeSpent;

    this.saveProgress(progress);
    return progress;
  }

  // จบการเรียน module
  completeModule(moduleId: string, totalChapters: number): PlayerProgress {
    const progress = this.getProgress();
    
    if (!progress.learningProgress?.modules[moduleId]) {
      return progress;
    }

    const moduleProgress = progress.learningProgress.modules[moduleId];
    
    // ตรวจสอบว่าจบทุก chapter แล้วหรือไม่
    if (moduleProgress.completedChapters.length >= totalChapters) {
      moduleProgress.isCompleted = true;
      moduleProgress.completedAt = new Date();

      // เพิ่มใน completed modules ถ้ายังไม่มี
      if (!progress.learningProgress.completedModules.includes(moduleId)) {
        progress.learningProgress.completedModules.push(moduleId);
      }
    }

    this.saveProgress(progress);
    return progress;
  }

  // ดึงข้อมูล learning progress ของ module
  getModuleProgress(moduleId: string): ModuleProgress | null {
    const progress = this.getProgress();
    return progress.learningProgress?.modules[moduleId] || null;
  }

  // ดึงข้อมูล chapter progress
  getChapterProgress(moduleId: string, chapterId: string): LearningProgress | null {
    const moduleProgress = this.getModuleProgress(moduleId);
    return moduleProgress?.chapters[chapterId] || null;
  }

  // คำนวณเปอร์เซ็นต์ความคืบหน้าของ module
  getModuleCompletionPercentage(moduleId: string, totalChapters?: number): number {
    const moduleProgress = this.getModuleProgress(moduleId);
    if (!moduleProgress) return 0;

    // ถ้าไม่ได้ระบุ totalChapters ให้ดึงจากข้อมูล modules จริง
    if (!totalChapters) {
      const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
      totalChapters = expectedChapters.length;
    }

    if (totalChapters === 0) return 0;

    // คำนวณความคืบหน้าจากการอ่านเนื้อหา (60% ของคะแนนรวม)
    const completedChapters = moduleProgress.completedChapters.length;
    const readingProgress = (completedChapters / totalChapters) * 60;

    // คำนวณความคืบหน้าจากแบบฝึกหัด/แบบทดสอบ (40% ของคะแนนรวม)
    const quizProgress = this.getModuleQuizProgress(moduleId);
    
    const totalProgress = readingProgress + quizProgress;
    
    // ถ้าได้ 100% จริงๆ (อ่านครบ + ทำ quiz ได้เต็ม) ถึงจะแสดง 100%
    // มิฉะนั้นให้แสดงคะแนนจริง แต่ไม่เกิน 99% ถ้ายังไม่ perfect
    if (this.isModulePerfect(moduleId)) {
      return 100;
    } else {
      return Math.round(Math.min(totalProgress, 99));
    }
  }

  // คำนวณความคืบหน้าจากแบบฝึกหัด/แบบทดสอบของ module
  getModuleQuizProgress(moduleId: string): number {
    const progress = this.getProgress();
    if (!progress.quizProgress) return 0;

    // ค้นหา quiz ที่เกี่ยวข้องกับ module นี้
    const moduleQuizzes = Object.values(progress.quizProgress.quizzes).filter(
      quiz => this.getModuleIdByQuizId(quiz.quizId) === moduleId
    );

    if (moduleQuizzes.length === 0) return 0;

    // คำนวณคะแนนเฉลี่ยจาก quiz ทั้งหมดของ module
    let totalScore = 0;
    let quizCount = 0;

    moduleQuizzes.forEach(quiz => {
      if (quiz.attempts && quiz.attempts.length > 0) {
        // ใช้คะแนนดีที่สุด
        totalScore += quiz.bestPercentage;
        quizCount++;
      }
    });

    if (quizCount === 0) return 0;

    // คืนค่าเป็น 40% ของคะแนนรวม (เนื่องจาก quiz คิดเป็น 40% ของ progress)
    const averageQuizScore = totalScore / quizCount;
    const quizProgressContribution = (averageQuizScore / 100) * 40;
    
    // Debug log
    console.log(`Module ${moduleId} quiz progress:`, {
      moduleQuizzes: moduleQuizzes.length,
      averageQuizScore,
      quizProgressContribution,
      quizDetails: moduleQuizzes.map(q => ({ id: q.quizId, bestPercentage: q.bestPercentage }))
    });
    
    return quizProgressContribution;
  }

  // ตรวจสอบว่า module ผ่านเกณฑ์หรือไม่ (70%)
  isModulePassed(moduleId: string): boolean {
    const totalProgress = this.getModuleCompletionPercentage(moduleId);
    return totalProgress >= 70;
  }

  // ตรวจสอบว่า module เสร็จสมบูรณ์ 100% หรือไม่
  isModulePerfect(moduleId: string): boolean {
    const moduleProgress = this.getModuleProgress(moduleId);
    if (!moduleProgress) return false;

    // ต้องอ่านเนื้อหาครบทุก chapter
    const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
    const hasReadAllChapters = moduleProgress.completedChapters.length >= expectedChapters.length && expectedChapters.length > 0;

    // ต้องทำ quiz ได้คะแนนเต็ม (100%)
    const progress = this.getProgress();
    if (!progress.quizProgress) return false;

    const moduleQuizzes = Object.values(progress.quizProgress.quizzes).filter(
      quiz => this.getModuleIdByQuizId(quiz.quizId) === moduleId
    );

    // ถ้าไม่มี quiz ให้ถือว่าไม่ perfect (เพราะไม่มีการทดสอบ)
    if (moduleQuizzes.length === 0) return false;

    const hasPassedAllQuizzesWithPerfectScore = moduleQuizzes.every(quiz => 
      quiz.attempts && quiz.attempts.length > 0 && quiz.bestPercentage === 100
    );

    return hasReadAllChapters && hasPassedAllQuizzesWithPerfectScore;
  }

  // ตรวจสอบและอัพเดท module progress เมื่อเสร็จสิ้น chapters ทั้งหมด
  checkAndCompleteModule(moduleId: string): void {
    const progress = this.getProgress();
    
    // สร้าง learning progress structure ถ้ายังไม่มี
    if (!progress.learningProgress) {
      progress.learningProgress = {
        completedModules: [],
        totalLearningTime: 0,
        modules: {}
      };
    }

    const moduleProgress = progress.learningProgress.modules[moduleId];
    
    if (!moduleProgress || moduleProgress.isCompleted) return;

    const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
    const completedChapters = moduleProgress.completedChapters.length;

    // ตรวจสอบว่าเรียนจบทุก chapter และผ่านเกณฑ์รวม 70% แล้วหรือไม่
    const hasReadAllChapters = completedChapters >= expectedChapters.length && expectedChapters.length > 0;
    const hasPassedOverallCriteria = this.isModulePassed(moduleId); // ใช้การตรวจสอบเกณฑ์รวม

    // ถ้าผ่านทั้งการอ่านและเกณฑ์รวม ให้ mark เป็น completed
    if (hasReadAllChapters && hasPassedOverallCriteria) {
      moduleProgress.isCompleted = true;
      moduleProgress.completedAt = new Date();

      // เพิ่มใน completed modules ถ้ายังไม่มี
      if (!progress.learningProgress.completedModules.includes(moduleId)) {
        progress.learningProgress.completedModules.push(moduleId);
      }

      this.saveProgress(progress);
      
      console.log(`Module ${moduleId} completed automatically - all chapters finished and passed overall criteria`);
    }
  }

  // ตรวจสอบว่าทำ quiz ของ module ผ่านเกณฑ์แล้วหรือไม่
  hasPassedModuleQuiz(moduleId: string): boolean {
    const progress = this.getProgress();
    if (!progress.quizProgress) return false;

    // ค้นหา quiz ที่เกี่ยวข้องกับ module นี้
    const moduleQuizzes = Object.values(progress.quizProgress.quizzes).filter(
      quiz => this.getModuleIdByQuizId(quiz.quizId) === moduleId
    );

    // ถ้าไม่มี quiz สำหรับ module นี้ ให้ถือว่าผ่าน
    if (moduleQuizzes.length === 0) return true;

    // ตรวจสอบว่าผ่านเกณฑ์ 70% ใน quiz อย่างน้อย 1 ข้อ
    return moduleQuizzes.some(quiz => quiz.passed && quiz.bestPercentage >= 70);
  }

  // ดึงสถิติการเรียนรู้รวม
  getLearningStats() {
    const progress = this.getProgress();
    
    if (!progress.learningProgress) {
      return {
        totalModulesStarted: 0,
        totalModulesCompleted: 0,
        totalLearningTime: 0,
        averageModuleProgress: 0
      };
    }

    const modules = Object.values(progress.learningProgress.modules);
    const startedModules = modules.filter(m => m.isStarted);
    const completedModules = modules.filter(m => m.isCompleted);
    
    const averageProgress = modules.length > 0
      ? modules.reduce((sum, module) => {
          // สมมุติว่า module มี 3 chapters โดยเฉลี่ย
          const totalChapters = 3;
          const completion = (module.completedChapters.length / totalChapters) * 100;
          return sum + completion;
        }, 0) / modules.length
      : 0;

    return {
      totalModulesStarted: startedModules.length,
      totalModulesCompleted: completedModules.length,
      totalLearningTime: progress.learningProgress.totalLearningTime,
      averageModuleProgress: Math.round(averageProgress)
    };
  }

  // ====== Merge and Migration Methods ======

  // ผสาน progress ชั่วคราวกับ progress ของผู้ใช้
  mergeTempWithUserProgress(): void {
    if (typeof window === 'undefined') return;
    
    const tempProgress = this.getTempProgress();
    const userProgress = this.getUserProgress();

    // ถ้าไม่มี temp progress ให้ข้าม
    if (tempProgress.totalStars === 0 && tempProgress.completedStages.length === 0) {
      return;
    }

    // ผสาน progress โดยเลือกค่าที่ดีกว่า
    const mergedProgress: PlayerProgress = { ...userProgress };

    // Merge basic stats
    mergedProgress.totalStars = Math.max(tempProgress.totalStars, userProgress.totalStars);
    mergedProgress.totalPoints = Math.max(tempProgress.totalPoints, userProgress.totalPoints);
    mergedProgress.currentStage = Math.max(tempProgress.currentStage, userProgress.currentStage);
    
    // Merge completed stages
    mergedProgress.completedStages = [...new Set([...tempProgress.completedStages, ...userProgress.completedStages])];

    // Merge learning progress
    if (tempProgress.learningProgress) {
      if (!mergedProgress.learningProgress) {
        mergedProgress.learningProgress = {
          completedModules: [],
          totalLearningTime: 0,
          modules: {}
        };
      }

      // Merge completed modules
      mergedProgress.learningProgress.completedModules = [
        ...new Set([
          ...tempProgress.learningProgress.completedModules,
          ...mergedProgress.learningProgress.completedModules
        ])
      ];

      // Merge total learning time
      mergedProgress.learningProgress.totalLearningTime = 
        tempProgress.learningProgress.totalLearningTime + mergedProgress.learningProgress.totalLearningTime;

      // Merge stages
      Object.keys(tempProgress.stages).forEach(stageId => {
        const tempStage = tempProgress.stages[parseInt(stageId)];
        const userStage = mergedProgress.stages[parseInt(stageId)];

        if (!userStage) {
          mergedProgress.stages[parseInt(stageId)] = tempStage;
        } else {
          mergedProgress.stages[parseInt(stageId)] = {
            stageId: parseInt(stageId),
            isUnlocked: tempStage.isUnlocked || userStage.isUnlocked,
            isCompleted: tempStage.isCompleted || userStage.isCompleted,
            stars: Math.max(tempStage.stars, userStage.stars),
            bestScore: Math.max(tempStage.bestScore, userStage.bestScore),
            attempts: tempStage.attempts + userStage.attempts,
            lastAttempt: tempStage.lastAttempt && userStage.lastAttempt 
              ? new Date(Math.max(tempStage.lastAttempt.getTime(), userStage.lastAttempt.getTime()))
              : tempStage.lastAttempt || userStage.lastAttempt
          };
        }
      });

      // Merge learning modules
      Object.keys(tempProgress.learningProgress.modules).forEach(moduleId => {
        const tempModule = tempProgress.learningProgress!.modules[moduleId];
        const userModule = mergedProgress.learningProgress!.modules[moduleId];

        if (!userModule) {
          mergedProgress.learningProgress!.modules[moduleId] = tempModule;
        } else {
          // Merge module progress
          mergedProgress.learningProgress!.modules[moduleId] = {
            moduleId,
            isStarted: tempModule.isStarted || userModule.isStarted,
            isCompleted: tempModule.isCompleted || userModule.isCompleted,
            completedChapters: [...new Set([...tempModule.completedChapters, ...userModule.completedChapters])],
            totalTimeSpent: tempModule.totalTimeSpent + userModule.totalTimeSpent,
            completedAt: tempModule.completedAt && userModule.completedAt
              ? new Date(Math.max(tempModule.completedAt.getTime(), userModule.completedAt.getTime()))
              : tempModule.completedAt || userModule.completedAt,
            chapters: { ...userModule.chapters, ...tempModule.chapters }
          };
        }
      });

      // Merge quiz progress
      if (tempProgress.quizProgress) {
        if (!mergedProgress.quizProgress) {
          mergedProgress.quizProgress = { quizzes: {} };
        }
        
        Object.keys(tempProgress.quizProgress.quizzes).forEach(quizId => {
          const tempQuiz = tempProgress.quizProgress!.quizzes[quizId];
          const userQuiz = mergedProgress.quizProgress!.quizzes[quizId];

          if (!userQuiz) {
            mergedProgress.quizProgress!.quizzes[quizId] = tempQuiz;
          } else {
            // Merge quiz progress
            const allAttempts = [...userQuiz.attempts, ...tempQuiz.attempts];

            mergedProgress.quizProgress!.quizzes[quizId] = {
              quizId,
              attempts: allAttempts,
              bestScore: Math.max(tempQuiz.bestScore, userQuiz.bestScore),
              bestPercentage: Math.max(tempQuiz.bestPercentage, userQuiz.bestPercentage),
              totalAttempts: allAttempts.length,
              passed: tempQuiz.passed || userQuiz.passed,
              lastAttemptAt: tempQuiz.lastAttemptAt && userQuiz.lastAttemptAt
                ? new Date(Math.max(tempQuiz.lastAttemptAt.getTime(), userQuiz.lastAttemptAt.getTime()))
                : tempQuiz.lastAttemptAt || userQuiz.lastAttemptAt
            };
          }
        });
      }

      this.saveUserProgress(mergedProgress);
      this.clearTempProgress();
    }
  }
}

export const progressManager = new ProgressManager();
