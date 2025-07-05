"use client";
import { useState, useEffect } from "react";
import { solarQuizQuestions } from "../../../data/mini-games";
import { MiniGame, QuizQuestion } from "../../../types/game";
import { Heart, Star, Clock, Trophy, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface GameState {
  currentQuestion: number;
  score: number;
  lives: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  selectedAnswer: number | null;
  showFeedback: boolean;
  correctAnswers: number;
  streak: number;
}

interface SolarQuizGameProps {
  game: MiniGame;
}

export default function SolarQuizGame({ game }: SolarQuizGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    lives: 3,
    timeLeft: 120, // 2 minutes for quiz
    gamePhase: 'waiting',
    selectedAnswer: null,
    showFeedback: false,
    correctAnswers: 0,
    streak: 0
  });
  
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    // Shuffle questions when component mounts
    const shuffled = [...solarQuizQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled.slice(0, 10)); // Take first 10 questions
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

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      timeLeft: 120,
      score: 0,
      lives: 3,
      currentQuestion: 0,
      correctAnswers: 0,
      streak: 0
    }));
  };

  const selectAnswer = (answerIndex: number) => {
    if (gameState.showFeedback || gameState.selectedAnswer !== null) return;

    const currentQ = shuffledQuestions[gameState.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true
    }));

    if (isCorrect) {
      const bonusPoints = gameState.streak >= 3 ? 30 : 20;
      setFeedback(`ถูกต้อง! +${bonusPoints} คะแนน 🎉`);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + bonusPoints,
        correctAnswers: prev.correctAnswers + 1,
        streak: prev.streak + 1
      }));
    } else {
      setFeedback("ผิด! ลองใหม่อีกครั้ง 😔");
      
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        streak: 0
      }));
    }

    setTimeout(() => {
      if (isCorrect || gameState.lives <= 1) {
        nextQuestion();
      } else {
        setGameState(prev => ({
          ...prev,
          selectedAnswer: null,
          showFeedback: false
        }));
        setFeedback("");
      }
    }, 2000);
  };

  const nextQuestion = () => {
    if (gameState.currentQuestion >= shuffledQuestions.length - 1 || gameState.lives <= 0) {
      endGame();
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        showFeedback: false
      }));
      setFeedback("");
    }
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'finished'
    }));
  };

  const restartGame = () => {
    const shuffled = [...solarQuizQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled.slice(0, 10));
    
    setGameState({
      currentQuestion: 0,
      score: 0,
      lives: 3,
      timeLeft: 120,
      gamePhase: 'waiting',
      selectedAnswer: null,
      showFeedback: false,
      correctAnswers: 0,
      streak: 0
    });
    setFeedback("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStreakMessage = () => {
    if (gameState.streak >= 5) return "🔥 ไฟแรง! ";
    if (gameState.streak >= 3) return "⚡ สุดยอด! ";
    return "";
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
                <Star className="text-purple-400 mr-2" size={20} />
                <span className="text-gray-400">ข้อ</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {gameState.currentQuestion + 1}/{shuffledQuestions.length}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-gray-400">Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-400">
                {getStreakMessage()}{gameState.streak}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content */}
      <div className="max-w-4xl mx-auto">
        {gameState.gamePhase === 'waiting' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">☀️</div>
            <h2 className="text-3xl font-bold text-white mb-4">พร้อมท้าทายความรู้หรือยัง?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              ตอบคำถามเกี่ยวกับระบบสุริยะ<br/>
              คุณมีเวลา 2 นาที และมีชีวิต 3 ชีวิต<br/>
              ตอบถูกติดต่อกัน 3 ข้อขึ้นไปจะได้โบนัสคะแนน!
            </p>
            <button 
              onClick={startGame}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105"
            >
              เริ่มเกม
            </button>
          </div>
        )}

        {gameState.gamePhase === 'playing' && shuffledQuestions.length > 0 && (
          <div className="space-y-8">
            {/* Current Question */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                {shuffledQuestions[gameState.currentQuestion].question}
              </h3>
              
              {/* Answer Options */}
              <div className="grid gap-4">
                {shuffledQuestions[gameState.currentQuestion].options.map((option, index) => {
                  let buttonClass = "bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-left";
                  
                  if (gameState.selectedAnswer === index) {
                    if (index === shuffledQuestions[gameState.currentQuestion].correctAnswer) {
                      buttonClass += " bg-green-500/30 border-green-500";
                    } else {
                      buttonClass += " bg-red-500/30 border-red-500";
                    }
                  } else if (gameState.showFeedback && index === shuffledQuestions[gameState.currentQuestion].correctAnswer) {
                    buttonClass += " bg-green-500/30 border-green-500";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      className={buttonClass}
                      disabled={gameState.showFeedback}
                    >
                      <div className="flex items-center">
                        <span className="text-white text-lg mr-4">{String.fromCharCode(65 + index)}.</span>
                        <p className="text-white text-lg">{option}</p>
                        {gameState.showFeedback && index === shuffledQuestions[gameState.currentQuestion].correctAnswer && (
                          <CheckCircle className="text-green-400 ml-auto" size={24} />
                        )}
                        {gameState.selectedAnswer === index && index !== shuffledQuestions[gameState.currentQuestion].correctAnswer && (
                          <XCircle className="text-red-400 ml-auto" size={24} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {gameState.showFeedback && (
                <div className="mt-6 p-6 bg-white/10 rounded-xl border border-white/20">
                  <div className="text-lg font-bold text-white mb-2">{feedback}</div>
                  <div className="text-gray-300">
                    {shuffledQuestions[gameState.currentQuestion].explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState.gamePhase === 'finished' && (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              {gameState.correctAnswers >= 7 ? '🎉' : gameState.correctAnswers >= 5 ? '👍' : '😔'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {gameState.correctAnswers >= 7 ? 'ยอดเยี่ยม!' : 
               gameState.correctAnswers >= 5 ? 'ดีมาก!' : 'เกมจบแล้ว!'}
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">คะแนนรวม:</span>
                  <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ตอบถูก:</span>
                  <span className="text-green-400 font-bold">{gameState.correctAnswers}/{shuffledQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ความแม่นยำ:</span>
                  <span className="text-blue-400 font-bold">
                    {shuffledQuestions.length > 0 ? Math.round((gameState.correctAnswers / shuffledQuestions.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Streak สูงสุด:</span>
                  <span className="text-orange-400 font-bold">{gameState.streak}</span>
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
