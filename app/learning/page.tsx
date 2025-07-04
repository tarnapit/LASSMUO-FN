"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { learningModules } from "../data/learning-modules";
import { getQuizByModuleId } from "../data/quizzes";
import { progressManager } from "../lib/progress";
import Navbar from "../components/layout/Navbar";
import QuizCard from "../components/ui/QuizCard";
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

  useEffect(() => {
    // มิเกรตข้อมูลเก่าก่อน
    progressManager.migrateOldQuizData();

    // ฟังก์ชันโหลด progress
    const loadProgress = () => {
      const progresses: Record<string, any> = {};
      learningModules.forEach((module) => {
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
  }, []);

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
      return "เรียนจบแล้ว (100%)";
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
    const module = learningModules.find((m) => m.id === moduleId);
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

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">{text.lesson}</h1>
          <p className="text-gray-300 text-lg mb-6">
            เลือกบทเรียนที่คุณสนใจเพื่อเริ่มการเรียนรู้
          </p>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4 mb-8">
            <Link
              href="/quiz"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              <Brain size={20} className="mr-2" />
              ดูแบบทดสอบทั้งหมด
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {learningModules.map((module) => {
            const quiz = getQuizByModuleId(module.id);
            const progress = moduleProgresses[module.id];
            const isCompleted = progress?.isCompleted;

            return (
              <div key={module.id} className="group h-full">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 h-full flex flex-col min-h-[420px]">
                  <div className="flex items-center justify-between mb-4">
                    {getModuleStatusIcon(module.id)}
                    <div className="flex items-center space-x-2">
                      {moduleProgresses[module.id]?.isStarted && (
                        <BarChart3 className="text-blue-400" size={20} />
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
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {module.title}
                    </h3>

                    <div className="flex-grow mb-4 h-20 flex items-start">
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {module.description.length > 120
                          ? module.description.substring(0, 120) + "..."
                          : module.description}
                      </p>
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
                                ? "bg-green-500"
                                : progressManager.isModulePassed(module.id)
                                ? "bg-green-400"
                                : "bg-blue-400"
                            }`}
                            style={{
                              width: `${Math.min(
                                moduleProgresses[module.id]
                                  .completionPercentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        {/* แสดงข้อมูลเพิ่มเติมเกี่ยวกับสิ่งที่ต้องทำเพื่อให้ได้ 100% */}
                        {progressManager.isModulePassed(module.id) &&
                          !progressManager.isModulePerfect(module.id) && (
                            <div className="text-xs text-yellow-400 mt-1">
                              💡 ทำแบบฝึกหัดให้ได้คะแนนเต็มเพื่อให้ได้ 100%
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

                  {/* Quiz Section - Show when module is passed (70% or more) */}
                  {(progressManager.isModulePassed(module.id) || isCompleted) &&
                    quiz && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <QuizCard quiz={quiz} moduleTitle={module.title} />
                      </div>
                    )}
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
