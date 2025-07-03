"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  onFinish 
}: { 
  stageInfo: StageData;
  score: number;
  totalQuestions: number;
  time: string; 
  onFinish: () => void;
}) => {
  // คำนวณดาวที่ได้รับ
  const percentage = (score / totalQuestions) * 100;
  const starsEarned = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
  const isPassed = starsEarned > 0;
  
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
                {isPassed ? stageInfo.character.completionMessage : "อย่าท้อใจ! ลองอีกครั้งคุณจะทำได้ดีกว่านี้แน่นอน"}
              </p>
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
                  <div
                    key={star}
                    className={`text-2xl ${
                      star <= starsEarned ? "text-yellow-400" : "text-gray-600"
                    }`}
                  >
                    ⭐
                  </div>
                ))}
              </div>
              <p className="text-white text-lg">{starsEarned}/3</p>
            </div>
            
            {/* Points */}
            <div className="bg-green-900/30 rounded-xl p-6 text-center">
              <h3 className="text-green-300 text-lg font-bold mb-2">คะแนนที่ได้</h3>
              <p className="text-white text-3xl font-bold">+{pointsEarned}</p>
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
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
              >
                ลองอีกครั้ง
              </button>
            )}
            
            <button 
              onClick={onFinish}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-8 py-3 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300"
            >
              กลับสู่แผนที่ด่าน
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

  const stageInfo = stageData[level];

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  // Redirect if stage not found
  if (!stageInfo) {
    router.push('/stage');
    return null;
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
    const percentage = (finalScore / (totalQuestions * 10)) * 100; // คะแนนเต็มคือ 10 คะแนนต่อข้อ
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    
    // อัปเดตความคืบหน้าของผู้เล่น
    progressManager.completeStage(level, stars, finalScore);
    
    setCurrentStep(3);
  };

  const handleFinish = () => {
    router.push('/stage');
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
        />
      );
    default:
      return <CharacterIntro stageInfo={stageInfo} onContinue={handleCharacterContinue} />;
  }
}
