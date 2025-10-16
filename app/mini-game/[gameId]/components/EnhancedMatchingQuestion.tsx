"use client";
import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, RotateCcw, Zap, MousePointer, Trash2 } from "lucide-react";

interface MatchingPair {
  left: { id: string; text: string; emoji?: string };
  right: { id: string; text: string; emoji?: string };
}

interface EnhancedMatchingQuestionProps {
  question: string;
  pairs: MatchingPair[];
  onAnswer: (answer: Record<string, string>) => void;
  showResult: boolean;
  userAnswer?: Record<string, string> | null;
  disabled?: boolean;
}

export default function EnhancedMatchingQuestion({
  question,
  pairs,
  onAnswer,
  showResult,
  userAnswer,
  disabled = false
}: EnhancedMatchingQuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [connections, setConnections] = useState<Array<{from: string, to: string, isCorrect?: boolean}>>([]);
  const [animatingPair, setAnimatingPair] = useState<{left: string, right: string} | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Shuffle right items
  const [rightItems] = useState(() => 
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  );
  const leftItems = pairs.map(p => p.left);

  // Initialize state
  useEffect(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setConnections([]);
    setAnimatingPair(null);
    
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
  }, [pairs, userAnswer]);

  const handleLeftClick = (leftId: string) => {
    if (showResult || disabled || matches[leftId]) return;
    
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
      setSelectedRight(null);
    }
  };

  const handleRightClick = (rightId: string) => {
    if (showResult || disabled) return;
    
    const alreadyMatched = Object.values(matches).includes(rightId);
    if (alreadyMatched) return;
    
    if (selectedRight === rightId) {
      setSelectedRight(null);
    } else {
      setSelectedRight(rightId);
      
      if (selectedLeft) {
        createMatch(selectedLeft, rightId);
      }
    }
  };

  const createMatch = (leftId: string, rightId: string) => {
    const correctPair = pairs.find(p => p.left.id === leftId && p.right.id === rightId);
    
    setAnimatingPair({ left: leftId, right: rightId });
    
    setTimeout(() => {
      const newMatches = { ...matches, [leftId]: rightId };
      setMatches(newMatches);
      
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

      if (Object.keys(newMatches).length === pairs.length) {
        setTimeout(() => {
          onAnswer(newMatches);
        }, 500);
      }
    }, 300);
  };

  const handleRemoveMatch = (leftId: string) => {
    if (showResult || disabled) return;
    
    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);
    
    const newConnections = Object.entries(newMatches).map(([left, right]) => {
      const correctPair = pairs.find(p => p.left.id === left && p.right.id === right);
      return {
        from: left,
        to: right,
        isCorrect: !!correctPair
      };
    });
    setConnections(newConnections);
  };

  const handleReset = () => {
    if (showResult || disabled) return;
    setMatches({});
    setConnections([]);
    setSelectedLeft(null);
    setSelectedRight(null);
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
        relative p-4 rounded-xl font-semibold text-center cursor-pointer
        transition-all duration-300 border-2 group min-h-[80px] flex flex-col justify-center
        ${connection?.isCorrect 
          ? 'bg-green-500/20 text-green-300 border-green-500 shadow-lg shadow-green-500/25' 
          : 'bg-red-500/20 text-red-300 border-red-500 shadow-lg shadow-red-500/25'
        }
      `;
    }
    
    return `
      relative p-4 rounded-xl font-semibold text-center cursor-pointer
      transition-all duration-300 border-2 group min-h-[80px] flex flex-col justify-center
      ${isMatched 
        ? 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-lg shadow-blue-500/25' 
        : isSelected 
          ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400 shadow-lg shadow-yellow-400/25 scale-105 ring-2 ring-yellow-400/50' 
          : 'bg-white/10 text-white border-gray-300/30 hover:border-blue-400 hover:bg-blue-500/10 shadow-md hover:shadow-lg hover:scale-102'
      }
      ${isAnimating ? 'animate-pulse scale-105' : ''}
    `;
  };

  const renderConnections = () => {
    if (typeof window === 'undefined' || !containerRef.current) return null;
    
    return connections.map((connection, index) => {
      const leftElement = leftRefs.current[connection.from];
      const rightElement = rightRefs.current[connection.to];
      
      if (!leftElement || !rightElement) return null;
      
      const containerRect = containerRef.current!.getBoundingClientRect();
      const leftRect = leftElement.getBoundingClientRect();
      const rightRect = rightElement.getBoundingClientRect();
      
      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
      
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      
      const isHovered = hoveredConnection === `${connection.from}-${connection.to}`;
      const lineStyle = {
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
        zIndex: isHovered ? 20 : 10
      };

      return (
        <div key={index} className="absolute">
          {/* Connection line */}
          <div
            className={`absolute origin-left transition-all duration-500 h-1 rounded-full ${
              showResult 
                ? connection.isCorrect 
                  ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                  : 'bg-red-400 shadow-lg shadow-red-400/50'
                : isHovered
                  ? 'bg-yellow-400 h-2 shadow-lg shadow-yellow-400/50'
                  : 'bg-blue-400 shadow-md shadow-blue-400/30'
            }`}
            style={lineStyle}
            onMouseEnter={() => setHoveredConnection(`${connection.from}-${connection.to}`)}
            onMouseLeave={() => setHoveredConnection(null)}
          />
          
          {/* Start point */}
          <div
            className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${
              showResult 
                ? connection.isCorrect 
                  ? 'bg-green-400' 
                  : 'bg-red-400'
                : 'bg-blue-400'
            }`}
            style={{
              left: `${x1 - 6}px`,
              top: `${y1 - 6}px`,
              zIndex: isHovered ? 21 : 11
            }}
          />
          
          {/* End point */}
          <div
            className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${
              showResult 
                ? connection.isCorrect 
                  ? 'bg-green-400' 
                  : 'bg-red-400'
                : 'bg-blue-400'
            }`}
            style={{
              left: `${x2 - 6}px`,
              top: `${y2 - 6}px`,
              zIndex: isHovered ? 21 : 11
            }}
          />
          
          {/* Remove button */}
          {!showResult && !disabled && (
            <button
              className="absolute w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs transition-all duration-200 hover:scale-110 flex items-center justify-center"
              style={{
                left: `${(x1 + x2) / 2 - 12}px`,
                top: `${(y1 + y2) / 2 - 12}px`,
                zIndex: 22
              }}
              onClick={() => handleRemoveMatch(connection.from)}
              title="ลบการจับคู่"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      );
    });
  };

  const allMatched = Object.keys(matches).length === pairs.length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {question}
        </h2>
        
        <div className="flex justify-center items-center gap-4 mb-6">
          {!showResult && !disabled && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-300 transition-all"
              title="รีเซ็ตการจับคู่"
            >
              <RotateCcw className="w-4 h-4" />
              รีเซ็ต
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-3">
        <p className="text-gray-300 text-lg">
          คลิกที่รายการฝั่งซ้าย แล้วคลิกที่รายการฝั่งขวาที่ตรงกัน
        </p>
        {selectedLeft && !disabled && !showResult && (
          <div className="inline-block p-3 bg-yellow-900/30 rounded-lg">
            <p className="text-yellow-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              เลือกคู่ที่ตรงกับรายการที่เลือกไว้
            </p>
          </div>
        )}
      </div>

      {/* Matching Area */}
      <div ref={containerRef} className="relative">
        {renderConnections()}
        
        <div className="grid grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
              <MousePointer className="w-5 h-5" />
              คลิกเลือก
            </h3>
            {leftItems.map((item) => {
              const isMatched = !!matches[item.id];
              const matchedRight = matches[item.id];
              const rightItem = rightItems.find(r => r.id === matchedRight);
              
              return (
                <div key={item.id} className="relative">
                  <div
                    ref={el => { leftRefs.current[item.id] = el; }}
                    onClick={() => handleLeftClick(item.id)}
                    className={getItemStyle(item.id, 'left', isMatched)}
                  >
                    {item.emoji && <span className="text-2xl mb-2 block">{item.emoji}</span>}
                    <div className="font-medium">{item.text}</div>
                    
                    {/* Show matched item */}
                    {isMatched && rightItem && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <div className="text-xs opacity-75">จับคู่กับ:</div>
                        <div className="text-sm font-bold">{rightItem.text}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Remove button */}
                  {isMatched && !showResult && !disabled && (
                    <button
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs transition-all duration-200 hover:scale-110 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMatch(item.id);
                      }}
                      title="ลบการจับคู่"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              จับคู่กับ
            </h3>
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
                  <div className="font-medium">{item.text}</div>
                  
                  {/* Availability indicator */}
                  {!isMatched && selectedLeft && !disabled && !showResult && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress and Status */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-gray-300">
          <span>ความคืบหน้า:</span>
          <span className="font-semibold text-white">
            {Object.keys(matches).length}/{pairs.length}
          </span>
          {allMatched && !showResult && (
            <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
          )}
        </div>

        {/* Show result when answered */}
        {showResult && (
          <div className="space-y-4">
            {pairs.every(pair => matches[pair.left.id] === pair.right.id) ? (
              <div className="flex items-center justify-center gap-2 text-green-400 text-xl font-bold">
                <CheckCircle className="w-8 h-8" />
                <span>🎉 ยอดเยี่ยม! จับคู่ถูกต้องทั้งหมด!</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-red-400 text-xl font-bold">
                  <XCircle className="w-8 h-8" />
                  <span>💪 มีบางคู่ที่ยังไม่ถูกต้อง ลองใหม่นะ!</span>
                </div>
                
                <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-6">
                  <h4 className="text-green-300 font-semibold mb-4 text-lg">🎯 การจับคู่ที่ถูกต้อง:</h4>
                  <div className="grid gap-3">
                    {pairs.map((pair, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                        <div className="text-green-300 font-medium">
                          {pair.left.emoji && <span className="mr-2">{pair.left.emoji}</span>}
                          {pair.left.text}
                        </div>
                        <div className="text-green-400 text-xl">→</div>
                        <div className="text-green-300 font-medium">
                          {pair.right.emoji && <span className="mr-2">{pair.right.emoji}</span>}
                          {pair.right.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}