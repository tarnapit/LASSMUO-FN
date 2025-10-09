"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLearningModuleById } from "../../lib/hooks/useLearningData";
import { LearningModule, Chapter } from "../../types/learning";
import { courseQuizService, courseService, coursePostestService } from "../../lib/api/services";
import { progressManager } from "../../lib/progress";
import Navbar from "../../components/layout/Navbar";
import ProgressBar from "../../components/ui/ProgressBar";
import InteractiveActivityComponent from "../../components/learning/InteractiveActivity";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  ArrowLeft,
  CheckCircle,
  Brain,
  Trophy,
  Star,
  Zap,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default function LearningTopicPage() {
  const params = useParams();
  const router = useRouter();
  const [module, setModule] = useState<LearningModule | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [chapterProgress, setChapterProgress] = useState<Record<string, any>>(
    {}
  );
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [activityScores, setActivityScores] = useState<Record<string, number>>(
    {}
  );
  const [totalScore, setTotalScore] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(
    new Set()
  );
  const [canProceed, setCanProceed] = useState(true);
  // เพิ่ม state เพื่อติดตามกิจกรรมที่กำลังทำอยู่
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);

  // ตรวจสอบว่าสามารถไปหน้าต่อไปได้หรือไม่
  const checkCanProceed = useCallback(() => {
    if (!module) {
      setCanProceed(true);
      return;
    }

    const currentChapter = module.chapters[currentChapterIndex];
    const currentContent = currentChapter?.content[currentContentIndex];

    if (!currentContent) {
      setCanProceed(true);
      return;
    }

    console.log('checkCanProceed called for content:', currentContent.type, currentContent.activity?.id);

    // ถ้าเป็นกิจกรรมที่บังคับ
    if (currentContent.required && currentContent.activity) {
      const activityId = currentContent.activity.id;
      
      // ตรวจสอบว่ากิจกรรมนี้เสร็จแล้วหรือยัง
      const isCompleted = completedActivities.has(activityId);
      
      // อัพเดท currentActivityId
      setCurrentActivityId(activityId);
      
      console.log(`Checking required activity ${activityId}: completed = ${isCompleted}, completedActivities:`, [...completedActivities]);
      
      setCanProceed(isCompleted);
    } else {
      console.log('Content is not a required activity, can proceed');
      setCanProceed(true);
      setCurrentActivityId(null);
    }
  }, [module, currentChapterIndex, currentContentIndex, completedActivities]);

  useEffect(() => {
    const fetchModule = async () => {
      if (params.topic) {
        try {
          const foundModule = await getLearningModuleById(params.topic as string);
          
          // ดึงข้อมูล quiz จาก API (PostTest)
          let foundQuiz = null;
          try {
            // ลองดึง PostTest จาก coursePostest API โดยใช้ courseId
            if (foundModule && foundModule.id) {
              console.log('Looking for PostTest quiz for course:', foundModule.id);
              
              const postestResponse = await coursePostestService.getCoursePostestsByCourseId(foundModule.id);
              
              if (postestResponse.success && postestResponse.data && postestResponse.data.length > 0) {
                // ใช้ PostTest แรกที่มี
                foundQuiz = postestResponse.data[0];
                console.log('Found PostTest quiz for course:', foundQuiz.title || foundQuiz.id);
              } else {
                console.log('No PostTest found for course:', foundModule.id);
                
                // Fallback: ลองดึงจาก course response หากมี coursePostest
                const courseResponse = await courseService.getCourseById(foundModule.id);
                
                if (courseResponse.success && courseResponse.data && courseResponse.data.coursePostest) {
                  const coursePostests = courseResponse.data.coursePostest;
                  if (Array.isArray(coursePostests) && coursePostests.length > 0) {
                    foundQuiz = coursePostests[0];
                    console.log('Found PostTest from course response:', foundQuiz.title || foundQuiz.id);
                  }
                }
              }
            }
            
            // ถ้ายังไม่ได้ quiz จาก PostTest ให้ลองดูจาก CourseQuiz API
            if (!foundQuiz) {
              console.log('No PostTest found, trying CourseQuiz API as fallback');
              const quizResponse = await courseQuizService.getAllCourseQuizzes();
              
              if (quizResponse && Array.isArray(quizResponse) && quizResponse.length > 0) {
                // หาข้อมูล quiz แรกเป็น fallback (อาจต้องปรับให้จับคู่กับ course)
                foundQuiz = quizResponse[0];
                console.log('Using fallback quiz from CourseQuiz API:', foundQuiz.title || foundQuiz.id);
              }
            }
          } catch (quizError) {
            console.log('Error fetching quiz:', quizError);
          }

          if (foundModule) {
            setModule(foundModule);
            setQuiz(foundQuiz);
            
            // รีเซ็ต states เมื่อเปลี่ยน module
            setCompletedActivities(new Set());
            setActivityScores({});
            setTotalScore(0);
            setCurrentActivityId(null);
            
            // เริ่มการเรียน module
            progressManager.startLearningModule(params.topic as string);

            // ตรวจสอบว่า module เสร็จสิ้นแล้วหรือยัง
            const moduleProgress = progressManager.getModuleProgress(
              params.topic as string
            );
            setModuleCompleted(moduleProgress?.isCompleted || false);

            // โหลด progress ของแต่ละ chapter
            const progresses: Record<string, any> = {};
            foundModule.chapters.forEach((chapter) => {
              const chapterProg = progressManager.getChapterProgress(
                params.topic as string,
                chapter.id
              );
              progresses[chapter.id] = chapterProg;
            });
            setChapterProgress(progresses);
          } else {
            router.push("/learning");
          }
        } catch (error) {
          console.error('Error fetching module:', error);
          router.push("/learning");
        }
      }
    };

    fetchModule();
  }, [params.topic, router]);

  // บันทึกเวลาเมื่อเปลี่ยน chapter หรือ content
  useEffect(() => {
    setStartTime(new Date());
  }, [currentChapterIndex, currentContentIndex]);

  // ตรวจสอบทุกครั้งที่เปลี่ยน content หรือ completedActivities
  useEffect(() => {
    checkCanProceed();
  }, [checkCanProceed]);

  // Debug useEffect เพื่อดู state changes
  useEffect(() => {
    console.log('completedActivities changed:', [...completedActivities]);
    console.log('canProceed:', canProceed);
    console.log('currentActivityId:', currentActivityId);
  }, [completedActivities, canProceed, currentActivityId]);

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  const currentChapter = module.chapters[currentChapterIndex];
  const currentContent = currentChapter?.content[currentContentIndex];
  const isLastContent =
    currentContentIndex === currentChapter.content.length - 1;
  const isLastChapter = currentChapterIndex === module.chapters.length - 1;
  const isFirstContent = currentContentIndex === 0;
  const isFirstChapter = currentChapterIndex === 0;

  const nextContent = async () => {
    if (!isLastContent) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (!isLastChapter) {
      // บันทึก progress ของ chapter ปัจจุบันเมื่อจบ chapter
      await completeCurrentChapter();
      setCurrentChapterIndex((prev) => prev + 1);
      setCurrentContentIndex(0);
    } else {
      // จบ module แล้ว
      await completeCurrentChapter();
      await completeModule(true); // ส่ง true เพื่อบอกว่าจะ redirect

      // ถ้ามี quiz ให้ไปหน้า quiz เลย
      if (quiz) {
        router.push(`/quiz/${quiz.id}`);
      }
    }
  };

  const prevContent = () => {
    if (!isFirstContent) {
      setCurrentContentIndex((prev) => prev - 1);
    } else if (!isFirstChapter) {
      setCurrentChapterIndex((prev) => prev - 1);
      setCurrentContentIndex(
        module!.chapters[currentChapterIndex - 1].content.length - 1
      );
    }
  };

  // บันทึก progress ของ chapter ปัจจุบัน
  const completeCurrentChapter = async () => {
    if (!module) return;

    const timeSpent = Math.round(
      (new Date().getTime() - startTime.getTime()) / (1000 * 60)
    ); // นาที
    const currentChapter = module.chapters[currentChapterIndex];

    console.log(
      `Completing chapter ${currentChapter.id} in module ${module.id}`
    );

    await progressManager.updateChapterProgress(
      module.id,
      currentChapter.id,
      100, // อ่านครบ 100%
      timeSpent,
      true // เสร็จแล้ว
    );

    // อัพเดต state
    setChapterProgress((prev) => ({
      ...prev,
      [currentChapter.id]: {
        ...prev[currentChapter.id],
        completed: true,
        readProgress: 100,
        timeSpent: (prev[currentChapter.id]?.timeSpent || 0) + timeSpent,
      },
    }));

    console.log(`Chapter ${currentChapter.id} completed successfully`);

    // ส่ง event เพื่อแจ้งการอัพเดท progress
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("progressUpdated", {
          detail: {
            type: "chapter",
            moduleId: module.id,
            chapterId: currentChapter.id,
          },
        })
      );
    }
  };

  // จบการเรียน module
  const completeModule = async (shouldRedirect = false) => {
    if (!module) return;

    console.log(
      `Completing module ${module.id} with ${module.chapters.length} chapters`
    );
    await progressManager.completeModule(module.id, module.chapters.length);

    // ถ้าไม่ต้องการ redirect ให้แสดงหน้าสรุป
    if (!shouldRedirect) {
      setModuleCompleted(true);
    }

    console.log(`Module ${module.id} completed successfully`);

    // ส่ง event เพื่อแจ้งการอัพเดท progress
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("progressUpdated", {
          detail: { type: "module", moduleId: module.id },
        })
      );
    }
  };

  // จัดการเมื่อเสร็จสิ้นกิจกรรมอินเตอร์แอคทีฟ
  const handleActivityComplete = (
    activityId: string,
    score: number,
    timeSpent: number,
    passed: boolean
  ) => {
    console.log(
      `Activity ${activityId} completed with score ${score} in ${timeSpent} seconds, passed: ${passed}`
    );

    // ตรวจสอบว่าเป็นกิจกรรมปัจจุบันหรือไม่
    if (currentActivityId !== activityId) {
      console.warn(`Activity ${activityId} is not the current activity (${currentActivityId})`);
      return;
    }

    // บันทึกคะแนนกิจกรรม
    setActivityScores((prev) => {
      const newScores = { ...prev, [activityId]: score };
      const newTotal = Object.values(newScores).reduce((sum, s) => sum + s, 0);
      setTotalScore(newTotal);
      return newScores;
    });

    // ถ้าผ่านกิจกรรมแล้ว - อัพเดท state และเรียก checkCanProceed ใน useEffect
    if (passed) {
      setCompletedActivities((prev) => {
        const newSet = new Set([...prev, activityId]);
        console.log(`Activity ${activityId} marked as completed. All completed:`, [...newSet]);
        return newSet;
      });
    } else {
      // ถ้าไม่ผ่าน ก็ตรวจสอบเลย
      checkCanProceed();
    }

    // อัพเดท progress
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("progressUpdated", {
          detail: { type: "activity", activityId, score, timeSpent, passed },
        })
      );
    }
  };

  const renderContent = () => {
    if (!currentContent) return null;

    // Calculate progress percentage
    const progressPercentage =
      ((currentContentIndex + 1) / currentChapter.content.length) * 100;

    switch (currentContent.type) {
      case "text":
        return (
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed text-lg">
              {currentContent.content}
            </p>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div className="text-center">
              {currentContent.imageUrl ? (
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  {/* ตรวจสอบว่าเป็น YouTube URL หรือไม่ */}
                  {currentContent.imageUrl.includes('youtube.com') || currentContent.imageUrl.includes('youtu.be') ? (
                    <div className="relative w-full aspect-video">
                      <iframe
                        src={currentContent.imageUrl.replace('watch?v=', 'embed/')}
                        title={currentContent.content}
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      src={currentContent.imageUrl}
                      controls
                      className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    >
                      ไม่สามารถเล่นวิดีโอได้
                    </video>
                  )}
                  <div className="hidden text-gray-400 text-lg py-8">
                    🎥 {currentContent.content}
                    <div className="text-sm text-gray-500 mt-2">
                      (ไม่สามารถโหลดวิดีโอได้)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 mb-4">
                  <div className="text-gray-400 text-lg">
                    🎥 {currentContent.content}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    (ไม่มีวิดีโอ)
                  </div>
                </div>
              )}
            </div>
            
            {/* แสดงคำบรรยายวิดีโอ */}
            {currentContent.content && (
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-center">
                  {currentContent.content}
                </p>
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div className="space-y-6">
            <div className="text-center">
              {currentContent.imageUrl ? (
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <img
                    src={currentContent.imageUrl}
                    alt={currentContent.content}
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg object-contain"
                    onError={(e) => {
                      // ถ้าโหลดรูปไม่ได้ให้แสดง placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-gray-400 text-lg py-8">
                    📷 {currentContent.content}
                    <div className="text-sm text-gray-500 mt-2">
                      (ไม่สามารถโหลดรูปภาพได้)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 mb-4">
                  <div className="text-gray-400 text-lg">
                    📷 {currentContent.content}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    (ไม่มีรูปภาพ)
                  </div>
                </div>
              )}
            </div>
            
            {/* แสดงคำบรรยายรูปภาพ */}
            {currentContent.content && currentContent.content !== 'รูปภาพประกอบการเรียน' && (
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-center">
                  {currentContent.content}
                </p>
              </div>
            )}
          </div>
        );

      // กิจกรรมอินเตอร์แอคทีฟแต่ละประเภท
      case "quiz":
        return currentContent.activity ? (
          <InteractiveActivityComponent
            key={`${currentChapterIndex}-${currentContentIndex}-${currentContent.activity.id}`}
            activity={currentContent.activity}
            onComplete={(score, timeSpent, passed) =>
              handleActivityComplete(
                currentContent.activity!.id,
                score,
                timeSpent,
                passed
              )
            }
            required={currentContent.required}
            minimumScore={currentContent.minimumScore}
          />
        ) : (
          <div className="text-red-400">ข้อมูลกิจกรรมไม่ถูกต้อง</div>
        );

      case "interactive":
        return currentContent.activity ? (
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-8 border border-blue-500/30">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">
                💡 กิจกรรมปฏิสัมพันธ์
              </h3>
              <p className="text-white text-lg mb-2">
                {currentContent.activity.title}
              </p>
              <p className="text-gray-300 text-sm">
                ทดสอบความเข้าใจจากเนื้อหาที่เพิ่งศึกษา
              </p>
            </div>
            <InteractiveActivityComponent
              key={`${currentChapterIndex}-${currentContentIndex}-${currentContent.activity.id}`}
              activity={currentContent.activity}
              onComplete={(score, timeSpent, passed) =>
                handleActivityComplete(
                  currentContent.activity!.id,
                  score,
                  timeSpent,
                  passed
                )
              }
              required={currentContent.required}
              minimumScore={currentContent.minimumScore}
            />
          </div>
        ) : (
          <div className="text-red-400">ข้อมูลกิจกรรมไม่ถูกต้อง</div>
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
          <Link
            href="/learning"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้าบทเรียน
          </Link>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {module.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center">
                  <BookOpen size={16} className="mr-1" />
                  <span>
                    บทที่ {currentChapterIndex + 1}: {currentChapter.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{currentChapter.estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* Score Display */}
            {totalScore > 0 && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="text-yellow-400" size={24} />
                    <div>
                      <div className="text-yellow-400 font-bold text-lg">
                        {totalScore} แต้ม
                      </div>
                      <div className="text-yellow-300 text-sm">คะแนนรวม</div>
                    </div>
                    <Zap className="text-orange-400" size={20} />
                  </div>

                  <div className="text-sm text-gray-300">
                    กิจกรรมที่ผ่าน: {completedActivities.size}
                  </div>
                </div>
              </div>
            )}
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
              const isCompleted =
                chapterProgress[chapter.id]?.completed || false;
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
                      ? "bg-yellow-500 text-black"
                      : isCompleted
                      ? "bg-green-500/20 text-green-400 border border-green-500"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
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
          {/* แจ้งเตือนเมื่อต้องทำกิจกรรมก่อน */}
          {!canProceed && currentContent?.required && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-3">
                <Brain className="text-blue-400 mr-3" size={24} />
                <h3 className="text-xl font-bold text-blue-300">
                  🎯 มาลองทำกิจกรรมกันเถอะ!
                </h3>
              </div>
              <p className="text-blue-200 mb-4">
                ทำกิจกรรมในหน้านี้ให้เสร็จก่อน แล้วเราจะไปเรียนรู้เรื่องใหม่ๆ ต่อกันนะ! 🚀
              </p>
              <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-600/30">
                <p className="text-blue-300 text-sm">
                  ✨ <strong>เคล็ดลับ:</strong>{" "}
                  อ่านเนื้อหาให้เข้าใจก่อนทำกิจกรรม 
                  หากตอบผิดก็ไม่เป็นไร ลองดูคำใบ้แล้วลองใหม่นะ! 😊
                </p>
              </div>
            </div>
          )}

          {moduleCompleted ? (
            // Module Completed Screen
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-green-500/30 text-center">
              <div className="mb-6">
                <Trophy className="mx-auto text-yellow-400 mb-4" size={80} />
                <h2 className="text-4xl font-bold text-white mb-4">
                  ยินดีด้วย!
                </h2>
                <p className="text-xl text-gray-300 mb-2">คุณเรียนจบ</p>
                <h3 className="text-3xl font-bold text-yellow-400 mb-6">
                  {module.title}
                </h3>
                <p className="text-gray-300">แล้วเสร็จเรียบร้อย</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-6">
                  <BookOpen className="mx-auto text-blue-400 mb-2" size={32} />
                  <div className="text-2xl font-bold text-white">
                    {module.chapters.length}
                  </div>
                  <div className="text-gray-400">บทเรียนที่เรียนจบ</div>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <Clock className="mx-auto text-purple-400 mb-2" size={32} />
                  <div className="text-2xl font-bold text-white">
                    {module.estimatedTime}
                  </div>
                  <div className="text-gray-400">เวลาโดยประมาณ</div>
                </div>
              </div>

              <div className="space-y-6">
                {quiz ? (
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-8 border-2 border-orange-500/40">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold text-orange-400 mb-2">
                        แบบฝึกหัด
                      </h4>
                      <p className="text-white text-lg mb-1">
                        แบบฝึกหัด: {quiz.title}
                      </p>
                      <p className="text-gray-300 text-sm">
                        ทดสอบความเข้าใจด้วยแบบทดสอบที่เกี่ยวข้องกับบทเรียนนี้
                      </p>
                    </div>

                    <div className="text-center">
                      <Link
                        href={`/quiz/${quiz.id}`}
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all transform hover:scale-105 font-bold text-lg inline-flex items-center shadow-lg"
                      >
                        <Brain size={24} className="mr-3" />
                        ไปทำแบบทดสอบ
                      </Link>
                    </div>

                    <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Brain size={16} className="mr-1 text-orange-400" />
                        {quiz.question?.questions?.length || 0} ข้อ
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-orange-400" />
                        {quiz.timeLimit ? `${quiz.timeLimit} นาที` : "ไม่จำกัด"}
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
                      <h4 className="text-lg font-semibold text-gray-400 mb-2">
                        ยังไม่มีแบบทดสอบ
                      </h4>
                      <p className="text-gray-500">
                        แบบทดสอบสำหรับบทเรียนนี้จะมาเร็วๆ นี้
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setModuleCompleted(false)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold inline-flex items-center"
                  >
                    <BookOpen size={20} className="mr-2" />
                    ดูเนื้อหาการเรียน
                  </button>
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
            <>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
                {renderContent()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevContent}
                  disabled={isFirstChapter && isFirstContent}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                    isFirstChapter && isFirstContent
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
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
                  disabled={
                    !canProceed || (isLastChapter && isLastContent && !quiz)
                  }
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                    !canProceed
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : isLastChapter && isLastContent && !quiz
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : isLastChapter && isLastContent && quiz
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-400 hover:to-teal-400"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400"
                  }`}
                >
                  {!canProceed ? (
                    <>
                      <Brain size={20} className="mr-2" />
                      ทำกิจกรรมก่อนนะ! 🎮
                    </>
                  ) : isLastChapter && isLastContent && quiz ? (
                    <>
                      <Trophy size={20} className="mr-2" />
                      เสร็จแล้ว - ไปทำแบบทดสอบ
                    </>
                  ) : (
                    <>
                      ถัดไป
                      <ChevronRight size={20} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </>
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
