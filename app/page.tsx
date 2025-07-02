"use client";
import Link from "next/link";
import { Rocket, Users, BookOpen, Gamepad2 } from "lucide-react";
import Navbar from "./components/layout/Navbar";

export default function HomePage() {
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

          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-12 py-4 rounded-lg text-xl hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            {text.getStart}
          </button>
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
