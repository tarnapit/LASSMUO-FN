"use client";
import { useState, useEffect, useCallback } from "react";
import { getQuestionsForMode, calculateTimeBonus } from "../../../data/mini-game-questions";
import { MiniGameQuestion, GameResult } from "../../../types/mini-game";
import Navbar from "../../../components/layout/Navbar";
import {
  Target,
  Brain,
  Star,
  CheckCircle,
  XCircle,
  BookOpen,
  Lightbulb,
  ArrowRight,
  AlertCircle
} from "lucide-react";

interface RandomQuizGameProps {
  onGameFinish: (result: GameResult) => void;
}

export default function RandomQuizGame({ onGameFinish }: RandomQuizGameProps) {
  const [questions, setQuestions] = useState<MiniGameQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize game
  useEffect(() => {
    const gameQuestions = getQuestionsForMode('random-quiz');
    setQuestions(gameQuestions);
    setGameStartTime(Date.now());
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: any) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const isCorrect = checkAnswer(currentQuestion, answer);
    
    // Calculate points (no time bonus in random quiz mode, focus on learning)
    let questionPoints = 0;
    if (isCorrect) {
      questionPoints = currentQuestion.points;
    }
    
    // Update answers record
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    
    // Update score
    setScore(prev => prev + questionPoints);
    
    // Show result
    setShowResult(true);
  }, [currentQuestion, isAnswered]);

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
      case 'matching':
        const correctPairs = question.correctAnswer as string[];
        return Array.isArray(answer) && 
               answer.length === correctPairs.length &&
               answer.every(pair => correctPairs.includes(pair));
      case 'ordering':
        const correctOrder = question.correctAnswer as string[];
        return Array.isArray(answer) && 
               JSON.stringify(answer) === JSON.stringify(correctOrder);
      default:
        return false;
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      finishGame();
    }
  };

  // Finish game and calculate results
  const finishGame = () => {
    const totalTimeSpent = (Date.now() - gameStartTime) / 1000;
    const correctAnswers = questions.filter(q => 
      checkAnswer(q, answers[q.id])
    ).length;
    
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    const result: GameResult = {
      totalQuestions: questions.length,
      correctAnswers,
      score,
      percentage,
      timeSpent: totalTimeSpent,
      bonusPoints: 0, // No time bonus in random quiz mode
      gameMode: 'random-quiz',
      breakdown: questions.map(q => ({
        questionId: q.id,
        correct: checkAnswer(q, answers[q.id]),
        points: checkAnswer(q, answers[q.id]) ? q.points : 0,
        timeSpent: 0,
        bonusPoints: 0
      }))
    };
    
    onGameFinish(result);
  };

  // Render question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'true-false':
        return renderTrueFalse();
      case 'fill-blank':
        return renderFillBlank();
      case 'matching':
        return renderMatching();
      case 'ordering':
        return renderOrdering();
      default:
        return <div>Unsupported question type</div>;
    }
  };

  // Render multiple choice question
  const renderMultipleChoice = () => {
    return (
      <div className="space-y-4">
        {currentQuestion.options?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === currentQuestion.correctAnswer;
          const shouldHighlight = showResult && (isSelected || isCorrect);
          
          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                shouldHighlight
                  ? isCorrect
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : isSelected
                    ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-green-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {shouldHighlight && (
                  isCorrect ? <CheckCircle className="text-green-400" size={20} /> :
                  isSelected ? <XCircle className="text-red-400" size={20} /> : null
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
      { value: 'true', label: '✓ ถูก', color: 'green' },
      { value: 'false', label: '✗ ผิด', color: 'red' }
    ];

    return (
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          const isCorrect = option.value === currentQuestion.correctAnswer;
          const shouldHighlight = showResult && (isSelected || isCorrect);
          
          return (
            <button
              key={option.value}
              onClick={() => handleAnswerSelect(option.value)}
              disabled={isAnswered}
              className={`p-6 text-center rounded-xl border-2 transition-all duration-300 ${
                shouldHighlight
                  ? isCorrect
                    ? 'border-green-500 bg-green-500/20 text-green-300'
                    : isSelected
                    ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-white/20 bg-white/5 text-gray-300'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-green-400/50'
              }`}
            >
              <div className="text-2xl font-bold mb-2">{option.label}</div>
              {shouldHighlight && (
                isCorrect ? <CheckCircle className="mx-auto text-green-400" size={24} /> :
                isSelected ? <XCircle className="mx-auto text-red-400" size={24} /> : null
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Render fill blank question
  const renderFillBlank = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <input
            type="text"
            placeholder="พิมพ์คำตอบของคุณ..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
            onChange={(e) => setSelectedAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnswerSelect(selectedAnswer)}
            disabled={isAnswered}
          />
        </div>
        
        {!isAnswered && (
          <button
            onClick={() => handleAnswerSelect(selectedAnswer)}
            disabled={!selectedAnswer?.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ส่งคำตอบ
          </button>
        )}
        
        {showResult && (
          <div className={`p-4 rounded-xl border ${
            checkAnswer(currentQuestion, selectedAnswer)
              ? 'border-green-500 bg-green-500/20 text-green-300'
              : 'border-red-500 bg-red-500/20 text-red-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {checkAnswer(currentQuestion, selectedAnswer) ? 
                <CheckCircle size={20} /> : <XCircle size={20} />
              }
              <span className="font-bold">
                {checkAnswer(currentQuestion, selectedAnswer) ? 'ถูกต้อง!' : 'ไม่ถูกต้อง'}
              </span>
            </div>
            {!checkAnswer(currentQuestion, selectedAnswer) && (
              <p>คำตอบที่ถูก: {currentQuestion.blanks?.[0]}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Placeholder for matching questions
  const renderMatching = () => {
    return (
      <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
        <AlertCircle className="mx-auto text-yellow-400 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">คำถามจับคู่</h3>
        <p className="text-gray-400 mb-4">ฟีเจอร์นี้กำลังพัฒนา</p>
        <button
          onClick={() => handleAnswerSelect([])}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          ข้ามคำถามนี้
        </button>
      </div>
    );
  };

  // Placeholder for ordering questions  
  const renderOrdering = () => {
    return (
      <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
        <AlertCircle className="mx-auto text-yellow-400 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">คำถามเรียงลำดับ</h3>
        <p className="text-gray-400 mb-4">ฟีเจอร์นี้กำลังพัฒนา</p>
        <button
          onClick={() => handleAnswerSelect([])}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          ข้ามคำถามนี้
        </button>
      </div>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="text-green-400 animate-pulse mx-auto mb-4" size={64} />
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
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Target className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">โหมดทบทวนแบบสุ่ม</h1>
                <p className="text-gray-400">คำถามจากทุกบทเรียน เน้นการเรียนรู้</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{score}</div>
              <div className="text-gray-400 text-sm">คะแนน</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>ความคืบหน้า</span>
              <span>{currentQuestionIndex + 1}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{currentQuestion.category === 'solar-system' ? '🌟' : 
                                        currentQuestion.category === 'planets' ? '🪐' : 
                                        currentQuestion.category === 'earth-structure' ? '🌍' : '🔭'}</div>
                <div>
                  <span className="text-green-400 text-sm font-medium">
                    {currentQuestion.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-blue-400 text-xs flex items-center gap-1">
                      <Star size={12} />
                      {currentQuestion.points} คะแนน
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-green-400 text-sm flex items-center gap-1">
                  <BookOpen size={12} />
                  การเรียนรู้
                </div>
                <div className="text-gray-400 text-xs">ไม่มีข้อจำกัดเวลา</div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            {renderQuestion()}
            
            {/* Explanation (shown after answer) */}
            {showResult && currentQuestion.explanation && (
              <div className="mt-8">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 transition-colors"
                >
                  <Lightbulb size={20} />
                  <span>คำอธิบาย</span>
                  <ArrowRight className={`transition-transform ${showExplanation ? 'rotate-90' : ''}`} size={16} />
                </button>
                
                {showExplanation && (
                  <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/30">
                    <div className="flex items-start gap-3">
                      <Brain className="text-blue-400 mt-1" size={20} />
                      <div>
                        <h4 className="text-blue-400 font-bold mb-2">คำอธิบายเพิ่มเติม</h4>
                        <p className="text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Button */}
            {showResult && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      <ArrowRight size={20} />
                      คำถามถัดไป
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      เสร็จสิ้น
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Learning Tips */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg border border-green-500/30">
              <BookOpen size={16} />
              <span className="text-sm">เคล็ดลับ: อ่านคำอธิบายเพื่อเพิ่มความรู้!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
