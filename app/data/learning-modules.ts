import { LearningModule } from '../types/learning';

export const learningModules: LearningModule[] = [
  {
    id: 'solar-system',
    title: 'Solar System',
    description: 'Planets in our universe we call Solar System and it is base knowledge of astronomy',
    level: 'Fundamental',
    estimatedTime: '45 minutes',
    chapters: [
      {
        id: 'chapter-1',
        title: 'Introduction to Solar System',
        estimatedTime: '15 minutes',
        content: [
          {
            type: 'text',
            content: 'ระบบสุริยะ หรือ ระบบดาวอาทิตย์ คือระบบที่ประกอบด้วยดาวอาทิตย์และวัตถุท้องฟ้าต่างๆ ที่โคจรรอบดาวอาทิตย์ ซึ่งรวมถึงดาวเคราะห์ 8 ดวง ดาวเคราะห์แคระ ดาวเคราะห์น้อย และอุกกาบาต'
          },
          {
            type: 'image',
            content: 'Solar System Overview',
            imageUrl: '/images/solar-system-overview.jpg'
          },
          {
            type: 'multiple-choice',
            content: 'มาทดสอบความเข้าใจเกี่ยวกับระบบสุริยะกันเถอะ!',
            required: true,
            minimumScore: 10,
            activity: {
              id: 'solar-intro-mc1',
              title: 'ทดสอบความรู้เบื้องต้น',
              type: 'multiple-choice',
              instruction: 'เลือกคำตอบที่ถูกต้องที่สุด',
              difficulty: 'easy',
              maxAttempts: 3,
              passingScore: 10,
              data: {
                question: 'ระบบสุริยะประกอบด้วยดาวเคราะห์ทั้งหมดกี่ดวง?',
                options: ['7 ดวง', '8 ดวง', '9 ดวง', '10 ดวง'],
                correctAnswer: 1,
                explanation: 'ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง หลังจากที่ดาวพลูโตถูกจัดประเภทเป็นดาวเคราะห์แคระในปี 2006'
              },
              points: 10,
              feedback: {
                correct: 'เยี่ยม! คุณจำได้ถูกต้องว่าระบบสุริยะมีดาวเคราะห์ 8 ดวง',
                incorrect: 'ไม่ถูกต้อง ระบบสุริยะมีดาวเคราะห์ 8 ดวง หลังจากที่ดาวพลูโตถูกจัดเป็นดาวเคราะห์แคระ',
                hint: 'คิดถึงดาวเคราะห์ตั้งแต่ดาวพุธไปจนถึงดาวเนปจูน ลองนับดูสิ'
              }
            }
          },
          {
            type: 'text',
            content: 'ดาวอาทิตย์เป็นดาวฤกษ์ที่อยู่ใจกลางของระบบสุริยะ มีมวลมากที่สุดในระบบ คิดเป็นประมาณ 99.86% ของมวลทั้งหมดในระบบสุริยะ'
          },
          {
            type: 'fill-blanks',
            content: 'ทดสอบความจำเกี่ยวกับดาวอาทิตย์',
            required: true,
            minimumScore: 15,
            activity: {
              id: 'solar-intro-fill1',
              title: 'เติมคำในช่องว่าง',
              type: 'fill-blanks',
              instruction: 'เลือกคำที่เหมาะสมมาเติมในช่องว่าง',
              difficulty: 'medium',
              maxAttempts: 3,
              passingScore: 15,
              timeLimit: 60,
              data: {
                sentence: 'ดาวอาทิตย์เป็น {blank} ที่อยู่ใจกลางของระบบสุริยะ และมีมวลคิดเป็นประมาณ {blank} ของมวลทั้งหมดในระบบ',
                options: ['ดาวฤกษ์', 'ดาวเคราะห์', '99.86%', '50%', 'ดาวเทียม', '75%'],
                correctAnswers: ['ดาวฤกษ์', '99.86%']
              },
              points: 15,
              feedback: {
                correct: 'ถูกต้อง! ดาวอาทิตย์เป็นดาวฤกษ์และมีมวลมากถึง 99.86% ของระบบ',
                incorrect: 'ลองใหม่อีกครั้ง คิดถึงประเภทของดาวอาทิตย์และสัดส่วนมวลของมัน',
                hint: 'ดาวอาทิตย์เป็นดาวที่ส่องแสงได้เอง และมีมวลมากกว่า 99% ของระบบสุริยะ'
              }
            }
          }
        ]
      },
      {
        id: 'chapter-2',
        title: 'The Eight Planets',
        estimatedTime: '20 minutes',
        content: [
          {
            type: 'text',
            content: 'ในระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง แบ่งออกเป็น 2 กลุ่มหลัก คือ ดาวเคราะห์ในระบบภายใน (Inner Planets) และดาวเคราะห์ในระบบภายนอก (Outer Planets)'
          },
          {
            type: 'matching',
            content: 'มาจับคู่ดาวเคราะห์กับคุณสมบัติเด่นของมันกันเถอะ!',
            required: true,
            minimumScore: 16,
            activity: {
              id: 'planets-matching1',
              title: 'จับคู่ดาวเคราะห์กับคุณสมบัติ',
              type: 'matching',
              instruction: 'คลิกเพื่อจับคู่ดาวเคราะห์กับคุณสมบัติที่ถูกต้อง',
              difficulty: 'medium',
              maxAttempts: 2,
              passingScore: 16,
              timeLimit: 120,
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
              points: 20,
              feedback: {
                correct: 'เยี่ยมมาก! คุณจับคู่ดาวเคราะห์กับคุณสมบัติได้ถูกต้องทั้งหมด',
                incorrect: 'ลองดูใหม่อีกครั้ง คิดถึงคุณสมบัติเด่นของแต่ละดาวเคราะห์',
                hint: 'ดาวพุธใกล้ดวงอาทิตย์ ดาวศุกร์ร้อน โลกมีชีวิต ดาวอังคารสีแดง'
              }
            }
          },
          {
            type: 'text',
            content: 'ดาวเคราะห์ในระบบภายใน ได้แก่ ดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ซึ่งเป็นดาวเคราะห์หิน'
          },
          {
            type: 'image',
            content: 'Inner Planets',
            imageUrl: '/images/inner-planets.jpg'
          },
          {
            type: 'sentence-ordering',
            content: 'ทดสอบความเข้าใจเกี่ยวกับลำดับดาวเคราะห์',
            required: true,
            minimumScore: 12,
            activity: {
              id: 'planets-order1',
              title: 'เรียงลำดับดาวเคราะห์ภายใน',
              type: 'sentence-ordering',
              instruction: 'เรียงลำดับดาวเคราะห์ภายในจากใกล้ดวงอาทิตย์ที่สุดไปไกลที่สุด',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 12,
              timeLimit: 60,
              data: {
                instruction: 'เรียงลำดับดาวเคราะห์ภายในจากใกล้ไปไกล',
                sentences: ['ดาวพุธ', 'ดาวศุกร์', 'โลก', 'ดาวอังคาร'],
                correctOrder: [0, 1, 2, 3]
              },
              points: 15,
              feedback: {
                correct: 'ถูกต้อง! ลำดับดาวเคราะห์ภายในคือ พุธ ศุกร์ โลก อังคาร',
                incorrect: 'ไม่ถูกต้อง ลองนึกถึงระยะห่างจากดวงอาทิตย์อีกครั้ง',
                hint: 'เริ่มจากดาวที่ใกล้ดวงอาทิตย์ที่สุด (พุธ) แล้วออกไปเรื่อยๆ'
              }
            }
          },
          {
            type: 'text',
            content: 'ดาวเคราะห์ในระบบภายนอก ได้แก่ ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน ซึ่งเป็นดาวเคราะห์แก๊ส'
          },
          {
            type: 'true-false',
            content: 'ทดสอบความรู้เกี่ยวกับดาวเคราะห์แก๊ส',
            activity: {
              id: 'gas-planets-tf1',
              title: 'ถูกหรือผิด: ดาวเคราะห์แก๊ส',
              type: 'true-false',
              instruction: 'พิจารณาข้อความต่อไปนี้ว่าถูกหรือผิด',
              difficulty: 'medium',
              maxAttempts: 2,
              data: {
                statement: 'ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะและมีแรงโน้มถ่วงมากกว่าโลกหลายเท่า',
                correctAnswer: true,
                explanation: 'ถูกต้อง! ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุด มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกัน และแรงโน้มถ่วงมากกว่าโลกประมาณ 2.5 เท่า'
              },
              points: 10,
              feedback: {
                correct: 'ถูกต้อง! ดาวพฤหัสบดีใหญ่และหนักมากจริงๆ',
                incorrect: 'ไม่ถูกต้อง ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะ',
                hint: 'ดาวพฤหัสบดีเป็น "ยักษ์ใหญ่" ของระบบสุริยะ'
              }
            }
          }
        ]
      },
      {
        id: 'chapter-3',
        title: 'Special Features of Planets',
        estimatedTime: '10 minutes',
        content: [
          {
            type: 'text',
            content: 'แต่ละดาวเคราะห์มีคุณสมบัติพิเศษที่แตกต่างกัน เช่น ดาวเสาร์มีวงแหวน ดาวพฤหัสบดีมีจุดแดงใหญ่ และดาวยูเรนัสหมุนตะแคงข้าง'
          },
          {
            type: 'image-identification',
            content: 'ทดสอบการจำแนกดาวเคราะห์จากคุณลักษณะพิเศษ',
            required: true,
            minimumScore: 12,
            activity: {
              id: 'planet-features1',
              title: 'จำแนกดาวเคราะห์จากคุณลักษณะ',
              type: 'image-identification',
              instruction: 'ดูรูปภาพและเลือกดาวเคราะห์ที่ตรงกัน',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 12,
              timeLimit: 45,
              data: {
                image: 'ดาวเคราะห์ที่มีวงแหวนสวยงามล้อมรอบ',
                question: 'ดาวเคราะห์ในภาพคือดาวใด?',
                options: ['ดาวพฤหัสบดี', 'ดาวเสาร์', 'ดาวยูเรนัส', 'ดาวเนปจูน'],
                correctAnswer: 1,
                explanation: 'ดาวเสาร์เป็นดาวเคราะห์ที่มีวงแหวนที่เห็นได้ชัดเจนและสวยงามที่สุด'
              },
              points: 15,
              feedback: {
                correct: 'ถูกต้อง! ดาวเสาร์มีวงแหวนที่สวยงามและโดดเด่นที่สุด',
                incorrect: 'ไม่ถูกต้อง วงแหวนที่เห็นได้ชัดเจนนี้เป็นของดาวเสาร์',
                hint: 'ดาวเคราะห์ที่มีวงแหวนสวยงามที่มองเห็นได้ง่ายที่สุดคือ?'
              }
            }
          },
          {
            type: 'range-answer',
            content: 'ทดสอบความรู้เกี่ยวกับขนาดของดาวเคราะห์',
            activity: {
              id: 'planet-size1',
              title: 'ทายขนาดดาวเคราะห์',
              type: 'range-answer',
              instruction: 'ทายขนาดเส้นผ่านศูนย์กลางของโลกเป็นกิโลเมตร',
              difficulty: 'medium',
              data: {
                question: 'โลกมีเส้นผ่านศูนย์กลางประมาณกี่กิโลเมตร?',
                min: 10000,
                max: 15000,
                correctAnswer: 12742,
                tolerance: 500,
                unit: 'กิโลเมตร',
                explanation: 'โลกมีเส้นผ่านศูนย์กลางประมาณ 12,742 กิโลเมตร'
              },
              points: 20,
              feedback: {
                correct: 'เยี่ยม! คุณทายขนาดของโลกได้ใกล้เคียงมาก',
                incorrect: 'ไม่ถูกต้อง โลกมีเส้นผ่านศูนย์กลางประมาณ 12,742 กิโลเมตร'
              }
            }
          },
          {
            type: 'interactive',
            content: 'ทบทวนความรู้และไปทำแบบทดสอบ'
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
    chapters: [
      {
        id: 'chapter-1',
        title: 'Earth Layers',
        estimatedTime: '15 minutes',
        content: [
          {
            type: 'text',
            content: 'โลกของเรามีโครงสร้างภายในที่แบ่งออกเป็น 4 ชั้นหลัก คือ เปลือกโลก เนื้อโลก แกนกลางชั้นนอก และแกนกลางชั้นใน'
          },
          {
            type: 'image',
            content: 'Earth Layers Structure',
            imageUrl: '/images/earth-layers.jpg'
          },
          {
            type: 'sentence-ordering',
            content: 'ทดสอบความเข้าใจเกี่ยวกับลำดับชั้นของโลก',
            required: true,
            minimumScore: 12,
            activity: {
              id: 'earth-layers-order1',
              title: 'เรียงลำดับชั้นของโลก',
              type: 'sentence-ordering',
              instruction: 'เรียงลำดับชั้นของโลกจากชั้นนอกสุดไปชั้นในสุด',
              difficulty: 'medium',
              maxAttempts: 3,
              passingScore: 12,
              timeLimit: 90,
              data: {
                instruction: 'เรียงลำดับชั้นของโลกจากภายนอกไปภายใน',
                sentences: ['เปลือกโลก', 'เนื้อโลก', 'แกนกลางชั้นนอก', 'แกนกลางชั้นใน'],
                correctOrder: [0, 1, 2, 3]
              },
              points: 15,
              feedback: {
                correct: 'ถูกต้อง! ลำดับชั้นโลกคือ เปลือกโลก เนื้อโลก แกนกลางชั้นนอก แกนกลางชั้นใน',
                incorrect: 'ไม่ถูกต้อง ลองคิดถึงการเรียงลำดับจากชั้นนอกไปชั้นในอีกครั้ง',
                hint: 'เริ่มจากชั้นที่เราอยู่ (เปลือกโลก) แล้วลึกลงไปเรื่อยๆ จนถึงใจกลางโลก'
              }
            }
          }
        ]
      },
      {
        id: 'chapter-2',
        title: 'Atmosphere',
        estimatedTime: '15 minutes',
        content: [
          {
            type: 'text',
            content: 'ชั้นบรรยากาศของโลกแบ่งออกเป็น 5 ชั้น คือ โทรโปสเฟียร์ สตราโตสเฟียร์ มีโซสเฟียร์ เทอร์โมสเฟียร์ และเอ็กโซสเฟียร์'
          },
          {
            type: 'multiple-choice',
            content: 'ทดสอบความรู้เกี่ยวกับชั้นบรรยากาศ',
            required: true,
            minimumScore: 8,
            activity: {
              id: 'atmosphere-mc1',
              title: 'ทดสอบความรู้ชั้นบรรยากาศ',
              type: 'multiple-choice',
              instruction: 'เลือกคำตอบที่ถูกต้องเกี่ยวกับชั้นบรรยากาศ',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 8,
              timeLimit: 30,
              data: {
                question: 'ชั้นบรรยากาศใดที่มีโอโซนส่วนใหญ่อยู่?',
                options: ['โทรโปสเฟียร์', 'สตราโตสเฟียร์', 'มีโซสเฟียร์', 'เทอร์โมสเฟียร์'],
                correctAnswer: 1,
                explanation: 'สตราโตสเฟียร์มีชั้นโอโซนที่ปกป้องโลกจากรังสียูวีอันตราย'
              },
              points: 10,
              feedback: {
                correct: 'ถูกต้อง! สตราโตสเฟียร์มีชั้นโอโซนที่สำคัญ',
                incorrect: 'ไม่ถูกต้อง ชั้นโอโซนอยู่ในสตราโตสเฟียร์',
                hint: 'ชั้นที่มี "โอโซน" ปกป้องเราจากรังสี UV คือชั้นที่ 2 นับจากล่าง'
              }
            }
          }
        ]
      },
      {
        id: 'chapter-3',
        title: 'Magnetic Field',
        estimatedTime: '10 minutes',
        content: [
          {
            type: 'text',
            content: 'สนามแม่เหล็กโลกเกิดจากการเคลื่อนไหวของเหล็กเหลวในแกนกลางชั้นนอก ทำหน้าที่ปกป้องโลกจากรังสีอันตรายจากอวกาศ'
          },
          {
            type: 'fill-blanks',
            content: 'ทดสอบความเข้าใจเกี่ยวกับสนามแม่เหล็กโลก',
            required: true,
            minimumScore: 12,
            activity: {
              id: 'magnetic-field-fill1',
              title: 'เติมคำเกี่ยวกับสนามแม่เหล็ก',
              type: 'fill-blanks',
              instruction: 'เติมคำที่เหมาะสมเกี่ยวกับสนามแม่เหล็กโลก',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 12,
              timeLimit: 45,
              data: {
                sentence: 'สนามแม่เหล็กโลกเกิดจาก {blank} ที่เคลื่อนไหวในแกนกลางชั้นนอก และช่วยปกป้องโลกจาก {blank} จากอวกาศ',
                options: ['เหล็กเหลว', 'หินหลอมเหลว', 'รังสีอันตราย', 'อุกกาบาต', 'ก๊าซร้อน', 'คลื่นแสง'],
                correctAnswers: ['เหล็กเหลว', 'รังสีอันตราย']
              },
              points: 15,
              feedback: {
                correct: 'ถูกต้อง! เหล็กเหลวสร้างสนามแม่เหล็กที่ปกป้องเราจากรังสี',
                incorrect: 'ลองใหม่ คิดถึงสิ่งที่อยู่ในแกนกลางและสิ่งที่สนามแม่เหล็กปกป้อง',
                hint: 'แกนกลางชั้นนอกเป็นโลหะเหลว และสนามแม่เหล็กปกป้องจากรังสีจากอวกาศ'
              }
            }
          },
          {
            type: 'interactive',
            content: 'ทบทวนความรู้และไปทำแบบทดสอบ'
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
