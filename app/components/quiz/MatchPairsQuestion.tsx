"use client";
import { useState, useRef } from "react";

interface PairItem {
  id: string;
  text: string;
  emoji?: string;
}

interface Pair {
  left: PairItem;
  right: PairItem;
}

interface MatchPairsQuestionProps {
  pairs: Pair[];
  onAnswer: (isCorrect: boolean, userAnswer: Record<string, string>) => void;
  showResult: boolean;
  userAnswer?: Record<string, string>;
}

export default function MatchPairsQuestion({
  pairs,
  onAnswer,
  showResult,
  userAnswer
}: MatchPairsQuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [connections, setConnections] = useState<Array<{from: string, to: string}>>([]);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Shuffle the right items initially
  const [rightItems] = useState(() => 
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  );
  const leftItems = pairs.map(p => p.left);

  const handleLeftClick = (leftId: string) => {
    if (showResult || matches[leftId]) return;
    
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
      setSelectedRight(null);
    }
  };

  const handleRightClick = (rightId: string) => {
    if (showResult) return;
    
    // Check if this right item is already matched
    const alreadyMatched = Object.values(matches).includes(rightId);
    if (alreadyMatched) return;
    
    if (selectedLeft) {
      // Make a match
      const newMatches = { ...matches, [selectedLeft]: rightId };
      setMatches(newMatches);
      
      // Update connections for visual lines
      const newConnections = [...connections, { from: selectedLeft, to: rightId }];
      setConnections(newConnections);
      
      setSelectedLeft(null);
      setSelectedRight(null);
      
      // Check if all pairs are matched
      if (Object.keys(newMatches).length === pairs.length) {
        const isCorrect = checkAnswer(newMatches);
        onAnswer(isCorrect, newMatches);
      }
    } else {
      setSelectedRight(rightId === selectedRight ? null : rightId);
    }
  };

  const handleUnmatch = (leftId: string) => {
    if (showResult) return;
    
    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);
    
    // Remove connection
    const newConnections = connections.filter(conn => conn.from !== leftId);
    setConnections(newConnections);
  };

  const checkAnswer = (userMatches: Record<string, string>): boolean => {
    return pairs.every(pair => {
      return userMatches[pair.left.id] === pair.right.id;
    });
  };

  const getLeftItemStyle = (leftId: string): string => {
    const isMatched = matches[leftId];
    const isSelected = selectedLeft === leftId;
    
    if (!showResult) {
      if (isMatched) {
        return "bg-blue-500 text-white border-blue-600 cursor-pointer";
      } else if (isSelected) {
        return "bg-yellow-400 text-black border-yellow-500 cursor-pointer";
      } else {
        return "bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer";
      }
    }
    
    // Show result colors
    if (userAnswer && userAnswer[leftId]) {
      const correctRightId = pairs.find(p => p.left.id === leftId)?.right.id;
      const isCorrect = userAnswer[leftId] === correctRightId;
      return isCorrect 
        ? "bg-green-500 text-white border-green-600"
        : "bg-red-500 text-white border-red-600";
    }
    
    return "bg-gray-300 text-gray-600 border-gray-400";
  };

  const getRightItemStyle = (rightId: string): string => {
    const isMatched = Object.values(matches).includes(rightId);
    const isSelected = selectedRight === rightId;
    
    if (!showResult) {
      if (isMatched) {
        return "bg-blue-500 text-white border-blue-600 cursor-pointer";
      } else if (isSelected) {
        return "bg-yellow-400 text-black border-yellow-500 cursor-pointer";
      } else {
        return "bg-white text-black border-gray-300 hover:bg-gray-100 cursor-pointer";
      }
    }
    
    // Show result colors
    if (userAnswer) {
      const matchedLeftId = Object.entries(userAnswer).find(([_, rightId2]) => rightId2 === rightId)?.[0];
      if (matchedLeftId) {
        const correctRightId = pairs.find(p => p.left.id === matchedLeftId)?.right.id;
        const isCorrect = rightId === correctRightId;
        return isCorrect 
          ? "bg-green-500 text-white border-green-600"
          : "bg-red-500 text-white border-red-600";
      }
    }
    
    return "bg-gray-300 text-gray-600 border-gray-400";
  };

  const renderConnectionLines = () => {
    return connections.map((conn, index) => {
      const leftElement = leftRefs.current[conn.from];
      const rightElement = rightRefs.current[conn.to];
      
      if (!leftElement || !rightElement) return null;
      
      const leftRect = leftElement.getBoundingClientRect();
      const rightRect = rightElement.getBoundingClientRect();
      const containerRect = leftElement.closest('.match-container')?.getBoundingClientRect();
      
      if (!containerRect) return null;
      
      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
      
      const isCorrect = showResult && userAnswer ? 
        pairs.find(p => p.left.id === conn.from)?.right.id === conn.to : true;
      
      return (
        <line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={showResult ? (isCorrect ? "#10B981" : "#EF4444") : "#3B82F6"}
          strokeWidth="3"
          className="transition-all duration-300"
        />
      );
    });
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center text-white mb-6">
        <h3 className="text-lg font-semibold">จับคู่รายการด้านซ้ายกับด้านขวาให้ถูกต้อง</h3>
        <p className="text-gray-300 text-sm mt-2">คลิกรายการด้านซ้าย แล้วคลิกรายการด้านขวาเพื่อจับคู่</p>
      </div>

      <div className="match-container relative bg-gray-900/50 rounded-xl p-8">
        {/* Connection Lines SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 top-0 left-0"
        >
          {renderConnectionLines()}
        </svg>

        <div className="grid grid-cols-2 gap-8 relative z-20">
          {/* Left Column */}
          <div className="space-y-4">
            <h4 className="text-center text-white font-semibold mb-4">รายการที่ 1</h4>
            {leftItems.map((item) => (
              <div
                key={item.id}
                ref={(el) => { leftRefs.current[item.id] = el; }}
                onClick={() => handleLeftClick(item.id)}
                className={`
                  p-4 rounded-lg border-2 font-medium text-center transition-all duration-200
                  ${getLeftItemStyle(item.id)}
                  ${matches[item.id] ? 'relative' : ''}
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  {item.emoji && (
                    <span className="text-lg">{item.emoji}</span>
                  )}
                  <span>{item.text}</span>
                </div>
                
                {matches[item.id] && !showResult && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnmatch(item.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h4 className="text-center text-white font-semibold mb-4">รายการที่ 2</h4>
            {rightItems.map((item) => (
              <div
                key={item.id}
                ref={(el) => { rightRefs.current[item.id] = el; }}
                onClick={() => handleRightClick(item.id)}
                className={`
                  p-4 rounded-lg border-2 font-medium text-center transition-all duration-200
                  ${getRightItemStyle(item.id)}
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  {item.emoji && (
                    <span className="text-lg">{item.emoji}</span>
                  )}
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selection Status */}
      {!showResult && (
        <div className="text-center text-gray-300">
          {selectedLeft && (
            <p className="text-yellow-400">
              เลือกแล้ว: {leftItems.find(item => item.id === selectedLeft)?.text} - คลิกรายการด้านขวาเพื่อจับคู่
            </p>
          )}
          {!selectedLeft && Object.keys(matches).length < pairs.length && (
            <p>คลิกรายการด้านซ้ายเพื่อเริ่มจับคู่</p>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="text-center text-white">
        <div className="bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className={`bg-blue-500 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${(Object.keys(matches).length / pairs.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-300">
          จับคู่แล้ว: {Object.keys(matches).length} / {pairs.length}
        </p>
      </div>

      {/* Result Summary */}
      {showResult && userAnswer && (
        <div className="text-center space-y-4">
          {checkAnswer(userAnswer) ? (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-green-600 text-2xl">✅</span>
                <span className="text-green-700 font-bold text-lg">ยอดเยี่ยม!</span>
              </div>
              <p className="text-green-800">คุณจับคู่ได้ถูกต้องทั้งหมด!</p>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-red-600 text-2xl">❌</span>
                <span className="text-red-700 font-bold text-lg">ยังไม่ถูกต้อง</span>
              </div>
              <p className="text-red-800">ลองดูการจับคู่ที่ถูกต้องสิ</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
