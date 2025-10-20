'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCoursePostestData } from './useCoursePostestData';
import { authManager } from '../auth';
import { userCourseProgressService } from '../api/services';
import { progressManager } from '../progress';

interface QuizUnlockInfo {
  isUnlocked: boolean;
  moduleId: string | null;
  moduleTitle: string;
  requiredPercentage: number;
  currentPercentage: number;
  progressFromAPI: any;
}

export function useQuizUnlockManager() {
  const [unlockStatus, setUnlockStatus] = useState<Record<string, QuizUnlockInfo>>({});
  const [loading, setLoading] = useState(true);
  const { quizzes, courseModuleMapping, loading: quizzesLoading } = useCoursePostestData();

  useEffect(() => {
    if (quizzesLoading) return; // Wait for quizzes to load first

    const checkUnlockStatus = async () => {
      try {
        setLoading(true);
        console.log('🔓 [Quiz Unlock] Checking unlock status for all quizzes...');

        const user = authManager.getCurrentUser();
        let allUserProgress: any[] = [];

        // Fetch user progress from API if logged in
        if (user && user.id) {
          console.log(`👤 [Quiz Unlock] User logged in: ${user.id}, fetching progress...`);
          
          const progressResponse = await userCourseProgressService.getUserCourseProgressByUserId(user.id);
          
          if (progressResponse && progressResponse.success && progressResponse.data) {
            allUserProgress = progressResponse.data;
            console.log('📊 [Quiz Unlock] User progress from API:', allUserProgress);
          } else if (Array.isArray(progressResponse)) {
            allUserProgress = progressResponse;
            console.log('📊 [Quiz Unlock] User progress from API (array format):', allUserProgress);
          } else {
            console.log('❌ [Quiz Unlock] No progress data found in API');
          }
        } else {
          console.log('❌ [Quiz Unlock] User not logged in, using local progress data');
          
          // For non-logged in users, use local progress data
          console.log('📊 [Quiz Unlock] Using local progress manager for quiz unlock status');
        }

        // Check unlock status for each quiz
        const newUnlockStatus: Record<string, QuizUnlockInfo> = {};
        
        for (const quiz of quizzes) {
          const courseId = quiz.moduleId; // This is actually courseId from API
          
          let currentPercentage = 0;
          let progressFromAPI = null;
          let isUnlocked = false;
          
          console.log(`🔍 [Quiz Unlock] Processing quiz: ${quiz.title} (id: ${quiz.id}, courseId: ${courseId})`);
          
          if (user && user.id) {
            // For logged in users: use API data
            const courseProgress = allUserProgress.find((progress: any) => 
              progress.courseId === courseId && (!progress.userId || progress.userId === user?.id)
            );
            
            if (courseProgress) {
              // ตรวจสอบให้แน่ใจว่าเป็นข้อมูลของ user ปัจจุบัน
              if (!courseProgress.userId || courseProgress.userId === user?.id) {
                currentPercentage = courseProgress.progressPercent || 0;
                progressFromAPI = courseProgress;
                console.log(`📊 [Quiz Unlock] Course ${courseId} progress: ${currentPercentage}% (userId: ${courseProgress.userId})`);
              } else {
                console.log(`⚠️ [Quiz Unlock] Skipping wrong user data for course ${courseId} (expected: ${user?.id}, got: ${courseProgress.userId})`);
              }
            } else {
              console.log(`📊 [Quiz Unlock] No API progress found for course ${courseId} (current user: ${user?.id})`);
            }
            
            // Unlock criteria: need at least 60% progress in the course
            const requiredPercentage = 60;
            isUnlocked = currentPercentage >= requiredPercentage;
          } else {
            // For non-logged in users: use local progress data
            // แปลง courseId เป็น legacy moduleId ก่อน
            const legacyModuleId = courseModuleMapping[courseId] || courseId;
            console.log(`🔍 [Quiz Unlock] Mapping courseId ${courseId} to legacy moduleId: ${legacyModuleId}`);
            
            const localUnlockReq = progressManager.getQuizUnlockRequirements(quiz.id);
            console.log(`📊 [Quiz Unlock] Quiz unlock requirements for ${quiz.id}:`, localUnlockReq);
            
            // ถ้าไม่เจอจาก quiz.id ลองใช้ legacy moduleId
            if (!localUnlockReq.isUnlocked && localUnlockReq.currentPercentage === 0) {
              // ลองหา module progress โดยใช้ legacy moduleId ก่อน
              let moduleProgress = progressManager.getModuleProgress(legacyModuleId);
              console.log(`📊 [Quiz Unlock] Module progress for ${legacyModuleId}:`, moduleProgress);
              
              // ถ้าไม่เจอด้วย legacy moduleId ลองใช้ courseId (UUID) แทน
              if (!moduleProgress) {
                moduleProgress = progressManager.getModuleProgress(courseId);
                console.log(`📊 [Quiz Unlock] Trying with courseId ${courseId}:`, moduleProgress);
              }
              
              if (moduleProgress) {
                // ใช้ expectedChapters จาก legacy moduleId แต่ completedChapters จาก actual moduleProgress
                const expectedChapters = progressManager.getExpectedChaptersByModuleId(legacyModuleId);
                const completedChapters = moduleProgress.completedChapters.length;
                const modulePercentage = expectedChapters.length > 0 ? (completedChapters / expectedChapters.length) * 100 : 0;
                const requiredChapters = Math.ceil(expectedChapters.length * 0.6); // 60%
                
                currentPercentage = Math.round(modulePercentage);
                isUnlocked = completedChapters >= requiredChapters;
                
                console.log(`📊 [Quiz Unlock] Found module progress! Expected: ${expectedChapters.length}, Completed: ${completedChapters}, Percentage: ${currentPercentage}%, Unlocked: ${isUnlocked}`);
              } else {
                currentPercentage = localUnlockReq.currentPercentage;
                isUnlocked = localUnlockReq.isUnlocked;
                console.log(`📊 [Quiz Unlock] No module progress found for ${legacyModuleId} or ${courseId}, using quiz unlock req: ${currentPercentage}%`);
              }
            } else {
              currentPercentage = localUnlockReq.currentPercentage;
              isUnlocked = localUnlockReq.isUnlocked;
              console.log(`📊 [Quiz Unlock] Using direct quiz unlock req: ${currentPercentage}%, unlocked: ${isUnlocked}`);
            }
            
            console.log(`📊 [Quiz Unlock] Local progress for quiz ${quiz.id}: ${currentPercentage}% (unlocked: ${isUnlocked})`);
          }
          
          // Get legacy module info for display
          let moduleTitle = quiz.title.replace('แบบทดสอบ', '').trim();
          const requiredPercentage = 60;
          
          // Create courseModuleMapping on the fly when needed
          let legacyModuleId = null;
          if (quiz.title.includes('ระบบสุริยะ') || quiz.title.includes('Solar System')) {
            legacyModuleId = 'solar-system';
          } else if (quiz.title.includes('โครงสร้างโลก') || quiz.title.includes('Earth Structure')) {
            legacyModuleId = 'earth-structure';
          } else if (quiz.title.includes('การเกิดดาว') || quiz.title.includes('Stellar Evolution')) {
            legacyModuleId = 'stellar-evolution';
          } else if (quiz.title.includes('กาแลคซี่') || quiz.title.includes('Galaxies')) {
            legacyModuleId = 'galaxies-universe';
          }
          
          // Try to get better module title from learning modules
          try {
            const { learningModules } = require('../../data/learning-modules');
            const module = learningModules.find((m: any) => m.id === legacyModuleId);
            if (module) {
              moduleTitle = module.title;
            }
          } catch (error) {
            console.warn('Could not load learning modules for title lookup');
          }

          newUnlockStatus[quiz.id] = {
            isUnlocked,
            moduleId: courseId,
            moduleTitle,
            requiredPercentage,
            currentPercentage,
            progressFromAPI
          };

          console.log(`🔓 [Quiz Unlock] Quiz "${quiz.title}": ${isUnlocked ? 'UNLOCKED' : 'LOCKED'} (${currentPercentage}%/${requiredPercentage}%) - CourseId: ${courseId}`);
        }

        console.log('📋 [Quiz Unlock] Final unlock status:', Object.fromEntries(
          Object.entries(newUnlockStatus).map(([id, status]) => [
            id, 
            {
              title: quizzes.find(q => q.id === id)?.title,
              isUnlocked: status.isUnlocked,
              progress: `${status.currentPercentage}%/${status.requiredPercentage}%`
            }
          ])
        ));

        setUnlockStatus(newUnlockStatus);
        
      } catch (error) {
        console.error('❌ [Quiz Unlock] Error checking unlock status:', error);
        
        // Fallback: lock all quizzes - require actual progress
        const fallbackStatus: Record<string, QuizUnlockInfo> = {};
        const user = authManager.getCurrentUser();
        
        // Create a basic courseModuleMapping for fallback
        const fallbackCourseModuleMapping: Record<string, string> = {};
        quizzes.forEach(quiz => {
          if (quiz.title.includes('ระบบสุริยะ') || quiz.title.includes('Solar System')) {
            fallbackCourseModuleMapping[quiz.moduleId] = 'solar-system';
          } else if (quiz.title.includes('โครงสร้างโลก') || quiz.title.includes('Earth Structure')) {
            fallbackCourseModuleMapping[quiz.moduleId] = 'earth-structure';
          } else if (quiz.title.includes('การเกิดดาว') || quiz.title.includes('Stellar Evolution')) {
            fallbackCourseModuleMapping[quiz.moduleId] = 'stellar-evolution';
          } else if (quiz.title.includes('กาแลคซี่') || quiz.title.includes('Galaxies')) {
            fallbackCourseModuleMapping[quiz.moduleId] = 'galaxies-universe';
          }
        });
        
        quizzes.forEach(quiz => {
          // Even in fallback, check local progress for non-logged in users
          let currentPercentage = 0;
          let isUnlocked = false;
          
          if (!user || !user.id) {
            // แปลง courseId เป็น legacy moduleId
            const courseId = quiz.moduleId;
            const legacyModuleId = fallbackCourseModuleMapping[courseId] || courseId;
            
            const localUnlockReq = progressManager.getQuizUnlockRequirements(quiz.id);
            
            // ถ้าไม่เจอจาก quiz.id ลองใช้ legacy moduleId
            if (!localUnlockReq.isUnlocked && localUnlockReq.currentPercentage === 0) {
              // ลองหา module progress โดยใช้ legacy moduleId ก่อน
              let moduleProgress = progressManager.getModuleProgress(legacyModuleId);
              
              // ถ้าไม่เจอด้วย legacy moduleId ลองใช้ courseId (UUID) แทน
              if (!moduleProgress) {
                moduleProgress = progressManager.getModuleProgress(courseId);
              }
              
              if (moduleProgress) {
                const expectedChapters = progressManager.getExpectedChaptersByModuleId(legacyModuleId);
                const completedChapters = moduleProgress.completedChapters.length;
                const modulePercentage = expectedChapters.length > 0 ? (completedChapters / expectedChapters.length) * 100 : 0;
                const requiredChapters = Math.ceil(expectedChapters.length * 0.6); // 60%
                
                currentPercentage = Math.round(modulePercentage);
                isUnlocked = completedChapters >= requiredChapters;
              } else {
                currentPercentage = localUnlockReq.currentPercentage;
                isUnlocked = localUnlockReq.isUnlocked;
              }
            } else {
              currentPercentage = localUnlockReq.currentPercentage;
              isUnlocked = localUnlockReq.isUnlocked;
            }
          }
          
          fallbackStatus[quiz.id] = {
            isUnlocked, // Use local progress for non-logged in users
            moduleId: quiz.moduleId,
            moduleTitle: quiz.title.replace('แบบทดสอบ', '').trim(),
            requiredPercentage: 60,
            currentPercentage, // Use actual progress
            progressFromAPI: null
          };
        });
        
        setUnlockStatus(fallbackStatus);
        
      } finally {
        setLoading(false);
      }
    };

    checkUnlockStatus();
  }, [quizzes, quizzesLoading]); // Remove courseModuleMapping from dependencies

  return {
    unlockStatus,
    loading,
    
    // Helper functions - ใช้ useCallback เพื่อป้องกัน re-render
    isQuizUnlocked: useCallback((quizId: string): boolean => {
      return unlockStatus[quizId]?.isUnlocked || false;
    }, [unlockStatus]),
    
    getQuizUnlockInfo: useCallback((quizId: string): QuizUnlockInfo | null => {
      return unlockStatus[quizId] || null;
    }, [unlockStatus]),
    
    getAllQuizUnlockStatus: useCallback((): Record<string, boolean> => {
      const result: Record<string, boolean> = {};
      Object.keys(unlockStatus).forEach(quizId => {
        result[quizId] = unlockStatus[quizId].isUnlocked;
      });
      return result;
    }, [unlockStatus]),
    
    // Refresh unlock status (useful after completing learning modules)
    refreshUnlockStatus: useCallback(async () => {
      // This will trigger the useEffect to re-run
      setLoading(true);
    }, [])
  };
}