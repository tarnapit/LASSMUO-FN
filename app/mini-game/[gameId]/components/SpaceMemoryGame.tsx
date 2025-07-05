"use client";
import { useState, useEffect } from "react";
import { MiniGame } from "../../../types/game";
import { Heart, Star, Clock, Trophy } from "lucide-react";
import Link from "next/link";

interface Card {
  id: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameState {
  cards: Card[];
  flippedCards: Card[];
  score: number;
  moves: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  matches: number;
  level: number;
}

interface SpaceMemoryGameProps {
  game: MiniGame;
}

const spaceItems = [
  { emoji: "🌍", name: "โลก" },
  { emoji: "🌕", name: "ดวงจันทร์" },
  { emoji: "☀️", name: "ดวงอาทิตย์" },
  { emoji: "🪐", name: "ดาวเสาร์" },
  { emoji: "🚀", name: "ยานอวกาศ" },
  { emoji: "👨‍🚀", name: "นักบินอวกาศ" },
  { emoji: "🛸", name: "จานบิน" },
  { emoji: "⭐", name: "ดาวฤกษ์" },
  { emoji: "🌌", name: "กาแล็กซี่" },
  { emoji: "🌙", name: "เสี้ยวจันทร์" },
  { emoji: "☄️", name: "ดาวหาง" },
  { emoji: "🌠", name: "ดาวตก" },
  { emoji: "🪨", name: "อุกกาบาต" },
  { emoji: "🔭", name: "กล้องโทรทรรศน์" },
  { emoji: "🛰️", name: "ดาวเทียม" },
  { emoji: "🌕", name: "ดวงจันทร์เต็มดวง" }
];

export default function SpaceMemoryGame({ game }: SpaceMemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    score: 0,
    moves: 0,
    timeLeft: 90,
    gamePhase: 'waiting',
    matches: 0,
    level: 1
  });

  const [showCards, setShowCards] = useState(false);

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

  const generateCards = (level: number) => {
    const pairs = 4 + level * 2; // Level 1: 6 pairs, Level 2: 8 pairs, etc.
    const selectedItems = spaceItems.slice(0, pairs);
    const cardPairs: Card[] = [];

    selectedItems.forEach(item => {
      cardPairs.push(
        {
          id: `${item.name}_1`,
          emoji: item.emoji,
          name: item.name,
          isFlipped: false,
          isMatched: false
        },
        {
          id: `${item.name}_2`,
          emoji: item.emoji,
          name: item.name,
          isFlipped: false,
          isMatched: false
        }
      );
    });

    return cardPairs.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const cards = generateCards(gameState.level);
    setGameState(prev => ({
      ...prev,
      cards,
      gamePhase: 'playing',
      timeLeft: 60 + (gameState.level * 30), // More time for harder levels
      score: 0,
      moves: 0,
      matches: 0,
      flippedCards: []
    }));

    // Show all cards for 3 seconds
    setShowCards(true);
    setTimeout(() => {
      setShowCards(false);
    }, 3000);
  };

  const flipCard = (cardId: string) => {
    if (gameState.flippedCards.length >= 2 || showCards) return;

    const card = gameState.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...gameState.flippedCards, card];
    
    setGameState(prev => ({
      ...prev,
      cards: prev.cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      ),
      flippedCards: newFlippedCards,
      moves: prev.moves + (newFlippedCards.length === 1 ? 1 : 0)
    }));

    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkMatch = (flippedCards: Card[]) => {
    const [card1, card2] = flippedCards;
    const isMatch = card1.name === card2.name;

    if (isMatch) {
      const bonusPoints = Math.max(50 - gameState.moves * 2, 10);
      setGameState(prev => ({
        ...prev,
        cards: prev.cards.map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isMatched: true } 
            : c
        ),
        flippedCards: [],
        score: prev.score + bonusPoints,
        matches: prev.matches + 1
      }));

      // Check if all cards are matched
      const totalMatches = gameState.matches + 1;
      const totalPairs = gameState.cards.length / 2;
      
      if (totalMatches === totalPairs) {
        setTimeout(() => {
          nextLevel();
        }, 1000);
      }
    } else {
      setGameState(prev => ({
        ...prev,
        cards: prev.cards.map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isFlipped: false } 
            : c
        ),
        flippedCards: []
      }));
    }
  };

  const nextLevel = () => {
    if (gameState.level >= 3) {
      endGame();
    } else {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1
      }));
      
      setTimeout(() => {
        const cards = generateCards(gameState.level + 1);
        setGameState(prev => ({
          ...prev,
          cards,
          timeLeft: 60 + ((prev.level + 1) * 30),
          matches: 0,
          flippedCards: []
        }));

        setShowCards(true);
        setTimeout(() => {
          setShowCards(false);
        }, 3000);
      }, 2000);
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
      cards: [],
      flippedCards: [],
      score: 0,
      moves: 0,
      timeLeft: 90,
      gamePhase: 'waiting',
      matches: 0,
      level: 1
    });
    setShowCards(false);
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
                <Star className="text-purple-400 mr-2" size={20} />
                <span className="text-gray-400">ด่าน</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.level}</div>
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
                <Heart className="text-green-400 mr-2" size={20} />
                <span className="text-gray-400">จับคู่</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {gameState.matches}/{gameState.cards.length / 2}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-gray-400">ครั้ง</span>
              </div>
              <div className="text-2xl font-bold text-white">{gameState.moves}</div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-6xl mx-auto">
        {gameState.gamePhase === 'waiting' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🌌</div>
            <h2 className="text-3xl font-bold text-white mb-4">พร้อมทดสอบความจำหรือยัง?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              จับคู่สัญลักษณ์อวกาศให้ครบทุกคู่<br/>
              จำตำแหน่งของการ์ดและหาคู่ให้ได้เร็วที่สุด<br/>
              มี 3 ด่าน ด่านละยากขึ้นเรื่อยๆ!
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-purple-400 hover:to-blue-400 transition-all transform hover:scale-105"
            >
              เริ่มเกม
            </button>
          </div>
        )}

        {gameState.gamePhase === 'playing' && (
          <div className="space-y-8">
            {/* Level Header */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">ด่าน {gameState.level}</h3>
              <p className="text-gray-400">
                {showCards ? "จำตำแหน่งให้ดี!" : "คลิกการ์ดเพื่อเปิดและจับคู่"}
              </p>
            </div>

            {/* Memory Cards Grid */}
            <div className={`grid gap-4 justify-center ${
              gameState.cards.length <= 12 ? 'grid-cols-4' : 
              gameState.cards.length <= 16 ? 'grid-cols-4 md:grid-cols-5' : 
              'grid-cols-4 md:grid-cols-6'
            }`}>
              {gameState.cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  className={`
                    w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 border-white/20 
                    flex items-center justify-center text-3xl cursor-pointer
                    transition-all duration-300 transform hover:scale-105
                    ${card.isMatched ? 'bg-green-500/30 border-green-500' :
                      card.isFlipped || showCards ? 'bg-blue-500/30 border-blue-500' :
                      'bg-white/10 hover:bg-white/20'}
                  `}
                >
                  {card.isFlipped || card.isMatched || showCards ? (
                    <span className="select-none">{card.emoji}</span>
                  ) : (
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Memory Tip */}
            {!showCards && (
              <div className="text-center">
                <div className="bg-yellow-500/20 text-yellow-300 px-6 py-3 rounded-full text-sm border border-yellow-500/30 inline-block">
                  💡 เคล็ดลับ: จำตำแหน่งของการ์ดที่เปิดแล้วไปใช้ในรอบถัดไป
                </div>
              </div>
            )}
          </div>
        )}

        {gameState.gamePhase === 'finished' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              {gameState.level >= 3 ? '🎉' : '👍'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameState.level >= 3 ? 'ยอดเยี่ยม! ผ่านครบทุกด่าน!' : 'เกมจบแล้ว!'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">คะแนนรวม:</span>
                  <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ด่านสูงสุด:</span>
                  <span className="text-purple-400 font-bold">{gameState.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">จำนวนครั้ง:</span>
                  <span className="text-blue-400 font-bold">{gameState.moves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ประสิทธิภาพ:</span>
                  <span className="text-green-400 font-bold">
                    {gameState.moves > 0 ? Math.round((gameState.matches * 2 / gameState.moves) * 100) : 0}%
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
