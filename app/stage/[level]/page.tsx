"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Clock, Trophy, X, ArrowLeft, Sparkles, Target, Award, Rocket, Play, BookOpen, Zap } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { progressManager } from "../../lib/progress";
import { Question } from "../../types/stage";
import EnhancedQuizComponent from "../../components/quiz/QuizComponent";
import QuizLoadingScreen from "../../components/quiz/QuizLoadingScreen";
import EnhancedResultsComponent from "../../components/quiz/ResultsComponent";
import { useStageById } from "../../lib/hooks/useStageData";
import { useStageProgressManager } from "../../lib/hooks/useStageProgressManager";
import { authManager } from "../../lib/auth";
import { addImagesToQuestions } from "../../lib/image-mapper";
import "../../styles/stage-presentation.css";

// Character Introduction Component
const CharacterIntro = ({ 
  stage, 
  character,
  onContinue,
  currentUser,
  stageId 
}: { 
  stage: any;
  character?: any;
  onContinue: () => void;
  currentUser?: any;
  stageId: number;
}) => {
  const [animationClass, setAnimationClass] = useState("opacity-0 translate-y-10");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass("opacity-100 translate-y-0");
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        {/* Floating stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-yellow-300 floating-star`}
          >
            ✨
          </div>
        ))}
      </div>

      <Navbar />
      <div className={`flex-1 flex flex-col items-center justify-center px-8 transition-all duration-1000 ease-out ${animationClass}`}>
        <div className="text-center space-y-8 max-w-4xl relative z-10">
          {/* Character Avatar with Animation */}
          <div className="relative">
            <div className="text-9xl mb-6 animate-bounce filter drop-shadow-2xl">
              {character?.avatar || "🚀"}
            </div>
            <div className="absolute -top-4 -right-4">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-spin" />
            </div>
          </div>
          
          {/* Stage Title with Glow Effect */}
          <div className="relative">
            <h1 className="gradient-text text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {stage.title}
            </h1>
          </div>
          
          {/* Character Name & Progress */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2 mb-4">
              <Rocket className="w-6 h-6 text-blue-400" />
              พบกับ {character?.name || "ผู้นำทาง"}
              <Rocket className="w-6 h-6 text-purple-400 scale-x-[-1]" />
            </h2>
            
            {/* User Progress Summary */}
            {currentUser && (
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">ระดับ {currentUser.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{currentUser.experience} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">ด่าน {stageId}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Character Introduction with Enhanced Design */}
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"></div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{character?.avatar || "🚀"}</div>
              <div className="flex-1">
                <p className="text-white text-lg leading-relaxed text-left">
                  {character?.introduction || `ยินดีต้อนรับสู่ ${stage.title}! ฉันจะเป็นผู้นำทางของคุณในการเรียนรู้เกี่ยวกับดาราศาสตร์`}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Stage Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="interactive-card stagger-animation info-card bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30">
              <div className="flex items-center justify-center mb-3">
                <Target className="w-8 h-8 text-emerald-400 bounce-icon" />
              </div>
              <p className="text-emerald-300 text-sm mb-1">ระดับความยาก</p>
              <p className="text-white font-bold text-lg">
                {stage.difficulty === 'Easy' ? '🟢 ง่าย' :
                 stage.difficulty === 'Medium' ? '🟡 ปานกลาง' : '🔴 ยาก'}
              </p>
            </div>
            
            <div className="interactive-card stagger-animation info-card bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-blue-400 bounce-icon" />
              </div>
              <p className="text-blue-300 text-sm mb-1">เวลาโดยประมาณ</p>
              <p className="text-white font-bold text-lg">⏱️ {stage.estimatedTime || '5-10 นาที'}</p>
            </div>
            
            <div className="interactive-card stagger-animation info-card bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/30 glow-border">
              <div className="flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-yellow-400 achievement-badge" />
              </div>
              <p className="text-yellow-300 text-sm mb-1">รางวัล XP</p>
              <p className="text-white font-bold text-lg">💎 {stage.xpReward || 100} XP</p>
            </div>
          </div>

          {/* Enhanced Continue Button */}
          <div className="pt-4">
            <button
              onClick={onContinue}
              className="button-glow group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>เริ่มการเรียนรู้</span>
                <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Learning Content Component
const LearningContent = ({ 
  stage, 
  character,
  onStartQuiz,
  questions 
}: { 
  stage: any;
  character?: any;
  onStartQuiz: () => void;
  questions: Question[];
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 opacity-10 grid-pattern"></div>
      </div>

      <Navbar />
      <div className={`flex-1 container mx-auto px-8 py-16 max-w-7xl relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Enhanced Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
          </div>
          <div className="relative">
            <h1 className="gradient-text text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              {stage.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {stage.description}
            </p>
          </div>
        </div>

        {/* Enhanced Learning Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Enhanced Character Section */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative info-card hover-lift bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
              
              <div className="flex items-start space-x-6">
                <div className="status-indicator relative">
                  <div className="text-7xl filter drop-shadow-lg custom-pulse">
                    {character?.avatar || "🚀"}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    <h3 className="text-2xl font-bold text-white">
                      {character?.name || "ผู้นำทาง"} บอกว่า:
                    </h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30">
                    <p className="text-white text-lg leading-relaxed">
                      {character?.learningContent || `ในด่าน ${stage.title} นี้ เราจะได้เรียนรู้เกี่ยวกับความมหัศจรรย์ของดาราศาสตร์ที่น่าตื่นเต้น!`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Visual Content */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative info-card hover-lift bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
              
              {/* Enhanced Visual Element */}
              <div className="relative mb-6">
                <div className="text-8xl mb-4 filter drop-shadow-2xl custom-pulse">
                  {stage.thumbnail || "🌌"}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                เนื้อหาการเรียนรู้
                <Sparkles className="w-6 h-6 text-pink-400" />
              </h3>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30">
                <p className="text-gray-300 text-lg leading-relaxed">
                  เตรียมพบกับการผจญภัยครั้งใหม่ในการเรียนรู้เกี่ยวกับ <span className="text-white font-semibold">{stage.title}</span> 
                  ผ่านเนื้อหาที่น่าตื่นเต้นและกิจกรรมที่ท้าทาย! 🚀
                </p>
              </div>

              {/* Learning Features */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="info-card bg-white/5 rounded-lg p-3 border border-purple-400/20 hover-lift">
                  <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">รับคะแนนสูงสุด</p>
                  <p className="text-xs text-yellow-300">{stage.xpReward || 100} XP</p>
                </div>
                <div className="info-card bg-white/5 rounded-lg p-3 border border-purple-400/20 hover-lift">
                  <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300">ได้ดาวสูงสุด</p>
                  <p className="text-xs text-blue-300">{stage.maxStars || 3} ดาว</p>
                </div>
              </div>

              {/* Special Achievements */}
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 text-sm font-semibold">เป้าหมายพิเศษ</span>
                </div>
                <p className="text-xs text-gray-300 text-center">
                  ทำคะแนนเต็มเพื่อปลดล็อกเนื้อหาพิเศษ! ✨
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative">
            <div className="mb-6">
              <p className="text-gray-300 text-lg mb-2">🎯 พร้อมที่จะทดสอบความรู้แล้วหรือยัง?</p>
              <p className="text-sm text-gray-400">แบบทดสอบมี {stage.totalQuestions || 'หลาย'} ข้อ ใช้เวลาประมาณ {stage.estimatedTime || '5-10 นาที'}</p>
            </div>
            
            <button
              onClick={onStartQuiz}
              className="button-glow group relative bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-400 hover:via-blue-400 hover:to-purple-400 text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 border border-white/20"
            >
              <div className="flex items-center gap-3">
                <Target className="w-7 h-7 group-hover:scale-110 transition-transform" />
                <span>เริ่มทำแบบทดสอบ</span>
                <Zap className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </div>
            </button>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-4 border border-gray-500/30">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">เวลาทำแบบทดสอบ</p>
                <p className="text-sm text-white font-semibold">ไม่จำกัด</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-gray-500/30">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">จำนวนข้อ</p>
                <p className="text-sm text-white font-semibold">{questions.length || '5'} ข้อ</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-gray-500/30">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">รางวัล XP</p>
                <p className="text-sm text-white font-semibold">{stage.xpReward || 100} XP</p>
              </div>
            </div>
          </div>
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
        // เพิ่มรูปภาพ mock เข้าไปในคำถามจาก API
        const questionsWithImages = addImagesToQuestions(stageAny.questions, stageId);
        console.log('🖼️ Questions with mock images:', questionsWithImages);
        setQuestions(questionsWithImages);
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
          // Mock data อาจมีรูปภาพอยู่แล้ว แต่เพิ่มให้แน่ใจ
          const questionsWithImages = addImagesToQuestions(stageInfo.questions, stageId);
          setQuestions(questionsWithImages);
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

  const handleQuizExit = () => {
    // กลับไปหน้า stage list
    router.push('/stage');
  };

  // Get character data based on stage - different characters for different topics
  const getCharacterForStage = (stageTitle: string) => {
    const title = stageTitle.toLowerCase();
    
    // ตรวจสอบ specific cases ก่อน (ต้องมาก่อน general cases)
    if (title.includes('ดาวหาง') || title.includes('ดาวเคราะห์น้อย') || title.includes('อุกกาบาต')) {
      return {
        name: "เมทอร์",
        avatar: "☄️",
        introduction: `สวัสดี! ฉันคือเมทอร์ ผู้เฝ้าดูดาวหาง 💫 ฉันจะพาคุณไปรู้จักกับ ${stageTitle} และเรื่องราวของนักเดินทางแห่งอวกาศ!`,
        learningContent: `ดาวหางคือก้อนน้ำแข็งและฝุ่นที่เดินทางมาจากขอบระบบสุริยะ เมื่อเข้าใกล้ดวงอาทิตย์จะเกิดหางยาวสวยงาม ☄️`,
      };
    } else if (title.includes('ดวงจันทร์') || title.includes('ดาวเทียม')) {
      return {
        name: "ลูน่า",
        avatar: "🌕",
        introduction: `สวัสดีค่ะ! ฉันคือลูน่า ผู้คุ้มครองดวงจันทร์ 🌙 ฉันจะเล่าให้ฟังเกี่ยวกับ ${stageTitle} และความมหัศจรรย์ของดาวเทียมธรรมชาติ!`,
        learningContent: `ดวงจันทร์อยู่ห่างจากโลก 384,400 กิโลเมตร ใช้เวลาโคจรรอบโลก 27.3 วัน และมีผลต่อกระแสน้ำขึ้นน้ำลง 🌊`,
      };
    } else if (title.includes('ดาวเคราะห์') || title.includes('โลก')) {
      return {
        name: "อาเทมิส",
        avatar: "🌎",
        introduction: `ยินดีต้อนรับ! ฉันคืออาเทมิส นักสำรวจดาวเคราะห์ 🚀 มาร่วมเดินทางไปสำรวจ ${stageTitle} และความลับของจักรวาลกัน!`,
        learningContent: `ในระบบสุริยะมีดาวเคราะห์ 8 ดวง แต่ละดวงมีลักษณะที่แตกต่างกัน จากเมอร์คิวรีที่ร้อนที่สุด ไปจนถึงเนปจูนที่เย็นที่สุด 🪐`,
      };
    } else if (title.includes('ดวงอาทิตย์') || (title.includes('ดาว') && !title.includes('ดาวเคราะห์') && !title.includes('ดาวเทียม') && !title.includes('ดาวหาง'))) {
      return {
        name: "ดาล่า",
        avatar: "☀️",
        introduction: `สวัสดี! ฉันคือดาล่า ผู้พิทักษ์ดวงอาทิตย์ 🌟 ฉันจะพาคุณไปเรียนรู้เกี่ยวกับ ${stageTitle} ที่เป็นแหล่งพลังงานของระบบสุริยะ!`,
        learningContent: `ดวงอาทิตย์คือดาวฤกษ์ที่ใกล้โลกที่สุด มีอุณหภูมิผิวประมาณ 5,500 องศาเซลเซียส และใช้เวลาแสงเดินทาง 8 นาทีจึงจะมาถึงโลก ✨`,
      };
    } else if (title.includes('ระบบสุริยะ') || title.includes('จักรวาล')) {
      return {
        name: "คอสมอส",
        avatar: "⭐",
        introduction: `สวัสดี! ฉันคือคอสมอส ผู้พิทักษ์จักรวาล ✨ มาสำรวจความกว้างใหญ่ของ ${stageTitle} และค้นหาความลับของเอกภพกัน!`,
        learningContent: `จักรวาลมีอายุประมาณ 13.8 พันล้านปี ประกอบด้วยกาแลคซีนับล้านล้าน และดาวฤกษ์มากมายมหาศาล 🌟`,
      };
    } else if (title.includes('fill') || title.includes('blank') || title.includes('เติม')) {
      return {
        name: "ควิซซี่",
        avatar: "🧩",
        introduction: `สวัสดี! ฉันคือควิซซี่ ผู้เชี่ยวชาญปริศนา 🔍 ฉันจะช่วยให้คุณเติมคำตอบที่ถูกต้องใน ${stageTitle} กัน!`,
        learningContent: `การเรียนรู้ด้วยการเติมคำตอบจะช่วยให้จำและเข้าใจได้ดีขึ้น มาลองดูกันว่าคุณจำได้แค่ไหน! 🎯`,
      };
    } else if (title.includes('match') || title.includes('จับคู่')) {
      return {
        name: "แมตช์",
        avatar: "🔗",
        introduction: `สวัสดี! ฉันคือแมตช์ ผู้เชี่ยวชาญการจับคู่ 🎯 ฉันจะช่วยให้คุณเชื่อมโยงข้อมูลใน ${stageTitle} ให้ถูกต้อง!`,
        learningContent: `การจับคู่ข้อมูลจะช่วยให้เข้าใจความสัมพันธ์ระหว่างสิ่งต่างๆ ได้ดีขึ้น มาลองจับคู่กัน! 🔄`,
      };
    } else if (title.includes('true') || title.includes('false') || title.includes('จริง') || title.includes('เท็จ')) {
      return {
        name: "ทรูธ",
        avatar: "⚖️",
        introduction: `สวัสดี! ฉันคือทรูธ ผู้พิพากษาความจริง ⚡ ฉันจะช่วยให้คุณแยกแยะความจริงและเท็จใน ${stageTitle} !`,
        learningContent: `การตัดสินใจว่าข้อมูลใดจริงหรือเท็จต้องใช้ความรู้และการคิดวิเคราะห์ มาทดสอบกัน! 🎲`,
      };
    } else {
      return {
        name: "อาสา",
        avatar: "👩‍🚀",
        introduction: `ยินดีต้อนรับสู่ ${stageTitle}! ฉันคืออาสา นักบินอวกาศ ฉันจะเป็นผู้นำทางของคุณในการเรียนรู้เกี่ยวกับดาราศาสตร์ 🚀`,
        learningContent: `ในด่าน ${stageTitle} นี้ เราจะได้เรียนรู้เกี่ยวกับความมหัศจรรย์ของดาราศาสตร์ที่น่าตื่นเต้น!`,
      };
    }
  };

  const character = {
    ...getCharacterForStage(stage?.title || ''),
    completionMessage: "ยอดเยี่ยม! คุณผ่านด่านนี้ได้เป็นอย่างดี! 🎉",
    encouragements: [
      "เยี่ยมมาก! คุณกำลังเรียนรู้ได้ดี ⭐",
      "ไม่เป็นไร ลองใหม่อีกครั้ง! 💪",
      "เก่งมาก! คุณเข้าใจแล้ว 🧠",
      "ดีใจที่ได้เรียนรู้ไปด้วยกัน! 😊",
      "คุณกำลังก้าวหน้าไปอย่างดี! 🚀"
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
          currentUser={currentUser}
          stageId={stageId}
        />
      );
    
    case 'learning':
      return (
        <LearningContent 
          stage={stage}
          character={character}
          onStartQuiz={handleStartQuiz}
          questions={questions}
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
          onExit={handleQuizExit}
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