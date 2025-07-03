"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizById } from "../../data/quizzes";
import { learningModules } from "../../data/learning-modules";
import Navbar from "../../components/layout/Navbar";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Target,
  Brain
} from "lucide-react";
import { Quiz, QuizQuestion, QuizAttempt } from "../../types/quiz";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const foundQuiz = getQuizById(quizId);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      if (foundQuiz.timeLimit) {
        setTimeLeft(foundQuiz.timeLimit * 60); // แปลงเป็นวินาที
      }
      
      // โหลดประวัติการทำ quiz
      const savedProgress = localStorage.getItem(`quiz-progress-${quizId}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setPreviousAttempts(progress.attempts || []);
      }
    }
  }, [quizId]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, showResults]);

  const startQuiz = () => {
    setIsActive(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setShowExplanation({});
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = useCallback(() => {
    if (!quiz) return { score: 0, totalPoints: 0, percentage: 0 };
    
    let score = 0;
    let totalPoints = 0;

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          score += question.points;
        }
      } else if (question.type === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          score += question.points;
        }
      } else if (question.type === 'text') {
        // สำหรับข้อความ ต้องตรวจสอบแบบ case-insensitive
        const correctAnswer = (question.correctAnswer as string).toLowerCase().trim();
        const userAnswerText = (userAnswer as string || '').toLowerCase().trim();
        if (userAnswerText === correctAnswer) {
          score += question.points;
        }
      }
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    return { score, totalPoints, percentage };
  }, [quiz, answers]);

  const handleSubmitQuiz = () => {
    if (!quiz) return;

    const { score, totalPoints, percentage } = calculateScore();
    const passed = percentage >= quiz.passingScore;
    const attemptNumber = previousAttempts.length + 1;

    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      answers,
      score,
      totalPoints,
      percentage,
      passed,
      startedAt: new Date(Date.now() - (quiz.timeLimit ? quiz.timeLimit * 60 * 1000 - timeLeft * 1000 : 0)),
      completedAt: new Date(),
      timeSpent: quiz.timeLimit ? quiz.timeLimit * 60 - timeLeft : 0,
      attemptNumber
    };

    // บันทึกผลลพธ์
    const updatedAttempts = [...previousAttempts, newAttempt];
    const bestAttempt = updatedAttempts.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    );

    const quizProgress = {
      quizId: quiz.id,
      attempts: updatedAttempts,
      bestScore: bestAttempt.score,
      bestPercentage: bestAttempt.percentage,
      totalAttempts: updatedAttempts.length,
      passed: updatedAttempts.some(attempt => attempt.passed),
      lastAttemptAt: new Date()
    };

    localStorage.setItem(`quiz-progress-${quiz.id}`, JSON.stringify(quizProgress));

    setQuizAttempt(newAttempt);
    setPreviousAttempts(updatedAttempts);
    setIsActive(false);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsActive(false);
    setShowResults(false);
    setShowExplanation({});
    if (quiz?.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60);
    }
  };

  const toggleExplanation = (questionId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const canRetakeQuiz = () => {
    if (!quiz?.maxAttempts) return true;
    return previousAttempts.length < quiz.maxAttempts;
  };

  const getModuleTitle = () => {
    if (!quiz) return '';
    const module = learningModules.find(m => m.id === quiz.moduleId);
    return module?.title || 'Unknown Module';
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">ไม่พบแบบทดสอบ</h2>
          <button 
            onClick={() => router.push('/quiz')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            กลับไปหน้าแบบทดสอบ
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/quiz')}
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้าแบบทดสอบ
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2">{quiz.title}</h1>
          <p className="text-gray-300">บทเรียน: {getModuleTitle()}</p>
        </div>

        {!isActive && !showResults && (
          // Start Screen
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <Brain className="mx-auto text-blue-400 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-white mb-4">พร้อมเริ่มทำแบบทดสอบแล้วหรือยัง?</h2>
                <p className="text-gray-300">{quiz.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <Brain size={16} className="mr-2" />
                    จำนวนข้อ
                  </div>
                  <div className="text-2xl font-bold text-white">{quiz.questions.length} ข้อ</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <Clock size={16} className="mr-2" />
                    เวลา
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {quiz.timeLimit ? `${quiz.timeLimit} นาที` : 'ไม่จำกัด'}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <Target size={16} className="mr-2" />
                    คะแนนผ่าน
                  </div>
                  <div className="text-2xl font-bold text-white">{quiz.passingScore}%</div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <Trophy size={16} className="mr-2" />
                    คะแนนเต็ม
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {quiz.questions.reduce((sum, q) => sum + q.points, 0)} คะแนน
                  </div>
                </div>
              </div>

              {previousAttempts.length > 0 && (
                <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">ประวัติการทำแบบทดสอบ</h3>
                  <div className="text-sm text-blue-300">
                    ทำไปแล้ว: {previousAttempts.length} ครั้ง
                    <br />
                    คะแนนสูงสุด: {Math.max(...previousAttempts.map(a => a.percentage))}%
                    {previousAttempts.some(a => a.passed) && (
                      <span className="text-green-400 ml-2">✓ ผ่านแล้ว</span>
                    )}
                  </div>
                </div>
              )}

              {!canRetakeQuiz() ? (
                <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                  <XCircle className="mx-auto text-red-400 mb-2" size={48} />
                  <h3 className="text-lg font-semibold text-red-400 mb-2">หมดจำนวนครั้งในการทำแบบทดสอบ</h3>
                  <p className="text-red-300 text-sm">
                    คุณได้ทำแบบทดสอบครบ {quiz.maxAttempts} ครั้งแล้ว
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={startQuiz}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-lg font-semibold"
                  >
                    เริ่มทำแบบทดสอบ
                  </button>
                  {quiz.maxAttempts && (
                    <p className="text-gray-400 text-sm mt-2">
                      ทำได้สูงสุด {quiz.maxAttempts} ครั้ง (เหลือ {quiz.maxAttempts - previousAttempts.length} ครั้ง)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {isActive && !showResults && (
          // Quiz Interface
          <div className="max-w-4xl mx-auto">
            {/* Progress and Timer */}
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-white text-sm">
                  ข้อที่ {currentQuestionIndex + 1} จาก {quiz.questions.length}
                </span>
              </div>
              
              {quiz.timeLimit && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="flex items-center text-white">
                    <Clock size={16} className="mr-2" />
                    <span className={timeLeft < 300 ? 'text-red-400' : 'text-white'}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`}}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {currentQuestion.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      answers[currentQuestion.id] === index
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-semibold mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}

                {currentQuestion.type === 'true-false' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAnswerSelect(currentQuestion.id, 'true')}
                      className={`p-4 rounded-lg border transition-all ${
                        answers[currentQuestion.id] === 'true'
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <CheckCircle className="mx-auto mb-2" size={24} />
                      ถูก
                    </button>
                    <button
                      onClick={() => handleAnswerSelect(currentQuestion.id, 'false')}
                      className={`p-4 rounded-lg border transition-all ${
                        answers[currentQuestion.id] === 'false'
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <XCircle className="mx-auto mb-2" size={24} />
                      ผิด
                    </button>
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <input
                    type="text"
                    value={answers[currentQuestion.id] as string || ''}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    placeholder="พิมพ์คำตอบของคุณ..."
                    className="w-full p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              {/* Question Info */}
              <div className="mt-6 pt-4 border-t border-white/20 text-sm text-gray-400">
                <span>คะแนน: {currentQuestion.points} คะแนน</span>
                <span className="ml-4">ความยาก: {
                  currentQuestion.difficulty === 'easy' ? 'ง่าย' :
                  currentQuestion.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'
                }</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                ข้อก่อนหน้า
              </button>

              <div className="flex space-x-4">
                {isLastQuestion ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    ส่งคำตอบ
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    ข้อถัดไป
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="mt-8 bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">ข้อคำถาม</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : answers[quiz.questions[index].id] !== undefined
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showResults && quizAttempt && (
          // Results Screen
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              {quizAttempt.passed ? (
                <CheckCircle className="mx-auto text-green-400 mb-4" size={80} />
              ) : (
                <XCircle className="mx-auto text-red-400 mb-4" size={80} />
              )}
              
              <h2 className="text-4xl font-bold text-white mb-4">
                {quizAttempt.passed ? 'ยินดีด้วย! คุณผ่านแบบทดสอบแล้ว' : 'เสียใจด้วย คุณยังไม่ผ่านแบบทดสอบ'}
              </h2>
              
              <div className="text-6xl font-bold mb-4">
                <span className={quizAttempt.passed ? 'text-green-400' : 'text-red-400'}>
                  {quizAttempt.percentage}%
                </span>
              </div>
              
              <p className="text-gray-300 text-lg">
                คะแนนของคุณ: {quizAttempt.score} จาก {quizAttempt.totalPoints} คะแนน
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
                <Trophy className="mx-auto text-yellow-400 mb-2" size={32} />
                <div className="text-2xl font-bold text-white">{quizAttempt.score}</div>
                <div className="text-gray-400">คะแนนที่ได้</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
                <Target className="mx-auto text-blue-400 mb-2" size={32} />
                <div className="text-2xl font-bold text-white">{quizAttempt.percentage}%</div>
                <div className="text-gray-400">เปอร์เซ็นต์</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 text-center">
                <Clock className="mx-auto text-purple-400 mb-2" size={32} />
                <div className="text-2xl font-bold text-white">{formatTime(quizAttempt.timeSpent)}</div>
                <div className="text-gray-400">เวลาที่ใช้</div>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">ตรวจสอบคำตอบ</h3>
              
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = question.type === 'true-false' 
                    ? userAnswer === question.correctAnswer
                    : question.type === 'multiple-choice'
                    ? userAnswer === question.correctAnswer
                    : (userAnswer as string || '').toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim();

                  return (
                    <div key={question.id} className="border-b border-white/20 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white flex-1">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="flex items-center ml-4">
                          {isCorrect ? (
                            <CheckCircle className="text-green-400" size={24} />
                          ) : (
                            <XCircle className="text-red-400" size={24} />
                          )}
                          <span className="ml-2 text-gray-400">{question.points} คะแนน</span>
                        </div>
                      </div>

                      {question.type === 'multiple-choice' && (
                        <div className="space-y-2 mb-4">
                          {question.options?.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`p-3 rounded-lg ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                                  : optionIndex === userAnswer
                                  ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                                  : 'bg-white/5 text-gray-400'
                              }`}
                            >
                              <span className="font-semibold mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                              {optionIndex === question.correctAnswer && (
                                <span className="ml-2 text-green-400">✓ คำตอบที่ถูก</span>
                              )}
                              {optionIndex === userAnswer && optionIndex !== question.correctAnswer && (
                                <span className="ml-2 text-red-400">✗ คำตอบของคุณ</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <div className="mb-4">
                          <div className="text-gray-300">
                            คำตอบของคุณ: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                              {userAnswer === 'true' ? 'ถูก' : userAnswer === 'false' ? 'ผิด' : 'ไม่ได้ตอบ'}
                            </span>
                          </div>
                          <div className="text-gray-300">
                            คำตอบที่ถูก: <span className="text-green-400">
                              {question.correctAnswer === 'true' ? 'ถูก' : 'ผิด'}
                            </span>
                          </div>
                        </div>
                      )}

                      {question.type === 'text' && (
                        <div className="mb-4">
                          <div className="text-gray-300">
                            คำตอบของคุณ: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                              {userAnswer || 'ไม่ได้ตอบ'}
                            </span>
                          </div>
                          <div className="text-gray-300">
                            คำตอบที่ถูก: <span className="text-green-400">
                              {question.correctAnswer}
                            </span>
                          </div>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="mt-4">
                          <button
                            onClick={() => toggleExplanation(question.id)}
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <AlertCircle size={16} className="mr-2" />
                            คำอธิบาย
                          </button>
                          {showExplanation[question.id] && (
                            <div className="mt-2 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                              <p className="text-blue-200">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="text-center space-y-4">
              {canRetakeQuiz() && !quizAttempt.passed && (
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-lg font-semibold mr-4"
                >
                  <RotateCcw size={20} className="mr-2" />
                  ทำแบบทดสอบอีกครั้ง
                </button>
              )}
              
              <button
                onClick={() => router.push('/quiz')}
                className="inline-flex items-center px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-lg font-semibold"
              >
                <ArrowLeft size={20} className="mr-2" />
                กลับไปหน้าแบบทดสอบ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
