"use client";
import { CheckCircle, XCircle, Award, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizFeedbackProps {
  isCorrect: boolean;
  showResult: boolean;
  explanation?: string;
  onContinue: () => void;
  isLastQuestion: boolean;
}

export default function QuizFeedback({ 
  isCorrect, 
  showResult, 
  explanation, 
  onContinue, 
  isLastQuestion 
}: QuizFeedbackProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (showResult) {
      // Trigger animation after component mounts
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  if (!showResult) return null;

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50 
      transform transition-all duration-500 ease-out
      ${animate ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className={`
        ${isCorrect 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
          : 'bg-gradient-to-r from-orange-500 to-red-500'
        } 
        text-white p-6 shadow-2xl
      `}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className={`
                p-3 rounded-full 
                ${isCorrect ? 'bg-green-600' : 'bg-orange-600'}
                transform transition-all duration-300
                ${animate ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
              `}>
                {isCorrect ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>

              {/* Message */}
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {isCorrect ? 'ยอดเยี่ยม!' : 'ไม่เป็นไร!'}
                </h3>
                <p className="text-white/90">
                  {isCorrect 
                    ? 'คุณตอบถูกต้อง!' 
                    : 'อย่าท้อแท้ ลองใหม่ในครั้งถัดไป!'
                  }
                </p>
                
                {/* Explanation */}
                {explanation && (
                  <p className="text-white/80 text-sm mt-2 max-w-md">
                    {explanation}
                  </p>
                )}
              </div>

              {/* Sparkles animation for correct answers */}
              {isCorrect && (
                <div className="hidden sm:flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  <Award className="w-6 h-6 text-yellow-300 animate-bounce" />
                </div>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={onContinue}
              className={`
                font-bold py-3 px-8 rounded-xl transition-all duration-300 
                transform hover:scale-105 active:scale-95
                ${isCorrect 
                  ? 'bg-white text-green-600 hover:bg-gray-100' 
                  : 'bg-white text-orange-600 hover:bg-gray-100'
                }
                shadow-lg
              `}
            >
              {isLastQuestion ? 'ดูผลลัพธ์' : 'ต่อไป'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
