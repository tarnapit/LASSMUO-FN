"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Star, Play } from "lucide-react";
import Navbar from "../components/layout/Navbar";

export default function StagePage() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  // ข้อมูลด่านต่างๆ
  const stages = [
    {
      id: 1,
      title: "ระบบสุริยะ",
      description: "เรียนรู้เกี่ยวกับดวงอาทิตย์และดาวเคราะห์",
      isUnlocked: true,
      stars: 3,
      isCompleted: true,
    },
    {
      id: 2,
      title: "ดาวเคราะห์ใน",
      description: "สำรวจดาวพุธ ดาวศุกร์ โลก และดาวอังคาร",
      isUnlocked: true,
      stars: 2,
      isCompleted: false,
    },
    {
      id: 3,
      title: "ดาวเคราะห์นอก",
      description: "ค้นพบดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน",
      isUnlocked: true,
      stars: 0,
      isCompleted: false,
    },
    {
      id: 4,
      title: "ดวงจันทร์และดาวเทียม",
      description: "เรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมของดาวเคราะห์",
      isUnlocked: false,
      stars: 0,
      isCompleted: false,
    },
    {
      id: 5,
      title: "ดาวหาง",
      description: "สำรวจดาวหางและวัตถุในระบบสุริยะ",
      isUnlocked: false,
      stars: 0,
      isCompleted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Solar System
          </h1>
          <p className="text-xl text-gray-300">
            เลือกด่านที่ต้องการเรียนรู้
          </p>
        </div>

        {/* Stage Map */}
        <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="relative"
              onClick={() => stage.isUnlocked && setSelectedStage(stage.id)}
            >
              {/* Stage Circle */}
              <div
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300
                  ${
                    stage.isUnlocked
                      ? stage.isCompleted
                        ? "bg-orange-500 text-white hover:bg-orange-400"
                        : "bg-white text-black hover:bg-gray-100"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }
                  ${selectedStage === stage.id ? "scale-110 shadow-lg" : ""}
                `}
              >
                {stage.isUnlocked ? (
                  stage.id
                ) : (
                  <Lock size={24} />
                )}
              </div>

              {/* Stage Info Popup */}
              {selectedStage === stage.id && stage.isUnlocked && (
                <div className="absolute left-24 top-0 bg-slate-800 rounded-lg p-4 w-72 shadow-xl border border-slate-700 z-10">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {stage.description}
                  </p>
                  
                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= stage.stars
                            ? "text-yellow-400 fill-current"
                            : "text-gray-500"
                        }
                      />
                    ))}
                  </div>

                  {/* Play Button */}
                  <button 
                    onClick={() => router.push(`/stage/${stage.id}`)}
                    className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play size={16} />
                    <span>เริ่มเล่น</span>
                  </button>
                </div>
              )}

              {/* Connection Line */}
              {index < stages.length - 1 && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-600"></div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16">
          <div className="w-full max-w-2xl mx-auto">
            <div className="h-px bg-gray-600 mb-4"></div>
            <p className="text-white text-lg">New Place</p>
            <div className="h-px bg-gray-600 mt-4"></div>
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
