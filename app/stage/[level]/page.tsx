"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Clock, Trophy, X, ArrowLeft } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { progressManager } from "../../lib/progress";
import { Question } from "../../types/stage";
import EnhancedQuizComponent from "../../components/quiz/QuizComponent";
import QuizLoadingScreen from "../../components/quiz/QuizLoadingScreen";
import EnhancedResultsComponent from "../../components/quiz/ResultsComponent";
import { useStageById } from "../../lib/hooks/useStageData";
import { useStageProgressManager } from "../../lib/hooks/useStageProgressManager";
import { authManager } from "../../lib/auth";

// Character Introduction Component
const CharacterIntro = ({ 
  stage, 
  character,
  onContinue 
}: { 
  stage: any;
  character?: any;
  onContinue: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center space-y-8 max-w-3xl">
          {/* Character Avatar */}
          <div className="text-8xl mb-6">{character?.avatar || "🚀"}</div>
          
          {/* Character Name */}
          <h1 className="text-4xl font-bold text-white">พบกับ {character?.name || "ผู้นำทาง"}</h1>
          
          {/* Character Introduction */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-xl">
            <p className="text-white text-lg leading-relaxed">
              {character?.introduction || `ยินดีต้อนรับสู่ ${stage.title}! ฉันจะเป็นผู้นำทางของคุณในการเรียนรู้เกี่ยวกับดาราศาสตร์`}
            </p>
          </div>

          {/* Stage Info */}
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <p className="text-gray-400">ระดับความยาก</p>
              <p className="text-white font-semibold">
                {stage.difficulty === 'Easy' ? 'ง่าย' :
                 stage.difficulty === 'Medium' ? 'ปานกลาง' : 'ยาก'}
              </p>
            </div>
            <div>
              <p className="text-gray-400">เวลาโดยประมาณ</p>
              <p className="text-white">{stage.estimatedTime || '5-10 นาที'}</p>
            </div>
            <div>
              <p className="text-gray-400">รางวัล XP</p>
              <p className="text-white">{stage.xpReward || 100} XP</p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            เริ่มการเรียนรู้
          </button>
        </div>
      </div>
    </div>
  );
};

// Learning Content Component
const LearningContent = ({ 
  stage, 
  character,
  onStartQuiz 
}: { 
  stage: any;
  character?: any;
  onStartQuiz: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-8 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">{stage.title}</h1>
          <p className="text-xl text-gray-300">{stage.description}</p>
        </div>

        {/* Learning Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Character Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="flex items-start space-x-6">
              <div className="text-6xl">{character?.avatar || "🚀"}</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {character?.name || "ผู้นำทาง"} บอกว่า:
                </h3>
                <p className="text-white text-lg leading-relaxed">
                  {character?.learningContent || `ในด่าน ${stage.title} นี้ เราจะได้เรียนรู้เกี่ยวกับความมหัศจรรย์ของดาราศาสตร์ที่น่าตื่นเต้น!`}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
            <div className="text-6xl mb-6">{stage.thumbnail || "🌌"}</div>
            <h3 className="text-xl font-semibold text-white mb-4">เนื้อหาการเรียนรู้</h3>
            <p className="text-gray-300">
              ที่นี่จะมีภาพประกอบ วิดีโอ หรือแอนิเมชั่นเกี่ยวกับ{stage.title}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button
            onClick={onStartQuiz}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            เริ่มทำแบบทดสอบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default function StageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stageId = parseInt(params.level as string);
  
  // States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [gameState, setGameState] = useState<'intro' | 'learning' | 'loading' | 'quiz' | 'results'>('intro');
  const [quizResults, setQuizResults] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // API Hooks
  const { stage, loading: stageLoading, error: stageError } = useStageById(stageId);
  const { 
    progress: stageProgress, 
    recordAttempt, 
    completeStage,
    refreshProgress 
  } = useStageProgressManager(currentUser?.id);

  // Initialize user
  useEffect(() => {
    const user = authManager.getCurrentUser() || {
      id: 1,
      name: "ผู้เรียน",
      level: 1,
      experience: 150,
      avatar: "👩‍🚀",
    };
    setCurrentUser(user);
  }, []);

  // Load questions based on stage
  useEffect(() => {
    if (stage) {
      console.log('🎯 Loading questions for stage:', stageId, stage);
      
      // Check if stage has questions (from API)
      const stageAny = stage as any;
      if (stageAny.questions && Array.isArray(stageAny.questions)) {
        console.log('📝 Using questions from API:', stageAny.questions);
        setQuestions(stageAny.questions);
        return;
      }
      
      // Fallback: Load questions from mock data
      try {
        const { stages } = require('../../data/stages');
        const stageInfo = stages[stageId];
        console.log('📋 Available stages in mock data:', Object.keys(stages));
        console.log('📋 Stage info for', stageId, ':', stageInfo);
        
        if (stageInfo?.questions) {
          console.log('📝 Using questions from mock data:', stageInfo.questions);
          setQuestions(stageInfo.questions);
        } else {
          console.warn('⚠️ No questions found for stage:', stageId);
          setQuestions([]);
        }
      } catch (error) {
        console.warn('Could not load questions from fallback data:', error);
        setQuestions([]);
      }
    }
  }, [stage, stageId]);

  // Loading state
  if (stageLoading) {
    return (
      <QuizLoadingScreen 
        stage={`ด่าน ${stageId}`}
        onComplete={() => {}}
      />
    );
  }

  // Error state
  if (stageError || !stage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">ไม่พบด่านที่คุณต้องการ</h1>
            <p className="text-gray-300 mb-8">กรุณาตรวจสอบหมายเลขด่านและลองใหม่อีกครั้ง</p>
            <button
              onClick={() => router.push('/stage')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft size={20} />
              <span>กลับสู่หน้าด่าน</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Event Handlers
  const handleContinueFromIntro = () => {
    setGameState('learning');
  };

  const handleStartQuiz = () => {
    if (questions.length === 0) {
      console.warn('No questions available for this stage');
      return;
    }
    setGameState('loading');
    setTimeout(() => setGameState('quiz'), 2000);
  };

  const handleQuizComplete = async (results: {
    score: number;
    totalQuestions: number;
    time: string;
    answers: boolean[];
    percentage: number;
  }) => {
    console.log('Quiz completed with results:', results);
    
    // Record attempt
    if (currentUser?.id) {
      await recordAttempt(stageId, results.score);
      
      // Complete stage if passed (score > 0)
      if (results.score > 0) {
        // Calculate stars based on score percentage
        let stars = 0;
        if (results.score === results.totalQuestions) {
          stars = 3; // Perfect score = 3 stars
        } else if (results.score >= Math.ceil(results.totalQuestions * 0.8)) {
          stars = 2; // 80%+ = 2 stars
        } else if (results.score >= Math.ceil(results.totalQuestions * 0.5)) {
          stars = 1; // 50%+ = 1 star
        }
        
        await completeStage(stageId, results.score, stars, stage.xpReward || 100);
      }
      
      // Refresh progress
      refreshProgress();
    }

    setQuizResults(results);
    setGameState('results');
  };

  const handleRetryQuiz = () => {
    setGameState('quiz');
    setQuizResults(null);
  };

  const handleReturnToStages = () => {
    router.push('/stage');
  };

  // Character data (mock for now, can be loaded from API later)
  const character = {
    name: "อาสา",
    avatar: "👩‍🚀",
    introduction: `ยินดีต้อนรับสู่ ${stage.title}! ฉันจะเป็นผู้นำทางของคุณในการเรียนรู้เกี่ยวกับดาราศาสตร์`,
    learningContent: `ในด่าน ${stage.title} นี้ เราจะได้เรียนรู้เกี่ยวกับความมหัศจรรย์ของดาราศาสตร์ที่น่าตื่นเต้น!`,
    completionMessage: "ยอดเยี่ยม! คุณผ่านด่านนี้ได้เป็นอย่างดี!",
    encouragements: [
      "เยี่ยมมาก! คุณกำลังเรียนรู้ได้ดี",
      "ไม่เป็นไร ลองใหม่อีกครั้ง!",
      "เก่งมาก! คุณเข้าใจแล้ว"
    ]
  };

  // Render based on game state
  switch (gameState) {
    case 'intro':
      return (
        <CharacterIntro 
          stage={stage}
          character={character}
          onContinue={handleContinueFromIntro} 
        />
      );
    
    case 'learning':
      return (
        <LearningContent 
          stage={stage}
          character={character}
          onStartQuiz={handleStartQuiz} 
        />
      );

    case 'loading':
      return (
        <QuizLoadingScreen 
          stage={stage.title}
          onComplete={() => setGameState('quiz')}
        />
      );

    case 'quiz':
      return (
        <EnhancedQuizComponent
          questions={questions}
          onComplete={handleQuizComplete}
        />
      );

    case 'results':
      if (quizResults) {
        // Create a proper StageData structure for compatibility
        const stageInfo = {
          stage: {
            id: stage.id,
            title: stage.title,
            description: stage.description,
            difficulty: stage.difficulty,
            estimatedTime: stage.estimatedTime,
            thumbnail: stage.thumbnail || "🌌",
            totalStars: stage.totalStars || 3,
            xpReward: stage.xpReward || 100,
            streakBonus: stage.streakBonus || false,
            healthSystem: stage.healthSystem || false,
            rewards: stage.rewards || {
              stars: 3,
              points: stage.xpReward || 100,
              badges: [],
              unlocksStages: []
            },
            maxStars: stage.maxStars || 3,
            requiredStarsToUnlockNext: stage.requiredStarsToUnlockNext || 0,
            createdAt: stage.createdAt || new Date().toISOString(),
            updatedAt: stage.updatedAt || new Date().toISOString()
          },
          prerequisites: [],
          questions: questions,
          character: character ? {
            id: 1,
            stageId: stage.id,
            name: character.name,
            avatar: character.avatar,
            introduction: character.introduction,
            learningContent: character.learningContent,
            completionMessage: character.completionMessage,
            encouragements: character.encouragements || [],
            hints: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } : undefined
        };
        
        return (
          <EnhancedResultsComponent
            stageInfo={stageInfo}
            score={quizResults.score}
            totalQuestions={quizResults.totalQuestions || questions.length}
            time={quizResults.time || "0:00"}
            onRetry={handleRetryQuiz}
            onFinish={handleReturnToStages}
          />
        );
      }
      return (
        <QuizLoadingScreen 
          stage={stage.title}
          onComplete={() => {}}
        />
      );

    default:
      return (
        <QuizLoadingScreen 
          stage={stage.title}
          onComplete={() => {}}
        />
      );
  }
}