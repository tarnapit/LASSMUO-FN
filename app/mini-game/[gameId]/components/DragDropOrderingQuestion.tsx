"use client";
import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, GripVertical, RotateCcw } from "lucide-react";

interface DragDropOrderingQuestionProps {
  question: string;
  items: string[];
  correctOrder: string[];
  instruction?: string;
  onAnswer: (answer: string[]) => void;
  showResult: boolean;
  userAnswer?: string[] | null;
  disabled?: boolean;
}

export default function DragDropOrderingQuestion({
  question,
  items,
  correctOrder,
  instruction = "ลากและวางเพื่อเรียงลำดับให้ถูกต้อง",
  onAnswer,
  showResult,
  userAnswer,
  disabled = false
}: DragDropOrderingQuestionProps) {
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize order
  useEffect(() => {
    if (userAnswer && userAnswer.length > 0) {
      setOrderedItems(userAnswer);
      setIsSubmitted(true); // ถ้ามี userAnswer แสดงว่าส่งแล้ว
    } else {
      // Shuffle items initially
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setOrderedItems(shuffled);
      setIsSubmitted(false); // รีเซ็ต isSubmitted เมื่อเริ่มข้อใหม่
    }
  }, [items, userAnswer]);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    if (disabled || showResult) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (disabled || showResult || !draggedItem) return;
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled || showResult) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { clientX, clientY } = e;
    
    if (clientX < rect.left || clientX > rect.right || 
        clientY < rect.top || clientY > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (disabled || showResult || !draggedItem) return;
    e.preventDefault();
    
    const currentIndex = orderedItems.indexOf(draggedItem);
    if (currentIndex === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }
    
    const newOrder = [...orderedItems];
    newOrder.splice(currentIndex, 1);
    
    const adjustedDropIndex = currentIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newOrder.splice(adjustedDropIndex, 0, draggedItem);
    
    setOrderedItems(newOrder);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleSubmit = () => {
    if (disabled || showResult) return;
    setIsSubmitted(true);
    onAnswer(orderedItems);
  };

  const resetOrder = () => {
    if (disabled || showResult) return;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setOrderedItems(shuffled);
    setIsSubmitted(false);
  };

  const isCorrect = showResult && JSON.stringify(orderedItems) === JSON.stringify(correctOrder);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Question Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {question}
        </h2>
        <p className="text-gray-300 text-lg mb-4">{instruction}</p>
        
        {!showResult && !isSubmitted && (
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

      {/* Drag and Drop Area */}
      <div className="space-y-3">
        {orderedItems.map((item, index) => {
          const isDragged = draggedItem === item;
          const isDropTarget = dragOverIndex === index;
          const isCorrectPosition = showResult && correctOrder[index] === item;
          const isIncorrectPosition = showResult && correctOrder[index] !== item;

          let cardStyle = "relative p-6 rounded-xl border-2 transition-all duration-300 select-none group ";
          
          if (showResult) {
            if (isCorrectPosition) {
              cardStyle += "bg-green-500/20 border-green-500 text-green-300 shadow-green-500/20 shadow-lg";
            } else {
              cardStyle += "bg-red-500/20 border-red-500 text-red-300 shadow-red-500/20 shadow-lg";
            }
          } else {
            if (isDragged) {
              cardStyle += "bg-blue-500/30 border-blue-500 text-blue-300 shadow-blue-500/30 shadow-lg transform scale-105 opacity-50";
            } else if (isDropTarget) {
              cardStyle += "bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-yellow-500/20 shadow-lg transform scale-102";
            } else {
              cardStyle += "bg-white/10 border-gray-600 text-white hover:border-blue-400 hover:bg-blue-500/10 cursor-grab active:cursor-grabbing";
            }
          }

          if (isDropTarget && !isDragged) {
            cardStyle += " ring-2 ring-yellow-400 ring-opacity-50";
          }

          return (
            <div
              key={item}
              className={cardStyle}
              draggable={!disabled && !showResult}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center gap-4">
                {/* Position Number */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-400 bg-blue-400/10 rounded-full w-10 h-10 flex items-center justify-center">
                    {index + 1}
                  </span>
                  {!disabled && !showResult && (
                    <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
                      <GripVertical className="w-5 h-5" />
                    </div>
                  )}
                </div>
                
                {/* Item Content */}
                <div className="flex-1">
                  <p className="text-lg leading-relaxed font-medium">
                    {item}
                  </p>
                </div>

                {/* Result Icon */}
                {showResult && (
                  <div className="ml-4">
                    {isCorrectPosition ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                )}
              </div>

              {/* Drop Zone Indicator */}
              {isDropTarget && !isDragged && (
                <div className="absolute inset-0 border-2 border-dashed border-yellow-400 rounded-xl pointer-events-none animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showResult && !isSubmitted && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
          >
            ยืนยันลำดับ
          </button>
        </div>
      )}

      {/* Result Feedback */}
      {showResult && (
        <div className="text-center space-y-4">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-400 text-xl font-bold">
              <CheckCircle className="w-8 h-8" />
              <span>🎉 ยอดเยี่ยม! เรียงลำดับถูกต้อง!</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-red-400 text-xl font-bold">
                <XCircle className="w-8 h-8" />
                <span>💪 ลำดับยังไม่ถูกต้อง ลองอีกครั้ง!</span>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-6">
                <h4 className="text-green-300 font-semibold mb-4 text-lg">🎯 ลำดับที่ถูกต้อง:</h4>
                <div className="space-y-3">
                  {correctOrder.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <span className="text-xl font-bold text-blue-400 bg-blue-400/20 rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-green-300 font-medium">{item}</span>
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