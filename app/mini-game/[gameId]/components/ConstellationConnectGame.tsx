"use client";
import { useState, useEffect, useRef } from "react";
import { MiniGame } from "../../../types/game";
import { Heart, Star, Clock, Trophy, Lightbulb } from "lucide-react";
import Link from "next/link";

interface Star {
  id: string;
  x: number;
  y: number;
  isConnected: boolean;
  order: number;
}

interface Connection {
  from: string;
  to: string;
}

interface Constellation {
  id: string;
  name: string;
  nameEn: string;
  stars: Star[];
  connections: Connection[];
  story: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameState {
  currentConstellation: Constellation | null;
  userConnections: Connection[];
  score: number;
  lives: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  selectedStar: Star | null;
  completedConstellations: number;
  showHint: boolean;
  currentLevel: number;
}

interface ConstellationConnectGameProps {
  game: MiniGame;
}

const constellations: Constellation[] = [
  {
    id: 'ursa-major',
    name: 'หมีใหญ่',
    nameEn: 'Ursa Major',
    difficulty: 'easy',
    story: 'กลุ่มดาวที่มีชื่อเสียงที่สุด มีรูปร่างเหมือนหมีขนาดใหญ่ ในตำนานกรีกเป็นเทพธิดา Callisto ที่ถูกแปลงร่างเป็นหมี',
    stars: [
      { id: '1', x: 100, y: 100, isConnected: false, order: 1 },
      { id: '2', x: 150, y: 80, isConnected: false, order: 2 },
      { id: '3', x: 200, y: 70, isConnected: false, order: 3 },
      { id: '4', x: 250, y: 80, isConnected: false, order: 4 },
      { id: '5', x: 280, y: 120, isConnected: false, order: 5 },
      { id: '6', x: 260, y: 160, isConnected: false, order: 6 },
      { id: '7', x: 200, y: 150, isConnected: false, order: 7 }
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
      { from: '5', to: '6' },
      { from: '6', to: '7' },
      { from: '7', to: '1' }
    ]
  },
  {
    id: 'orion',
    name: 'นักล่าโอไรออน',
    nameEn: 'Orion',
    difficulty: 'medium',
    story: 'นักล่าผู้ยิ่งใหญ่ในตำนานกรีก มีดาว 3 ดวงเรียงกันเป็นแถบเอว เป็นกลุ่มดาวที่มองเห็นได้ชัดเจนในฤดูหนาว',
    stars: [
      { id: '1', x: 150, y: 80, isConnected: false, order: 1 },
      { id: '2', x: 120, y: 120, isConnected: false, order: 2 },
      { id: '3', x: 150, y: 120, isConnected: false, order: 3 },
      { id: '4', x: 180, y: 120, isConnected: false, order: 4 },
      { id: '5', x: 130, y: 160, isConnected: false, order: 5 },
      { id: '6', x: 170, y: 160, isConnected: false, order: 6 },
      { id: '7', x: 150, y: 200, isConnected: false, order: 7 }
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '1' },
      { from: '3', to: '5' },
      { from: '3', to: '6' },
      { from: '5', to: '7' },
      { from: '6', to: '7' }
    ]
  },
  {
    id: 'cassiopeia',
    name: 'นางพญา คาสสิโอเปีย',
    nameEn: 'Cassiopeia',
    difficulty: 'medium',
    story: 'ราชินีผู้หยิ่งยโสในตำนานกรีก มีรูปร่างเหมือนตัว W หรือ M เป็นกลุ่มดาวที่มองเห็นได้ตลอดปี',
    stars: [
      { id: '1', x: 100, y: 120, isConnected: false, order: 1 },
      { id: '2', x: 150, y: 80, isConnected: false, order: 2 },
      { id: '3', x: 200, y: 100, isConnected: false, order: 3 },
      { id: '4', x: 250, y: 70, isConnected: false, order: 4 },
      { id: '5', x: 300, y: 110, isConnected: false, order: 5 }
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' }
    ]
  },
  {
    id: 'cygnus',
    name: 'หงส์ไซกนัส',
    nameEn: 'Cygnus',
    difficulty: 'hard',
    story: 'หงส์ทองในตำนานกรีก เป็นกลุ่มดาวรูปกางเขน มีดาวเดเนบเป็นหางหงส์ อยู่ในทางช้างเผือก',
    stars: [
      { id: '1', x: 200, y: 80, isConnected: false, order: 1 },
      { id: '2', x: 200, y: 120, isConnected: false, order: 2 },
      { id: '3', x: 200, y: 160, isConnected: false, order: 3 },
      { id: '4', x: 200, y: 200, isConnected: false, order: 4 },
      { id: '5', x: 150, y: 140, isConnected: false, order: 5 },
      { id: '6', x: 250, y: 140, isConnected: false, order: 6 }
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '2', to: '5' },
      { from: '2', to: '6' }
    ]
  }
];

