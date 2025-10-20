"use client";
import { useState, useEffect } from "react";
import { Lightbulb, Sparkles, CheckCircle, XCircle } from "lucide-react";
import "../../styles/quiz-enhanced.css";

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
  image?: string; // เพิ่มฟิลด์สำหรับรูปภาพ
}

export default function MultipleChoiceQuestion({
  question,
  answers,
  onAnswer,
  showResult,
  selectedAnswer,
  disabled = false,
  hints = [],
  currentQuestionData,
  image // เพิ่มพารามิเตอร์ image
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
    const answer = answers.find(a => a.id === answerId);
    let baseClasses = "choice-option";
    
    if (showResult) {
      if (answer?.isCorrect) {
        baseClasses += " correct";
      } else if (selectedAnswer === answerId) {
        baseClasses += " incorrect";
      }
    } else if (selectedAnswer === answerId) {
      baseClasses += " selected";
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
      {/* Question */}
      <div className="mb-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 icon-pulse" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              {question}
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400 icon-pulse" />
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
                          <div class="text-6xl mb-4 animate-bounce">🌟</div>
                          <p class="text-xl font-semibold">ไม่สามารถโหลดรูปภาพได้</p>
                          <p class="text-sm text-gray-300 mt-2">กำลังใช้รูปภาพสำรอง</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          ) : (
            // Enhanced Placeholder
            <div className="question-image w-full h-48 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/80"></div>
              <div className="relative text-center text-white z-10">
                <div className="text-6xl mb-4 icon-bounce">🌟</div>
                <p className="text-xl font-semibold mb-2">ภาพประกอบคำถาม</p>
                <p className="text-sm text-gray-300">เตรียมพร้อมสำหรับความท้าทาย!</p>
              </div>
              <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {answers.map((answer, index) => {
          const isCorrect = showResult && answer.isCorrect;
          const isSelected = selectedAnswer === answer.id;
          const isIncorrect = showResult && isSelected && !answer.isCorrect;
          
          return (
            <button
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              onMouseEnter={() => setHoveredAnswer(answer.id)}
              onMouseLeave={() => setHoveredAnswer(null)}
              disabled={showResult || disabled}
              className={`
                ${getAnswerStyle(answer.id)}
                p-6 rounded-xl font-semibold text-lg
                min-h-[100px] flex items-center justify-between
                disabled:cursor-not-allowed relative
                group
              `}

            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex-shrink-0">
                  {showResult ? (
                    isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : isIncorrect ? (
                      <XCircle className="w-6 h-6 text-white" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                    )
                  ) : (
                    <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                      isSelected 
                        ? 'border-white bg-white' 
                        : 'border-gray-400 group-hover:border-blue-400'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full rounded-full bg-blue-500 transform scale-50"></div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-left flex-1 text-gray-900">{answer.text}</span>
              </div>
              
              {/* Option Number Badge */}
              <div className={`
                absolute -top-2 -right-2 w-8 h-8 rounded-full 
                flex items-center justify-center text-sm font-bold
                transition-all duration-300
                ${showResult && isCorrect 
                  ? 'bg-green-500 text-white' 
                  : showResult && isIncorrect
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-blue-500 group-hover:text-white'
                }
              `}>
                {String.fromCharCode(65 + index)} {/* A, B, C, D */}
              </div>
            </button>
          );
        })}
      </div>

      {/* Enhanced Hint Section */}
      {availableHints.length > 0 && !showResult && (
        <div className="text-center">
          {!showHint ? (
            <button
              onClick={getNextHint}
              className="hint-button inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all duration-300"
              title="ใบ้"
            >
              <Lightbulb className="w-5 h-5 icon-pulse" />
              <span className="font-semibold">ต้องการคำใบ้?</span>
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <div className="hint-container bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-2 border-yellow-400/50 rounded-2xl p-6 max-w-lg mx-auto backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-yellow-300 font-bold text-lg">คำใบ้ที่ {currentHintIndex + 1}</span>
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-white text-lg leading-relaxed">{availableHints[currentHintIndex]}</p>
              </div>
              
              {currentHintIndex < availableHints.length - 1 && (
                <button
                  onClick={getNextHint}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <span>คำใบ้ถัดไป</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
              
              <div className="mt-4 text-center">
                <span className="text-yellow-200 text-sm">
                  คำใบ้ {currentHintIndex + 1} จาก {availableHints.length}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
