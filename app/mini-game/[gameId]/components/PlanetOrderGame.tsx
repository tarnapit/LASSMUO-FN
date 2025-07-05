"use client";
import { useState, useEffect } from "react";
import { planets } from "../../../data/mini-games";
import { MiniGame, Planet } from "../../../types/game";
import { Heart, Star, Clock, Trophy, CheckCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

interface GameState {
  planets: Planet[];
  score: number;
  lives: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  currentOrder: Planet[];
  isComplete: boolean;
  round: number;
  correctOrderCount: number;
}

interface PlanetOrderGameProps {
  game: MiniGame;
}

// Correct order of planets from the Sun
const correctOrder = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

export default function PlanetOrderGame({ game }: PlanetOrderGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    planets: [],
    score: 0,
    lives: 3,
    timeLeft: 120,
    gamePhase: 'waiting',
    currentOrder: [],
    isComplete: false,
    round: 1,
    correctOrderCount: 0
  });

  const [draggedPlanet, setDraggedPlanet] = useState<Planet | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.gamePhase === 'playing' && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameState.gamePhase, gameState.timeLeft]);

  const startGame = () => {
    const shuffledPlanets = [...planets].sort(() => Math.random() - 0.5);
    
    setGameState(prev => ({
      ...prev,
      planets: shuffledPlanets,
      gamePhase: 'playing',
      timeLeft: 120,
      score: 0,
      lives: 3,
      currentOrder: [],
      isComplete: false,
      round: 1,
      correctOrderCount: 0
    }));
    setShowHint(false);
  };

  const handleDragStart = (planet: Planet) => {
    setDraggedPlanet(planet);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedPlanet) return;

    const newOrder = [...gameState.currentOrder];
    
    // Remove planet if it already exists in the order
    const existingIndex = newOrder.findIndex(p => p?.id === draggedPlanet.id);
    if (existingIndex !== -1) {
      newOrder[existingIndex] = null as any;
    }

    // Place planet at the dropped position
    newOrder[index] = draggedPlanet;

    setGameState(prev => ({
      ...prev,
      currentOrder: newOrder
    }));

    // Check if all positions are filled
    const isComplete = newOrder.every(p => p !== null && p !== undefined);
    if (isComplete) {
      checkOrder(newOrder);
    }

    setDraggedPlanet(null);
  };

  const handlePlanetClick = (planet: Planet) => {
    // Add planet to the next empty slot
    const newOrder = [...gameState.currentOrder];
    const emptyIndex = newOrder.findIndex(p => !p);
    
    if (emptyIndex !== -1) {
      // Remove planet if it already exists in the order
      const existingIndex = newOrder.findIndex(p => p?.id === planet.id);
      if (existingIndex !== -1) {
        newOrder[existingIndex] = null as any;
      }
      
      newOrder[emptyIndex] = planet;
      
      setGameState(prev => ({
        ...prev,
        currentOrder: newOrder
      }));

      // Check if all positions are filled
      const isComplete = newOrder.every(p => p !== null && p !== undefined);
      if (isComplete) {
        checkOrder(newOrder);
      }
    }
  };

  const removePlanet = (index: number) => {
    const newOrder = [...gameState.currentOrder];
    newOrder[index] = null as any;
    
    setGameState(prev => ({
      ...prev,
      currentOrder: newOrder
    }));
  };

  const checkOrder = (order: Planet[]) => {
    const isCorrect = order.every((planet, index) => planet.id === correctOrder[index]);
    
    if (isCorrect) {
      const bonusPoints = Math.max(100 - (120 - gameState.timeLeft), 50);
      setGameState(prev => ({
        ...prev,
        score: prev.score + bonusPoints,
        isComplete: true,
        correctOrderCount: prev.correctOrderCount + 1
      }));

      setTimeout(() => {
        nextRound();
      }, 2000);
    } else {
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1
      }));

      if (gameState.lives <= 1) {
        setTimeout(() => {
          endGame();
        }, 1000);
      } else {
        // Reset the order for another try
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            currentOrder: []
          }));
        }, 1000);
      }
    }
  };

  const nextRound = () => {
    if (gameState.round >= 3) {
      endGame();
    } else {
      const shuffledPlanets = [...planets].sort(() => Math.random() - 0.5);
      
      setGameState(prev => ({
        ...prev,
        planets: shuffledPlanets,
        currentOrder: [],
        isComplete: false,
        round: prev.round + 1,
        timeLeft: prev.timeLeft + 30 // Bonus time for next round
      }));
    }
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'finished'
    }));
  };

  const restartGame = () => {
    setGameState({
      planets: [],
      score: 0,
      lives: 3,
      timeLeft: 120,
      gamePhase: 'waiting',
      currentOrder: [],
      isComplete: false,
      round: 1,
      correctOrderCount: 0
    });
    setShowHint(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMnemonic = () => {
    return "พุ ศุ โล อัง พฤ เส ยู เน";
  };

  const getPlanetDistance = (planetId: string) => {
    const distances: { [key: string]: string } = {
      mercury: "58 ล้าน กม.",
      venus: "108 ล้าน กม.",
      earth: "150 ล้าน กม.",
      mars: "228 ล้าน กม.",
      jupiter: "778 ล้าน กม.",
      saturn: "1.4 พันล้าน กม.",
      uranus: "2.9 พันล้าน กม.",
      neptune: "4.5 พันล้าน กม."
    };
    return distances[planetId] || "";
  };

  return (
    <div>
      {/* Game Stats */}
      {gameState.gamePhase !== 'waiting' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-yellow-400 mr-2" size={20} />
                <span className="text-gray-400">คะแนน</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.score}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="text-red-400 mr-2" size={20} />
                <span className="text-gray-400">ชีวิต</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.lives}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-blue-400 mr-2" size={20} />
                <span className="text-gray-400">เวลา</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(gameState.timeLeft)}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="text-purple-400 mr-2" size={20} />
                <span className="text-gray-400">รอบ</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.round}/3</div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-6xl mx-auto">
        {gameState.gamePhase === 'waiting' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🌍</div>
            <h2 className="text-3xl font-bold text-white mb-4">พร้อมเรียงดาวเคราะห์หรือยัง?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              เรียงลำดับดาวเคราะห์ตามระยะห่างจากดวงอาทิตย์<br/>
              จากใกล้ที่สุดไปไกลที่สุด - คุณมี 3 ชีวิต<br/>
              <span className="text-yellow-400 font-semibold">คำกลอนช่วยจำ: "{getMnemonic()}"</span>
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-blue-400 hover:to-purple-400 transition-all transform hover:scale-105"
            >
              เริ่มเกม
            </button>
          </div>
        )}

        {gameState.gamePhase === 'playing' && (
          <div className="space-y-8">
            {/* Round Header */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">รอบที่ {gameState.round}</h3>
              <p className="text-gray-400 mb-4">
                ลากดาวเคราะห์หรือคลิกเพื่อเรียงลำดับตามระยะห่างจากดวงอาทิตย์
              </p>
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg text-sm border border-yellow-500/30 hover:bg-yellow-500/30 transition-all"
              >
                {showHint ? 'ซ่อนคำใบ้' : 'แสดงคำใบ้'}
              </button>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                <h4 className="text-yellow-400 font-bold mb-2">คำกลอนช่วยจำ:</h4>
                <p className="text-yellow-300 text-lg mb-4">"{getMnemonic()}"</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {correctOrder.map((planetId, index) => {
                    const planet = planets.find(p => p.id === planetId);
                    return (
                      <div key={planetId} className="text-gray-300">
                        {index + 1}. {planet?.name} ({getPlanetDistance(planetId)})
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Drop Zones for Planet Order */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-6 text-center">
                ลำดับจากดวงอาทิตย์ (ใกล้ → ไกล)
              </h4>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={index}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`
                      h-24 w-full rounded-xl border-2 border-dashed border-white/30 
                      flex flex-col items-center justify-center text-sm text-gray-400
                      transition-all duration-300
                      ${gameState.currentOrder[index] ? 'border-blue-500 bg-blue-500/20' : 'hover:border-white/50'}
                    `}
                  >
                    {gameState.currentOrder[index] ? (
                      <div className="text-center cursor-pointer" onClick={() => removePlanet(index)}>
                        <div 
                          className="w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center text-2xl"
                          style={{ backgroundColor: gameState.currentOrder[index].color }}
                        >
                          {gameState.currentOrder[index].name.charAt(0)}
                        </div>
                        <div className="text-xs text-white font-semibold">
                          {gameState.currentOrder[index].name}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-lg font-bold">{index + 1}</div>
                        <div className="text-xs">วางที่นี่</div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {gameState.isComplete && (
                <div className="text-center mt-6">
                  <div className="bg-green-500/20 text-green-300 px-6 py-3 rounded-full text-lg border border-green-500/30 inline-flex items-center gap-2">
                    <CheckCircle size={20} />
                    ถูกต้อง! เก่งมาก! 🎉
                  </div>
                </div>
              )}
            </div>

            {/* Available Planets */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-6 text-center">ดาวเคราะห์ที่ต้องเรียง</h4>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {gameState.planets.map((planet) => {
                  const isUsed = gameState.currentOrder.some(p => p?.id === planet.id);
                  
                  return (
                    <div
                      key={planet.id}
                      draggable={!isUsed}
                      onDragStart={() => handleDragStart(planet)}
                      onClick={() => !isUsed && handlePlanetClick(planet)}
                      className={`
                        text-center cursor-pointer transition-all duration-300 p-4 rounded-xl
                        ${isUsed ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-105 hover:bg-white/10'}
                      `}
                    >
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold"
                        style={{ backgroundColor: planet.color }}
                      >
                        {planet.name.charAt(0)}
                      </div>
                      <div className="text-sm text-white font-semibold">{planet.name}</div>
                      <div className="text-xs text-gray-400">{planet.nameEn}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={() => setGameState(prev => ({ ...prev, currentOrder: [] }))}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all inline-flex items-center gap-2"
              >
                <RotateCcw size={16} />
                รีเซ็ตลำดับ
              </button>
            </div>
          </div>
        )}

        {gameState.gamePhase === 'finished' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              {gameState.correctOrderCount >= 2 ? '🎉' : '👍'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameState.correctOrderCount >= 2 ? 'ยอดเยี่ยม!' : 'เกมจบแล้ว!'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">คะแนนรวม:</span>
                  <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">เรียงถูก:</span>
                  <span className="text-green-400 font-bold">{gameState.correctOrderCount}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">รอบสูงสุด:</span>
                  <span className="text-purple-400 font-bold">{gameState.round}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ความแม่นยำ:</span>
                  <span className="text-blue-400 font-bold">
                    {Math.round((gameState.correctOrderCount / gameState.round) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="space-x-4">
              <button 
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-400 hover:to-blue-400 transition-all"
              >
                เล่นอีกครั้ง
              </button>
              <Link href="/mini-game">
                <button className="bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-500 transition-all">
                  กลับหน้าเกม
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
