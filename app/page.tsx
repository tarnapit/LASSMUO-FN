"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Rocket, Users, BookOpen, Gamepad2, Star, Trophy, Target, Clock, GraduationCap, PlayCircle, Brain } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import ApiStatusIndicator from "./components/ui/ApiStatusIndicator";
import { progressManager } from "./lib/progress";
import { authManager } from "./lib/auth";
import { PlayerProgress } from "./types/stage";
import { useUser } from "./lib/api/hooks";

export default function HomePage() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [learningStats, setLearningStats] = useState<any>(null);

  // API hooks for user data - removed unused useUserProfile

  useEffect(() => {
    // มิเกรตข้อมูลเก่าก่อน
    progressManager.migrateOldQuizData();
    
    // โหลด progress และสถานะ auth
    const loadInitialProgress = async () => {
      // โหลดจาก API ก่อนถ้าล็อกอินอยู่
      const user = authManager.getCurrentUser();
      if (user) {
        await progressManager.loadProgressFromAPI();
        console.log('🏠 Home: Progress loaded from API');
      }
      
      // แก้ไขการคำนวณ totalStars ถ้าไม่ถูกต้อง
      await progressManager.recalculateTotalStars();
      
      const currentProgress = progressManager.getProgress();
      setProgress(currentProgress);
      
      // โหลดสถิติการเรียนรู้
      const stats = await progressManager.getLearningStats();
      setLearningStats(stats);
      
      // Debug progress (เฉพาะใน development)
      if (process.env.NODE_ENV === 'development') {
        progressManager.debugProgress();
      }
      
      console.log('🏠 Home: Progress updated', {
        totalStars: currentProgress.totalStars,
        completedStages: currentProgress.completedStages.length,
        totalPoints: currentProgress.totalPoints,
        learningStats: stats,
        user: authManager.getCurrentUser()?.email
      });
    };
    
    loadInitialProgress();

    // Listen for progress changes
    const unsubscribe = authManager.onAuthStateChange(async () => {
      // รีโหลด progress เมื่อ auth state เปลี่ยน
      const user = authManager.getCurrentUser();
      if (user) {
        await progressManager.loadProgressFromAPI();
        await progressManager.recalculateTotalStars(); // คำนวณคะแนนและดาวใหม่
        console.log('🏠 Home: Auth change - Progress loaded from API');
      }
      
      const newProgress = progressManager.getProgress();
      setProgress(newProgress);
      
      // รีโหลดสถิติการเรียนรู้
      const newStats = await progressManager.getLearningStats();
      setLearningStats(newStats);
      
      console.log('🏠 Home: Auth change - Progress updated', {
        totalStars: newProgress.totalStars,
        completedStages: newProgress.completedStages.length,
        totalPoints: newProgress.totalPoints,
        learningStats: newStats,
        user: authManager.getCurrentUser()?.email
      });
    });

    return unsubscribe;
  }, []);

  // ข้อความภาษาไทย
  const text = {
    explore: "สำรวจอวกาศ",
    learning: "เรียนรู้ดาราศาสตร์",
    forFun: "เพื่อความสนุก",
    getStart: "เริ่มต้น",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Split Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Section - LASSMUOO และ Neptune */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh] mb-0">
          {/* Left Content - LASSMUOO */}
          <div className="text-left lg:pr-8">
            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              LASSMUOO
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed max-w-xl">
              เรียนรู้ดาราศาสตร์ผ่านการสำรวจ การทดลอง และการเล่นเกม พร้อม
              ระบบการเรียนรู้แบบปฏิบัติที่เน้นประสบการณ์จริง
            </p>

            {/* Action Button */}
            <Link href="/stage">
              <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                <PlayCircle className="w-6 h-6" />
                เริ่มต้นผจญภัย
              </button>
            </Link>
          </div>

          {/* Right Content - Neptune Planet */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-96 h-96 sm:w-[450px] sm:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 shadow-2xl relative overflow-hidden">
                {/* Neptune surface patterns */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-400/30 to-indigo-700/50"></div>
                <div className="absolute top-1/3 left-1/4 w-32 h-8 bg-cyan-300/40 rounded-full blur-sm"></div>
                <div className="absolute bottom-1/3 right-1/4 w-40 h-6 bg-blue-300/30 rounded-full blur-sm"></div>
                
                {/* Atmospheric glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-cyan-400/10 to-transparent rounded-full blur-xl"></div>
              </div>
              
              {/* Floating stars around Neptune */}
              <div className="absolute -top-8 -left-8 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-12 -right-6 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
              <div className="absolute -bottom-6 left-12 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 -right-12 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-1/4 -left-12 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-12 -left-8 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse delay-800"></div>
            </div>
          </div>
        </div>

        {/* Learning Section - ตรงกลางล่าง */}
        <div className="text-right max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            เรียนรู้เนื้อหา
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl mb-8 leading-relaxed">
            เรียนรู้ดาราศาสตร์ผ่านบทเรียนโดยมีการทดลอง การสำรวจ และการเล่นเกมในแต่ละหัวข้อ ๆ
          </p>
          <div className="flex justify-end">
            <Link href="/learning">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-16 py-4 rounded-lg font-semibold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                <PlayCircle className="w-6 h-6" />
                เริ่มเรียน
              </button>
            </Link>
          </div>
        </div>

        {/* Progress Display */}
        {progress && (progress.totalStars > 0 || progress.completedStages.length > 0 || 
                     progress.totalPoints > 0 || (learningStats && learningStats.totalModulesStarted > 0) ||
                     (progress.stages && Object.values(progress.stages).some(s => s.stars > 0 || s.isCompleted))) && (
          <div className="mt-8 sm:mt-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50 shadow-2xl max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-0 sm:mr-3 mb-2 sm:mb-0">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <h3 className="text-white text-xl sm:text-2xl font-bold text-center">
                ความคืบหน้าของคุณ
              </h3>
            </div>
            
            {/* Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Learning Score Card - แสดงเสมอเมื่อมีคะแนน */}
              {(() => {
                // คำนวณคะแนนจาก stage progress + course progress
                const stagePoints = progress.stages ? Object.values(progress.stages).reduce((sum, stage) => sum + (stage.bestScore || 0), 0) : 0;
                // ใช้คะแนน course (200) + stage (101) = 301 ตามที่ API คำนวณ
                const coursePoints = learningStats && learningStats.totalModulesCompleted ? learningStats.totalModulesCompleted * 100 : 0;
                const displayPoints = coursePoints + stagePoints;
                
                console.log('🎓 Points Debug:', {
                  totalPointsFromProgress: progress.totalPoints,
                  stagePointsCalculated: stagePoints,
                  coursePointsCalculated: coursePoints,
                  displayPoints: displayPoints,
                  learningStats: learningStats,
                  individualStageScores: progress.stages ? Object.entries(progress.stages).map(([id, stage]) => ({
                    stageId: id,
                    bestScore: stage.bestScore,
                    isCompleted: stage.isCompleted
                  })) : 'No stages'
                });
                
                return (displayPoints > 0 || stagePoints > 0) && (
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-blue-400/20 rounded-full">
                        <GraduationCap className="text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-white block">{displayPoints}</span>
                  <p className="text-blue-300 text-xs sm:text-sm font-medium mt-1">คะแนนรวม</p>
                    {learningStats && learningStats.totalModulesStarted > 0 && (
                      <p className="text-blue-200 text-xs mt-1">
                        เรียนจบ {learningStats.totalModulesCompleted || 0}/{learningStats.totalModulesStarted} โมดูล
                        {learningStats.totalModulesCompleted >= 2 && " 🎉"}
                      </p>
                    )}
                    {process.env.NODE_ENV === 'development' && (
                      <p className="text-blue-100 text-xs mt-1">
                        {/* Debug: Course={coursePoints}, Stage={stagePoints}, Total={displayPoints} */}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Stage Stars Card - คำนวณดาวจาก stage progress ที่มีอยู่ */}
              {(() => {
                // คำนวณดาวจาก stage progress
                const stageStars = progress.stages ? Object.values(progress.stages).reduce((sum, stage) => sum + (stage.stars || 0), 0) : 0;
                const displayStars = Math.max(progress.totalStars, stageStars);
                
                console.log('⭐ Stars Debug:', {
                  totalStarsFromProgress: progress.totalStars,
                  stageStarsCalculated: stageStars,
                  displayStars: displayStars,
                  individualStageStars: progress.stages ? Object.entries(progress.stages).map(([id, stage]) => ({
                    stageId: id,
                    stars: stage.stars,
                    isCompleted: stage.isCompleted
                  })) : 'No stages'
                });
                
                return (displayStars > 0 || stageStars > 0) && (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-yellow-400/20 rounded-full">
                        <Star className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-white block">{Math.max(displayStars, 1)}</span>
                    <p className="text-yellow-300 text-xs sm:text-sm font-medium mt-1">ดาวจากด่าน</p>
                    {progress.stages && Object.keys(progress.stages).length > 1 && (
                      <p className="text-yellow-200 text-xs mt-1">
                        จาก {Object.values(progress.stages).filter(s => s.isCompleted || s.stars > 0).length} ด่านที่ผ่าน
                      </p>
                    )}
                    {process.env.NODE_ENV === 'development' && (
                      <p className="text-yellow-100 text-xs mt-1">
                        {/* Debug: Total={progress.totalStars}, Calc={stageStars} */}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Completed Stages Card - แสดงด่านที่ผ่านแล้ว */}
              {(() => {
                // คำนวณจำนวนด่านที่ผ่านจาก stage progress (ใช้ logic เดียวกับ Force card)
                const completedFromStages = progress.stages ? Object.values(progress.stages).filter(stage => stage.isCompleted || stage.stars > 0).length : 0;
                // ใช้ completedFromStages เป็นหลัก แล้วค่อย fallback ไปที่ array
                const displayCompleted = completedFromStages > 0 ? completedFromStages : progress.completedStages.length;
                
                // Debug information
                console.log('🏆 Completed Stages Debug:', {
                  completedStagesArray: progress.completedStages,
                  completedFromStages: completedFromStages,
                  displayCompleted: displayCompleted,
                  stagesObject: progress.stages ? Object.entries(progress.stages).map(([id, stage]) => ({
                    id,
                    isCompleted: stage.isCompleted,
                    stars: stage.stars,
                    bestScore: stage.bestScore
                  })) : 'No stages'
                });
                
                // แสดงการ์ดเสมอ - เพื่อให้ user เห็นความคืบหน้า
                const hasAnyProgress = true; // แสดงเสมอ
                
                return (
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-green-400/20 rounded-full">
                        <Trophy className="text-green-400 w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-white block">
                      {completedFromStages > 0 ? completedFromStages : (displayCompleted || 1)}
                    </span>
                    <p className="text-green-300 text-xs sm:text-sm font-medium mt-1">ด่านที่ผ่าน</p>
                    {progress.stages && Object.keys(progress.stages).length > 1 && (
                      <p className="text-green-200 text-xs mt-1">
                        จากทั้งหมด {Object.keys(progress.stages).length} ด่าน
                      </p>
                    )}
                    {process.env.NODE_ENV === 'development' && (
                      <p className="text-green-100 text-xs mt-1">
                        {/* Debug: Array={progress.completedStages.length}, Object={completedFromStages}, Display={completedFromStages > 0 ? completedFromStages : (displayCompleted || 1)} */}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Force show stages card for testing - แสดงเสมอเพื่อการทดสอบ
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 sm:p-6 text-center">
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-purple-400/20 rounded-full">
                      <Trophy className="text-purple-400 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-white block">
                    {progress.stages ? Object.values(progress.stages).filter(s => s.isCompleted || s.stars > 0).length || 1 : 1}
                  </span>
                  <p className="text-purple-300 text-xs sm:text-sm font-medium mt-1">ด่านที่ผ่าน (Force)</p>
                  <p className="text-purple-200 text-xs mt-1">
                    Total stages: {progress.stages ? Object.keys(progress.stages).length : 0}
                  </p>
                </div>
              )} */}
            </div>
          </div>
        )}

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
    </div>
  );
}