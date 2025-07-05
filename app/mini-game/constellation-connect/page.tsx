"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/layout/Navbar";
import { ArrowLeft, Star, Trophy, Clock, Target, Lightbulb, Book } from "lucide-react";
import Link from "next/link";
import { constellations } from "../../data/space-content";

interface ConstellationGameState {
  gamePhase: 'waiting' | 'playing' | 'hint' | 'story' | 'finished';
  score: number;
  timeLeft: number;
  currentConstellation: number;
  totalConstellations: number;
  connectedStars: number[];
  connections: [number, number][];
  correctConnections: number;
  showHint: boolean;
  mistakes: number;
  maxMistakes: number;
}

export default function ConstellationConnectGame() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gameState, setGameState] = useState<ConstellationGameState>({
    gamePhase: 'waiting',
    score: 0,
    timeLeft: 180, // 3 minutes
    currentConstellation: 0,
    totalConstellations: constellations.length,
    connectedStars: [],
    connections: [],
    correctConnections: 0,
    showHint: false,
    mistakes: 0,
    maxMistakes: 3
  });

  const [currentConstellation, setCurrentConstellation] = useState(constellations[0]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; starIndex: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!params.gameId || params.gameId !== 'constellation-connect') {
      router.push('/mini-game');
      return;
    }
  }, [params.gameId, router]);

  useEffect(() => {
    // Timer for the game
    let timer: NodeJS.Timeout;
    if (gameState.gamePhase === 'playing' && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && gameState.gamePhase === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameState.gamePhase, gameState.timeLeft]);

  useEffect(() => {
    drawConstellation();
  }, [gameState.connections, dragStart, mousePos, gameState.showHint]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      timeLeft: 180,
      currentConstellation: 0,
      score: 0,
      connections: [],
      correctConnections: 0,
      mistakes: 0,
      showHint: false
    }));
    setCurrentConstellation(constellations[0]);
  };

  const drawConstellation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Draw stars
    currentConstellation.stars.forEach((star, index) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, 5 + star.brightness * 3, 0, 2 * Math.PI);
      
      // Color based on connection status
      if (gameState.connectedStars.includes(index)) {
        ctx.fillStyle = '#fbbf24'; // yellow-400
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      }
      ctx.fill();

      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw star number for hint
      if (gameState.showHint) {
        ctx.fillStyle = '#3b82f6'; // blue-500
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((index + 1).toString(), star.x, star.y - 10);
      }
    });

    // Draw existing connections
    ctx.strokeStyle = '#a855f7'; // purple-500
    ctx.lineWidth = 2;
    gameState.connections.forEach(([start, end]) => {
      const startStar = currentConstellation.stars[start];
      const endStar = currentConstellation.stars[end];
      
      ctx.beginPath();
      ctx.moveTo(startStar.x, startStar.y);
      ctx.lineTo(endStar.x, endStar.y);
      ctx.stroke();
    });

    // Draw hint connections (correct pattern)
    if (gameState.showHint) {
      ctx.strokeStyle = '#10b981'; // green-500
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      currentConstellation.connections.forEach(([start, end]) => {
        const startStar = currentConstellation.stars[start];
        const endStar = currentConstellation.stars[end];
        
        ctx.beginPath();
        ctx.moveTo(startStar.x, startStar.y);
        ctx.lineTo(endStar.x, endStar.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Draw current drag line
    if (dragStart) {
      ctx.strokeStyle = '#fbbf24'; // yellow-400
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dragStart.x, dragStart.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.gamePhase !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked star
    const clickedStarIndex = currentConstellation.stars.findIndex(star => {
      const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
      return distance <= 15; // Click tolerance
    });

    if (clickedStarIndex !== -1) {
      const star = currentConstellation.stars[clickedStarIndex];
      setDragStart({ x: star.x, y: star.y, starIndex: clickedStarIndex });
      setMousePos({ x: star.x, y: star.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStart) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStart || gameState.gamePhase !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find target star
    const targetStarIndex = currentConstellation.stars.findIndex((star, index) => {
      if (index === dragStart.starIndex) return false;
      const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
      return distance <= 15;
    });

    if (targetStarIndex !== -1) {
      const newConnection: [number, number] = [dragStart.starIndex, targetStarIndex];
      
      // Check if connection already exists
      const connectionExists = gameState.connections.some(([a, b]) => 
        (a === newConnection[0] && b === newConnection[1]) ||
        (a === newConnection[1] && b === newConnection[0])
      );

      if (!connectionExists) {
        // Check if connection is correct
        const isCorrect = currentConstellation.connections.some(([a, b]) => 
          (a === newConnection[0] && b === newConnection[1]) ||
          (a === newConnection[1] && b === newConnection[0])
        );

        if (isCorrect) {
          // Correct connection
          setGameState(prev => ({
            ...prev,
            connections: [...prev.connections, newConnection],
            connectedStars: [...new Set([...prev.connectedStars, newConnection[0], newConnection[1]])],
            correctConnections: prev.correctConnections + 1,
            score: prev.score + 50
          }));

          // Check if constellation is complete
          if (gameState.correctConnections + 1 >= currentConstellation.connections.length) {
            completeConstellation();
          }
        } else {
          // Wrong connection
          setGameState(prev => ({
            ...prev,
            mistakes: prev.mistakes + 1,
            score: Math.max(0, prev.score - 10)
          }));

          if (gameState.mistakes + 1 >= gameState.maxMistakes) {
            endGame();
          }
        }
      }
    }

    setDragStart(null);
    setMousePos({ x: 0, y: 0 });
  };

  const completeConstellation = () => {
    // Bonus points for completing constellation
    const timeBonus = Math.floor(gameState.timeLeft / 10) * 5;
    const accuracyBonus = gameState.mistakes === 0 ? 100 : 0;
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + timeBonus + accuracyBonus,
      gamePhase: 'story'
    }));
  };

  const nextConstellation = () => {
    if (gameState.currentConstellation + 1 < gameState.totalConstellations) {
      const nextIndex = gameState.currentConstellation + 1;
      setCurrentConstellation(constellations[nextIndex]);
      setGameState(prev => ({
        ...prev,
        currentConstellation: nextIndex,
        connections: [],
        connectedStars: [],
        correctConnections: 0,
        mistakes: 0,
        gamePhase: 'playing',
        showHint: false
      }));
    } else {
      // All constellations completed
      setGameState(prev => ({
        ...prev,
        gamePhase: 'finished'
      }));
    }
  };

  const toggleHint = () => {
    setGameState(prev => ({
      ...prev,
      showHint: !prev.showHint,
      score: prev.showHint ? prev.score : Math.max(0, prev.score - 25) // Penalty for using hint
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
      timeLeft: 180,
      currentConstellation: 0,
      totalConstellations: constellations.length,
      connectedStars: [],
      connections: [],
      correctConnections: 0,
      showHint: false,
      mistakes: 0,
      maxMistakes: 3
    });
    setCurrentConstellation(constellations[0]);
    setDragStart(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-black relative overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/mini-game" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้ามินิเกม
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                มาสเตอร์กลุ่มดาว ⭐
              </h1>
              <p className="text-gray-300">
                เชื่อมจุดดาวเพื่อสร้างกลุ่มดาวในตำนาน เรียนรู้เรื่องราวและนิทานโบราณ
              </p>
            </div>
            <div className="text-6xl animate-pulse">✨</div>
          </div>
        </div>

        {/* Game Stats */}
        {gameState.gamePhase !== 'waiting' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <Trophy className="text-yellow-400" size={20} />
                <span className="text-gray-400">คะแนน</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.score}</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-blue-400" size={20} />
                <span className="text-gray-400">เวลา</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(gameState.timeLeft)}</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <Star className="text-purple-400" size={20} />
                <span className="text-gray-400">กลุ่มดาว</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {gameState.currentConstellation + 1}/{gameState.totalConstellations}
              </div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <Target className="text-green-400" size={20} />
                <span className="text-gray-400">ความคืบหน้า</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {gameState.correctConnections}/{currentConstellation.connections.length}
              </div>
            </div>
          </div>
        )}

        {/* Game Content */}
        <div className="max-w-4xl mx-auto">
          {gameState.gamePhase === 'waiting' && (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">⭐</div>
              <h2 className="text-4xl font-bold text-white mb-4">ยินดีต้อนรับสู่ศิลปินแห่งท้องฟ้า</h2>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                เชื่อมจุดดาวเพื่อสร้างกลุ่มดาวในตำนาน เรียนรู้เรื่องราวและนิทานโบราณ
                ที่ซ่อนอยู่ในท้องฟ้ายามค่ำคืน พร้อมปลดล็อคความลับของจักรวาล
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                <div className="bg-black/30 rounded-xl p-6 border border-indigo-500/30">
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="text-lg font-semibold text-white mb-2">สร้างสรรค์ศิลปะ</h3>
                  <p className="text-gray-400 text-sm">
                    เชื่อมดาวเพื่อสร้างภาพกลุ่มดาวที่สวยงาม
                  </p>
                </div>
                
                <div className="bg-black/30 rounded-xl p-6 border border-indigo-500/30">
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="text-lg font-semibold text-white mb-2">เรียนรู้ตำนาน</h3>
                  <p className="text-gray-400 text-sm">
                    ค้นพบเรื่องราวและนิทานโบราณของแต่ละกลุ่มดาว
                  </p>
                </div>
                
                <div className="bg-black/30 rounded-xl p-6 border border-indigo-500/30">
                  <div className="text-3xl mb-3">🌟</div>
                  <h3 className="text-lg font-semibold text-white mb-2">ปลดล็อครางวัล</h3>
                  <p className="text-gray-400 text-sm">
                    รับคะแนนโบนัสและปลดล็อคกลุ่มดาวลับ
                  </p>
                </div>
              </div>
              
              <button 
                onClick={startGame}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-10 py-4 rounded-xl text-xl hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/50"
              >
                ⭐ เริ่มวาดกลุ่มดาว
              </button>
            </div>
          )}

          {gameState.gamePhase === 'playing' && (
            <div className="space-y-8">
              {/* Current Constellation Info */}
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{currentConstellation.name}</h3>
                    <p className="text-indigo-300">{currentConstellation.nameEn}</p>
                    <p className="text-gray-400 mt-2">{currentConstellation.story}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={toggleHint}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        gameState.showHint 
                          ? 'bg-green-600 text-white' 
                          : 'bg-yellow-600 text-white hover:bg-yellow-500'
                      }`}
                    >
                      <Lightbulb size={18} />
                      <span>{gameState.showHint ? 'ซ่อนคำใบ้' : 'แสดงคำใบ้ (-25)'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">ความยาก:</span>
                    <span className={`ml-2 font-semibold ${
                      currentConstellation.difficulty === 'easy' ? 'text-green-400' :
                      currentConstellation.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {currentConstellation.difficulty === 'easy' ? 'ง่าย' :
                       currentConstellation.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">ฤดูกาล:</span>
                    <span className="ml-2 text-white font-semibold">{currentConstellation.season}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">ความผิดพลาด:</span>
                    <span className="ml-2 text-red-400 font-semibold">
                      {gameState.mistakes}/{gameState.maxMistakes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Canvas for drawing constellation */}
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    ลากเมาส์จากดาวหนึ่งไปยังอีกดาวหนึ่งเพื่อเชื่อมต่อ
                  </h4>
                  <p className="text-gray-400 text-sm">
                    เชื่อมดาวให้ตรงตามรูปแบบกลุ่มดาว {gameState.showHint && '(เส้นสีเขียวคือคำใบ้)'}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-indigo-500/50 rounded-lg bg-gradient-to-br from-indigo-900/20 to-purple-900/20 cursor-crosshair"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                  />
                </div>
              </div>
            </div>
          )}

          {gameState.gamePhase === 'story' && (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-4">สร้างกลุ่มดาวสำเร็จ!</h2>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/30 mb-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-indigo-300 mb-4">
                  📖 ตำนานของ{currentConstellation.name}
                </h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  {currentConstellation.mythology}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-indigo-900/30 rounded-lg p-4">
                    <div className="text-yellow-400 font-semibold">คะแนนที่ได้</div>
                    <div className="text-2xl font-bold text-white">+{50 + Math.floor(gameState.timeLeft / 10) * 5}</div>
                  </div>
                  <div className="bg-indigo-900/30 rounded-lg p-4">
                    <div className="text-green-400 font-semibold">โบนัสความแม่นยำ</div>
                    <div className="text-2xl font-bold text-white">
                      {gameState.mistakes === 0 ? '+100' : '0'}
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={nextConstellation}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl text-xl hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-105"
              >
                {gameState.currentConstellation + 1 < gameState.totalConstellations ? 
                  '⭐ กลุ่มดาวถัดไป' : '🏆 จบเกม'}
              </button>
            </div>
          )}

          {gameState.gamePhase === 'finished' && (
            <div className="text-center py-20">
              <div className="text-8xl mb-8">
                {gameState.currentConstellation >= gameState.totalConstellations - 1 ? '🌟' : '💫'}
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                {gameState.currentConstellation >= gameState.totalConstellations - 1 ? 
                  'ปรมาจารย์กลุ่มดาว!' : 'จบเกมแล้ว!'}
              </h2>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/30 mb-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">คะแนนรวม:</span>
                    <span className="text-yellow-400 font-bold">{gameState.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">กลุ่มดาวที่สำเร็จ:</span>
                    <span className="text-indigo-400 font-bold">{gameState.currentConstellation + 1}/{gameState.totalConstellations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">เวลาที่เหลือ:</span>
                    <span className="text-green-400 font-bold">{formatTime(gameState.timeLeft)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ความแม่นยำ:</span>
                    <span className="text-purple-400 font-bold">
                      {gameState.mistakes === 0 ? 'สมบูรณ์แบบ!' : `${gameState.mistakes} ข้อผิดพลาด`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-x-4">
                <button 
                  onClick={restartGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  🔄 เริ่มใหม่อีกครั้ง
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

      {/* Animated Background - Starfield */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-20 right-32 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-80 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-700"></div>
        
        {/* Shooting stars */}
        <div className="absolute top-1/4 left-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-70 animate-shooting-star"></div>
        <div className="absolute top-3/4 right-0 w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 animate-shooting-star delay-1000"></div>
      </div>
    </div>
  );
}
