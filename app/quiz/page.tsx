"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { quizzes } from "../data/quizzes";
import { learningModules } from "../data/learning-modules";
import { progressManager } from "../lib/progress";
import Navbar from "../components/layout/Navbar";
import { 
  Brain, 
  Clock, 
  Target, 
  Trophy, 
  PlayCircle, 
  CheckCircle,
  XCircle,
  BarChart3,
  Star
} from "lucide-react";

export default function QuizPage() {
  const [quizProgresses, setQuizProgresses] = useState<Record<string, any>>({});

  useEffect(() => {
    // มิเกรตข้อมูลเก่าก่อน
    progressManager.migrateOldQuizData();
    
    // โหลด progress ของทุก quiz จาก progressManager
    const progresses = progressManager.getAllQuizProgress();
    setQuizProgresses(progresses);
  }, []);

  const getModuleTitle = (moduleId: string) => {
    const module = learningModules.find(m => m.id === moduleId);
    return module?.title || 'Unknown Module';
  };

  const getQuizStatusIcon = (quizId: string) => {
    const progress = quizProgresses[quizId];
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
      
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">แบบทดสอบ</h1>
          <p className="text-gray-300 text-lg">ทดสอบความเข้าใจหลังจากเรียนบทเรียนเสร็จแล้ว</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {quizzes.map((quiz) => {
            const averageDifficulty = calculateAverageDifficulty(quiz);
            const progress = quizProgresses[quiz.id];
            
            return (
              <Link 
                key={quiz.id} 
                href={`/quiz/${quiz.id}`}
                className="group h-full"
              >
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
                          คะแนนเต็ม {quiz.questions.reduce((sum, q) => sum + q.points, 0)} คะแนน
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
