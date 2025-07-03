"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { learningModules } from "../data/learning-modules";
import { progressManager } from "../lib/progress";
import Navbar from "../components/layout/Navbar";
import { BookOpen, Clock, Star, CheckCircle, PlayCircle, BarChart3 } from "lucide-react";

export default function LearningPage() {
  const [moduleProgresses, setModuleProgresses] = useState<Record<string, any>>({});

  useEffect(() => {
    // โหลด progress ของทุก module
    const progresses: Record<string, any> = {};
    learningModules.forEach(module => {
      const moduleProgress = progressManager.getModuleProgress(module.id);
      const completionPercentage = progressManager.getModuleCompletionPercentage(module.id, module.chapters.length);
      progresses[module.id] = {
        ...moduleProgress,
        completionPercentage
      };
    });
    setModuleProgresses(progresses);
  }, []);

  const text = {
    lesson: "บทเรียน",
    level: "ระดับ:",
    time: "เวลา:",
    fundamental: "พื้นฐาน",
    intermediate: "ปานกลาง",
    advanced: "ขั้นสูง"
  };

  const getModuleStatusIcon = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return <BookOpen className="text-yellow-400" size={32} />;
    
    if (progress.isCompleted) {
      return <CheckCircle className="text-green-400" size={32} />;
    } else if (progress.isStarted) {
      return <PlayCircle className="text-blue-400" size={32} />;
    } else {
      return <BookOpen className="text-yellow-400" size={32} />;
    }
  };

  const getModuleStatusText = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return "เริ่มเรียน";
    
    if (progress.isCompleted) {
      return "เรียนจบแล้ว";
    } else if (progress.isStarted) {
      return `กำลังเรียน (${progress.completionPercentage}%)`;
    } else {
      return "เริ่มเรียน";
    }
  };

  const getModuleStatusColor = (moduleId: string) => {
    const progress = moduleProgresses[moduleId];
    if (!progress) return "text-yellow-400";
    
    if (progress.isCompleted) {
      return "text-green-400";
    } else if (progress.isStarted) {
      return "text-blue-400";
    } else {
      return "text-yellow-400";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Fundamental': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-green-400';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'Fundamental': return text.fundamental;
      case 'Intermediate': return text.intermediate;
      case 'Advanced': return text.advanced;
      default: return text.fundamental;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">{text.lesson}</h1>
          <p className="text-gray-300 text-lg">เลือกบทเรียนที่คุณสนใจเพื่อเริ่มการเรียนรู้</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {learningModules.map((module) => (
            <Link 
              key={module.id} 
              href={`/learning/${module.id}`}
              className="group h-full"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 h-full flex flex-col min-h-[420px]">
                <div className="flex items-center justify-between mb-4">
                  {getModuleStatusIcon(module.id)}
                  <div className="flex items-center space-x-2">
                    {moduleProgresses[module.id]?.isStarted && (
                      <BarChart3 className="text-blue-400" size={20} />
                    )}
                    <Star className="text-gray-400 group-hover:text-yellow-400 transition-colors" size={20} />
                  </div>
                </div>
                
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
                      <span className="text-blue-400">{moduleProgresses[module.id].completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                      <div 
                        className={`bg-blue-400 h-2 rounded-full transition-all duration-300 absolute left-0 top-0`}
                        style={{ width: `${Math.min(moduleProgresses[module.id].completionPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 mr-2">{text.level}</span>
                    <span className={`font-semibold ${getLevelColor(module.level)}`}>
                      {getLevelText(module.level)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-300">{module.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400">
                        {module.chapters.length} บท
                      </span>
                      <span className={`text-sm font-semibold ${getModuleStatusColor(module.id)}`}>
                        {getModuleStatusText(module.id)}
                      </span>
                    </div>
                    <div className="text-yellow-400 group-hover:translate-x-1 transition-transform">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
