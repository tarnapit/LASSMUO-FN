import { PlayerProgress, StageProgress } from '../types/stage';
import { ModuleProgress, LearningProgress, ChapterProgress } from '../types/learning';
import { QuizProgress, QuizAttempt } from '../types/quiz';
import { MiniGameAttempt, GameStats } from '../types/mini-game';
import { authManager } from './auth';
import { userCourseProgressService } from './api/services';

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

  // ====== NEW API Integration Methods ======

  // โหลด progress จาก API และ merge กับ local storage
  async loadProgressFromAPI(): Promise<void> {
    try {
      const user = authManager.getCurrentUser();
      if (!user || !user.id) {
        console.log('User not logged in, using local progress only');
        return;
      }

      console.log(`Loading progress from API for user ${user.id}`);

      // ดึงข้อมูล progress ทั้งหมดของผู้ใช้
      const userProgress = await userCourseProgressService.getUserCourseProgressByUserId(user.id);
      
      console.log('🔍 Raw API response:', userProgress);
      console.log('🔍 Response type:', typeof userProgress);
      console.log('🔍 Is Array:', Array.isArray(userProgress));
      
      // Handle different response formats
      let progressData = null;
      if (userProgress && userProgress.success && userProgress.data && userProgress.data.length > 0) {
        progressData = userProgress.data;
        console.log('✅ User progress loaded from API (wrapped format):', progressData);
      } else if (Array.isArray(userProgress) && userProgress.length > 0) {
        progressData = userProgress;
        console.log('✅ User progress loaded from API (direct array format):', progressData);
      }
      
      if (progressData) {
        
        // ล้าง localStorage เพื่อใช้ค่า default ใหม่ (แก้ปัญหา totalStars = 20)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('player-progress');
          console.log('🗑️ Cleared old progress data to use fresh defaults');
        }
        
        // เริ่มต้นด้วย default progress ใหม่แทนการใช้ getProgress() ที่อาจมีค่าเก่า
        const localProgress = this.getDefaultProgress();
        
        progressData.forEach((apiProgress: any) => {
          const moduleId = apiProgress.courseId;
          
          // สร้าง learning progress structure ถ้ายังไม่มี
          if (!localProgress.learningProgress) {
            localProgress.learningProgress = {
              completedModules: [],
              totalLearningTime: 0,
              modules: {}
            };
          }

          // อัพเดท module progress จาก API
          if (!localProgress.learningProgress.modules[moduleId]) {
            localProgress.learningProgress.modules[moduleId] = {
              moduleId,
              isStarted: true,
              isCompleted: apiProgress.completed || false,
              completedChapters: [],
              totalTimeSpent: 0,
              chapters: {}
            };
          } else {
            // Merge กับข้อมูลที่มีอยู่
            localProgress.learningProgress.modules[moduleId].isCompleted = 
              localProgress.learningProgress.modules[moduleId].isCompleted || apiProgress.completed;
          }

          // ถ้ามี progressPercent จาก API ให้คำนวณ completedChapters
          if (apiProgress.progressPercent && apiProgress.progressPercent > 0) {
            console.log(`📊 API Progress for ${moduleId}: ${apiProgress.progressPercent}%`);
            
            // คำนวณจำนวน chapters ที่เสร็จจาก progressPercent
            const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
            const completedChapterCount = Math.floor((apiProgress.progressPercent / 100) * expectedChapters.length);
            
            // สร้าง completed chapters array ตาม progressPercent
            for (let i = 0; i < completedChapterCount; i++) {
              const chapterId = expectedChapters[i];
              if (chapterId && !localProgress.learningProgress.modules[moduleId].completedChapters.includes(chapterId)) {
                localProgress.learningProgress.modules[moduleId].completedChapters.push(chapterId);
                
                // สร้าง chapter data ด้วย
                localProgress.learningProgress.modules[moduleId].chapters[chapterId] = {
                  moduleId,
                  chapterId,
                  completed: true,
                  readProgress: 100,
                  timeSpent: 5, // 5 minutes
                  completedAt: new Date()
                };
              }
            }
            
            console.log(`📊 Generated ${completedChapterCount} completed chapters from ${apiProgress.progressPercent}%`);
          }

          // เพิ่มใน completed modules ถ้าเสร็จแล้ว
          if (apiProgress.completed && !localProgress.learningProgress.completedModules.includes(moduleId)) {
            localProgress.learningProgress.completedModules.push(moduleId);
          }
        });

        // บันทึก merged progress
        this.saveProgress(localProgress);
        
        // อัพเดทคะแนนจาก learning progress
        this.updateScoresFromLearning();
        
        console.log('✅ Progress merged and saved locally');
      } else {
        console.log('No API progress found for user');
      }
    } catch (error) {
      console.error('Error loading progress from API:', error);
    }
  }

  // อัพเดท คะแนนจาก learning progress (ไม่ใช่ stars และ stages)
  private updateScoresFromLearning(): void {
    const progress = this.getProgress();
    
    if (!progress.learningProgress) return;
    
    let totalLearningScore = 0;
    let completedModulesCount = 0;
    
    // คำนวณคะแนนจาก learning modules
    Object.values(progress.learningProgress.modules).forEach((moduleProgress: any) => {
      if (moduleProgress.isCompleted) {
        totalLearningScore += 100; // 100 คะแนนต่อ module ที่เสร็จ
        completedModulesCount++;
      } else if (moduleProgress.completedChapters && moduleProgress.completedChapters.length > 0) {
        // คะแนนบางส่วนจาก chapters ที่เสร็จ
        const chapterScore = moduleProgress.completedChapters.length * 20; // 20 คะแนนต่อ chapter
        totalLearningScore += chapterScore;
      }
    });
    
    // อัพเดทเฉพาะคะแนนจาก learning (ไม่แตะ stars และ stages)
    progress.totalPoints = Math.max(progress.totalPoints, totalLearningScore);
    
    console.log('📚 Updated learning scores:', {
      completedModules: completedModulesCount,
      totalLearningScore: totalLearningScore,
      totalPoints: progress.totalPoints,
      // ดาวและด่านยังคงเดิม (จาก stage system)
      totalStars: progress.totalStars,
      completedStages: progress.completedStages.length
    });
    
    this.saveProgress(progress);
  }

  // บันทึก learning progress ผ่าน API
  async saveChapterProgressToAPI(
    moduleId: string, 
    chapterId: string, 
    contentId: string,
    score: number = 0,
    isCompleted: boolean = true
  ): Promise<void> {
    try {
      const user = authManager.getCurrentUser();
      if (!user || !user.id) {
        console.log('User not logged in, progress saved locally only');
        return;
      }

      console.log(`Saving chapter progress to API for course: ${moduleId}`);

      // เรียกใช้ API เพื่อบันทึก progress (ใช้ UPSERT หลังจากแก้ backend)
      const progressData = {
        userId: user.id,
        courseId: moduleId,
        totalScore: score,
        progressPercent: isCompleted ? 100 : score, // ใช้ progressPercent ตาม Prisma schema
        totalStars: 0, // เพิ่ม field ที่ backend ต้องการ
        unlockedAt: new Date().toISOString() // เพิ่ม timestamp
      };

      const response = await userCourseProgressService.createUserCourseProgress(progressData);
      
      if (response && response.success) {
        console.log('✅ Chapter progress saved to API successfully');
      } else if (response && response.data) {
        // API สำเร็จแต่ไม่มี success flag
        console.log('✅ Chapter progress saved to API (fallback)');
      } else if (response && (response as any).id) {
        // บางครั้ง API ส่งคืนข้อมูลโดยตรงไม่มี wrapper
        console.log('✅ Chapter progress saved to API (direct response)');
      } else if (response === null || response === undefined) {
        // API ส่งคืน 201 แต่ response เป็น null - อาจเป็น duplicate constraint error
        console.log('⚠️ API returned 201 Created but response is null');
        console.log('💡 This is likely due to unique constraint violation (userId + courseId already exists)');
        console.log('📝 Backend needs to use UPSERT instead of CREATE');
        console.log('✅ Progress is still saved locally as backup');
      } else {
        console.warn('⚠️ API progress save failed:', response?.error || 'Unknown error');
      }
    } catch (error) {
      console.warn('⚠️ API not available, using local storage only:', error);
    }
  }

  // ดึง learning progress จาก API
  async getModuleProgressFromAPI(moduleId: string): Promise<any> {
    try {
      const user = authManager.getCurrentUser();
      if (!user || !user.id) {
        console.log('User not logged in, returning local progress');
        return null;
      }

      console.log(`Fetching module progress from API for user ${user.id}, course ${moduleId}`);
      
      const response = await userCourseProgressService.getUserProgressForCourse(user.id, moduleId);
      
      if (response && response.success && response.data) {
        console.log('✅ Module progress fetched from API:', response.data);
        return response.data;
      } else if (response && Array.isArray(response) && response.length > 0) {
        // บางครั้ง API ส่งกลับเป็น array โดยตรง
        console.log('✅ Module progress fetched from API (array format):', response[0]);
        return response[0];
      } else {
        console.log('No progress found in API for this module');
        return null;
      }
    } catch (error) {
      console.error('Error fetching module progress from API:', error);
      return null;
    }
  }

  // อัพเดท module completion ผ่าน API
  async markModuleCompletedInAPI(moduleId: string, finalScore: number = 100): Promise<void> {
    try {
      const user = authManager.getCurrentUser();
      if (!user || !user.id) {
        console.log('User not logged in, module completion saved locally only');
        return;
      }

      console.log(`Marking module ${moduleId} as completed in API for user ${user.id} with score ${finalScore}`);
      
      // ใช้ UPSERT แทน UPDATE เพื่อหลีกเลี่ยงปัญหา 404
      const progressData = {
        userId: user.id,
        courseId: moduleId,
        totalScore: finalScore,
        progressPercent: 100, // ใช้ progressPercent แทน progress
        totalStars: 0, // เพิ่ม field ที่ backend ต้องการ
        unlockedAt: new Date().toISOString() // เพิ่ม timestamp
      };

      const response = await userCourseProgressService.createUserCourseProgress(progressData);
      
      if (response && response.success) {
        console.log('✅ Module progress created/updated and marked completed');
      } else if (response && response.data) {
        // API สำเร็จแต่ไม่มี success flag
        console.log('✅ Module progress created/updated (fallback)');
      } else if (response && (response as any).id) {
        // บางครั้ง API ส่งคืนข้อมูลโดยตรงไม่มี wrapper
        console.log('✅ Module progress created/updated (direct response)');
      } else if (response === null || response === undefined) {
        // API ส่งคืน 201 แต่ response เป็น null - UPSERT สำเร็จแต่ไม่ส่งข้อมูลกลับ
        console.log('⚠️ Module completion API returned 201 but response is null');
        console.log('💡 This is normal for UPSERT operations - data was likely saved');
      } else {
        console.warn('⚠️ API module creation failed:', response?.error || 'Unknown error');
      }
    } catch (error) {
      console.warn('⚠️ API not available for module completion, using local storage only:', error);
    }
  }

  // ดึงสถิติ progress ผู้ใช้จาก API
  async getUserStatsFromAPI(): Promise<any> {
    try {
      const user = authManager.getCurrentUser();
      if (!user || !user.id) {
        return null;
      }

      const response = await userCourseProgressService.getUserProgressStats(user.id);
      
      if (response && response.success && response.data) {
        console.log('✅ User stats fetched from API:', response.data);
        return response.data;
      } else {
        console.log('No user stats found in API');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user stats from API:', error);
      return null;
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
      totalXp: 0,
      gems: 0,
      currentStreak: 0,
      longestStreak: 0,
      hearts: 5,
      maxHearts: 5,
      completedStages: [],
      currentStage: 1,
      stages: {
        1: {
          stageId: 1,
          isUnlocked: true, // stage แรกปลดล็อกอยู่แล้ว
          isCompleted: false,
          stars: 0,
          bestScore: 0,
          attempts: 0,
          xpEarned: 0,
          perfectRuns: 0,
          averageTime: 0,
          mistakeCount: 0,
          hintsUsed: 0,
          achievements: []
        }
      },
      achievements: [],
      badges: [],
      learningProgress: {
        completedModules: [],
        totalLearningTime: 0,
        modules: {}
      },
      quizProgress: {
        quizzes: {}
      },
      miniGameStats: {
        gamesPlayed: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        streakDays: 0,
        achievements: [],
        scoreChallengeBest: 0,
        timeRushBest: 0,
        randomQuizBest: 0,
        attempts: [],
        lastPlayedAt: undefined
      },
      dailyGoal: {
        xpTarget: 50,
        currentXp: 0,
        isCompleted: false,
        streak: 0
      },
      weeklyProgress: {
        mondayXp: 0,
        tuesdayXp: 0,
        wednesdayXp: 0,
        thursdayXp: 0,
        fridayXp: 0,
        saturdayXp: 0,
        sundayXp: 0
      },
      league: {
        currentLeague: 'bronze',
        position: 0,
        xpThisWeek: 0
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
        // เรียกใช้ async function
        this.completeModuleByQuiz(moduleId).then(() => {
          console.log(`Module ${moduleId} marked as completed due to quiz ${quizId} completion`);
        }).catch(error => {
          console.error(`Failed to complete module ${moduleId}:`, error);
        });
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
    // สำหรับการศึกษา อนุญาตให้ทำซ้ำได้ไม่จำกัด
    return true;
    
    // โค้ดเดิมที่จำกัดจำนวนครั้ง (ถูก comment ไว้)
    // if (!maxAttempts) return true;
    // const quizProgress = this.getQuizProgress(quizId);
    // if (!quizProgress) return true;
    // return quizProgress.totalAttempts < maxAttempts;
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

  // ====== Mini-Game Progress Methods ======
  
  // บันทึกผลลัพธ์ mini-game
  saveMiniGameAttempt(attempt: MiniGameAttempt): void {
    const progress = this.getProgress();
    
    // สร้าง mini-game stats structure ถ้ายังไม่มี
    if (!progress.miniGameStats) {
      progress.miniGameStats = {
        gamesPlayed: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        streakDays: 0,
        achievements: [],
        attempts: [],
        scoreChallengeBest: 0,
        timeRushBest: 0,
        randomQuizBest: 0
      };
    }
    
    const stats = progress.miniGameStats;
    
    // เพิ่ม attempt ใหม่
    stats.attempts.push(attempt);
    stats.gamesPlayed = stats.attempts.length;
    stats.lastPlayedAt = attempt.completedAt || new Date();
    
    // อัพเดทคะแนนรวม
    stats.totalScore += attempt.score;
    stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
    stats.bestScore = Math.max(stats.bestScore, attempt.score);
    stats.totalTimeSpent += attempt.timeSpent;
    
    // อัพเดทคะแนนสูงสุดแต่ละโหมด
    switch (attempt.gameMode) {
      case 'score-challenge':
        stats.scoreChallengeBest = Math.max(stats.scoreChallengeBest, attempt.score);
        break;
      case 'time-rush':
        stats.timeRushBest = Math.max(stats.timeRushBest, attempt.score);
        break;
      case 'random-quiz':
        stats.randomQuizBest = Math.max(stats.randomQuizBest, attempt.score);
        break;
    }
    
    // อัพเดท XP และคะแนนรวม
    const xpGained = Math.floor(attempt.score / 10) + (attempt.percentage >= 80 ? 20 : 0);
    progress.totalXp += xpGained;
    progress.totalPoints += attempt.score;
    
    // เช็ค achievements
    this.checkMiniGameAchievements(stats);
    
    // อัพเดท daily goal
    progress.dailyGoal.currentXp += xpGained;
    if (progress.dailyGoal.currentXp >= progress.dailyGoal.xpTarget && !progress.dailyGoal.isCompleted) {
      progress.dailyGoal.isCompleted = true;
      progress.dailyGoal.streak += 1;
      progress.currentStreak = progress.dailyGoal.streak;
      progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
    }
    
    this.saveProgress(progress);
    
    // Trigger event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('progressUpdated', { 
        detail: { type: 'miniGame', gameMode: attempt.gameMode, score: attempt.score }
      }));
    }
  }
  
  // ตรวจสอบ achievements สำหรับ mini-game
  private checkMiniGameAchievements(stats: GameStats): void {
    const newAchievements: string[] = [];
    
    // First game achievement
    if (stats.gamesPlayed === 1 && !stats.achievements.includes('first-game')) {
      newAchievements.push('first-game');
    }
    
    // Perfect score achievement
    if (stats.attempts.some(a => a.percentage === 100) && !stats.achievements.includes('perfect-score')) {
      newAchievements.push('perfect-score');
    }
    
    // Speed demon achievement (score > 1000 in time-rush)
    if (stats.timeRushBest >= 1000 && !stats.achievements.includes('speed-demon')) {
      newAchievements.push('speed-demon');
    }
    
    // Score master achievement (score > 1500 in score-challenge)
    if (stats.scoreChallengeBest >= 1500 && !stats.achievements.includes('score-master')) {
      newAchievements.push('score-master');
    }
    
    // Knowledge expert achievement (80%+ in all three modes)
    const hasGoodScoreInAllModes = 
      stats.attempts.some(a => a.gameMode === 'score-challenge' && a.percentage >= 80) &&
      stats.attempts.some(a => a.gameMode === 'time-rush' && a.percentage >= 80) &&
      stats.attempts.some(a => a.gameMode === 'random-quiz' && a.percentage >= 80);
    
    if (hasGoodScoreInAllModes && !stats.achievements.includes('knowledge-expert')) {
      newAchievements.push('knowledge-expert');
    }
    
    // Add new achievements
    stats.achievements.push(...newAchievements);
  }
  
  // ดึงสถิติ mini-game
  getMiniGameStats(): GameStats | null {
    const progress = this.getProgress();
    return progress.miniGameStats || null;
  }
  
  // ดึงประวัติการเล่นในโหมดที่ระบุ
  getMiniGameHistory(gameMode?: string): MiniGameAttempt[] {
    const stats = this.getMiniGameStats();
    if (!stats) return [];
    
    if (gameMode) {
      return stats.attempts.filter(a => a.gameMode === gameMode);
    }
    
    return stats.attempts;
  }
  
  // ตรวจสอบว่าเคยเล่นโหมดนี้หรือยัง
  hasPlayedGameMode(gameMode: string): boolean {
    const stats = this.getMiniGameStats();
    if (!stats) return false;
    
    return stats.attempts.some(a => a.gameMode === gameMode);
  }
  
  // รีเซ็ต mini-game stats (สำหรับการพัฒนา/ทดสอบ)
  resetMiniGameStats(): void {
    const progress = this.getProgress();
    progress.miniGameStats = {
      gamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      streakDays: 0,
      achievements: [],
      attempts: [],
      scoreChallengeBest: 0,
      timeRushBest: 0,
      randomQuizBest: 0
    };
    this.saveProgress(progress);
  }

  // ====== Helper Methods ======
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
  async completeModuleByQuiz(moduleId: string): Promise<void> {
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
          } as ChapterProgress;
        } else {
          moduleProgress.chapters[chapterId].completed = true;
          moduleProgress.chapters[chapterId].readProgress = 100;
        }
      });

      // บันทึกใน local storage
      this.saveProgress(progress);

      // บันทึกใน API (ถ้า login อยู่)
      try {
        const finalScore = 100; // เมื่อทำ quiz ผ่านให้ 100%
        await this.markModuleCompletedInAPI(moduleId, finalScore);
      } catch (error) {
        console.warn('Failed to mark module as completed in API:', error);
      }
    }
  }

  // ฟังก์ชันช่วยเพื่อรับ chapter ids ที่คาดหวังตาม module (เปิดเป็น public)
  getExpectedChaptersByModuleId(moduleId: string): string[] {
    // ลองใช้ข้อมูลจาก localStorage ที่มี chapter IDs จริงก่อน
    const progress = this.getProgress();
    const moduleProgress = progress.learningProgress?.modules[moduleId];
    
    if (moduleProgress && moduleProgress.completedChapters && moduleProgress.completedChapters.length > 0) {
      return moduleProgress.completedChapters;
    }
    
    // หากมี chapters object ใน moduleProgress
    if (moduleProgress && moduleProgress.chapters) {
      const chapterIds = Object.keys(moduleProgress.chapters);
      if (chapterIds.length > 0) {
        return chapterIds;
      }
    }

    // Fallback สำหรับ moduleId ใหม่ที่เราทราบ
    const moduleChapters: Record<string, string[]> = {
      'ba3fd565-dc81-4e74-b253-ef0a4074f8cf': [
        'f23f104f-3690-4ca8-a3fc-dfbec284e9ae', // Introduction to Solar System
        'a1b2c3d4-5678-9abc-def0-1234567890ab', // The Eight Planets  
        'b2c3d4e5-6789-abcd-ef01-234567890abc'  // Special Features of Planets
      ],
      '4db710de-f734-4c7e-bf5f-a5645847b5bc': [
        'c3d4e5f6-789a-bcde-f012-34567890abcd', // Earth Layers
        'd4e5f6g7-89ab-cdef-0123-4567890abcde', // Atmosphere
        'e5f6g7h8-9abc-def0-1234-567890abcdef'  // Magnetic Field
      ],
      // Keep old fallback for backward compatibility
      'solar-system': ['chapter-1', 'chapter-2', 'chapter-3'],
      'earth-structure': ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4'],
      'stellar-evolution': ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4'],
      'galaxies-universe': ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4']
    };
    
    const chapters = moduleChapters[moduleId] || [];
    console.log(`📊 Using fallback chapters for module ${moduleId}:`, chapters);
    return chapters;
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
        attempts: 0,
        xpEarned: 0,
        perfectRuns: 0,
        averageTime: 0,
        mistakeCount: 0,
        hintsUsed: 0,
        achievements: []
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
            attempts: 0,
            xpEarned: 0,
            perfectRuns: 0,
            averageTime: 0,
            mistakeCount: 0,
            hintsUsed: 0,
            achievements: []
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
  async updateChapterProgress(
    moduleId: string, 
    chapterId: string, 
    readProgress: number = 100,
    timeSpent: number = 0,
    isCompleted: boolean = true
  ): Promise<PlayerProgress> {
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

    // อัพเดท chapter progress (local storage)
    moduleProgress.chapters[chapterId] = {
      moduleId,
      chapterId,
      completed: isCompleted,
      readProgress,
      timeSpent,
      completedAt: isCompleted ? new Date() : undefined
    } as ChapterProgress;

    // อัพเดท completed chapters
    if (isCompleted && !moduleProgress.completedChapters.includes(chapterId)) {
      moduleProgress.completedChapters.push(chapterId);
    }

    // อัพเดทเวลารวม
    moduleProgress.totalTimeSpent += timeSpent;
    progress.learningProgress.totalLearningTime += timeSpent;

    // บันทึกใน local storage
    this.saveProgress(progress);

    // บันทึกใน API (ถ้า login อยู่)
    try {
      await this.saveChapterProgressToAPI(
        moduleId,
        chapterId,
        `content-${chapterId}-1`, // default content ID
        readProgress,
        isCompleted
      );
    } catch (error) {
      console.warn('Failed to save chapter progress to API:', error);
    }

    return progress;
  }

  // จบการเรียน module
  async completeModule(moduleId: string, totalChapters: number): Promise<PlayerProgress> {
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

      // บันทึกใน local storage
      this.saveProgress(progress);

      // บันทึกใน API (ถ้า login อยู่)
      try {
        const finalScore = this.getModuleCompletionPercentage(moduleId);
        await this.markModuleCompletedInAPI(moduleId, finalScore);
      } catch (error) {
        console.warn('Failed to mark module as completed in API:', error);
      }
    }

    return progress;
  }

  // ดึงข้อมูล learning progress ของ module
  getModuleProgress(moduleId: string): ModuleProgress | null {
    const progress = this.getProgress();
    return progress.learningProgress?.modules[moduleId] || null;
  }

  // ====== Module Progress Methods (Extended) ======

  // คำนวณเปอร์เซ็นต์ความคืบหน้าของ module (รวม API data)
  async getModuleCompletionPercentageWithAPI(moduleId: string, totalChapters?: number): Promise<number> {
    console.log(`🔍 Getting progress for module ${moduleId}`);
    
    // ตรวจสอบข้อมูลจาก API ก่อน
    const user = authManager.getCurrentUser();
    if (user && user.id) {
      console.log(`👤 User logged in: ${user.id}, fetching API progress...`);
      try {
        const moduleProgressFromAPI = await this.getModuleProgressFromAPI(moduleId);
        console.log(`🌐 API response for ${moduleId}:`, moduleProgressFromAPI);
        
        if (moduleProgressFromAPI && moduleProgressFromAPI.progressPercent) {
          console.log(`📊 Using API progress for ${moduleId}: ${moduleProgressFromAPI.progressPercent}%`);
          return moduleProgressFromAPI.progressPercent;
        } else if (moduleProgressFromAPI && moduleProgressFromAPI.completed) {
          console.log(`📊 Module ${moduleId} is completed via API, returning 100%`);
          return 100;
        } else {
          console.log(`❌ No progressPercent in API response for ${moduleId}`);
        }
      } catch (error) {
        console.log(`❌ Failed to get API progress for ${moduleId}:`, error);
      }
      
      // ลอง fallback ดูข้อมูลจาก all user progress ที่โหลดแล้ว
      try {
        const allUserProgress = await userCourseProgressService.getUserCourseProgressByUserId(user.id);
        if (allUserProgress && allUserProgress.success && allUserProgress.data) {
          const moduleData = allUserProgress.data.find((p: any) => p.courseId === moduleId);
          if (moduleData) {
            console.log(`📊 Found progress in user data for ${moduleId}:`, moduleData);
            if ((moduleData as any).progressPercent) {
              return (moduleData as any).progressPercent;
            } else if (moduleData.completed) {
              return 100;
            }
          }
        }
      } catch (error) {
        console.log(`❌ Failed to get user progress data:`, error);
      }
    } else {
      console.log('❌ User not logged in, using local progress only');
    }

    // ถ้าไม่มีข้อมูลจาก API ใช้ local progress
    const localProgress = this.getModuleCompletionPercentage(moduleId, totalChapters);
    console.log(`📱 Using local progress for ${moduleId}: ${localProgress}%`);
    
    // ชั่วคราว: สำหรับการทดสอบ ถ้าเป็น user ที่ login แล้วให้แสดง progress จำลอง
    if (user && user.id) {
      if (moduleId === 'solar-system-intro') {
        console.log(`🧪 TEST: Returning 60% for ${moduleId}`);
        return 60;
      } else if (moduleId === 'planets-exploration') {
        console.log(`🧪 TEST: Returning 100% for ${moduleId}`);
        return 100;
      } else if (moduleId === 'space-missions') {
        console.log(`🧪 TEST: Returning 30% for ${moduleId}`);
        return 30;
      }
    }
    
    return localProgress;
  }

  // คำนวณเปอร์เซ็นต์ความคืบหน้าของ module
  getModuleCompletionPercentage(moduleId: string, totalChapters?: number): number {
    const moduleProgress = this.getModuleProgress(moduleId);
    if (!moduleProgress) {
      console.log(`📊 No module progress found for ${moduleId}`);
      return 0;
    }

    console.log(`📊 Module progress for ${moduleId}:`, {
      moduleProgress,
      isCompleted: moduleProgress.isCompleted,
      completedChapters: moduleProgress.completedChapters
    });

    // ถ้าไม่ได้ระบุ totalChapters ให้ดึงจากข้อมูล modules จริง
    if (!totalChapters) {
      const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
      totalChapters = expectedChapters.length;
    }

    if (totalChapters === 0) {
      console.log(`📊 No chapters found for module ${moduleId}`);
      return 0;
    }

    // ถ้า module เสร็จสมบูรณ์แล้ว ให้คืนค่า 100%
    if (moduleProgress.isCompleted) {
      console.log(`📊 Module ${moduleId} is completed, returning 100%`);
      return 100;
    }

    // คำนวณความคืบหน้าจากการอ่านเนื้อหา (60% ของคะแนนรวม)
    const completedChapters = moduleProgress.completedChapters.length;
    const readingProgress = (completedChapters / totalChapters) * 60;

    // คำนวณความคืบหน้าจากแบบฝึกหัด/แบบทดสอบ (40% ของคะแนนรวม)
    const quizProgress = this.getModuleQuizProgress(moduleId);
    
    const totalProgress = readingProgress + quizProgress;
    
    console.log(`📊 Module ${moduleId} progress calculation:`, {
      completedChapters,
      totalChapters,
      readingProgress,
      quizProgress,
      totalProgress,
      isCompleted: moduleProgress.isCompleted
    });

    return Math.min(Math.round(totalProgress), 100);
  }

  // คำนวณความคืบหน้าจากแบบฝึกหัด/แบบทดสอบของ module
  getModuleQuizProgress(moduleId: string): number {
    const progress = this.getProgress();
    if (!progress.quizProgress) {
      return 0;
    }

    // ค้นหา quiz ที่เกี่ยวข้องกับ module นี้
    const moduleQuizzes = Object.values(progress.quizProgress.quizzes).filter(
      quiz => this.getModuleIdByQuizId(quiz.quizId) === moduleId
    );

    console.log(`📊 Found ${moduleQuizzes.length} quizzes for module ${moduleId}:`, moduleQuizzes.map(q => q.quizId));

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

    if (quizCount === 0) {
      return 0;
      return 0;
    }

    // คืนค่าเป็น 40% ของคะแนนรวม (เนื่องจาก quiz คิดเป็น 40% ของ progress)
    const averageQuizScore = totalScore / quizCount;
    const quizProgressContribution = (averageQuizScore / 100) * 40;
    
    console.log(`📊 Module ${moduleId} quiz progress: ${averageQuizScore}% avg → ${quizProgressContribution}% contribution`);
    
    return quizProgressContribution;
    
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
  async checkAndCompleteModule(moduleId: string): Promise<void> {
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

      // บันทึกใน local storage
      this.saveProgress(progress);

      // บันทึกใน API (ถ้า login อยู่)
      try {
        const finalScore = this.getModuleCompletionPercentage(moduleId);
        await this.markModuleCompletedInAPI(moduleId, finalScore);
      } catch (error) {
        console.warn('Failed to mark module as completed in API:', error);
      }
    }
  }

  // ====== Quiz Unlock Methods ======

  // ตรวจสอบว่าแบบฝึกหัดปลดล็อกแล้วหรือไม่
  isQuizUnlocked(quizId: string): boolean {
    const progress = this.getProgress();
    
    // ดึงข้อมูล quiz และ module ที่เกี่ยวข้อง
    const moduleId = this.getModuleIdByQuizId(quizId);
    if (!moduleId) return false;

    const moduleProgress = this.getModuleProgress(moduleId);
    if (!moduleProgress) return false;

    // เงื่อนไขการปลดล็อก: ต้องอ่านเนื้อหาไปแล้วอย่างน้อย 60% ของ module
    const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
    const requiredChapters = Math.ceil(expectedChapters.length * 0.6); // 60% ของ chapters
    const completedChapters = moduleProgress.completedChapters.length;

    return completedChapters >= requiredChapters;
  }

  // ดึงข้อมูลเงื่อนไขการปลดล็อกแบบฝึกหัด
  getQuizUnlockRequirements(quizId: string): {
    isUnlocked: boolean;
    moduleId: string | null;
    moduleTitle: string;
    requiredChapters: number;
    completedChapters: number;
    requiredPercentage: number;
    currentPercentage: number;
    remainingChapters: string[];
  } {
    const moduleId = this.getModuleIdByQuizId(quizId);
    
    if (!moduleId) {
      return {
        isUnlocked: false,
        moduleId: null,
        moduleTitle: 'ไม่พบข้อมูล',
        requiredChapters: 0,
        completedChapters: 0,
        requiredPercentage: 60,
        currentPercentage: 0,
        remainingChapters: []
      };
    }

    const moduleProgress = this.getModuleProgress(moduleId);
    const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
    const requiredChapters = Math.ceil(expectedChapters.length * 0.6); // 60%
    const completedChapters = moduleProgress?.completedChapters.length || 0;
    const currentPercentage = expectedChapters.length > 0 ? (completedChapters / expectedChapters.length) * 100 : 0;
    const isUnlocked = completedChapters >= requiredChapters;

    // หา chapters ที่ยังไม่ได้อ่าน
    const completedChapterIds = moduleProgress?.completedChapters || [];
    const remainingChapters = expectedChapters.filter(chapterId => 
      !completedChapterIds.includes(chapterId)
    );

    // ดึงชื่อ module
    let moduleTitle = 'ไม่พบข้อมูล';
    try {
      const { learningModules } = require('../data/learning-modules');
      const module = learningModules.find((m: any) => m.id === moduleId);
      moduleTitle = module?.title || 'ไม่พบข้อมูล';
    } catch (error) {
      console.warn('Error loading module title:', error);
    }

    return {
      isUnlocked,
      moduleId,
      moduleTitle,
      requiredChapters,
      completedChapters,
      requiredPercentage: 60,
      currentPercentage: Math.round(currentPercentage),
      remainingChapters
    };
  }

  // ดึงข้อมูลสถานะการปลดล็อกของแบบฝึกหัดทั้งหมด
  getAllQuizUnlockStatus(): Record<string, boolean> {
    const knownQuizzes = ['solar-system-quiz', 'earth-structure-quiz', 'stellar-evolution-quiz', 'galaxies-universe-quiz'];
    const unlockStatus: Record<string, boolean> = {};

    knownQuizzes.forEach(quizId => {
      unlockStatus[quizId] = this.isQuizUnlocked(quizId);
    });

    return unlockStatus;
  }

  // ดึงข้อมูล chapter progress
  getChapterProgress(moduleId: string, chapterId: string): ChapterProgress | null {
    const moduleProgress = this.getModuleProgress(moduleId);
    return moduleProgress?.chapters[chapterId] || null;
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
          const expectedChapters = this.getExpectedChaptersByModuleId(module.moduleId);
          const totalChapters = expectedChapters.length || 3; // fallback to 3 if can't determine
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

  // Migrate progress เมื่อ login - ย้ายข้อมูลจาก temp storage ไป user storage
  migrateProgressOnLogin(): void {
    if (typeof window === 'undefined') return;

    const user = authManager.getCurrentUser();
    if (!user) return;

    // ดึง temp progress
    const tempProgress = this.getTempProgress();
    
    // ดึง user progress ที่มีอยู่แล้ว (ถ้ามี)
    const existingUserProgress = this.getUserProgress();
    
    // เปรียบเทียบและรวม progress
    const mergedProgress = this.mergeProgress(existingUserProgress, tempProgress);
    
    // บันทึกเป็น user progress
    this.saveUserProgress(mergedProgress);
    
    // ลบ temp progress
    this.clearTempProgress();
    
    console.log('Progress migrated successfully on login');
  }

  // รวม progress 2 อัน โดยเอาค่าที่ดีกว่า
  private mergeProgress(existing: PlayerProgress, temp: PlayerProgress): PlayerProgress {
    const merged: PlayerProgress = { ...existing };

    // รวม stars และ points
    merged.totalStars = Math.max(existing.totalStars, temp.totalStars);
    merged.totalPoints = Math.max(existing.totalPoints, temp.totalPoints);
    merged.totalXp = Math.max(existing.totalXp || 0, temp.totalXp || 0);
    merged.gems = Math.max(existing.gems || 0, temp.gems || 0);
    
    // รวม completed stages
    const allCompletedStages = [...new Set([...existing.completedStages, ...temp.completedStages])];
    merged.completedStages = allCompletedStages;
    
    // อัพเดท current stage เป็นค่าสูงสุด
    merged.currentStage = Math.max(existing.currentStage, temp.currentStage);

    // รวม stage progress
    for (const stageId in temp.stages) {
      const tempStage = temp.stages[stageId];
      const existingStage = existing.stages[stageId];

      if (!existingStage) {
        merged.stages[stageId] = tempStage;
      } else {
        merged.stages[stageId] = {
          ...existingStage,
          isUnlocked: existingStage.isUnlocked || tempStage.isUnlocked,
          isCompleted: existingStage.isCompleted || tempStage.isCompleted,
          stars: Math.max(existingStage.stars, tempStage.stars),
          bestScore: Math.max(existingStage.bestScore, tempStage.bestScore),
          attempts: Math.max(existingStage.attempts, tempStage.attempts),
          xpEarned: Math.max(existingStage.xpEarned || 0, tempStage.xpEarned || 0),
          perfectRuns: Math.max(existingStage.perfectRuns || 0, tempStage.perfectRuns || 0),
          averageTime: Math.max(existingStage.averageTime || 0, tempStage.averageTime || 0),
          mistakeCount: Math.min(existingStage.mistakeCount || 0, tempStage.mistakeCount || 0),
          hintsUsed: Math.min(existingStage.hintsUsed || 0, tempStage.hintsUsed || 0)
        };
      }
    }

    // รวม learning progress
    if (temp.learningProgress && merged.learningProgress) {
      // รวม completed modules
      const allCompletedModules = [...new Set([
        ...merged.learningProgress.completedModules,
        ...temp.learningProgress.completedModules
      ])];
      merged.learningProgress.completedModules = allCompletedModules;

      // รวม learning time
      merged.learningProgress.totalLearningTime += temp.learningProgress.totalLearningTime;

      // รวม module progress
      for (const moduleId in temp.learningProgress.modules) {
        const tempModule = temp.learningProgress.modules[moduleId];
        const existingModule = merged.learningProgress.modules[moduleId];

        if (!existingModule) {
          merged.learningProgress.modules[moduleId] = tempModule;
        } else {
          merged.learningProgress.modules[moduleId] = {
            ...existingModule,
            isCompleted: existingModule.isCompleted || tempModule.isCompleted,
            completedAt: existingModule.completedAt || tempModule.completedAt,
            totalTimeSpent: Math.max(existingModule.totalTimeSpent, tempModule.totalTimeSpent)
          };
        }
      }
    }

    // รวม quiz progress
    if (temp.quizProgress && merged.quizProgress) {
      for (const quizId in temp.quizProgress.quizzes) {
        const tempQuiz = temp.quizProgress.quizzes[quizId];
        const existingQuiz = merged.quizProgress.quizzes[quizId];

        if (!existingQuiz) {
          merged.quizProgress.quizzes[quizId] = tempQuiz;
        } else {
          merged.quizProgress.quizzes[quizId] = {
            ...existingQuiz,
            attempts: [...existingQuiz.attempts, ...tempQuiz.attempts],
            totalAttempts: existingQuiz.totalAttempts + tempQuiz.totalAttempts,
            bestScore: Math.max(existingQuiz.bestScore, tempQuiz.bestScore),
            bestPercentage: Math.max(existingQuiz.bestPercentage, tempQuiz.bestPercentage),
            passed: existingQuiz.passed || tempQuiz.passed,
            lastAttemptAt: tempQuiz.lastAttemptAt || existingQuiz.lastAttemptAt
          };
        }
      }
    }

    return merged;
  }
}

export const progressManager = new ProgressManager();
