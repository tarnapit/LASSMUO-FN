"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Rocket, Users, BookOpen, Gamepad2, Star, Trophy, Target, Clock, GraduationCap, PlayCircle, Brain } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import ApiStatusIndicator from "./components/ui/ApiStatusIndicator";
import { progressManager } from "./lib/progress";
import { authManager } from "./lib/auth";
import { PlayerProgress } from "./types/stage";
import { useUser, useUserProfile } from "./lib/api/hooks";

export default function HomePage() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [learningStats, setLearningStats] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // API hooks for user data
  const { data: userProfile, loading: userProfileLoading, error: userProfileError } = useUserProfile(currentUser?.id || '');

  useEffect(() => {
    // มิเกรตข้อมูลเก่าก่อน
    progressManager.migrateOldQuizData();
    
    // โหลด progress และสถานะ auth
    const currentProgress = progressManager.getProgress();
    setProgress(currentProgress);
    
    const user = authManager.getCurrentUser();
    setCurrentUser(user);
    setIsLoggedIn(authManager.isLoggedIn());
    
    // โหลดสถิติการเรียนรู้
    const stats = progressManager.getLearningStats();
    setLearningStats(stats);

    // Listen for auth changes
    const unsubscribe = authManager.onAuthStateChange((user) => {
      setCurrentUser(user);
      setIsLoggedIn(!!user);
      // รีโหลด progress เมื่อ auth state เปลี่ยน
      const newProgress = progressManager.getProgress();
      setProgress(newProgress);
      
      // รีโหลดสถิติการเรียนรู้
      const newStats = progressManager.getLearningStats();
      setLearningStats(newStats);
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
      {/* API Status Indicator */}
      {/* <ApiStatusIndicator /> */}
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-6xl">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-4 sm:mb-6">
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-2" />
            <span className="text-blue-300 text-xs sm:text-sm font-medium">{text.explore}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight px-2">
            {text.learning}
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6 sm:mb-8 px-2">
            {text.forFun}
          </h2>

          <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            เรียนรู้ดาราศาสตร์ผ่านการสำรวจ การทดลอง และการเล่นเกม 
            พร้อมระบบการเรียนรู้แบบปฏิบัติที่เน้นประสบการณ์จริง
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
            {/* Start Journey Card */}
            <Link href="/stage">
              <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 cursor-pointer h-full min-h-[280px] sm:min-h-[320px] flex flex-col">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 text-center">{text.getStart}</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base text-center flex-grow flex items-center justify-center">เริ่มต้นการผจญภัยในอวกาศ ผ่านด่านต่างๆ และสะสมดาว</p>
                <div className="flex items-center justify-center text-yellow-400 font-semibold text-sm sm:text-base mt-auto">
                  เริ่มเลย <PlayCircle className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Link>

            {/* Learning Card */}
            <Link href="/learning">
              <div className="group bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6 sm:p-8 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105 cursor-pointer h-full min-h-[280px] sm:min-h-[320px] flex flex-col">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 text-center">เรียนรู้เนื้อหา</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base text-center flex-grow flex items-center justify-center">สำรวจความรู้ดาราศาสตร์ผ่านบทเรียนแบบปฏิบัติ</p>
                <div className="flex items-center justify-center text-purple-400 font-semibold text-sm sm:text-base mt-auto">
                  เริ่มเรียน <GraduationCap className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Access Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
            <Link href="/mini-game" className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 sm:p-4 hover:border-green-500/50 transition-all duration-300">
                <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white text-xs sm:text-sm font-medium text-center">เกมพิเศษ</p>
              </div>
            </Link>
            
            <Link href="/quiz" className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 sm:p-4 hover:border-blue-500/50 transition-all duration-300">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white text-xs sm:text-sm font-medium text-center">ทดสอบ</p>
              </div>
            </Link>
            
            <Link href="/leaderboard" className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 sm:p-4 hover:border-yellow-500/50 transition-all duration-300">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white text-xs sm:text-sm font-medium text-center">อันดับ</p>
              </div>
            </Link>
            
            <Link href="/friends" className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 sm:p-4 hover:border-pink-500/50 transition-all duration-300">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-white text-xs sm:text-sm font-medium text-center">เพื่อน</p>
              </div>
            </Link>
          </div>

          {/* Progress Display */}
          {progress && (progress.totalStars > 0 || progress.completedStages.length > 0 || 
                       (learningStats && learningStats.totalModulesStarted > 0)) && (
            <div className="mt-8 sm:mt-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50 shadow-2xl max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-0 sm:mr-3 mb-2 sm:mb-0">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <h3 className="text-white text-xl sm:text-2xl font-bold text-center">
                  ความคืบหน้าของคุณ
                </h3>
              </div>
              
              {/* Stage Progress Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 text-center">
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-yellow-400/20 rounded-full">
                      <Star className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-white block">{progress.totalStars}</span>
                  <p className="text-yellow-300 text-xs sm:text-sm font-medium mt-1">ดาวที่เก็บได้</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 text-center">
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-green-400/20 rounded-full">
                      <Trophy className="text-green-400 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-white block">{progress.completedStages.length}</span>
                  <p className="text-green-300 text-xs sm:text-sm font-medium mt-1">ด่านที่ผ่าน</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-blue-400/20 rounded-full">
                      <Target className="text-blue-400 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-white block">{progress.totalPoints}</span>
                  <p className="text-blue-300 text-xs sm:text-sm font-medium mt-1">คะแนนรวม</p>
                </div>
              </div>

              {/* Learning Progress */}
              {learningStats && learningStats.totalModulesStarted > 0 && (
                <>
                  <div className="border-t border-slate-600/50 pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
                      <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-full mr-0 sm:mr-3 mb-2 sm:mb-0">
                        <BookOpen className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <h4 className="text-white text-lg sm:text-xl font-semibold text-center">
                        ความคืบหน้าการเรียนรู้
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-4 sm:p-6 text-center">
                        <div className="flex items-center justify-center mb-2 sm:mb-3">
                          <div className="p-1.5 sm:p-2 bg-purple-400/20 rounded-full">
                            <GraduationCap className="text-purple-400 w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl font-bold text-white">{learningStats.totalModulesCompleted}</span>
                          <span className="text-gray-400 text-lg sm:text-xl ml-1">/{learningStats.totalModulesStarted}</span>
                        </div>
                        <p className="text-purple-300 text-xs sm:text-sm font-medium mt-1">บทเรียนที่จบ</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 sm:p-6 text-center">
                        <div className="flex items-center justify-center mb-2 sm:mb-3">
                          <div className="p-1.5 sm:p-2 bg-orange-400/20 rounded-full">
                            <Clock className="text-orange-400 w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold text-white block">{learningStats.totalLearningTime}</span>
                        <p className="text-orange-300 text-xs sm:text-sm font-medium mt-1">นาทีเรียน</p>
                      </div>

                      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-center mb-2 sm:mb-3">
                          <div className="p-1.5 sm:p-2 bg-cyan-400/20 rounded-full">
                            <Target className="text-cyan-400 w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold text-white block">{learningStats.averageModuleProgress}%</span>
                        <p className="text-cyan-300 text-xs sm:text-sm font-medium mt-1">ความคืบหน้าเฉลี่ย</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Save Status */}
              <div className="mt-4 sm:mt-6 text-center border-t border-slate-600/50 pt-4 sm:pt-6">
                {isLoggedIn ? (
                  <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                    <Star className="mr-2 w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-green-300 text-xs sm:text-sm font-medium">ข้อมูลถูกบันทึกถาวรแล้ว</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                    <Target className="mr-2 w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-xs sm:text-sm font-medium">ข้อมูลชั่วคราว - ล็อกอินเพื่อบันทึกข้อมูล</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 text-white/20 hidden sm:block">
          <Rocket size={32} className="sm:w-12 sm:h-12" />
        </div>
        <div className="absolute top-32 sm:top-40 right-8 sm:right-20 text-white/20 hidden sm:block">
          <BookOpen size={28} className="sm:w-10 sm:h-10" />
        </div>
        <div className="absolute bottom-32 sm:bottom-40 left-8 sm:left-20 text-white/20 hidden md:block">
          <Users size={32} className="sm:w-11 sm:h-11" />
        </div>
        <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-10 text-white/20 hidden sm:block">
          <Gamepad2 size={30} className="sm:w-10 sm:h-10" />
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
