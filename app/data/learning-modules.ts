import { LearningModule } from '../types/learning';

export const learningModules: LearningModule[] = [
  {
    id: 'solar-system',
    title: 'Solar System',
    description: 'Planets in our universe we call Solar System and it is base knowledge of astronomy',
    level: 'Fundamental',
    estimatedTime: '45 minutes',
    isActive: true,
    createAt: '2024-01-01T00:00:00Z',
    chapters: [
      {
        id: 'chapter-1',
        courseId: 'solar-system',
        title: 'Introduction to Solar System',
        estimatedTime: '15 minutes',
        createdAt: '2024-01-01T00:00:00Z',
        content: [
          {
            id: 'content-1',
            courseLessonId: 'chapter-1',
            type: 'text',
            content: 'ระบบสุริยะ หรือ ระบบดาวอาทิตย์ คือระบบที่ประกอบด้วยดาวอาทิตย์และวัตถุท้องฟ้าต่างๆ ที่โคจรรอบดาวอาทิตย์ ซึ่งรวมถึงดาวเคราะห์ 8 ดวง ดาวเคราะห์แคระ ดาวเคราะห์น้อย และอุกกาบาต',
            required: false,
            score: 0,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'content-2',
            courseLessonId: 'chapter-1',
            type: 'image',
            content: 'Solar System Overview',
            imageUrl: '/images/learning/solar-system/solar-system-overview.jpg',
            required: false,
            score: 0,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'content-3',
            courseLessonId: 'chapter-1',
            type: 'interactive',
            content: 'มาทดสอบความเข้าใจเกี่ยวกับระบบสุริยะกันเถอะ!',
            required: true,
            score: 10,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            minimumScore: 10,
            activity: {
              id: 'saturn-identification',
              courseDetailId: 'content-3',
              title: 'จำแนกดาวเคราะห์จากภาพ',
              type: 'image-identification',
              instruction: 'ดูรูปภาพแล้วเลือกคำตอบที่ถูกต้อง',
              difficulty: 'Easy',
              maxAttempts: 3,
              passingScore: 10,
              timeLimite: 90,
              data: {
                question: 'ดาวเคราะห์ในภาพนี้คือดาวอะไร?',
                image: '/images/stage/saturn.jpg',
                options: ['ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
                correctAnswer: 1
              },
              point: 15,
              feedback: {
                correct: 'ถูกต้อง! นี่คือดาวเสาร์ที่มีวงแหวนสวยงามเป็นเอกลักษณ์',
                incorrect: 'ไม่ถูกต้อง ลองสังเกตวงแหวนในภาพ ดาวเคราะห์ที่มีวงแหวนสวยงามเด่นชัดคือดาวใด?',
                hint: 'ดาวเคราะห์ที่มีวงแหวนสวยงามและเห็นได้ชัดเจนที่สุดในระบบสุริยะ'
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          }
        ]
      },
      {
        id: 'chapter-2',
        courseId: 'solar-system',
        title: 'The Eight Planets',
        estimatedTime: '20 minutes',
        createdAt: '2024-01-01T00:00:00Z',
        content: [
          {
            id: 'content-4',
            courseLessonId: 'chapter-2',
            type: 'text',
            content: 'ในระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง แบ่งออกเป็น 2 กลุ่มหลัก คือ ดาวเคราะห์ในระบบภายใน (Inner Planets) และดาวเคราะห์ในระบบภายนอก (Outer Planets)',
            required: false,
            score: 0,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'content-5',
            courseLessonId: 'chapter-2',
            type: 'interactive',
            content: 'มาจับคู่ดาวเคราะห์กับคุณสมบัติเด่นของมันกันเถอะ!',
            required: true,
            score: 16,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            minimumScore: 16,
            activity: {
              id: 'planets-matching1',
              courseDetailId: 'content-5',
              title: 'จับคู่ดาวเคราะห์กับคุณสมบัติ',
              type: 'matching',
              instruction: 'คลิกเพื่อจับคู่ดาวเคราะห์กับคุณสมบัติที่ถูกต้อง',
              difficulty: 'Medium',
              maxAttempts: 2,
              passingScore: 16,
              timeLimite: 120,
              data: {
                pairs: [
                  {
                    left: 'ดาวพุธ',
                    right: 'ใกล้ดวงอาทิตย์ที่สุด',
                    explanation: 'ดาวพุธอยู่ใกล้ดวงอาทิตย์ที่สุด ห่างเพียง 58 ล้านกิโลเมตร'
                  },
                  {
                    left: 'ดาวศุกร์',
                    right: 'ร้อนที่สุดในระบบสุริยะ',
                    explanation: 'ดาวศุกร์ร้อนที่สุดเนื่องจากมีชั้นบรรยากาศหนาทึบ'
                  },
                  {
                    left: 'โลก',
                    right: 'มีสิ่งมีชีวิตอาศัยอยู่',
                    explanation: 'โลกเป็นดาวเคราะห์เดียวที่ทราบว่ามีสิ่งมีชีวิต'
                  },
                  {
                    left: 'ดาวอังคาร',
                    right: 'มีสีแดงจากสนิมเหล็ก',
                    explanation: 'ดาวอังคารมีสีแดงเพราะพื้นผิวมีสนิมเหล็ก (Iron Oxide)'
                  }
                ]
              },
              point: 20,
              feedback: {
                correct: 'เยี่ยมมาก! คุณจับคู่ดาวเคราะห์กับคุณสมบัติได้ถูกต้องทั้งหมด',
                incorrect: 'ลองดูใหม่อีกครั้ง คิดถึงคุณสมบัติเด่นของแต่ละดาวเคราะห์',
                hint: 'ดาวพุธใกล้ดวงอาทิตย์ ดาวศุกร์ร้อน โลกมีชีวิต ดาวอังคารสีแดง'
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          },
          {
            id: 'content-5b',
            courseLessonId: 'chapter-2',
            type: 'interactive',
            content: 'ทดสอบความสามารถในการจำแนกดาวเคราะห์จากรูปลักษณ์',
            required: true,
            score: 12,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            minimumScore: 12,
            activity: {
              id: 'mars-identification',
              courseDetailId: 'content-5b',
              title: 'จำแนกดาวอังคารจากภาพ',
              type: 'image-identification',
              instruction: 'ดูรูปภาพและเลือกคำตอบที่ถูกต้อง',
              difficulty: 'Easy',
              maxAttempts: 3,
              passingScore: 12,
              timeLimite: 75,
              data: {
                question: 'ดาวเคราะห์ในภาพนี้มีลักษณะพิเศษอะไร?',
                image: '/images/planets/mars.png',
                options: ['มีวงแหวนสวยงาม', 'มีสีแดงเป็นเอกลักษณ์', 'เป็นดาวเคราะห์ที่ใหญ่ที่สุด', 'มีชีวิตอาศัยอยู่'],
                correctAnswer: 1
              },
              point: 15,
              feedback: {
                correct: 'ถูกต้อง! ดาวอังคารมีสีแดงเป็นเอกลักษณ์จากสนิมเหล็กบนพื้นผิว',
                incorrect: 'ไม่ถูกต้อง ลองสังเกตสีของดาวเคราะห์ในภาพ ทำไมถึงเรียกดาวอังคารว่า "ดาวเคราะห์สีแดง"',
                hint: 'ดาวอังคารได้ชื่อว่าเป็น "Red Planet" หรือดาวเคราะห์สีแดง'
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'earth-structure',
    title: 'Earth Structure',
    description: 'In our planet that call "Earth" have structure that we going to find out',
    level: 'Fundamental',
    estimatedTime: '50 minutes',
    isActive: true,
    createAt: '2024-01-01T00:00:00Z',
    chapters: [
      {
        id: 'chapter-3',
        courseId: 'earth-structure',
        title: 'Earth Layers',
        estimatedTime: '15 minutes',
        createdAt: '2024-01-01T00:00:00Z',
        content: [
          {
            id: 'content-6',
            courseLessonId: 'chapter-3',
            type: 'text',
            content: 'โลกของเรามีโครงสร้างภายในที่แบ่งออกเป็น 4 ชั้นหลัก คือ เปลือกโลก เนื้อโลก แกนกลางชั้นนอก และแกนกลางชั้นใน',
            required: false,
            score: 0,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'content-7',
            courseLessonId: 'chapter-3',
            type: 'image',
            content: 'Earth Layers Structure',
            imageUrl: '/images/planets/earth-layers.jpg',
            required: false,
            score: 0,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'content-8',
            courseLessonId: 'chapter-3',
            type: 'interactive',
            content: 'ทดสอบความเข้าใจเกี่ยวกับลำดับชั้นของโลก',
            required: true,
            score: 12,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            minimumScore: 12,
            activity: {
              id: 'earth-layers-order1',
              courseDetailId: 'content-8',
              title: 'เรียงลำดับชั้นของโลก',
              type: 'sentence-ordering',
              instruction: 'เรียงลำดับชั้นของโลกจากชั้นนอกสุดไปชั้นในสุด',
              difficulty: 'Medium',
              maxAttempts: 3,
              passingScore: 12,
              timeLimite: 90,
              data: {
                instruction: 'เรียงลำดับชั้นของโลกจากภายนอกไปภายใน',
                sentences: ['เปลือกโลก', 'เนื้อโลก', 'แกนกลางชั้นนอก', 'แกนกลางชั้นใน'],
                correctOrder: [0, 1, 2, 3]
              },
              point: 15,
              feedback: {
                correct: 'ถูกต้อง! ลำดับชั้นโลกคือ เปลือกโลก เนื้อโลก แกนกลางชั้นนอก แกนกลางชั้นใน',
                incorrect: 'ไม่ถูกต้อง ลองคิดถึงการเรียงลำดับจากชั้นนอกไปชั้นในอีกครั้ง',
                hint: 'เริ่มจากชั้นที่เราอยู่ (เปลือกโลก) แล้วลึกลงไปเรื่อยๆ จนถึงใจกลางโลก'
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          },
          {
            id: 'content-9',
            courseLessonId: 'chapter-3',
            type: 'interactive',
            content: 'ทดสอบความเข้าใจโครงสร้างโลกจากภาพ',
            required: true,
            score: 10,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            minimumScore: 10,
            activity: {
              id: 'earth-layers-identification',
              courseDetailId: 'content-9',
              title: 'จำแนกชั้นของโลกจากภาพ',
              type: 'image-identification',
              instruction: 'ดูภาพตัดขวางของโลกและตอบคำถาม',
              difficulty: 'Medium',
              maxAttempts: 3,
              passingScore: 10,
              timeLimite: 60,
              data: {
                question: 'ชั้นนอกสุดของโลกที่เห็นในภาพคือชั้นอะไร?',
                image: '/images/planets/earth-layers.jpg',
                options: ['แกนกลางชั้นใน', 'เนื้อโลก', 'เปลือกโลก', 'แกนกลางชั้นนอก'],
                correctAnswer: 2
              },
              point: 12,
              feedback: {
                correct: 'ถูกต้อง! เปลือกโลกคือชั้นนอกสุดที่เราอาศัยอยู่',
                incorrect: 'ไม่ถูกต้อง ชั้นนอกสุดของโลกที่เราอาศัยอยู่คือชั้นไหน?',
                hint: 'คิดถึงชั้นที่เรายืนอยู่ตอนนี้ มันคือชั้นใดของโลก?'
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            }
          }
        ]
      }
    ]
  }
];

export function getLearningModuleById(id: string): LearningModule | undefined {
  return learningModules.find(module => module.id === id);
}

export function getAllLearningModules(): LearningModule[] {
  return learningModules;
}