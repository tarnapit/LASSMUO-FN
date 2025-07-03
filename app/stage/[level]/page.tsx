"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Clock, Trophy, X } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { stageData } from "../../data/stages";
import { progressManager } from "../../lib/progress";
import { StageData, Question } from "../../types/stage";

// Character Introduction Component
const CharacterIntro = ({ 
  stageInfo, 
  onContinue 
}: { 
  stageInfo: StageData;
  onContinue: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center space-y-8 max-w-3xl">
          {/* Character Avatar */}
          <div className="text-8xl mb-6">{stageInfo.character.avatar}</div>
          
          {/* Character Name */}
          <h1 className="text-4xl font-bold text-white">พบกับ {stageInfo.character.name}</h1>
          
          {/* Introduction */}
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-white text-lg leading-relaxed">{stageInfo.character.introduction}</p>
          </div>
          
          {/* Stage Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-900/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-semibold mb-2">ระดับความยาก</h3>
              <p className="text-white capitalize">{
                stageInfo.difficulty === 'easy' ? 'ง่าย' :
                stageInfo.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'
              }</p>
            </div>
            <div className="bg-green-900/30 rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">เวลาโดยประมาณ</h3>
              <p className="text-white">{stageInfo.estimatedTime}</p>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-4">
              <h3 className="text-yellow-300 font-semibold mb-2">รางวัลที่จะได้</h3>
              <p className="text-white">{stageInfo.rewards.points} คะแนน</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onContinue}
          className="mt-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
        >
          เริ่มการเรียนรู้
        </button>
      </div>
    </div>
  );
};

// Learning Content Component
const LearningContent = ({ 
  stageInfo, 
  onContinue 
}: { 
  stageInfo: StageData;
  onContinue: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{stageInfo.title}</h1>
            <p className="text-xl text-gray-300">{stageInfo.description}</p>
          </div>
          
          {/* Learning Content */}
          <div className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm mb-8">
            <div className="flex items-start space-x-6">
              <div className="text-6xl">{stageInfo.character.avatar}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-4">{stageInfo.character.name} บอกว่า:</h3>
                <p className="text-white text-lg leading-relaxed">{stageInfo.character.learningContent}</p>
              </div>
            </div>
          </div>
          
          {/* Visual Content Placeholder */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-12 text-center mb-8">
            <div className="text-6xl mb-6">{stageInfo.thumbnail}</div>
            <h3 className="text-2xl font-bold text-white mb-4">เนื้อหาการเรียนรู้</h3>
            <p className="text-gray-300">ที่นี่จะมีภาพประกอบ วิดีโอ หรือแอนิเมชั่นเกี่ยวกับ{stageInfo.title}</p>
          </div>
        </div>
        
        <button 
          onClick={onContinue}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105"
        >
          ไปทำแบบทดสอบ
        </button>
      </div>
    </div>
  );
};

// Quiz Component
const QuizComponent = ({ 
  questions, 
  onComplete 
}: { 
  questions: Question[];
  onComplete: (score: number) => void;
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerClick = (answerId: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerId);
    setShowResult(true);
    
    const answer = currentQuestion.answers.find(a => a.id === answerId);
    const isCorrect = answer?.isCorrect || false;
    
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getButtonStyle = (answerId: number) => {
    if (!showResult) {
      return "bg-white text-black hover:bg-gray-100";
    }
    
    const answer = currentQuestion.answers.find(a => a.id === answerId);
    if (answer?.isCorrect) {
      return "bg-green-500 text-white";
    } else if (selectedAnswer === answerId) {
      return "bg-orange-500 text-white";
    }
    return "bg-gray-500 text-white";
  };

  const getMessage = () => {
    if (!showResult) return null;
    
    const selectedAnswerData = currentQuestion.answers.find(a => a.id === selectedAnswer);
    if (selectedAnswerData?.isCorrect) {
      return (
        <div className="mt-8 text-center">
          <p className="text-green-500 text-lg font-semibold">
            {isLastQuestion ? "Good job ! Ready for results" : "Good job ! Ready to the next Question"}
          </p>
          <button 
            onClick={handleNext}
            className="text-yellow-500 underline cursor-pointer mt-2 hover:text-yellow-400"
          >
            Click Here
          </button>
        </div>
      );
    } else {
      return (
        <div className="mt-8 text-center">
          <p className="text-orange-500 text-lg font-semibold">Don't give up ! is just little mistake</p>
          <button 
            onClick={handleNext}
            className="text-yellow-500 underline cursor-pointer mt-2 hover:text-yellow-400"
          >
            Click Here
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="mb-4 text-white">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-8 text-center">{currentQuestion.question}</h1>
        
        <div className="mb-12">
          <div className="w-80 h-32 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
            <p className="text-white text-lg">Image or Animation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md">
          {currentQuestion.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              className={`
                w-32 h-16 rounded-lg font-bold text-xl transition-all duration-300
                ${getButtonStyle(answer.id)}
                disabled:cursor-not-allowed
              `}
              disabled={showResult}
            >
              {answer.text}
            </button>
          ))}
        </div>
        
        {getMessage()}
      </div>
    </div>
  );
};

// Results Component
const ResultsComponent = ({ 
  stageInfo,
  score, 
  totalQuestions,
  time, 
  onFinish,
  onRetry,
  isNavigating 
}: { 
  stageInfo: StageData;
  score: number;
  totalQuestions: number;
  time: string; 
  onFinish: () => void;
  onRetry: () => void;
  isNavigating?: boolean;
}) => {
  // คำนวณดาวที่ได้รับ
  const percentage = (score / totalQuestions) * 100;
  const starsEarned = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
  const isPassed = score > 0; // ต้องได้อย่างน้อย 1 คะแนนเพื่อผ่าน
  
  // คำนวณคะแนนที่ได้รับ
  const pointsEarned = Math.floor((percentage / 100) * stageInfo.rewards.points);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Character Message */}
          <div className="flex flex-col items-center space-y-4">
            <div className="text-8xl">{stageInfo.character.avatar}</div>
            <h1 className="text-4xl font-bold">
              <span className={isPassed ? "text-green-400" : "text-orange-400"}>
                {isPassed ? "ยอดเยี่ยม!" : "เกือบได้แล้ว!"}
              </span>
            </h1>
            
            <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm">
              <p className="text-white text-lg">
                {isPassed ? stageInfo.character.completionMessage : "คุณต้องได้อย่างน้อย 1 คะแนนเพื่อผ่านด่าน ลองใหม่อีกครั้งนะ!"}
              </p>
              
              {/* แสดงสถานะการผ่านด่าน */}
              <div className={`mt-4 p-3 rounded-lg ${isPassed ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                <div className="flex items-center justify-center space-x-2">
                  {isPassed ? (
                    <>
                      <Trophy className="text-green-400" size={20} />
                      <span className="text-green-400 font-bold">ผ่านด่านแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <X className="text-red-400" size={20} />
                      <span className="text-red-400 font-bold">ยังไม่ผ่านด่าน</span>
                    </>
                  )}
                </div>
                {isPassed && (
                  <p className="text-green-300 text-sm text-center mt-1">
                    ด่านถัดไปปลดล็อกแล้ว!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Score */}
            <div className="bg-blue-900/30 rounded-xl p-6 text-center">
              <h3 className="text-blue-300 text-lg font-bold mb-2">คะแนน</h3>
              <p className="text-white text-3xl font-bold">{score}/{totalQuestions}</p>
              <p className="text-gray-300 text-sm">{percentage.toFixed(0)}%</p>
            </div>
            
            {/* Time */}
            <div className="bg-purple-900/30 rounded-xl p-6 text-center">
              <h3 className="text-purple-300 text-lg font-bold mb-2">เวลาที่ใช้</h3>
              <p className="text-white text-3xl font-bold">{time}</p>
            </div>
            
            {/* Stars */}
            <div className="bg-yellow-900/30 rounded-xl p-6 text-center">
              <h3 className="text-yellow-300 text-lg font-bold mb-2">ดาวที่ได้รับ</h3>
              <div className="flex justify-center space-x-1 mb-2">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={
                      star <= starsEarned
                        ? "text-yellow-400 fill-current"
                        : "text-gray-500"
                    }
                  />
                ))}
              </div>
              <p className="text-white text-lg font-bold">{starsEarned}/3</p>
              {starsEarned > 0 && (
                <p className="text-yellow-300 text-sm mt-1">เยี่ยมมาก!</p>
              )}
            </div>
            
            {/* Points */}
            <div className="bg-green-900/30 rounded-xl p-6 text-center">
              <h3 className="text-green-300 text-lg font-bold mb-2">คะแนนที่ได้</h3>
              <p className="text-white text-3xl font-bold">+{isPassed ? pointsEarned : 0}</p>
              {!isPassed && (
                <p className="text-red-300 text-sm mt-1">ต้องผ่านด่านจึงจะได้คะแนน</p>
              )}
            </div>
          </div>
          
          {/* Rewards Section */}
          {isPassed && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-6 mt-8">
              <h3 className="text-2xl font-bold text-white mb-4">🎉 รางวัลที่ได้รับ!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏆</span>
                  <span>คะแนน: +{pointsEarned}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⭐</span>
                  <span>ดาว: +{starsEarned}</span>
                </div>
                {stageInfo.rewards.badges && stageInfo.rewards.badges.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏅</span>
                    <span>เหรียญ: {stageInfo.rewards.badges.join(', ')}</span>
                  </div>
                )}
                {stageInfo.rewards.unlocksStages && stageInfo.rewards.unlocksStages.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔓</span>
                    <span>ปลดล็อกด่าน: {stageInfo.rewards.unlocksStages.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {!isPassed && (
              <button 
                onClick={onRetry}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
              >
                ลองอีกครั้ง
              </button>
            )}
            
            <button 
              onClick={onFinish}
              disabled={isNavigating}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-8 py-3 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigating ? 'กำลังโหลด...' : 'กลับสู่แผนที่ด่าน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Stage Level Component
export default function StageLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = parseInt(params.level as string);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const stageInfo = stageData[level];

  useEffect(() => {
    setStartTime(new Date());
    
    // Cleanup function เมื่อ component unmount
    return () => {
      setIsNavigating(false);
    };
  }, []);

  // Redirect if stage not found
  if (!stageInfo) {
    useEffect(() => {
      const timer = setTimeout(() => {
        router.replace('/stage');
      }, 0);
      return () => clearTimeout(timer);
    }, [router]);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p>กำลังเปลี่ยนหน้า...</p>
        </div>
      </div>
    );
  }

  const handleCharacterContinue = () => {
    setCurrentStep(1);
  };

  const handleLearningContinue = () => {
    setCurrentStep(2);
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    
    // คำนวณจำนวนดาว (1-3 ดาว ตามคะแนน)
    const totalQuestions = stageInfo.questions.length;
    
    // finalScore คือจำนวนข้อที่ตอบถูก ไม่ใช่คะแนนรวม
    const correctAnswers = finalScore;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // เกณฑ์ดาว: ตอบถูกทุกข้อ = 3 ดาว, ตอบถูก 80% = 2 ดาว, ตอบถูก 50% = 1 ดาว
    const stars = percentage >= 100 ? 3 : percentage >= 80 ? 2 : percentage >= 50 ? 1 : 0;
    
    // คำนวณคะแนน (10 คะแนนต่อข้อที่ตอบถูก)
    const totalScore = correctAnswers * 10;
    
    // Debug log เพื่อตรวจสอบ
    console.log('Quiz completed:', {
      correctAnswers,
      totalQuestions,
      percentage: percentage.toFixed(2) + '%',
      stars,
      totalScore
    });
    
    // อัปเดตความคืบหน้าของผู้เล่น (ส่งคะแนนรวม ไม่ใช่จำนวนข้อถูก)
    progressManager.completeStage(level, stars, totalScore);
    
    setCurrentStep(3);
  };

  const handleFinish = async () => {
    // ป้องกัน multiple navigation calls
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      // เพิ่ม delay เล็กน้อยเพื่อให้ progress update เสร็จก่อน
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // ใช้ router.replace แทน push เพื่อ replace current history entry
      await router.replace('/stage');
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
      
      // Fallback: ใช้ window.location เป็นทางเลือกสุดท้าย
      try {
        window.location.href = '/stage';
      } catch (fallbackError) {
        console.error('Fallback navigation error:', fallbackError);
      }
    }
  };

  const handleRetry = () => {
    // รีเซ็ตเกมเพื่อเล่นใหม่
    setCurrentStep(0);
    setScore(0);
    setStartTime(new Date());
  };

  const getElapsedTime = () => {
    if (!startTime) return "00:00 min";
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')} min`;
  };

  // Render different components based on current step
  switch (currentStep) {
    case 0:
      return <CharacterIntro stageInfo={stageInfo} onContinue={handleCharacterContinue} />;
    case 1:
      return <LearningContent stageInfo={stageInfo} onContinue={handleLearningContinue} />;
    case 2:
      return <QuizComponent questions={stageInfo.questions} onComplete={handleQuizComplete} />;
    case 3:
      return (
        <ResultsComponent 
          stageInfo={stageInfo}
          score={score} 
          totalQuestions={stageInfo.questions.length}
          time={getElapsedTime()} 
          onFinish={handleFinish} 
          onRetry={handleRetry}
          isNavigating={isNavigating}
        />
      );
    default:
      return <CharacterIntro stageInfo={stageInfo} onContinue={handleCharacterContinue} />;
  }
}
