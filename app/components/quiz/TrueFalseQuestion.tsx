"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Lightbulb, Sparkles, Shield, Zap } from "lucide-react";
import "../../styles/quiz-enhanced.css";

interface TrueFalseQuestionProps {
  question: string;
  correctAnswer: boolean;
  onAnswer: (answer: boolean, isCorrect: boolean) => void;
  showResult: boolean;
  selectedAnswer: boolean | null;
  disabled?: boolean;
  hints?: string[];
  currentQuestionData?: any;
  image?: string; // เพิ่มฟิลด์สำหรับรูปภาพ
}

export default function TrueFalseQuestion({
  question,
  correctAnswer,
  onAnswer,
  showResult,
  selectedAnswer,
  disabled = false,
  hints = [],
  currentQuestionData,
  image // เพิ่มพารามิเตอร์ image
}: TrueFalseQuestionProps) {
  const [hoveredAnswer, setHoveredAnswer] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Get hints from API data if available
  const availableHints = hints.length > 0 ? hints : (currentQuestionData?.hints || []);

  const handleAnswerClick = (answer: boolean) => {
    if (showResult || disabled) return;
    
    const isCorrect = answer === correctAnswer;
    onAnswer(answer, isCorrect);
  };

  const getAnswerStyle = (answer: boolean) => {
    let baseClasses = "tf-button";
    
    if (answer) {
      baseClasses += " true-button";
    } else {
      baseClasses += " false-button";
    }
    
    if (showResult) {
      if (answer === correctAnswer) {
        baseClasses += " correct";
      } else if (selectedAnswer === answer) {
        baseClasses += " incorrect";
      }
    }
    
    return baseClasses;
  };

  const getNextHint = () => {
    if (currentHintIndex < availableHints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
    setShowHint(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto question-container">
      {/* Enhanced Question Header */}
      <div className="mb-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <Shield className="w-8 h-8 text-green-400 icon-bounce" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-red-400 bg-clip-text text-transparent leading-tight">
              {question}
            </h1>
            <Zap className="w-8 h-8 text-red-400 icon-bounce" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-gray-300 text-lg font-medium">เลือกว่าข้อความนี้จริงหรือเท็จ</p>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Enhanced Visual Content */}
        <div className="mb-10">
          {image ? (
            // แสดงรูปภาพจริงถ้ามี
            <div className="question-image w-full h-64 md:h-80 rounded-2xl overflow-hidden relative">
              <img 
                src={image} 
                alt="คำถามประกอบ"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback ถ้าไม่สามารถโหลดรูปได้
                  const img = e.target as HTMLImageElement;
                  const container = img.parentElement;
                  if (container) {
                    container.innerHTML = `
                      <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/80 to-purple-900/80">
                        <div class="text-center text-white">
                          <div class="text-6xl mb-4 animate-bounce">⚡</div>
                          <p class="text-xl font-semibold">ไม่สามารถโหลดรูปภาพได้</p>
                          <p class="text-sm text-gray-300 mt-2">กำลังใช้รูปภาพสำรอง</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500/80 to-red-500/80 backdrop-blur-sm rounded-full p-2">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          ) : (
            // Placeholder ถ้าไม่มีรูปภาพ
            <div className="question-image w-full h-48 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-blue-900/60 to-red-900/60"></div>
              <div className="relative text-center text-white z-10">
                <div className="text-6xl mb-4 icon-bounce">⚖️</div>
                <p className="text-xl font-semibold mb-2">ตัดสินใจให้ถูกต้อง</p>
                <p className="text-sm text-gray-300">จริง หรือ เท็จ?</p>
              </div>
              <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-red-400 rounded-full animate-pulse delay-1000"></div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced True/False Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Enhanced True Button */}
        <button
          onClick={() => handleAnswerClick(true)}
          onMouseEnter={() => setHoveredAnswer(true)}
          onMouseLeave={() => setHoveredAnswer(null)}
          disabled={showResult || disabled}
          className={`
            ${getAnswerStyle(true)}
            p-10 rounded-3xl font-bold text-2xl
            min-h-[140px] flex flex-col items-center justify-center
            disabled:cursor-not-allowed relative group
          `}
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <CheckCircle className="w-16 h-16 mb-4 icon-pulse text-green-600 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-wide text-gray-900">จริง</span>
            <span className="text-sm mt-2 opacity-70 text-gray-700">TRUE</span>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-green-300 rounded-full opacity-30 group-hover:opacity-70 transition-opacity"></div>
        </button>

        {/* Enhanced False Button */}
        <button
          onClick={() => handleAnswerClick(false)}
          onMouseEnter={() => setHoveredAnswer(false)}
          onMouseLeave={() => setHoveredAnswer(null)}
          disabled={showResult || disabled}
          className={`
            ${getAnswerStyle(false)}
            p-10 rounded-3xl font-bold text-2xl
            min-h-[140px] flex flex-col items-center justify-center
            disabled:cursor-not-allowed relative group
          `}
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <XCircle className="w-16 h-16 mb-4 icon-pulse text-red-600 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">✗</span>
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-wide text-gray-900">เท็จ</span>
            <span className="text-sm mt-2 opacity-70 text-gray-700">FALSE</span>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-400 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-red-300 rounded-full opacity-30 group-hover:opacity-70 transition-opacity"></div>
        </button>
      </div>

      {/* Enhanced Hint Section */}
      {availableHints.length > 0 && !showResult && (
        <div className="text-center">
          {!showHint ? (
            <button
              onClick={getNextHint}
              className="hint-button inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl text-yellow-400 hover:text-yellow-300 transition-all duration-300 group"
              title="ใบ้"
            >
              <Lightbulb className="w-6 h-6 icon-pulse group-hover:scale-110" />
              <span className="text-lg font-semibold">ต้องการคำใบ้?</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform" />
            </button>
          ) : (
            <div className="hint-container bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-400/50 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <span className="text-yellow-300 font-bold text-xl">คำใบ้สำหรับคุณ</span>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 mb-6 border border-yellow-400/20">
                <p className="text-white text-lg leading-relaxed text-center">{availableHints[currentHintIndex]}</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                {currentHintIndex < availableHints.length - 1 && (
                  <button
                    onClick={getNextHint}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    <span>คำใบ้ถัดไป</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
                
                <div className="text-center">
                  <span className="text-yellow-200 text-sm font-medium">
                    คำใบ้ที่ {currentHintIndex + 1} จาก {availableHints.length}
                  </span>
                  <div className="flex gap-1 mt-2 justify-center">
                    {availableHints.map((_: string, index: number) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index <= currentHintIndex ? 'bg-yellow-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
