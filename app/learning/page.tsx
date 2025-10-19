"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getQuizByModuleId } from "../data/quizzes";
import { progressManager } from "../lib/progress";
import Navbar from "../components/layout/Navbar";
import QuizCard from "../components/ui/QuizCard";
import { authManager } from "../lib/auth";
import { useLearningData } from "@/app/lib/hooks/useDataAdapter";
import {
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  PlayCircle,
  BarChart3,
  Brain,
} from "lucide-react";
import styles from "../styles/learning.module.css";

// Component สำหรับแสดง Progress Bar
const ProgressBar = ({ percentage, type }: { percentage: number; type: 'green' | 'yellow' | 'purple' }) => {
  const getProgressColors = () => {
    switch (type) {
      case 'green': return 'bg-gradient-to-r from-green-400 to-green-600';
      case 'yellow': return 'bg-gradient-to-r from-green-400 to-yellow-500';
      case 'purple': return 'bg-gradient-to-r from-purple-500 to-blue-500';
      default: return 'bg-gradient-to-r from-purple-500 to-blue-500';
    }
  };

  // จัดเป็นช่วงเพื่อใช้ Tailwind classes
  const getWidthClass = (pct: number) => {
    if (pct === 0) return 'w-0';
    if (pct <= 5) return 'w-[5%]';
    if (pct <= 10) return 'w-[10%]';
    if (pct <= 15) return 'w-[15%]';
    if (pct <= 20) return 'w-[20%]';
    if (pct <= 25) return 'w-1/4';
    if (pct <= 30) return 'w-[30%]';
    if (pct <= 35) return 'w-[35%]';
    if (pct <= 40) return 'w-[40%]';
    if (pct <= 45) return 'w-[45%]';
    if (pct <= 50) return 'w-1/2';
    if (pct <= 55) return 'w-[55%]';
    if (pct <= 60) return 'w-[60%]';
    if (pct <= 65) return 'w-[65%]';
    if (pct <= 70) return 'w-[70%]';
    if (pct <= 75) return 'w-3/4';
    if (pct <= 80) return 'w-[80%]';
    if (pct <= 85) return 'w-[85%]';
    if (pct <= 90) return 'w-[90%]';
    if (pct <= 95) return 'w-[95%]';
    return 'w-full';
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-300 absolute left-0 top-0 ${getProgressColors()} ${getWidthClass(percentage)}`}
      />
    </div>
  );
};

export default function LearningPage() {
  const [moduleProgresses, setModuleProgresses] = useState<Record<string, any>>(
    {}
  );
  const [showQuizCard, setShowQuizCard] = useState<Record<string, boolean>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Use data adapter for learning modules
  const { modules: learningModules, loading: modulesLoading, error: modulesError } = useLearningData();

  // Debug: ดู structure ของ learning modules
  useEffect(() => {
    if (learningModules && learningModules.length > 0) {
      console.log('📚 Learning modules loaded:', learningModules.map(m => ({
        id: m.id,
        title: m.title,
        chaptersCount: m.chapters?.length || 0,
        chapters: m.chapters?.map(c => ({ id: c.id, title: c.title })) || []
      })));
    }
  }, [learningModules]);

  useEffect(() => {
    // โหลดข้อมูล user
    const user = authManager.getCurrentUser();
    setCurrentUser(user);
    
    // มิเกรตข้อมูลเก่าก่อน
    progressManager.migrateOldQuizData();

    // โหลด progress จาก API (ถ้า login อยู่)
    const initializeProgress = async () => {
      if (user) {
        await progressManager.loadProgressFromAPI();
        console.log('✅ Progress loaded from API');
      }
      
      // ฟังก์ชันโหลด progress
      const loadProgress = async () => {
        const progresses: Record<string, any> = {};
        
        if (learningModules) {
          // ใช้ Promise.all เพื่อรอให้ async operations เสร็จ
          await Promise.all(learningModules.map(async (module: any) => {
            // ตรวจสอบและ complete module ถ้าจำเป็น
            await progressManager.checkAndCompleteModule(module.id);

            const moduleProgress = progressManager.getModuleProgress(module.id);
            const completionPercentage = await progressManager.getModuleCompletionPercentageWithAPI(module.id);
            
            console.log(`📊 Progress for ${module.title} (${module.id}):`, {
              moduleProgress,
              completionPercentage,
              isCompleted: moduleProgress?.isCompleted,
              completedChapters: moduleProgress?.completedChapters?.length || 0,
              rawModuleProgress: moduleProgress
            });
            
            progresses[module.id] = {
              ...moduleProgress,
              completionPercentage,
            };
            
            console.log(`🔧 Set progress for ${module.id}:`, {
              completionPercentage,
              fullProgress: progresses[module.id]
            });
          }));
        }
        
        console.log('📊 All module progresses loaded:', progresses);
        console.log('📊 Final moduleProgresses keys:', Object.keys(progresses));
        console.log('📊 Final moduleProgresses values:', Object.values(progresses));
        setModuleProgresses(progresses);
      };

      // โหลด progress ครั้งแรก
      await loadProgress();
    };

    initializeProgress();

    // ฟัง progress updates จาก quiz completion หรือ chapter completion
    const handleProgressUpdate = (event: CustomEvent) => {
      console.log("Progress updated:", event.detail);
      setTimeout(async () => {
        // โหลด progress ใหม่หลังจาก delay เล็กน้อย
        const progresses: Record<string, any> = {};
        
        if (learningModules) {
          await Promise.all(learningModules.map(async (module: any) => {
            await progressManager.checkAndCompleteModule(module.id);
            const moduleProgress = progressManager.getModuleProgress(module.id);
            const completionPercentage = await progressManager.getModuleCompletionPercentageWithAPI(module.id);
            
            console.log(`🔄 Refreshed progress for ${module.title} (${module.id}):`, {
              moduleProgress,
              completionPercentage,
              isCompleted: moduleProgress?.isCompleted,
              completedChapters: moduleProgress?.completedChapters?.length || 0
            });
            
            progresses[module.id] = {
              ...moduleProgress,
              completionPercentage,
            };
            
            console.log(`🔧 Refresh set progress for ${module.id}:`, {
              completionPercentage,
              fullProgress: progresses[module.id]
            });
          }));
        }
        
        setModuleProgresses(progresses);
      }, 100);
    };

    // ฟัง visibility change เมื่อ user กลับมายัง tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page visible again, reloading progress...");
        setTimeout(async () => {
          if (user) {
            await progressManager.loadProgressFromAPI();
          }
          
          const progresses: Record<string, any> = {};
          if (learningModules) {
            await Promise.all(learningModules.map(async (module: any) => {
              await progressManager.checkAndCompleteModule(module.id);
              const moduleProgress = progressManager.getModuleProgress(module.id);
              const completionPercentage = await progressManager.getModuleCompletionPercentageWithAPI(module.id);
              
              console.log(`👁️ Visibility refresh for ${module.title} (${module.id}):`, {
                moduleProgress,
                completionPercentage,
                isCompleted: moduleProgress?.isCompleted,
                completedChapters: moduleProgress?.completedChapters?.length || 0
              });
              
              progresses[module.id] = {
                ...moduleProgress,
                completionPercentage,
              };
              
              console.log(`🔧 Visibility set progress for ${module.id}:`, {
                completionPercentage,
                fullProgress: progresses[module.id]
              });
            }));
          }
          setModuleProgresses(progresses);
        }, 200);
      }
    };

    window.addEventListener(
      "progressUpdated",
      handleProgressUpdate as EventListener
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener(
        "progressUpdated",
        handleProgressUpdate as EventListener
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [learningModules]);

  // Handle loading state
  if (modulesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  if (modulesError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-4">ระบบกำลังพัฒนา</h2>
            <p className="text-gray-300 mb-6">
              เนื้อหาการเรียนจะมาเร็วๆ นี้ ขณะนี้ระบบยังอยู่ในขั้นตอนการเพิ่มเนื้อหาจาก API
            </p>
            <p className="text-sm text-gray-400">
              ข้อผิดพลาด: {modulesError}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!learningModules || learningModules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-lg">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-white mb-4">เนื้อหาการเรียนกำลังมา!</h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              ทีมงานกำลังเตรียมเนื้อหาการเรียนรู้ดาราศาสตร์ที่น่าสนใจให้คุณ
              กรุณารอสักครู่นะครับ
            </p>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-300 mb-3">สิ่งที่กำลังจะมา</h3>
              <ul className="text-gray-300 space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  บทเรียนระบบสุริยะ
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  กิจกรรมอินเตอร์แอคทีฟ
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  แบบทดสอบความเข้าใจ
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  ภาพและวิดีโอประกอบ
                </li>
              </ul>
            </div>
            <div className="mt-8 space-y-4">
              <p className="text-sm text-gray-400">
                ในระหว่างนี้คุณสามารถลองเล่นเกมหรือทำแบบทดสอบได้
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/mini-game"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-400 hover:to-emerald-400 transition-all"
                >
                  <PlayCircle size={16} className="inline mr-2" />
                  เล่นเกม
                </Link>
                <Link
                  href="/quiz"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-400 hover:to-purple-400 transition-all"
                >
                  <Brain size={16} className="inline mr-2" />
                  ทำแบบทดสอบ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const text = {
    lesson: "บทเรียน",
    level: "ระดับ:",
    time: "เวลา:",
    fundamental: "พื้นฐาน",
    intermediate: "ปานกลาง",
    advanced: "ขั้นสูง",
  };

  // ฟังก์ชันดึงจำนวนบทจาก API จริง
  const getActualChapterCount = (moduleId: string): number => {
    const module = learningModules?.find((m: any) => m.id === moduleId);
    if (module && module.chapters && Array.isArray(module.chapters)) {
      const chapterCount = module.chapters.length;
      console.log(`📊 Module ${moduleId} (${module.title}) has ${chapterCount} chapters from API`);
      return chapterCount;
    }
    
    // Fallback ถ้าไม่เจอ - ดูจาก progress manager
    const expectedChapters = progressManager.getExpectedChaptersByModuleId(moduleId);
    if (expectedChapters && expectedChapters.length > 0) {
      console.log(`📊 Module ${moduleId} fallback to progress manager: ${expectedChapters.length} chapters`);
      return expectedChapters.length;
    }
    
    // สุดท้าย fallback เป็น 3 (ตามที่เห็นในรูป)
    console.log(`⚠️ No chapters found for module ${moduleId}, using default 3`);
    return 3;
  };

  const getModuleStatusIcon = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return <BookOpen className="text-yellow-400" size={32} />;

    // ตรวจสอบจาก progress percentage จาก API
    const completionPercentage = progress.completionPercentage || 0;
    
    // เสร็จสมบูรณ์ 100%
    if (completionPercentage >= 100) {
      return <CheckCircle className="text-green-500" size={32} />;
    }
    // ผ่านเกณฑ์ (70% ขึ้นไป)
    else if (completionPercentage >= 70) {
      return <CheckCircle className="text-green-400" size={32} />;
    }
    // กำลังเรียนอยู่ (มี progress แต่ยังไม่ผ่าน)
    else if (completionPercentage > 0) {
      return <PlayCircle className="text-blue-400" size={32} />;
    }
    // ยังไม่เริ่ม
    else {
      return <BookOpen className="text-yellow-400" size={32} />;
    }
  };

  const getModuleStatusText = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return "เริ่มเรียน";

    // ตรวจสอบจาก progress percentage จาก API
    const completionPercentage = progress.completionPercentage || 0;
    
    // เสร็จสมบูรณ์ 100%
    if (completionPercentage >= 100) {
      return "เรียนจบแล้ว";
    }
    // ผ่านเกณฑ์ (70% ขึ้นไป)
    else if (completionPercentage >= 70) {
      return "ผ่านแล้ว";
    }
    // กำลังเรียนอยู่ (มี progress แต่ยังไม่ผ่าน)
    else if (completionPercentage > 0) {
      return "กำลังเรียน";
    }
    // ยังไม่เริ่ม
    else {
      return "เริ่มเรียน";
    }
  };

  const getProgressDetails = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return null;

    // ใช้ข้อมูลจาก API จริง
    const totalChapters = getActualChapterCount(moduleId);
    const completedChapters = progress.completedChapters?.length || 0;
    const readingProgress =
      totalChapters > 0 ? (completedChapters / totalChapters) * 60 : 0;
    const quizProgress = progressManager.getModuleQuizProgress?.(moduleId) || 0;

    console.log(`📊 Progress details for ${moduleId}:`, {
      totalChapters,
      completedChapters,
      readingProgress,
      quizProgress
    });

    return {
      readingProgress: Math.round(readingProgress),
      quizProgress: Math.round(quizProgress),
      totalChapters,
      completedChapters,
    };
  };

  const getModuleStatusColor = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return "text-yellow-400";

    // ตรวจสอบจาก progress percentage จาก API
    const completionPercentage = progress.completionPercentage || 0;
    
    // เสร็จสมบูรณ์ 100%
    if (completionPercentage >= 100) {
      return "text-green-500";
    }
    // ผ่านเกณฑ์ (70% ขึ้นไป)
    else if (completionPercentage >= 70) {
      return "text-green-400";
    }
    // กำลังเรียนอยู่ (มี progress แต่ยังไม่ผ่าน)
    else if (completionPercentage > 0) {
      return "text-blue-400";
    }
    // ยังไม่เริ่ม
    else {
      return "text-yellow-400";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Fundamental":
        return "text-green-400";
      case "Intermediate":
        return "text-yellow-400";
      case "Advanced":
        return "text-red-400";
      default:
        return "text-green-400";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "Fundamental":
        return text.fundamental;
      case "Intermediate":
        return text.intermediate;
      case "Advanced":
        return text.advanced;
      default:
        return text.fundamental;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Badge */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2" />
              <span className="text-purple-300 text-xs sm:text-sm font-semibold">การเรียนรู้แบบปฏิบัติ</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
            {text.lesson}
          </h1>
          
          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            เรียนรู้ดาราศาสตร์ผ่านการทดลอง การสำรวจ และการลงมือทำ
            <br className="hidden sm:block" />
            <span className="text-purple-400 font-semibold">ปฏิบัติจริง ไม่ใช่แค่ท่องจำ</span>
          </p>

          {/* Learning Approach Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">สำรวจและทดลอง</h3>
              <p className="text-gray-300 text-sm">เรียนรู้ผ่านการทดลองและการค้นพบด้วยตนเอง</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Brain className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ทดสอบความเข้าใจ</h3>
              <p className="text-gray-300 text-sm">แบบทดสอบที่เน้นการคิดวิเคราะห์</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-orange-500/20 rounded-full">
                  <PlayCircle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ประยุกต์ใช้จริง</h3>
              <p className="text-gray-300 text-sm">นำความรู้ไปประยุกต์ในสถานการณ์จริง</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <Link
              href="/quiz"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105"
            >
              <Brain size={20} className="mr-2" />
              ทดสอบความรู้ทันที
            </Link>
            <Link
              href="/mini-game"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-400 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105"
            >
              <PlayCircle size={20} className="mr-2" />
              เล่นเกมเสริมการเรียน
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-2 sm:px-4">
          {learningModules?.map((module: any) => {
            const quiz = getQuizByModuleId(module.id);
            const progress = moduleProgresses[module.id];
            const isCompleted = progress?.isCompleted;
            const actualChapterCount = getActualChapterCount(module.id);

            // Debug log แต่ละ module
            console.log(`🔍 Rendering module ${module.id}:`, {
              title: module.title,
              chaptersFromAPI: module.chapters?.length || 0,
              actualChapterCount: actualChapterCount,
              completionPercentage: progress?.completionPercentage || 0
            });

            return (
              <div key={module.id} className="group h-full">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105 border-2 border-slate-600/70 hover:border-purple-400/70 h-full flex flex-col min-h-[450px] sm:min-h-[500px] shadow-2xl shadow-black/50">
                  {/* Header with Status */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 -m-2 p-4 rounded-xl border border-slate-600/30">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {getModuleStatusIcon(module.id)}
                      <div className="flex flex-col">
                        <span className={`text-xs sm:text-sm font-bold ${getModuleStatusColor(module.id)} drop-shadow-sm`}>
                          {getModuleStatusText(module.id)}
                        </span>
                        <span className={`text-xs font-semibold ${getLevelColor(module.level)} drop-shadow-sm`}>
                          {getLevelText(module.level)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {moduleProgresses[module.id]?.isStarted && (
                        <div className="p-2 bg-blue-500/20 rounded-full">
                          <BarChart3 className="text-blue-400" size={16} />
                        </div>
                      )}
                      <Star
                        className="text-gray-400 group-hover:text-yellow-400 transition-colors"
                        size={20}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/learning/${module.id}`}
                    className="flex-1 flex flex-col"
                  >
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors leading-tight drop-shadow-lg bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                      {module.title}
                    </h3>

                    <div className="flex-grow mb-6">
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {module.description.length > 150
                          ? module.description.substring(0, 150) + "..."
                          : module.description}
                      </p>
                    </div>

                    {/* Activity Types */}
                    <div className="mb-6 bg-gradient-to-br from-slate-700/20 to-slate-800/20 p-4 rounded-xl border border-slate-600/40">
                      <h4 className="text-white text-sm font-bold mb-3 drop-shadow-sm">กิจกรรมการเรียนรู้:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 bg-blue-500/20 border border-blue-400/50 rounded-lg p-2 shadow-md">
                          <BookOpen className="w-4 h-4 text-blue-300" />
                          <span className="text-xs text-blue-200 font-medium">เนื้อหาหลัก</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-green-500/20 border border-green-400/50 rounded-lg p-2 shadow-md">
                          <Brain className="w-4 h-4 text-green-300" />
                          <span className="text-xs text-green-200 font-medium">ทดสอบความเข้าใจ</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-purple-500/20 border border-purple-400/50 rounded-lg p-2 shadow-md">
                          <PlayCircle className="w-4 h-4 text-purple-300" />
                          <span className="text-xs text-purple-200 font-medium">แบบฝึกหัด</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-orange-500/20 border border-orange-400/50 rounded-lg p-2 shadow-md">
                          <BarChart3 className="w-4 h-4 text-orange-300" />
                          <span className="text-xs text-orange-200 font-medium">ประเมินผล</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {moduleProgresses[module.id] && moduleProgresses[module.id].completionPercentage > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">ความคืบหน้า</span>
                          <span
                            className={
                              moduleProgresses[module.id].completionPercentage >= 100
                                ? "text-green-500"
                                : moduleProgresses[module.id].completionPercentage >= 70
                                ? "text-green-400"
                                : "text-blue-400"
                            }
                          >
                            {moduleProgresses[module.id]?.completionPercentage || 0}%
                          </span>
                        </div>
                        <ProgressBar 
                          percentage={moduleProgresses[module.id].completionPercentage || 0}
                          type={
                            moduleProgresses[module.id].completionPercentage >= 100 ? 'green' :
                            moduleProgresses[module.id].completionPercentage >= 70 ? 'yellow' : 'purple'
                          }
                        />
                        {/* แสดงข้อมูลเพิ่มเติมเกี่ยวกับสิ่งที่ต้องทำ */}
                        <div className="text-xs mt-1">
                          {moduleProgresses[module.id].completionPercentage >= 100 ? (
                            <div className="text-green-400">
                              ✅ เรียนจบแล้ว คะแนนเต็ม!
                            </div>
                          ) : moduleProgresses[module.id].completionPercentage >= 70 ? (
                            <div className="text-green-400">
                              ✅ ผ่านเกณฑ์แล้ว สามารถศึกษาต่อได้
                            </div>
                          ) : moduleProgresses[module.id].completionPercentage > 0 ? (
                            <div className="text-blue-400">
                              📚 กำลังเรียน ต้องได้ 70% ขึ้นไปจึงจะผ่าน
                            </div>
                          ) : (
                            <div className="text-gray-400">
                              🎯 เริ่มเรียนเพื่อปลดล็อกความคืบหน้า
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 mr-2">{text.level}</span>
                        <span
                          className={`font-semibold ${getLevelColor(
                            module.level
                          )}`}
                        >
                          {getLevelText(module.level)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-300">
                          {module.estimatedTime}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/20 bg-gradient-to-r from-slate-700/20 to-slate-800/20 -mx-2 px-4 pb-2 rounded-b-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-300 font-medium">
                            {getActualChapterCount(module.id)} บท
                          </span>
                          <span
                            className={`text-sm font-bold ${getModuleStatusColor(
                              module.id
                            )} drop-shadow-sm`}
                          >
                            {getModuleStatusText(module.id)}
                          </span>
                        </div>
                        <div className="text-yellow-300 group-hover:translate-x-1 group-hover:text-yellow-200 transition-all duration-300 text-xl font-bold drop-shadow-sm">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Quiz Section - Show when reading is complete (can attempt quiz) */}
                  {moduleProgresses[module.id] && moduleProgresses[module.id].completionPercentage > 0 && quiz && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <QuizCard quiz={quiz} moduleTitle={module.title} />
                    </div>
                  )}

                  <div className="flex-grow mb-4">
                    {/* Empty div to maintain consistent card height */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-3/4 right-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  );
}
