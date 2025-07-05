"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/layout/Navbar";
import { ArrowLeft, Zap, Heart, Clock, Gauge, AlertTriangle, Target, Trophy } from "lucide-react";
import Link from "next/link";

interface BlackHoleGameState {
  gamePhase: 'waiting' | 'playing' | 'finished';
  score: number;
  lives: number;
  timeLeft: number;
  currentStage: number;
  totalStages: number;
  escapeDistance: number;
  maxEscapeDistance: number;
  gravityPull: number;
  shipSpeed: number;
  powerLevel: number;
  currentChallenge: string;
  achievements: string[];
}

interface BlackHoleChallenge {
  id: string;
  name: string;
  description: string;
  physicsRule: string;
  requiredAction: string;
  successBonus: number;
  failurePenalty: number;
}

const blackHoleChallenges: BlackHoleChallenge[] = [
  {
    id: 'gravity-slingshot',
    name: 'แกว่งแรงโน้มถ่วง',
    description: 'ใช้แรงโน้มถ่วงของดาวเคราะห์เพื่อเร่งความเร็วหนีหลุมดำ',
    physicsRule: 'ยิ่งเข้าใกล้ดาวเคราะห์ ยิ่งได้ความเร็วมาก แต่ระวังโดนแรงดึง',
    requiredAction: 'คลิกเมื่อยานอยู่ในระยะที่เหมาะสม',
    successBonus: 300,
    failurePenalty: 100
  },
  {
    id: 'wormhole-navigation',
    name: 'นำทางรูหนอน',
    description: 'ค้นหาและเข้าสู่รูหนอนที่จะพาคุณหลุดพ้นจากหลุมดำ',
    physicsRule: 'รูหนอนจะปรากฏเป็นจุดเปลี่ยนสีในอวกาศ',
    requiredAction: 'หลีกหลีกเศษซากและพุ่งเข้าสู่รูหนอน',
    successBonus: 500,
    failurePenalty: 200
  },
  {
    id: 'time-dilation',
    name: 'บิดเบือนเวลา',
    description: 'ใช้ปรากฏการณ์เวลาช้าลงเพื่อวางแผนการหลบหลีก',
    physicsRule: 'ยิ่งเข้าใกล้หลุมดำ เวลาจะยิ่งช้าลง ให้คุณมีเวลาคิดมากขึ้น',
    requiredAction: 'วางแผนการเคลื่อนที่ในขณะที่เวลาหยุดชั่วคราว',
    successBonus: 400,
    failurePenalty: 150
  },
  {
    id: 'hawking-radiation',
    name: 'รังสี Hawking',
    description: 'เก็บพลังงานจากรังสีที่หลุมดำปล่อยออกมา',
    physicsRule: 'หลุมดำปล่อยรังสีออกมา ใช้เป็นพลังงานได้',
    requiredAction: 'บินผ่านลำแสงรังสีโดยไม่ชนขอบ',
    successBonus: 600,
    failurePenalty: 300
  },
  {
    id: 'event-horizon',
    name: 'ขอบฟ้าเหตุการณ์',
    description: 'หลีกหลีกจากขอบฟ้าเหตุการณ์ จุดที่ไม่มีอะไรหลุดพ้นได้',
    physicsRule: 'ห้ามเข้าใกล้วงกลมสีดำ นั่นคือจุดที่ไม่มีทางกลับ',
    requiredAction: 'หลีกหลีกจากวงกลมสีดำขณะเก็บไอเทม',
    successBonus: 800,
    failurePenalty: 500
  }
];

