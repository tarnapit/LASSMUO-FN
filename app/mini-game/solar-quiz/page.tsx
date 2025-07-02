"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMiniGameById, solarQuizQuestions } from "../../data/mini-games";
import { MiniGame, QuizQuestion } from "../../types/game";
import Navbar from "../../components/layout/Navbar";
import { ArrowLeft, Clock, Trophy, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface QuizState {
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  score: number;
  timeLeft: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  showExplanation: boolean;
  isAnswerCorrect: boolean | null;
}

export default function SolarQuizGame() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<MiniGame | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: new Array(solarQuizQuestions.length).fill(null),
    score: 0,
    timeLeft: 300, // 5 minutes
    gamePhase: 'waiting',
    showExplanation: false,
    isAnswerCorrect: null
  });

  useEffect(() => {
    if (params.gameId) {
      const foundGame = getMiniGameById(params.gameId as string);
      if (foundGame) {
        setGame(foundGame);
        if (foundGame.id !== 'solar-quiz') {
          router.push('/mini-game');
        }
      } else {
        router.push('/mini-game');
      }
    }
  }, [params.gameId, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState.gamePhase === 'playing' && quizState.timeLeft > 0) {
      timer = setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (quizState.timeLeft === 0 && quizState.gamePhase === 'playing') {
      finishQuiz();
    }
    return () => clearTimeout(timer);
  }, [quizState.gamePhase, quizState.timeLeft]);

  const startQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      gamePhase: 'playing',
      timeLeft: 300,
      currentQuestion: 0,
      selectedAnswers: new Array(solarQuizQuestions.length).fill(null),
      score: 0
    }));
  };

  const selectAnswer = (answerIndex: number) => {
    if (quizState.showExplanation) return;

    const currentQ = solarQuizQuestions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: prev.selectedAnswers.map((answer, index) => 
        index === prev.currentQuestion ? answerIndex : answer
      ),
      score: isCorrect ? prev.score + 20 : prev.score,
      showExplanation: true,
      isAnswerCorrect: isCorrect
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < solarQuizQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showExplanation: false,
        isAnswerCorrect: null
      }));
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizState(prev => ({
      ...prev,
      gamePhase: 'finished'
    }));
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: new Array(solarQuizQuestions.length).fill(null),
      score: 0,
      timeLeft: 300,
      gamePhase: 'waiting',
      showExplanation: false,
      isAnswerCorrect: null
    });
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

  const getScoreGrade = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return { grade: 'A', color: 'text-green-400', message: 'ยอดเยี่ยม!' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400', message: 'ดีมาก!' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-400', message: 'พอใช้' };
    return { grade: 'D', color: 'text-red-400', message: 'ต้องปรับปรุง' };
  };

  const currentQuestion = solarQuizQuestions[quizState.currentQuestion];
  const maxScore = solarQuizQuestions.length * 20;
  const scoreInfo = getScoreGrade(quizState.score, maxScore);

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

        {/* Quiz Stats */}
        {quizState.gamePhase !== 'waiting' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="text-yellow-400 mr-2" size={20} />
                  <span className="text-gray-400">คะแนน</span>
                </div>
                <div className="text-2xl font-bold text-white">{quizState.score}/{maxScore}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="text-blue-400 mr-2" size={20} />
                  <span className="text-gray-400">เวลา</span>
                </div>
                <div className="text-2xl font-bold text-white">{formatTime(quizState.timeLeft)}</div>
              </div>
              <div className="text-center md:col-span-1 col-span-2">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-gray-400">ข้อ</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {quizState.currentQuestion + 1}/{solarQuizQuestions.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Content */}
        <div className="max-w-4xl mx-auto">
          {quizState.gamePhase === 'waiting' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-8">☀️</div>
              <h2 className="text-3xl font-bold text-white mb-4">พร้อมทดสอบความรู้หรือยัง?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                ตอบคำถาม {solarQuizQuestions.length} ข้อเกี่ยวกับระบบสุริยะ<br/>
                คุณมีเวลา 5 นาที
              </p>
              <button 
                onClick={startQuiz}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-lg text-xl hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105"
              >
                เริ่มทำแบบทดสอบ
              </button>
            </div>
          )}

          {quizState.gamePhase === 'playing' && (
            <div className="space-y-8">
              {/* Question */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  ข้อ {quizState.currentQuestion + 1}: {currentQuestion.question}
                </h3>
                
                {/* Answer Options */}
                <div className="grid gap-4">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = quizState.selectedAnswers[quizState.currentQuestion] === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const showResult = quizState.showExplanation;
                    
                    let buttonClass = "bg-white/10 hover:bg-white/20 border-white/20";
                    
                    if (showResult) {
                      if (isSelected && isCorrect) {
                        buttonClass = "bg-green-500/20 border-green-400";
                      } else if (isSelected && !isCorrect) {
                        buttonClass = "bg-red-500/20 border-red-400";
                      } else if (isCorrect) {
                        buttonClass = "bg-green-500/20 border-green-400";
                      }
                    } else if (isSelected) {
                      buttonClass = "bg-yellow-500/20 border-yellow-400";
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={quizState.showExplanation}
                        className={`${buttonClass} backdrop-blur-sm rounded-xl p-4 border transition-all text-left flex items-center`}
                      >
                        <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-4 text-white font-semibold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-white text-lg">{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle className="text-green-400 ml-auto" size={24} />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="text-red-400 ml-auto" size={24} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              {quizState.showExplanation && (
                <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
                  <div className="flex items-center mb-4">
                    {quizState.isAnswerCorrect ? (
                      <CheckCircle className="text-green-400 mr-3" size={24} />
                    ) : (
                      <XCircle className="text-red-400 mr-3" size={24} />
                    )}
                    <h4 className="text-xl font-semibold text-white">
                      {quizState.isAnswerCorrect ? 'ถูกต้อง!' : 'ไม่ถูกต้อง'}
                    </h4>
                  </div>
                  <p className="text-gray-200 mb-6">{currentQuestion.explanation}</p>
                  <button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-400 hover:to-purple-400 transition-all"
                  >
                    {quizState.currentQuestion < solarQuizQuestions.length - 1 ? 'ข้อถัดไป' : 'ดูผลลัพธ์'}
                  </button>
                </div>
              )}
            </div>
          )}

          {quizState.gamePhase === 'finished' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-8">
                {scoreInfo.grade === 'A' ? '🏆' : scoreInfo.grade === 'B' ? '🥈' : scoreInfo.grade === 'C' ? '🥉' : '📚'}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">แบบทดสอบเสร็จสิ้น!</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8 max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${scoreInfo.color} mb-2`}>
                      เกรด {scoreInfo.grade}
                    </div>
                    <div className="text-gray-400">{scoreInfo.message}</div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">คะแนนรวม:</span>
                    <span className="text-yellow-400 font-bold">{quizState.score}/{maxScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ตอบถูก:</span>
                    <span className="text-green-400 font-bold">
                      {quizState.selectedAnswers.filter((answer, index) => 
                        answer === solarQuizQuestions[index].correctAnswer
                      ).length}/{solarQuizQuestions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">เปอร์เซ็นต์:</span>
                    <span className={`font-bold ${scoreInfo.color}`}>
                      {Math.round((quizState.score / maxScore) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-x-4">
                <button 
                  onClick={restartQuiz}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-400 hover:to-blue-400 transition-all"
                >
                  ทำใหม่
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
