import { PlayerProgress, StageProgress } from '../types/stage';
import { ModuleProgress, LearningProgress, ChapterProgress } from '../types/learning';
import { QuizProgress, QuizAttempt } from '../types/quiz';
import { MiniGameAttempt, GameStats } from '../types/mini-game';
import { authManager } from './auth';
import { userCourseProgressService } from './api/services';
import { userStageProgressService } from './api/services/userStageProgressService';

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

      // เก็บข้อมูล mini-game progress ก่อนลบ localStorage
      let existingMiniGameStats = null;
      if (typeof window !== 'undefined') {
        // หา mini-game stats จาก user key ที่ถูกต้อง
        const userKey = `${this.userProgressKey}_${user.id}`;
        const existingProgress = localStorage.getItem(userKey);
        if (existingProgress) {
          const parsedProgress = JSON.parse(existingProgress);
          existingMiniGameStats = parsedProgress.miniGameStats;
          console.log('🎮 Preserved mini-game stats:', existingMiniGameStats);
        } else {
          // ถ้าไม่มี user key ลองหาจาก player-progress (กรณีที่ยังไม่เคยโหลดจาก API)
          const tempProgress = localStorage.getItem('player-progress');
          if (tempProgress) {
            const parsedTempProgress = JSON.parse(tempProgress);
            existingMiniGameStats = parsedTempProgress.miniGameStats;
            console.log('🎮 Preserved mini-game stats from temp storage:', existingMiniGameStats);
          }
        }
      }

      // ดึงข้อมูล course progress
      const userProgress = await userCourseProgressService.getUserCourseProgressByUserId(user.id);
      
      // ดึงข้อมูล stage progress จาก API
      const stageProgressResponse = await userStageProgressService.getUserProgress(user.id);
      
      console.log('🔍 Raw API responses:', {
        courseProgress: userProgress,
        stageProgress: stageProgressResponse
      });
      
      // ตรวจสอบว่า API มีข้อมูลที่ถูกต้องสำหรับ user ปัจจุบันหรือไม่
      let hasValidCourseData = false;
      if (userProgress && Array.isArray(userProgress)) {
        hasValidCourseData = userProgress.some((item: any) => !item.userId || item.userId === user.id);
      } else if (userProgress?.success && Array.isArray(userProgress.data)) {
        hasValidCourseData = userProgress.data.some((item: any) => !item.userId || item.userId === user.id);
      }
      
      // เริ่มต้นด้วย current progress หรือ default progress
      let localProgress = this.getProgress();
      
      // ถ้าไม่มีข้อมูล API ที่ถูกต้อง และยังไม่เคยมี progress ให้ใช้ default
      if (!hasValidCourseData && (!localProgress || localProgress.totalPoints === 0)) {
        console.log('🆕 No valid API data and no local progress, using fresh defaults');
        localProgress = this.getDefaultProgress();
      } else if (!hasValidCourseData) {
        console.log('📱 No valid API data but keeping existing local progress');
      } else {
        console.log('🔄 Valid API data found, will merge with local progress');
      }
      
      // คืนข้อมูล mini-game progress ที่เก็บไว้
      if (existingMiniGameStats) {
        localProgress.miniGameStats = existingMiniGameStats;
        console.log('🎮 Restored mini-game stats to new progress:', {
          attempts: existingMiniGameStats.attempts?.length || 0,
          totalScore: existingMiniGameStats.totalScore || 0,
          completedGames: existingMiniGameStats.attempts ? new Set(existingMiniGameStats.attempts.map((a: any) => a.gameId)).size : 0
        });
      } else {
        console.log('🎮 No existing mini-game stats found - starting fresh');
      }
      
      // ประมวลผล course progress
      await this.processCourseProgress(localProgress, userProgress);
      
      // ประมวลผล stage progress จาก API
      await this.processStageProgress(localProgress, stageProgressResponse);
      
      // บันทึก merged progress
      this.saveProgress(localProgress);
      
      console.log('✅ Progress merged and saved locally with mini-game stats preserved');
    } catch (error) {
      console.error('Error loading progress from API:', error);
    }
  }

  // ประมวลผล course progress จาก API
  private async processCourseProgress(localProgress: PlayerProgress, userProgress: any): Promise<void> {
    // Handle different response formats
    let progressData = null;
    if (userProgress && userProgress.success && userProgress.data && userProgress.data.length > 0) {
      progressData = userProgress.data;
      console.log('✅ User course progress loaded from API (wrapped format):', progressData);
    } else if (Array.isArray(userProgress) && userProgress.length > 0) {
      progressData = userProgress;
      console.log('✅ User course progress loaded from API (direct array format):', progressData);
    }
    
    if (progressData) {
      // สร้าง learning progress structure ถ้ายังไม่มี
      if (!localProgress.learningProgress) {
        localProgress.learningProgress = {
          completedModules: [],
          totalLearningTime: 0,
          modules: {}
        };
      }

      progressData.forEach((apiProgress: any) => {
        const moduleId = apiProgress.courseId;
        const currentUser = authManager.getCurrentUser();
        
        // ตรวจสอบว่าข้อมูลเป็นของ user ปัจจุบัน และมี progress จริง ๆ 
        const isCorrectUser = !apiProgress.userId || apiProgress.userId === currentUser?.id;
        const hasActualProgress = (apiProgress.progressPercent && apiProgress.progressPercent > 0) || 
                                (apiProgress.completed === true);
        
        console.log(`🔍 Processing course progress for ${moduleId}:`, {
          progressPercent: apiProgress.progressPercent,
          completed: apiProgress.completed,
          userId: apiProgress.userId,
          currentUserId: currentUser?.id,
          isCorrectUser,
          hasActualProgress
        });
        
        // เฉพาะกรณีที่เป็นข้อมูลของ user ปัจจุบันและมี progress จริง ๆ เท่านั้นที่จะอัพเดท
        if (isCorrectUser && hasActualProgress) {
          // อัพเดท module progress จาก API
          if (!localProgress.learningProgress!.modules[moduleId]) {
            localProgress.learningProgress!.modules[moduleId] = {
              moduleId,
              isStarted: true,
              isCompleted: apiProgress.completed || false,
              completedChapters: [],
              totalTimeSpent: 0,
              chapters: {}
            };
          } else {
            // Merge กับข้อมูลที่มีอยู่
            localProgress.learningProgress!.modules[moduleId].isCompleted = 
              localProgress.learningProgress!.modules[moduleId].isCompleted || apiProgress.completed;
          }

          // ถ้ามี progressPercent จาก API ให้คำนวณ completedChapters
          if (apiProgress.progressPercent && apiProgress.progressPercent > 0) {
            const expectedChapters = this.getExpectedChaptersByModuleId(moduleId);
            const completedChapterCount = Math.floor((apiProgress.progressPercent / 100) * expectedChapters.length);
            
            for (let i = 0; i < completedChapterCount; i++) {
              const chapterId = expectedChapters[i];
              if (chapterId && !localProgress.learningProgress!.modules[moduleId].completedChapters.includes(chapterId)) {
                localProgress.learningProgress!.modules[moduleId].completedChapters.push(chapterId);
                
                localProgress.learningProgress!.modules[moduleId].chapters[chapterId] = {
                  moduleId,
                  chapterId,
                  completed: true,
                  readProgress: 100,
                  timeSpent: 5,
                  completedAt: new Date()
                };
              }
            }
          }

          // เพิ่มใน completed modules ถ้าเสร็จแล้ว
          if (apiProgress.completed && !localProgress.learningProgress!.completedModules.includes(moduleId)) {
            localProgress.learningProgress!.completedModules.push(moduleId);
          }
          
          console.log(`✅ Updated progress for ${moduleId}`);
        } else {
          if (!isCorrectUser) {
            console.log(`⚠️ Skipped ${moduleId} - wrong user data (expected: ${currentUser?.id}, got: ${apiProgress.userId})`);
          } else if (!hasActualProgress) {
            console.log(`⚠️ Skipped ${moduleId} - no actual progress`);
          }
        }
      });

      // อัพเดทคะแนนจาก course API data
      this.updateScoresFromAPI(progressData);
    }
  }

  // ประมวลผล stage progress จาก API
  private async processStageProgress(localProgress: PlayerProgress, stageProgressResponse: any): Promise<void> {
    let stageProgressData = null;
    
    // Handle different response formats
    if (stageProgressResponse && stageProgressResponse.success && stageProgressResponse.data) {
      stageProgressData = stageProgressResponse.data;
      console.log('✅ User stage progress loaded from API (wrapped format):', stageProgressData);
    } else if (Array.isArray(stageProgressResponse)) {
      stageProgressData = stageProgressResponse;
      console.log('✅ User stage progress loaded from API (direct array format):', stageProgressData);
    }
    
    if (stageProgressData && Array.isArray(stageProgressData) && stageProgressData.length > 0) {
      console.log('📊 Processing stage progress from API...');
      
      // ประมวลผลข้อมูล stage แต่ละด่าน
      stageProgressData.forEach((apiStageProgress: any) => {
        const stageId = apiStageProgress.stageId;
        
        // อัพเดท stage progress จาก API
        if (!localProgress.stages[stageId]) {
          localProgress.stages[stageId] = {
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
        
        // อัพเดทข้อมูลจาก API
        const stageProgress = localProgress.stages[stageId];
        stageProgress.isCompleted = apiStageProgress.isCompleted || false;
        stageProgress.bestScore = Math.max(stageProgress.bestScore, apiStageProgress.bestScore || 0);
        stageProgress.stars = Math.max(stageProgress.stars, apiStageProgress.starsEarned || 0);
        stageProgress.attempts = Math.max(stageProgress.attempts, apiStageProgress.attempts || 0);
        
        if (apiStageProgress.lastAttemptAt) {
          stageProgress.lastAttempt = new Date(apiStageProgress.lastAttemptAt);
        }
        
        // อัพเดท completed stages list
        if (apiStageProgress.isCompleted && !localProgress.completedStages.includes(stageId)) {
          localProgress.completedStages.push(stageId);
        }
        
        // ปลดล็อก stage ถัดไป
        if (apiStageProgress.isCompleted) {
          const nextStageId = stageId + 1;
          if (nextStageId <= 5) {
            if (!localProgress.stages[nextStageId]) {
              localProgress.stages[nextStageId] = {
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
              localProgress.stages[nextStageId].isUnlocked = true;
            }
          }
        }
        
        console.log(`📊 Stage ${stageId} updated from API:`, {
          completed: apiStageProgress.isCompleted,
          bestScore: apiStageProgress.bestScore,
          stars: apiStageProgress.starsEarned,
          attempts: apiStageProgress.attempts
        });
      });
      
      // คำนวณ totalStars จาก stage progress
      localProgress.totalStars = Object.values(localProgress.stages).reduce((sum, stage) => sum + (stage.stars || 0), 0);
      
      // อัพเดท currentStage เป็น stage ที่สูงที่สุดที่ปลดล็อกแล้ว
      const maxUnlockedStage = Math.max(...Object.values(localProgress.stages)
        .filter(stage => stage.isUnlocked)
        .map(stage => stage.stageId));
      localProgress.currentStage = maxUnlockedStage;
      
      // อัพเดท totalPoints จาก stage scores
      const stageScore = Object.values(localProgress.stages).reduce((sum, stage) => sum + (stage.bestScore || 0), 0);
      localProgress.totalPoints = (localProgress.totalPoints || 0) + stageScore;
      
      console.log('📊 Stage progress summary:', {
        totalStagesLoaded: stageProgressData.length,
        totalStars: localProgress.totalStars,
        completedStages: localProgress.completedStages.length,
        currentStage: localProgress.currentStage,
        totalPoints: localProgress.totalPoints
      });
    } else {
      console.log('ℹ️ No stage progress found in API');
    }
  }

  // อัพเดท คะแนนจาก API data โดยตรง
  private updateScoresFromAPI(progressData: any[]): void {
    const progress = this.getProgress();
    
    if (!progressData || progressData.length === 0) return;
    
    let totalScoreFromAPI = 0;
    let completedModulesCount = 0;
    
  // คำนวณคะแนนจาก API data โดยตรง (แต่ตรวจสอบว่าเป็นข้อมูลของ user ปัจจุบันและมี progress จริงหรือไม่)
  progressData.forEach((apiProgress: any) => {
    const currentUser = authManager.getCurrentUser();
    // ตรวจสอบว่าข้อมูลเป็นของ user ปัจจุบัน และมี progress จริง ๆ
    const isCorrectUser = !apiProgress.userId || apiProgress.userId === currentUser?.id;
    const hasActualProgress = (apiProgress.progressPercent && apiProgress.progressPercent > 0) || 
                            (apiProgress.completed === true);
    
    if (apiProgress.totalScore && isCorrectUser && hasActualProgress) {
      totalScoreFromAPI += apiProgress.totalScore;
      console.log(`📊 Added ${apiProgress.totalScore} points from course ${apiProgress.courseId} (progress: ${apiProgress.progressPercent}%, user: ${apiProgress.userId})`);
    } else if (apiProgress.totalScore) {
      if (!isCorrectUser) {
        console.log(`⚠️ Skipped ${apiProgress.totalScore} points from course ${apiProgress.courseId} - wrong user (expected: ${currentUser?.id}, got: ${apiProgress.userId})`);
      } else if (!hasActualProgress) {
        console.log(`⚠️ Skipped ${apiProgress.totalScore} points from course ${apiProgress.courseId} - no actual progress (progress: ${apiProgress.progressPercent}%, completed: ${apiProgress.completed})`);
      }
    }
    
    if ((apiProgress.progressPercent === 100 || apiProgress.completed) && isCorrectUser && hasActualProgress) {
      completedModulesCount++;
    }
  });    // อัพเดทคะแนนจาก API (รวมคะแนนเดิมจาก stages และ mini-games)
    const existingNonLearningScore = this.getNonLearningScore(progress);
    progress.totalPoints = existingNonLearningScore + totalScoreFromAPI;
    
    console.log('📊 Updated scores from API:', {
      apiProgressData: progressData.map(p => ({ courseId: p.courseId, totalScore: p.totalScore, progressPercent: p.progressPercent })),
      completedModules: completedModulesCount,
      totalScoreFromAPI: totalScoreFromAPI,
      existingNonLearningScore: existingNonLearningScore,
      finalTotalPoints: progress.totalPoints,
      // ดาวและด่านยังคงเดิม (จาก stage system)
      totalStars: progress.totalStars,
      completedStages: progress.completedStages.length
    });
    
    this.saveProgress(progress);
  }

  // ดึงคะแนนที่ไม่ใช่จาก learning (stages, mini-games, etc.)
  private getNonLearningScore(progress: PlayerProgress): number {
    let nonLearningScore = 0;
    
    // คะแนนจาก stages
    if (progress.stages) {
      Object.values(progress.stages).forEach((stage: any) => {
        if (stage.bestScore) {
          nonLearningScore += stage.bestScore;
        }
      });
    }
    
    // คะแนนจาก mini-games
    if (progress.miniGameStats && progress.miniGameStats.totalScore) {
      nonLearningScore += progress.miniGameStats.totalScore;
    }
    
    console.log('📊 Non-learning score calculated:', {
      stageScore: progress.stages ? Object.values(progress.stages).reduce((sum: number, stage: any) => sum + (stage.bestScore || 0), 0) : 0,
      miniGameScore: progress.miniGameStats?.totalScore || 0,
      total: nonLearningScore
    });
    
    return nonLearningScore;
  }

  // อัพเดท คะแนนจาก learning progress (เก็บไว้สำหรับ backward compatibility)
  private updateScoresFromLearning(): void {
    const progress = this.getProgress();
    
    if (!progress.learningProgress) return;
    
    let totalLearningScore = 0;
    let completedModulesCount = 0;
    
    // คำนวณคะแนนจาก learning modules (fallback สำหรับเมื่อไม่มี API)
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
    
    // รวมคะแนนเดิมจาก stages และ mini-games
    const existingNonLearningScore = this.getNonLearningScore(progress);
    progress.totalPoints = existingNonLearningScore + totalLearningScore;
    
    console.log('📚 Updated learning scores (fallback):', {
      completedModules: completedModulesCount,
      totalLearningScore: totalLearningScore,
      existingNonLearningScore: existingNonLearningScore,
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
        // ตรวจสอบว่าข้อมูลเป็นของ user ปัจจุบัน
        if (!response.data.userId || response.data.userId === user.id) {
          console.log('✅ Module progress fetched from API:', response.data);
          return response.data;
        } else {
          console.log(`❌ API returned data for different user. Expected: ${user.id}, Got: ${response.data.userId}`);
          return null;
        }
      } else if (response && Array.isArray(response) && response.length > 0) {
        // บางครั้ง API ส่งกลับเป็น array โดยตรง - ต้องหาข้อมูลของ user ปัจจุบัน
        const userProgress = response.find((item: any) => !item.userId || item.userId === user.id);
        if (userProgress) {
          console.log('✅ Module progress fetched from API (array format):', userProgress);
          return userProgress;
        } else {
          console.log(`❌ No progress found for current user in API array. User ID: ${user.id}`);
          return null;
        }
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

  // ฟังก์ชันช่วยสำหรับ debug - แสดงสถานะ progress ปัจจุบัน
  debugProgress(): void {
    const progress = this.getProgress();
    console.log('🔍 Current Progress Debug:', {
      totalStars: progress.totalStars,
      totalPoints: progress.totalPoints,
      completedStages: progress.completedStages,
      currentStage: progress.currentStage,
      stageDetails: Object.entries(progress.stages).map(([id, stage]) => ({
        stageId: id,
        isUnlocked: stage.isUnlocked,
        isCompleted: stage.isCompleted,
        stars: stage.stars,
        bestScore: stage.bestScore,
        attempts: stage.attempts
      })),
      calculatedTotalStars: Object.values(progress.stages).reduce((sum, stage) => sum + (stage.stars || 0), 0),
      learningProgress: progress.learningProgress ? {
        completedModules: progress.learningProgress.completedModules.length,
        modulesStarted: Object.keys(progress.learningProgress.modules).length
      } : null
    });
  }

  // แก้ไขการคำนวณ totalStars เพื่อให้แน่ใจว่าถูกต้อง (รวมข้อมูลจาก API)
  async recalculateTotalStars(): Promise<void> {
    const progress = this.getProgress();
    const calculatedStars = Object.values(progress.stages).reduce((sum, stage) => sum + (stage.stars || 0), 0);
    const calculatedPoints = Object.values(progress.stages).reduce((sum, stage) => sum + (stage.bestScore || 0), 0);
    
    let hasChanges = false;
    
    if (progress.totalStars !== calculatedStars) {
      console.log('⚠️ Total stars mismatch detected! Fixing...', {
        currentTotalStars: progress.totalStars,
        calculatedStars: calculatedStars,
        stages: Object.entries(progress.stages).map(([id, s]) => ({ id, stars: s.stars }))
      });
      
      progress.totalStars = calculatedStars;
      hasChanges = true;
      
      console.log('✅ Total stars fixed to:', calculatedStars);
    }

    if (progress.totalPoints !== calculatedPoints) {
      console.log('⚠️ Total points mismatch detected! Fixing...', {
        currentTotalPoints: progress.totalPoints,
        calculatedPoints: calculatedPoints,
        stages: Object.entries(progress.stages).map(([id, s]) => ({ id, bestScore: s.bestScore }))
      });
      
      progress.totalPoints = calculatedPoints;
      hasChanges = true;
      
      console.log('✅ Total points fixed to:', calculatedPoints);
    }

    if (hasChanges) {
      this.saveProgress(progress);
    }

    // ตรวจสอบข้อมูลจาก API ด้วย (ถ้าล็อกอินอยู่)
    const user = authManager.getCurrentUser();
    if (user && user.id) {
      try {
        const stageProgressResponse = await userStageProgressService.getUserProgress(user.id);
        
        if (stageProgressResponse && stageProgressResponse.success && stageProgressResponse.data) {
          const apiStars = stageProgressResponse.data.reduce((sum: number, stageProgress: any) => sum + (stageProgress.starsEarned || 0), 0);
          
          if (apiStars > calculatedStars) {
            console.log('🌟 API has more recent star data, updating...', {
              localStars: calculatedStars,
              apiStars: apiStars
            });
            
            // อัพเดทจาก API
            await this.loadProgressFromAPI();
          }
        }
      } catch (error) {
        console.log('⚠️ Could not check API stars:', error);
      }
    }
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
  async completeStage(stageId: number, stars: number, score: number): Promise<PlayerProgress> {
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

    // ✅ อัพเดท total stars โดยนับจากทุก stage (แก้ไขเพื่อให้แน่ใจว่าคำนวณถูกต้อง)
    progress.totalStars = Object.values(progress.stages).reduce((sum, stage) => sum + (stage.stars || 0), 0);
    
    console.log('⭐ Stage completion update:', {
      stageId,
      starsEarned: stars,
      scoreEarned: score,
      previousStars: previousStars,
      newStageStars: stageProgress.stars,
      totalStarsCalculated: progress.totalStars,
      allStages: Object.entries(progress.stages).map(([id, s]) => ({ id, stars: s.stars, completed: s.isCompleted }))
    });

    // บันทึก progress ใน local storage
    this.saveProgress(progress);
    
    // บันทึก progress ใน API (ถ้าล็อกอินอยู่)
    await this.saveStageProgressToAPI(stageId, score, stars, stageProgress.isCompleted, stageProgress.attempts);
    
    return progress;
  }

  // บันทึก stage progress ผ่าน API
  async saveStageProgressToAPI(
    stageId: number,
    currentScore: number,
    starsEarned: number,
    isCompleted: boolean,
    attempts: number
  ): Promise<void> {
    try {
      const user = authManager.getCurrentUser();
      if (!user || !user.id) {
        console.log('User not logged in, stage progress saved locally only');
        return;
      }

      console.log(`Saving stage progress to API for stage: ${stageId}`);

      const progressData = {
        isCompleted,
        currentScore,
        bestScore: currentScore, // ในกรณีนี้ current score คือ best score
        starsEarned,
        attempts,
        lastAttemptAt: new Date().toISOString(),
        completedAt: isCompleted ? new Date().toISOString() : undefined
      };

      const response = await userStageProgressService.upsertProgress(user.id, stageId, progressData);
      
      if (response && response.success) {
        console.log('✅ Stage progress saved to API successfully:', response.data);
      } else if (response && response.data) {
        console.log('✅ Stage progress saved to API (fallback format)');
      } else {
        console.warn('⚠️ API stage progress save response unclear:', response);
      }
    } catch (error) {
      console.warn('⚠️ API not available for stage progress, using local storage only:', error);
    }
  }

  // ดึง stage progress จาก API
  async getStageProgressFromAPI(stageId: number): Promise<any> {
    try {
      const user = authManager.getCurrentUser();
      if (!user || !user.id) {
        console.log('User not logged in, returning local stage progress');
        return null;
      }

      console.log(`Fetching stage progress from API for user ${user.id}, stage ${stageId}`);
      
      const response = await userStageProgressService.getUserStageProgress(user.id, stageId);
      
      if (response && response.success && response.data) {
        console.log('✅ Stage progress fetched from API:', response.data);
        return response.data;
      } else if (response && (response as any).id) {
        // บางครั้ง API ส่งกลับข้อมูลโดยตรง
        console.log('✅ Stage progress fetched from API (direct format):', response);
        return response;
      } else {
        console.log('No stage progress found in API for stage:', stageId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching stage progress from API:', error);
      return null;
    }
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
        
        // ตรวจสอบว่าข้อมูลเป็นของ user ปัจจุบันและมี progress จริง ๆ
        if (moduleProgressFromAPI && moduleProgressFromAPI.userId === user.id) {
          if (moduleProgressFromAPI.progressPercent && moduleProgressFromAPI.progressPercent > 0) {
            console.log(`📊 Using API progress for ${moduleId}: ${moduleProgressFromAPI.progressPercent}%`);
            return moduleProgressFromAPI.progressPercent;
          } else if (moduleProgressFromAPI.completed === true && moduleProgressFromAPI.progressPercent === 100) {
            console.log(`📊 Module ${moduleId} is completed via API, returning 100%`);
            return 100;
          } else {
            console.log(`❌ No valid progress in API response for ${moduleId} (progressPercent: ${moduleProgressFromAPI?.progressPercent}, completed: ${moduleProgressFromAPI?.completed})`);
          }
        } else {
          console.log(`❌ API returned data for different user or no data for ${moduleId}. Expected userId: ${user.id}, Got userId: ${moduleProgressFromAPI?.userId}`);
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
            // ตรวจสอบว่าข้อมูลเป็นของ user ปัจจุบันและมี progress จริง ๆ
            if (moduleData.userId === user.id) {
              if ((moduleData as any).progressPercent && (moduleData as any).progressPercent > 0) {
                console.log(`📊 Using fallback progress for ${moduleId}: ${(moduleData as any).progressPercent}%`);
                return (moduleData as any).progressPercent;
              } else if (moduleData.completed === true && (moduleData as any).progressPercent === 100) {
                console.log(`📊 Using fallback completed for ${moduleId}: 100%`);
                return 100;
              } else {
                console.log(`❌ No valid fallback progress for ${moduleId} (progressPercent: ${(moduleData as any).progressPercent}, completed: ${moduleData.completed})`);
              }
            } else {
              console.log(`❌ Fallback data is for different user. Expected userId: ${user.id}, Got userId: ${moduleData.userId}`);
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

  // ดึงสถิติการเรียนรู้รวม (รวมข้อมูลจาก API)
  async getLearningStats() {
    const progress = this.getProgress();
    
    if (!progress.learningProgress) {
      return {
        totalModulesStarted: 0,
        totalModulesCompleted: 0,
        totalLearningTime: 0,
        averageModuleProgress: 0
      };
    }

    // ตรวจสอบข้อมูลจาก API ก่อน (ถ้า login อยู่)
    const user = authManager.getCurrentUser();
    let apiCompletedCount = 0;
    let apiStartedCount = 0;
    
    if (user && user.id) {
      try {
        const userProgress = await userCourseProgressService.getUserCourseProgressByUserId(user.id);
        let progressData = null;
        
        if (userProgress && userProgress.success && userProgress.data) {
          progressData = userProgress.data;
        } else if (Array.isArray(userProgress)) {
          progressData = userProgress;
        }
        
        if (progressData && progressData.length > 0) {
          // กรองเฉพาะข้อมูลของ user ปัจจุบัน
          const userProgressData = progressData.filter((p: any) => 
            !p.userId || p.userId === user.id
          );
          
          console.log('🔍 Filtered learning stats:', {
            totalData: progressData.length,
            userProgressData: userProgressData.length,
            currentUserId: user.id,
            allUserIds: progressData.map((p: any) => p.userId)
          });
          
          // นับจาก API data ที่ถูกต้อง
          apiStartedCount = userProgressData.length;
          apiCompletedCount = userProgressData.filter((p: any) => 
            p.progressPercent === 100 || p.completed
          ).length;
          
          console.log('📊 Learning stats from API:', {
            started: apiStartedCount,
            completed: apiCompletedCount,
            progressData: userProgressData.map((p: any) => ({
              courseId: p.courseId,
              progressPercent: p.progressPercent,
              completed: p.completed,
              userId: p.userId
            }))
          });
          
          return {
            totalModulesStarted: apiStartedCount,
            totalModulesCompleted: apiCompletedCount,
            totalLearningTime: progress.learningProgress.totalLearningTime,
            averageModuleProgress: apiStartedCount > 0 ? Math.round((apiCompletedCount / apiStartedCount) * 100) : 0
          };
        }
      } catch (error) {
        console.log('🔄 API not available, using local data:', error);
      }
    }

    // Fallback ใช้ข้อมูล local
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

    console.log('📊 Learning stats from local:', {
      started: startedModules.length,
      completed: completedModules.length
    });

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

// Export debug function for development
export const debugProgressSystem = async () => {
  progressManager.debugProgress();
  await progressManager.recalculateTotalStars();
};
