"use client";
import { useState, useEffect } from "react";
import { MiniGame } from "../../../types/game";
import { Heart, Star, Clock, Trophy, Globe, Rocket } from "lucide-react";
import Link from "next/link";

interface Planet {
  id: string;
  name: string;
  description: string;
  emoji: string;
  discovered: boolean;
  story: string;
  fact: string;
}

interface GameState {
  currentPlanet: Planet | null;
  discoveredPlanets: Planet[];
  score: number;
  fuel: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'exploring' | 'planet' | 'finished';
  position: { x: number; y: number };
  knowledge: number;
}

interface GalaxyExplorerGameProps {
  game: MiniGame;
}

const galaxyPlanets: Planet[] = [
  {
    id: 'kepler-442b',
    name: 'เคปเลอร์ 442b',
    description: 'ดาวเคราะห์ที่อาจมีน้ำและชีวิต',
    emoji: '🌍',
    discovered: false,
    story: 'ดาวเคราะห์นี้อยู่ในโซนที่เหมาะสำหรับชีวิต มีขนาดใหญ่กว่าโลก 1.3 เท่า',
    fact: 'อุณหภูมิเฉลี่ยประมาณ -2°C เหมาะสำหรับน้ำแข็งและน้ำของเหลว'
  },
  {
    id: 'proxima-b',
    name: 'พร็อกซิมา เซนทอรี b',
    description: 'ดาวเคราะห์ที่ใกล้โลกที่สุด',
    emoji: '🔴',
    discovered: false,
    story: 'ห่างจากโลกเพียง 4.2 ปีแสง โคจรรอบดาวแคระแดง',
    fact: 'มีความเป็นไปได้ที่จะมีบรรยากาศและน้ำบนผิวหน้า'
  },
  {
    id: 'trappist-1e',
    name: 'แทรปปิสต์ 1e',
    description: 'ดาวเคราะห์ในระบบ 7 ดวง',
    emoji: '🌊',
    discovered: false,
    story: 'เป็น 1 ใน 7 ดาวเคราะห์ที่โคจรรอบดาวแคระแดง',
    fact: 'มีขนาดและมวลใกล้เคียงกับโลก เรียกว่า Earth twin'
  },
  {
    id: 'gliese-581g',
    name: 'กลีเซ 581g',
    description: 'ดาวเคราะห์ทองคำ',
    emoji: '🟡',
    discovered: false,
    story: 'อยู่ในโซนที่เหมาะสำหรับชีวิต มีแรงโน้มถ่วงใกล้เคียงโลก',
    fact: 'หนึ่งด้านหันหาดาวฤกษ์ตลอดเวลา ทำให้มีด้านร้อนและด้านเย็น'
  },
  {
    id: 'k2-18b',
    name: 'เค2-18b',
    description: 'ดาวเคราะห์ที่มีไอน้ำ',
    emoji: '💧',
    discovered: false,
    story: 'พบไอน้ำในบรรยากาศ เป็นดาวเคราะห์ขนาดซูเปอร์เอิร์ธ',
    fact: 'มีบรรยากาศที่มีไฮโดรเจนและไอน้ำ อาจมีฝนตก'
  },
  {
    id: 'hd-40307g',
    name: 'เอชดี 40307g',
    description: 'ซูเปอร์เอิร์ธที่น่าสนใจ',
    emoji: '🟢',
    discovered: false,
    story: 'มีมวลมากกว่าโลก 7 เท่า อยู่ห่างจากดาวแม่ในระยะที่เหมาะสม',
    fact: 'โคจรรอบดาวที่คล้ายดวงอาทิตย์ใน 197 วัน'
  },
  {
    id: 'tau-ceti-f',
    name: 'เทา เซติ f',
    description: 'ดาวเคราะห์ในระบบเทา เซติ',
    emoji: '🟠',
    discovered: false,
    story: 'โคจรรอบดาวที่คล้ายดวงอาทิตย์ ห่างเพียง 12 ปีแสง',
    fact: 'มีมวลมากกว่าโลก 6.6 เท่า อาจมีบรรยากาศหนาแน่น'
  },
  {
    id: 'wolf-1061c',
    name: 'วูล์ฟ 1061c',
    description: 'ดาวเคราะห์หินใกล้โลก',
    emoji: '🗿',
    discovered: false,
    story: 'ดาวเคราะห์หินที่อยู่ในโซนที่เหมาะสำหรับชีวิต',
    fact: 'ห่างจากโลก 14 ปีแสง มีคาบการโคจร 17.9 วัน'
  }
];

