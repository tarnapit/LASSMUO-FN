"use client";
import { useState, useEffect, useRef } from "react";
import { MiniGame } from "../../../types/game";
import { Heart, Star, Clock, Trophy, Zap } from "lucide-react";
import Link from "next/link";

interface GameState {
  playerX: number;
  playerY: number;
  asteroids: Asteroid[];
  powerUps: PowerUp[];
  score: number;
  lives: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  speed: number;
  invulnerable: number;
  shield: boolean;
}

interface Asteroid {
  id: string;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  type: 'normal' | 'fast' | 'large';
}

interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: 'shield' | 'speed' | 'points';
  duration: number;
}

interface AsteroidDodgeGameProps {
  game: MiniGame;
}

export default function AsteroidDodgeGame({ game }: AsteroidDodgeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const [gameState, setGameState] = useState<GameState>({
    playerX: 400,
    playerY: 300,
    asteroids: [],
    powerUps: [],
    score: 0,
    lives: 3,
    timeLeft: 120,
    gamePhase: 'waiting',
    speed: 5,
    invulnerable: 0,
    shield: false
  });

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
      playerX: 400,
      playerY: 300,
      asteroids: [],
      powerUps: [],
      score: 0,
      lives: 3,
      timeLeft: 120,
      gamePhase: 'playing',
      speed: 5,
      invulnerable: 0,
      shield: false
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

      // Update player position
      if (keysRef.current['arrowleft'] || keysRef.current['a']) {
        newState.playerX = Math.max(25, newState.playerX - newState.speed);
      }
      if (keysRef.current['arrowright'] || keysRef.current['d']) {
        newState.playerX = Math.min(775, newState.playerX + newState.speed);
      }
      if (keysRef.current['arrowup'] || keysRef.current['w']) {
        newState.playerY = Math.max(25, newState.playerY - newState.speed);
      }
      if (keysRef.current['arrowdown'] || keysRef.current['s']) {
        newState.playerY = Math.min(575, newState.playerY + newState.speed);
      }

      // Spawn asteroids
      if (Math.random() < 0.02 + (120 - newState.timeLeft) * 0.001) {
        const type = Math.random() < 0.7 ? 'normal' : Math.random() < 0.8 ? 'fast' : 'large';
        const size = type === 'large' ? 30 : type === 'fast' ? 15 : 20;
        const speed = type === 'fast' ? 4 : type === 'large' ? 1.5 : 2.5;
        
        newState.asteroids.push({
          id: Date.now().toString() + Math.random(),
          x: Math.random() * 800,
          y: -50,
          size,
          speedX: (Math.random() - 0.5) * 2,
          speedY: speed,
          type
        });
      }

      // Spawn power-ups
      if (Math.random() < 0.005) {
        const types: ('shield' | 'speed' | 'points')[] = ['shield', 'speed', 'points'];
        newState.powerUps.push({
          id: Date.now().toString() + Math.random(),
          x: Math.random() * 750 + 25,
          y: -30,
          type: types[Math.floor(Math.random() * types.length)],
          duration: 300 // 5 seconds at 60fps
        });
      }

      // Update asteroids
      newState.asteroids = newState.asteroids.filter(asteroid => {
        asteroid.x += asteroid.speedX;
        asteroid.y += asteroid.speedY;
        return asteroid.y < 650;
      });

      // Update power-ups
      newState.powerUps = newState.powerUps.filter(powerUp => {
        powerUp.y += 2;
        return powerUp.y < 650;
      });

      // Check collisions with asteroids
      if (newState.invulnerable <= 0 && !newState.shield) {
        newState.asteroids.forEach(asteroid => {
          const distance = Math.sqrt(
            (newState.playerX - asteroid.x) ** 2 + (newState.playerY - asteroid.y) ** 2
          );
          if (distance < asteroid.size + 15) {
            newState.lives -= 1;
            newState.invulnerable = 120; // 2 seconds of invulnerability
            newState.asteroids = newState.asteroids.filter(a => a.id !== asteroid.id);
          }
        });
      }

      // Check collisions with power-ups
      newState.powerUps = newState.powerUps.filter(powerUp => {
        const distance = Math.sqrt(
          (newState.playerX - powerUp.x) ** 2 + (newState.playerY - powerUp.y) ** 2
        );
        if (distance < 25) {
          switch (powerUp.type) {
            case 'shield':
              newState.shield = true;
              setTimeout(() => {
                setGameState(prev => ({ ...prev, shield: false }));
              }, 5000);
              break;
            case 'speed':
              newState.speed = 8;
              setTimeout(() => {
                setGameState(prev => ({ ...prev, speed: 5 }));
              }, 5000);
              break;
            case 'points':
              newState.score += 50;
              break;
          }
          return false;
        }
        return true;
      });

      // Update invulnerability
      if (newState.invulnerable > 0) {
        newState.invulnerable--;
      }

      // Update score
      newState.score += 1;

      // Check game over
      if (newState.lives <= 0) {
        newState.gamePhase = 'finished';
      }

      return newState;
    });
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 20, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
      ctx.fillRect(
        (i * 37) % canvas.width,
        (i * 53 + Date.now() * 0.05) % canvas.height,
        1,
        1
      );
    }

    // Draw player
    ctx.save();
    ctx.translate(gameState.playerX, gameState.playerY);
    
    // Shield effect
    if (gameState.shield) {
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // Invulnerability flashing
    if (gameState.invulnerable > 0 && Math.floor(gameState.invulnerable / 10) % 2) {
      ctx.globalAlpha = 0.5;
    }
    
    // Player ship
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(-10, 10);
    ctx.lineTo(0, 5);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();
    
    // Engine flame
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.moveTo(-5, 10);
    ctx.lineTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Draw asteroids
    gameState.asteroids.forEach(asteroid => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate(Date.now() * 0.001 * asteroid.speedY);
      
      ctx.fillStyle = asteroid.type === 'large' ? '#8B4513' : 
                      asteroid.type === 'fast' ? '#FF6B6B' : '#A0A0A0';
      ctx.beginPath();
      ctx.arc(0, 0, asteroid.size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Asteroid details
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(
          (Math.sin(i * 2.1) * asteroid.size) / 3,
          (Math.cos(i * 1.7) * asteroid.size) / 3,
          asteroid.size / 6,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
      
      ctx.restore();
    });

    // Draw power-ups
    gameState.powerUps.forEach(powerUp => {
      ctx.save();
      ctx.translate(powerUp.x, powerUp.y);
      ctx.rotate(Date.now() * 0.005);
      
      const colors = {
        shield: '#00FFFF',
        speed: '#FFFF00',
        points: '#FF00FF'
      };
      
      ctx.fillStyle = colors[powerUp.type];
      ctx.beginPath();
      const drawStar = (x: number, y: number, r: number) => {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5;
          const x1 = x + r * Math.cos(angle);
          const y1 = y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
        }
        ctx.closePath();
      };
      
      // Draw star shape for power-up
      const points = 8;
      const outerRadius = 12;
      const innerRadius = 6;
      
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'finished'
    }));
  };

  const restartGame = () => {
    setGameState({
      playerX: 400,
      playerY: 300,
      asteroids: [],
      powerUps: [],
      score: 0,
      lives: 3,
      timeLeft: 120,
      gamePhase: 'waiting',
      speed: 5,
      invulnerable: 0,
      shield: false
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                <Zap className="text-green-400 mr-2" size={20} />
                <span className="text-gray-400">สถานะ</span>
              </div>
              <div className="text-sm font-bold text-white">
                {gameState.shield && <span className="text-cyan-400">🛡️ ป้องกัน</span>}
                {gameState.speed > 5 && <span className="text-yellow-400">⚡ เร็ว</span>}
                {!gameState.shield && gameState.speed <= 5 && <span className="text-gray-400">ปกติ</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-6xl mx-auto">
        {gameState.gamePhase === 'waiting' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🚀</div>
            <h2 className="text-3xl font-bold text-white mb-4">พร้อมหลบหลีกอุกกาบาตหรือยัง?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              ควบคุมยานอวกาศด้วยลูกศรหรือ WASD<br/>
              หลบหลีกจากอุกกาบาตและเก็บไอเทมพิเศษ<br/>
              🛡️ Shield = ป้องกัน | ⚡ Speed = เร็วขึ้น | 💎 Points = คะแนนโบนัส
            </p>
            <div className="bg-yellow-500/20 text-yellow-300 px-6 py-3 rounded-lg text-sm border border-yellow-500/30 mb-8 inline-block">
              💡 เคล็ดลับ: เก็บ Shield ก่อนเจออุกกาบาตสีน้ำตาล (ใหญ่) และสีแดง (เร็ว)
            </div>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-red-400 hover:to-orange-400 transition-all transform hover:scale-105"
            >
              เริ่มเกม
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
                {gameState.invulnerable > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500/20 text-red-300 px-3 py-1 rounded text-sm border border-red-500/30">
                    🛡️ ไม่ได้รับความเสียหาย
                  </div>
                )}
              </div>
            </div>

            {/* Controls Guide */}
            <div className="text-center">
              <div className="bg-blue-500/20 text-blue-300 px-6 py-3 rounded-lg text-sm border border-blue-500/30 inline-block">
                🎮 ใช้ลูกศร หรือ WASD เพื่อเคลื่อนที่
              </div>
            </div>
          </div>
        )}

        {gameState.gamePhase === 'finished' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              {gameState.score >= 3000 ? '🎉' : gameState.score >= 1500 ? '👍' : '💥'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameState.score >= 3000 ? 'นักบินเอซ!' : 
               gameState.score >= 1500 ? 'ดีมาก!' : 'เกมจบแล้ว!'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">คะแนนรวม:</span>
                  <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">เวลารอด:</span>
                  <span className="text-blue-400 font-bold">{formatTime(120 - gameState.timeLeft)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ระดับ:</span>
                  <span className="text-purple-400 font-bold">
                    {gameState.score >= 3000 ? 'Master' : 
                     gameState.score >= 1500 ? 'Expert' : 
                     gameState.score >= 500 ? 'Good' : 'Beginner'}
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
