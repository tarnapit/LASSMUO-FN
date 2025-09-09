"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";

interface ImageIdentificationQuestionProps {
  question: string;
  imageUrl: string;
  imageDescription?: string;
  answers: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
    emoji?: string;
  }>;
  onAnswer: (answerId: number, isCorrect: boolean) => void;
  selectedAnswer?: number | null;
  showResult: boolean;
  disabled?: boolean;
}

export default function ImageIdentificationQuestion({
  question,
  imageUrl,
  imageDescription,
  answers,
  onAnswer,
  selectedAnswer,
  showResult,
  disabled = false
}: ImageIdentificationQuestionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset states when question changes
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const handleAnswerClick = (answerId: number, isCorrect: boolean) => {
    if (showResult || disabled) return;
    onAnswer(answerId, isCorrect);
  };

  const renderAnswerButton = (answer: typeof answers[0]) => {
    let buttonStyle = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ";

    if (showResult) {
      if (answer.isCorrect) {
        buttonStyle += "bg-green-500/20 border-green-500 text-green-300 shadow-green-500/20 shadow-lg";
      } else if (selectedAnswer === answer.id) {
        buttonStyle += "bg-red-500/20 border-red-500 text-red-300 shadow-red-500/20 shadow-lg";
      } else {
        buttonStyle += "bg-white/5 border-gray-600 text-gray-400";
      }
    } else {
      if (selectedAnswer === answer.id) {
        buttonStyle += "bg-blue-500/20 border-blue-500 text-blue-300 shadow-blue-500/20 shadow-lg";
      } else {
        buttonStyle += "bg-white/10 border-gray-600 text-white hover:border-blue-400 hover:bg-blue-500/10 hover:shadow-blue-500/10 hover:shadow-lg";
      }
    }

    return (
      <button
        key={answer.id}
        onClick={() => handleAnswerClick(answer.id, answer.isCorrect)}
        className={buttonStyle}
        disabled={disabled}
      >
        <span className="text-2xl">{answer.emoji || "📷"}</span>
        <div className="flex-1">
          <div className="font-semibold text-lg">{answer.text}</div>
        </div>
        {showResult && answer.isCorrect && (
          <CheckCircle className="w-6 h-6 text-green-500" />
        )}
        {showResult && selectedAnswer === answer.id && !answer.isCorrect && (
          <XCircle className="w-6 h-6 text-red-500" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {question}
        </h2>
        {imageDescription && (
          <p className="text-gray-300 text-lg">{imageDescription}</p>
        )}
      </div>

      {/* Image Display */}
      <div className="flex justify-center">
        <div className="relative bg-white/10 rounded-2xl p-4 border border-white/20 shadow-2xl max-w-2xl">
          {!imageLoaded && !imageError && (
            <div className="flex items-center justify-center h-96 w-96 mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-4 text-white">กำลังโหลดภาพ...</span>
            </div>
          )}

          {imageError && (
            <div className="flex flex-col items-center justify-center h-96 w-96 mx-auto text-white">
              <Eye className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">ไม่สามารถโหลดภาพได้</h3>
              <p className="text-gray-400 text-center">กรุณาลองใหม่อีกครั้ง</p>
            </div>
          )}

          <img
            src={imageUrl}
            alt="รูปภาพประกอบคำถาม"
            className={`max-h-96 w-auto mx-auto rounded-xl shadow-lg transition-opacity duration-300 ${
              imageLoaded ? "opacity-100 block" : "opacity-0 hidden"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          {imageLoaded && (
            <div className="absolute inset-0 rounded-2xl border-2 border-white/10 pointer-events-none"></div>
          )}
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white text-center mb-6">
          🤔 เลือกคำตอบที่ถูกต้อง
        </h3>
        <div className="grid gap-3 md:gap-4">
          {answers.map(renderAnswerButton)}
        </div>
      </div>

      {/* Visual feedback */}
      {showResult && (
        <div className="text-center">
          {selectedAnswer && answers.find(a => a.id === selectedAnswer)?.isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-400 text-xl font-bold">
              <CheckCircle className="w-8 h-8" />
              <span>🎉 ยอดเยี่ยม! คุณตอบถูกต้อง!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-400 text-xl font-bold">
              <XCircle className="w-8 h-8" />
              <span>💪 ลองดูภาพอีกครั้งนะ!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
