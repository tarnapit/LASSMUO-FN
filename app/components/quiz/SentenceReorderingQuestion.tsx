"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RotateCcw, ArrowUp, ArrowDown } from "lucide-react";

interface SentenceReorderingQuestionProps {
  question: string;
  sentences: string[];
  correctOrder: number[];
  instruction?: string;
  onAnswer: (isCorrect: boolean, userAnswer: number[]) => void;
  showResult: boolean;
  userAnswer?: number[] | null;
  disabled?: boolean;
}

export default function SentenceReorderingQuestion({
  question,
  sentences,
  correctOrder,
  instruction = "ลากหรือคลิกเพื่อเรียงลำดับประโยค",
  onAnswer,
  showResult,
  userAnswer,
  disabled = false
}: SentenceReorderingQuestionProps) {
  const [orderedSentences, setOrderedSentences] = useState<number[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    // Initialize with shuffled order if no user answer
    if (userAnswer && userAnswer.length > 0) {
      setOrderedSentences(userAnswer);
    } else {
      // Shuffle the sentences initially
      const indices = Array.from({ length: sentences.length }, (_, i) => i);
      const shuffled = indices.sort(() => Math.random() - 0.5);
      setOrderedSentences(shuffled);
    }
  }, [sentences, userAnswer]);

  useEffect(() => {
    // Check answer when order is complete
    if (orderedSentences.length === sentences.length && !showResult && !disabled) {
      const isCorrect = JSON.stringify(orderedSentences) === JSON.stringify(correctOrder);
      onAnswer(isCorrect, orderedSentences);
    }
  }, [orderedSentences, correctOrder, sentences.length, showResult, disabled, onAnswer]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled || showResult) return;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (disabled || showResult) return;
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (disabled || showResult || draggedItem === null) return;
    e.preventDefault();
    
    const newOrder = [...orderedSentences];
    const draggedSentenceIndex = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(dropIndex, 0, draggedSentenceIndex);
    
    setOrderedSentences(newOrder);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const moveUp = (currentIndex: number) => {
    if (disabled || showResult || currentIndex === 0) return;
    const newOrder = [...orderedSentences];
    [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
    setOrderedSentences(newOrder);
  };

  const moveDown = (currentIndex: number) => {
    if (disabled || showResult || currentIndex === orderedSentences.length - 1) return;
    const newOrder = [...orderedSentences];
    [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
    setOrderedSentences(newOrder);
  };

  const resetOrder = () => {
    if (disabled || showResult) return;
    const indices = Array.from({ length: sentences.length }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    setOrderedSentences(shuffled);
  };

  const isCorrect = showResult && JSON.stringify(orderedSentences) === JSON.stringify(correctOrder);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Question */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {question}
        </h2>
        <p className="text-gray-300 text-lg mb-4">{instruction}</p>
        
        {!showResult && (
          <button
            onClick={resetOrder}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            สลับลำดับใหม่
          </button>
        )}
      </div>

      {/* Sentences */}
      <div className="space-y-3">
        {orderedSentences.map((sentenceIndex, orderIndex) => {
          let cardStyle = "relative p-4 rounded-xl border-2 transition-all duration-300 cursor-move select-none ";
          
          if (showResult) {
            if (correctOrder[orderIndex] === sentenceIndex) {
              cardStyle += "bg-green-500/20 border-green-500 text-green-300 shadow-green-500/20 shadow-lg";
            } else {
              cardStyle += "bg-red-500/20 border-red-500 text-red-300 shadow-red-500/20 shadow-lg";
            }
          } else {
            if (draggedItem === orderIndex) {
              cardStyle += "bg-blue-500/30 border-blue-500 text-blue-300 shadow-blue-500/30 shadow-lg transform scale-105";
            } else if (dragOverIndex === orderIndex) {
              cardStyle += "bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-yellow-500/20 shadow-lg";
            } else {
              cardStyle += "bg-white/10 border-gray-600 text-white hover:border-blue-400 hover:bg-blue-500/10";
            }
          }

          return (
            <div
              key={`${sentenceIndex}-${orderIndex}`}
              className={cardStyle}
              draggable={!disabled && !showResult}
              onDragStart={(e) => handleDragStart(e, orderIndex)}
              onDragOver={(e) => handleDragOver(e, orderIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, orderIndex)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-blue-400">
                    {orderIndex + 1}
                  </span>
                  {!disabled && !showResult && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveUp(orderIndex)}
                        disabled={orderIndex === 0}
                        title="ย้ายขึ้น"
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveDown(orderIndex)}
                        disabled={orderIndex === orderedSentences.length - 1}
                        title="ย้ายลง"
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-lg leading-relaxed">
                    {sentences[sentenceIndex]}
                  </p>
                </div>

                {showResult && (
                  <div className="ml-4">
                    {correctOrder[orderIndex] === sentenceIndex ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Drag indicator */}
              {!disabled && !showResult && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <div className="flex flex-col gap-1">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div className="text-center">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-400 text-xl font-bold">
              <CheckCircle className="w-8 h-8" />
              <span>🎉 เรียบร้อย! คุณเรียงลำดับถูกต้อง!</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-red-400 text-xl font-bold">
                <XCircle className="w-8 h-8" />
                <span>💪 ลำดับยังไม่ถูกต้อง ลองใหม่นะ!</span>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
                <h4 className="text-green-300 font-semibold mb-3">🎯 ลำดับที่ถูกต้อง:</h4>
                <div className="space-y-2">
                  {correctOrder.map((sentenceIndex, orderIndex) => (
                    <div key={orderIndex} className="flex items-center gap-3 text-green-300">
                      <span className="text-xl font-bold text-blue-400">{orderIndex + 1}.</span>
                      <span>{sentences[sentenceIndex]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
