"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Clock, Trophy, X } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { stageData } from "../../data/stages";
import { progressManager } from "../../lib/progress";
import { StageData, Question } from "../../types/stage";
import EnhancedQuizComponent from "../../components/quiz/QuizComponent";
import QuizLoadingScreen from "../../components/quiz/QuizLoadingScreen";
import EnhancedResultsComponent from "../../components/quiz/ResultsComponent";

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

// Main Stage Level Component
export default function StageLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = parseInt(params.level as string);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showQuizLoading, setShowQuizLoading] = useState(false);

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
    setShowQuizLoading(true);
  };

  const handleQuizLoadingComplete = () => {
    setShowQuizLoading(false);
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
      if (showQuizLoading) {
        return (
          <QuizLoadingScreen 
            stage={stageInfo.title} 
            onComplete={handleQuizLoadingComplete} 
          />
        );
      }
      return <LearningContent stageInfo={stageInfo} onContinue={handleLearningContinue} />;
    case 2:
      // Ensure questions array exists before passing to QuizComponent
      const questions = stageInfo.questions || [];
      if (questions.length === 0) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p>ไม่พบคำถามสำหรับด่านนี้</p>
              <button 
                onClick={() => router.replace('/stage')}
                className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-lg"
              >
                กลับไปยังแผนที่ด่าน
              </button>
            </div>
          </div>
        );
      }
      return <EnhancedQuizComponent 
        questions={questions} 
        onComplete={handleQuizComplete} 
        onExit={() => router.replace('/stage')}
      />;
    case 3:
      return (
        <EnhancedResultsComponent 
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
