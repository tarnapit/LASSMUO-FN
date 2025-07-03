import { PlayerProgress, StageProgress } from '../types/stage';
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
      }
    };
  }

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
    const previousBestScore = stageProgress.bestScore; // เก็บคะแนนเก่าก่อนอัพเดท
    const previousStars = stageProgress.stars; // เก็บจำนวนดาวเก่า
    
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
      if (nextStageId <= 5) { // เปลี่ยนจาก 10 เป็น 5 ตาม stage ที่มีจริง
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
    
    // Debug log เพื่อตรวจสอบ
    console.log('Progress updated:', {
      stageId,
      stars,
      score,
      previousStars,
      newStars: stageProgress.stars,
      previousBestScore,
      newBestScore: stageProgress.bestScore,
      totalStars: progress.totalStars,
      totalPoints: progress.totalPoints,
      allStages: Object.fromEntries(
        Object.entries(progress.stages).map(([id, stage]) => [id, { stars: stage.stars, isCompleted: stage.isCompleted }])
      )
    });
    
    return progress;
  }

  // ปลดล็อก stage เฉพาะ (สำหรับ admin หรือ special cases)
  unlockStage(stageId: number): void {
    const progress = this.getProgress();
    
    if (!progress.stages[stageId]) {
      progress.stages[stageId] = {
        stageId,
        isUnlocked: true,
        isCompleted: false,
        stars: 0,
        bestScore: 0,
        attempts: 0
      };
    } else {
      progress.stages[stageId].isUnlocked = true;
    }

    this.saveProgress(progress);
  }

  // แก้ไขข้อมูล progress ที่มีปัญหา (สำหรับแก้ bug)
  fixProgressData(): PlayerProgress {
    const progress = this.getProgress();
    
    // ตรวจสอบและแก้ไขแต่ละ stage ที่ completed แต่ไม่มีดาว
    Object.values(progress.stages).forEach(stage => {
      if (stage.isCompleted && stage.stars === 0 && stage.bestScore > 0) {
        // คำนวณดาวใหม่จากคะแนน
        // bestScore คือคะแนนรวม เช่น 30 คะแนน (3 ข้อ x 10 คะแนน)
        const maxScore = 30; // 3 ข้อ x 10 คะแนน
        const correctAnswers = stage.bestScore / 10; // หาจำนวนข้อที่ตอบถูก
        const totalQuestions = 3;
        const percentage = (correctAnswers / totalQuestions) * 100;
        
        // ใช้เกณฑ์ใหม่: ตอบถูกทุกข้อ = 3 ดาว
        const calculatedStars = percentage >= 100 ? 3 : percentage >= 80 ? 2 : percentage >= 50 ? 1 : 0;
        
        // ถ้าผ่านด่านแล้ว (isCompleted = true) ให้ได้อย่างน้อย 1 ดาว
        stage.stars = Math.max(calculatedStars, 1);
        
        console.log(`Fixed stage ${stage.stageId}: bestScore=${stage.bestScore}, correctAnswers=${correctAnswers}, percentage=${percentage.toFixed(2)}%, calculated stars=${calculatedStars}, final stars=${stage.stars}`);
      }
    });
    
    // คำนวณ totalStars ใหม่
    progress.totalStars = Object.values(progress.stages).reduce((sum, stage) => sum + stage.stars, 0);
    
    this.saveProgress(progress);
    console.log('Progress data fixed:', progress);
    
    return progress;
  }

  // รีเซ็ต progress (สำหรับ dev หรือ reset ข้อมูล)
  resetProgress(): void {
    const defaultProgress = this.getDefaultProgress();
    this.saveProgress(defaultProgress);
  }

  // Migrate temp progress เมื่อผู้ใช้ล็อกอิน
  migrateProgressOnLogin(): void {
    if (!authManager.isLoggedIn()) return;

    const tempProgress = this.getTempProgress();
    
    // ถ้ามี progress ชั่วคราวที่ดีกว่า ให้ migrate
    if (tempProgress.totalStars > 0 || tempProgress.completedStages.length > 0) {
      const userProgress = this.getUserProgress();
      
      // เลือกค่าที่ดีกว่าจาก temp และ user progress
      const mergedProgress: PlayerProgress = {
        totalStars: Math.max(tempProgress.totalStars, userProgress.totalStars),
        totalPoints: Math.max(tempProgress.totalPoints, userProgress.totalPoints),
        completedStages: [...new Set([...tempProgress.completedStages, ...userProgress.completedStages])],
        currentStage: Math.max(tempProgress.currentStage, userProgress.currentStage),
        stages: { ...userProgress.stages }
      };

      // Merge stages โดยเลือกค่าที่ดีกว่า
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

      this.saveUserProgress(mergedProgress);
      this.clearTempProgress();
    }
  }
}

export const progressManager = new ProgressManager();
