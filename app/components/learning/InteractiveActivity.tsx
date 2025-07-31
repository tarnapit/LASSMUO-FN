"use client";
import { useState, useEffect } from "react";
import { InteractiveActivity } from "../../types/learning";
import { CheckCircle, XCircle, Clock, Star, Trophy, RotateCcw } from "lucide-react";

interface InteractiveActivityProps {
  activity: InteractiveActivity;
  onComplete: (score: number, timeSpent: number, passed: boolean) => void;
  required?: boolean;
  minimumScore?: number;
}

export default function InteractiveActivityComponent({ activity, onComplete, required = false, minimumScore = 0 }: InteractiveActivityProps) {
  const [startTime] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(activity.timeLimit || 0);
  const [attempts, setAttempts] = useState(0);
  const [passed, setPassed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Timer effect
  useEffect(() => {
    if (activity.timeLimit && timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
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
  }, [timeRemaining, isCompleted, activity.timeLimit]);

  const handleTimeUp = () => {
    setIsCompleted(true);
    setShowFeedback(true);
    setIsCorrect(false);
    setPassed(false);
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    onComplete(0, timeSpent, false);
  };

  const handleAnswer = (correct: boolean, earnedScore: number = 0) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    const finalScore = correct ? earnedScore : 0;
    const activityPassed = finalScore >= (activity.passingScore || minimumScore);
    
    setIsCorrect(correct);
    setScore(finalScore);
    setPassed(activityPassed);
    setShowFeedback(true);
    
    // ถ้าผ่านแล้วหรือใช้ครั้งครบ
    if (activityPassed || (activity.maxAttempts && newAttempts >= activity.maxAttempts)) {
      setIsCompleted(true);
      onComplete(finalScore, timeSpent, activityPassed);
    } else {
      // แสดงคำใบ้ถ้ามี
      if (activity.feedback?.hint && !correct) {
        setShowHint(true);
      }
    }
  };

  const resetActivity = () => {
    setIsCompleted(false);
    setShowFeedback(false);
    setScore(0);
    setShowHint(false);
    setTimeRemaining(activity.timeLimit || 0);
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
    <div className={`bg-gradient-to-br rounded-2xl p-8 border transition-all ${
      required 
        ? 'from-purple-600/30 to-pink-600/30 border-purple-500/50 shadow-lg shadow-purple-500/20' 
        : 'from-purple-500/20 to-blue-500/20 border-purple-500/30'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Star className="text-yellow-400 mr-2" size={24} />
            {activity.title}
            {required && (
              <span className="ml-3 px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-sm font-normal">
                บังคับ
              </span>
            )}
            {activity.difficulty && (
              <span className={`ml-2 px-2 py-1 rounded text-sm font-normal ${
                activity.difficulty === 'easy' ? 'bg-green-500/20 border border-green-500/40 text-green-300' :
                activity.difficulty === 'medium' ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300' :
                'bg-red-500/20 border border-red-500/40 text-red-300'
              }`}>
                {activity.difficulty === 'easy' ? 'ง่าย' : activity.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
              </span>
            )}
          </h3>
          
          <div className="flex items-center space-x-3">
            {activity.timeLimit && (
              <div className={`flex items-center px-3 py-1 rounded-lg ${
                timeRemaining <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                <Clock size={16} className="mr-1" />
                <span className="font-mono font-bold">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            
            {activity.maxAttempts && (
              <div className="flex items-center px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400">
                <span className="text-sm">
                  ลองได้: {attempts}/{activity.maxAttempts}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-300">{activity.instruction}</p>
        
        <div className="flex items-center mt-3 space-x-4">
          {activity.points && (
            <div className="flex items-center text-yellow-400 text-sm">
              <Trophy size={16} className="mr-1" />
              คะแนนเต็ม: {activity.points} แต้ม
            </div>
          )}
          
          {(activity.passingScore || minimumScore > 0) && (
            <div className="flex items-center text-green-400 text-sm">
              <CheckCircle size={16} className="mr-1" />
              ผ่าน: {activity.passingScore || minimumScore} แต้ม
            </div>
          )}
        </div>
      </div>

      {/* Activity Content */}
      <div className="mb-6">
        {renderActivity()}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`p-4 rounded-lg border mb-4 ${
          passed 
            ? 'bg-green-500/20 border-green-500/40 text-green-300' 
            : 'bg-red-500/20 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center mb-2">
            {passed ? (
              <CheckCircle size={20} className="mr-2 text-green-400" />
            ) : (
              <XCircle size={20} className="mr-2 text-red-400" />
            )}
            <span className="font-semibold">
              {passed ? 'ผ่าน!' : (isCorrect ? 'ถูกต้อง แต่คะแนนไม่พอ' : 'ไม่ถูกต้อง')}
            </span>
            {score > 0 && (
              <span className="ml-2 text-yellow-400 font-bold">+{score} แต้ม</span>
            )}
          </div>
          
          <p className="text-sm mb-2">
            {passed ? activity.feedback?.correct : activity.feedback?.incorrect}
          </p>
          
          {showHint && activity.feedback?.hint && (
            <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/40 rounded text-blue-300">
              <div className="flex items-center mb-1">
                <span className="text-sm font-semibold">💡 คำใบ้:</span>
              </div>
              <p className="text-sm">{activity.feedback.hint}</p>
            </div>
          )}
          
          {!passed && !isCompleted && (
            <button
              onClick={resetActivity}
              className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm flex items-center"
            >
              <RotateCcw size={16} className="mr-2" />
              ลองใหม่
            </button>
          )}
          
          {required && !passed && isCompleted && (
            <div className="mt-3 p-3 bg-red-600/20 border border-red-600/40 rounded text-red-300">
              <div className="flex items-center">
                <XCircle size={16} className="mr-2" />
                <span className="text-sm font-semibold">ต้องผ่านกิจกรรมนี้ก่อนถึงจะไปต่อได้</span>
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
  const [matches, setMatches] = useState<Array<{left: number, right: number}>>([]);
  const [shuffledRight, setShuffledRight] = useState<Array<{item: string, originalIndex: number}>>([]);

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
    
    if (leftIndex === rightOriginalIndex) {
      // ถูกต้อง
      setMatches(prev => [...prev, { left: leftIndex, right: rightIndex }]);
      setSelectedLeft(null);
      setSelectedRight(null);
      
      if (matches.length + 1 === activity.data.pairs.length) {
        // เสร็จแล้ว
        setTimeout(() => onAnswer(true, activity.points || 10), 500);
      }
    } else {
      // ผิด
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    }
  };

  const isMatched = (side: 'left' | 'right', index: number) => {
    return matches.some(match => 
      side === 'left' ? match.left === index : match.right === index
    );
  };

  if (!activity.data.pairs) return <div>ข้อมูลไม่ถูกต้อง</div>;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* ฝั่งซ้าย */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white mb-3">จับคู่รายการ</h4>
        {activity.data.pairs.map((pair: any, index: number) => (
          <button
            key={index}
            onClick={() => handleLeftClick(index)}
            disabled={disabled || isMatched('left', index)}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              isMatched('left', index)
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : selectedLeft === index
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {pair.left}
          </button>
        ))}
      </div>

      {/* ฝั่งขวา */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-white mb-3">เลือกคำตอบ</h4>
        {shuffledRight.map((item, index) => (
          <button
            key={index}
            onClick={() => handleRightClick(index)}
            disabled={disabled || isMatched('right', index)}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              isMatched('right', index)
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : selectedRight === index
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {item.item}
          </button>
        ))}
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
          onAnswer(isCorrect, isCorrect ? (activity.points || 10) : 0);
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
      
      <div className="grid grid-cols-2 gap-3">
        {data.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option, index)}
            disabled={disabled || usedOptions.includes(index)}
            className={`p-3 rounded-lg border-2 transition-all ${
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
    onAnswer(isCorrect, isCorrect ? (activity.points || 10) : 0);
  };

  return (
    <div className="space-y-4">
      {data.image && (
        <div className="bg-white/5 p-4 rounded-lg text-center">
          <div className="text-gray-400 text-lg">
            🖼️ {data.image}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            (รูปภาพจะแสดงที่นี่)
          </div>
        </div>
      )}
      
      <h4 className="text-lg font-semibold text-white">{data.question}</h4>
      
      <div className="grid gap-3">
        {data.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(index)}
            disabled={disabled}
            className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all text-left"
          >
            <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
            {option}
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
    onAnswer(isCorrect, isCorrect ? (activity.points || 10) : 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-6 rounded-lg text-center">
        <div className="text-gray-400 text-2xl mb-2">
          🖼️ {data.image}
        </div>
        <div className="text-sm text-gray-500">
          (รูปภาพจะแสดงที่นี่)
        </div>
      </div>
      
      <h4 className="text-lg font-semibold text-white text-center">{data.question}</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {data.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(index)}
            disabled={disabled}
            className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
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
    onAnswer(isCorrect, isCorrect ? (activity.points || 10) : 0);
  };

  return (
    <div className="space-y-6">
      {data.image && (
        <div className="bg-white/5 p-4 rounded-lg text-center">
          <div className="text-gray-400 text-lg">
            🖼️ {data.image}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            (รูปภาพจะแสดงที่นี่)
          </div>
        </div>
      )}
      
      <div className="bg-white/5 p-6 rounded-lg text-center">
        <h4 className="text-xl font-semibold text-white">{data.statement}</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer(true)}
          disabled={disabled}
          className="p-6 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/40 rounded-lg text-green-300 font-bold text-xl transition-all"
        >
          ✓ ถูก
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={disabled}
          className="p-6 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/40 rounded-lg text-red-300 font-bold text-xl transition-all"
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
        onAnswer(isCorrect, isCorrect ? (activity.points || 10) : 0);
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
    
    onAnswer(isCorrect, isCorrect ? (activity.points || 10) : 0);
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
