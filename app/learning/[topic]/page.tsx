"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLearningModuleById } from "../../lib/hooks/useLearningData";
import { LearningModule, Chapter } from "../../types/learning";
import { courseQuizService, coursePostestService } from "../../lib/api/services";
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
  // เพิ่ม state เพื่อเช็คว่าควรแสดงหน้าเสร็จสิ้นหรือไม่
  const [shouldShowCompletion, setShouldShowCompletion] = useState(false);

  // ฟังก์ชันหาลำดับ module ในหลักสูตร
  const getModuleOrder = (moduleId: string): number => {
    // กำหนดลำดับ module ตาม API หรือการออกแบบหลักสูตร
    const moduleOrder: Record<string, number> = {
      'ba3fd565-dc81-4e74-b253-ef0a4074f8cf': 1, // Solar System
      '4db710de-f734-4c7e-bf5f-a5645847b5bc': 2, // Earth Structure
      // เพิ่ม module อื่นๆ ตามลำดับที่ออกแบบไว้
      // 'stellar-evolution': 3,
      // 'galaxies-universe': 4,
    };
    
    console.log(`📊 Module order for ${moduleId}: ${moduleOrder[moduleId] || 1}`);
    return moduleOrder[moduleId] || 1; // default เป็น 1 ถ้าไม่เจอ
  };

  // ตรวจสอบว่าควรแสดงหน้าเสร็จสิ้นหรือไม่
  const shouldDisplayCompletionScreen = () => {
    if (!module || !moduleCompleted) return false;
    
    // แสดงหน้าเสร็จสิ้นเฉพาะเมื่อ:
    // 1. module เสร็จแล้ว AND
    // 2. อยู่ในส่วนสุดท้ายของ chapter สุดท้าย AND
    // 3. shouldShowCompletion เป็น true
    const isLastChapter = currentChapterIndex === module.chapters.length - 1;
    const isLastContent = currentContentIndex === module.chapters[currentChapterIndex]?.content.length - 1;
    
    return isLastChapter && isLastContent && shouldShowCompletion;
  };

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
                // ค้นหา PostTest ที่ตรงกับ courseId ของ module นี้
                const matchingPostest = postestResponse.data.find(postest => 
                  postest.courseId === foundModule.id
                );
                
                if (matchingPostest) {
                  // สร้าง quiz object ที่มี ID ในรูปแบบที่ถูกต้อง
                  foundQuiz = {
                    ...matchingPostest,
                    // ใช้ ID จริงจากฐานข้อมูล แต่เก็บ original ID ไว้ด้วย
                    originalId: matchingPostest.id,
                    // อาจจะต้องใช้ title-based ID สำหรับ compatibility
                    legacyId: matchingPostest.title?.includes('โครงสร้างโลก') 
                      ? 'earth-structure-posttest' 
                      : matchingPostest.title?.includes('ระบบสุริยะ')
                      ? 'solar-system-posttest'
                      : matchingPostest.id
                  };
                  
                  console.log('Found matching PostTest quiz for course:', {
                    courseId: foundModule.id,
                    title: foundQuiz.title,
                    originalId: foundQuiz.originalId,
                    legacyId: foundQuiz.legacyId,
                    postestCourseId: foundQuiz.courseId
                  });
                } else {
                  console.log('No PostTest found matching courseId:', foundModule.id);
                  console.log('Available postests:', postestResponse.data.map(p => ({
                    id: p.id, 
                    title: p.title, 
                    courseId: p.courseId
                  })));
                }
              } else {
                console.log('No PostTest found for course:', foundModule.id);
                
                // Fallback: ลองดึงจาก course response หากมี coursePostest
                // TODO: เพิ่ม courseService หรือใช้ API อื่นที่มีอยู่แล้ว
                console.log('CourseService not available, skipping course response check');
              }
            }
            
            // ถ้ายังไม่ได้ quiz จาก PostTest ให้ลองดูจาก CourseQuiz API
            if (!foundQuiz && foundModule && foundModule.id) {
              console.log('No PostTest found, trying CourseQuiz API as fallback for course:', foundModule.id);
              
              // ลองดึง quiz ตาม courseId เฉพาะ
              try {
                const courseQuizResponse = await courseQuizService.getCourseQuizzesByCourseId(foundModule.id);
                
                if (courseQuizResponse.success && courseQuizResponse.data && courseQuizResponse.data.length > 0) {
                  // ใช้ quiz แรกที่ตรงกับ course นี้
                  foundQuiz = courseQuizResponse.data[0];
                  console.log('Found matching quiz for course from CourseQuiz API:', foundQuiz.title || foundQuiz.id);
                } else {
                  // ถ้าไม่มีข้อมูลใน CourseQuiz API ให้ลองดูจาก API ทั่วไป
                  console.log('No specific CourseQuiz found, trying general CourseQuiz API as last resort');
                  const allQuizResponse = await courseQuizService.getAllCourseQuizzes();
                  
                  if (allQuizResponse.success && allQuizResponse.data && allQuizResponse.data.length > 0) {
                    // หา quiz ที่ courseId ตรงกัน
                    const matchingQuiz = allQuizResponse.data.find(quiz => quiz.courseId === foundModule.id);
                    
                    if (matchingQuiz) {
                      foundQuiz = matchingQuiz;
                      console.log('Found matching quiz by courseId from general API:', foundQuiz.title || foundQuiz.id);
                    } else {
                      console.log('No matching quiz found for course:', foundModule.id);
                    }
                  }
                }
              } catch (courseQuizError) {
                console.log('Error fetching CourseQuiz by courseId:', courseQuizError);
              }
            }
          } catch (quizError) {
            console.log('Error fetching quiz:', quizError);
          }

          if (foundModule) {
            setModule(foundModule);
            setQuiz(foundQuiz);
            
            console.log(`📚 Module loaded:`, {
              id: foundModule.id,
              title: foundModule.title,
              moduleOrder: getModuleOrder(foundModule.id),
              chaptersCount: foundModule.chapters.length
            });
            
            // Debug quiz information
            if (foundQuiz) {
              console.log(`🎯 Quiz loaded for module ${foundModule.id}:`, {
                quizId: foundQuiz.id,
                originalId: (foundQuiz as any).originalId,
                legacyId: (foundQuiz as any).legacyId,
                quizTitle: foundQuiz.title,
                courseId: foundQuiz.courseId
              });
            } else {
              console.log(`❌ No quiz found for module ${foundModule.id}`);
            }
            
            // รีเซ็ต states เมื่อเปลี่ยน module
            setCompletedActivities(new Set());
            setActivityScores({});
            setTotalScore(0);
            setCurrentActivityId(null);
            setShouldShowCompletion(false);
            
            // เริ่มการเรียน module
            progressManager.startLearningModule(params.topic as string);

            // ตรวจสอบว่า module เสร็จสิ้นแล้วหรือยังจาก API จริง
            const checkModuleCompletion = async () => {
              try {
                // ใช้ฟังก์ชันเดียวกับหน้า Learning page
                const completionPercentage = await progressManager.getModuleCompletionPercentageWithAPI(foundModule.id);
                const isModuleCompleted = completionPercentage >= 100;
                
                console.log(`📊 Module completion check for ${foundModule.title}:`, {
                  completionPercentage,
                  isModuleCompleted,
                  moduleId: foundModule.id
                });
                
                setModuleCompleted(isModuleCompleted);
                
                // ถ้า module เสร็จแล้ว ให้ไปส่วนสุดท้ายและแสดงหน้าเสร็จสิ้น
                if (isModuleCompleted) {
                  await progressManager.completeModule(foundModule.id, foundModule.chapters.length);
                  
                  // ไปส่วนสุดท้ายของ module
                  const lastChapterIndex = foundModule.chapters.length - 1;
                  const lastContentIndex = foundModule.chapters[lastChapterIndex].content.length - 1;
                  
                  setCurrentChapterIndex(lastChapterIndex);
                  setCurrentContentIndex(lastContentIndex);
                  setShouldShowCompletion(true);
                }
              } catch (error) {
                console.error('Error checking module completion:', error);
                // Fallback ใช้ local progress
                const moduleProgress = progressManager.getModuleProgress(params.topic as string);
                const isCompleted = moduleProgress?.isCompleted || false;
                setModuleCompleted(isCompleted);
                
                if (isCompleted) {
                  // ไปส่วนสุดท้ายของ module
                  const lastChapterIndex = foundModule.chapters.length - 1;
                  const lastContentIndex = foundModule.chapters[lastChapterIndex].content.length - 1;
                  
                  setCurrentChapterIndex(lastChapterIndex);
                  setCurrentContentIndex(lastContentIndex);
                  setShouldShowCompletion(true);
                }
              }
            };
            
            await checkModuleCompletion();

            // โหลด progress ของแต่ละ chapter จาก API ถ้าเป็นไปได้
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

  // Listen for progress updates และรีเฟรช module completion
  useEffect(() => {
    const handleProgressUpdate = async () => {
      if (module) {
        console.log('📡 Progress update received, checking module completion...');
        try {
          const completionPercentage = await progressManager.getModuleCompletionPercentageWithAPI(module.id);
          const isModuleCompleted = completionPercentage >= 100;
          
          console.log(`📊 Updated module completion for ${module.title}:`, {
            completionPercentage,
            isModuleCompleted
          });
          
          setModuleCompleted(isModuleCompleted);
          
          // ถ้า module เสร็จแล้วและอยู่ในส่วนสุดท้าย ให้แสดงหน้าเสร็จสิ้น
          if (isModuleCompleted) {
            const isLastChapter = currentChapterIndex === module.chapters.length - 1;
            const isLastContent = currentContentIndex === module.chapters[currentChapterIndex]?.content.length - 1;
            
            if (isLastChapter && isLastContent) {
              setShouldShowCompletion(true);
            }
          }
        } catch (error) {
          console.error('Error updating module completion:', error);
        }
      }
    };

    window.addEventListener('progressUpdated', handleProgressUpdate as EventListener);
    
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate as EventListener);
    };
  }, [module, currentChapterIndex, currentContentIndex]);

  // เช็ค module completion เมื่อหน้าเว็บ visible อีกครั้ง
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && module) {
        console.log('👁️ Page visible again, checking module completion...');
        try {
          const completionPercentage = await progressManager.getModuleCompletionPercentageWithAPI(module.id);
          const isModuleCompleted = completionPercentage >= 100;
          
          console.log(`👁️ Visibility check module completion for ${module.title}:`, {
            completionPercentage,
            isModuleCompleted
          });
          
          setModuleCompleted(isModuleCompleted);
          
          // ถ้า module เสร็จแล้วและอยู่ในส่วนสุดท้าย ให้แสดงหน้าเสร็จสิ้น
          if (isModuleCompleted) {
            const isLastChapter = currentChapterIndex === module.chapters.length - 1;
            const isLastContent = currentContentIndex === module.chapters[currentChapterIndex]?.content.length - 1;
            
            if (isLastChapter && isLastContent) {
              setShouldShowCompletion(true);
            }
          }
        } catch (error) {
          console.error('Error checking module completion on visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [module, currentChapterIndex, currentContentIndex]);

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

  // Debug log การแสดงผล
  console.log('🎯 Learning page render:', {
    moduleId: module.id,
    moduleTitle: module.title,
    moduleCompleted: moduleCompleted,
    hasQuiz: !!quiz
  });

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
      await completeModule(false); // ไม่ redirect ให้แสดงหน้าเสร็จสิ้น
      
      // แสดงหน้าเสร็จสิ้น
      setShouldShowCompletion(true);
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

    setModuleCompleted(true);

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
          <div className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed text-sm sm:text-base lg:text-lg">
              {currentContent.content}
            </p>
          </div>
        );

      case "video":
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-center">
              {currentContent.imageUrl ? (
                <div className="bg-white/5 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
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
                      className="max-w-full max-h-64 sm:max-h-96 mx-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    >
                      ไม่สามารถเล่นวิดีโอได้
                    </video>
                  )}
                  <div className="hidden text-gray-400 text-base sm:text-lg py-6 sm:py-8">
                    🎥 {currentContent.content}
                    <div className="text-xs sm:text-sm text-gray-500 mt-2">
                      (ไม่สามารถโหลดวิดีโอได้)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 sm:p-8 mb-3 sm:mb-4">
                  <div className="text-gray-400 text-base sm:text-lg">
                    🎥 {currentContent.content}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2">
                    (ไม่มีวิดีโอ)
                  </div>
                </div>
              )}
            </div>
            
            {/* แสดงคำบรรยายวิดีโอ */}
            {currentContent.content && (
              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-center text-sm sm:text-base">
                  {currentContent.content}
                </p>
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              {currentContent.imageUrl ? (
                <div className="bg-white/5 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <img
                    src={currentContent.imageUrl}
                    alt={currentContent.content}
                    className="max-w-full max-h-64 sm:max-h-80 lg:max-h-96 mx-auto rounded-lg shadow-lg object-contain"
                    onError={(e) => {
                      // ถ้าโหลดรูปไม่ได้ให้แสดง placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-gray-400 text-base sm:text-lg py-6 sm:py-8">
                    📷 {currentContent.content}
                    <div className="text-xs sm:text-sm text-gray-500 mt-2">
                      (ไม่สามารถโหลดรูปภาพได้)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 sm:p-8 mb-3 sm:mb-4">
                  <div className="text-gray-400 text-base sm:text-lg">
                    📷 {currentContent.content}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2">
                    (ไม่มีรูปภาพ)
                  </div>
                </div>
              )}
            </div>
            
            {/* แสดงคำบรรยายรูปภาพ */}
            {currentContent.content && currentContent.content !== 'รูปภาพประกอบการเรียน' && (
              <div className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-center text-sm sm:text-base">
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
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 sm:p-6 lg:p-8 border border-blue-500/30">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 mb-2">
                💡 กิจกรรมปฏิสัมพันธ์
              </h3>
              <p className="text-white text-base sm:text-lg mb-2 px-2">
                {currentContent.activity.title}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm px-4">
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
          <div className="text-red-400 text-sm sm:text-base text-center">ข้อมูลกิจกรรมไม่ถูกต้อง</div>
        );

      default:
        return <div className="text-gray-200">{currentContent.content}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/learning"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="mr-2 sm:mr-2" />
            กลับไปหน้าบทเรียน
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {module.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-400 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <BookOpen size={14} className="mr-1 sm:mr-1 flex-shrink-0" />
                  <span className="text-sm">
                    บทที่ {getModuleOrder(module.id)}: {module.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1 sm:mr-1 flex-shrink-0" />
                  <span className="text-sm">{module.estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* Score Display */}
            {totalScore > 0 && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-yellow-500/30 w-full lg:w-auto">
                <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Star className="text-yellow-400 flex-shrink-0" size={20} />
                    <div>
                      <div className="text-yellow-400 font-bold text-base sm:text-lg">
                        {totalScore} แต้ม
                      </div>
                      <div className="text-yellow-300 text-xs sm:text-sm">คะแนนรวม</div>
                    </div>
                    <Zap className="text-orange-400 flex-shrink-0" size={16} />
                  </div>

                  <div className="text-xs sm:text-sm text-gray-300 text-right lg:text-left">
                    <div>กิจกรรมที่ผ่าน:</div>
                    <div className="font-bold">{completedActivities.size}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-gray-400">ความคืบหน้า</span>
            <span className="text-xs sm:text-sm text-gray-400">
              {currentContentIndex + 1} / {currentChapter.content.length}
            </span>
          </div>
          <ProgressBar
            current={currentContentIndex + 1}
            total={currentChapter.content.length}
          />
        </div>

        {/* Chapter Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-hide">
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
                  className={`px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1 sm:space-x-2 text-sm flex-shrink-0 ${
                    isCurrent
                      ? "bg-yellow-500 text-black font-bold"
                      : isCompleted
                      ? "bg-green-500/20 text-green-400 border border-green-500"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {isCompleted && <CheckCircle size={14} className="flex-shrink-0" />}
                  <span className="hidden sm:inline">ส่วนที่ {index + 1}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* แจ้งเตือนเมื่อต้องทำกิจกรรมก่อน */}
          {!canProceed && currentContent?.required && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-start sm:items-center mb-3">
                <Brain className="text-blue-400 mr-2 sm:mr-3 flex-shrink-0 mt-1 sm:mt-0" size={20} />
                <h3 className="text-lg sm:text-xl font-bold text-blue-300">
                  🎯 มาลองทำกิจกรรมกันเถอะ!
                </h3>
              </div>
              <p className="text-blue-200 mb-4 text-sm sm:text-base leading-relaxed">
                ทำกิจกรรมในหน้านี้ให้เสร็จก่อน แล้วเราจะไปเรียนรู้เรื่องใหม่ๆ ต่อกันนะ! 🚀
              </p>
              <div className="bg-blue-600/20 rounded-lg p-3 sm:p-4 border border-blue-600/30">
                <p className="text-blue-300 text-xs sm:text-sm leading-relaxed">
                  ✨ <strong>เคล็ดลับ:</strong>{" "}
                  อ่านเนื้อหาให้เข้าใจก่อนทำกิจกรรม 
                  หากตอบผิดก็ไม่เป็นไร ลองดูคำใบ้แล้วลองใหม่นะ! 😊
                </p>
              </div>
            </div>
          )}

          {shouldDisplayCompletionScreen() ? (
            // Module Completed Screen
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-green-500/30 text-center">
              <div className="mb-4 sm:mb-6">
                <Trophy className="mx-auto text-yellow-400 mb-3 sm:mb-4" size={60} />
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                  ยินดีด้วย!
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 mb-2">คุณเรียนจบ</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400 mb-4 sm:mb-6 px-4">
                  {module.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">แล้วเสร็จเรียบร้อย</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/10 rounded-lg p-4 sm:p-6">
                  <BookOpen className="mx-auto text-blue-400 mb-2" size={28} />
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {module.chapters.length}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">บทเรียนที่เรียนจบ</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 sm:p-6">
                  <Clock className="mx-auto text-purple-400 mb-2" size={28} />
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {module.estimatedTime}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">เวลาโดยประมาณ</div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {quiz ? (
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-orange-500/40">
                    <div className="text-center mb-4 sm:mb-6">
                      <h4 className="text-xl sm:text-2xl font-bold text-orange-400 mb-2">
                        แบบฝึกหัด
                      </h4>
                      <p className="text-white text-base sm:text-lg mb-1 px-2">
                        แบบฝึกหัด: {quiz.title}
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm px-4">
                        ทดสอบความเข้าใจด้วยแบบทดสอบที่เกี่ยวข้องกับบทเรียนนี้
                      </p>
                    </div>

                    <div className="text-center">
                      <Link
                        href={`/quiz/${(quiz as any).originalId || quiz.id}`}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all transform hover:scale-105 font-bold text-base sm:text-lg inline-flex items-center shadow-lg"
                      >
                        <Brain size={20} className="mr-2 sm:mr-3 flex-shrink-0" />
                        <span>ไปทำแบบทดสอบ</span>
                      </Link>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-300">
                      <div className="flex items-center justify-center">
                        <Brain size={14} className="mr-1 text-orange-400 flex-shrink-0" />
                        {quiz.question?.questions?.length || 0} ข้อ
                      </div>
                      <div className="flex items-center justify-center">
                        <Clock size={14} className="mr-1 text-orange-400 flex-shrink-0" />
                        {quiz.timeLimit ? `${quiz.timeLimit} นาที` : "ไม่จำกัด"}
                      </div>
                      <div className="flex items-center justify-center">
                        <Trophy size={14} className="mr-1 text-orange-400 flex-shrink-0" />
                        ผ่าน {quiz.passingScore}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-500/20 rounded-lg p-4 sm:p-6 border border-gray-500/30">
                    <div className="text-center">
                      <Brain className="mx-auto text-gray-400 mb-3" size={40} />
                      <h4 className="text-base sm:text-lg font-semibold text-gray-400 mb-2">
                        ยังไม่มีแบบทดสอบ
                      </h4>
                      <p className="text-gray-500 text-sm">
                        แบบทดสอบสำหรับบทเรียนนี้จะมาเร็วๆ นี้
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => {
                      setShouldShowCompletion(false);
                      setCurrentChapterIndex(0);
                      setCurrentContentIndex(0);
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold inline-flex items-center justify-center text-sm sm:text-base"
                  >
                    <BookOpen size={18} className="mr-2 flex-shrink-0" />
                    <span>ดูเนื้อหาการเรียน</span>
                  </button>
                  
                  <Link
                    href="/learning"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-semibold inline-flex items-center justify-center text-sm sm:text-base"
                  >
                    <ArrowLeft size={18} className="mr-2 flex-shrink-0" />
                    <span>กลับไปหน้าบทเรียน</span>
                  </Link>
                  
                  <Link
                    href="/quiz"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold inline-flex items-center justify-center text-sm sm:text-base"
                  >
                    <Brain size={18} className="mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">ดูแบบทดสอบทั้งหมด</span>
                    <span className="sm:hidden">แบบทดสอบ</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Regular Learning Content
            <>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/10">
                {renderContent()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <button
                  onClick={prevContent}
                  disabled={isFirstChapter && isFirstContent}
                  className={`flex items-center justify-center px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                    isFirstChapter && isFirstContent
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <ChevronLeft size={18} className="mr-2 flex-shrink-0" />
                  <span>ย้อนกลับ</span>
                </button>

                <div className="text-center px-4 order-first sm:order-none">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">
                    ส่วนที่ {currentChapterIndex + 1} จาก {module.chapters.length}
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-white line-clamp-2">
                    {currentChapter.title}
                  </div>
                </div>

                <button
                  onClick={nextContent}
                  disabled={
                    !canProceed || (isLastChapter && isLastContent && !quiz)
                  }
                  className={`flex items-center justify-center px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
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
                      <Brain size={18} className="mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline">ทำกิจกรรมก่อนนะ! 🎮</span>
                      <span className="sm:hidden">ทำกิจกรรมก่อน</span>
                    </>
                  ) : isLastChapter && isLastContent && quiz ? (
                    <>
                      <Trophy size={18} className="mr-2 flex-shrink-0" />
                      <span className="hidden sm:inline">เสร็จแล้ว - ไปทำแบบทดสอบ</span>
                      <span className="sm:hidden">เสร็จ - ทดสอบ</span>
                    </>
                  ) : (
                    <>
                      <span>ถัดไป</span>
                      <ChevronRight size={18} className="ml-2 flex-shrink-0" />
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
