"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { progressManager } from "../lib/progress";
import Navbar from "../components/layout/Navbar";
import { useLearningData, useQuizData } from "@/app/lib/hooks/useDataAdapter";
import { useQuizUnlockManager } from "../lib/hooks/useQuizUnlockManager";
import { authManager } from "../lib/auth";
import { 
  Brain, 
  Clock, 
  Target, 
  Trophy, 
  PlayCircle, 
  CheckCircle,
  XCircle,
  BarChart3,
  Star,
  BookOpen
} from "lucide-react";

export default function QuizPage() {
  const [quizProgresses, setQuizProgresses] = useState<Record<string, any>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Use data adapters
  const { modules: learningModules } = useLearningData();
  const { quizzes, loading: quizzesLoading, error: quizzesError } = useQuizData();
  const { unlockStatus, loading: unlockLoading, getAllQuizUnlockStatus } = useQuizUnlockManager();
  const quizzesToShow = quizzes || [];

  useEffect(() => {
    // โหลดข้อมูล user
    const user = authManager.getCurrentUser();
    setCurrentUser(user);
    
    // มิเกรตข้อมูลเก่าก่อน
    progressManager.migrateOldQuizData();
    
    const loadQuizData = async () => {
      // โหลดจาก API ก่อนถ้าล็อกอินอยู่
      if (user) {
        await progressManager.loadProgressFromAPI();
        console.log('🧠 Quiz: Progress loaded from API');
      }
      
      // โหลด progress ของทุก quiz จาก progressManager
      const progresses = progressManager.getAllQuizProgress();
      setQuizProgresses(progresses);
      
      console.log('🧠 Quiz: Quiz data updated', {
        progressCount: Object.keys(progresses).length
      });
    };
    
    loadQuizData();
  }, [learningModules]); // ลบ getAllQuizUnlockStatus ออกจาก dependency

  // ฟัง progress updates จาก learning modules
  useEffect(() => {
    const handleProgressUpdate = async (event: CustomEvent) => {
      console.log("🧠 Quiz: Progress updated from learning:", event.detail);
      
      // รอ delay เล็กน้อยแล้วรีโหลด quiz unlock status
      setTimeout(async () => {
        const user = authManager.getCurrentUser();
        if (user) {
          await progressManager.loadProgressFromAPI();
        }
        
        // อัพเดท quiz unlock status
        console.log('🧠 Quiz: Unlock status updated');
      }, 500);
    };

    window.addEventListener(
      "progressUpdated",
      handleProgressUpdate as any
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "progressUpdated",
        handleProgressUpdate as any
      );
    };
  }, []);

  // คำนวณจำนวน quiz ที่ unlock/lock แล้ว
  const { unlockedCount, lockedCount } = useMemo(() => {
    const allStatus = Object.values(unlockStatus);
    return {
      unlockedCount: allStatus.filter(info => info?.isUnlocked).length,
      lockedCount: allStatus.filter(info => !info?.isUnlocked).length
    };
  }, [unlockStatus]);

  const getModuleTitle = (moduleId: string) => {
    const module = learningModules.find(m => m.id === moduleId);
    return module?.title || 'Unknown Module';
  };

  const getQuizStatusIcon = (quizId: string) => {
    const progress = quizProgresses[quizId];
    const quizUnlockInfo = unlockStatus[quizId];
    const isUnlocked = quizUnlockInfo?.isUnlocked || false;
    
    if (!isUnlocked) {
      return <Brain className="text-gray-500" size={32} />;
    }
    
    if (!progress) return <Brain className="text-blue-400" size={32} />;
    
    if (progress.passed) {
      return <CheckCircle className="text-green-400" size={32} />;
    } else if (progress.totalAttempts > 0) {
      return <XCircle className="text-red-400" size={32} />;
    } else {
      return <Brain className="text-blue-400" size={32} />;
    }
  };

  const getQuizStatusText = (quizId: string) => {
    const progress = quizProgresses[quizId];
    const quizUnlockInfo = unlockStatus[quizId];
    const isUnlocked = quizUnlockInfo?.isUnlocked || false;
    
    if (!isUnlocked) {
      return `ต้องเรียน ${quizUnlockInfo?.moduleTitle || 'บทเรียน'} ${quizUnlockInfo?.requiredPercentage || 60}% ก่อน`;
    }
    
    if (!progress) return "เริ่มทำแบบทดสอบ";
    
    if (progress.passed) {
      return `ผ่านแล้ว (${progress.bestPercentage}%)`;
    } else if (progress.totalAttempts > 0) {
      const quiz = quizzes.find(q => q.id === quizId);
      const attemptsLeft = quiz?.maxAttempts ? quiz.maxAttempts - progress.totalAttempts : 0;
      return `ยังไม่ผ่าน (เหลือ ${attemptsLeft} ครั้ง)`;
    } else {
      return "เริ่มทำแบบทดสอบ";
    }
  };

  const getQuizStatusColor = (quizId: string) => {
    const progress = quizProgresses[quizId];
    const quizUnlockInfo = unlockStatus[quizId];
    const isUnlocked = quizUnlockInfo?.isUnlocked || false;
    
    if (!isUnlocked) return "text-gray-500";
    
    if (!progress) return "text-blue-400";
    
    if (progress.passed) {
      return "text-green-400";
    } else if (progress.totalAttempts > 0) {
      return "text-red-400";
    } else {
      return "text-blue-400";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'ง่าย';
      case 'medium': return 'ปานกลาง';
      case 'hard': return 'ยาก';
      default: return 'ไม่ระบุ';
    }
  };

  const calculateAverageDifficulty = (quiz: any) => {
    const difficulties = quiz.questions.map((q: any) => {
      switch (q.difficulty) {
        case 'easy': return 1;
        case 'medium': return 2;
        case 'hard': return 3;
        default: return 2;
      }
    });
    const average = difficulties.reduce((a: number, b: number) => a + b, 0) / difficulties.length;
    
    if (average <= 1.5) return 'easy';
    if (average <= 2.5) return 'medium';
    return 'hard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">แบบทดสอบ</h1>
          <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6 px-4">ทดสอบความเข้าใจหลังจากเรียนบทเรียนเสร็จแล้ว</p>
          
          {/* Lock status summary */}
          <div className="inline-flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 border border-white/20">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-green-400" size={16} />
              <span className="text-green-400 text-xs sm:text-sm font-medium">
                {unlockedCount} ปลดล็อกแล้ว
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20"></div>
            <div className="flex items-center space-x-2">
              <XCircle className="text-yellow-400" size={16} />
              <span className="text-yellow-400 text-xs sm:text-sm font-medium">
                {lockedCount} ล็อกอยู่
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {quizzes.map((quiz) => {
            const averageDifficulty = calculateAverageDifficulty(quiz);
            const progress = quizProgresses[quiz.id];
            const quizUnlockInfo = unlockStatus[quiz.id];
            const isUnlocked = quizUnlockInfo?.isUnlocked || false;
            
            return (
              <div key={quiz.id} className="group h-full">
                {isUnlocked ? (
                  <Link href={`/quiz/${quiz.id}`} className="h-full block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 h-full flex flex-col min-h-[420px]">
                      <div className="flex items-center justify-between mb-4">
                        {getQuizStatusIcon(quiz.id)}
                        <div className="flex items-center space-x-2">
                          {progress?.totalAttempts > 0 && (
                            <BarChart3 className="text-purple-400" size={20} />
                          )}
                          <Star className="text-gray-400 group-hover:text-yellow-400 transition-colors" size={20} />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {quiz.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-3">
                        บทเรียน: {getModuleTitle(quiz.moduleId)}
                      </p>
                      
                      <div className="flex-grow mb-4">
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {quiz.description}
                        </p>
                      </div>

                      {/* Progress for completed quizzes */}
                      {progress?.passed && (
                        <div className="mb-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-400 font-semibold">ผ่านแล้ว!</span>
                            <span className="text-green-400">{progress.bestPercentage}%</span>
                          </div>
                          <div className="text-xs text-green-300 mt-1">
                            คะแนนสูงสุด: {progress.bestScore} คะแนน
                          </div>
                        </div>
                      )}

                      {/* Failed attempts warning */}
                      {progress?.totalAttempts > 0 && !progress.passed && (
                        <div className="mb-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-red-400">ยังไม่ผ่าน</span>
                            <span className="text-red-400">{progress.bestPercentage}%</span>
                          </div>
                          <div className="text-xs text-red-300 mt-1">
                            ทำไปแล้ว {progress.totalAttempts}/{quiz.maxAttempts || '∞'} ครั้ง
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Brain size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-400">จำนวนข้อ:</span>
                          </div>
                          <span className="text-white font-semibold">{quiz.questions.length} ข้อ</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Clock size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-400">เวลา:</span>
                          </div>
                          <span className="text-white font-semibold">
                            {quiz.timeLimit ? `${quiz.timeLimit} นาที` : 'ไม่จำกัด'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Target size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-400">ผ่าน:</span>
                          </div>
                          <span className="text-white font-semibold">{quiz.passingScore}%</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Trophy size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-400">ระดับ:</span>
                          </div>
                          <span className={`font-semibold ${getDifficultyColor(averageDifficulty)}`}>
                            {getDifficultyText(averageDifficulty)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-400">
                              คะแนนเต็ม {quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0)} คะแนน
                            </span>
                            <span className={`text-sm font-semibold ${getQuizStatusColor(quiz.id)}`}>
                              {getQuizStatusText(quiz.id)}
                            </span>
                          </div>
                          <div className="text-blue-400 group-hover:translate-x-1 transition-transform">
                            <PlayCircle size={24} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex flex-col min-h-[420px] overflow-hidden">
                    {/* Background blur overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        {getQuizStatusIcon(quiz.id)}
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center animate-pulse">
                            <XCircle className="text-red-400" size={18} />
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-300 mb-2">
                        {quiz.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-3">
                        บทเรียน: {getModuleTitle(quiz.moduleId)}
                      </p>
                      
                      <div className="flex-grow mb-4">
                        <p className="text-gray-400 leading-relaxed text-sm opacity-70">
                          {quiz.description}
                        </p>
                      </div>

                      {/* Highlighted Unlock Requirements */}
                      <div className="mb-4 p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/20 backdrop-blur-md hover:shadow-yellow-400/40 transition-all duration-300 group/unlock">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center mr-3 group-hover/unlock:bg-yellow-400/30 transition-colors duration-300">
                            <Trophy className="text-yellow-400 group-hover/unlock:text-yellow-300 transition-colors duration-300" size={18} />
                          </div>
                          <span className="text-yellow-300 font-bold text-base group-hover/unlock:text-yellow-200 transition-colors duration-300">🔒 เงื่อนไขการปลดล็อก</span>
                        </div>
                        
                        <div className="bg-black/40 rounded-lg p-4 border border-yellow-400/30 group-hover/unlock:border-yellow-400/50 transition-all duration-300">
                          <div className="text-sm text-yellow-200 space-y-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                              <span>ต้องเรียน "<span className="font-semibold text-yellow-300 group-hover/unlock:text-yellow-200 transition-colors duration-300">{quizUnlockInfo?.moduleTitle || 'บทเรียน'}</span>" อย่างน้อย <span className="font-bold text-yellow-300 text-lg group-hover/unlock:text-yellow-200 transition-colors duration-300">{quizUnlockInfo?.requiredPercentage || 60}%</span></span>
                            </div>
                            
                            <div className="bg-gray-800/50 rounded-lg p-3 border border-yellow-400/20 group-hover/unlock:border-yellow-400/40 transition-all duration-300">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-yellow-300 font-medium group-hover/unlock:text-yellow-200 transition-colors duration-300">ความคืบหน้าปัจจุบัน:</span>
                                <span className="font-bold text-yellow-300 text-lg group-hover/unlock:text-yellow-200 transition-colors duration-300">{quizUnlockInfo?.currentPercentage || 0}%</span>
                              </div>
                              
                              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-yellow-400/30 group-hover/unlock:border-yellow-400/50 transition-all duration-300">
                                <div 
                                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 ease-out relative group-hover/unlock:from-yellow-300 group-hover/unlock:to-orange-300"
                                  style={{ width: `${Math.min(quizUnlockInfo?.currentPercentage || 0, 100)}%` }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/unlock:opacity-100 transition-opacity duration-300 animate-[shimmer_2s_infinite]"></div>
                                </div>
                              </div>
                              
                              <div className="mt-2 text-xs text-yellow-200 group-hover/unlock:text-yellow-100 transition-colors duration-300">
                                {(quizUnlockInfo?.currentPercentage || 0) >= (quizUnlockInfo?.requiredPercentage || 60) ? (
                                  <span className="text-green-400 font-semibold animate-pulse">✅ ครบเงื่อนไขแล้ว!</span>
                                ) : (
                                  <span>ต้องเรียนเพิ่มอีก <span className="font-semibold text-yellow-300 group-hover/unlock:text-yellow-200 transition-colors duration-300">{(quizUnlockInfo?.requiredPercentage || 60) - (quizUnlockInfo?.currentPercentage || 0)}%</span></span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                              <span>💡 เคล็ดลับ: อ่านเนื้อหาในบทเรียนให้ครบตามที่กำหนด</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action button */}
                        <div className="mt-4 text-center">
                          <Link
                            href="/learning"
                            className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25 group-hover/unlock:shadow-yellow-500/50"
                          >
                            <BookOpen size={16} className="mr-2" />
                            ไปเรียนบทเรียน
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dimmed quiz details */}
                    <div className="relative z-10 space-y-2 mb-4 opacity-40 blur-sm">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Brain size={16} className="text-gray-600 mr-2" />
                          <span className="text-gray-600">จำนวนข้อ:</span>
                        </div>
                        <span className="text-gray-500 font-semibold">{quiz.questions.length} ข้อ</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-600 mr-2" />
                          <span className="text-gray-600">เวลา:</span>
                        </div>
                        <span className="text-gray-500 font-semibold">
                          {quiz.timeLimit ? `${quiz.timeLimit} นาที` : 'ไม่จำกัด'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Target size={16} className="text-gray-600 mr-2" />
                          <span className="text-gray-600">ผ่าน:</span>
                        </div>
                        <span className="text-gray-500 font-semibold">{quiz.passingScore}%</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Trophy size={16} className="text-gray-600 mr-2" />
                          <span className="text-gray-600">ระดับ:</span>
                        </div>
                        <span className="text-gray-500 font-semibold">
                          {getDifficultyText(averageDifficulty)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative z-10 mt-auto pt-4 border-t border-white/5 opacity-40">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-600">
                            คะแนนเต็ม {quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0)} คะแนน
                          </span>
                          <span className="text-sm font-semibold text-red-400 flex items-center">
                            <XCircle size={14} className="mr-1" />
                            ล็อกอยู่
                          </span>
                        </div>
                        <div className="text-gray-600 opacity-50">
                          <Brain size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-16">
            <Brain className="mx-auto text-gray-500 mb-4" size={64} />
            <h3 className="text-2xl text-gray-400 mb-2">ยังไม่มีแบบทดสอบ</h3>
            <p className="text-gray-500">แบบทดสอบจะปรากฏขึ้นเมื่อมีบทเรียนใหม่</p>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-16 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Brain className="mr-2 text-blue-400" size={24} />
            วิธีการปลดล็อกแบบฝึกหัด
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">เงื่อนไขการปลดล็อก</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="text-green-400 mr-2 mt-0.5" size={16} />
                  <span>ต้องเรียนเนื้อหาในบทเรียนไปอย่างน้อย 60%</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-400 mr-2 mt-0.5" size={16} />
                  <span>อ่านบทเรียนจนครบตามจำนวนที่กำหนด</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-green-400 mr-2 mt-0.5" size={16} />
                  <span>ระบบจะปลดล็อกโดยอัตโนมัติเมื่อครบเงื่อนไข</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">คำแนะนำ</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <Star className="text-yellow-400 mr-2 mt-0.5" size={16} />
                  <span>ไปที่หน้าบทเรียนเพื่อเรียนรู้เนื้อหา</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-yellow-400 mr-2 mt-0.5" size={16} />
                  <span>ติดตามความคืบหน้าในการ์ดแต่ละบทเรียน</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-yellow-400 mr-2 mt-0.5" size={16} />
                  <span>แบบฝึกหัดจะช่วยทบทวนความรู้ที่ได้เรียนมา</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/learning"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              <BookOpen size={20} className="mr-2" />
              ไปเรียนบทเรียน
            </Link>
          </div>
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