export default function BlackHoleEscapeGame() {
  const params = useParams();
  const router = useRouter();
  const [gameState, setGameState] = useState<BlackHoleGameState>({
    gamePhase: 'waiting',
    score: 0,
    lives: 3,
    timeLeft: 120,
    currentStage: 1,
    totalStages: 5,
    escapeDistance: 0,
    maxEscapeDistance: 1000,
    gravityPull: 1.0,
    shipSpeed: 5,
    powerLevel: 100,
    currentChallenge: '',
    achievements: []
  });

  const [currentChallenge, setCurrentChallenge] = useState<BlackHoleChallenge | null>(null);
  const [showPhysicsInfo, setShowPhysicsInfo] = useState(false);
  const [particleEffects, setParticleEffects] = useState<any[]>([]);

  useEffect(() => {
    // Timer for the game
    let timer: NodeJS.Timeout;
    if (gameState.gamePhase === 'playing' && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          gravityPull: prev.gravityPull + 0.01, // Gravity increases over time
          escapeDistance: Math.max(0, prev.escapeDistance - (prev.gravityPull * 2))
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      endGame();
    }
    
    // Update progress bar
    const currentEscapePercentage = (gameState.escapeDistance / gameState.maxEscapeDistance) * 100;
    const progressBar = document.querySelector('.progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.style.setProperty('--progress-width', currentEscapePercentage.toString());
    }
    
    return () => clearTimeout(timer);
  }, [gameState.gamePhase, gameState.timeLeft, gameState.escapeDistance]);

  useEffect(() => {
    // Generate new challenge every 20 seconds
    const challengeTimer = setInterval(() => {
      if (gameState.gamePhase === 'playing') {
        generateNewChallenge();
      }
    }, 20000);

    return () => clearInterval(challengeTimer);
  }, [gameState.gamePhase]);

  const generateNewChallenge = () => {
    const availableChallenges = blackHoleChallenges.filter(
      challenge => !gameState.achievements.includes(challenge.id)
    );
    
    if (availableChallenges.length > 0) {
      const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setGameState(prev => ({
        ...prev,
        currentChallenge: randomChallenge.id
      }));
    }
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      timeLeft: 120,
      score: 0,
      lives: 3,
      currentStage: 1,
      escapeDistance: 0,
      gravityPull: 1.0,
      shipSpeed: 5,
      powerLevel: 100,
      achievements: []
    }));
    generateNewChallenge();
  };

  const completeChallenge = (success: boolean) => {
    if (!currentChallenge) return;

    if (success) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + currentChallenge.successBonus,
        escapeDistance: prev.escapeDistance + (currentChallenge.successBonus / 2),
        powerLevel: Math.min(100, prev.powerLevel + 20),
        achievements: [...prev.achievements, currentChallenge.id]
      }));
      
      // Check if escaped
      if (gameState.escapeDistance >= gameState.maxEscapeDistance) {
        winGame();
      }
    } else {
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - currentChallenge.failurePenalty),
        lives: prev.lives - 1,
        powerLevel: Math.max(0, prev.powerLevel - 10)
      }));
      
      if (gameState.lives <= 1) {
        endGame();
      }
    }
    
    setCurrentChallenge(null);
    setTimeout(() => generateNewChallenge(), 3000);
  };

  const winGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'finished',
      score: prev.score + 1000 // Bonus for escaping
    }));
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'finished'
    }));
  };

  const restartGame = () => {
    setGameState({
      gamePhase: 'waiting',
      score: 0,
      lives: 3,
      timeLeft: 120,
      currentStage: 1,
      totalStages: 5,
      escapeDistance: 0,
      maxEscapeDistance: 1000,
      gravityPull: 1.0,
      shipSpeed: 5,
      powerLevel: 100,
      currentChallenge: '',
      achievements: []
    });
    setCurrentChallenge(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGravityLevel = () => {
    if (gameState.gravityPull < 1.5) return { level: 'ปกติ', color: 'text-green-400' };
    if (gameState.gravityPull < 2.5) return { level: 'อันตราย', color: 'text-yellow-400' };
    if (gameState.gravityPull < 4.0) return { level: 'วิกฤต', color: 'text-orange-400' };
    return { level: 'ฉุกเฉิน', color: 'text-red-400' };
  };

  const escapePercentage = (gameState.escapeDistance / gameState.maxEscapeDistance) * 100;
  const gravityInfo = getGravityLevel();

  if (!params.gameId || params.gameId !== 'black-hole-escape') {
    router.push('/mini-game');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/mini-game" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้ามินิเกม
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                หนีนรกหลุมดำ 🕳️
              </h1>
              <p className="text-gray-300">
                ใช้ความรู้ฟิสิกส์และกลยุทธ์เพื่อหลุดพ้นจากแรงดึงดูดมฤตยูของหลุมดำ
              </p>
            </div>
            <div className="text-6xl animate-pulse">🚀</div>
          </div>
        </div>

        {/* Game Stats */}
        {gameState.gamePhase !== 'waiting' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="text-yellow-400" size={20} />
                <span className="text-gray-400">คะแนน</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.score}</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <Heart className="text-red-400" size={20} />
                <span className="text-gray-400">ชีวิต</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.lives}</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-blue-400" size={20} />
                <span className="text-gray-400">เวลา</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(gameState.timeLeft)}</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <Zap className="text-green-400" size={20} />
                <span className="text-gray-400">พลังงาน</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.powerLevel}%</div>
            </div>
          </div>
        )}

        {/* Escape Progress */}
        {gameState.gamePhase === 'playing' && (
          <div className="mb-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">ความคืบหน้าการหลบหลีก</h3>
                <div className="flex items-center space-x-2">
                  <Target className="text-purple-400" size={20} />
                  <span className="text-purple-400">{escapePercentage.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                <div 
                  className={`bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300 progress-bar`}
                  data-width={escapePercentage}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">ระยะห่างจากหลุมดำ</div>
                  <div className="text-lg font-bold text-white">{gameState.escapeDistance.toFixed(0)} km</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">แรงโน้มถ่วง</div>
                  <div className={`text-lg font-bold ${gravityInfo.color}`}>
                    {gravityInfo.level} ({gameState.gravityPull.toFixed(1)}x)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Challenge */}
        {currentChallenge && gameState.gamePhase === 'playing' && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">ภารกิจปัจจุบัน</h3>
                <AlertTriangle className="text-yellow-400" size={24} />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">
                    {currentChallenge.name}
                  </h4>
                  <p className="text-gray-300 mb-2">{currentChallenge.description}</p>
                  
                  <div className="bg-black/30 rounded-lg p-3 mb-3">
                    <div className="text-sm text-yellow-300 mb-1">📚 กฎฟิสิกส์:</div>
                    <div className="text-sm text-gray-300">{currentChallenge.physicsRule}</div>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3 mb-4">
                    <div className="text-sm text-green-300 mb-1">🎯 ภารกิจ:</div>
                    <div className="text-sm text-gray-300">{currentChallenge.requiredAction}</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => completeChallenge(true)}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-green-400 transition-all transform hover:scale-105"
                  >
                    ✅ สำเร็จ (+{currentChallenge.successBonus})
                  </button>
                  <button
                    onClick={() => completeChallenge(false)}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-500 hover:to-red-400 transition-all transform hover:scale-105"
                  >
                    ❌ ล้มเหลว (-{currentChallenge.failurePenalty})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Content */}
        <div className="max-w-4xl mx-auto">
          {gameState.gamePhase === 'waiting' && (
            <div className="text-center py-20">
              <div className="text-8xl mb-8 animate-pulse">🕳️</div>
              <h2 className="text-4xl font-bold text-white mb-4">พร้อมเข้าสู่หลุมดำหรือยัง?</h2>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                ภารกิจเป็นหรือตาย! ใช้ความรู้ฟิสิกส์ขั้นสูงเพื่อหลีกหลีกจากแรงดึงดูดมฤตยู
                ของหลุมดำ ผ่านความท้าทายทางวิทยาศาสตร์และปลดล็อคความลับของจักรวาล
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30">
                  <div className="text-3xl mb-3">🌌</div>
                  <h3 className="text-lg font-semibold text-white mb-2">เรียนรู้ฟิสิกส์</h3>
                  <p className="text-gray-400 text-sm">
                    ค้นพบกฎของไอน์สไตน์ และความลับของแรงโน้มถ่วง
                  </p>
                </div>
                
                <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-white mb-2">ใช้กลยุทธ์</h3>
                  <p className="text-gray-400 text-sm">
                    วางแผนการหลบหลีก ใช้พลังงานอย่างชาญฉลาด
                  </p>
                </div>
                
                <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30">
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="text-lg font-semibold text-white mb-2">ปลดล็อครางวัล</h3>
                  <p className="text-gray-400 text-sm">
                    ได้รับความรู้ใหม่ และปลดล็อคความลับอวกาศ
                  </p>
                </div>
              </div>
              
              <button 
                onClick={startGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-10 py-4 rounded-xl text-xl hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
              >
                🚀 เข้าสู่หลุมดำ
              </button>
            </div>
          )}

          {gameState.gamePhase === 'finished' && (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">
                {gameState.escapeDistance >= gameState.maxEscapeDistance ? '🎉' : '💥'}
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                {gameState.escapeDistance >= gameState.maxEscapeDistance ? 
                  'หลุดพ้นสำเร็จ!' : 'ถูกดูดเข้าหลุมดำ...'}
              </h2>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 mb-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">คะแนนรวม:</span>
                    <span className="text-yellow-400 font-bold">{gameState.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ระยะหลบหลีก:</span>
                    <span className="text-purple-400 font-bold">{gameState.escapeDistance.toFixed(0)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ความท้าทายสำเร็จ:</span>
                    <span className="text-green-400 font-bold">{gameState.achievements.length}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">พลังงานคงเหลือ:</span>
                    <span className="text-blue-400 font-bold">{gameState.powerLevel}%</span>
                  </div>
                </div>
              </div>

              {gameState.achievements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">ความท้าทายที่สำเร็จ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {gameState.achievements.map(achievementId => {
                      const challenge = blackHoleChallenges.find(c => c.id === achievementId);
                      return challenge ? (
                        <div key={achievementId} className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                          <div className="text-green-400 font-semibold">{challenge.name}</div>
                          <div className="text-sm text-gray-400">{challenge.description}</div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
              <div className="space-x-4">
                <button 
                  onClick={restartGame}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  🔄 ลองใหม่อีกครั้ง
                </button>
                <Link href="/mini-game">
                  <button className="bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-600 transition-all">
                    🏠 กลับหน้าเกม
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated Background - Black Hole Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/20 to-black animate-pulse"></div>
        
        {/* Particle Effects */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-75"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-150"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300"></div>
        
        {/* Swirling Effect */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-100"></div>
          <div className="absolute top-1/2 left-1/2 w-6 h-6 border border-pink-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}
