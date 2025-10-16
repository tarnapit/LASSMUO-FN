"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GameResult as GameResultType } from "../../../types/mini-game";
import { 
  Trophy, 
  Star, 
  Clock, 
  Target, 
  RotateCcw, 
  ArrowLeft,
  TrendingUp,
  Award,
  Zap,
  CheckCircle
} from "lucide-react";

interface GameResultProps {
  result: GameResultType;
  gameId: string;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function GameResult({ result, gameId, onRestart, onBackToMenu }: GameResultProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const getPerformanceLevel = () => {
    if (result.percentage >= 90) return { text: "เยอะเยี่ยม!", color: "text-yellow-400", icon: "🏆" };
    if (result.percentage >= 80) return { text: "ดีมาก!", color: "text-green-400", icon: "⭐" };
    if (result.percentage >= 70) return { text: "ดี!", color: "text-blue-400", icon: "👍" };
    if (result.percentage >= 60) return { text: "พอใช้", color: "text-orange-400", icon: "📈" };
    return { text: "ต้องพัฒนา", color: "text-red-400", icon: "💪" };
  };

  const performance = getPerformanceLevel();

  const getGameModeText = () => {
    switch (result.gameMode) {
      case 'score-challenge': return 'สะสมคะแนน';
      case 'time-rush': return 'ท้าทายเวลา';
      case 'random-quiz': return 'ทบทวนแบบสุ่ม';
      default: return 'Mini Game';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-20 right-32 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`text-6xl mb-4 ${showAnimation ? 'animate-bounce' : ''}`}>
              {performance.icon}
            </div>
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${performance.color}`}>
              {performance.text}
            </h1>
            <p className="text-gray-300 text-xl">
              เล่น{getGameModeText()}เสร็จสิ้น
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl mb-8">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
                <Trophy className="text-yellow-400" size={48} />
                <div>
                  <div className="text-4xl font-bold text-white">{result.score}</div>
                  <div className="text-gray-300">คะแนนรวม</div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {/* Accuracy */}
              <div className="text-center">
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30 mb-2">
                  <Target className="text-green-400 mx-auto" size={32} />
                </div>
                <div className="text-2xl font-bold text-white">{result.percentage}%</div>
                <div className="text-gray-400 text-sm">ความแม่นยำ</div>
              </div>

              {/* Correct Answers */}
              <div className="text-center">
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30 mb-2">
                  <CheckCircle className="text-blue-400 mx-auto" size={32} />
                </div>
                <div className="text-2xl font-bold text-white">{result.correctAnswers}/{result.totalQuestions}</div>
                <div className="text-gray-400 text-sm">ตอบถูก</div>
              </div>

              {/* Time */}
              <div className="text-center">
                <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30 mb-2">
                  <Clock className="text-orange-400 mx-auto" size={32} />
                </div>
                <div className="text-2xl font-bold text-white">{Math.round(result.timeSpent)}</div>
                <div className="text-gray-400 text-sm">วินาที</div>
              </div>

              {/* Bonus */}
              <div className="text-center">
                <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30 mb-2">
                  <Zap className="text-purple-400 mx-auto" size={32} />
                </div>
                <div className="text-2xl font-bold text-white">{result.bonusPoints || 0}</div>
                <div className="text-gray-400 text-sm">โบนัส</div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">ประสิทธิภาพ</span>
                <span className={`font-bold ${performance.color}`}>{result.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    result.percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                    result.percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-orange-500'
                  }`}
                  style={{ width: `${Math.min(result.percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Achievements */}
            {result.percentage >= 80 && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="text-yellow-400" size={24} />
                  <h3 className="text-yellow-300 font-bold text-lg">ความสำเร็จใหม่!</h3>
                </div>
                <div className="text-yellow-200">
                  {result.percentage >= 95 ? "🏆 ปรมาจารย์! ได้คะแนนเกือบเต็ม!" :
                   result.percentage >= 90 ? "⭐ นักสู้ตัวจริง! คะแนนยอดเยี่ยม!" :
                   "🎯 เก่งมาก! ผ่านเกณฑ์ยอดเยี่ยม!"}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw className="w-6 h-6" />
              เล่นอีกครั้ง
            </button>

            <button
              onClick={onBackToMenu}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6" />
              กลับเมนู
            </button>
          </div>

          {/* Fun Stats */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
              <TrendingUp className="text-green-400" size={20} />
              <span className="text-gray-300">
                {result.gameMode === 'time-rush' 
                  ? `ตอบได้ ${(result.correctAnswers / (result.timeSpent / 60)).toFixed(1)} ข้อต่อนาที`
                  : `ใช้เวลาเฉลี่ย ${(result.timeSpent / result.totalQuestions).toFixed(1)} วินาทีต่อข้อ`
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}