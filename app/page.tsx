"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Rocket, Users, BookOpen, Gamepad2, Star, Trophy, Target } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import { progressManager } from "./lib/progress";
import { authManager } from "./lib/auth";
import { PlayerProgress } from "./types/stage";

export default function HomePage() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // โหลด progress และสถานะ auth
    const currentProgress = progressManager.getProgress();
    setProgress(currentProgress);
    setIsLoggedIn(authManager.isLoggedIn());

    // Listen for auth changes
    const unsubscribe = authManager.onAuthStateChange((user) => {
      setIsLoggedIn(!!user);
      // รีโหลด progress เมื่อ auth state เปลี่ยน
      const newProgress = progressManager.getProgress();
      setProgress(newProgress);
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

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-8 py-20">
        <div className="text-center max-w-4xl">
          <p className="text-yellow-300 text-lg mb-4 tracking-wide">
            {text.explore}
          </p>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            {text.learning}
          </h1>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-12">
            {text.forFun}
          </h2>

          <Link href="/stage">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-12 py-4 rounded-lg text-xl hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-2xl">
              {text.getStart}
            </button>
          </Link>

          {/* Progress Display */}
          {progress && (progress.totalStars > 0 || progress.completedStages.length > 0) && (
            <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-white text-xl font-semibold mb-4 text-center">
                ความคืบหน้าของคุณ
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="text-yellow-400 mr-2" size={24} />
                    <span className="text-2xl font-bold text-white">{progress.totalStars}</span>
                  </div>
                  <p className="text-gray-300 text-sm">ดาวที่เก็บได้</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="text-green-400 mr-2" size={24} />
                    <span className="text-2xl font-bold text-white">{progress.completedStages.length}</span>
                  </div>
                  <p className="text-gray-300 text-sm">ด่านที่ผ่าน</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="text-blue-400 mr-2" size={24} />
                    <span className="text-2xl font-bold text-white">{progress.totalPoints}</span>
                  </div>
                  <p className="text-gray-300 text-sm">คะแนนรวม</p>
                </div>
              </div>
              
              {/* Save Status */}
              <div className="mt-4 text-center">
                {isLoggedIn ? (
                  <p className="text-green-400 text-sm flex items-center justify-center">
                    <Star className="mr-1" size={16} />
                    ข้อมูลถูกบันทึกถาวรแล้ว
                  </p>
                ) : (
                  <p className="text-yellow-400 text-sm flex items-center justify-center">
                    <Target className="mr-1" size={16} />
                    ข้อมูลชั่วคราว - ล็อกอินเพื่อบันทึกถาวร
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 text-white/20">
          <Rocket size={48} />
        </div>
        <div className="absolute top-40 right-20 text-white/20">
          <BookOpen size={40} />
        </div>
        <div className="absolute bottom-40 left-20 text-white/20">
          <Users size={44} />
        </div>
        <div className="absolute bottom-20 right-10 text-white/20">
          <Gamepad2 size={42} />
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
