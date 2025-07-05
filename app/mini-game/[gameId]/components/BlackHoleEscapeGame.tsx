"use client";
import { useState, useEffect, useRef } from "react";
import { MiniGame } from "../../../types/game";
import { Heart, Star, Clock, Trophy, Zap, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface GameState {
  playerX: number;
  playerY: number;
  blackHoleX: number;
  blackHoleY: number;
  blackHoleSize: number;
  score: number;
  lives: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  speed: number;
  escapeProgress: number;
  warningLevel: number;
  particles: Particle[];
  powerUps: PowerUp[];
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: 'boost' | 'shield' | 'knowledge';
  active: boolean;
}

interface BlackHoleEscapeGameProps {
  game: MiniGame;
}

export default function BlackHoleEscapeGame({ game }: BlackHoleEscapeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const [gameState, setGameState] = useState<GameState>({
    playerX: 100,
    playerY: 300,
    blackHoleX: 400,
    blackHoleY: 300,
    blackHoleSize: 80,
    score: 0,
    lives: 3,
    timeLeft: 180, // 3 minutes
    gamePhase: 'waiting',
    speed: 3,
    escapeProgress: 0,
    warningLevel: 0,
    particles: [],
    powerUps: []
  });

  const [showPhysicsInfo, setShowPhysicsInfo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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

  useEffect(() => {
    if (gameState.gamePhase === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }

    return () => stopGameLoop();
  }, [gameState.gamePhase]);

  const startGame = () => {
    setGameState({
      playerX: 100,
      playerY: 300,
      blackHoleX: 400,
      blackHoleY: 300,
      blackHoleSize: 80,
      score: 0,
      lives: 3,
      timeLeft: 180,
      gamePhase: 'playing',
      speed: 3,
      escapeProgress: 0,
      warningLevel: 0,
      particles: [],
      powerUps: []
    });
  };

  const startGameLoop = () => {
    const gameLoop = () => {
      updateGame();
      drawGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  };

  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  const updateGame = () => {
    setGameState(prevState => {
      const newState = { ...prevState };

      // Calculate distance to black hole
      const distance = Math.sqrt(
        (newState.playerX - newState.blackHoleX) ** 2 + 
        (newState.playerY - newState.blackHoleY) ** 2
      );

      // Black hole gravity effect
      const gravityStrength = (newState.blackHoleSize * 2) / (distance + 1);
      const angle = Math.atan2(
        newState.blackHoleY - newState.playerY,
        newState.blackHoleX - newState.playerX
      );

      let gravityX = Math.cos(angle) * gravityStrength * 0.1;
      let gravityY = Math.sin(angle) * gravityStrength * 0.1;

      // Player movement
      let moveX = 0;
      let moveY = 0;

      if (keysRef.current['arrowleft'] || keysRef.current['a']) {
        moveX = -newState.speed;
      }
      if (keysRef.current['arrowright'] || keysRef.current['d']) {
        moveX = newState.speed;
      }
      if (keysRef.current['arrowup'] || keysRef.current['w']) {
        moveY = -newState.speed;
      }
      if (keysRef.current['arrowdown'] || keysRef.current['s']) {
        moveY = newState.speed;
      }

      // Apply movement and gravity
      newState.playerX += moveX + gravityX;
      newState.playerY += moveY + gravityY;

      // Keep player within bounds
      newState.playerX = Math.max(10, Math.min(790, newState.playerX));
      newState.playerY = Math.max(10, Math.min(590, newState.playerY));

      // Check if too close to black hole (event horizon)
      if (distance < newState.blackHoleSize / 2) {
        newState.lives -= 1;
        newState.playerX = 100;
        newState.playerY = 300;
        if (newState.lives <= 0) {
          newState.gamePhase = 'finished';
        }
      }

      // Warning level based on distance
      if (distance < newState.blackHoleSize) {
        newState.warningLevel = 3; // Critical
      } else if (distance < newState.blackHoleSize * 1.5) {
        newState.warningLevel = 2; // High
      } else if (distance < newState.blackHoleSize * 2) {
        newState.warningLevel = 1; // Medium
      } else {
        newState.warningLevel = 0; // Safe
      }

      // Escape progress - moving away from black hole increases progress
      if (distance > newState.blackHoleSize * 3) {
        newState.escapeProgress = Math.min(100, newState.escapeProgress + 0.5);
      } else {
        newState.escapeProgress = Math.max(0, newState.escapeProgress - 0.2);
      }

      // Win condition
      if (newState.escapeProgress >= 100) {
        endGame();
        return newState;
      }

      // Spawn particles near black hole
      if (Math.random() < 0.3) {
        const particleAngle = Math.random() * Math.PI * 2;
        const particleDistance = newState.blackHoleSize + Math.random() * 50;
        
        newState.particles.push({
          id: Date.now().toString() + Math.random(),
          x: newState.blackHoleX + Math.cos(particleAngle) * particleDistance,
          y: newState.blackHoleY + Math.sin(particleAngle) * particleDistance,
          vx: Math.cos(particleAngle + Math.PI/2) * 2,
          vy: Math.sin(particleAngle + Math.PI/2) * 2,
          life: 100,
          size: Math.random() * 3 + 1
        });
      }

      // Update particles
      newState.particles = newState.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Apply gravity to particles
        const pDistance = Math.sqrt(
          (particle.x - newState.blackHoleX) ** 2 + 
          (particle.y - newState.blackHoleY) ** 2
        );
        const pAngle = Math.atan2(
          newState.blackHoleY - particle.y,
          newState.blackHoleX - particle.x
        );
        const pGravity = newState.blackHoleSize / (pDistance + 1);
        
        particle.vx += Math.cos(pAngle) * pGravity * 0.01;
        particle.vy += Math.sin(pAngle) * pGravity * 0.01;

        return particle.life > 0 && pDistance > newState.blackHoleSize / 3;
      });

      // Spawn power-ups occasionally
      if (Math.random() < 0.003) {
        const types: ('boost' | 'shield' | 'knowledge')[] = ['boost', 'shield', 'knowledge'];
        const safeX = Math.random() < 0.5 ? Math.random() * 200 + 50 : Math.random() * 200 + 550;
        
        newState.powerUps.push({
          id: Date.now().toString() + Math.random(),
          x: safeX,
          y: Math.random() * 500 + 50,
          type: types[Math.floor(Math.random() * types.length)],
          active: true
        });
      }

      // Check power-up collisions
      newState.powerUps = newState.powerUps.filter(powerUp => {
        const pDistance = Math.sqrt(
          (newState.playerX - powerUp.x) ** 2 + 
          (newState.playerY - powerUp.y) ** 2
        );
        
        if (pDistance < 20 && powerUp.active) {
          switch (powerUp.type) {
            case 'boost':
              newState.speed = 5;
              setTimeout(() => {
                setGameState(prev => ({ ...prev, speed: 3 }));
              }, 5000);
              break;
            case 'shield':
              // Temporary immunity
              setTimeout(() => {
                setGameState(prev => ({ 
                  ...prev, 
                  playerX: prev.playerX < 400 ? 100 : 700,
                  playerY: 300
                }));
              }, 100);
              break;
            case 'knowledge':
              newState.score += 100;
              break;
          }
          return false;
        }
        return true;
      });

      // Update score
      newState.score += 1;

      // Increase black hole size over time (making it harder)
      newState.blackHoleSize = Math.min(120, 80 + (180 - newState.timeLeft) * 0.1);

      return newState;
    });
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with space background
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
      ctx.fillRect(
        (i * 47) % canvas.width,
        (i * 83) % canvas.height,
        1,
        1
      );
    }

    // Draw black hole
    const gradient = ctx.createRadialGradient(
      gameState.blackHoleX, gameState.blackHoleY, 0,
      gameState.blackHoleX, gameState.blackHoleY, gameState.blackHoleSize
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.7, 'rgba(20, 0, 40, 0.8)');
    gradient.addColorStop(1, 'rgba(100, 0, 200, 0.3)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(gameState.blackHoleX, gameState.blackHoleY, gameState.blackHoleSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw accretion disk
    ctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(gameState.blackHoleX, gameState.blackHoleY, gameState.blackHoleSize * 1.2, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw particles
    gameState.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life / 100;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    });

    // Draw power-ups
    gameState.powerUps.forEach(powerUp => {
      ctx.save();
      ctx.translate(powerUp.x, powerUp.y);
      ctx.rotate(Date.now() * 0.005);
      
      const colors = {
        boost: '#00FF00',
        shield: '#00FFFF',
        knowledge: '#FFFF00'
      };
      
      ctx.fillStyle = colors[powerUp.type];
      ctx.fillRect(-8, -8, 16, 16);
      ctx.restore();
    });

    // Draw player
    ctx.save();
    ctx.translate(gameState.playerX, gameState.playerY);
    
    // Warning effect
    if (gameState.warningLevel > 0) {
      ctx.strokeStyle = gameState.warningLevel === 3 ? '#FF0000' : 
                        gameState.warningLevel === 2 ? '#FFA500' : '#FFFF00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Player ship
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(-8, 8);
    ctx.lineTo(0, 4);
    ctx.lineTo(8, 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Draw escape progress bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 30);
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(10, 10, (gameState.escapeProgress / 100) * 200, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText(`หลบหนี: ${Math.floor(gameState.escapeProgress)}%`, 15, 30);
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'finished'
    }));
  };

  const restartGame = () => {
    setGameState({
      playerX: 100,
      playerY: 300,
      blackHoleX: 400,
      blackHoleY: 300,
      blackHoleSize: 80,
      score: 0,
      lives: 3,
      timeLeft: 180,
      gamePhase: 'waiting',
      speed: 3,
      escapeProgress: 0,
      warningLevel: 0,
      particles: [],
      powerUps: []
    });
    setShowPhysicsInfo(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWarningText = () => {
    switch (gameState.warningLevel) {
      case 3: return '🚨 อันตราย! ใกล้ Event Horizon!';
      case 2: return '⚠️ ระวัง! แรงโน้มถ่วงแรง!';
      case 1: return '💡 ระวัง แรงโน้มถ่วงเริ่มมีผล';
      default: return '✅ ปลอดภัย';
    }
  };

  return (
    <div>
      {/* Game Stats */}
      {gameState.gamePhase !== 'waiting' && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <Zap className="text-green-400 mr-2" size={20} />
                <span className="text-gray-400">หลบหนี</span>
              </div>
              <div className="text-2xl font-bold text-white">{Math.floor(gameState.escapeProgress)}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="text-orange-400 mr-2" size={20} />
                <span className="text-gray-400">สถานะ</span>
              </div>
              <div className={`text-sm font-bold ${
                gameState.warningLevel === 3 ? 'text-red-400' :
                gameState.warningLevel === 2 ? 'text-orange-400' :
                gameState.warningLevel === 1 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {getWarningText()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-6xl mx-auto">
        {gameState.gamePhase === 'waiting' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🕳️</div>
            <h2 className="text-3xl font-bold text-white mb-4">พร้อมหนีจากหลุมดำหรือยัง?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              ใช้ความรู้ฟิสิกส์เพื่อหลบหลีกจากแรงโน้มถ่วงของหลุมดำ<br/>
              เคลื่อนที่ด้วย WASD หรือลูกศร<br/>
              หลีกเลี่ยง Event Horizon (จุดศูนย์กลางสีดำ)<br/>
              เก็บไอเทมเพื่อเพิ่มความสามารถ
            </p>
            
            <div className="mb-8">
              <button
                onClick={() => setShowPhysicsInfo(!showPhysicsInfo)}
                className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all mb-4"
              >
                {showPhysicsInfo ? 'ซ่อนข้อมูลฟิสิกส์' : 'แสดงข้อมูลฟิสิกส์'}
              </button>
              
              {showPhysicsInfo && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 max-w-2xl mx-auto text-left">
                  <h4 className="text-blue-400 font-bold mb-3">🔬 ความรู้เรื่องหลุมดำ</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• <strong>Event Horizon:</strong> ขอบเขตที่แสงไม่สามารถหลุดออกมาได้</li>
                    <li>• <strong>แรงโน้มถ่วง:</strong> เพิ่มขึ้นตามระยะห่างที่ใกล้เข้ามา</li>
                    <li>• <strong>Accretion Disk:</strong> วงแหวนของสสารที่หมุนรอบหลุมดำ</li>
                    <li>• <strong>Hawking Radiation:</strong> รังสีที่หลุมดำปล่อยออกมา</li>
                    <li>• <strong>Spaghettification:</strong> การยืดยาวของวัตถุเนื่องจากแรงโน้มถ่วง</li>
                  </ul>
                  <div className="mt-4 text-xs text-gray-400">
                    ไอเทม: 🟢 เร็วขึ้น | 🔵 เทเลพอร์ต | 🟡 คะแนนโบนัส
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-black text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-purple-400 hover:to-gray-800 transition-all transform hover:scale-105"
            >
              เริ่มภารกิจหลบหนี
            </button>
          </div>
        )}

        {gameState.gamePhase === 'playing' && (
          <div className="space-y-8">
            {/* Game Canvas */}
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border-2 border-white/20 rounded-lg bg-black"
                  tabIndex={0}
                />
                
                {/* Overlay Instructions */}
                <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg text-sm">
                  <div>🎯 เป้าหมาย: หลีกเลี่ยงหลุมดำ เติมแถบหลบหนีให้เต็ม</div>
                  <div>🎮 ควบคุม: WASD หรือลูกศร</div>
                </div>
              </div>
            </div>

            {/* Game Tips */}
            <div className="text-center">
              <div className="bg-purple-500/20 text-purple-300 px-6 py-3 rounded-lg text-sm border border-purple-500/30 inline-block">
                💡 เคล็ดลับ: ยิ่งอยู่ไกลจากหลุมดำ แถบหลบหนีจะเติมเร็วขึ้น - หลีกเลี่ยงให้ได้!
              </div>
            </div>
          </div>
        )}

        {gameState.gamePhase === 'finished' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              {gameState.escapeProgress >= 100 ? '🎉' : '💥'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameState.escapeProgress >= 100 ? 'หนีสำเร็จ! คุณคือฮีโร่อวกาศ!' : 'เกมจบแล้ว!'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">คะแนนรวม:</span>
                  <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ความก้าวหน้า:</span>
                  <span className="text-green-400 font-bold">{Math.floor(gameState.escapeProgress)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">เวลารอด:</span>
                  <span className="text-blue-400 font-bold">{formatTime(180 - gameState.timeLeft)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ระดับ:</span>
                  <span className="text-purple-400 font-bold">
                    {gameState.escapeProgress >= 100 ? 'Black Hole Survivor' : 
                     gameState.escapeProgress >= 50 ? 'Space Explorer' : 'Brave Pilot'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-x-4">
              <button 
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-400 hover:to-blue-400 transition-all"
              >
                ลองอีกครั้ง
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
