"use client";
import { useState, useEffect } from "react";
import { Volume2, Lightbulb, CheckCircle, XCircle, Send } from "lucide-react";

interface FillBlankQuestionProps {
  question: string;
  correctAnswer: string;
  alternatives?: string[];
  placeholder: string;
  hints?: string[];
  onAnswer: (isCorrect: boolean, userAnswer: string) => void;
  showResult: boolean;
  userAnswer?: string;
}

export default function FillBlankQuestion({
  question,
  correctAnswer,
  alternatives = [],
  placeholder,
  hints = [],
  onAnswer,
  showResult,
  userAnswer
}: FillBlankQuestionProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (userAnswer) {
      setAnswer(userAnswer);
      if (showResult) {
        setIsCorrect(checkAnswer(userAnswer));
      }
    }
  }, [userAnswer, showResult]);

  const handleSubmit = () => {
    if (answer.trim() === "" || showResult) return;
    
    const correct = checkAnswer(answer.trim());
    setIsCorrect(correct);
    onAnswer(correct, answer.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult && answer.trim() !== "") {
      handleSubmit();
    }
  };

  const checkAnswer = (userAnswer: string): boolean => {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toLowerCase().trim();
    
    // Check exact match
    if (normalizedAnswer === normalizedCorrect) return true;
    
    // Check alternatives
    return alternatives.some(alt => 
      alt.toLowerCase().trim() === normalizedAnswer
    );
  };

  const getInputStyle = (): string => {
    if (!showResult) {
      return "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    }
    
    return isCorrect 
      ? "border-green-500 bg-green-50 text-green-800"
      : "border-red-500 bg-red-50 text-red-800";
  };

  const getNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
    setShowHint(true);
  };

  const renderQuestion = () => {
    // Replace underscores with input field
    const parts = question.split('___');
    
    if (parts.length === 2) {
      return (
        <div className="text-center mb-8">
          <div className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
            <span className="mr-3">{parts[0]}</span>
            <div className="inline-block relative">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={showResult}
                className={`
                  px-4 py-3 text-xl font-semibold rounded-xl border-2 
                  bg-white text-gray-900 placeholder-gray-400
                  min-w-[200px] text-center
                  focus:outline-none focus:ring-4 focus:ring-blue-500/50
                  transition-all duration-200
                  disabled:cursor-not-allowed
                  ${getInputStyle()}
                `}
              />
              {showResult && (
                <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                  {isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <span className="ml-3">{parts[1]}</span>
          </div>
        </div>
      );
    }

    // Fallback for questions without blanks
    return (
      <div className="text-center mb-8">
        <div className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
          {question}
        </div>
        <div className="relative inline-block">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={showResult}
            className={`
              px-4 py-3 text-xl font-semibold rounded-xl border-2 
              bg-white text-gray-900 placeholder-gray-400
              min-w-[250px] text-center
              focus:outline-none focus:ring-4 focus:ring-blue-500/50
              transition-all duration-200
              disabled:cursor-not-allowed
              ${getInputStyle()}
            `}
          />
          {showResult && (
            <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
              {isCorrect ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Audio Button */}
      <div className="flex justify-end mb-4">
        <button
          className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
          title="ฟังเสียงคำถาม"
          aria-label="ฟังเสียงคำถาม"
        >
          <Volume2 className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Question with Input */}
      {renderQuestion()}

      {/* Submit Button */}
      {!showResult && (
        <div className="text-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={answer.trim() === ""}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>ส่งคำตอบ</span>
          </button>
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && !showResult && (
        <div className="text-center mb-8">
          {!showHint ? (
            <button
              onClick={getNextHint}
              className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
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
              <p className="text-white">{hints[currentHintIndex]}</p>
              {currentHintIndex < hints.length - 1 && (
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

      {/* Alternatives */}
      {alternatives.length > 0 && !showResult && (
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">คำตอบที่ยอมรับ:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {alternatives.map((alt, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Result Message */}
      {showResult && (
        <div className="text-center">
          <div className={`
            inline-block px-6 py-3 rounded-xl font-semibold
            ${isCorrect 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }
          `}>
            {isCorrect ? (
              <span>✅ ถูกต้อง!</span>
            ) : (
              <span>❌ คำตอบที่ถูกต้อง: {correctAnswer}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
