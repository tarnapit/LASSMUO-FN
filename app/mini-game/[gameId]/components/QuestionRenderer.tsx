"use client";
import { useState, useEffect } from "react";
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
  const [feedback, setFeedback] = useState<{type: 'correct' | 'incorrect', message: string} | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setMatchingPairs({});
    setFillBlankAnswer("");
    setOrderItems(question.items || []);
    setFeedback(null);
    setShowingFeedback(false);
  }, [question.id, question.items]);

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
    if (disabled || showingFeedback) return;
    
    const newPairs = { ...matchingPairs, [left]: right };
    setMatchingPairs(newPairs);
    
    // Show immediate feedback
    const correctPairings = question.correctAnswer as string[];
    const userPairing = `${left}-${right}`;
    const isCorrect = correctPairings.includes(userPairing);
    
    setShowingFeedback(true);
    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: `✅ ถูกต้อง! "${left}" และ "${right}" จับคู่กันได้`
      });
    } else {
      setFeedback({
        type: 'incorrect',
        message: `❌ ไม่ถูกต้อง "${left}" ไม่ได้จับคู่กับ "${right}"`
      });
    }
    
    setTimeout(() => {
      setShowingFeedback(false);
      setFeedback(null);
      
      // Check if all pairs are matched
      if (Object.keys(newPairs).length === (question.pairs?.length || 0)) {
        const result = Object.entries(newPairs).map(([left, right]) => `${left}-${right}`);
        onAnswer(result);
      }
    }, 2000);
  };

  const handleOrdering = (newOrder: string[]) => {
    if (disabled) return;
    setOrderItems(newOrder);
    // Don't call onAnswer automatically - wait for confirm button
  };

  const confirmOrder = () => {
    if (disabled) return;
    onAnswer(orderItems);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    const newOrder = [...orderItems];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setOrderItems(newOrder);
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
          {/* Feedback overlay */}
          {showingFeedback && feedback && (
            <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className={`
                feedback-modal max-w-md mx-4 p-6 rounded-xl border-2 text-center transform transition-all duration-300 scale-100
                ${feedback.type === 'correct' 
                  ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/50' 
                  : 'bg-red-500/90 border-red-400 text-white shadow-red-500/50'
                } shadow-2xl
              `}>
                <div className="text-4xl mb-2">
                  {feedback.type === 'correct' ? '🎉' : '💭'}
                </div>
                <p className="text-lg font-semibold">{feedback.message}</p>
              </div>
            </div>
          )}

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
              disabled={disabled || showResult}
              className="flex-1 p-4 rounded-xl bg-white/10 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none disabled:bg-gray-600/50"
            />
            {!showResult && (
              <button
                onClick={handleFillBlank}
                disabled={disabled || !fillBlankAnswer.trim()}
                className="px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-xl transition-all duration-200"
              >
                ตอบ
              </button>
            )}
          </div>
          {showResult && (
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-gray-300">
                  คำตอบของคุณ: <span className={`font-bold ${
                    isCorrectAnswer(fillBlankAnswer) ? 'text-green-400' : 'text-red-400'
                  }`}>{fillBlankAnswer || 'ไม่ได้ตอบ'}</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-300">
                  คำตอบที่ถูกต้อง: <span className="text-green-400 font-bold">{question.correctAnswer}</span>
                </p>
              </div>
              {question.blanks && question.blanks.length > 1 && (
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    คำตอบที่ยอมรับ: {question.blanks.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      );

    case 'matching':
      return (
        <div className="space-y-6">
          {/* Feedback overlay */}
          {showingFeedback && feedback && (
            <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className={`
                feedback-modal max-w-md mx-4 p-6 rounded-xl border-2 text-center transform transition-all duration-300 scale-100
                ${feedback.type === 'correct' 
                  ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/50' 
                  : 'bg-red-500/90 border-red-400 text-white shadow-red-500/50'
                } shadow-2xl
              `}>
                <div className="text-4xl mb-2">
                  {feedback.type === 'correct' ? '🎉' : '💭'}
                </div>
                <p className="text-lg font-semibold">{feedback.message}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">จับคู่</h4>
              {question.pairs?.map((pair, index) => {
                let leftStyle = "p-3 rounded-lg border-2 transition-all duration-200 ";
                
                if (showResult) {
                  // Check if this pairing is correct
                  const correctPairings = question.correctAnswer as string[];
                  const userPairing = `${pair.left}-${matchingPairs[pair.left]}`;
                  const isCorrect = correctPairings.includes(userPairing);
                  
                  if (matchingPairs[pair.left]) {
                    if (isCorrect) {
                      leftStyle += "bg-green-500/30 border-green-500 text-green-300";
                    } else {
                      leftStyle += "bg-red-500/30 border-red-500 text-red-300";
                    }
                  } else {
                    leftStyle += "bg-gray-500/20 border-gray-500 text-gray-400";
                  }
                } else {
                  if (matchingPairs[pair.left]) {
                    leftStyle += "bg-green-500/30 border-green-500 text-green-300";
                  } else if (showingFeedback) {
                    leftStyle += "bg-gray-500/20 border-gray-500 text-gray-400";
                  } else {
                    leftStyle += "bg-white/10 border-gray-600 text-white hover:border-blue-400";
                  }
                }

                return (
                  <div key={index} className={`matching-item ${leftStyle}`}>
                    <div className="flex items-center justify-between">
                      <span>{pair.left}</span>
                      {matchingPairs[pair.left] && (
                        <>
                          <span className="mx-2">→</span>
                          <span className="font-semibold">{matchingPairs[pair.left]}</span>
                          {showResult && (
                            <span className="ml-2 text-xl">
                              {(() => {
                                const correctPairings = question.correctAnswer as string[];
                                const userPairing = `${pair.left}-${matchingPairs[pair.left]}`;
                                return correctPairings.includes(userPairing) ? '✅' : '❌';
                              })()}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">เลือกคำตอบ</h4>
              {question.pairs?.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const unpairedLeft = question.pairs?.find(p => !matchingPairs[p.left])?.left;
                    if (unpairedLeft && !disabled && !showResult && !showingFeedback) {
                      handleMatching(unpairedLeft, pair.right);
                    }
                  }}
                  disabled={disabled || showResult || Object.values(matchingPairs).includes(pair.right) || showingFeedback}
                  className={`matching-item w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                    Object.values(matchingPairs).includes(pair.right)
                      ? 'matching-item-correct bg-green-500/30 border-green-500 text-green-300'
                      : showingFeedback
                      ? 'bg-gray-500/20 border-gray-500 text-gray-400'
                      : 'bg-white/10 border-gray-600 text-white hover:border-green-400 hover:bg-green-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{pair.right}</span>
                    {Object.values(matchingPairs).includes(pair.right) && (
                      <span className="text-xl">✅</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {showResult && question.correctAnswer && (
            <div className="mt-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
              <h5 className="text-green-300 font-semibold mb-2">คำตอบที่ถูกต้อง:</h5>
              <div className="space-y-2">
                {(question.correctAnswer as string[]).map((pair, index) => {
                  const [left, right] = pair.split('-');
                  return (
                    <div key={index} className="text-green-300">
                      {left} → {right}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );

    case 'ordering':
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white text-center">ลากเพื่อเรียงลำดับ</h4>
          <div className="space-y-3">
            {orderItems.map((item, index) => {
              let itemStyle = "flex items-center gap-3 p-4 rounded-xl text-white border-2 ";
              
              if (showResult) {
                // Show correct answer highlighting
                const correctOrder = question.correctAnswer as string[];
                const isCorrectPosition = correctOrder && correctOrder[index] === item;
                if (isCorrectPosition) {
                  itemStyle += "bg-green-500/20 border-green-500 text-green-300";
                } else {
                  itemStyle += "bg-red-500/20 border-red-500 text-red-300";
                }
              } else {
                itemStyle += "bg-white/10 border-gray-600";
              }

              return (
                <div key={`${item}-${index}`} className={itemStyle}>
                  <span className="text-blue-400 font-bold">{index + 1}.</span>
                  <span className="flex-1">{item}</span>
                  {!disabled && !showResult && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveItem(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded transition-all duration-200"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(index, Math.min(orderItems.length - 1, index + 1))}
                        disabled={index === orderItems.length - 1}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded transition-all duration-200"
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {showResult && question.correctAnswer && (
            <div className="mt-4 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
              <h5 className="text-green-300 font-semibold mb-2">ลำดับที่ถูกต้อง:</h5>
              <div className="space-y-2">
                {(question.correctAnswer as string[]).map((item, index) => (
                  <div key={index} className="text-green-300">
                    {index + 1}. {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!disabled && !showResult && (
            <div className="text-center">
              <button
                onClick={confirmOrder}
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
