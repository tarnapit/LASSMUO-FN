"use client";
import { useEffect, useState } from "react";
import { Star, Clock, Trophy, X, Gift, Award, TrendingUp } from "lucide-react";
import { StageData } from "../../types/stage";

interface EnhancedResultsComponentProps {
  stageInfo: StageData;
  score: number;
  totalQuestions: number;
  time: string;
  onFinish: () => void;
  onRetry: () => void;
  isNavigating?: boolean;
}

export default function EnhancedResultsComponent({
  stageInfo,
  score,
  totalQuestions,
  time,
  onFinish,
  onRetry,
  isNavigating = false
}: EnhancedResultsComponentProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayStars, setDisplayStars] = useState(0);

  // Calculate results
  const percentage = Math.min((score / totalQuestions) * 100, 100); // Cap at 100%
  
  // Dynamic star calculation based on actual score performance
  let starsEarned = 0;
  if (score === totalQuestions) {
    starsEarned = 3; // Perfect score = 3 stars
  } else if (score >= Math.ceil(totalQuestions * 0.8)) {
    starsEarned = 2; // 80%+ = 2 stars
  } else if (score >= Math.ceil(totalQuestions * 0.5)) {
    starsEarned = 1; // 50%+ = 1 star
  }
  
  const isPassed = score > 0;
  const pointsEarned = Math.floor((percentage / 100) * (stageInfo.stage.rewards?.points || 100));

  // Animation sequence
  useEffect(() => {
    const sequences = [
      () => setAnimationPhase(1), // Show character
      () => setAnimationPhase(2), // Show stats
      () => {
        // Animate score counting
        let currentScore = 0;
        const scoreInterval = setInterval(() => {
          if (currentScore < score) {
            currentScore++;
            setDisplayScore(currentScore);
          } else {
            clearInterval(scoreInterval);
          }
        }, Math.max(50, 500 / score)); // Adjust speed based on score
      },
      () => {
        // Animate stars
        let currentStars = 0;
        const starInterval = setInterval(() => {
          currentStars++;
          setDisplayStars(currentStars);
          if (currentStars >= starsEarned) {
            clearInterval(starInterval);
            setAnimationPhase(3); // Show rewards
          }
        }, 300);
      }
    ];

    sequences.forEach((sequence, index) => {
      setTimeout(sequence, index * 800);
    });
  }, [score, starsEarned]);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "เยี่ยมยอด! นักเรียนดีเด่น! 🌟", color: "text-yellow-400" };
    if (percentage >= 70) return { message: "ดีมาก! เก่งมากเลย! 🎉", color: "text-green-400" };
    if (percentage >= 50) return { message: "ดี! ผ่านเกณฑ์แล้ว! 👍", color: "text-blue-400" };
    return { message: "ไม่เป็นไร ลองใหม่นะ! 💪", color: "text-orange-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`absolute animate-float opacity-20 text-2xl ${
              i % 3 === 0 ? 'text-yellow-400' : i % 3 === 1 ? 'text-blue-400' : 'text-purple-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {i % 4 === 0 ? '⭐' : i % 4 === 1 ? '🎉' : i % 4 === 2 ? '💫' : '✨'}
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="text-center space-y-8 max-w-4xl w-full">
          {/* Character and Message */}
          <div className={`
            transform transition-all duration-1000 
            ${animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            <div className="text-8xl mb-4 animate-bounce">{stageInfo.character?.avatar || "🚀"}</div>
            <h1 className={`text-4xl font-bold mb-4 ${performance.color}`}>
              {isPassed ? "ยอดเยี่ยม!" : "เกือบได้แล้ว!"}
            </h1>
            <p className={`text-2xl mb-4 ${performance.color}`}>
              {performance.message}
            </p>
            
            <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-white text-lg">
                {isPassed 
                  ? (stageInfo.character?.completionMessage || "ยอดเยี่ยม! คุณผ่านด่านนี้แล้ว!") 
                  : "คุณต้องได้อย่างน้อย 1 คะแนนเพื่อผ่านด่าน ลองใหม่อีกครั้งนะ!"
                }
              </p>
            </div>
          </div>

          {/* Results Grid */}
          <div className={`
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
            transform transition-all duration-1000 delay-500
            ${animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            {/* Score */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 text-center backdrop-blur-sm border border-blue-500/30">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-blue-300 text-lg font-bold mb-2">คะแนน</h3>
              <p className="text-white text-4xl font-bold mb-1">
                {displayScore}/{totalQuestions}
              </p>
              <p className="text-blue-300 text-sm">{percentage.toFixed(0)}%</p>
            </div>
            
            {/* Time */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 text-center backdrop-blur-sm border border-purple-500/30">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-purple-300 text-lg font-bold mb-2">เวลาที่ใช้</h3>
              <p className="text-white text-4xl font-bold">{time}</p>
            </div>
            
            {/* Stars */}
            <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 rounded-xl p-6 text-center backdrop-blur-sm border border-yellow-500/30">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-yellow-300 text-lg font-bold mb-2">ดาวที่ได้รับ</h3>
              <div className="flex justify-center space-x-1 mb-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={`
                      transition-all duration-300 delay-${star * 300}
                      ${star <= displayStars
                        ? "text-yellow-400 fill-current scale-110" 
                        : "text-gray-500 scale-90"
                      }
                    `}
                  />
                ))}
              </div>
              <p className="text-white text-2xl font-bold">{displayStars}/3</p>
            </div>
            
            {/* Points */}
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 text-center backdrop-blur-sm border border-green-500/30">
              <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-green-300 text-lg font-bold mb-2">คะแนนที่ได้</h3>
              <p className="text-white text-4xl font-bold">+{isPassed ? pointsEarned : 0}</p>
              {!isPassed && (
                <p className="text-red-300 text-sm mt-1">ต้องผ่านด่านจึงจะได้คะแนน</p>
              )}
            </div>
          </div>
          
          {/* Pass/Fail Status */}
          <div className={`
            transform transition-all duration-1000 delay-1000
            ${animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            <div className={`
              inline-block p-4 rounded-xl border-2 
              ${isPassed 
                ? 'bg-green-900/50 border-green-500 text-green-400' 
                : 'bg-red-900/50 border-red-500 text-red-400'
              }
            `}>
              <div className="flex items-center justify-center space-x-2">
                {isPassed ? (
                  <>
                    <Trophy className="w-6 h-6" />
                    <span className="font-bold text-lg">ผ่านด่านแล้ว!</span>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6" />
                    <span className="font-bold text-lg">ยังไม่ผ่านด่าน</span>
                  </>
                )}
              </div>
              {isPassed && (
                <p className="text-green-300 text-sm text-center mt-1">
                  ด่านถัดไปปลดล็อกแล้ว! 🎉
                </p>
              )}
            </div>
          </div>

          {/* Rewards Section */}
          {isPassed && animationPhase >= 3 && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/30 backdrop-blur-sm animate-fadeIn">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                <Gift className="w-8 h-8 mr-2" />
                🎉 รางวัลที่ได้รับ!
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <div className="flex items-center space-x-3 justify-center md:justify-start">
                  <span className="text-3xl">🏆</span>
                  <span className="text-lg">คะแนน: +{pointsEarned}</span>
                </div>
                <div className="flex items-center space-x-3 justify-center md:justify-start">
                  <span className="text-3xl">⭐</span>
                  <span className="text-lg">ดาว: +{starsEarned}</span>
                </div>
                {stageInfo.stage.rewards?.badges && stageInfo.stage.rewards.badges.length > 0 && (
                  <div className="flex items-center space-x-3 justify-center md:justify-start">
                    <span className="text-3xl">🏅</span>
                    <span className="text-lg">เหรียญ: {stageInfo.stage.rewards.badges.join(', ')}</span>
                  </div>
                )}
                {stageInfo.stage.rewards?.unlocksStages && stageInfo.stage.rewards.unlocksStages.length > 0 && (
                  <div className="flex items-center space-x-3 justify-center md:justify-start">
                    <span className="text-3xl">🔓</span>
                    <span className="text-lg">ปลดล็อกด่าน: {stageInfo.stage.rewards.unlocksStages.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className={`
            flex flex-col sm:flex-row gap-4 justify-center
            transform transition-all duration-1000 delay-1500
            ${animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            {!isPassed && (
              <button 
                onClick={onRetry}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105"
              >
                🔄 ลองอีกครั้ง
              </button>
            )}
            
            <button 
              onClick={onFinish}
              disabled={isNavigating}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isNavigating ? '🔄 กำลังโหลด...' : '🗺️ กลับสู่แผนที่ด่าน'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
