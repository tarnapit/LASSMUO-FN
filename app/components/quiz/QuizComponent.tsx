"use client";
import { useState, useEffect } from "react";
import { Question } from "../../types/stage";
import QuizHeader from "./QuizHeader";
import QuizFeedback from "./QuizFeedback";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import EnhancedDragDropQuestion from "./DragDropQuestion";
import EnhancedFillBlankQuestion from "./FillBlankQuestion";
import EnhancedMatchPairsQuestion from "./MatchPairsQuestion";
import ImageIdentificationQuestion from "./ImageIdentificationQuestion";
import SentenceReorderingQuestion from "./SentenceReorderingQuestion";
import RangeAnswerQuestion from "./RangeAnswerQuestion";
import { AlertCircle } from "lucide-react";

interface EnhancedQuizComponentProps {
  questions: Question[];
  onComplete: (results: {
    score: number;
    totalQuestions: number;
    time: string;
    answers: boolean[];
    percentage: number;
  }) => void;
  onExit?: () => void;
}

export default function EnhancedQuizComponent({ 
  questions, 
  onComplete,
  onExit 
}: EnhancedQuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [isExiting, setIsExiting] = useState(false);
  const [startTime] = useState(Date.now());
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const calculateTime = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const createResults = () => {
    const percentage = (score / questions.length) * 100;
    return {
      score,
      totalQuestions: questions.length,
      time: calculateTime(),
      answers,
      percentage
    };
  };

  // Effect to ensure clean state when moving to a new question
  useEffect(() => {
    // Don't clear on the first question or when showing result
    if (currentQuestionIndex > 0 && !showResult) {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, showResult]);

  // Handle different answer types
  const handleAnswer = (answer: any, isCorrect: boolean) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    // Store user answer
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      // Reduce lives for incorrect answers
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  const handleContinue = () => {
    if (isLastQuestion) {
      onComplete(createResults());
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      
      // Clear user answer for the next question to ensure clean state
      // This is especially important for drag-drop and other interactive questions
      const nextQuestionIndex = currentQuestionIndex + 1;
      setUserAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[nextQuestionIndex];
        return newAnswers;
      });
    }
  };

  const handleExit = () => {
    if (onExit) {
      setIsExiting(true);
      onExit();
    }
  };

  // Check if player has run out of lives
  useEffect(() => {
    if (lives === 0 && showResult) {
      // Game over - complete with current score
      const timer = setTimeout(() => {
        onComplete(createResults());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lives, showResult, score, onComplete]);

  const renderQuestionContent = () => {
    if (!currentQuestion) {
      return (
        <div className="flex flex-col items-center justify-center text-white text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">ไม่พบคำถาม</h2>
          <p className="text-gray-300">เกิดข้อผิดพลาดในการโหลดคำถาม</p>
        </div>
      );
    }

    const questionProps = {
      showResult,
      disabled: isExiting
    };

    const questionType = currentQuestion.type as string;
    
    switch (questionType) {
      case 'MULTIPLE_CHOICE':
      case 'multiple-choice':
        const mcQuestion = currentQuestion as any;
        
        // Handle different payload formats
        let options = null;
        
        // API format: payload is array directly
        if (Array.isArray(mcQuestion.payload)) {
          options = mcQuestion.payload;
        }
        // API format: payload.options
        else if (mcQuestion.payload?.options) {
          options = mcQuestion.payload.options;
        }
        // Mock data format: answers
        else if (mcQuestion.answers) {
          options = mcQuestion.answers;
        }
        
        if (options && Array.isArray(options)) {
          return (
            <MultipleChoiceQuestion
              question={mcQuestion.question}
              answers={options.map((opt: any, index: number) => ({
                id: index,
                text: opt.text,
                isCorrect: opt.isCorrect
              }))}
              onAnswer={(answerId, isCorrect) => {
                // Find correct answer index
                const correctAnswerId = options.findIndex((opt: any) => opt.isCorrect);
                const isAnswerCorrect = answerId === correctAnswerId;
                handleAnswer(answerId, isAnswerCorrect);
              }}
              selectedAnswer={selectedAnswer as number}
              {...questionProps}
            />
          );
        }
        
        break;

      case 'TRUE_FALSE':
        const tfQuestion = currentQuestion as any;
        return (
          <TrueFalseQuestion
            question={tfQuestion.question}
            correctAnswer={tfQuestion.payload?.correctAnswer}
            onAnswer={(answer, isCorrect) => handleAnswer(answer, isCorrect)}
            selectedAnswer={selectedAnswer as boolean}
            {...questionProps}
          />
        );

      case 'DRAG_DROP':
        const ddQuestion = currentQuestion as any;
        if (ddQuestion.payload?.dragItems && ddQuestion.payload?.dropZones) {
          return (
            <EnhancedDragDropQuestion
              dragItems={ddQuestion.payload.dragItems}
              dropZones={ddQuestion.payload.dropZones}
              onAnswer={(isCorrect: boolean, userAnswer: any) => handleAnswer(userAnswer, isCorrect)}
              showResult={showResult}
              userAnswer={userAnswers[currentQuestionIndex]}
              question={ddQuestion.question}
            />
          );
        }
        break;

      case 'FILL_BLANK':
        const fbQuestion = currentQuestion as any;
        if (fbQuestion.payload?.correctAnswer) {
          return (
            <EnhancedFillBlankQuestion
              question={fbQuestion.question}
              correctAnswer={fbQuestion.payload.correctAnswer}
              alternatives={fbQuestion.payload.alternatives}
              placeholder={fbQuestion.payload.placeholder || "พิมพ์คำตอบ..."}
              hints={fbQuestion.payload.hints}
              onAnswer={(isCorrect: boolean, userAnswer: any) => handleAnswer(userAnswer, isCorrect)}
              showResult={showResult}
              userAnswer={userAnswers[currentQuestionIndex]}
            />
          );
        }
        break;

      case 'MATCHING':
        const matchQuestion = currentQuestion as any;
        if (matchQuestion.payload?.pairs) {
          return (
            <EnhancedMatchPairsQuestion
              pairs={matchQuestion.payload.pairs}
              onAnswer={(isCorrect: boolean, userAnswer: any) => handleAnswer(userAnswer, isCorrect)}
              showResult={showResult}
              userAnswer={userAnswers[currentQuestionIndex]}
              question={matchQuestion.question}
            />
          );
        }
        break;

      default:
        console.warn('🚨 Unsupported question type:', questionType, 'Question data:', currentQuestion);
        return (
          <div className="flex flex-col items-center justify-center text-white text-center">
            <AlertCircle className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">ประเภทคำถามไม่รองรับ</h2>
            <p className="text-gray-300">
              ประเภทคำถาม &quot;{questionType}&quot; ยังไม่ได้รับการพัฒนา
            </p>
            <p className="text-sm text-gray-400 mt-2">
              รูปแบบข้อมูล: {JSON.stringify(currentQuestion, null, 2).substring(0, 100)}...
            </p>
          </div>
        );
    }

    return (
      <div className="flex flex-col items-center justify-center text-white text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">ข้อมูลคำถามไม่ครบถ้วน</h2>
        <p className="text-gray-300">คำถามนี้ขาดข้อมูลที่จำเป็น</p>
      </div>
    );
  };

  const getExplanation = () => {
    if (!showResult || !currentQuestion) return undefined;
    
    // Return explanation based on question type and correctness
    const isCorrect = answers[answers.length - 1];
    
    if (isCorrect) {
      return currentQuestion.explanation || "ยอดเยี่ยม! คุณตอบถูกต้อง";
    } else {
      return currentQuestion.explanation || "ลองทบทวนเนื้อหาอีกครั้งนะ";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      {/* Quiz Header */}
      <QuizHeader
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
        lives={lives}
        onExit={handleExit}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          {renderQuestionContent()}
        </div>
      </div>

      {/* Game Over Message */}
      {lives === 0 && showResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="bg-red-600 text-white p-8 rounded-2xl text-center max-w-md">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold mb-4">หมดชีวิตแล้ว!</h2>
            <p className="mb-4">คุณตอบผิดมากเกินไป แต่ไม่เป็นไร ลองใหม่อีกครั้ง!</p>
            <p className="text-red-200">กำลังไปยังหน้าผลลัพธ์...</p>
          </div>
        </div>
      )}

      {/* Feedback */}
      <QuizFeedback
        isCorrect={answers[answers.length - 1] || false}
        showResult={showResult && lives > 0}
        explanation={getExplanation()}
        onContinue={handleContinue}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
}
