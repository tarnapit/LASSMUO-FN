"use client";
import { useState, useEffect, useCallback } from "react";
import { getQuestionsForMode } from "../../../data/mini-game-questions";
import { MiniGameQuestion, GameResult } from "../../../types/mini-game";
import Navbar from "../../../components/layout/Navbar";
import {
  Clock,
  Zap,
  Star,
  CheckCircle,
  XCircle,
  Brain,
  AlertTriangle,
  Timer
} from "lucide-react";

interface TimeRushGameProps {
  onGameFinish: (result: GameResult) => void;
}

export default function TimeRushGame({ onGameFinish }: TimeRushGameProps) {
  const [questions, setQuestions] = useState<MiniGameQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Initialize game
  useEffect(() => {
    const gameQuestions = getQuestionsForMode('time-rush');
    setQuestions(gameQuestions);
    setGameStartTime(Date.now());
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || gameEnded) {
      if (!gameEnded) {
        finishGame();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, gameEnded]);

  const currentQuestion = questions[currentQuestionIndex];

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: any) => {
    if (isAnswered || gameEnded) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = checkAnswer(currentQuestion, answer);
    
    // Update answers record
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    
    // Update correct answers count
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
    
    // Show result briefly (faster for time rush)
    setShowResult(true);
    
    // Move to next question quickly
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Next question
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsAnswered(false);
      } else {
        // Finished all questions
        finishGame();
      }
    }, isCorrect ? 1000 : 1500); // Shorter delay for correct answers
  }, [currentQuestion, currentQuestionIndex, isAnswered, gameEnded, questions.length]);

  // Check if answer is correct
  const checkAnswer = (question: MiniGameQuestion, answer: any): boolean => {
    switch (question.type) {
      case 'multiple-choice':
        return answer === question.correctAnswer;
      case 'true-false':
        return answer === question.correctAnswer;
      case 'fill-blank':
        return question.blanks?.some(blank => 
          answer.toLowerCase().trim() === blank.toLowerCase().trim()
        ) || false;
      default:
        return false;
    }
  };

  // Finish game and calculate results
  const finishGame = () => {
    if (gameEnded) return;
    
    setGameEnded(true);
    const totalTimeSpent = 60 - timeRemaining;
    
    const result: GameResult = {
      totalQuestions: currentQuestionIndex + 1, // Questions attempted
      correctAnswers: correctAnswersCount,
      score: correctAnswersCount * 10, // 10 points per correct answer
      percentage: Math.round((correctAnswersCount / (currentQuestionIndex + 1)) * 100),
      timeSpent: totalTimeSpent,
      bonusPoints: 0, // No time bonus in time rush mode
      gameMode: 'time-rush',
      breakdown: questions.slice(0, currentQuestionIndex + 1).map(q => ({
        questionId: q.id,
        correct: checkAnswer(q, answers[q.id]),
        points: checkAnswer(q, answers[q.id]) ? 10 : 0,
        timeSpent: 0,
        bonusPoints: 0
      }))
    };
    
    onGameFinish(result);
  };

  // Auto-skip on wrong answer in time rush mode
  useEffect(() => {
    if (showResult && !checkAnswer(currentQuestion, selectedAnswer)) {
      // Auto skip after showing wrong answer
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1 && timeRemaining > 0) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setIsAnswered(false);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [showResult, selectedAnswer, currentQuestion, currentQuestionIndex, questions.length, timeRemaining]);

  // Render question based on type (simplified for speed)
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'true-false':
        return renderTrueFalse();
      case 'fill-blank':
        return renderFillBlank();
      default:
        return <div>Unsupported question type</div>;
    }
  };

  // Render multiple choice question
  const renderMultipleChoice = () => {
    return (
      <div className="space-y-3">
        {currentQuestion.options?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const shouldHighlight = showResult && (isSelected || isCorrect);
          
          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                shouldHighlight
                  ? isCorrect
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : isSelected
                    ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-white/20 bg-white/5 text-gray-300'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-blue-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base">{option}</span>
                {shouldHighlight && (
                  isCorrect ? <CheckCircle className="text-green-400" size={16} /> :
                  isSelected ? <XCircle className="text-red-400" size={16} /> : null
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // Render true/false question
  const renderTrueFalse = () => {
    const options = [
      { value: 'true', label: 'ถูก', emoji: '✓', color: 'green' },
      { value: 'false', label: 'ผิด', emoji: '✗', color: 'red' }
    ];

    return (
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          const isCorrect = option.value === currentQuestion.correctAnswer;
          const shouldHighlight = showResult && (isSelected || isCorrect);
          
          return (
            <button
              key={option.value}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={isAnswered}
              className={`p-4 text-center rounded-lg border-2 transition-all duration-200 ${
                shouldHighlight
                  ? isCorrect
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : isSelected
                    ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-white/20 bg-white/5 text-gray-300'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-blue-400/50'
              }`}
            >
              <div className="text-xl font-bold mb-1">{option.emoji}</div>
              <div className="text-sm">{option.label}</div>
              {shouldHighlight && (
                isCorrect ? <CheckCircle className="mx-auto mt-2 text-green-400" size={20} /> :
                isSelected ? <XCircle className="mx-auto mt-2 text-red-400" size={20} /> : null
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Render fill blank question (simplified for speed)
  const renderFillBlank = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <input
            type="text"
            placeholder="พิมพ์คำตอบ (กด Enter เพื่อส่ง)"
            className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none text-lg"
            onChange={(e) => setSelectedAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && selectedAnswer?.trim() && handleAnswerSelect(selectedAnswer)}
            disabled={isAnswered}
            autoFocus
          />
        </div>
        
        {showResult && (
          <div className={`p-3 rounded-lg border text-center ${
            checkAnswer(currentQuestion, selectedAnswer)
              ? 'border-green-500 bg-green-500/20 text-green-300'
              : 'border-red-500 bg-red-500/20 text-red-300'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {checkAnswer(currentQuestion, selectedAnswer) ? 
                <CheckCircle size={16} /> : <XCircle size={16} />
              }
              <span className="text-sm font-bold">
                {checkAnswer(currentQuestion, selectedAnswer) ? 'ถูก!' : `ผิด - คำตอบ: ${currentQuestion.blanks?.[0]}`}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-red-400';
    if (timeRemaining <= 20) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Timer className="text-red-400 animate-pulse mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white">กำลังโหลดคำถาม...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">โหมดท้าทายเวลา</h1>
                <p className="text-gray-400">ตอบให้ได้มากสุดใน 60 วินาที</p>
              </div>
            </div>
            
            {/* Timer */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getTimerColor()}`}>
                {timeRemaining}
              </div>
              <div className="text-gray-400 text-sm">วินาที</div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{currentQuestionIndex + 1}</div>
              <div className="text-gray-400 text-sm">คำถาม</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-green-400">{correctAnswersCount}</div>
              <div className="text-gray-400 text-sm">ตอบถูก</div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-yellow-400">{correctAnswersCount * 10}</div>
              <div className="text-gray-400 text-sm">คะแนน</div>
            </div>
          </div>

          {/* Warning for low time */}
          {timeRemaining <= 10 && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 text-red-300">
                <AlertTriangle size={20} />
                <span className="font-bold">เวลาใกล้หมด! เร่งตอบด่วน!</span>
              </div>
            </div>
          )}

          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="text-xl">{currentQuestion.category === 'solar-system' ? '🌟' : 
                                      currentQuestion.category === 'planets' ? '🪐' : 
                                      currentQuestion.category === 'earth-structure' ? '🌍' : '🔭'}</div>
                <span className="text-blue-400 text-sm font-medium">
                  {currentQuestion.category.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-yellow-400 text-sm flex items-center gap-1">
                  <Zap size={12} />
                  10 คะแนน
                </span>
              </div>
              
              <div className="text-gray-400 text-sm">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            {renderQuestion()}
          </div>

          {/* Speed Tips */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg border border-purple-500/30">
              <Zap size={16} />
              <span className="text-sm">เคล็ดลับ: ตอบด้วยสัญชาตญาณ อย่าคิดนาน!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
