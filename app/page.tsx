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
import Image from "next/image";

export default function HomePage() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [learningStats, setLearningStats] = useState<any>(null);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  // รายการดาวเคราะห์ที่จะหมุนเวียน (เรียงตามลำดับจากดวงอาทิตย์)
  const planets = [
    { name: 'Sun', image: '/images/planets/sun.png' },
    { name: 'Mercury', image: '/images/planets/mercury.png' },
    { name: 'Venus', image: '/images/planets/venus.png' },
    { name: 'Earth', image: '/images/planets/earth.png' },
    { name: 'Mars', image: '/images/planets/mars.png' },
    { name: 'Jupiter', image: '/images/planets/jupiter.png' },
    { name: 'Saturn', image: '/images/planets/saturn.png' },
    { name: 'Uranus', image: '/images/planets/uranus.png' },
    { name: 'Neptune', image: '/images/planets/neptune.png' }
  ];

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

  // ระบบสลับดาวเคราะห์อัตโนมัติ
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlanetIndex((prevIndex) => 
        (prevIndex + 1) % planets.length
      );
    }, 10000); // สลับทุก 10 วินาที

    return () => clearInterval(interval);
  }, [planets.length]);

  // ข้อความภาษาไทย
  const text = {
    explore: "สำรวจอวกาศ",
    learning: "เรียนรู้ดาราศาสตร์",
    forFun: "เพื่อความสนุก",
    getStart: "เริ่มต้น",
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Planet Background */}
      <div className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out">
        <Image
          src={planets[currentPlanetIndex].image}
          alt={planets[currentPlanetIndex].name}
          fill
          className="object-cover transition-opacity duration-1000"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-30 pointer-events-auto">
        <Navbar />
      </div>

      {/* Hero Section - Full Screen Layout */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-16 pointer-events-auto">
        {/* Main Section - LASSMUOO Content */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center min-h-[40vh] lg:min-h-[45vh] mb-4 lg:mb-6">
          {/* Left Content - LASSMUOO */}
          <div className="text-left lg:pr-8">
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight drop-shadow-2xl">
              LASSMUOO
            </h1>

            {/* Description */}
            <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed max-w-xl drop-shadow-lg">
              เรียนรู้ดาราศาสตร์ผ่านการสำรวจ การทดลอง และการเล่นเกม พร้อม
              ระบบการเรียนรู้แบบปฏิบัติที่เน้นประสบการณ์จริง
            </p>

            {/* Action Button */}
            <Link href="/stage" className="relative z-30 w-full sm:w-auto">
              <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-64 shadow-2xl">
                <PlayCircle className="w-6 h-6 flex-shrink-0" />
                <span className="whitespace-nowrap">เริ่มต้นผจญภัย</span>
              </button>
            </Link>
          </div>

          {/* Right Content - Planet Info */}
          <div className="flex justify-center lg:justify-end items-center">
            {/* Planet Name Display - Large */}
            {/* <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20 shadow-2xl">
              <h2 className="text-white font-bold text-4xl sm:text-5xl text-center drop-shadow-lg">
                {planets[currentPlanetIndex].name}
              </h2>
            </div> */}
          </div>
        </div>

        {/* Learning Section - ตรงกลางล่าง */}
        <div className="text-left lg:text-right max-w-2xl lg:max-w-4xl mx-auto mb-6 lg:mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 drop-shadow-2xl leading-tight">
            เรียนรู้เนื้อหา
          </h2>
          <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed drop-shadow-lg max-w-2xl lg:max-w-3xl lg:ml-auto">
            เรียนรู้ดาราศาสตร์ผ่านบทเรียนโดยมีการทดลอง การสำรวจ และการเล่นเกมในแต่ละหัวข้อ ๆ
          </p>
          <div className="flex justify-start lg:justify-end">
            <Link href="/learning" className="relative z-30 w-full sm:w-auto">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-64 shadow-2xl">
                <PlayCircle className="w-6 h-6 flex-shrink-0" />
                <span className="whitespace-nowrap">เริ่มเรียน</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Planet Navigation Dots - Hidden on mobile, show only on tablet+ */}
        <div className="hidden sm:block fixed bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-black/20 backdrop-blur-sm rounded-full px-3 py-2 lg:px-4 lg:py-3 border border-white/10">
          <div className="flex items-center justify-center gap-2 lg:gap-3">
            {planets.map((planet, index) => (
              <button
                key={index}
                onClick={() => setCurrentPlanetIndex(index)}
                title={`ดู${planet.name}`}
                aria-label={`เปลี่ยนไปยังดาว${planet.name}`}
                className={`transition-all duration-300 rounded-full group ${
                  index === currentPlanetIndex 
                    ? 'w-3 h-3 lg:w-4 lg:h-4 bg-white scale-110 lg:scale-125 shadow-md lg:shadow-lg shadow-white/50' 
                    : 'w-2.5 h-2.5 lg:w-3 lg:h-3 bg-white/40 hover:bg-white/70 hover:scale-105'
                }`}
              >
                {/* Tooltip */}
                <span className="absolute -top-10 lg:-top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs lg:text-sm px-2 py-1 lg:px-3 lg:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                  {planet.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Display */}
        {progress && (() => {
          // คำนวณค่าจริง ๆ เพื่อตรวจสอบว่ามี progress หรือไม่
          const stagePoints = progress.stages ? Object.values(progress.stages).reduce((sum, stage) => sum + (stage.bestScore || 0), 0) : 0;
          const actualStageStars = progress.stages ? Object.values(progress.stages).reduce((sum, stage) => sum + (stage.stars || 0), 0) : 0;
          const actualCompletedStages = progress.stages ? Object.values(progress.stages).filter(s => s.isCompleted || s.stars > 0).length : 0;
          // สำหรับ user ที่มี progress จริง ใช้ข้อมูลจาก learningStats
          const actualCoursePoints = learningStats && learningStats.totalModulesCompleted > 0 
            ? learningStats.totalModulesCompleted * 100 : 0;
          const totalActualPoints = stagePoints + actualCoursePoints;
          
          // แสดงเฉพาะเมื่อมี progress จริง ๆ
          return (totalActualPoints > 0 || actualStageStars > 0 || actualCompletedStages > 0 || 
                  (learningStats && learningStats.totalModulesStarted > 0));
        })() && (
          <div className="relative z-20 mt-8 sm:mt-12 bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl max-w-5xl mx-auto">
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
              {/* Learning Score Card - แสดงเฉพาะเมื่อมีคะแนนจริง */}
              {(() => {
                // คำนวณคะแนนจาก stage progress + course progress
                const stagePoints = progress.stages ? Object.values(progress.stages).reduce((sum, stage) => {
                  // ตรวจสอบให้แน่ใจว่า stage ผ่านจริง ๆ (มีดาวหรือจบแล้ว)
                  return sum + ((stage.isCompleted || stage.stars > 0) ? (stage.bestScore || 0) : 0);
                }, 0) : 0;
                // ใช้คะแนน course จาก API สำหรับ user ที่มี progress จริง
                const coursePoints = learningStats && learningStats.totalModulesCompleted > 0 
                  ? learningStats.totalModulesCompleted * 100 : 0;
                const displayPoints = coursePoints + stagePoints;
                
                console.log('🏠 Score calculation:', {
                  stagePoints,
                  coursePoints,
                  displayPoints,
                  totalModulesCompleted: learningStats?.totalModulesCompleted,
                  progressTotalPoints: progress.totalPoints,
                  learningStatsRaw: learningStats
                });
                
                return displayPoints > 0 && (
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
                  </div>
                );
              })()}

              {/* Stage Stars Card - คำนวณดาวจาก stage progress ที่มีอยู่ */}
              {(() => {
                // คำนวณดาวจาก stage progress เฉพาะที่ผ่านจริง ๆ (ได้ดาวหรือจบแล้ว)
                const stageStars = progress.stages ? Object.values(progress.stages).reduce((sum, stage) => {
                  // เฉพาะ stage ที่จบแล้วหรือได้ดาวจริง ๆ เท่านั้น
                  return sum + ((stage.isCompleted || stage.stars > 0) ? (stage.stars || 0) : 0);
                }, 0) : 0;
                const displayStars = stageStars; // ใช้เฉพาะดาวจาก stage จริง ๆ
                
                console.log('🏠 Stars calculation:', {
                  stageStars,
                  progressTotalStars: progress.totalStars,
                  displayStars
                });
                
                return displayStars > 0 && (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-yellow-400/20 rounded-full">
                        <Star className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-white block">{displayStars}</span>
                    <p className="text-yellow-300 text-xs sm:text-sm font-medium mt-1">ดาวจากด่าน</p>
                    {progress.stages && (() => {
                      const completedStages = Object.values(progress.stages).filter(s => s.isCompleted || s.stars > 0).length;
                      return completedStages > 1 && (
                        <p className="text-yellow-200 text-xs mt-1">
                          จาก {completedStages} ด่านที่ผ่าน
                        </p>
                      );
                    })()}
                  </div>
                );
              })()}

              {/* Completed Stages Card - แสดงด่านที่ผ่านแล้ว */}
              {(() => {
                // คำนวณจำนวนด่านที่ผ่านจาก stage progress เฉพาะที่ผ่านจริง ๆ
                const completedFromStages = progress.stages ? Object.values(progress.stages).filter(stage => 
                  // ต้องจบจริง ๆ หรือได้ดาว (ไม่นับแค่ attempts)
                  stage.isCompleted || stage.stars > 0
                ).length : 0;
                
                console.log('🏠 Completed stages calculation:', {
                  completedFromStages,
                  progressCompletedStages: progress.completedStages.length,
                  stagesData: progress.stages ? Object.values(progress.stages).map(s => ({ 
                    isCompleted: s.isCompleted, 
                    stars: s.stars 
                  })) : []
                });
                
                return completedFromStages > 0 && (
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-green-400/20 rounded-full">
                        <Trophy className="text-green-400 w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-white block">
                      {completedFromStages}
                    </span>
                    <p className="text-green-300 text-xs sm:text-sm font-medium mt-1">ด่านที่ผ่าน</p>
                    {progress.stages && (() => {
                      // นับเฉพาะ stage ที่ผ่านจริง ๆ (ได้ดาวหรือคะแนนดีกว่า 0)
                      const actualStages = Object.values(progress.stages).filter(stage => 
                        stage.isCompleted || stage.stars > 0 || (stage.bestScore && stage.bestScore > 0)
                      ).length;
                      return actualStages > 1 && (
                        <p className="text-green-200 text-xs mt-1">
                          จากทั้งหมด {actualStages} ด่าน
                        </p>
                      );
                    })()}
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
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse shadow-white/50 shadow-sm"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100 shadow-white/50 shadow-sm"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200 shadow-white/50 shadow-sm"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300 shadow-white/50 shadow-sm"></div>
          <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-500 shadow-white/50 shadow-sm"></div>
          <div className="absolute top-3/4 right-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-700 shadow-white/50 shadow-sm"></div>
          <div className="absolute top-1/5 right-1/5 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse delay-400 shadow-yellow-300/50 shadow-sm"></div>
          <div className="absolute bottom-1/5 left-1/5 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse delay-600 shadow-cyan-300/50 shadow-sm"></div>
          <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-800 shadow-purple-300/50 shadow-sm"></div>
          <div className="absolute bottom-2/3 right-2/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-900 shadow-blue-300/50 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}