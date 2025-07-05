"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMiniGameById, planets } from "../../data/mini-games";
import { MiniGame, Planet } from "../../types/game";
import Navbar from "../../components/layout/Navbar";
import { ArrowLeft, Heart, Star, Clock, Trophy } from "lucide-react";
import Link from "next/link";

interface GameState {
  selectedPlanet: Planet | null;
  selectedFact: string | null;
  score: number;
  lives: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  currentRound: number;
  totalRounds: number;
  matches: number;
}

export default function PlanetMatchGame() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<MiniGame | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    selectedPlanet: null,
    selectedFact: null,
    score: 0,
    lives: 3,
    timeLeft: 60,
    gamePhase: 'waiting',
    currentRound: 1,
    totalRounds: 5,
    matches: 0
  });
  
  const [currentPlanet, setCurrentPlanet] = useState<Planet | null>(null);
  const [factOptions, setFactOptions] = useState<string[]>([]);
  const [usedPlanets, setUsedPlanets] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (params.gameId) {
      const foundGame = getMiniGameById(params.gameId as string);
      if (foundGame) {
        setGame(foundGame);
        if (foundGame.id === 'planet-match') {
          // Initialize the game
        } else {
          router.push('/mini-game');
        }
      } else {
        router.push('/mini-game');
      }
    }
  }, [params.gameId, router]);

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

  const generateRound = () => {
    const availablePlanets = planets.filter(p => !usedPlanets.has(p.id));
    if (availablePlanets.length === 0) {
      endGame();
      return;
    }

    const randomPlanet = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
    setCurrentPlanet(randomPlanet);

    // Create more challenging fact options (1 correct + 3 wrong)
    const correctFact = randomPlanet.facts[Math.floor(Math.random() * randomPlanet.facts.length)];
    const wrongFacts: string[] = [];
    
    // Get wrong facts from other planets
    planets.forEach(planet => {
      if (planet.id !== randomPlanet.id) {
        wrongFacts.push(...planet.facts);
      }
    });

    // Select 3 random wrong facts
    const shuffledWrongFacts = wrongFacts.sort(() => Math.random() - 0.5);
    const options = [correctFact, ...shuffledWrongFacts.slice(0, 3)];
    setFactOptions(options.sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      timeLeft: 60,
      score: 0,
      lives: 3,
      currentRound: 1,
      matches: 0
    }));
    setUsedPlanets(new Set());
    generateRound();
  };

  const selectFact = (fact: string) => {
    if (!currentPlanet) return;

    const isCorrect = currentPlanet.facts.includes(fact);
    
    if (isCorrect) {
      // Correct answer
      setGameState(prev => ({
        ...prev,
        score: prev.score + 20,
        matches: prev.matches + 1,
        currentRound: prev.currentRound + 1
      }));
      setUsedPlanets(prev => new Set(prev).add(currentPlanet.id));
      
      if (gameState.currentRound >= gameState.totalRounds) {
        endGame();
      } else {
        setTimeout(() => generateRound(), 1000);
      }
    } else {
      // Wrong answer
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1
      }));
      
      if (gameState.lives <= 1) {
        endGame();
      }
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
      selectedPlanet: null,
      selectedFact: null,
      score: 0,
      lives: 3,
      timeLeft: 60,
      gamePhase: 'waiting',
      currentRound: 1,
      totalRounds: 5,
      matches: 0
    });
    setUsedPlanets(new Set());
    setCurrentPlanet(null);
    setFactOptions([]);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/mini-game" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้ามินิเกม
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{game.title}</h1>
              <p className="text-gray-400">{game.description}</p>
            </div>
            <div className="text-4xl">{game.thumbnail}</div>
          </div>
        </div>

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
                <div className="text-2xl font-bold text-white">
                  {gameState.currentRound}/{gameState.totalRounds}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Content */}
        <div className="max-w-4xl mx-auto">
          {gameState.gamePhase === 'waiting' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-8">🪐</div>
              <h2 className="text-3xl font-bold text-white mb-4">พร้อมที่จะเริ่มเกมหรือยง?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                จับคู่ดาวเคราะห์กับข้อเท็จจริงที่ถูกต้อง<br/>
                คุณมีเวลา 60 วินาที และมีชีวิต 3 ชีวิต
              </p>
              <button 
                onClick={startGame}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105"
              >
                เริ่มเกม
              </button>
            </div>
          )}

          {gameState.gamePhase === 'playing' && currentPlanet && (
            <div className="space-y-8">
              {/* Current Planet */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">เลือกข้อเท็จจริงที่ถูกต้องสำหรับ:</h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div 
                    className={`w-24 h-24 rounded-full mx-auto mb-4 planet-color`}
                    data-planet-color={currentPlanet.color}
                  ></div>
                  <h4 className="text-3xl font-bold text-white mb-2">{currentPlanet.name}</h4>
                  <p className="text-gray-400">{currentPlanet.nameEn}</p>
                </div>
              </div>

              {/* Fact Options */}
              <div className="grid gap-4">
                {factOptions.map((fact, index) => (
                  <button
                    key={index}
                    onClick={() => selectFact(fact)}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-left hover:scale-102 transform"
                  >
                    <p className="text-white text-lg">{fact}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState.gamePhase === 'finished' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-8">
                {gameState.matches >= 3 ? '🎉' : '😔'}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {gameState.matches >= 3 ? 'ยินดีด้วย!' : 'เกมจบแล้ว!'}
              </h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">คะแนนรวม:</span>
                    <span className="text-yellow-400 font-bold">{gameState.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">จับคู่ถูก:</span>
                    <span className="text-green-400 font-bold">{gameState.matches}/{gameState.totalRounds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ชีวิตที่เหลือ:</span>
                    <span className="text-red-400 font-bold">{gameState.lives}</span>
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

      {/* Background Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
