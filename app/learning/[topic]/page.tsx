"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLearningModuleById } from "../../data/learning-modules";
import { getQuizByModuleId } from "../../data/quizzes";
import { LearningModule, Chapter } from "../../types/learning";
import { progressManager } from "../../lib/progress";
import Navbar from "../../components/layout/Navbar";
import ProgressBar from "../../components/ui/ProgressBar";
import { ChevronLeft, ChevronRight, BookOpen, Clock, ArrowLeft, CheckCircle, Brain, Trophy } from "lucide-react";
import Link from "next/link";

export default function LearningTopicPage() {
  const params = useParams();
  const router = useRouter();
  const [module, setModule] = useState<LearningModule | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [chapterProgress, setChapterProgress] = useState<Record<string, any>>({});
  const [moduleCompleted, setModuleCompleted] = useState(false);

  useEffect(() => {
    if (params.topic) {
      const foundModule = getLearningModuleById(params.topic as string);
      const foundQuiz = getQuizByModuleId(params.topic as string);
      
      if (foundModule) {
        setModule(foundModule);
        setQuiz(foundQuiz);
        // เริ่มการเรียน module
        progressManager.startLearningModule(params.topic as string);
        
        // ตรวจสอบว่า module เสร็จสิ้นแล้วหรือยัง
        const moduleProgress = progressManager.getModuleProgress(params.topic as string);
        setModuleCompleted(moduleProgress?.isCompleted || false);
        
        // โหลด progress ของแต่ละ chapter
        const progresses: Record<string, any> = {};
        foundModule.chapters.forEach(chapter => {
          const chapterProg = progressManager.getChapterProgress(params.topic as string, chapter.id);
          progresses[chapter.id] = chapterProg;
        });
        setChapterProgress(progresses);
      } else {
        router.push('/learning');
      }
    }
  }, [params.topic, router]);

  // บันทึกเวลาเมื่อเปลี่ยน chapter
  useEffect(() => {
    setStartTime(new Date());
  }, [currentChapterIndex]);

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  const currentChapter = module.chapters[currentChapterIndex];
  const currentContent = currentChapter?.content[currentContentIndex];
  const isLastContent = currentContentIndex === currentChapter.content.length - 1;
  const isLastChapter = currentChapterIndex === module.chapters.length - 1;
  const isFirstContent = currentContentIndex === 0;
  const isFirstChapter = currentChapterIndex === 0;

  const nextContent = () => {
    if (!isLastContent) {
      setCurrentContentIndex(prev => prev + 1);
    } else if (!isLastChapter) {
      // บันทึก progress ของ chapter ปัจจุบันเมื่อจบ chapter
      completeCurrentChapter();
      setCurrentChapterIndex(prev => prev + 1);
      setCurrentContentIndex(0);
    } else {
      // จบ module แล้ว
      completeCurrentChapter();
      completeModule();
    }
  };

  const prevContent = () => {
    if (!isFirstContent) {
      setCurrentContentIndex(prev => prev - 1);
    } else if (!isFirstChapter) {
      setCurrentChapterIndex(prev => prev - 1);
      setCurrentContentIndex(module!.chapters[currentChapterIndex - 1].content.length - 1);
    }
  };

  // บันทึก progress ของ chapter ปัจจุบัน
  const completeCurrentChapter = () => {
    if (!module) return;
    
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60)); // นาที
    const currentChapter = module.chapters[currentChapterIndex];
    
    progressManager.updateChapterProgress(
      module.id,
      currentChapter.id,
      100, // อ่านครบ 100%
      timeSpent,
      true // เสร็จแล้ว
    );

    // อัพเดต state
    setChapterProgress(prev => ({
      ...prev,
      [currentChapter.id]: {
        ...prev[currentChapter.id],
        completed: true,
        readProgress: 100,
        timeSpent: (prev[currentChapter.id]?.timeSpent || 0) + timeSpent
      }
    }));
  };

  // จบการเรียน module
  const completeModule = () => {
    if (!module) return;
    
    progressManager.completeModule(module.id);
    setModuleCompleted(true);
  };

  const renderContent = () => {
    if (!currentContent) return null;

    // Calculate progress percentage
    const progressPercentage = ((currentContentIndex + 1) / currentChapter.content.length) * 100;

    switch (currentContent.type) {
      case 'text':
        return (
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed text-lg">
              {currentContent.content}
            </p>
          </div>
        );
      
      case 'image':
        return (
          <div className="text-center">
            <div className="bg-gray-800 rounded-lg p-8 mb-4">
              <div className="text-gray-400 text-lg">
                📷 {currentContent.content}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                (รูปภาพจะแสดงที่นี่)
              </div>
            </div>
            {currentContent.imageUrl && (
              <p className="text-sm text-gray-400">{currentContent.imageUrl}</p>
            )}
          </div>
        );
      
      case 'interactive':
        return (
          <div className="bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-xl p-8 text-center border-2 border-orange-500/40">
            <h3 className="text-3xl font-bold text-orange-400 mb-4">แบบฝึกหัด</h3>
            <p className="text-white text-lg mb-2">{currentContent.content}</p>
            <p className="text-gray-300 text-sm mb-6">ทดสอบความเข้าใจด้วยแบบทดสอบที่เกี่ยวข้องกับบทเรียนนี้</p>
            
            {quiz ? (
              <Link 
                href={`/quiz/${quiz.id}`}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                <Brain size={24} className="mr-3" />
                ไปทำแบบทดสอบ
              </Link>
            ) : (
              <div className="text-gray-400 py-4">
                <p>ยังไม่มีแบบทดสอบสำหรับบทเรียนนี้</p>
              </div>
            )}
            
            {quiz && (
              <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center">
                  <Brain size={16} className="mr-1 text-orange-400" />
                  {quiz.questions.length} ข้อ
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-orange-400" />
                  {quiz.timeLimit ? `${quiz.timeLimit} นาที` : 'ไม่จำกัด'}
                </div>
                <div className="flex items-center">
                  <Trophy size={16} className="mr-1 text-orange-400" />
                  ผ่าน {quiz.passingScore}%
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return <div className="text-gray-200">{currentContent.content}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learning" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้าบทเรียน
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">{module.title}</h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center">
              <BookOpen size={16} className="mr-1" />
              <span>บทที่ {currentChapterIndex + 1}: {currentChapter.title}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{currentChapter.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">ความคืบหน้า</span>
            <span className="text-sm text-gray-400">
              {currentContentIndex + 1} / {currentChapter.content.length}
            </span>
          </div>
          <ProgressBar 
            current={currentContentIndex + 1} 
            total={currentChapter.content.length} 
          />
        </div>

        {/* Chapter Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {module.chapters.map((chapter, index) => {
              const isCompleted = chapterProgress[chapter.id]?.completed || false;
              const isCurrent = index === currentChapterIndex;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setCurrentChapterIndex(index);
                    setCurrentContentIndex(0);
                  }}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center space-x-2 ${
                    isCurrent
                      ? 'bg-yellow-500 text-black'
                      : isCompleted
                      ? 'bg-green-500/20 text-green-400 border border-green-500'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {isCompleted && <CheckCircle size={16} />}
                  <span>บทที่ {index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {moduleCompleted ? (
            // Module Completed Screen
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-green-500/30 text-center">
              <div className="mb-6">
                <Trophy className="mx-auto text-yellow-400 mb-4" size={80} />
                <h2 className="text-4xl font-bold text-white mb-4">ยินดีด้วย!</h2>
                <p className="text-xl text-gray-300 mb-2">คุณเรียนจบ</p>
                <h3 className="text-3xl font-bold text-yellow-400 mb-6">{module.title}</h3>
                <p className="text-gray-300">แล้วเสร็จเรียบร้อย</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-6">
                  <BookOpen className="mx-auto text-blue-400 mb-2" size={32} />
                  <div className="text-2xl font-bold text-white">{module.chapters.length}</div>
                  <div className="text-gray-400">บทเรียนที่เรียนจบ</div>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <Clock className="mx-auto text-purple-400 mb-2" size={32} />
                  <div className="text-2xl font-bold text-white">{module.estimatedTime}</div>
                  <div className="text-gray-400">เวลาโดยประมาณ</div>
                </div>
              </div>

              <div className="space-y-6">
                {quiz ? (
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-8 border-2 border-orange-500/40">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-orange-400 mb-2">แบบฝึกหัด</h4>
                      <p className="text-white text-lg mb-1">แบบฝึกหัด: จับคู่ชื่อดาวเคราะห์กับลักษณะเฉพาะ</p>
                      <p className="text-gray-300 text-sm">ทดสอบความเข้าใจด้วยแบบทดสอบที่เกี่ยวข้องกับบทเรียนนี้</p>
                    </div>
                    
                    <div className="text-center">
                      {quiz ? (
                        <Link 
                          href={`/quiz/${quiz.id}`}
                          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all transform hover:scale-105 font-bold text-lg inline-flex items-center shadow-lg"
                        >
                          <Brain size={24} className="mr-3" />
                          ไปทำแบบทดสอบ
                        </Link>
                      ) : (
                        <div className="text-gray-400 py-4">
                          <p>ยังไม่มีแบบทดสอบสำหรับบทเรียนนี้</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Brain size={16} className="mr-1 text-orange-400" />
                        {quiz.questions.length} ข้อ
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-orange-400" />
                        {quiz.timeLimit ? `${quiz.timeLimit} นาที` : 'ไม่จำกัด'}
                      </div>
                      <div className="flex items-center">
                        <Trophy size={16} className="mr-1 text-orange-400" />
                        ผ่าน {quiz.passingScore}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-500/20 rounded-lg p-6 border border-gray-500/30">
                    <div className="text-center">
                      <Brain className="mx-auto text-gray-400 mb-3" size={48} />
                      <h4 className="text-lg font-semibold text-gray-400 mb-2">ยังไม่มีแบบทดสอบ</h4>
                      <p className="text-gray-500">แบบทดสอบสำหรับบทเรียนนี้จะมาเร็วๆ นี้</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <Link 
                    href="/learning" 
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-semibold inline-flex items-center"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    กลับไปหน้าบทเรียน
                  </Link>
                  <Link 
                    href="/quiz" 
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold inline-flex items-center"
                  >
                    <Brain size={20} className="mr-2" />
                    ดูแบบทดสอบทั้งหมด
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Regular Learning Content
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
              {renderContent()}
            </div>
          )}

          {/* Navigation Buttons - Only show when not completed */}
          {!moduleCompleted && (
            <div className="flex justify-between items-center">
              <button
                onClick={prevContent}
                disabled={isFirstChapter && isFirstContent}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  isFirstChapter && isFirstContent
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronLeft size={20} className="mr-2" />
                ย้อนกลับ
              </button>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">
                  บทที่ {currentChapterIndex + 1} จาก {module.chapters.length}
                </div>
                <div className="text-lg font-semibold text-white">
                  {currentChapter.title}
                </div>
              </div>

              <button
                onClick={nextContent}
                disabled={isLastChapter && isLastContent}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  isLastChapter && isLastContent
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400'
                }`}
              >
                ถัดไป
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          )}

          {/* Quiz Navigation Button - แสดงเมื่อจบ module แล้ว */}
          {isLastChapter && isLastContent && quiz && (
            <div className="mt-8 text-center">
              <Link 
                href={`/quiz/${quiz.id}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-400 hover:to-teal-400 transition-all"
              >
                <Trophy size={20} className="mr-2" />
                ไปทำแบบทดสอบ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Background Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
