"use client";
import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, RotateCcw, Zap, MousePointer, Trash2, Link2, Sparkles, Target } from "lucide-react";
import "../../styles/quiz-enhanced.css";

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
  questionIndex?: number; // Add question index for better state tracking
}

export default function EnhancedMatchPairsQuestion({
  pairs,
  onAnswer,
  showResult,
  userAnswer,
  question = "จับคู่รายการให้ถูกต้อง",
  questionIndex = 0
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

  // Shuffle items - use key to force re-shuffle on question change
  const [rightItems] = useState(() => 
    [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5)
  );
  const leftItems = pairs.map(p => p.left);

  // Effect to initialize/reset component state
  useEffect(() => {
    console.log('🔄 MatchPairs: Initializing component for question:', questionIndex);
    
    // Initialize with clean state
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setConnections([]);
    setAnimatingPair(null);
    setHoveredConnection(null);
    
    return () => {
      // Cleanup on unmount
      console.log('🧹 MatchPairs: Cleaning up component for question:', questionIndex);
    };
  }, []); // Run only on mount

  // Effect to clear state when question/pairs change
  useEffect(() => {
    console.log('🔄 MatchPairs: Resetting state for new question/pairs:', {
      questionIndex: questionIndex,
      pairsLength: pairs.length,
      pairsData: pairs,
      userAnswer: userAnswer
    });
    
    // Reset all states first to ensure clean start for new question
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setConnections([]);
    setAnimatingPair(null);
    setHoveredConnection(null);
    
    // Then restore user answer if exists and is valid for current pairs
    if (userAnswer && Object.keys(userAnswer).length > 0) {
      // Validate userAnswer against current pairs
      const validAnswers: Record<string, string> = {};
      const pairIds = pairs.map(p => p.left.id);
      
      Object.entries(userAnswer).forEach(([leftId, rightId]) => {
        if (pairIds.includes(leftId)) {
          validAnswers[leftId] = rightId;
        }
      });
      
      console.log('🔄 Restoring valid user answers:', validAnswers);
      
      if (Object.keys(validAnswers).length > 0) {
        setMatches(validAnswers);
        const newConnections = Object.entries(validAnswers).map(([leftId, rightId]) => {
          const correctPair = pairs.find(p => p.left.id === leftId);
          return {
            from: leftId,
            to: rightId,
            isCorrect: correctPair?.right.id === rightId
          };
        });
        setConnections(newConnections);
      }
    }
  }, [pairs, question, questionIndex]); // Add questionIndex as dependency to ensure reset on question change

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
        match-item relative p-6 rounded-xl font-bold text-center cursor-pointer
        transition-all duration-500 border-2 shadow-xl transform
        ${connection?.isCorrect 
          ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 text-green-800 border-green-400 shadow-green-500/40 scale-105' 
          : 'bg-gradient-to-br from-red-500/30 to-pink-500/30 text-red-800 border-red-400 shadow-red-500/40'
        }
      `;
    }
    
    return `
      match-item relative p-6 rounded-xl font-bold text-center cursor-pointer
      transition-all duration-500 border-2 shadow-xl transform hover:scale-105
      ${isMatched 
        ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-blue-800 border-blue-400 shadow-blue-500/40 scale-105' 
        : isSelected 
          ? 'bg-gradient-to-br from-yellow-400/30 to-orange-400/30 text-yellow-200 border-yellow-400 shadow-yellow-400/40 scale-110' 
          : 'bg-gradient-to-br from-white/10 to-gray-200/10 text-white border-gray-300/50 hover:border-blue-400 hover:from-blue-500/20 hover:to-purple-500/20 shadow-md hover:shadow-xl'
      }
      ${isAnimating ? 'animate-pulse scale-110 shadow-2xl' : ''}
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
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg match-pair-icon">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg match-pair-icon">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl shadow-lg match-pair-icon">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          {question}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6"></div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center mb-8">
        {!showResult && (
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            title="รีเซ็ตการจับคู่"
            aria-label="รีเซ็ตการจับคู่"
          >
            <RotateCcw className="w-5 h-5" />
            <span>รีเซ็ต</span>
          </button>
        )}
      </div>

      {/* Enhanced Instructions */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/50 rounded-xl shadow-lg">
          <MousePointer className="w-5 h-5 text-blue-400" />
          <p className="text-white text-lg font-medium">
            คลิกที่รายการฝั่งซ้าย แล้วคลิกที่รายการฝั่งขวาที่ตรงกัน
          </p>
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        {selectedLeft && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/70 rounded-xl inline-block shadow-lg">
            <p className="text-yellow-400 font-semibold flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>เลือกคู่ที่ตรงกับรายการที่เลือกไว้</span>
              <Target className="w-5 h-5" />
            </p>
          </div>
        )}
      </div>

      {/* Matching Area */}
      <div ref={containerRef} className="relative mb-12">
        {renderConnections()}
        
        <div className="grid grid-cols-2 gap-12">
          {/* Enhanced Left Column */}
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <MousePointer className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold text-white">คลิกเลือก</h3>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
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
                    <div className="font-medium text-gray-900">{item.text}</div>
                    
                    {/* Show matched item */}
                    {isMatched && matchedRight && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <div className="text-sm opacity-75">จับคู่กับ:</div>
                        <div className="text-sm font-bold">
                          {rightItems.find(r => r.id === matchedRight)?.text}
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Remove button */}
                    {isMatched && !showResult && (
                      <button
                        className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMatch(item.id);
                        }}
                        title="ลบการจับคู่"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Right Column */}
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Zap className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold text-white">จับคู่กับ</h3>
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
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
                  <div className="font-medium text-gray-900">{item.text}</div>
                  
                  {/* Enhanced Availability indicator */}
                  {!isMatched && selectedLeft && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                    </div>
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
