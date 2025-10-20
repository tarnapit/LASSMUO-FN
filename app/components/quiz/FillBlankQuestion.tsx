"use client";
import { useState, useEffect } from "react";
import { Lightbulb, CheckCircle, XCircle, Send, PenTool, Target, Sparkles } from "lucide-react";
import "../../styles/quiz-enhanced.css";

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

  // Effect to clear state when question changes
  useEffect(() => {
    // Reset all states first to ensure clean start for new question
    setAnswer("");
    setShowHint(false);
    setCurrentHintIndex(0);
    setIsCorrect(null);
    
    // Then restore user answer if exists
    if (userAnswer) {
      setAnswer(userAnswer);
      if (showResult) {
        setIsCorrect(checkAnswer(userAnswer));
      }
    }
  }, [question, correctAnswer]); // Trigger when question or correct answer changes

  // Separate effect for handling userAnswer and showResult updates
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
                  fill-blank-input px-6 py-4 text-xl font-semibold rounded-xl border-2 
                  bg-white text-gray-900 placeholder-gray-400
                  min-w-[200px] text-center shadow-lg
                  focus:outline-none focus:ring-4 focus:ring-purple-500/50
                  transition-all duration-300 transform hover:scale-105
                  disabled:cursor-not-allowed disabled:hover:scale-100
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
              fill-blank-input px-6 py-4 text-xl font-semibold rounded-xl border-2 
              bg-white text-gray-900 placeholder-gray-400
              min-w-[250px] text-center shadow-lg
              focus:outline-none focus:ring-4 focus:ring-purple-500/50
              transition-all duration-300 transform hover:scale-105
              disabled:cursor-not-allowed disabled:hover:scale-100
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
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg fill-blank-icon">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg fill-blank-icon">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg fill-blank-icon">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
          กรอกคำตอบให้ถูกต้อง
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
      </div>

      {/* Question with Input */}
      {renderQuestion()}

      {/* Submit Button */}
      {!showResult && (
        <div className="text-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={answer.trim() === ""}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed fill-blank-submit"
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
              className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hint-button"
            >
              <Lightbulb className="w-5 h-5" />
              <span>ต้องการคำใบ้?</span>
            </button>
          ) : (
            <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-2 border-yellow-500/70 rounded-xl p-6 max-w-lg mx-auto shadow-xl hint-display">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-yellow-400 font-bold text-lg">คำใบ้ {currentHintIndex + 1}/{hints.length}</span>
              </div>
              <p className="text-white text-lg leading-relaxed mb-4">{hints[currentHintIndex]}</p>
              {currentHintIndex < hints.length - 1 && (
                <button
                  onClick={getNextHint}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  คำใบ้ถัดไป →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Result Message */}
      {showResult && (
        <div className="text-center">
          <div className={`
            inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg shadow-xl transform transition-all duration-500 result-message
            ${isCorrect 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-400' 
              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-red-400'
            }
          `}>
            {isCorrect ? (
              <>
                <CheckCircle className="w-6 h-6" />
                <span>ถูกต้อง! เยียม!</span>
                <Sparkles className="w-6 h-6" />
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                <div>
                  <div>คำตอบที่ถูกต้อง:</div>
                  <div className="font-extrabold text-xl">{correctAnswer}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
