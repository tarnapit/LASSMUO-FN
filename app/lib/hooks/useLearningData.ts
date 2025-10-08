'use client';

import { useState, useEffect } from 'react';
import { courseService, courseLessonService, courseDetailService, courseQuizService } from '../api/services';
import { LearningModule, Chapter, ChapterContent } from '../../types/learning';
import { learningModules as mockLearningModules, getLearningModuleById as getMockLearningModuleById } from '../../data/learning-modules';

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

            // ถ้าไม่มี lessons จาก API ให้ใช้ mock data
            if (chapters.length === 0) {
              console.log(`No API lessons found for course ${course.id}, using mock data`);
              const mockModule = getMockLearningModuleById(course.id.toString());
              if (mockModule) {
                return mockModule; // ใช้ mock data เต็มที่
              } else {
                // สร้าง default chapter
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
            }

            return {
              id: course.id.toString(),
              title: course.title || 'Untitled Course',
              description: course.description || 'No description available',
              level: (course.level as 'Fundamental' | 'Intermediate' | 'Advanced') || 'Fundamental',
              estimatedTime: course.duration ? `${course.duration} minutes` : '30 minutes',
              coverImage: '/images/space/default-course.jpg',
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
        
        // Fallback to mock data on error
        try {
          console.log('Loading fallback mock data...');
          setModules(mockLearningModules);
          setError(null); // Clear error since we have fallback data
          console.log('Successfully loaded fallback data');
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
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

        // ลองใช้ mock data ก่อน เพราะมีข้อมูลครบถ้วน
        const mockModule = getMockLearningModuleById(moduleId);
        if (mockModule) {
          console.log('Using mock data for module:', moduleId);
          setModule(mockModule);
          return;
        }

        // หากไม่มี mock data จึงลอง API
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
          coverImage: '/images/space/default-course.jpg',
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
        
        // Final fallback to mock data
        try {
          console.log('Loading fallback mock data for module:', moduleId);
          const mockModule = getMockLearningModuleById(moduleId);
          if (mockModule) {
            setModule(mockModule);
            setError(null);
            console.log('Successfully loaded fallback module');
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback module:', fallbackError);
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
          
          if (lessonsWithDetail.length > 0) {
            // แปลง lessonsWithDetail เป็น chapters
            chapters = lessonsWithDetail.map((lesson: any, index: number) => {
              console.log(`\n=== Processing lesson ${index + 1} ===`);
              console.log(`Lesson ID: ${lesson.id}`);
              console.log(`Lesson Title: ${lesson.title}`);
              console.log(`Raw courseDetail:`, lesson.courseDetail);
              
              let chapterContent: ChapterContent[] = [];
              
              // ตรวจสอบว่ามี courseDetail หรือไม่
              if (lesson.courseDetail && Array.isArray(lesson.courseDetail)) {
                console.log(`Found ${lesson.courseDetail.length} details for lesson ${lesson.id}`);
                
                chapterContent = lesson.courseDetail.map((detail: any, detailIndex: number) => {
                  console.log(`\n  Processing detail ${detailIndex + 1}/${lesson.courseDetail.length}:`);
                  console.log(`    Detail ID: ${detail.id}`);
                  console.log(`    Detail Type: ${detail.type}`);
                  console.log(`    Raw Content:`, detail.content);
                  
                  // แปลง content ที่เป็น JSON object
                  let contentText = '';
                  if (detail.content && typeof detail.content === 'object' && detail.content.text) {
                    contentText = detail.content.text;
                    console.log(`    Extracted Text (object): "${contentText.substring(0, 50)}..."`);
                  } else if (typeof detail.content === 'string') {
                    contentText = detail.content;
                    console.log(`    Extracted Text (string): "${contentText.substring(0, 50)}..."`);
                  } else {
                    contentText = 'เนื้อหาจะมาเร็วๆ นี้';
                    console.log(`    Default content used`);
                  }
                  
                  const processedContent = {
                    id: detail.id || `content-${lesson.id}-${detailIndex}`,
                    courseLessonId: lesson.id,
                    type: (detail.type as 'text' | 'image' | 'video' | 'interactive' | 'quiz') || 'text',
                    content: contentText,
                    imageUrl: detail.ImageUrl || detail.imageUrl,
                    required: detail.required || false,
                    score: detail.score || 0,
                    createdAt: detail.createdAt || new Date().toISOString(),
                    updatedAt: detail.updatedAt || new Date().toISOString()
                  } as ChapterContent;
                  
                  console.log(`    Created content item:`, { id: processedContent.id, type: processedContent.type, contentLength: processedContent.content.length });
                  return processedContent;
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
            });
            
            console.log('\n=== FINAL PROCESSING SUMMARY ===');
            console.log(`Total chapters processed: ${chapters.length}`);
            chapters.forEach((chapter, idx) => {
              console.log(`Chapter ${idx + 1}: ${chapter.title} (${chapter.content.length} content items)`);
            });
            console.log('=================================\n');
          }
        }
      }
      
      // ถ้าไม่มี chapters จาก API ให้ fallback ไป mock data
      if (chapters.length === 0) {
        console.log('No courseLesson found in API, trying mock data');
        const mockModule = getMockLearningModuleById(moduleId);
        if (mockModule) {
          console.log('Using mock data for module:', moduleId);
          return mockModule;
        }
        
        // สร้าง default chapter ถ้าไม่มีทั้ง API และ mock
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
        coverImage: course.coverImage || '/images/space/default-course.jpg',
        isActive: course.isActive ?? true,
        createAt: course.createAt || new Date().toISOString(),
        chapters: chapters,
      };
      
      console.log('Final API-based module:', apiModule);
      return apiModule;
    }
    
    // ถ้าไม่ได้ข้อมูลจาก API ให้ fallback ไป mock data
    console.log('No course data from API, trying mock data');
    const mockModule = getMockLearningModuleById(moduleId);
    if (mockModule) {
      console.log('Using mock data for module:', moduleId);
      return mockModule;
    }
    
  } catch (error) {
    console.error('Error fetching learning module from API:', error);
  }

  // Fallback to mock data
  console.log('Using mock data fallback for module:', moduleId);
  const mockModule = getMockLearningModuleById(moduleId);
  return mockModule || null;
}