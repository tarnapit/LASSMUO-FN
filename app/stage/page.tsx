"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Star, Play, Clock, Award, Trophy } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { stageData } from "../data/stages";
import { progressManager } from "../lib/progress";
import { PlayerProgress } from "../types/stage";

export default function StagePage() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | null>(null);

  useEffect(() => {
    // โหลด progress เมื่อ component mount
    const progress = progressManager.getProgress();
    setPlayerProgress(progress);
  }, []);

  // ดึงข้อมูลด่านจาก data และผสมกับความคืบหน้าของผู้เล่น
  const stages = Object.values(stageData).map(stage => {
    const progress = playerProgress?.stages[stage.id];
    const isUnlocked = progress?.isUnlocked || false;
    
    return {
      ...stage,
      isUnlocked,
      isCompleted: progress?.isCompleted || false,
      stars: progress?.stars || 0,
      bestScore: progress?.bestScore || 0,
      attempts: progress?.attempts || 0,
      lastAttempt: progress?.lastAttempt
    };
  });

  // จัดเรียงด่านตาม id
  stages.sort((a, b) => a.id - b.id);

  // Function to close popup when clicking outside
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedStage(null);
    }
  };

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
              <span>{playerProgress?.completedStages.length || 0} ด่านสำเร็จ</span>
            </div>
          </div>
        </div>

        {/* Stage Map - Duolingo Style */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8" onClick={handleBackgroundClick}>

          {stages.map((stage, index) => {
            // Duolingo-style zigzag positioning
            const isEven = index % 2 === 0;
            const translateX = isEven ? 'translate-x-0' : index % 4 === 1 ? 'translate-x-16' : '-translate-x-16';
            
            return (
              <div
                key={stage.id}
                className={`relative flex justify-center mb-20 sm:mb-24 ${translateX} transition-all duration-500 z-10`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="relative group"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (stage.isUnlocked) {
                      setSelectedStage(selectedStage === stage.id ? null : stage.id);
                    }
                  }}
                >
                  {/* Glow Effect */}
                  {stage.isUnlocked && (
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${
                      stage.isCompleted 
                        ? 'bg-green-400 animate-pulse' 
                        : 'bg-blue-400'
                    }`}></div>
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
                      ${selectedStage === stage.id ? "scale-125 shadow-2xl" : ""}
                    `}
                  >
                    {/* Inner Circle */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      stage.isUnlocked ? 'bg-white/20' : 'bg-gray-800/50'
                    }`}>
                      {/* Stage Number or Lock */}
                      {stage.isUnlocked ? (
                        <div className="text-2xl font-black drop-shadow-lg">{stage.id}</div>
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
                  
                  {/* Stars Display */}
                  {stage.isUnlocked && stage.stars > 0 && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {[1, 2, 3].map((star) => (
                        <div
                          key={star}
                          className={`transition-all duration-300 ${
                            star <= stage.stars ? 'animate-pulse' : ''
                          }`}
                        >
                          <Star
                            size={12}
                            className={
                              star <= stage.stars
                                ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                                : "text-gray-500 fill-gray-500"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
              const stage = stages.find(s => s.id === selectedStage);
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        stage.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        stage.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {stage.difficulty === 'easy' ? 'ง่าย' : 
                         stage.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
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
                      <span className="text-white font-medium">{stage.estimatedTime}</span>
                    </div>
                    
                    {stage.prerequisites.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">ต้องผ่านด่าน:</span>
                        <span className="text-white font-medium">
                          {stage.prerequisites.join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {stage.attempts > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">จำนวนครั้งที่เล่น:</span>
                        <span className="text-white font-medium">{stage.attempts}</span>
                      </div>
                    )}
                    
                    {stage.bestScore > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">คะแนนสูงสุด:</span>
                        <span className="text-white font-medium">{stage.bestScore}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Stars */}
                  <div className="flex items-center justify-between mb-6 p-3 bg-slate-700 rounded-lg">
                    <span className="text-gray-300 text-sm font-medium">ดาวที่ได้รับ:</span>
                    <div className="flex items-center space-x-2">
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
                      <span className="text-white text-sm ml-2 font-medium">
                        ({stage.stars}/{stage.totalStars})
                      </span>
                    </div>
                  </div>
                  
                  {/* Rewards Preview */}
                  {stage.rewards && (
                    <div className="mb-6 p-4 bg-slate-700 rounded-lg">
                      <h4 className="text-sm font-semibold text-white mb-3">รางวัลที่จะได้รับ:</h4>
                      <div className="text-sm text-gray-300 space-y-2">
                        <div className="flex items-center">
                          <span className="mr-2">⭐</span>
                          <span>{stage.rewards.stars} ดาว</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">🏆</span>
                          <span>{stage.rewards.points} คะแนน</span>
                        </div>
                        {stage.rewards.badges && stage.rewards.badges.length > 0 && (
                          <div className="flex items-start">
                            <span className="mr-2">🏅</span>
                            <span className="break-words">เหรียญ: {stage.rewards.badges.join(', ')}</span>
                          </div>
                        )}
                        {stage.rewards.unlocksStages && stage.rewards.unlocksStages.length > 0 && (
                          <div className="flex items-start">
                            <span className="mr-2">🔓</span>
                            <span className="break-words">ปลดล็อกด่าน: {stage.rewards.unlocksStages.join(', ')}</span>
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
                    <span>{stage.isCompleted ? 'เล่นอีกครั้ง' : 'เริ่มเล่น'}</span>
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
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
