"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { miniGames } from "../../data/mini-games";
import { getQuestionsForMode, calculateTimeBonus } from "../../data/mini-game-questions";
import { MiniGameQuestion, GameSession, type GameResult } from "../../types/mini-game";
import { MiniGameProgressHelper } from "../../lib/mini-game-progress";
import Navbar from "../../components/layout/Navbar";
import QuestionRenderer from "./components/QuestionRenderer";
import GameResultComponent from "./components/GameResult";
import { checkAnswer, getCategoryName, getDifficultyName } from "./utils/gameUtils";
import { 
  ArrowLeft, 
  Clock, 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle,
  Brain,
  Zap,
  Target,
  Play,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import "../../styles/mini-game-specific.css";
import "../../styles/enhanced-mini-game.css";

// Score Challenge Game - โหมดสะสมคะแนน
function ScoreChallengeGame({ onGameFinish }: { onGameFinish: (result: GameResult, answers: Record<string, any>, questionTimes: Record<string, number>) => void }) {
  const [questions] = useState(() => getQuestionsForMode('score-challenge'));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Question timer
  useEffect(() => {
    if (isAnswered) return;
    
    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-answer as incorrect when time runs out
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isAnswered]);

  const handleAnswer = (answer: any) => {
    if (isAnswered) return;
    
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = answer !== null && checkAnswer(currentQuestion, answer);
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setQuestionTimes(prev => ({ ...prev, [currentQuestion.id]: timeSpent }));
    setIsAnswered(true);
    
    if (isCorrect) {
      const basePoints = currentQuestion.points;
      const timeBonus = calculateTimeBonus(timeSpent, currentQuestion.timeBonus || 0);
      const streakBonus = streak >= 3 ? Math.floor(basePoints * 0.5) : 0;
      const totalBonus = timeBonus + streakBonus;
      
      setScore(prev => prev + basePoints + totalBonus);
      setBonusPoints(prev => prev + totalBonus);
      setStreak(prev => prev + 1);
      setShowCorrectAnimation(true);
      
      if (streakBonus > 0) {
        setShowStreakBonus(true);
        setTimeout(() => setShowStreakBonus(false), 2000);
      }
      
      setTimeout(() => setShowCorrectAnimation(false), 1000);
    } else {
      setStreak(0);
      setShowIncorrectAnimation(true);
      setTimeout(() => setShowIncorrectAnimation(false), 1000);
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
      setQuestionTimeLeft(30);
    } else {
      // Game finished - calculate final scores properly
      const currentAnswer = answers[currentQuestion.id];
      const currentTimeSpent = (Date.now() - questionStartTime) / 1000;
      const allAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
      const allQuestionTimes = { ...questionTimes, [currentQuestion.id]: currentTimeSpent };
      
      // Count correct answers from all questions including current one
      const finalCorrectAnswers = questions.filter(q => {
        const userAnswer = allAnswers[q.id];
        return userAnswer !== null && userAnswer !== undefined && checkAnswer(q, userAnswer);
      }).length;
      
      // Calculate total time from all questions
      const totalTimeSpent = Object.values(allQuestionTimes).reduce((total, time) => total + time, 0);
      
      const result: GameResult = {
        score,
        correctAnswers: finalCorrectAnswers,
        totalQuestions: questions.length,
        percentage: Math.round((finalCorrectAnswers / questions.length) * 100),
        timeSpent: totalTimeSpent,
        bonusPoints,
        gameMode: 'score-challenge',
        breakdown: []
      };
      
      onGameFinish(result, allAnswers, allQuestionTimes);
    }
  };

  const getTimeColor = () => {
    if (questionTimeLeft <= 5) return "text-red-400 animate-pulse";
    if (questionTimeLeft <= 10) return "text-orange-400";
    return "text-green-400";
  };

  const getStreakMessage = () => {
    if (streak >= 10) return "🔥 LEGENDARY STREAK! 🔥";
    if (streak >= 7) return "⚡ INCREDIBLE STREAK! ⚡";
    if (streak >= 5) return "🌟 AMAZING STREAK! 🌟";
    if (streak >= 3) return "💪 GREAT STREAK! 💪";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative">
      <Navbar />
      
      {/* Background Animation Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {showCorrectAnimation && (
          <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
        )}
        {showIncorrectAnimation && (
          <div className="absolute inset-0 bg-red-500/20 animate-pulse"></div>
        )}
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Challenge Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex justify-between items-center text-white mb-4">
            <div className="flex items-center gap-4">
              <span className="text-lg">คำถามที่ {currentQuestionIndex + 1} จาก {questions.length}</span>
              {streak > 0 && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  🔥 Streak x{streak}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              💎 {score}
            </div>
          </div>
          
          {/* Time Challenge Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`text-lg font-bold ${getTimeColor()}`}>
              ⏱️ {questionTimeLeft}s
            </div>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  questionTimeLeft <= 5 ? 'bg-red-500' : 
                  questionTimeLeft <= 10 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${(questionTimeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 progress-bar"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Streak Message */}
          {streak >= 3 && (
            <div className="text-center mt-2">
              <span className="text-orange-400 font-bold animate-bounce">
                {getStreakMessage()}
              </span>
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 ${
            showCorrectAnimation ? 'border-green-500 shadow-lg shadow-green-500/50' :
            showIncorrectAnimation ? 'border-red-500 shadow-lg shadow-red-500/50' :
            'border-white/20'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-3 rounded-full ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-400' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="text-gray-400 text-sm uppercase tracking-wide">
                {getCategoryName(currentQuestion.category)} • {getDifficultyName(currentQuestion.difficulty)}
              </span>
              <div className="text-blue-400 font-bold">
                💎 {currentQuestion.points}pts
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
            
            <QuestionRenderer 
              question={currentQuestion}
              onAnswer={handleAnswer}
              disabled={isAnswered}
              showResult={isAnswered}
            />
            
            {showExplanation && currentQuestion.explanation && (
              <div className={`mt-6 p-4 rounded-xl border transition-all duration-500 ${
                showCorrectAnimation ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/20 border-blue-500/30'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  showCorrectAnimation ? 'text-green-300' : 'text-blue-300'
                }`}>
                  {showCorrectAnimation ? '🎉 ถูกต้อง! คำอธิบาย:' : '💡 คำอธิบาย:'}
                </h4>
                <p className="text-gray-300">{currentQuestion.explanation}</p>
              </div>
            )}

            {isAnswered && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {currentQuestionIndex < questions.length - 1 ? '🚀 คำถามถัดไป' : '🏆 ดูผลลัพธ์'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Streak Bonus Popup */}
        {showStreakBonus && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-xl animate-bounce shadow-2xl">
              🔥 STREAK BONUS! +{Math.floor(currentQuestion.points * 0.5)} pts! 🔥
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Time Rush Game - โหมดแข่งกับเวลา
function TimeRushGame({ onGameFinish }: { onGameFinish: (result: GameResult, answers: Record<string, any>, questionTimes: Record<string, number>) => void }) {
  const [questions] = useState(() => getQuestionsForMode('time-rush'));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [showSpeedBonus, setShowSpeedBonus] = useState(false);
  const [questionsPerMinute, setQuestionsPerMinute] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up!
          const result: GameResult = {
            score,
            correctAnswers,
            totalQuestions: currentQuestionIndex + 1,
            percentage: Math.round((correctAnswers / Math.max(1, currentQuestionIndex + 1)) * 100),
            timeSpent: 60,
            bonusPoints: speedBonus,
            gameMode: 'time-rush',
            breakdown: []
          };
          onGameFinish(result, answers, questionTimes);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score, correctAnswers, currentQuestionIndex, onGameFinish, speedBonus]);

  // Calculate questions per minute
  useEffect(() => {
    const elapsedTime = 60 - timeRemaining;
    if (elapsedTime > 0) {
      setQuestionsPerMinute(Math.round((currentQuestionIndex + 1) / (elapsedTime / 60)));
    }
  }, [currentQuestionIndex, timeRemaining]);

  const handleAnswer = (answer: any) => {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = checkAnswer(currentQuestion, answer);
    
    // บันทึก answer และเวลาที่ใช้
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setQuestionTimes(prev => ({ ...prev, [currentQuestion.id]: timeSpent }));
    
    if (isCorrect) {
      const basePoints = currentQuestion.points;
      const comboMultiplier = Math.min(combo + 1, 5); // Max 5x multiplier
      const comboPoints = Math.floor(basePoints * (comboMultiplier * 0.2));
      const totalPoints = basePoints + comboPoints;
      
      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      setSpeedBonus(prev => prev + comboPoints);
      
      if (comboPoints > 0) {
        setShowSpeedBonus(true);
        setTimeout(() => setShowSpeedBonus(false), 1500);
      }
      
      if (combo >= 4) {
        setShowComboEffect(true);
        setTimeout(() => setShowComboEffect(false), 1000);
      }
    } else {
      setCombo(0);
    }
    
    // Move to next question immediately
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now()); // Reset timer for next question
    } else {
      // No more questions
      const finalCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
      const finalScore = score + (isCorrect ? questions[currentQuestionIndex].points : 0);
      const result: GameResult = {
        score: finalScore,
        correctAnswers: finalCorrectAnswers,
        totalQuestions: currentQuestionIndex + 1,
        percentage: Math.round((finalCorrectAnswers / (currentQuestionIndex + 1)) * 100),
        timeSpent: 60 - timeRemaining,
        bonusPoints: speedBonus,
        gameMode: 'time-rush',
        breakdown: []
      };
      onGameFinish(result, answers, questionTimes);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  
  const getTimeColor = () => {
    if (timeRemaining <= 10) return "text-red-500 animate-pulse";
    if (timeRemaining <= 20) return "text-orange-500";
    return "text-green-500";
  };

  const getComboMessage = () => {
    if (combo >= 10) return "🚀 UNSTOPPABLE! 🚀";
    if (combo >= 7) return "⚡ LIGHTNING FAST! ⚡";
    if (combo >= 5) return "🔥 ON FIRE! 🔥";
    if (combo >= 3) return "💥 COMBO! 💥";
    return "";
  };

  const getSpeedLevel = () => {
    if (questionsPerMinute >= 20) return { level: "🚀 ROCKET SPEED", color: "text-purple-400" };
    if (questionsPerMinute >= 15) return { level: "⚡ LIGHTNING", color: "text-yellow-400" };
    if (questionsPerMinute >= 10) return { level: "🔥 BLAZING", color: "text-orange-400" };
    if (questionsPerMinute >= 5) return { level: "💨 FAST", color: "text-blue-400" };
    return { level: "🐌 WARMING UP", color: "text-gray-400" };
  };

  const speedLevel = getSpeedLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {showComboEffect && (
          <div className="absolute inset-0 bg-gradient-radial from-yellow-500/30 to-transparent animate-ping"></div>
        )}
        
        {/* Speed lines */}
        {combo > 3 && (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Intense Header */}
        <div className="max-w-4xl mx-auto mb-6">
          {/* Main Timer */}
          <div className="text-center mb-4">
            <div className={`text-6xl font-bold ${getTimeColor()} drop-shadow-lg`}>
              {timeRemaining}
            </div>
            <div className="text-red-400 font-bold text-lg animate-pulse">
              ⚡ SECONDS LEFT ⚡
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-500/30 text-center">
              <div className="text-2xl font-bold text-blue-400">{score}</div>
              <div className="text-blue-300 text-sm">💎 SCORE</div>
            </div>
            <div className="bg-green-500/20 rounded-xl p-3 border border-green-500/30 text-center">
              <div className="text-2xl font-bold text-green-400">{correctAnswers}</div>
              <div className="text-green-300 text-sm">✅ CORRECT</div>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-3 border border-purple-500/30 text-center">
              <div className="text-2xl font-bold text-purple-400">{combo}</div>
              <div className="text-purple-300 text-sm">🔥 COMBO</div>
            </div>
            <div className="bg-yellow-500/20 rounded-xl p-3 border border-yellow-500/30 text-center">
              <div className={`text-2xl font-bold ${speedLevel.color}`}>{questionsPerMinute}</div>
              <div className="text-yellow-300 text-sm">⚡ Q/MIN</div>
            </div>
          </div>

          {/* Speed Level & Combo */}
          <div className="flex justify-between items-center mb-4">
            <div className={`font-bold ${speedLevel.color}`}>
              {speedLevel.level}
            </div>
            {combo > 0 && (
              <div className="text-center">
                <div className="text-orange-400 font-bold animate-bounce">
                  {getComboMessage()}
                </div>
                <div className="text-sm text-gray-400">
                  Max Combo: {maxCombo}
                </div>
              </div>
            )}
          </div>

          {/* Progress Info */}
          <div className="text-center text-gray-300">
            <span className="font-bold">Question {currentQuestionIndex + 1}</span> • 
            <span className="ml-2">{questions.length - currentQuestionIndex - 1} remaining</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 ${
            combo >= 5 ? 'border-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse' :
            combo >= 3 ? 'border-orange-500 shadow-lg shadow-orange-500/30' :
            'border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-400' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-gray-400 text-sm uppercase tracking-wide">
                  {getDifficultyName(currentQuestion.difficulty)}
                </span>
              </div>
              <div className="text-yellow-400 font-bold">
                💎 {currentQuestion.points}pts
                {combo > 0 && (
                  <span className="text-orange-400 ml-2">
                    +{Math.floor(currentQuestion.points * (Math.min(combo, 5) * 0.2))}
                  </span>
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
            
            <QuestionRenderer 
              question={currentQuestion}
              onAnswer={handleAnswer}
              disabled={false}
              showResult={false}
            />
          </div>
        </div>

        {/* Speed Bonus Popup */}
        {showSpeedBonus && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-xl animate-bounce shadow-2xl">
              ⚡ SPEED BONUS! +{Math.floor(currentQuestion.points * (Math.min(combo, 5) * 0.2))} pts! ⚡
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Random Quiz Game - โหมดทบทวนแบบสุ่ม
function RandomQuizGame({ onGameFinish }: { onGameFinish: (result: GameResult, answers: Record<string, any>, questionTimes: Record<string, number>) => void }) {
  const [questions] = useState(() => getQuestionsForMode('random-quiz'));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [learningStreak, setLearningStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [showMasteryBonus, setShowMasteryBonus] = useState(false);
  const [difficultyProgress, setDifficultyProgress] = useState({ easy: 0, medium: 0, hard: 0 });
  const [topicMastery, setTopicMastery] = useState<{[key: string]: number}>({});
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(0.5); // 0=easy, 1=hard
  const [showLearningTip, setShowLearningTip] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Calculate mastery metrics
  useEffect(() => {
    const easyCnt = questions.slice(0, currentQuestionIndex).filter(q => q.difficulty === 'easy').length;
    const mediumCnt = questions.slice(0, currentQuestionIndex).filter(q => q.difficulty === 'medium').length;
    const hardCnt = questions.slice(0, currentQuestionIndex).filter(q => q.difficulty === 'hard').length;
    
    setDifficultyProgress({
      easy: easyCnt,
      medium: mediumCnt,
      hard: hardCnt
    });

    // Update topic mastery
    const topicCounts: {[key: string]: number} = {};
    questions.slice(0, currentQuestionIndex).forEach(q => {
      topicCounts[q.category] = (topicCounts[q.category] || 0) + 1;
    });
    setTopicMastery(topicCounts);

    // Calculate overall mastery level
    const totalMastery = Math.min(100, Math.round((correctAnswers / Math.max(1, currentQuestionIndex)) * 100));
    setMasteryLevel(totalMastery);
  }, [currentQuestionIndex, correctAnswers, questions]);

  const handleAnswer = (answer: any) => {
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = checkAnswer(currentQuestion, answer);
    
    // บันทึก answer และเวลาที่ใช้
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setQuestionTimes(prev => ({ ...prev, [currentQuestion.id]: timeSpent }));
    
    setUserAnswer(answer);
    setShowResult(true);

    if (isCorrect) {
      const basePoints = currentQuestion.points;
      const difficultyMultiplier = currentQuestion.difficulty === 'hard' ? 1.5 : 
                                   currentQuestion.difficulty === 'medium' ? 1.2 : 1.0;
      const streakBonus = Math.min(learningStreak * 2, 20);
      const masteryBonus = masteryLevel >= 80 ? 10 : masteryLevel >= 60 ? 5 : 0;
      
      const totalPoints = Math.round(basePoints * difficultyMultiplier + streakBonus + masteryBonus);
      
      setScore(prev => prev + totalPoints);
      setCorrectAnswers(prev => prev + 1);
      setLearningStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });

      // Adaptive difficulty adjustment
      setAdaptiveDifficulty(prev => Math.min(1, prev + 0.05));

      if (masteryBonus > 0) {
        setShowMasteryBonus(true);
        setTimeout(() => setShowMasteryBonus(false), 2000);
      }
    } else {
      setLearningStreak(0);
      setAdaptiveDifficulty(prev => Math.max(0, prev - 0.1));
      setShowLearningTip(true);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setUserAnswer(null);
    setShowLearningTip(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now()); // Reset timer for next question
    } else {
      // Game finished
      const result: GameResult = {
        score,
        correctAnswers,
        totalQuestions: questions.length,
        percentage: Math.round((correctAnswers / questions.length) * 100),
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        bonusPoints: learningStreak * 2,
        gameMode: 'random-quiz',
        breakdown: []
      };
      onGameFinish(result, answers, questionTimes);
    }
  };

  const getMasteryColor = () => {
    if (masteryLevel >= 90) return "text-purple-400";
    if (masteryLevel >= 80) return "text-blue-400";
    if (masteryLevel >= 70) return "text-green-400";
    if (masteryLevel >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getMasteryTitle = () => {
    if (masteryLevel >= 90) return "🧠 GENIUS";
    if (masteryLevel >= 80) return "🎓 EXPERT";
    if (masteryLevel >= 70) return "⭐ SCHOLAR";
    if (masteryLevel >= 60) return "📚 STUDENT";
    return "🌱 LEARNER";
  };

  const getStreakMessage = () => {
    if (learningStreak >= 10) return "🚀 KNOWLEDGE MASTER!";
    if (learningStreak >= 7) return "🔥 LEARNING MACHINE!";
    if (learningStreak >= 5) return "⚡ BRAIN POWER!";
    if (learningStreak >= 3) return "💡 ON A ROLL!";
    return "";
  };

  const getDifficultyRecommendation = () => {
    if (adaptiveDifficulty >= 0.8) return "💪 Try harder questions!";
    if (adaptiveDifficulty >= 0.6) return "📈 You're improving!";
    if (adaptiveDifficulty >= 0.4) return "🎯 Finding your level...";
    return "🌟 Building confidence!";
  };

  const getLearningTip = () => {
    const tips = [
      "💡 Take your time to read the question carefully",
      "🧠 Think about what you already know about this topic",
      "📚 Consider reviewing this topic later",
      "🎯 Focus on understanding the concept, not just memorizing",
      "⭐ Every mistake is a learning opportunity!"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <Navbar />
      
      {/* Background Learning Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {learningStreak >= 5 && (
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent animate-pulse"></div>
        )}
        
        {/* Knowledge particles */}
        {masteryLevel >= 70 && (
          <>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Learning Dashboard */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Mastery Level */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getMasteryColor()}`}>{masteryLevel}%</div>
                <div className={`font-bold ${getMasteryColor()}`}>{getMasteryTitle()}</div>
                <div className="text-gray-300 text-sm">Mastery Level</div>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{learningStreak}</div>
                <div className="text-orange-300 font-bold text-sm">🔥 STREAK</div>
                <div className="text-gray-300 text-sm">Max: {maxStreak}</div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{currentQuestionIndex + 1}</div>
                <div className="text-green-300 font-bold text-sm">OF {questions.length}</div>
                <div className="text-gray-300 text-sm">Questions</div>
              </div>
            </div>
          </div>

          {/* Difficulty Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4">
            <div className="text-white font-bold mb-3">📊 Knowledge Areas</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{difficultyProgress.easy}</div>
                <div className="text-green-300 text-sm">🟢 Easy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{difficultyProgress.medium}</div>
                <div className="text-yellow-300 text-sm">🟡 Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{difficultyProgress.hard}</div>
                <div className="text-red-300 text-sm">🔴 Hard</div>
              </div>
            </div>
          </div>

          {/* Adaptive Learning Status */}
          <div className="text-center mb-4">
            {learningStreak > 0 && (
              <div className="text-orange-400 font-bold animate-pulse mb-2">
                {getStreakMessage()}
              </div>
            )}
            <div className="text-purple-300 font-medium">
              {getDifficultyRecommendation()}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 ${
            learningStreak >= 7 ? 'border-purple-500 shadow-lg shadow-purple-500/50' :
            learningStreak >= 5 ? 'border-blue-500 shadow-lg shadow-blue-500/30' :
            learningStreak >= 3 ? 'border-green-500 shadow-lg shadow-green-500/30' :
            'border-white/20'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-400' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-gray-400 text-sm uppercase tracking-wide">
                  {getDifficultyName(currentQuestion.difficulty)}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">
                  {getCategoryName(currentQuestion.category)}
                </span>
              </div>
              <div className="text-blue-400 font-bold">
                📖 {currentQuestion.points}pts
                {learningStreak > 0 && (
                  <span className="text-orange-400 ml-2">
                    +{Math.min(learningStreak * 2, 20)} streak
                  </span>
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
            
            <QuestionRenderer 
              question={currentQuestion}
              onAnswer={handleAnswer}
              disabled={showResult}
              showResult={showResult}
              userAnswer={userAnswer}
            />

            {showResult && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex justify-between items-center">
                  {showLearningTip && (
                    <div className="text-blue-300 italic flex-1 mr-4">
                      {getLearningTip()}
                    </div>
                  )}
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Continue Learning 📚' : 'View Results 🎯'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mastery Bonus Popup */}
        {showMasteryBonus && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-xl animate-bounce shadow-2xl">
              🧠 MASTERY BONUS! +{masteryLevel >= 80 ? 10 : 5} pts! 🧠
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component
function GameLoadingComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Brain className="text-blue-400 animate-pulse mx-auto mb-4" size={64} />
          <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 border-t-blue-400"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">กำลังเตรียมเกม...</h2>
        <p className="text-gray-400">รอสักครู่นะ</p>
      </div>
    </div>
  );
}

// Game Instructions Component
function GameInstructions({ gameId, onStart }: { gameId: string; onStart: () => void }) {
  const game = miniGames.find(g => g.id === gameId);
  
  const getInstructions = () => {
    switch (gameId) {
      case 'score-challenge':
        return {
          title: 'โหมดสะสมคะแนน',
          icon: <Trophy className="w-12 h-12 text-yellow-400" />,
          description: 'ตอบคำถามหลากหลายประเภทเพื่อสะสมคะแนน',
          rules: [
            '📝 คำถาม 15 ข้อ จากหลายประเภท',
            '🏆 ได้คะแนนจากความถูกต้อง',
            '⚡ ตอบเร็วได้โบนัสพิเศษ',
            '🎯 เป้าหมาย: คะแนนสูงสุด'
          ],
          tips: [
            'อ่านคำถามให้ละเอียด',
            'ตอบเร็วเพื่อได้โบนัส',
            'ใช้เวลาคิดในข้อยาก'
          ]
        };
      case 'time-rush':
        return {
          title: 'โหมดท้าทายเวลา',
          icon: <Clock className="w-12 h-12 text-red-400" />,
          description: 'ตอบคำถามให้ได้มากที่สุดใน 60 วินาที',
          rules: [
            '⏱️ เวลา 60 วินาที',
            '🚀 คำถามทีละข้อ',
            '❌ ตอบผิดข้ามไปทันที',
            '🏃‍♂️ เป้าหมาย: คำตอบมากสุด'
          ],
          tips: [
            'ตอบด้วยสัญชาตญาณ',
            'อย่าเสียเวลาคิดนาน',
            'เน้นความเร็ว'
          ]
        };
      case 'random-quiz':
        return {
          title: 'โหมดทบทวนแบบสุ่ม',
          icon: <Target className="w-12 h-12 text-green-400" />,
          description: 'คำถามสุ่มจากทุกบทเรียน',
          rules: [
            '🎲 คำถาม 12 ข้อ แบบสุ่ม',
            '📚 จากทุกหัวข้อ',
            '🧠 หลากหลายรูปแบบ',
            '📊 เน้นความเข้าใจ'
          ],
          tips: [
            'ทบทวนความรู้ทั้งหมด',
            'อ่านคำอธิบายเมื่อผิด',
            'เน้นการเรียนรู้'
          ]
        };
      default:
        return null;
    }
  };

  const instructions = getInstructions();
  if (!instructions || !game) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/mini-game" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            กลับไปเลือกเกม
          </Link>

          {/* Game Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              {instructions.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              {instructions.title}
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              {instructions.description}
            </p>
          </div>

          {/* Game Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Game Rules */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="text-yellow-400" size={24} />
                  กติกาการเล่น
                </h3>
                <div className="space-y-3">
                  {instructions.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-blue-400 text-sm mt-1">•</div>
                      <span className="text-gray-300">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Tips */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="text-purple-400" size={24} />
                  เคล็ดลับ
                </h3>
                <div className="space-y-3">
                  {instructions.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-purple-400 text-sm mt-1">💡</div>
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{game.estimatedTime}</div>
                  <div className="text-gray-400 text-sm">เวลาโดยประมาณ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{game.points}</div>
                  <div className="text-gray-400 text-sm">คะแนนสูงสุด</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{game.difficulty}</div>
                  <div className="text-gray-400 text-sm">ความยาก</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">⭐ 4.8</div>
                  <div className="text-gray-400 text-sm">คะแนนเฉลี่ย</div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-xl px-12 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25"
            >
              <Play size={24} />
              เริ่มเล่นเลย!
            </button>
            <p className="text-gray-400 mt-4">คลิกเพื่อเริ่มการผจญภัย</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Game Result Component  
function GameResult({ result, gameId, onRestart, onBackToMenu }: {
  result: GameResult;
  gameId: string;
  onRestart: () => void;
  onBackToMenu: () => void;
}) {
  const game = miniGames.find(g => g.id === gameId);
  const isExcellent = result.percentage >= 90;
  const isGood = result.percentage >= 70;
  const isPassed = result.percentage >= 60;

  const getPerformanceMessage = () => {
    if (isExcellent) return { message: "ยอดเยี่ยม! 🌟", color: "text-yellow-400" };
    if (isGood) return { message: "ดีมาก! 🎉", color: "text-green-400" };
    if (isPassed) return { message: "ผ่านแล้ว! ✨", color: "text-blue-400" };
    return { message: "ลองใหม่นะ! 💪", color: "text-orange-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Result Header */}
          <div className="mb-12">
            <div className="text-6xl mb-4">
              {isExcellent ? "🏆" : isGood ? "🎉" : isPassed ? "✨" : "💪"}
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${performance.color}`}>
              {performance.message}
            </h1>
            <p className="text-gray-300 text-xl">
              คุณทำ{game?.title}เสร็จแล้ว!
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{result.score}</div>
                <div className="text-gray-400">คะแนนรวม</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{result.percentage}%</div>
                <div className="text-gray-400">เปอร์เซ็นต์</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-gray-400">ตอบถูก</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{Math.round(result.timeSpent)}s</div>
                <div className="text-gray-400">เวลาที่ใช้</div>
              </div>
            </div>

            {/* Bonus Points */}
            {result.bonusPoints > 0 && (
              <div className="bg-yellow-500/20 rounded-2xl p-6 border border-yellow-500/30 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Zap className="text-yellow-400" size={24} />
                  <span className="text-yellow-400 font-bold text-lg">คะแนนโบนัส!</span>
                </div>
                <div className="text-3xl font-bold text-yellow-400">+{result.bonusPoints}</div>
                <div className="text-yellow-200 text-sm">จากการตอบเร็ว</div>
              </div>
            )}

            {/* Performance Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>ผลการทำ</span>
                <span>{result.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    isExcellent ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                    isGood ? 'bg-gradient-to-r from-green-400 to-blue-400' :
                    isPassed ? 'bg-gradient-to-r from-blue-400 to-purple-400' :
                    'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300"
            >
              <RotateCcw size={20} />
              เล่นอีกครั้ง
            </button>
            
            <button
              onClick={onBackToMenu}
              className="inline-flex items-center gap-3 bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <ArrowLeft size={20} />
              กลับเมนู
            </button>
          </div>

          {/* Encouragement Message */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
            <p className="text-gray-300">
              {isExcellent ? 
                "สุดยอด! คุณเป็นผู้เชี่ยวชาญดาราศาสตร์แล้ว! 🌟" :
                isGood ?
                "เก่งมาก! ความรู้ของคุณดีแล้ว ลองโหมดอื่นดูสิ! 🚀" :
                isPassed ?
                "ดีแล้ว! ฝึกฝนเพิ่มเติมเพื่อให้เก่งขึ้น! 📚" :
                "ไม่เป็นไร! ลองเล่นใหม่และอ่านคำอธิบายให้ดี! 💪"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Game Page Component
export default function MiniGamePlayPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'finished'>('instructions');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameFinish = (result: GameResult, answers: Record<string, any> = {}, questionTimes: Record<string, number> = {}) => {
    // บันทึก progress ด้วย MiniGameProgressHelper
    MiniGameProgressHelper.saveGameResult(gameId, result.gameMode, result, answers, questionTimes);
    
    // Dispatch event to update progress in other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('progressUpdated'));
    }
    
    setGameResult(result);
    setGameState('finished');
  };

  const handleRestart = () => {
    setGameResult(null);
    setGameState('instructions');
  };

  const handleBackToMenu = () => {
    router.push('/mini-game');
  };

  if (isLoading) {
    return <GameLoadingComponent />;
  }

  // Check if game exists
  const game = miniGames.find(g => g.id === gameId);
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">ไม่พบเกม</h1>
          <Link href="/mini-game" className="text-blue-400 hover:text-blue-300">
            กลับไปเลือกเกม
          </Link>
        </div>
      </div>
    );
  }

  // Show instructions
  if (gameState === 'instructions') {
    return <GameInstructions gameId={gameId} onStart={handleStartGame} />;
  }

  // Show game result
  if (gameState === 'finished' && gameResult) {
    return (
      <GameResultComponent 
        result={gameResult} 
        gameId={gameId}
        onRestart={handleRestart}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Show game component based on gameId
  const renderGame = () => {
    switch (gameId) {
      case 'score-challenge':
        return <ScoreChallengeGame onGameFinish={handleGameFinish} />;
      case 'time-rush':
        return <TimeRushGame onGameFinish={handleGameFinish} />;
      case 'random-quiz':
        return <RandomQuizGame onGameFinish={handleGameFinish} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">เกมนี้ยังไม่พร้อม</h1>
              <Link href="/mini-game" className="text-blue-400 hover:text-blue-300">
                กลับไปเลือกเกม
              </Link>
            </div>
          </div>
        );
    }
  };

  return renderGame();
}