export default function GalaxyExplorerGame({ game }: GalaxyExplorerGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentPlanet: null,
    discoveredPlanets: [],
    score: 0,
    fuel: 100,
    timeLeft: 300, // 5 minutes
    gamePhase: 'waiting',
    position: { x: 0, y: 0 },
    knowledge: 0
  });

  const [targetPlanet, setTargetPlanet] = useState<Planet | null>(null);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.gamePhase === 'exploring' && gameState.timeLeft > 0) {
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
    const shuffledPlanets = [...galaxyPlanets].map(p => ({ ...p, discovered: false }));
    
    setGameState(prev => ({
      ...prev,
      gamePhase: 'exploring',
      timeLeft: 300,
      score: 0,
      fuel: 100,
      discoveredPlanets: [],
      knowledge: 0
    }));
    
    setTargetPlanet(shuffledPlanets[0]);
  };

  const travelToPlanet = (planet: Planet) => {
    if (gameState.fuel < 20) {
      alert('เชื้อเพลิงไม่พอ! หาสถานีเติมเชื้อเพลิงก่อน');
      return;
    }

    setGameState(prev => ({
      ...prev,
      fuel: prev.fuel - 20,
      position: { x: Math.random() * 100, y: Math.random() * 100 }
    }));

    setTargetPlanet(planet);
    startScanning();
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanningProgress(0);

    const scanInterval = setInterval(() => {
      setScanningProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          discoverPlanet();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const discoverPlanet = () => {
    if (!targetPlanet) return;

    const discoveredPlanet = { ...targetPlanet, discovered: true };
    
    setGameState(prev => ({
      ...prev,
      discoveredPlanets: [...prev.discoveredPlanets, discoveredPlanet],
      currentPlanet: discoveredPlanet,
      gamePhase: 'planet',
      score: prev.score + 100,
      knowledge: prev.knowledge + 25
    }));
  };

  const learnMore = () => {
    if (!gameState.currentPlanet) return;

    setGameState(prev => ({
      ...prev,
      score: prev.score + 50,
      knowledge: prev.knowledge + 15,
      fuel: prev.fuel + 10 // โบนัสเชื้อเพลิงจากการเรียนรู้
    }));
  };

  const nextExploration = () => {
    const remainingPlanets = galaxyPlanets.filter(p => 
      !gameState.discoveredPlanets.some(dp => dp.id === p.id)
    );

    if (remainingPlanets.length === 0) {
      endGame();
      return;
    }

    setGameState(prev => ({
      ...prev,
      gamePhase: 'exploring',
      currentPlanet: null
    }));

    setTargetPlanet(remainingPlanets[0]);
    setScanningProgress(0);
  };

  const refuelShip = () => {
    if (gameState.knowledge < 20) {
      alert('ต้องมีความรู้อย่างน้อย 20 คะแนนเพื่อเติมเชื้อเพลิง');
      return;
    }

    setGameState(prev => ({
      ...prev,
      fuel: Math.min(100, prev.fuel + 30),
      knowledge: prev.knowledge - 20
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
      currentPlanet: null,
      discoveredPlanets: [],
      score: 0,
      fuel: 100,
      timeLeft: 300,
      gamePhase: 'waiting',
      position: { x: 0, y: 0 },
      knowledge: 0
    });
    setTargetPlanet(null);
    setScanningProgress(0);
    setIsScanning(false);
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
                <Rocket className="text-blue-400 mr-2" size={20} />
                <span className="text-gray-400">เชื้อเพลิง</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.fuel}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-purple-400 mr-2" size={20} />
                <span className="text-gray-400">เวลา</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(gameState.timeLeft)}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="text-green-400 mr-2" size={20} />
                <span className="text-gray-400">ค้นพบ</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {gameState.discoveredPlanets.length}/{galaxyPlanets.length}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="text-orange-400 mr-2" size={20} />
                <span className="text-gray-400">ความรู้</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.knowledge}</div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-6xl mx-auto">
        {gameState.gamePhase === 'waiting' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🌠</div>
            <h2 className="text-3xl font-bold text-white mb-4">พร้อมสำรวจกาแล็กซี่หรือยัง?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              เดินทางข้ามกาแล็กซี่เพื่อค้นพบดาวเคราะห์แปลกใหม่<br/>
              เรียนรู้เรื่องราวและข้อเท็จจริงของแต่ละดาวเคราะห์<br/>
              ใช้ความรู้เพื่อเติมเชื้อเพลิงและเดินทางต่อไป
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-purple-400 hover:to-blue-400 transition-all transform hover:scale-105"
            >
              เริ่มการสำรวจ
            </button>
          </div>
        )}

        {gameState.gamePhase === 'exploring' && (
          <div className="space-y-8">
            {/* Current Mission */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">ภารกิจสำรวจ</h3>
              {targetPlanet && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
                  <div className="text-4xl mb-4">{targetPlanet.emoji}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{targetPlanet.name}</h4>
                  <p className="text-gray-300 mb-6">{targetPlanet.description}</p>
                  
                  {isScanning ? (
                    <div className="space-y-4">
                      <div className="text-blue-400 font-semibold">กำลังสแกนดาวเคราะห์...</div>
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <div 
                          className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${scanningProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-400">{scanningProgress}% เสร็จสิ้น</div>
                    </div>
                  ) : (
                    <button
                      onClick={() => travelToPlanet(targetPlanet)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-400 hover:to-purple-400 transition-all"
                      disabled={gameState.fuel < 20}
                    >
                      {gameState.fuel < 20 ? 'เชื้อเพลิงไม่พอ' : 'เดินทางไป (ใช้ 20% เชื้อเพลิง)'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Control Panel */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Discovered Planets */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">ดาวเคราะห์ที่ค้นพบแล้ว</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {gameState.discoveredPlanets.map(planet => (
                    <div key={planet.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <span className="text-2xl">{planet.emoji}</span>
                      <div>
                        <div className="text-white font-semibold">{planet.name}</div>
                        <div className="text-sm text-gray-400">{planet.description}</div>
                      </div>
                    </div>
                  ))}
                  {gameState.discoveredPlanets.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      ยังไม่มีดาวเคราะห์ที่ค้นพบ
                    </div>
                  )}
                </div>
              </div>

              {/* Ship Status */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-lg font-bold text-white mb-4">สถานะยานอวกาศ</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">เชื้อเพลิง</span>
                      <span className="text-blue-400">{gameState.fuel}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${gameState.fuel}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">ความรู้</span>
                      <span className="text-orange-400">{gameState.knowledge}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(gameState.knowledge, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={refuelShip}
                    className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-500 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={gameState.knowledge < 20}
                  >
                    เติมเชื้อเพลิง (ใช้ 20 ความรู้)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState.gamePhase === 'planet' && gameState.currentPlanet && (
          <div className="space-y-8">
            {/* Planet Discovery */}
            <div className="text-center">
              <div className="text-6xl mb-4">{gameState.currentPlanet.emoji}</div>
              <h3 className="text-3xl font-bold text-white mb-2">ค้นพบ: {gameState.currentPlanet.name}</h3>
              <p className="text-gray-300 text-lg mb-8">{gameState.currentPlanet.description}</p>
            </div>

            {/* Planet Information */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">🔬 ข้อมูลทางวิทยาศาสตร์</h4>
                <p className="text-gray-300 leading-relaxed">{gameState.currentPlanet.story}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">💡 ข้อเท็จจริงน่าสนใจ</h4>
                <p className="text-gray-300 leading-relaxed">{gameState.currentPlanet.fact}</p>
                
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={learnMore}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-all"
                  >
                    เรียนรู้เพิ่มเติม (+50 คะแนน, +15 ความรู้, +10 เชื้อเพลิง)
                  </button>
                  <button
                    onClick={nextExploration}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-all"
                  >
                    สำรวจดาวเคราะห์ต่อไป
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState.gamePhase === 'finished' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              {gameState.discoveredPlanets.length >= 6 ? '🎉' : gameState.discoveredPlanets.length >= 3 ? '🌟' : '🚀'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameState.discoveredPlanets.length >= 6 ? 'นักสำรวจมาสเตอร์!' : 
               gameState.discoveredPlanets.length >= 3 ? 'นักสำรวจเก่ง!' : 'ภารกิจจบแล้ว!'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">คะแนนรวม:</span>
                  <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ดาวเคราะห์ที่ค้นพบ:</span>
                  <span className="text-green-400 font-bold">{gameState.discoveredPlanets.length}/{galaxyPlanets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ความรู้ที่สะสม:</span>
                  <span className="text-orange-400 font-bold">{gameState.knowledge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ประสิทธิภาพ:</span>
                  <span className="text-purple-400 font-bold">
                    {Math.round((gameState.discoveredPlanets.length / galaxyPlanets.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="space-x-4">
              <button 
                onClick={restartGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-400 hover:to-blue-400 transition-all"
              >
                สำรวจอีกครั้ง
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
