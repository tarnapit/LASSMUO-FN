"use client";
import { useState, useEffect } from "react";
import { InteractiveActivity } from "../../types/learning";
import { CheckCircle, XCircle, Clock, Star, Trophy, RotateCcw } from "lucide-react";

interface InteractiveActivityProps {
  activity: InteractiveActivity;
  onComplete: (score: number, timeSpent: number, passed: boolean) => void;
  required?: boolean;
  minimumScore?: number;
  key?: string; // เพิ่ม key เพื่อให้ component รีเซ็ตเมื่อกิจกรรมเปลี่ยน
}

export default function InteractiveActivityComponent({ 
  activity, 
  onComplete, 
  required = false, 
  minimumScore = 0 
}: InteractiveActivityProps) {
  const [startTime] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimite || 0);
  const [attempts, setAttempts] = useState(0);
  const [passed, setPassed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // รีเซ็ต component เมื่อ activity เปลี่ยน
  useEffect(() => {
    setIsCompleted(false);
    setScore(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setTimeRemaining(activity.timeLimite || 0);
    setAttempts(0);
    setPassed(false);
    setShowHint(false);
  }, [activity.id, activity.timeLimite]);

  // Timer effect
  useEffect(() => {
    if (activity.timeLimite && timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev: number) => {
          if (prev <= 1) {
            // Time's up!
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isCompleted, activity.timeLimite]);

  const handleTimeUp = () => {
    setIsCompleted(true);
    setShowFeedback(true);
    setIsCorrect(false);
    setPassed(false);
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    console.log(`Activity ${activity.id} time up, calling onComplete with passed=false`);
    onComplete(0, timeSpent, false);
  };

  const handleAnswer = (correct: boolean, earnedScore: number = 0) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    const finalScore = correct ? earnedScore : 0;
    const activityPassed = finalScore >= (activity.passingScore || minimumScore);
    
    console.log(`Activity ${activity.id} answer: correct=${correct}, score=${finalScore}, passed=${activityPassed}, passingScore=${activity.passingScore}, minimumScore=${minimumScore}`);
    
    setIsCorrect(correct);
    setScore(finalScore);
    setPassed(activityPassed);
    setShowFeedback(true);
    
    // ถ้าผ่านแล้วหรือใช้ครั้งครบ
    if (activityPassed || (activity.maxAttempts && newAttempts >= activity.maxAttempts)) {
      setIsCompleted(true);
      console.log(`Activity ${activity.id} completed, calling onComplete with passed=${activityPassed}`);
      // เรียกทันทีไม่ต้อง setTimeout
      onComplete(finalScore, timeSpent, activityPassed);
    } else {
      // แสดงคำใบ้ถ้ามี
      if (activity.feedback?.hint && !correct) {
        setShowHint(true);
      }
      console.log(`Activity ${activity.id} not passed yet, attempts: ${newAttempts}/${activity.maxAttempts}`);
    }
  };

  const resetActivity = () => {
    setIsCompleted(false);
    setShowFeedback(false);
    setScore(0);
    setShowHint(false);
    setTimeRemaining(activity.timeLimite || 0);
    // ไม่รีเซ็ต attempts เพื่อให้นับสะสม
  };

  const renderActivity = () => {
    switch (activity.type) {
      case 'matching':
        return <MatchingGame activity={activity} onAnswer={handleAnswer} disabled={isCompleted} />;
      case 'fill-blanks':
        return <FillBlanksGame activity={activity} onAnswer={handleAnswer} disabled={isCompleted} />;
      case 'multiple-choice':
        return <MultipleChoiceGame activity={activity} onAnswer={handleAnswer} disabled={isCompleted} />;
      case 'image-identification':
        return <ImageIdentificationGame activity={activity} onAnswer={handleAnswer} disabled={isCompleted} />;
      case 'true-false':
        return <TrueFalseGame activity={activity} onAnswer={handleAnswer} disabled={isCompleted} />;
      case 'sentence-ordering':
        return <SentenceOrderingGame activity={activity} onAnswer={handleAnswer} disabled={isCompleted} />;
      case 'range-answer':
        return <RangeAnswerGame activity={activity} onAnswer={handleAnswer} disabled={isCompleted} />;
      default:
        return <div>กิจกรรมนี้ยังไม่รองรับ</div>;
    }
  };

  return (
    <div className={`bg-gradient-to-br rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all ${
      required 
        ? 'from-purple-600/30 to-pink-600/30 border-purple-500/50 shadow-lg shadow-purple-500/20' 
        : 'from-purple-500/20 to-blue-500/20 border-purple-500/30'
    }`}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
              <Star className="text-yellow-400 mr-2 flex-shrink-0" size={20} />
              <span className="line-clamp-2">{activity.title}</span>
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {required && (
                <span className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-xs font-normal">
                  บังคับ
                </span>
              )}
              {activity.difficulty && (
                <span className={`px-2 py-1 rounded text-xs font-normal ${
                  activity.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/20 border border-green-500/40 text-green-300' :
                  activity.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300' :
                  'bg-red-500/20 border border-red-500/40 text-red-300'
                }`}>
                  {activity.difficulty.toLowerCase() === 'easy' ? 'ง่าย' : 
                   activity.difficulty.toLowerCase() === 'medium' ? 'ปานกลาง' : 'ยาก'}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {activity.timeLimite && (
              <div className={`flex items-center px-2 sm:px-3 py-1 rounded-lg text-sm ${
                timeRemaining <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                <Clock size={14} className="mr-1 flex-shrink-0" />
                <span className="font-mono font-bold">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            
            {activity.maxAttempts && (
              <div className="flex items-center px-2 sm:px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400">
                <span className="text-xs sm:text-sm">
                  ลองได้: {attempts}/{activity.maxAttempts}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{activity.instruction}</p>
        
        <div className="flex flex-col sm:flex-row sm:items-center mt-3 gap-2 sm:gap-4">
          {activity.point && (
            <div className="flex items-center text-yellow-400 text-xs sm:text-sm">
              <Trophy size={14} className="mr-1 flex-shrink-0" />
              คะแนนเต็ม: {activity.point} แต้ม
            </div>
          )}
          
          {(activity.passingScore || minimumScore > 0) && (
            <div className="flex items-center text-green-400 text-xs sm:text-sm">
              <CheckCircle size={14} className="mr-1 flex-shrink-0" />
              ผ่าน: {activity.passingScore || minimumScore} แต้ม
            </div>
          )}
        </div>
      </div>

      {/* Activity Content */}
      <div className="mb-4 sm:mb-6">
        {renderActivity()}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`p-3 sm:p-4 rounded-lg border mb-4 ${
          passed 
            ? 'bg-green-500/20 border-green-500/40 text-green-300' 
            : 'bg-red-500/20 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center mb-2">
            {passed ? (
              <CheckCircle size={18} className="mr-2 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle size={18} className="mr-2 text-red-400 flex-shrink-0" />
            )}
            <span className="font-semibold text-sm sm:text-base">
              {passed ? 'ผ่าน!' : (isCorrect ? 'ถูกต้อง แต่คะแนนไม่พอ' : 'ไม่ถูกต้อง')}
            </span>
            {score > 0 && (
              <span className="ml-2 text-yellow-400 font-bold text-sm sm:text-base">+{score} แต้ม</span>
            )}
          </div>
          
          <p className="text-xs sm:text-sm mb-2 leading-relaxed">
            {passed ? activity.feedback?.correct : activity.feedback?.incorrect}
          </p>
          
          {showHint && activity.feedback?.hint && (
            <div className="mt-3 p-2 sm:p-3 bg-blue-500/20 border border-blue-500/40 rounded text-blue-300">
              <div className="flex items-center mb-1">
                <span className="text-xs sm:text-sm font-semibold">💡 คำใบ้:</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{activity.feedback.hint}</p>
            </div>
          )}
          
          {!passed && !isCompleted && (
            <button
              onClick={resetActivity}
              className="mt-3 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs sm:text-sm flex items-center"
            >
              <RotateCcw size={14} className="mr-2 flex-shrink-0" />
              ลองใหม่
            </button>
          )}
          
          {required && !passed && isCompleted && (
            <div className="mt-3 p-2 sm:p-3 bg-red-600/20 border border-red-600/40 rounded text-red-300">
              <div className="flex items-start sm:items-center">
                <XCircle size={14} className="mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                  ต้องผ่านกิจกรรมนี้ก่อนถึงจะไปต่อได้
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Component สำหรับเกมจับคู่
function MatchingGame({ activity, onAnswer, disabled }: any) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matches, setMatches] = useState<Array<{left: number, right: number, isCorrect: boolean}>>([]);
  const [shuffledRight, setShuffledRight] = useState<Array<{item: string, originalIndex: number}>>([]);
  const [feedback, setFeedback] = useState<{type: 'correct' | 'incorrect', message: string} | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);

  useEffect(() => {
    const data = activity.data;
    if (data.pairs) {
      // สุ่มลำดับข้อมูลฝั่งขวา
      const rightItems = data.pairs.map((pair: any, index: number) => ({
        item: pair.right,
        originalIndex: index
      }));
      setShuffledRight(rightItems.sort(() => Math.random() - 0.5));
    }
  }, [activity]);

  const handleLeftClick = (index: number) => {
    if (disabled) return;
    setSelectedLeft(index);
    if (selectedRight !== null) {
      checkMatch(index, selectedRight);
    }
  };

  const handleRightClick = (index: number) => {
    if (disabled) return;
    setSelectedRight(index);
    if (selectedLeft !== null) {
      checkMatch(selectedLeft, index);
    }
  };

  const checkMatch = (leftIndex: number, rightIndex: number) => {
    const rightOriginalIndex = shuffledRight[rightIndex].originalIndex;
    const isCorrect = leftIndex === rightOriginalIndex;
    
    // แสดง feedback ทันที
    setShowingFeedback(true);
    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: `✅ ถูกต้อง! "${activity.data.pairs[leftIndex].left}" และ "${activity.data.pairs[leftIndex].right}" จับคู่กันได้`
      });
    } else {
      setFeedback({
        type: 'incorrect', 
        message: `❌ ไม่ถูกต้อง "${activity.data.pairs[leftIndex].left}" ไม่ได้จับคู่กับ "${shuffledRight[rightIndex].item}"`
      });
    }
    
    setTimeout(() => {
      setShowingFeedback(false);
      setFeedback(null);
      
      if (isCorrect) {
        // ถูกต้อง - เพิ่มการจับคู่
        setMatches(prev => [...prev, { left: leftIndex, right: rightIndex, isCorrect: true }]);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        if (matches.length + 1 === activity.data.pairs.length) {
          // เสร็จแล้ว
          setTimeout(() => onAnswer(true, activity.point || 10), 500);
        }
      } else {
        // ผิด - ล้างการเลือก
        setSelectedLeft(null);
        setSelectedRight(null);
      }
    }, 2000);
  };

  const isMatched = (side: 'left' | 'right', index: number) => {
    return matches.some(match => 
      side === 'left' ? match.left === index : match.right === index
    );
  };

  if (!activity.data.pairs) return <div>ข้อมูลไม่ถูกต้อง</div>;

  return (
    <div className="space-y-6">
      {/* Feedback overlay */}
      {showingFeedback && feedback && (
        <div className="feedback-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`
            feedback-modal max-w-sm sm:max-w-md mx-4 p-4 sm:p-6 rounded-xl border-2 text-center transform transition-all duration-300 scale-100
            ${feedback.type === 'correct' 
              ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/50' 
              : 'bg-red-500/90 border-red-400 text-white shadow-red-500/50'
            } shadow-2xl
          `}>
            <div className="text-3xl sm:text-4xl mb-2">
              {feedback.type === 'correct' ? '🎉' : '💭'}
            </div>
            <p className="text-base sm:text-lg font-semibold leading-relaxed">{feedback.message}</p>
            {feedback.type === 'correct' && (
              <div className="mt-2 text-xs sm:text-sm opacity-90">+{Math.floor((activity.point || 10) / activity.data.pairs.length)} แต้ม</div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ฝั่งซ้าย */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">จับคู่รายการ</h4>
          {activity.data.pairs.map((pair: any, index: number) => {
            const matchInfo = matches.find(m => m.left === index);
            return (
              <button
                key={index}
                onClick={() => handleLeftClick(index)}
                disabled={disabled || isMatched('left', index) || showingFeedback}
                className={`
                  matching-item w-full p-2 sm:p-3 rounded-lg border-2 transition-all text-left text-sm sm:text-base
                  ${matchInfo
                    ? matchInfo.isCorrect
                      ? 'matching-item-correct bg-green-500/30 border-green-500 text-green-300 shadow-lg'
                      : 'matching-item-incorrect bg-red-500/30 border-red-500 text-red-300'
                    : selectedLeft === index
                    ? 'matching-item-selected bg-yellow-500/20 border-yellow-500 text-yellow-300 scale-105 shadow-lg'
                    : showingFeedback
                    ? 'bg-gray-500/20 border-gray-500 text-gray-400'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-blue-400'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{pair.left}</span>
                  {matchInfo && (
                    <span className="text-xl">
                      {matchInfo.isCorrect ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ฝั่งขวา */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">เลือกคำตอบ</h4>
          {shuffledRight.map((item, index) => {
            const isMatched = matches.some(m => m.right === index);
            return (
              <button
                key={index}
                onClick={() => handleRightClick(index)}
                disabled={disabled || isMatched || showingFeedback}
                className={`
                  matching-item w-full p-2 sm:p-3 rounded-lg border-2 transition-all text-left text-sm sm:text-base
                  ${isMatched
                    ? 'matching-item-correct bg-green-500/30 border-green-500 text-green-300 shadow-lg'
                    : selectedRight === index
                    ? 'matching-item-selected bg-yellow-500/20 border-yellow-500 text-yellow-300 scale-105 shadow-lg'
                    : showingFeedback
                    ? 'bg-gray-500/20 border-gray-500 text-gray-400'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-blue-400'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{item.item}</span>
                  {isMatched && <span className="text-xl">✅</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ความคืบหน้า */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-gray-300">
          <span>ความคืบหน้า:</span>
          <span className="font-semibold text-white">
            {matches.length}/{activity.data.pairs.length}
          </span>
          {matches.length === activity.data.pairs.length && (
            <span className="progress-celebration text-green-400 text-xl ml-2">🎉</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Component สำหรับเติมคำในช่องว่าง
function FillBlanksGame({ activity, onAnswer, disabled }: any) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [usedOptions, setUsedOptions] = useState<number[]>([]);

  const data = activity.data;
  const blanks = (data.sentence.match(/{blank}/g) || []).length;

  const handleOptionClick = (option: string, optionIndex: number) => {
    if (disabled || usedOptions.includes(optionIndex)) return;

    if (selectedAnswers.length < blanks) {
      setSelectedAnswers(prev => [...prev, option]);
      setUsedOptions(prev => [...prev, optionIndex]);
      
      if (selectedAnswers.length + 1 === blanks) {
        // ตรวจสอบคำตอบ
        setTimeout(() => {
          const newAnswers = [...selectedAnswers, option];
          const isCorrect = JSON.stringify(newAnswers) === JSON.stringify(data.correctAnswers);
          onAnswer(isCorrect, isCorrect ? (activity.point || 10) : 0);
        }, 500);
      }
    }
  };

  const renderSentence = () => {
    let sentence = data.sentence;
    let answerIndex = 0;
    
    sentence = sentence.replace(/{blank}/g, () => {
      const answer = selectedAnswers[answerIndex];
      answerIndex++;
      return answer ? 
        `<span class="bg-yellow-500/20 border border-yellow-500/40 px-2 py-1 rounded text-yellow-300 font-semibold">${answer}</span>` :
        `<span class="bg-white/10 border border-white/20 px-4 py-1 rounded text-gray-400">_____</span>`;
    });
    
    return <div dangerouslySetInnerHTML={{ __html: sentence }} className="text-lg text-white leading-relaxed" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-4 rounded-lg">
        {renderSentence()}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {data.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option, index)}
            disabled={disabled || usedOptions.includes(index)}
            className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
              usedOptions.includes(index)
                ? 'bg-gray-500/20 border-gray-500/40 text-gray-500'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedAnswers.length > 0 && (
        <button
          onClick={() => {
            setSelectedAnswers([]);
            setUsedOptions([]);
          }}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm"
        >
          ล้างคำตอบ
        </button>
      )}
    </div>
  );
}

// Component สำหรับคำถามปรนัย
function MultipleChoiceGame({ activity, onAnswer, disabled }: any) {
  const data = activity.data;

  const handleChoiceClick = (choiceIndex: number) => {
    if (disabled) return;
    const isCorrect = choiceIndex === data.correctAnswer;
    onAnswer(isCorrect, isCorrect ? (activity.point || 10) : 0);
  };

  return (
    <div className="space-y-4">
      {data.image && (
        <div className="bg-white/5 p-4 rounded-lg text-center">
          <div className="relative">
            <img
              src={data.image}
              alt={data.question}
              className="max-w-full max-h-48 sm:max-h-64 mx-auto rounded-lg shadow-lg object-contain border border-white/20"
              onError={(e) => {
                // ถ้าโหลดรูปไม่ได้ให้แสดง fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackDiv = target.nextElementSibling as HTMLElement;
                if (fallbackDiv) {
                  fallbackDiv.classList.remove('hidden');
                }
              }}
            />
            <div className="hidden text-gray-400 text-lg">
              🖼️ {data.image}
              <div className="text-sm text-gray-500 mt-2">
                (ไม่สามารถโหลดรูปภาพได้)
              </div>
            </div>
          </div>
        </div>
      )}
      
      <h4 className="text-lg font-semibold text-white">{data.question}</h4>
      
      <div className="grid gap-2 sm:gap-3">
        {data.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(index)}
            disabled={disabled}
            className="p-3 sm:p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all text-left text-sm sm:text-base"
          >
            <span className="font-semibold mr-2 sm:mr-3">{String.fromCharCode(65 + index)}.</span>
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Component สำหรับการระบุจากภาพ
function ImageIdentificationGame({ activity, onAnswer, disabled }: any) {
  const data = activity.data;

  const handleChoiceClick = (choiceIndex: number) => {
    if (disabled) return;
    const isCorrect = choiceIndex === data.correctAnswer;
    onAnswer(isCorrect, isCorrect ? (activity.point || 10) : 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-4 sm:p-6 rounded-lg text-center">
        {data.image ? (
          <div className="relative">
            <img
              src={data.image}
              alt={data.question}
              className="max-w-full max-h-64 sm:max-h-80 lg:max-h-96 mx-auto rounded-lg shadow-lg object-contain border border-white/20"
              onError={(e) => {
                // ถ้าโหลดรูปไม่ได้ให้แสดง fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackDiv = target.nextElementSibling as HTMLElement;
                if (fallbackDiv) {
                  fallbackDiv.classList.remove('hidden');
                }
              }}
            />
            <div className="hidden text-gray-400 text-xl sm:text-2xl mb-2">
              🖼️ {data.image}
              <div className="text-sm text-gray-500 mt-2">
                (ไม่สามารถโหลดรูปภาพได้)
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-xl sm:text-2xl mb-2">
            🖼️ รูปภาพประกอบ
            <div className="text-sm text-gray-500 mt-2">
              (ไม่มีรูปภาพ)
            </div>
          </div>
        )}
      </div>
      
      <h4 className="text-lg font-semibold text-white text-center">{data.question}</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {data.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(index)}
            disabled={disabled}
            className="p-3 sm:p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all text-sm sm:text-base"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// Component สำหรับคำถามถูกผิด
function TrueFalseGame({ activity, onAnswer, disabled }: any) {
  const data = activity.data;

  const handleAnswer = (answer: boolean) => {
    if (disabled) return;
    const isCorrect = answer === data.correctAnswer;
    onAnswer(isCorrect, isCorrect ? (activity.point || 10) : 0);
  };

  return (
    <div className="space-y-6">
      {data.image && (
        <div className="bg-white/5 p-4 rounded-lg text-center">
          <div className="relative">
            <img
              src={data.image}
              alt={data.statement || data.question}
              className="max-w-full max-h-48 sm:max-h-64 mx-auto rounded-lg shadow-lg object-contain border border-white/20"
              onError={(e) => {
                // ถ้าโหลดรูปไม่ได้ให้แสดง fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackDiv = target.nextElementSibling as HTMLElement;
                if (fallbackDiv) {
                  fallbackDiv.classList.remove('hidden');
                }
              }}
            />
            <div className="hidden text-gray-400 text-lg">
              🖼️ {data.image}
              <div className="text-sm text-gray-500 mt-2">
                (ไม่สามารถโหลดรูปภาพได้)
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white/5 p-6 rounded-lg text-center">
        <h4 className="text-xl font-semibold text-white">{data.statement}</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={disabled}
          className="p-4 sm:p-6 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/40 rounded-lg text-green-300 font-bold text-lg sm:text-xl transition-all"
        >
          ✓ ถูก
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={disabled}
          className="p-4 sm:p-6 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/40 rounded-lg text-red-300 font-bold text-lg sm:text-xl transition-all"
        >
          ✗ ผิด
        </button>
      </div>
    </div>
  );
}

// Component สำหรับการเรียงลำดับประโยค
function SentenceOrderingGame({ activity, onAnswer, disabled }: any) {
  const [orderedSentences, setOrderedSentences] = useState<string[]>([]);
  const [availableSentences, setAvailableSentences] = useState<string[]>([]);

  useEffect(() => {
    const shuffled = [...activity.data.sentences].sort(() => Math.random() - 0.5);
    setAvailableSentences(shuffled);
  }, [activity]);

  const handleSentenceClick = (sentence: string) => {
    if (disabled) return;
    
    setOrderedSentences(prev => [...prev, sentence]);
    setAvailableSentences(prev => prev.filter(s => s !== sentence));
    
    if (orderedSentences.length + 1 === activity.data.sentences.length) {
      // ตรวจสอบลำดับ
      setTimeout(() => {
        const newOrder = [...orderedSentences, sentence];
        const correctOrder = activity.data.correctOrder.map((index: number) => activity.data.sentences[index]);
        const isCorrect = JSON.stringify(newOrder) === JSON.stringify(correctOrder);
        onAnswer(isCorrect, isCorrect ? (activity.point || 10) : 0);
      }, 500);
    }
  };

  const removeSentence = (index: number) => {
    if (disabled) return;
    
    const sentence = orderedSentences[index];
    setOrderedSentences(prev => prev.filter((_, i) => i !== index));
    setAvailableSentences(prev => [...prev, sentence]);
  };

  return (
    <div className="space-y-6">
      <p className="text-white text-lg">{activity.data.instruction}</p>
      
      {/* พื้นที่สำหรับเรียงลำดับ */}
      <div className="bg-white/5 p-4 rounded-lg min-h-[200px]">
        <h4 className="text-lg font-semibold text-white mb-3">ลำดับที่เรียงแล้ว:</h4>
        <div className="space-y-2">
          {orderedSentences.map((sentence, index) => (
            <div
              key={index}
              onClick={() => removeSentence(index)}
              className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 cursor-pointer hover:bg-green-500/30 transition-all"
            >
              <span className="font-bold mr-2">{index + 1}.</span>
              {sentence}
            </div>
          ))}
          {orderedSentences.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              คลิกประโยคด้านล่างเพื่อเรียงลำดับ
            </div>
          )}
        </div>
      </div>
      
      {/* ประโยคที่ยังไม่ได้เรียง */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">ประโยคที่ต้องเรียง:</h4>
        <div className="grid gap-2">
          {availableSentences.map((sentence, index) => (
            <button
              key={index}
              onClick={() => handleSentenceClick(sentence)}
              disabled={disabled}
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all text-left"
            >
              {sentence}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Component สำหรับคำตอบตามช่วง
function RangeAnswerGame({ activity, onAnswer, disabled }: any) {
  const [inputValue, setInputValue] = useState('');
  const data = activity.data;

  const handleSubmit = () => {
    if (disabled || !inputValue) return;
    
    const numValue = parseFloat(inputValue);
    const tolerance = data.tolerance || 0;
    const isCorrect = Math.abs(numValue - data.correctAnswer) <= tolerance;
    
    onAnswer(isCorrect, isCorrect ? (activity.point || 10) : 0);
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-white">{data.question}</h4>
      
      <div className="bg-white/5 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-300 mb-2">
              ช่วงคำตอบ: {data.min} - {data.max} {data.unit || ''}
            </label>
            <input
              type="number"
              min={data.min}
              max={data.max}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={disabled}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="ใส่คำตอบของคุณ..."
            />
            {data.unit && (
              <span className="text-sm text-gray-400 mt-1 block">หน่วย: {data.unit}</span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={disabled || !inputValue}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
          >
            ตรวจสอบ
          </button>
        </div>
      </div>
    </div>
  );
}