export default function ConstellationConnectGame({ game }: ConstellationConnectGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentConstellation: null,
    userConnections: [],
    score: 0,
    lives: 3,
    timeLeft: 180, // 3 minutes
    gamePhase: 'waiting',
    selectedStar: null,
    completedConstellations: 0,
    showHint: false,
    currentLevel: 1
  });

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
    drawCanvas();
  }, [gameState.currentConstellation, gameState.userConnections, gameState.selectedStar, gameState.showHint]);

  const startGame = () => {
    const firstConstellation = constellations[0];
    setGameState(prev => ({
      ...prev,
      currentConstellation: firstConstellation,
      gamePhase: 'playing',
      timeLeft: 180,
      score: 0,
      lives: 3,
      userConnections: [],
      selectedStar: null,
      completedConstellations: 0,
      showHint: false,
      currentLevel: 1
    }));
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.currentConstellation) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const constellation = gameState.currentConstellation;

    // Draw connections (correct answer if hint is shown)
    if (gameState.showHint) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
      ctx.lineWidth = 2;
      constellation.connections.forEach(conn => {
        const fromStar = constellation.stars.find(s => s.id === conn.from);
        const toStar = constellation.stars.find(s => s.id === conn.to);
        if (fromStar && toStar) {
          ctx.beginPath();
          ctx.moveTo(fromStar.x, fromStar.y);
          ctx.lineTo(toStar.x, toStar.y);
          ctx.stroke();
        }
      });
    }

    // Draw user connections
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    gameState.userConnections.forEach(conn => {
      const fromStar = constellation.stars.find(s => s.id === conn.from);
      const toStar = constellation.stars.find(s => s.id === conn.to);
      if (fromStar && toStar) {
        ctx.beginPath();
        ctx.moveTo(fromStar.x, fromStar.y);
        ctx.lineTo(toStar.x, toStar.y);
        ctx.stroke();
      }
    });

    // Draw stars
    constellation.stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, gameState.selectedStar?.id === star.id ? 12 : 8, 0, 2 * Math.PI);
      ctx.fillStyle = gameState.selectedStar?.id === star.id ? '#FCD34D' : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw star order number
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(star.order.toString(), star.x, star.y + 4);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState.currentConstellation) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked star
    const clickedStar = gameState.currentConstellation.stars.find(star => {
      const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
      return distance <= 15;
    });

    if (!clickedStar) return;

    if (!gameState.selectedStar) {
      // Select first star
      setGameState(prev => ({
        ...prev,
        selectedStar: clickedStar
      }));
    } else if (gameState.selectedStar.id === clickedStar.id) {
      // Deselect
      setGameState(prev => ({
        ...prev,
        selectedStar: null
      }));
    } else {
      // Connect stars
      const newConnection = {
        from: gameState.selectedStar.id,
        to: clickedStar.id
      };

      // Check if connection already exists
      const connectionExists = gameState.userConnections.some(conn =>
        (conn.from === newConnection.from && conn.to === newConnection.to) ||
        (conn.from === newConnection.to && conn.to === newConnection.from)
      );

      if (!connectionExists) {
        setGameState(prev => ({
          ...prev,
          userConnections: [...prev.userConnections, newConnection],
          selectedStar: null
        }));
      } else {
        // Remove connection if it exists
        setGameState(prev => ({
          ...prev,
          userConnections: prev.userConnections.filter(conn =>
            !((conn.from === newConnection.from && conn.to === newConnection.to) ||
              (conn.from === newConnection.to && conn.to === newConnection.from))
          ),
          selectedStar: null
        }));
      }
    }
  };

  const checkConstellation = () => {
    if (!gameState.currentConstellation) return;

    const correctConnections = gameState.currentConstellation.connections;
    const userConnections = gameState.userConnections;

    // Check if all correct connections are made
    const isComplete = correctConnections.every(correct =>
      userConnections.some(user =>
        (user.from === correct.from && user.to === correct.to) ||
        (user.from === correct.to && user.to === correct.from)
      )
    );

    // Check if there are extra incorrect connections
    const hasIncorrectConnections = userConnections.some(user =>
      !correctConnections.some(correct =>
        (user.from === correct.from && user.to === correct.to) ||
        (user.from === correct.to && user.to === correct.from)
      )
    );

    if (isComplete && !hasIncorrectConnections) {
      // Correct constellation
      const bonusPoints = Math.max(200 - gameState.userConnections.length * 10, 100);
      setGameState(prev => ({
        ...prev,
        score: prev.score + bonusPoints,
        completedConstellations: prev.completedConstellations + 1
      }));

      setTimeout(() => {
        nextConstellation();
      }, 2000);
    } else if (hasIncorrectConnections || (isComplete && hasIncorrectConnections)) {
      // Incorrect
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1
      }));

      if (gameState.lives <= 1) {
        setTimeout(() => {
          endGame();
        }, 1000);
      }
    }
  };

  const nextConstellation = () => {
    const nextIndex = gameState.completedConstellations;
    if (nextIndex >= constellations.length) {
      endGame();
    } else {
      setGameState(prev => ({
        ...prev,
        currentConstellation: constellations[nextIndex],
        userConnections: [],
        selectedStar: null,
        showHint: false,
        currentLevel: prev.currentLevel + 1
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
      currentConstellation: null,
      userConnections: [],
      score: 0,
      lives: 3,
      timeLeft: 180,
      gamePhase: 'waiting',
      selectedStar: null,
      completedConstellations: 0,
      showHint: false,
      currentLevel: 1
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearConnections = () => {
    setGameState(prev => ({
      ...prev,
      userConnections: [],
      selectedStar: null
    }));
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
                <span className="text-gray-400">กลุ่มดาว</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {gameState.completedConstellations}/{constellations.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-6xl mx-auto">
        {gameState.gamePhase === 'waiting' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">⭐</div>
            <h2 className="text-3xl font-bold text-white mb-4">พร้อมเชื่อมโยงดวงดาวหรือยัง?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              เชื่อมจุดดาวเพื่อสร้างกลุ่มดาวในตำนาน<br/>
              คลิกดาวสองดวงเพื่อเชื่อมต่อ<br/>
              อ่านเรื่องราวของแต่ละกลุ่มดาวและเรียนรู้ตำนานโบราณ
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-purple-400 hover:to-pink-400 transition-all transform hover:scale-105"
            >
              เริ่มเกม
            </button>
          </div>
        )}

        {gameState.gamePhase === 'playing' && gameState.currentConstellation && (
          <div className="space-y-8">
            {/* Constellation Info */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                กลุ่มดาว{gameState.currentConstellation.name}
              </h3>
              <p className="text-gray-400 mb-4">{gameState.currentConstellation.nameEn}</p>
              <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-gray-300">{gameState.currentConstellation.story}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setGameState(prev => ({ ...prev, showHint: !prev.showHint }))}
                className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 transition-all inline-flex items-center gap-2"
              >
                <Lightbulb size={16} />
                {gameState.showHint ? 'ซ่อนคำใบ้' : 'แสดงคำใบ้'}
              </button>
              <button
                onClick={clearConnections}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
              >
                ลบการเชื่อมต่อทั้งหมด
              </button>
              <button
                onClick={checkConstellation}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all"
              >
                ตรวจสอบ
              </button>
            </div>

            {/* Canvas */}
            <div className="flex justify-center">
              <div className="bg-black/50 rounded-2xl p-8 border border-white/20">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  onClick={handleCanvasClick}
                  className="cursor-pointer rounded-lg border border-white/30"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <div className="bg-blue-500/20 text-blue-300 px-6 py-3 rounded-lg text-sm border border-blue-500/30 inline-block">
                💡 คลิกดาวสองดวงเพื่อเชื่อมต่อ | คลิกดาวที่เลือกแล้วอีกครั้งเพื่อยกเลิก
              </div>
            </div>
          </div>
        )}

        {gameState.gamePhase === 'finished' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              {gameState.completedConstellations >= 3 ? '🎉' : '⭐'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameState.completedConstellations >= 3 ? 'นักดาราศาสตร์มือโปร!' : 'เกมจบแล้ว!'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">คะแนนรวม:</span>
                  <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">กลุ่มดาวสำเร็จ:</span>
                  <span className="text-purple-400 font-bold">{gameState.completedConstellations}/{constellations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ระดับความยาก:</span>
                  <span className="text-blue-400 font-bold">{gameState.currentLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ความสำเร็จ:</span>
                  <span className="text-green-400 font-bold">
                    {Math.round((gameState.completedConstellations / constellations.length) * 100)}%
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
