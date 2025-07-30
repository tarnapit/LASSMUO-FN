"use client";
import { useState } from "react";
import { MiniGameQuestion } from "../../../types/mini-game";

interface QuestionRendererProps {
  question: MiniGameQuestion;
  onAnswer: (answer: any) => void;
  disabled?: boolean;
  showResult?: boolean;
  userAnswer?: any;
}

export default function QuestionRenderer({ 
  question, 
  onAnswer, 
  disabled = false, 
  showResult = false,
  userAnswer 
}: QuestionRendererProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [matchingPairs, setMatchingPairs] = useState<Record<string, string>>({});
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");
  const [orderItems, setOrderItems] = useState<string[]>(question.items || []);

  const handleMultipleChoice = (index: number) => {
    if (disabled) return;
    setSelectedAnswer(index);
    onAnswer(index);
  };

  const handleTrueFalse = (answer: boolean) => {
    if (disabled) return;
    const stringAnswer = answer.toString();
    setSelectedAnswer(stringAnswer);
    onAnswer(stringAnswer);
  };

  const handleFillBlank = () => {
    if (disabled || !fillBlankAnswer.trim()) return;
    onAnswer(fillBlankAnswer.trim());
  };

  const handleMatching = (left: string, right: string) => {
    if (disabled) return;
    const newPairs = { ...matchingPairs, [left]: right };
    setMatchingPairs(newPairs);
    
    // Check if all pairs are matched
    if (Object.keys(newPairs).length === (question.pairs?.length || 0)) {
      const result = Object.entries(newPairs).map(([left, right]) => `${left}-${right}`);
      onAnswer(result);
    }
  };

  const handleOrdering = (newOrder: string[]) => {
    if (disabled) return;
    setOrderItems(newOrder);
    onAnswer(newOrder);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    const newOrder = [...orderItems];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    handleOrdering(newOrder);
  };

  const getCorrectAnswer = () => {
    switch (question.type) {
      case 'multiple-choice':
        return question.correctAnswer;
      case 'true-false':
        return question.correctAnswer;
      case 'fill-blank':
        return question.correctAnswer;
      case 'matching':
        return question.correctAnswer;
      case 'ordering':
        return question.correctAnswer;
      default:
        return null;
    }
  };

  const isCorrectAnswer = (answer: any) => {
    const correct = getCorrectAnswer();
    if (question.type === 'multiple-choice') {
      return answer === correct;
    } else if (question.type === 'true-false') {
      return answer === correct;
    } else if (question.type === 'fill-blank') {
      if (Array.isArray(question.blanks)) {
        return question.blanks.some(blank => 
          answer.toLowerCase().includes(blank.toLowerCase())
        );
      }
      return answer.toLowerCase() === String(correct).toLowerCase();
    } else if (question.type === 'matching') {
      if (Array.isArray(correct) && Array.isArray(answer)) {
        return correct.every(pair => answer.includes(pair));
      }
      return false;
    } else if (question.type === 'ordering') {
      if (Array.isArray(correct) && Array.isArray(answer)) {
        return JSON.stringify(correct) === JSON.stringify(answer);
      }
      return false;
    }
    return false;
  };

  switch (question.type) {
    case 'multiple-choice':
      return (
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            let buttonStyle = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
            
            if (showResult) {
              if (index === question.correctAnswer) {
                buttonStyle += "bg-green-500/20 border-green-500 text-green-300";
              } else if (selectedAnswer === index) {
                buttonStyle += "bg-red-500/20 border-red-500 text-red-300";
              } else {
                buttonStyle += "bg-gray-500/20 border-gray-500 text-gray-400";
              }
            } else {
              if (selectedAnswer === index) {
                buttonStyle += "bg-blue-500/20 border-blue-500 text-blue-300";
              } else {
                buttonStyle += "bg-white/10 border-gray-600 text-white hover:border-blue-400 hover:bg-blue-500/10";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleMultipleChoice(index)}
                disabled={disabled}
                className={buttonStyle}
              >
                {option}
              </button>
            );
          })}
        </div>
      );

    case 'true-false':
      return (
        <div className="flex gap-4 justify-center">
          {[
            { value: true, label: "ถูกต้อง", color: "green" },
            { value: false, label: "ไม่ถูกต้อง", color: "red" }
          ].map((option) => {
            let buttonStyle = "px-8 py-4 rounded-xl border-2 transition-all duration-200 font-bold ";
            
            if (showResult) {
              if (option.value.toString() === question.correctAnswer) {
                buttonStyle += `bg-green-500/20 border-green-500 text-green-300`;
              } else if (selectedAnswer === option.value.toString()) {
                buttonStyle += `bg-red-500/20 border-red-500 text-red-300`;
              } else {
                buttonStyle += "bg-gray-500/20 border-gray-500 text-gray-400";
              }
            } else {
              if (selectedAnswer === option.value.toString()) {
                buttonStyle += `bg-${option.color}-500/20 border-${option.color}-500 text-${option.color}-300`;
              } else {
                buttonStyle += `bg-white/10 border-gray-600 text-white hover:border-${option.color}-400 hover:bg-${option.color}-500/10`;
              }
            }

            return (
              <button
                key={option.value.toString()}
                onClick={() => handleTrueFalse(option.value)}
                disabled={disabled}
                className={buttonStyle}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );

    case 'fill-blank':
      return (
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={fillBlankAnswer}
              onChange={(e) => setFillBlankAnswer(e.target.value)}
              placeholder="พิมพ์คำตอบ..."
              disabled={disabled}
              className="flex-1 p-4 rounded-xl bg-white/10 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
            />
            <button
              onClick={handleFillBlank}
              disabled={disabled || !fillBlankAnswer.trim()}
              className="px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-xl transition-all duration-200"
            >
              ตอบ
            </button>
          </div>
          {showResult && (
            <div className="text-center">
              <p className="text-gray-300">
                คำตอบที่ถูกต้อง: <span className="text-green-400 font-bold">{question.correctAnswer}</span>
              </p>
            </div>
          )}
        </div>
      );

    case 'matching':
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">จับคู่</h4>
            {question.pairs?.map((pair, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  matchingPairs[pair.left] 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-white/10 border-gray-600 text-white hover:border-blue-400'
                }`}
              >
                {pair.left}
                {matchingPairs[pair.left] && (
                  <span className="text-blue-300 ml-2">→ {matchingPairs[pair.left]}</span>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">เลือกคำตอบ</h4>
            {question.pairs?.map((pair, index) => (
              <button
                key={index}
                onClick={() => {
                  const unpairedLeft = question.pairs?.find(p => !matchingPairs[p.left])?.left;
                  if (unpairedLeft && !disabled) {
                    handleMatching(unpairedLeft, pair.right);
                  }
                }}
                disabled={disabled || Object.values(matchingPairs).includes(pair.right)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                  Object.values(matchingPairs).includes(pair.right)
                    ? 'bg-gray-500/20 border-gray-500 text-gray-400'
                    : 'bg-white/10 border-gray-600 text-white hover:border-green-400 hover:bg-green-500/10'
                }`}
              >
                {pair.right}
              </button>
            ))}
          </div>
        </div>
      );

    case 'ordering':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white text-center">ลากเพื่อเรียงลำดับ</h4>
          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/10 border-2 border-gray-600 rounded-xl text-white"
              >
                <span className="text-blue-400 font-bold">{index + 1}.</span>
                <span className="flex-1">{item}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveItem(index, Math.max(0, index - 1))}
                    disabled={disabled || index === 0}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded transition-all duration-200"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(index, Math.min(orderItems.length - 1, index + 1))}
                    disabled={disabled || index === orderItems.length - 1}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded transition-all duration-200"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!disabled && (
            <div className="text-center">
              <button
                onClick={() => handleOrdering(orderItems)}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
              >
                ยืนยันลำดับ
              </button>
            </div>
          )}
        </div>
      );

    default:
      return <div className="text-gray-400">ประเภทคำถามไม่รองรับ</div>;
  }
}
