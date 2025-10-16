"use client";
import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, RotateCcw, Zap, MousePointer, Trash2 } from "lucide-react";

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
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Shuffle items
  const [rightItems] = useState(() => 
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  );
  const leftItems = pairs.map(p => p.left);

  // Effect to clear state when question/pairs change
  useEffect(() => {
    // Reset all states first to ensure clean start for new question
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setConnections([]);
    setAnimatingPair(null);
    
    // Then restore user answer if exists
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
  }, [pairs]); // Trigger when pairs prop changes

  // Separate effect for handling userAnswer updates
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
    
    // Animate the connection with immediate feedback
    setAnimatingPair({ left: leftId, right: rightId });
    
    setTimeout(() => {
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
    }, 300);
  };

  const handleReset = () => {
    if (showResult) return;
    setMatches({});
    setConnections([]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleRemoveMatch = (leftId: string) => {
    if (showResult) return;
    
    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);
    
    // Update connections
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
        transition-all duration-300 border-2 group
        ${connection?.isCorrect 
          ? 'bg-green-500/20 text-green-300 border-green-500 shadow-lg shadow-green-500/25' 
          : 'bg-red-500/20 text-red-300 border-red-500 shadow-lg shadow-red-500/25'
        }
      `;
    }
    
    return `
      relative p-4 rounded-xl font-semibold text-center cursor-pointer
      transition-all duration-300 border-2 group
      ${isMatched 
        ? 'bg-blue-500/20 text-blue-300 border-blue-500 shadow-lg shadow-blue-500/25' 
        : isSelected 
          ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400 shadow-lg shadow-yellow-400/25 scale-105' 
          : 'bg-white/10 text-white border-gray-300/30 hover:border-blue-400 hover:bg-blue-500/10 shadow-md hover:shadow-lg'
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
          
          {/* Remove button for existing connections (when not in result mode) - Show only on left side */}
          {/* Removed - use the button on the card instead */}
        </div>
      );
    });
  };

  const allMatched = Object.keys(matches).length === pairs.length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          {question}
        </h1>
        
        <div className="flex items-center justify-end space-x-4">          
          {!showResult && (
            <button
              onClick={handleReset}
              className="p-3 bg-gray-500 hover:bg-gray-600 rounded-full transition-colors"
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
      <div ref={containerRef} className="relative mb-12">
        {renderConnections()}
        
        <div className="grid grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
              <MousePointer className="w-5 h-5" />
              คลิกเลือก
            </h3>
            {leftItems.map((item) => {
              const isMatched = !!matches[item.id];
              const matchedRight = matches[item.id];
              
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
                    {isMatched && matchedRight && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <div className="text-sm opacity-75">จับคู่กับ:</div>
                        <div className="text-sm font-bold">
                          {rightItems.find(r => r.id === matchedRight)?.text}
                        </div>
                      </div>
                    )}
                    
                    {/* Remove button */}
                    {isMatched && !showResult && (
                      <button
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
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
                  {!isMatched && selectedLeft && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center space-x-2 text-gray-300">
          <span>ความคืบหน้า:</span>
          <span className="font-semibold text-white">
            {Object.keys(matches).length}/{pairs.length}
          </span>
          {allMatched && !showResult && (
            <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
          )}
        </div>
      </div>
    </div>
  );
}
