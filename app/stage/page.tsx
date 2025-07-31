"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Star, Play, Clock, Award, Trophy } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { stageData } from "../data/stages";
import { progressManager } from "../lib/progress";
import { PlayerProgress } from "../types/stage";
import { useStages, useStagesByCourse, useUser } from "../lib/api/hooks";
import { authManager } from "../lib/auth";

export default function StagePage() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<any>(null);

  // API hooks for stage data
  const { data: apiStages, loading: stagesLoading, error: stagesError } = useStages();
  
  // ดึงข้อมูลด่านจาก data และผสมกับความคืบหน้าของผู้เล่น
  const processedStages = Object.values(stageData).map((stage) => {
    const progress = playerProgress?.stages[stage.id];
    const isUnlocked = progress?.isUnlocked || stage.id === 1; // stage 1 ปลดล็อกเสมอ

    return {
      ...stage,
      isUnlocked,
      isCompleted: progress?.isCompleted || false,
      stars: progress?.stars || 0,
      bestScore: progress?.bestScore || 0,
      attempts: progress?.attempts || 0,
      lastAttempt: progress?.lastAttempt,
      totalStars: stage.totalStars || 3, // เพิ่ม totalStars จาก stageData
    };
  });

  // จัดเรียงด่านตาม id
  processedStages.sort((a, b) => a.id - b.id);

  // Use API stages if available for additional data, otherwise use processed local data
  const finalStages = apiStages?.data ? 
    processedStages.map(stage => {
      const apiStage = apiStages.data?.find((s: any) => s.id === stage.id);
      return apiStage ? { ...stage, ...apiStage } : stage;
    }) : processedStages;

  useEffect(() => {
    // โหลดข้อมูล user
    const user = authManager.getCurrentUser();
    setCurrentUser(user);
    
    // โหลด progress เมื่อ component mount
    const progress = progressManager.getProgress();
    setPlayerProgress(progress);
    console.log("Initial progress loaded:", progress);

    // เพิ่ม listener สำหรับการกลับมาหน้านี้
    const handleRouterEvents = () => {
      setTimeout(() => {
        const updatedProgress = progressManager.getProgress();
        setPlayerProgress(updatedProgress);
        console.log(
          "Progress auto-refreshed on route change:",
          updatedProgress
        );
      }, 500);
    };

    // Listen for browser back/forward
    window.addEventListener("popstate", handleRouterEvents);

    return () => {
      window.removeEventListener("popstate", handleRouterEvents);
    };
  }, []);

  // Function to refresh progress (เรียกใช้เมื่อต้องการอัพเดท)
  const refreshProgress = () => {
    const progress = progressManager.getProgress();
    setPlayerProgress(progress);
    console.log("Stage page progress refreshed:", progress);
  };

  // Listen for focus event เพื่ออัพเดท progress เมื่อกลับมาจากหน้าเล่นเกม
  useEffect(() => {
    const handleFocus = () => {
      refreshProgress();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshProgress();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Listen for storage changes เพื่ออัพเดท progress เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    const handleStorageChange = () => {
      refreshProgress();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for route changes เพื่อ refresh progress
  useEffect(() => {
    const handleRouteChange = () => {
      // รอสักครู่แล้วค่อย refresh เพื่อให้ข้อมูลใหม่อัพเดท
      setTimeout(() => {
        refreshProgress();
      }, 100);
    };

    // Listen for when component becomes visible again
    const handlePageShow = () => {
      refreshProgress();
    };

    // เพิ่ม interval เพื่อ check progress ทุก 1 วินาที (เฉพาะเมื่อ tab active)
    const progressInterval = setInterval(() => {
      if (!document.hidden) {
        refreshProgress();
      }
    }, 1000);

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      clearInterval(progressInterval);
    };
  }, []);

  // Debug: แสดงข้อมูล progress ในคอนโซล
  useEffect(() => {
    if (playerProgress) {
      console.log("Current player progress:", playerProgress);
      console.log(
        "Stages data with stars:",
        finalStages.map((s) => ({
          id: s.id,
          stars: s.stars,
          isCompleted: s.isCompleted,
          totalStars: s.totalStars,
          stageProgress: playerProgress.stages[s.id as number],
        }))
      );
    }
  }, [playerProgress]);

  // Function to close popup when clicking outside
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedStage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-200 opacity-50"></div>
        <div className="absolute bottom-20 right-32 w-1 h-1 bg-green-400 rounded-full animate-ping delay-300 opacity-60"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-500 opacity-40"></div>
        <div className="absolute top-80 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping delay-700 opacity-50"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-8 py-12 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-16 max-w-6xl mx-auto">
          {/* Header Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30">
              <Award className="w-5 h-5 text-indigo-400 mr-2" />
              <span className="text-indigo-300 text-sm font-semibold">ระบบการเรียนรู้แบบขั้นตอน</span>
            </div>
          </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            การผจญภัยในอวกาศ
          </h1>
          
          <p className="text-gray-300 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-12">
            เริ่มต้นการเดินทางสู่ความรู้ดาราศาสตร์ผ่านด่านต่างๆ 
            <br />
            <span className="text-purple-400 font-semibold">ปลดล็อคเนื้อหาใหม่เมื่อผ่านด่าน!</span>
          </p>

          {/* Player Progress Summary */}
          <div className="flex justify-center items-center space-x-6 mt-6 text-white">
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-400" size={20} />
              <span>{playerProgress?.totalStars || 0} ดาว</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="text-blue-400" size={20} />
              <span>{playerProgress?.totalPoints || 0} คะแนน</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="text-green-400" size={20} />
              <span>
                {playerProgress?.completedStages.length || 0} ด่านสำเร็จ
              </span>
            </div>
          </div>
        </div>

        {/* Stage Map - Duolingo Style */}
        <div
          className="relative max-w-4xl mx-auto px-4 sm:px-8"
          onClick={handleBackgroundClick}
        >
          {finalStages.map((stage, index) => {
            // Duolingo-style zigzag positioning
            const isEven = index % 2 === 0;
            const translateX = isEven
              ? "translate-x-0"
              : index % 4 === 1
              ? "translate-x-16"
              : "-translate-x-16";

            return (
              <div
                key={stage.id}
                className={`relative flex justify-center mb-24 sm:mb-28 ${translateX} transition-all duration-500 z-10`}
              >
                <div
                  className="relative group"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (stage.isUnlocked) {
                      setSelectedStage(
                        selectedStage === stage.id ? null : Number(stage.id)
                      );
                    }
                  }}
                >
                  {/* Glow Effect */}
                  {stage.isUnlocked && (
                    <div
                      className={`absolute inset-0 rounded-full blur-xl opacity-30 ${
                        stage.isCompleted
                          ? "bg-green-400 animate-pulse"
                          : "bg-blue-400"
                      }`}
                    ></div>
                  )}

                  {/* Stage Circle */}
                  <div
                    className={`
                      relative w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-500 transform group-hover:scale-110
                      ${
                        stage.isUnlocked
                          ? stage.isCompleted
                            ? "bg-gradient-to-br from-emerald-400 via-green-500 to-green-600 text-white shadow-2xl shadow-green-500/25 hover:shadow-green-400/40 border-4 border-green-300"
                            : "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-400/40 border-4 border-blue-300"
                          : "bg-gradient-to-br from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed border-4 border-gray-500"
                      }
                      ${
                        selectedStage === stage.id ? "scale-125 shadow-2xl" : ""
                      }
                    `}
                  >
                    {/* Inner Circle */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        stage.isUnlocked ? "bg-white/20" : "bg-gray-800/50"
                      }`}
                    >
                      {/* Stage Number or Lock */}
                      {stage.isUnlocked ? (
                        <div className="text-2xl font-black drop-shadow-lg">
                          {stage.id}
                        </div>
                      ) : (
                        <Lock size={24} className="drop-shadow-lg" />
                      )}
                    </div>

                    {/* Floating Animation for Active Stage */}
                    {stage.isUnlocked && !stage.isCompleted && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                    )}
                  </div>

                  {/* Completion Crown */}
                  {stage.isCompleted && (
                    <div className="absolute -top-3 -right-2 animate-bounce">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
                        <Trophy size={16} className="text-yellow-900" />
                      </div>
                    </div>
                  )}

                  {/* Stars Display - แสดงดาวที่ได้แล้ว */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[1, 2, 3].map((star) => (
                      <div
                        key={star}
                        className={`transition-all duration-300 ${
                          star <= stage.stars ? "animate-pulse" : ""
                        }`}
                      >
                        <Star
                          size={16}
                          className={
                            star <= stage.stars
                              ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                              : "text-gray-600 fill-gray-600"
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16">
          <div className="w-full max-w-2xl mx-auto">
            <div className="h-px bg-gray-600 mb-4"></div>
            <div className="flex flex-col space-y-4">
              <p className="text-white text-lg">New Place</p>
              <p className="text-gray-300 text-sm">
                ด่านใหม่จะถูกเพิ่มเข้ามาเรื่อยๆ อย่าลืมกลับมาเล่นอีกนะ!
              </p>
            </div>
            <div className="h-px bg-gray-600 mt-4"></div>
          </div>
        </div>
      </div>

      {/* Stage Info Modal */}
      {selectedStage && (
        <>
          {/* Full Screen Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedStage(null)}
          ></div>

          {/* Centered Modal Popup */}
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 rounded-lg p-6 w-[90vw] max-w-md shadow-2xl border border-slate-700 z-50 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const stage = finalStages.find((s) => s.id === selectedStage);
              if (!stage) return null;

              return (
                <>
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedStage(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white text-lg font-bold transition-colors shadow-lg hover:shadow-xl"
                  >
                    ×
                  </button>

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white pr-8">
                        {stage.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          stage.difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : stage.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stage.difficulty === "easy"
                          ? "ง่าย"
                          : stage.difficulty === "medium"
                          ? "ปานกลาง"
                          : "ยาก"}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>

                  {/* Stage Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <Clock size={16} className="mr-2" />
                        เวลาโดยประมาณ:
                      </span>
                      <span className="text-white font-medium">
                        {stage.estimatedTime}
                      </span>
                    </div>

                    {stage.prerequisites.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">ต้องผ่านด่าน:</span>
                        <span className="text-white font-medium">
                          {stage.prerequisites.join(", ")}
                        </span>
                      </div>
                    )}

                    {stage.attempts > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          จำนวนครั้งที่เล่น:
                        </span>
                        <span className="text-white font-medium">
                          {stage.attempts}
                        </span>
                      </div>
                    )}

                    {stage.bestScore > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">คะแนนสูงสุด:</span>
                        <span className="text-white font-medium">
                          {stage.bestScore}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center justify-between mb-6 p-3 bg-slate-700 rounded-lg">
                    <span className="text-gray-300 text-sm font-medium">
                      ดาวที่ได้รับ:
                    </span>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= stage.stars
                              ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                              : "text-gray-500"
                          }
                        />
                      ))}
                      <span className="text-white text-sm ml-2 font-medium">
                        ({stage.stars}/{stage.totalStars || 3})
                      </span>
                    </div>
                  </div>

                  {/* Progress Status */}
                  {stage.isCompleted && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                      <div className="flex items-center text-green-400 text-sm">
                        <Trophy size={16} className="mr-2" />
                        <span className="font-medium">ผ่านด่านแล้ว!</span>
                      </div>
                      {stage.bestScore > 0 && (
                        <div className="text-green-300 text-xs mt-1">
                          คะแนนสูงสุด: {stage.bestScore} | เล่นไปแล้ว:{" "}
                          {stage.attempts} ครั้ง
                        </div>
                      )}
                    </div>
                  )}

                  {/* Incomplete Status */}
                  {!stage.isCompleted && stage.attempts > 0 && (
                    <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center text-yellow-400 text-sm">
                        <Star size={16} className="mr-2" />
                        <span className="font-medium">ยังไม่ผ่านด่าน</span>
                      </div>
                      <div className="text-yellow-300 text-xs mt-1">
                        ต้องได้อย่างน้อย 1 คะแนนเพื่อผ่านด่าน | เล่นไปแล้ว:{" "}
                        {stage.attempts} ครั้ง
                      </div>
                    </div>
                  )}

                  {/* Rewards Preview */}
                  {stage.rewards && (
                    <div className="mb-6 p-4 bg-slate-700 rounded-lg">
                      <h4 className="text-sm font-semibold text-white mb-3">
                        รางวัลที่จะได้รับ:
                      </h4>
                      <div className="text-sm text-gray-300 space-y-2">
                        <div className="flex items-center">
                          <span className="mr-2">⭐</span>
                          <span>{stage.rewards.stars} ดาว</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">🏆</span>
                          <span>{stage.rewards.points} คะแนน</span>
                        </div>
                        {stage.rewards.badges &&
                          stage.rewards.badges.length > 0 && (
                            <div className="flex items-start">
                              <span className="mr-2">🏅</span>
                              <span className="break-words">
                                เหรียญ: {stage.rewards.badges.join(", ")}
                              </span>
                            </div>
                          )}
                        {stage.rewards.unlocksStages &&
                          stage.rewards.unlocksStages.length > 0 && (
                            <div className="flex items-start">
                              <span className="mr-2">🔓</span>
                              <span className="break-words">
                                ปลดล็อกด่าน:{" "}
                                {stage.rewards.unlocksStages.join(", ")}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Play Button */}
                  <button
                    onClick={() => router.push(`/stage/${stage.id}`)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold py-3 px-4 rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Play size={18} />
                    <span>
                      {stage.isCompleted ? "เล่นอีกครั้ง" : "เริ่มเล่น"}
                    </span>
                  </button>
                </>
              );
            })()}
          </div>
        </>
      )}

      {/* Background Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-3/4 right-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse`}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
