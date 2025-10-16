'use client';

import { useState, useEffect } from 'react';
import { courseService, courseLessonService, courseDetailService, courseQuizService } from '../api/services';
import { LearningModule, Chapter, ChapterContent } from '../../types/learning';

// Custom hook for learning modules with API integration
export function useLearningModuleData() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningModules = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching courses from API...');
        
        // Fetch courses from API
        const coursesResponse = await courseService.getAllCourses();
        
        console.log('Courses response:', coursesResponse);
        
        if (!coursesResponse.success || !coursesResponse.data) {
          throw new Error(coursesResponse.error || 'Failed to fetch courses');
        }

        const courses = coursesResponse.data;
        
        // Ensure courses is an array
        if (!Array.isArray(courses)) {
          console.error('Expected courses to be an array, got:', typeof courses);
          throw new Error('Invalid response format from API');
        }
        
        console.log('Processing courses:', courses);
        
        // Convert courses to learning modules format
        const learningModules: LearningModule[] = await Promise.all(
          courses.map(async (course: any) => {
            // ลองดึง course lessons เพื่อสร้าง chapters
            let chapters: Chapter[] = [];
            
            try {
              const lessonsResponse = await courseLessonService.getAllCourseLessons();
              
              if (lessonsResponse.success && lessonsResponse.data) {
                const courseLessons = lessonsResponse.data.filter((lesson: any) => 
                  lesson.courseId === course.id
                );
                
                console.log(`Found ${courseLessons.length} lessons for course ${course.id}`);
                
                // แปลง lessons เป็น chapters แบบง่าย
                chapters = courseLessons.map((lesson: any, index: number) => ({
                  id: `chapter-${lesson.id}`,
                  courseId: course.id.toString(),
                  title: lesson.title || `Chapter ${index + 1}`,
                  estimatedTime: '15 minutes',
                  content: [
                    {
                      id: `content-${lesson.id}-1`,
                      courseLessonId: lesson.id.toString(),
                      type: 'text' as const,
                      content: lesson.content || 'เนื้อหาจะมาเร็วๆ นี้',
                      required: false,
                      score: 0,
                      createdAt: lesson.createdAt || new Date().toISOString(),
                      updatedAt: lesson.updatedAt || new Date().toISOString()
                    }
                  ] as ChapterContent[],
                  createdAt: lesson.createdAt || new Date().toISOString(),
                  updatedAt: lesson.updatedAt
                }));
              }
            } catch (lessonError) {
              console.log('No lessons found for course:', course.id, lessonError);
            }

            // ถ้าไม่มี lessons จาก API ให้สร้าง default chapter เปล่า
            if (chapters.length === 0) {
              console.log(`No API lessons found for course ${course.id}, creating basic structure`);
              chapters = [
                {
                  id: 'chapter-1',
                  courseId: course.id.toString(),
                  title: 'Introduction',
                  estimatedTime: '15 minutes',
                  content: [
                    {
                      id: 'content-1',
                      courseLessonId: '1',
                      type: 'text' as const,
                      content: course.description || 'เนื้อหาการเรียนจะมาเร็วๆ นี้',
                      required: false,
                      score: 0,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    }
                  ],
                  createdAt: new Date().toISOString()
                }
              ];
            }

            return {
              id: course.id.toString(),
              title: course.title || 'Untitled Course',
              description: course.description || 'No description available',
              level: (course.level as 'Fundamental' | 'Intermediate' | 'Advanced') || 'Fundamental',
              estimatedTime: course.duration ? `${course.duration} minutes` : '30 minutes',
              coverImage: '/images/learning/solar-system/default-course.jpg',
              isActive: course.isActive ?? true,
              createAt: course.createdAt || new Date().toISOString(),
              chapters: chapters,
            } as LearningModule;
          })
        );

        console.log('Final learning modules:', learningModules);
        setModules(learningModules.filter(module => module.isActive));
        
      } catch (err) {
        console.error('Error fetching learning modules:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        
        // Fallback to basic error handling - ไม่ใช้ mock data
        try {
          console.log('Error occurred, creating basic error structure...');
          setModules([]);
          console.log('Set empty modules due to error');
        } catch (fallbackError) {
          console.error('Complete failure:', fallbackError);
          setModules([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLearningModules();
  }, []);

  return {
    modules,
    loading,
    error,
  };
}

// Hook for detailed learning module with chapters
export function useLearningModuleDetail(moduleId: string) {
  const [module, setModule] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetail = async () => {
      if (!moduleId) return;

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching module detail for ID:', moduleId);

        // ลองดึงข้อมูลจาก API
        const courseResponse = await courseService.getCourseById(moduleId);
        
        console.log('Course detail response:', courseResponse);
        
        if (!courseResponse.success || !courseResponse.data) {
          throw new Error(courseResponse.error || 'Course not found');
        }

        const course = courseResponse.data;
        
        // สร้าง basic module structure เพราะ API ไม่มีเนื้อหาครบ
        const detailedModule: LearningModule = {
          id: course.id.toString(),
          title: course.title || 'Untitled Course',
          description: course.description || 'No description available',
          level: (course.level as 'Fundamental' | 'Intermediate' | 'Advanced') || 'Fundamental',
          estimatedTime: course.duration ? `${course.duration} minutes` : '30 minutes',
          coverImage: '/images/learning/solar-system/default-course.jpg',
          isActive: course.isActive ?? true,
          createAt: course.createdAt || new Date().toISOString(),
          chapters: [
            {
              id: 'chapter-1',
              courseId: course.id.toString(),
              title: 'Introduction',
              estimatedTime: '15 minutes',
              content: [
                {
                  id: 'content-1',
                  courseLessonId: '1',
                  type: 'text' as const,
                  content: course.description || 'เนื้อหาการเรียนจะมาเร็วๆ นี้',
                  required: false,
                  score: 0,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ],
              createdAt: new Date().toISOString()
            }
          ]
        };

        console.log('Processed module detail:', detailedModule);
        setModule(detailedModule);
        
      } catch (err) {
        console.error('Error fetching module detail:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        
        // Final error handling - ไม่ใช้ mock data
        try {
          console.log('Error occurred, setting module to null');
          setModule(null);
        } catch (fallbackError) {
          console.error('Complete failure:', fallbackError);
          setModule(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetail();
  }, [moduleId]);

  return {
    module,
    loading,
    error,
  };
}

// Hook for user learning progress - simplified version
export function useUserLearningProgress(userId?: number) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setProgress(null);
          return;
        }

        // TODO: Implement when user progress API is ready
        setProgress(null);
        
      } catch (err) {
        console.error('Error fetching user progress:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  return {
    progress,
    loading,
    error,
  };
}

// Hook for updating learning progress - simplified version
export function useUpdateLearningProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = async (progressData: any) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual progress update when API is ready
      console.log('Progress update (mock):', progressData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
      
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProgress,
    loading,
    error,
  };
}

// Helper function to get learning module by ID (API + fallback)
export async function getLearningModuleById(moduleId: string): Promise<LearningModule | null> {
  try {
    console.log('Getting learning module by ID:', moduleId);
    
    // เรียกข้อมูล course หลัก (มี courseLesson อยู่แล้ว)
    const courseResponse = await courseService.getCourseById(moduleId);
    
    if (courseResponse.success && courseResponse.data) {
      const course = courseResponse.data;
      console.log('Course response data:', course);
      
      let chapters: Chapter[] = [];
      
      // ตรวจสอบว่า API ส่ง courseLesson มาหรือไม่
      if (course.courseLesson && Array.isArray(course.courseLesson) && course.courseLesson.length > 0) {
        console.log(`Found ${course.courseLesson.length} lessons in course response`);
        
        // ดึงข้อมูล courseDetail จาก courseLesson API เพื่อให้ได้ข้อมูลครบ
        const courseLessonResponse = await courseLessonService.getAllCourseLessons();
        
        console.log('=== API RESPONSE DEBUG ===');
        console.log('courseLessonResponse:', courseLessonResponse);
        console.log('courseLessonResponse is array:', Array.isArray(courseLessonResponse));
        console.log('courseLessonResponse length:', courseLessonResponse?.data?.length);
        console.log('=== END API RESPONSE DEBUG ===');
        
        // courseLessonResponse เป็น array โดยตรง ไม่ได้ wrap ใน { success, data }
        if (courseLessonResponse && Array.isArray(courseLessonResponse)) {
          console.log('=== COURSE LESSON FILTERING DEBUG ===');
          console.log('All courseLesson data length:', courseLessonResponse.length);
          console.log('Target course.id:', course.id);
          console.log('Target course.id type:', typeof course.id);
          
          // Debug: ดู courseId ของแต่ละ lesson
          courseLessonResponse.forEach((lesson: any, index: number) => {
            console.log(`Lesson ${index + 1}: id=${lesson.id}, courseId="${lesson.courseId}" (type: ${typeof lesson.courseId})`);
            console.log(`  Match check: "${lesson.courseId}" === "${course.id}" = ${lesson.courseId === course.id}`);
          });
          
          // Filter และ map courseLesson ที่มี courseDetail
          const lessonsWithDetail = courseLessonResponse.filter(
            (lesson: any) => {
              const matches = lesson.courseId === course.id;
              console.log(`FILTER: Lesson ${lesson.id} - courseId "${lesson.courseId}" matches "${course.id}": ${matches}`);
              return matches;
            }
          );
          
          console.log(`FILTER RESULT: Found ${lessonsWithDetail.length} matching lessons`);
          console.log('=== END FILTERING DEBUG ===');
          
          console.log(`Found ${lessonsWithDetail.length} lessons with detail for course ${course.id}`);
          
          // ดึงข้อมูล CourseQuiz ทั้งหมดเพื่อใช้สร้าง interactive activities (ดึงครั้งเดียวสำหรับทุก lesson)
          let allCourseQuizzes: any[] = [];
          try {
            const courseQuizzesResponse = await courseQuizService.getAllCourseQuizzes();
            console.log('CourseQuiz API response structure:', typeof courseQuizzesResponse, courseQuizzesResponse);
            
            // ตรวจสอบว่า response เป็น array โดยตรง หรือเป็น object ที่มี data property
            if (Array.isArray(courseQuizzesResponse)) {
              allCourseQuizzes = courseQuizzesResponse;
              console.log(`Found ${allCourseQuizzes.length} course quizzes from API (direct array)`);
            } else if (courseQuizzesResponse.success && courseQuizzesResponse.data) {
              allCourseQuizzes = courseQuizzesResponse.data;
              console.log(`Found ${allCourseQuizzes.length} course quizzes from API (wrapped response)`);
            } else {
              console.log('CourseQuiz API response was not successful or unexpected format:', courseQuizzesResponse);
            }
          } catch (quizError) {
            console.log('Error fetching course quizzes:', quizError);
          }
          
          if (lessonsWithDetail.length > 0) {
            // แปลง lessonsWithDetail เป็น chapters
            chapters = await Promise.all(lessonsWithDetail.map(async (lesson: any, index: number) => {
              console.log(`\n=== Processing lesson ${index + 1} ===`);
              console.log(`Lesson ID: ${lesson.id}`);
              console.log(`Lesson Title: ${lesson.title}`);
              console.log(`Raw courseDetail:`, lesson.courseDetail);
              
              let chapterContent: ChapterContent[] = [];
              
              // ตรวจสอบว่ามี courseDetail หรือไม่
              if (lesson.courseDetail && Array.isArray(lesson.courseDetail)) {
                console.log(`Found ${lesson.courseDetail.length} details for lesson ${lesson.id}`);
                console.log(`Using ${allCourseQuizzes.length} course quizzes for matching`);
                
                chapterContent = lesson.courseDetail.flatMap((detail: any, detailIndex: number) => {
                  console.log(`\n  Processing detail ${detailIndex + 1}/${lesson.courseDetail.length}:`);
                  console.log(`    Detail ID: ${detail.id}`);
                  console.log(`    Detail Type: ${detail.type}`);
                  console.log(`    Raw Content:`, detail.content);
                  
                  // แปลง content ที่เป็น JSON object
                  let contentText = '';
                  let contentType: 'text' | 'image' | 'video' | 'interactive' | 'quiz' = 'text';
                  let activity: any = null;
                  let imageUrl: string | undefined = undefined;
                  const contentItems: any[] = [];
                  
                  // ตรวจสอบ type ของ content
                  if (detail.type) {
                    contentType = detail.type as 'text' | 'image' | 'video' | 'interactive' | 'quiz';
                  }
                  
                  // แปลง content ตาม type
                  if (detail.content && typeof detail.content === 'object') {
                    // ถ้า content เป็น object
                    if (detail.content.text) {
                      contentText = detail.content.text;
                      console.log(`    Extracted Text (object): "${contentText.substring(0, 50)}..."`);
                    } else if (detail.content.data) {
                      // อาจเป็นข้อมูล interactive activity
                      contentText = detail.content.instruction || detail.content.title || 'กิจกรรมอินเตอร์แอคทีฟ';
                      
                      // สร้าง activity object
                      if (contentType === 'quiz' || contentType === 'interactive') {
                        activity = {
                          id: detail.id || `activity-${lesson.id}-${detailIndex}`,
                          courseDetailId: detail.id,
                          title: detail.content.title || 'กิจกรรมการเรียนรู้',
                          type: detail.content.type || 'multiple-choice',
                          instruction: detail.content.instruction || 'ทำกิจกรรมต่อไปนี้',
                          maxAttempts: detail.content.maxAttempts || 3,
                          passingScore: detail.content.passingScore || 70,
                          timeLimite: detail.content.timeLimit || 300,
                          difficulty: detail.content.difficulty || 'Medium',
                          data: detail.content.data || detail.content,
                          point: detail.content.points || detail.score || 10,
                          feedback: detail.content.feedback || {
                            correct: 'ยินดีด้วย! คำตอบถูกต้อง',
                            incorrect: 'ลองใหม่อีกครั้งนะ',
                            hint: detail.content.hint
                          },
                          createdAt: detail.createdAt || new Date().toISOString(),
                          updatedAt: detail.updatedAt || new Date().toISOString()
                        };
                      }
                    } else if (detail.content.imageUrl || detail.content.url) {
                      // เป็นรูปภาพ
                      contentType = 'image';
                      contentText = detail.content.caption || detail.content.description || 'รูปภาพประกอบการเรียน';
                      imageUrl = detail.content.imageUrl || detail.content.url;
                    } else {
                      // fallback
                      contentText = JSON.stringify(detail.content);
                    }
                  } else if (typeof detail.content === 'string') {
                    contentText = detail.content;
                    console.log(`    Extracted Text (string): "${contentText.substring(0, 50)}..."`);
                  } else {
                    contentText = 'เนื้อหาจะมาเร็วๆ นี้';
                    console.log(`    Default content used`);
                  }
                  
                  // ตรวจสอบ imageUrl จาก field อื่น
                  if (!imageUrl && (detail.ImageUrl || detail.imageUrl)) {
                    imageUrl = detail.ImageUrl || detail.imageUrl;
                    if (contentType === 'text') {
                      contentType = 'image';
                    }
                  }
                  
                  // ค้นหา CourseQuiz ที่เชื่อมโยงกับ detail นี้
                  console.log(`    Looking for quiz with courseDetailId: ${detail.id}`);
                  console.log(`    Available CourseQuiz courseDetailIds:`, allCourseQuizzes.map((q: any) => q.courseDetailId));
                  const relatedQuiz = allCourseQuizzes.find((quiz: any) => quiz.courseDetailId === detail.id);
                  console.log(`    Found relatedQuiz:`, !!relatedQuiz);
                  if (relatedQuiz) {
                    console.log(`    Found related quiz for detail ${detail.id}:`, relatedQuiz.title);
                    
                    // สร้าง activity จากข้อมูล CourseQuiz แต่ไม่เปลี่ยน contentType
                    activity = {
                      id: relatedQuiz.id,
                      courseDetailId: relatedQuiz.courseDetailId,
                      title: relatedQuiz.title,
                      type: relatedQuiz.type,
                      instruction: relatedQuiz.instruction,
                      maxAttempts: relatedQuiz.maxAttempts || 3,
                      passingScore: relatedQuiz.passingScore || 10,
                      timeLimite: relatedQuiz.timeLimite || 0,
                      difficulty: relatedQuiz.difficulty || 'Easy',
                      data: relatedQuiz.data,
                      point: relatedQuiz.point || 10,
                      feedback: relatedQuiz.feedback || {
                        correct: 'ยินดีด้วย! คำตอบถูกต้อง',
                        incorrect: 'ลองใหม่อีกครั้งนะ'
                      },
                      createdAt: relatedQuiz.createdAt || new Date().toISOString(),
                      updatedAt: relatedQuiz.updatedAt || new Date().toISOString()
                    };
                    
                    console.log(`    Created activity from CourseQuiz:`, {
                      id: activity.id,
                      type: activity.type,
                      title: activity.title
                    });
                  }
                  
                  // สร้าง content item หลัก (เนื้อหา)
                  const mainContent = {
                    id: detail.id || `content-${lesson.id}-${detailIndex}`,
                    courseLessonId: lesson.id,
                    type: contentType,
                    content: contentText,
                    imageUrl: imageUrl,
                    required: detail.required || false,
                    score: detail.score || 0,
                    activity: undefined, // ไม่แนบ activity ที่เนื้อหา
                    minimumScore: detail.minimumScore || 0,
                    createdAt: detail.createdAt || new Date().toISOString(),
                    updatedAt: detail.updatedAt || new Date().toISOString()
                  } as ChapterContent;
                  
                  contentItems.push(mainContent);
                  
                  console.log(`    Created content item:`, { 
                    id: mainContent.id, 
                    type: mainContent.type, 
                    contentLength: mainContent.content.length,
                    hasActivity: false,
                    hasImage: !!mainContent.imageUrl
                  });
                  
                  // ถ้ามี activity ให้สร้าง content item แยกสำหรับ activity
                  if (activity) {
                    const activityContent = {
                      id: `${activity.id}-interactive`,
                      courseLessonId: lesson.id,
                      type: 'interactive' as const, // ใช้ type เดียวสำหรับ activity ทั้งหมด
                      content: activity.instruction || 'ทำกิจกรรมต่อไปนี้',
                      imageUrl: undefined,
                      required: detail.required || false,
                      score: activity.point || 10,
                      activity: activity,
                      minimumScore: activity.passingScore || 10,
                      createdAt: activity.createdAt || new Date().toISOString(),
                      updatedAt: activity.updatedAt || new Date().toISOString()
                    } as ChapterContent;
                    
                    contentItems.push(activityContent);
                    
                    console.log(`    Created activity item:`, { 
                      id: activityContent.id, 
                      type: activityContent.type, 
                      contentLength: activityContent.content.length,
                      hasActivity: true,
                      activityType: activity.type
                    });
                  }
                  
                  return contentItems;
                });
                
                console.log(`  Total content items created for lesson ${lesson.id}: ${chapterContent.length}`);
              } else {
                // ถ้าไม่มี courseDetail ให้สร้าง default content
                console.log(`  No courseDetail found for lesson ${lesson.id}, creating default content`);
                chapterContent = [
                  {
                    id: `content-${lesson.id}-1`,
                    courseLessonId: lesson.id,
                    type: 'text' as const,
                    content: 'เนื้อหาจะมาเร็วๆ นี้',
                    required: false,
                    score: 0,
                    createdAt: lesson.createdAt || new Date().toISOString(),
                    updatedAt: lesson.updatedAt || new Date().toISOString()
                  }
                ];
              }
              
              const finalChapter = {
                id: lesson.id,
                courseId: course.id,
                title: lesson.title || `Chapter ${index + 1}`,
                estimatedTime: lesson.estimatedTime ? `${lesson.estimatedTime} minutes` : '15 minutes',
                content: chapterContent,
                createdAt: lesson.createdAt || new Date().toISOString(),
                updatedAt: lesson.updatedAt
              } as Chapter;
              
              console.log(`\n=== Chapter ${index + 1} Summary ===`);
              console.log(`Chapter ID: ${finalChapter.id}`);
              console.log(`Chapter Title: ${finalChapter.title}`);
              console.log(`Content Count: ${finalChapter.content.length}`);
              console.log(`Content IDs: [${finalChapter.content.map(c => c.id).join(', ')}]`);
              console.log(`Content Types: [${finalChapter.content.map(c => c.type).join(', ')}]`);
              console.log(`================================\n`);
              
              return finalChapter;
            }));
            
            console.log('\n=== FINAL PROCESSING SUMMARY ===');
            console.log(`Total chapters processed: ${chapters.length}`);
            chapters.forEach((chapter, idx) => {
              console.log(`Chapter ${idx + 1}: ${chapter.title} (${chapter.content.length} content items)`);
            });
            console.log('=================================\n');
          }
        }
      }
      
      // ถ้าไม่มี chapters จาก API ให้สร้าง default chapter
      if (chapters.length === 0) {
        console.log('No courseLesson found in API, creating default chapter');
        
        // สร้าง default chapter ถ้าไม่มี API data
        chapters = [
          {
            id: 'chapter-1',
            courseId: course.id,
            title: 'Introduction',
            estimatedTime: '15 minutes',
            content: [
              {
                id: 'content-1',
                courseLessonId: 'default',
                type: 'text' as const,
                content: course.description || 'เนื้อหาการเรียนจะมาเร็วๆ นี้',
                required: false,
                score: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ],
            createdAt: new Date().toISOString()
          }
        ];
      }
      
      // สร้าง LearningModule จากข้อมูล API
      const apiModule: LearningModule = {
        id: course.id.toString(),
        title: course.title || 'Untitled Course',
        description: course.description || 'No description available',
        level: (course.level as 'Fundamental' | 'Intermediate' | 'Advanced') || 'Fundamental',
        estimatedTime: course.estimatedTime ? `${course.estimatedTime} minutes` : '30 minutes',
        coverImage: course.coverImage || '/images/learning/solar-system/default-course.jpg',
        isActive: course.isActive ?? true,
        createAt: course.createAt || new Date().toISOString(),
        chapters: chapters,
      };
      
      console.log('✅ API Integration Success: Solar System module created with', apiModule.chapters.length, 'chapters');
      return apiModule;
    }
    
    // ถ้าไม่ได้ข้อมูลจาก API ให้ส่งกลับ null
    console.log('No course data from API available');
    return null;
    
  } catch (error) {
    console.error('Error fetching learning module from API:', error);
  }

  // No fallback - return null if no API data
  console.log('API error occurred, no fallback available for module:', moduleId);
  return null;
}