"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { miniGames } from "../../data/mini-games";
import { getQuestionsForMode, calculateTimeBonus } from "../../data/mini-game-questions";
import { MiniGameQuestion, GameSession, type GameResult } from "../../types/mini-game";
import Navbar from "../../components/layout/Navbar";
import { 
  ArrowLeft, 
  Clock, 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle,
  Brain,
  Zap,
  Target,
  Play,
  RotateCcw
} from "lucide-react";
import Link from "next/link";

// Import game components - Temporary implementations
// import ScoreChallengeGame from "./components/ScoreChallengeGame";
// import TimeRushGame from "./components/TimeRushGame";
// import RandomQuizGame from "./components/RandomQuizGame";

// Temporary Game Components
function ScoreChallengeGame({ onGameFinish }: { onGameFinish: (result: GameResult) => void }) {
  const handleComplete = () => {
    const result: GameResult = {
      score: 120,
      correctAnswers: 12,
      totalQuestions: 15,
      percentage: 80,
      timeSpent: 180,
      bonusPoints: 20,
      gameMode: 'score-challenge',
      breakdown: []
    };
    onGameFinish(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">🏆 โหมดท้าทายคะแนน</h1>
        <p className="text-gray-400 mb-8">เกมกำลังพัฒนา...</p>
        <button 
          onClick={handleComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          ทดสอบผลลัพธ์
        </button>
      </div>
    </div>
  );
}

function TimeRushGame({ onGameFinish }: { onGameFinish: (result: GameResult) => void }) {
  const handleComplete = () => {
    const result: GameResult = {
      score: 85,
      correctAnswers: 17,
      totalQuestions: 20,
      percentage: 85,
      timeSpent: 60,
      bonusPoints: 15,
      gameMode: 'time-rush',
      breakdown: []
    };
    onGameFinish(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">⚡ โหมดแข่งกับเวลา</h1>
        <p className="text-gray-400 mb-8">เกมกำลังพัฒนา...</p>
        <button 
          onClick={handleComplete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          ทดสอบผลลัพธ์
        </button>
      </div>
    </div>
  );
}

function RandomQuizGame({ onGameFinish }: { onGameFinish: (result: GameResult) => void }) {
  const handleComplete = () => {
    const result: GameResult = {
      score: 108,
      correctAnswers: 9,
      totalQuestions: 12,
      percentage: 90,
      timeSpent: 240,
      bonusPoints: 8,
      gameMode: 'random-quiz',
      breakdown: []
    };
    onGameFinish(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">🎯 โหมดทบทวนความรู้</h1>
        <p className="text-gray-400 mb-8">เกมกำลังพัฒนา...</p>
        <button 
          onClick={handleComplete}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          ทดสอบผลลัพธ์
        </button>
      </div>
    </div>
  );
}

// Loading component
function GameLoadingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Brain className="text-blue-400 animate-pulse mx-auto mb-4" size={64} />
          <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 border-t-blue-400"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">กำลังเตรียมเกม...</h2>
        <p className="text-gray-400">รอสักครู่นะ</p>
      </div>
    </div>
  );
}

// Game Instructions Component
function GameInstructions({ gameId, onStart }: { gameId: string; onStart: () => void }) {
  const game = miniGames.find(g => g.id === gameId);
  
  const getInstructions = () => {
    switch (gameId) {
      case 'score-challenge':
        return {
          title: 'โหมดสะสมคะแนน',
          icon: <Trophy className="w-12 h-12 text-yellow-400" />,
          description: 'ตอบคำถามหลากหลายประเภทเพื่อสะสมคะแนน',
          rules: [
            '📝 คำถาม 15 ข้อ จากหลายประเภท',
            '🏆 ได้คะแนนจากความถูกต้อง',
            '⚡ ตอบเร็วได้โบนัสพิเศษ',
            '🎯 เป้าหมาย: คะแนนสูงสุด'
          ],
          tips: [
            'อ่านคำถามให้ละเอียด',
            'ตอบเร็วเพื่อได้โบนัส',
            'ใช้เวลาคิดในข้อยาก'
          ]
        };
      case 'time-rush':
        return {
          title: 'โหมดท้าทายเวลา',
          icon: <Clock className="w-12 h-12 text-red-400" />,
          description: 'ตอบคำถามให้ได้มากที่สุดใน 60 วินาที',
          rules: [
            '⏱️ เวลา 60 วินาที',
            '🚀 คำถามทีละข้อ',
            '❌ ตอบผิดข้ามไปทันที',
            '🏃‍♂️ เป้าหมาย: คำตอบมากสุด'
          ],
          tips: [
            'ตอบด้วยสัญชาตญาณ',
            'อย่าเสียเวลาคิดนาน',
            'เน้นความเร็ว'
          ]
        };
      case 'random-quiz':
        return {
          title: 'โหมดทบทวนแบบสุ่ม',
          icon: <Target className="w-12 h-12 text-green-400" />,
          description: 'คำถามสุ่มจากทุกบทเรียน',
          rules: [
            '🎲 คำถาม 12 ข้อ แบบสุ่ม',
            '📚 จากทุกหัวข้อ',
            '🧠 หลากหลายรูปแบบ',
            '📊 เน้นความเข้าใจ'
          ],
          tips: [
            'ทบทวนความรู้ทั้งหมด',
            'อ่านคำอธิบายเมื่อผิด',
            'เน้นการเรียนรู้'
          ]
        };
      default:
        return null;
    }
  };

  const instructions = getInstructions();
  if (!instructions || !game) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/mini-game" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            กลับไปเลือกเกม
          </Link>

          {/* Game Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              {instructions.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              {instructions.title}
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              {instructions.description}
            </p>
          </div>

          {/* Game Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Game Rules */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="text-yellow-400" size={24} />
                  กติกาการเล่น
                </h3>
                <div className="space-y-3">
                  {instructions.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-blue-400 text-sm mt-1">•</div>
                      <span className="text-gray-300">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Tips */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="text-purple-400" size={24} />
                  เคล็ดลับ
                </h3>
                <div className="space-y-3">
                  {instructions.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-purple-400 text-sm mt-1">💡</div>
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{game.estimatedTime}</div>
                  <div className="text-gray-400 text-sm">เวลาโดยประมาณ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{game.points}</div>
                  <div className="text-gray-400 text-sm">คะแนนสูงสุด</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{game.difficulty}</div>
                  <div className="text-gray-400 text-sm">ความยาก</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">⭐ 4.8</div>
                  <div className="text-gray-400 text-sm">คะแนนเฉลี่ย</div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-xl px-12 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <Play size={24} />
              เริ่มเล่นเลย!
            </button>
            <p className="text-gray-400 mt-4">คลิกเพื่อเริ่มการผจญภัย</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Game Result Component  
function GameResult({ result, gameId, onRestart, onBackToMenu }: {
  result: GameResult;
  gameId: string;
  onRestart: () => void;
  onBackToMenu: () => void;
}) {
  const game = miniGames.find(g => g.id === gameId);
  const isExcellent = result.percentage >= 90;
  const isGood = result.percentage >= 70;
  const isPassed = result.percentage >= 60;

  const getPerformanceMessage = () => {
    if (isExcellent) return { message: "ยอดเยี่ยม! 🌟", color: "text-yellow-400" };
    if (isGood) return { message: "ดีมาก! 🎉", color: "text-green-400" };
    if (isPassed) return { message: "ผ่านแล้ว! ✨", color: "text-blue-400" };
    return { message: "ลองใหม่นะ! 💪", color: "text-orange-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Result Header */}
          <div className="mb-12">
            <div className="text-6xl mb-4">
              {isExcellent ? "🏆" : isGood ? "🎉" : isPassed ? "✨" : "💪"}
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${performance.color}`}>
              {performance.message}
            </h1>
            <p className="text-gray-300 text-xl">
              คุณทำ{game?.title}เสร็จแล้ว!
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{result.score}</div>
                <div className="text-gray-400">คะแนนรวม</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{result.percentage}%</div>
                <div className="text-gray-400">เปอร์เซ็นต์</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-gray-400">ตอบถูก</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{Math.round(result.timeSpent)}s</div>
                <div className="text-gray-400">เวลาที่ใช้</div>
              </div>
            </div>

            {/* Bonus Points */}
            {result.bonusPoints > 0 && (
              <div className="bg-yellow-500/20 rounded-2xl p-6 border border-yellow-500/30 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Zap className="text-yellow-400" size={24} />
                  <span className="text-yellow-400 font-bold text-lg">คะแนนโบนัส!</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400">+{result.bonusPoints}</div>
                <div className="text-yellow-200 text-sm">จากการตอบเร็ว</div>
              </div>
            )}

            {/* Performance Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>ผลการทำ</span>
                <span>{result.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 progress-${Math.round(result.percentage / 10) * 10} ${
                    isExcellent ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                    isGood ? 'bg-gradient-to-r from-green-400 to-blue-400' :
                    isPassed ? 'bg-gradient-to-r from-blue-400 to-purple-400' :
                    'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300"
            >
              <RotateCcw size={20} />
              เล่นอีกครั้ง
            </button>
            
            <button
              onClick={onBackToMenu}
              className="inline-flex items-center gap-3 bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <ArrowLeft size={20} />
              กลับเมนู
            </button>
          </div>

          {/* Encouragement Message */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
            <p className="text-gray-300">
              {isExcellent ? 
                "สุดยอด! คุณเป็นผู้เชี่ยวชาญดาราศาสตร์แล้ว! 🌟" :
                isGood ?
                "เก่งมาก! ความรู้ของคุณดีแล้ว ลองโหมดอื่นดูสิ! 🚀" :
                isPassed ?
                "ดีแล้ว! ฝึกฝนเพิ่มเติมเพื่อให้เก่งขึ้น! 📚" :
                "ไม่เป็นไร! ลองเล่นใหม่และอ่านคำอธิบายให้ดี! 💪"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Game Page Component
export default function MiniGamePlayPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'finished'>('instructions');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameFinish = (result: GameResult) => {
    setGameResult(result);
    setGameState('finished');
  };

  const handleRestart = () => {
    setGameResult(null);
    setGameState('instructions');
  };

  const handleBackToMenu = () => {
    router.push('/mini-game');
  };

  if (isLoading) {
    return <GameLoadingComponent />;
  }

  // Check if game exists
  const game = miniGames.find(g => g.id === gameId);
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">ไม่พบเกม</h1>
          <Link href="/mini-game" className="text-blue-400 hover:text-blue-300">
            กลับไปเลือกเกม
          </Link>
        </div>
      </div>
    );
  }

  // Show instructions
  if (gameState === 'instructions') {
    return <GameInstructions gameId={gameId} onStart={handleStartGame} />;
  }

  // Show game result
  if (gameState === 'finished' && gameResult) {
    return (
      <GameResult 
        result={gameResult} 
        gameId={gameId}
        onRestart={handleRestart}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Show game component based on gameId
  const renderGame = () => {
    switch (gameId) {
      case 'score-challenge':
        return <ScoreChallengeGame onGameFinish={handleGameFinish} />;
      case 'time-rush':
        return <TimeRushGame onGameFinish={handleGameFinish} />;
      case 'random-quiz':
        return <RandomQuizGame onGameFinish={handleGameFinish} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">เกมนี้ยังไม่พร้อม</h1>
              <Link href="/mini-game" className="text-blue-400 hover:text-blue-300">
                กลับไปเลือกเกม
              </Link>
            </div>
          </div>
        );
    }
  };

  return renderGame();
}
