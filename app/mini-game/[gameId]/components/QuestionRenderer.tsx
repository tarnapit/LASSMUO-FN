"use client";
import { useState, useEffect } from "react";
import { MiniGameQuestion } from "../../../types/mini-game";
import DragDropOrderingQuestion from "./DragDropOrderingQuestion";
import EnhancedMatchingQuestion from "./EnhancedMatchingQuestion";

interface QuestionRendererProps {
  question: MiniGameQuestion;
  onAnswer: (answer: any) => void;
  disabled?: boolean;
  showResult?: boolean;
  userAnswer?: any;
}

export default function QuestionRenderer({ 
  question, 
  onAnswer, 
  disabled = false, 
  showResult = false,
  userAnswer 
}: QuestionRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setFillBlankAnswer("");
  }, [question.id]);

  const handleMultipleChoice = (index: number) => {
    if (disabled) return;
    setSelectedAnswer(index);
    onAnswer(index);
  };

  const handleTrueFalse = (answer: boolean) => {
    if (disabled) return;
    const stringAnswer = answer.toString();
    setSelectedAnswer(stringAnswer);
    onAnswer(stringAnswer);
  };

  const handleFillBlank = () => {
    if (disabled || !fillBlankAnswer.trim()) return;
    onAnswer(fillBlankAnswer.trim());
  };

  const isCorrectAnswer = (userAnswer: any, questionData: MiniGameQuestion): boolean => {
    switch (questionData.type) {
      case 'multiple-choice':
        return userAnswer === questionData.correctAnswer;
      
      case 'true-false':
        return String(userAnswer) === String(questionData.correctAnswer);
      
      case 'fill-blank':
        if (Array.isArray(questionData.blanks)) {
          return questionData.blanks.some(blank => 
            String(userAnswer).toLowerCase().includes(blank.toLowerCase())
          );
        }
        return String(userAnswer).toLowerCase() === String(questionData.correctAnswer).toLowerCase();
      
      default:
        return false;
    }
  };

  switch (question.type) {
    case 'multiple-choice':
      return (
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            let buttonStyle = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
            
            if (showResult) {
              if (index === question.correctAnswer) {
                buttonStyle += "bg-green-500/20 border-green-500 text-green-300";
              } else if (selectedAnswer === index) {
                buttonStyle += "bg-red-500/20 border-red-500 text-red-300";
              } else {
                buttonStyle += "bg-gray-500/20 border-gray-500 text-gray-400";
              }
            } else {
              if (selectedAnswer === index) {
                buttonStyle += "bg-blue-500/20 border-blue-500 text-blue-300";
              } else {
                buttonStyle += "bg-white/10 border-gray-600 text-white hover:border-blue-400 hover:bg-blue-500/10";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleMultipleChoice(index)}
                disabled={disabled}
                className={buttonStyle}
              >
                {option}
              </button>
            );
          })}
        </div>
      );

    case 'true-false':
      return (
        <div className="flex gap-4 justify-center">
          {[
            { value: true, label: "ถูกต้อง", color: "green" },
            { value: false, label: "ไม่ถูกต้อง", color: "red" }
          ].map((option) => {
            let buttonStyle = "px-8 py-4 rounded-xl border-2 transition-all duration-200 font-bold ";
            
            if (showResult) {
              if (option.value.toString() === question.correctAnswer) {
                buttonStyle += `bg-green-500/20 border-green-500 text-green-300`;
              } else if (selectedAnswer === option.value.toString()) {
                buttonStyle += `bg-red-500/20 border-red-500 text-red-300`;
              } else {
                buttonStyle += "bg-gray-500/20 border-gray-500 text-gray-400";
              }
            } else {
              if (selectedAnswer === option.value.toString()) {
                buttonStyle += `bg-${option.color}-500/20 border-${option.color}-500 text-${option.color}-300`;
              } else {
                buttonStyle += `bg-white/10 border-gray-600 text-white hover:border-${option.color}-400 hover:bg-${option.color}-500/10`;
              }
            }

            return (
              <button
                key={option.value.toString()}
                onClick={() => handleTrueFalse(option.value)}
                disabled={disabled}
                className={buttonStyle}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );

    case 'fill-blank':
      return (
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={fillBlankAnswer}
              onChange={(e) => setFillBlankAnswer(e.target.value)}
              placeholder="พิมพ์คำตอบ..."
              disabled={disabled || showResult}
              className="flex-1 p-4 rounded-xl bg-white/10 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none disabled:bg-gray-600/50"
            />
            {!showResult && (
              <button
                onClick={handleFillBlank}
                disabled={disabled || !fillBlankAnswer.trim()}
                className="px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-xl transition-all duration-200"
              >
                ตอบ
              </button>
            )}
          </div>
          {showResult && (
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-gray-300">
                  คำตอบของคุณ: <span className={`font-bold ${
                    isCorrectAnswer(fillBlankAnswer, question) ? 'text-green-400' : 'text-red-400'
                  }`}>{fillBlankAnswer || 'ไม่ได้ตอบ'}</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-300">
                  คำตอบที่ถูกต้อง: <span className="text-green-400 font-bold">{question.correctAnswer}</span>
                </p>
              </div>
              {question.blanks && question.blanks.length > 1 && (
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    คำตอบที่ยอมรับ: {question.blanks.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      );

    case 'matching':
      // Convert the simple pairs format to enhanced format for the new component
      const enhancedPairs = question.pairs?.map((pair, index) => ({
        left: { 
          id: typeof pair.left === 'string' ? pair.left : pair.left, // ใช้ text เป็น id
          text: typeof pair.left === 'string' ? pair.left : pair.left,
          emoji: undefined 
        },
        right: { 
          id: typeof pair.right === 'string' ? pair.right : pair.right, // ใช้ text เป็น id
          text: typeof pair.right === 'string' ? pair.right : pair.right,
          emoji: undefined 
        }
      })) || [];

      return (
        <EnhancedMatchingQuestion
          question={question.question}
          pairs={enhancedPairs}
          onAnswer={onAnswer}
          showResult={showResult}
          userAnswer={userAnswer}
          disabled={disabled}
        />
      );

    case 'ordering':
      if (!question.items || !question.correctAnswer) {
        return <div className="text-gray-400">ข้อมูลคำถามไม่ครบถ้วน</div>;
      }

      return (
        <DragDropOrderingQuestion
          question={question.question}
          items={question.items}
          correctOrder={question.correctAnswer as string[]}
          onAnswer={onAnswer}
          showResult={showResult}
          userAnswer={userAnswer}
          disabled={disabled}
        />
      );

    default:
      return <div className="text-gray-400">ประเภทคำถามไม่รองรับ</div>;
  }
}
