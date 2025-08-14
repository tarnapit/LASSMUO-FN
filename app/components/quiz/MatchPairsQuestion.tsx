"use client";
import { useState, useRef, useEffect } from "react";
import { Volume2, CheckCircle, XCircle, RotateCcw, Zap } from "lucide-react";

interface PairItem {
  id: string;
  text: string;
  emoji?: string;
}

interface Pair {
  left: PairItem;
  right: PairItem;
}

interface EnhancedMatchPairsQuestionProps {
  pairs: Pair[];
  onAnswer: (isCorrect: boolean, userAnswer: Record<string, string>) => void;
  showResult: boolean;
  userAnswer?: Record<string, string>;
  question?: string;
}

export default function EnhancedMatchPairsQuestion({
  pairs,
  onAnswer,
  showResult,
  userAnswer,
  question = "จับคู่รายการให้ถูกต้อง"
}: EnhancedMatchPairsQuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [connections, setConnections] = useState<Array<{from: string, to: string, isCorrect?: boolean}>>([]);
  const [animatingPair, setAnimatingPair] = useState<{left: string, right: string} | null>(null);
  const [feedback, setFeedback] = useState<{type: 'correct' | 'incorrect', message: string} | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Shuffle items
  const [rightItems] = useState(() => 
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  );
  const leftItems = pairs.map(p => p.left);

  // Restore user answer
  useEffect(() => {
    if (userAnswer) {
      setMatches(userAnswer);
      const newConnections = Object.entries(userAnswer).map(([leftId, rightId]) => {
        const correctPair = pairs.find(p => p.left.id === leftId);
        return {
          from: leftId,
          to: rightId,
          isCorrect: correctPair?.right.id === rightId
        };
      });
      setConnections(newConnections);
    }
  }, [userAnswer, pairs]);

  const handleLeftClick = (leftId: string) => {
    if (showResult || matches[leftId] || showingFeedback) return;
    
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
      setSelectedRight(null);
    }
  };

  const handleRightClick = (rightId: string) => {
    if (showResult || showingFeedback) return;
    
    // Check if this right item is already matched
    const alreadyMatched = Object.values(matches).includes(rightId);
    if (alreadyMatched) return;
    
    if (selectedRight === rightId) {
      setSelectedRight(null);
    } else {
      setSelectedRight(rightId);
      
      // If we have a left item selected, create a match
      if (selectedLeft) {
        createMatch(selectedLeft, rightId);
      }
    }
  };

  const createMatch = (leftId: string, rightId: string) => {
    const correctPair = pairs.find(p => p.left.id === leftId && p.right.id === rightId);
    const isCorrectMatch = !!correctPair;
    
    // แสดง feedback ทันที
    setShowingFeedback(true);
    setAnimatingPair({ left: leftId, right: rightId });
    
    if (isCorrectMatch) {
      setFeedback({
        type: 'correct',
        message: `✅ ถูกต้อง! "${correctPair?.left.text}" จับคู่กับ "${correctPair?.right.text}"`
      });
    } else {
      const leftItem = pairs.find(p => p.left.id === leftId)?.left.text;
      const rightItem = pairs.find(p => p.right.id === rightId)?.right.text;
      setFeedback({
        type: 'incorrect',
        message: `❌ ไม่ถูกต้อง "${leftItem}" ไม่ได้จับคู่กับ "${rightItem}"`
      });
    }
    
    setTimeout(() => {
      setShowingFeedback(false);
      setFeedback(null);
      
      const newMatches = { ...matches, [leftId]: rightId };
      setMatches(newMatches);
      
      // Update connections with correctness info
      const newConnections = Object.entries(newMatches).map(([left, right]) => {
        const correctPair = pairs.find(p => p.left.id === left && p.right.id === right);
        return {
          from: left,
          to: right,
          isCorrect: !!correctPair
        };
      });
      setConnections(newConnections);
      
      setSelectedLeft(null);
      setSelectedRight(null);
      setAnimatingPair(null);

      // Check if all pairs are matched
      if (Object.keys(newMatches).length === pairs.length) {
        const allCorrect = pairs.every(pair => newMatches[pair.left.id] === pair.right.id);
        setTimeout(() => {
          onAnswer(allCorrect, newMatches);
        }, 500);
      }
    }, 2000);
  };

  const handleReset = () => {
    if (showResult) return;
    setMatches({});
    setConnections([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleSubmit = () => {
    if (showResult || Object.keys(matches).length !== pairs.length) return;
    
    // Check correctness
    const isCorrect = pairs.every(pair => matches[pair.left.id] === pair.right.id);
    
    // Update connections with correctness info
    const updatedConnections = connections.map(conn => {
      const correctPair = pairs.find(p => p.left.id === conn.from);
      return {
        ...conn,
        isCorrect: correctPair?.right.id === conn.to
      };
    });
    setConnections(updatedConnections);
    
    onAnswer(isCorrect, matches);
  };

  const getItemStyle = (itemId: string, side: 'left' | 'right', isMatched: boolean) => {
    const isSelected = (side === 'left' && selectedLeft === itemId) || 
                     (side === 'right' && selectedRight === itemId);
    const isAnimating = animatingPair && 
                       ((side === 'left' && animatingPair.left === itemId) ||
                        (side === 'right' && animatingPair.right === itemId));
    
    if (showResult && isMatched) {
      const connection = connections.find(c => 
        (side === 'left' && c.from === itemId) || 
        (side === 'right' && c.to === itemId)
      );
      
      return `
        matching-item p-4 rounded-xl font-semibold text-center cursor-pointer
        transition-all duration-300 border-2
        ${connection?.isCorrect 
          ? 'matching-item-correct bg-green-500 text-white border-green-500 shadow-lg' 
          : 'matching-item-incorrect bg-red-500 text-white border-red-500 shadow-lg'
        }
      `;
    }
    
    return `
      matching-item p-4 rounded-xl font-semibold text-center cursor-pointer
      transition-all duration-300 border-2
      ${isMatched 
        ? 'matching-item-correct bg-blue-500 text-white border-blue-500 shadow-lg cursor-default' 
        : isSelected 
          ? 'matching-item-selected bg-yellow-400 text-black border-yellow-400 shadow-lg scale-105' 
          : showingFeedback
          ? 'bg-gray-500 text-gray-400 border-gray-500'
          : 'bg-white text-gray-900 border-gray-200 hover:border-blue-400 hover:bg-blue-50 shadow-md hover:shadow-lg'
      }
      ${isAnimating ? 'animate-pulse scale-105' : ''}
    `;
  };

  const renderConnections = () => {
    if (typeof window === 'undefined') return null;
    
    return connections.map((connection, index) => {
      const leftElement = leftRefs.current[connection.from];
      const rightElement = rightRefs.current[connection.to];
      
      if (!leftElement || !rightElement) return null;
      
      const leftRect = leftElement.getBoundingClientRect();
      const rightRect = rightElement.getBoundingClientRect();
      const containerRect = leftElement.closest('.relative')?.getBoundingClientRect();
      
      if (!containerRect) return null;
      
      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
      
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      
      return (
        <div
          key={index}
          className={`absolute origin-left transition-all duration-500 h-1 rounded-full ${
            showResult 
              ? connection.isCorrect 
                ? 'bg-green-400' 
                : 'bg-red-400'
              : 'bg-blue-400'
          }`}
          style={{
            left: `${x1}px`,
            top: `${y1}px`,
            width: `${length}px`,
            transform: `rotate(${angle}deg)`,
            zIndex: 10
          }}
        />
      );
    });
  };

  const allMatched = Object.keys(matches).length === pairs.length;

  return (
    <div className="w-full max-w-6xl mx-auto">
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
            {feedback.type === 'correct' && (
              <div className="mt-2 text-sm opacity-90">ถูกต้อง!</div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          {question}
        </h1>
        
        <div className="flex items-center space-x-4">
          <button
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
            title="ฟังเสียงคำถาม"
            aria-label="ฟังเสียงคำถาม"
          >
            <Volume2 className="w-6 h-6 text-white" />
          </button>
          
          {!showResult && (
            <button
              onClick={handleReset}
              disabled={showingFeedback}
              className="p-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600/50 rounded-full transition-colors"
              title="รีเซ็ตการจับคู่"
              aria-label="รีเซ็ตการจับคู่"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8 text-center">
        <p className="text-gray-300 text-lg">
          คลิกที่รายการฝั่งซ้าย แล้วคลิกที่รายการฝั่งขวาที่ตรงกัน
        </p>
        {selectedLeft && (
          <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg inline-block">
            <p className="text-yellow-400">
              <Zap className="inline w-4 h-4 mr-1" />
              เลือกคู่ที่ตรงกับรายการที่เลือกไว้
            </p>
          </div>
        )}
      </div>

      {/* Matching Area */}
      <div className="relative mb-12">
        {renderConnections()}
        
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 text-center">คลิกเลือก</h3>
            {leftItems.map((item) => (
              <div
                key={item.id}
                ref={el => { leftRefs.current[item.id] = el; }}
                onClick={() => handleLeftClick(item.id)}
                className={getItemStyle(item.id, 'left', !!matches[item.id])}
              >
                {item.emoji && <span className="text-2xl mb-2 block">{item.emoji}</span>}
                <div className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {matches[item.id] && (
                    <span className="text-xl ml-2">
                      {connections.find(c => c.from === item.id)?.isCorrect ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 text-center">จับคู่กับ</h3>
            {rightItems.map((item) => {
              const isMatched = Object.values(matches).includes(item.id);
              return (
                <div
                  key={item.id}
                  ref={el => { rightRefs.current[item.id] = el; }}
                  onClick={() => handleRightClick(item.id)}
                  className={getItemStyle(item.id, 'right', isMatched)}
                >
                  {item.emoji && <span className="text-2xl mb-2 block">{item.emoji}</span>}
                  <div className="flex items-center justify-between">
                    <span>{item.text}</span>
                    {isMatched && (
                      <span className="text-xl ml-2">
                        {connections.find(c => c.to === item.id)?.isCorrect ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {allMatched && !showResult && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            ตรวจสอบคำตอบ
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center space-x-2 text-gray-300">
          <span>ความคืบหน้า:</span>
          <span className="font-semibold text-white">
            {Object.keys(matches).length}/{pairs.length}
          </span>
          {allMatched && !showResult && (
            <CheckCircle className="w-5 h-5 text-green-400 ml-2 progress-celebration" />
          )}
        </div>
      </div>
    </div>
  );
}
