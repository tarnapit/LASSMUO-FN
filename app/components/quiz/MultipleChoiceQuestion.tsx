"use client";
import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

interface MultipleChoiceQuestionProps {
  question: string;
  answers: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
  }>;
  onAnswer: (answerId: number, isCorrect: boolean) => void;
  showResult: boolean;
  selectedAnswer: number | null;
  disabled?: boolean;
  hints?: string[];
  currentQuestionData?: any; // For accessing API data
}

export default function MultipleChoiceQuestion({
  question,
  answers,
  onAnswer,
  showResult,
  selectedAnswer,
  disabled = false,
  hints = [],
  currentQuestionData
}: MultipleChoiceQuestionProps) {
  const [hoveredAnswer, setHoveredAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Get hints from API data if available
  const availableHints = hints.length > 0 ? hints : (currentQuestionData?.hints || []);

  const handleAnswerClick = (answerId: number) => {
    if (showResult || disabled) return;
    
    const answer = answers.find(a => a.id === answerId);
    if (answer) {
      onAnswer(answerId, answer.isCorrect);
    }
  };

  const getAnswerStyle = (answerId: number) => {
    if (!showResult) {
      return `
        bg-white text-gray-900 border-2 border-gray-200 
        hover:border-blue-400 hover:bg-blue-50 
        transform transition-all duration-200 hover:scale-105
        ${hoveredAnswer === answerId ? 'shadow-lg' : 'shadow-md'}
      `;
    }
    
    const answer = answers.find(a => a.id === answerId);
    if (answer?.isCorrect) {
      return 'bg-green-500 text-white border-2 border-green-500 shadow-lg';
    } else if (selectedAnswer === answerId) {
      return 'bg-red-500 text-white border-2 border-red-500 shadow-lg';
    }
    return 'bg-gray-300 text-gray-500 border-2 border-gray-300';
  };

  const getNextHint = () => {
    if (currentHintIndex < availableHints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
    setShowHint(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Question */}
      <div className="mb-12">
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            {question}
          </h1>
        </div>

        {/* Visual Content Placeholder */}
        <div className="mb-8">
          <div className="w-full h-48 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl flex items-center justify-center border-2 border-purple-500/30">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🌟</div>
              <p className="text-lg">ภาพประกอบคำถาม</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => handleAnswerClick(answer.id)}
            onMouseEnter={() => setHoveredAnswer(answer.id)}
            onMouseLeave={() => setHoveredAnswer(null)}
            disabled={showResult || disabled}
            className={`
              p-6 rounded-xl font-semibold text-lg text-left
              min-h-[80px] flex items-center justify-center
              disabled:cursor-not-allowed
              ${getAnswerStyle(answer.id)}
            `}
          >
            <span className="text-center w-full">{answer.text}</span>
          </button>
        ))}
      </div>

      {/* Hint Button */}
      {availableHints.length > 0 && !showResult && (
        <div className="text-center">
          {!showHint ? (
            <button
              onClick={getNextHint}
              className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              title="ใบ้"
            >
              <Lightbulb className="w-5 h-5" />
              <span>ต้องการคำใบ้?</span>
            </button>
          ) : (
            <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">คำใบ้:</span>
              </div>
              <p className="text-white">{availableHints[currentHintIndex]}</p>
              {currentHintIndex < availableHints.length - 1 && (
                <button
                  onClick={getNextHint}
                  className="mt-2 text-yellow-300 hover:text-yellow-200 text-sm underline"
                >
                  คำใบ้ถัดไป
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
