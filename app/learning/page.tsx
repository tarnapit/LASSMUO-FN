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

export default function LearningPage() {
  const [moduleProgresses, setModuleProgresses] = useState<Record<string, any>>(
    {}
  );
  const [showQuizCard, setShowQuizCard] = useState<Record<string, boolean>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Use data adapter for learning modules
  const { modules: learningModules, loading: modulesLoading, error: modulesError } = useLearningData();

  useEffect(() => {
    // โหลดข้อมูล user
    const user = authManager.getCurrentUser();
    setCurrentUser(user);
    
    // มิเกรตข้อมูลเก่าก่อน
    progressManager.migrateOldQuizData();

    // ฟังก์ชันโหลด progress
    const loadProgress = () => {
      const progresses: Record<string, any> = {};
      learningModules?.forEach((module: any) => {
        // ตรวจสอบและ complete module ถ้าจำเป็น
        progressManager.checkAndCompleteModule(module.id);

        const moduleProgress = progressManager.getModuleProgress(module.id);
        const completionPercentage =
          progressManager.getModuleCompletionPercentage(module.id);
        progresses[module.id] = {
          ...moduleProgress,
          completionPercentage,
        };
      });
      setModuleProgresses(progresses);
    };

    // โหลด progress ครั้งแรก
    loadProgress();

    // ฟัง progress updates จาก quiz completion หรือ chapter completion
    const handleProgressUpdate = (event: CustomEvent) => {
      console.log("Progress updated:", event.detail);
      setTimeout(() => {
        loadProgress(); // โหลด progress ใหม่หลังจาก delay เล็กน้อย
      }, 100);
    };

    // ฟัง visibility change เมื่อ user กลับมายัง tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page visible again, reloading progress...");
        setTimeout(() => {
          loadProgress();
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-400 text-xl">เกิดข้อผิดพลาด: {modulesError}</div>
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

  const getModuleStatusIcon = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return <BookOpen className="text-yellow-400" size={32} />;

    // ตรวจสอบว่าได้ 100% (เสร็จสมบูรณ์)
    if (progressManager.isModulePerfect(moduleId)) {
      return <CheckCircle className="text-green-500" size={32} />;
    }
    // ตรวจสอบว่าผ่านเกณฑ์ (70%)
    else if (progressManager.isModulePassed(moduleId)) {
      return <CheckCircle className="text-green-400" size={32} />;
    }
    // กำลังเรียนอยู่
    else if (progress.isStarted) {
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

    // ตรวจสอบว่าได้ 100% (เสร็จสมบูรณ์)
    if (progressManager.isModulePerfect(moduleId)) {
      return "เรียนจบแล้ว";
    }
    // ตรวจสอบว่าผ่านเกณฑ์ (70%)
    else if (progressManager.isModulePassed(moduleId)) {
      return `ผ่านแล้ว`;
    }
    // กำลังเรียนอยู่
    else if (progress.isStarted) {
      return `กำลังเรียน`;
    }
    // ยังไม่เริ่ม
    else {
      return "เริ่มเรียน";
    }
  };

  const getProgressDetails = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return null;

    // ใช้ข้อมูลจาก learning modules โดยตรง
    const module = learningModules?.find((m: any) => m.id === moduleId);
    const totalChapters = module?.chapters?.length || 0;
    const completedChapters = progress.completedChapters?.length || 0;
    const readingProgress =
      totalChapters > 0 ? (completedChapters / totalChapters) * 60 : 0;
    const quizProgress = progressManager.getModuleQuizProgress?.(moduleId) || 0;

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

    // ตรวจสอบว่าได้ 100% (เสร็จสมบูรณ์)
    if (progressManager.isModulePerfect(moduleId)) {
      return "text-green-500";
    }
    // ตรวจสอบว่าผ่านเกณฑ์ (70%)
    else if (progressManager.isModulePassed(moduleId)) {
      return "text-green-400";
    }
    // กำลังเรียนอยู่
    else if (progress.isStarted) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
          {learningModules?.map((module: any) => {
            const quiz = getQuizByModuleId(module.id);
            const progress = moduleProgresses[module.id];
            const isCompleted = progress?.isCompleted;

            return (
              <div key={module.id} className="group h-full">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 border border-slate-700/50 h-full flex flex-col min-h-[450px] sm:min-h-[500px] shadow-xl">
                  {/* Header with Status */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {getModuleStatusIcon(module.id)}
                      <div className="flex flex-col">
                        <span className={`text-xs sm:text-sm font-semibold ${getModuleStatusColor(module.id)}`}>
                          {getModuleStatusText(module.id)}
                        </span>
                        <span className={`text-xs ${getLevelColor(module.level)}`}>
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
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors leading-tight">
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
                    <div className="mb-6">
                      <h4 className="text-white text-sm font-semibold mb-3">กิจกรรมการเรียนรู้:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-blue-300">เนื้อหาหลัก</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                          <Brain className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-300">ทดสอบความเข้าใจ</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                          <PlayCircle className="w-4 h-4 text-purple-400" />
                          <span className="text-xs text-purple-300">แบบฝึกหัด</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
                          <BarChart3 className="w-4 h-4 text-orange-400" />
                          <span className="text-xs text-orange-300">ประเมินผล</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {moduleProgresses[module.id]?.isStarted && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">ความคืบหน้า</span>
                          <span
                            className={
                              progressManager.isModulePerfect(module.id)
                                ? "text-green-500"
                                : progressManager.isModulePassed(module.id)
                                ? "text-green-400"
                                : "text-blue-400"
                            }
                          >
                            {moduleProgresses[module.id].completionPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 absolute left-0 top-0 ${
                              progressManager.isModulePerfect(module.id)
                                ? styles.progressFillGreen
                                : progressManager.isModulePassed(module.id)
                                ? styles.progressFillYellow
                                : styles.progressFillPurple
                            }`}
                            data-progress={moduleProgresses[module.id].completionPercentage}
                          />
                        </div>
                        {/* แสดงข้อมูลเพิ่มเติมเกี่ยวกับสิ่งที่ต้องทำ */}
                        {moduleProgresses[module.id]?.isStarted && (
                          <div className="text-xs mt-1">
                            {progressManager.isModulePerfect(module.id) ? (
                              <div className="text-green-400">
                                ✅ เรียนจบแล้ว คะแนนเต็ม!
                              </div>
                            ) : progressManager.isModulePassed(module.id) ? (
                              <div className="text-yellow-400">
                                💡 ทำแบบฝึกหัดให้ได้คะแนนเต็มเพื่อให้ได้ 100%
                              </div>
                            ) : (
                              <div className="text-red-400">
                                ⚠️ ต้องได้คะแนนรวม 70% ขึ้นไปจึงจะผ่าน
                              </div>
                            )}
                          </div>
                        )}
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

                    <div className="mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-400">
                            {module.chapters.length} บท
                          </span>
                          <span
                            className={`text-sm font-semibold ${getModuleStatusColor(
                              module.id
                            )}`}
                          >
                            {getModuleStatusText(module.id)}
                          </span>
                        </div>
                        <div className="text-yellow-400 group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Quiz Section - Show when reading is complete (can attempt quiz) */}
                  {moduleProgresses[module.id]?.isStarted && quiz && (
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
