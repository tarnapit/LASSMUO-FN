"use client";
import { X, Heart } from "lucide-react";

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  lives: number;
  onExit: () => void;
}

export default function QuizHeader({ 
  currentQuestion, 
  totalQuestions, 
  lives, 
  onExit 
}: QuizHeaderProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full bg-black/20 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Exit Button */}
          <button
            onClick={onExit}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="ออกจากแบบทดสอบ"
            aria-label="ออกจากแบบทดสอบ"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 mx-6">
            <div className="relative">
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ease-out`}
                  style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left' }}
                />
              </div>
              <div className="absolute -top-1 left-0 w-full flex justify-between">
                {Array.from({ length: totalQuestions }, (_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      i < currentQuestion
                        ? 'bg-green-500 border-green-500'
                        : i === currentQuestion
                        ? 'bg-blue-500 border-blue-500 scale-110'
                        : 'bg-gray-600 border-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lives */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < lives 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Counter */}
        <div className="mt-2 text-center">
          <span className="text-gray-300 text-sm">
            คำถามที่ {currentQuestion + 1} จาก {totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
}
