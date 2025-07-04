"use client";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (userAnswer) {
      setAnswer(userAnswer);
    }
  }, [userAnswer]);

  const handleSubmit = () => {
    if (answer.trim() === "" || showResult) return;
    
    const isCorrect = checkAnswer(answer.trim());
    onAnswer(isCorrect, answer.trim());
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
    
    const isCorrect = checkAnswer(answer);
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
        <div className="text-center">
          <span className="text-2xl font-semibold text-white mr-2">{parts[0]}</span>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={showResult}
            className={`
              inline-block w-48 px-3 py-2 text-xl text-center font-semibold
              border-2 rounded-lg transition-all duration-200
              ${getInputStyle()}
              ${showResult ? 'cursor-default' : 'focus:outline-none focus:ring-2'}
            `}
          />
          <span className="text-2xl font-semibold text-white ml-2">{parts[1]}</span>
        </div>
      );
    }
    
    // Fallback: show question with separate input
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-white">{question}</h2>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={showResult}
          className={`
            w-64 px-4 py-3 text-xl text-center font-semibold
            border-2 rounded-lg transition-all duration-200
            ${getInputStyle()}
            ${showResult ? 'cursor-default' : 'focus:outline-none focus:ring-2'}
          `}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Question with Input */}
      {renderQuestion()}

      {/* Hints Section */}
      {hints.length > 0 && !showResult && (
        <div className="text-center space-y-4">
          {showHint && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-yellow-600 text-lg">💡</span>
                <span className="text-yellow-700 font-semibold">คำใบ้:</span>
              </div>
              <p className="text-yellow-800">{hints[currentHintIndex]}</p>
            </div>
          )}
          
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              ขอคำใบ้ 💡
            </button>
          ) : currentHintIndex < hints.length - 1 && (
            <button
              onClick={getNextHint}
              className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              คำใบ้เพิ่มเติม ({currentHintIndex + 1}/{hints.length})
            </button>
          )}
        </div>
      )}

      {/* Submit Button */}
      {!showResult && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={answer.trim() === ""}
            className={`
              px-8 py-3 font-semibold rounded-lg transition-all duration-200
              ${answer.trim() === ""
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              }
            `}
          >
            ตรวจคำตอบ
          </button>
          
          <p className="text-gray-400 text-sm mt-2">
            หรือกด Enter เพื่อส่งคำตอบ
          </p>
        </div>
      )}

      {/* Result Display */}
      {showResult && (
        <div className="text-center space-y-4">
          {checkAnswer(answer) ? (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-green-600 text-2xl">✅</span>
                <span className="text-green-700 font-bold text-lg">ถูกต้อง!</span>
              </div>
              <p className="text-green-800">คำตอบของคุณ: "{answer}"</p>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-red-600 text-2xl">❌</span>
                <span className="text-red-700 font-bold text-lg">ไม่ถูกต้อง</span>
              </div>
              <p className="text-red-800 mb-2">คำตอบของคุณ: "{answer}"</p>
              <p className="text-red-700">คำตอบที่ถูกต้อง: "{correctAnswer}"</p>
              {alternatives.length > 0 && (
                <p className="text-red-600 text-sm mt-1">
                  คำตอบอื่นที่ยอมรับ: {alternatives.join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!showResult && (
        <div className="text-center text-gray-400">
          <p className="text-sm">💡 พิมพ์คำตอบในช่องว่างและกดปุ่มตรวจคำตอบ</p>
        </div>
      )}
    </div>
  );
}
