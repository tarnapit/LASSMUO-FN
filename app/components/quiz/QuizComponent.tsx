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
import { AlertCircle } from "lucide-react";

interface EnhancedQuizComponentProps {
  questions: Question[];
  onComplete: (score: number) => void;
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
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
      onComplete(score);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
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
        onComplete(score);
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

    switch (currentQuestion.type) {
      case 'multiple-choice':
        if ('answers' in currentQuestion && currentQuestion.answers) {
          return (
            <MultipleChoiceQuestion
              question={currentQuestion.question}
              answers={currentQuestion.answers}
              onAnswer={(answerId, isCorrect) => handleAnswer(answerId, isCorrect)}
              selectedAnswer={selectedAnswer as number}
              {...questionProps}
            />
          );
        }
        break;

      case 'true-false':
        return (
          <TrueFalseQuestion
            question={currentQuestion.question}
            correctAnswer={currentQuestion.correctAnswer}
            onAnswer={(answer, isCorrect) => handleAnswer(answer, isCorrect)}
            selectedAnswer={selectedAnswer as boolean}
            {...questionProps}
          />
        );

      case 'drag-drop':
        if ('dragItems' in currentQuestion && 'dropZones' in currentQuestion) {
          return (
            <EnhancedDragDropQuestion
              dragItems={currentQuestion.dragItems}
              dropZones={currentQuestion.dropZones}
              onAnswer={(isCorrect: boolean, userAnswer: any) => handleAnswer(userAnswer, isCorrect)}
              showResult={showResult}
              userAnswer={userAnswers[currentQuestionIndex]}
              question={currentQuestion.question}
            />
          );
        }
        break;

      case 'fill-blank':
        if ('correctAnswer' in currentQuestion) {
          return (
            <EnhancedFillBlankQuestion
              question={currentQuestion.question}
              correctAnswer={currentQuestion.correctAnswer}
              alternatives={currentQuestion.alternatives}
              placeholder={currentQuestion.placeholder || "พิมพ์คำตอบ..."}
              hints={currentQuestion.hints}
              onAnswer={(isCorrect: boolean, userAnswer: any) => handleAnswer(userAnswer, isCorrect)}
              showResult={showResult}
              userAnswer={userAnswers[currentQuestionIndex]}
            />
          );
        }
        break;

      case 'match-pairs':
        if ('pairs' in currentQuestion) {
          return (
            <EnhancedMatchPairsQuestion
              pairs={currentQuestion.pairs}
              onAnswer={(isCorrect: boolean, userAnswer: any) => handleAnswer(userAnswer, isCorrect)}
              showResult={showResult}
              userAnswer={userAnswers[currentQuestionIndex]}
              question={currentQuestion.question}
            />
          );
        }
        break;

      default:
        return (
          <div className="flex flex-col items-center justify-center text-white text-center">
            <AlertCircle className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">ประเภทคำถามไม่รองรับ</h2>
            <p className="text-gray-300">
              ประเภทคำถาม &quot;{(currentQuestion as any).type}&quot; ยังไม่ได้รับการพัฒนา
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
