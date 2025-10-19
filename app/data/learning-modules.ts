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
            imageUrl: '/images/learning/solar-system/solar-system-overview.jpg'
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
              difficulty: 'Easy',
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
            imageUrl: '/images/planets/inner-planets.jpg'
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
          },
          {
            type: 'sentence-ordering',
            content: '🚀 กิจกรรมพิเศษ: Orbital Motion Simulation',
            required: true,
            minimumScore: 18,
            activity: {
              id: 'orbital-motion-simulation',
              title: 'เรียงลำดับการโคจรของดาวเคราะห์',
              type: 'sentence-ordering',
              instruction: 'จัดเรียงดาวเคราะห์ตามรอบการโคจร (จากเร็วที่สุดไปช้าที่สุด)',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 18,
              timeLimit: 90,
              data: {
                instruction: 'เรียงดาวเคราะห์ตามความเร็วในการโคจรรอบดวงอาทิตย์ (เร็วที่สุดไปช้าที่สุด)',
                sentences: ['ดาวพุธ (88 วัน)', 'ดาวศุกร์ (225 วัน)', 'โลก (365 วัน)', 'ดาวอังคาร (687 วัน)', 'ดาวพฤหัสบดี (12 ปี)', 'ดาวเนปจูน (165 ปี)'],
                correctOrder: [0, 1, 2, 3, 4, 5],
                explanation: 'ดาวเคราะห์ที่ใกล้ดวงอาทิตย์มากจะโคจรเร็วกว่า ตามกฎของเคปเลอร์'
              },
              points: 20,
              feedback: {
                correct: 'ยอดเยี่ยม! คุณเข้าใจหลักการโคจรของดาวเคราะห์แล้ว',
                incorrect: 'ลองใหม่ ดาวที่ใกล้ดวงอาทิตย์จะโคจรเร็วกว่าดาวที่ไกล',
                hint: 'ยิ่งใกล้ดวงอาทิตย์ ยิ่งโคจรเร็ว - ดาวพุธเร็วที่สุด ดาวเนปจูนช้าที่สุด'
              }
            }
          },
          {
            type: 'fill-blanks',
            content: '☀️ กิจกรรมพิเศษ: Space Weather Prediction',
            required: true,
            minimumScore: 16,
            activity: {
              id: 'space-weather-prediction',
              title: 'ทำนายสภาพอากาศในอวกาศ',
              type: 'fill-blanks',
              instruction: 'เติมคำที่เหมาะสมเกี่ยวกับปรากฏการณ์ในอวกาศ',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 16,
              timeLimit: 75,
              data: {
                sentence: 'เมื่อดวงอาทิตย์มีการระเบิด {blank} จะส่งผลต่อ {blank} ของโลก และอาจทำให้เกิด {blank} ที่ขั้วโลก',
                options: ['พายุแม่เหล็กสุริยะ', 'พายุฝน', 'สนามแม่เหล็ก', 'บรรยากาศ', 'แสงเหนือ', 'รุ้ง'],
                correctAnswers: ['พายุแม่เหล็กสุริยะ', 'สนามแม่เหล็ก', 'แสงเหนือ'],
                explanation: 'พายุแม่เหล็กสุริยะส่งอนุภาคพลังงานสูงมายังโลก กระทบสนามแม่เหล็กโลก และสร้างแสงเหนือ (Aurora) ที่สวยงาม'
              },
              points: 18,
              feedback: {
                correct: 'สุดยอด! คุณเข้าใจปรากฏการณ์อวกาศได้ดีมาก',
                incorrect: 'ลองใหม่ คิดถึงปรากฏการณ์ที่เกิดจากดวงอาทิตย์และส่งผลต่อโลก',
                hint: 'ดวงอาทิตย์ส่ง "พายุแม่เหล็ก" มากระทบ "สนามแม่เหล็ก" โลก สร้าง "แสงเหนือ"'
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
            type: 'text',
            content: 'ดาวเคราะห์แต่ละดวงมีขนาดและระยะห่างจากดวงอาทิตย์ที่แตกต่างกัน ซึ่งส่งผลต่ออุณหภูมิและสภาพแวดล้อมของแต่ละดาว'
          },
          {
            type: 'multiple-choice',
            content: '🌟 กิจกรรมพิเศษ: Virtual Planet Tour',
            required: true,
            minimumScore: 15,
            activity: {
              id: 'virtual-planet-tour',
              title: 'เลือกดาวเคราะห์ที่อยากไปเยี่ยมชม',
              type: 'multiple-choice',
              instruction: 'หากคุณมียานอวกาศไปเยี่ยมชมดาวเคราะห์ได้ 1 ดวง คุณจะเลือกดาวไหนและทำไม?',
              difficulty: 'medium',
              maxAttempts: 1,
              passingScore: 15,
              timeLimit: 90,
              data: {
                question: 'ดาวเคราะห์ใดที่น่าสนใจที่สุดสำหรับการสำรวจในอนาคต?',
                options: [
                  'ดาวอังคาร - เพื่อหาร่องรอยของสิ่งมีชีวิต',
                  'ดาวศุกร์ - เพื่อศึกษาภาวะเรือนกระจก',
                  'ดาวพฤหัสบดี - เพื่อศึกษาบรรยากาศแก๊ส',
                  'ดาวเสาร์ - เพื่อศึกษาวงแหวนและดาวเทียม'
                ],
                correctAnswer: 0,
                explanation: 'ดาวอังคารเป็นเป้าหมายหลักของการสำรวจอวกาศ เพราะมีสภาพแวดล้อมที่เคยเหมาะสมกับสิ่งมีชีวิต และอาจมีน้ำแข็งใต้ผิวดิน'
              },
              points: 15,
              feedback: {
                correct: 'ตัวเลือกที่ดีเยี่ยม! ดาวอังคารเป็นจุดหมายที่น่าสนใจที่สุดสำหรับมนุษย์',
                incorrect: 'ทุกตัวเลือกน่าสนใจ! แต่ดาวอังคารเป็นเป้าหมายหลักเพราะมีความเป็นไปได้ของสิ่งมีชีวิต',
                hint: 'ดาวไหนที่มนุษย์วางแผนจะส่งคนไปอยู่ในอนาคต?'
              }
            }
          },
          {
            type: 'matching',
            content: '🎯 กิจกรรมพิเศษ: Planetary Scale Comparison',
            required: true,
            minimumScore: 20,
            activity: {
              id: 'planetary-scale-comparison',
              title: 'เปรียบเทียบขนาดดาวเคราะห์',
              type: 'matching',
              instruction: 'จับคู่ดาวเคราะห์กับการเปรียบเทียบขนาดที่ถูกต้อง',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 20,
              timeLimit: 120,
              data: {
                pairs: [
                  {
                    left: 'ดาวพฤหัสบดี',
                    right: 'ใหญ่กว่าโลก 11 เท่า',
                    explanation: 'ดาวพฤหัสบดีมีเส้นผ่านศูนย์กลางใหญ่กว่าโลกประมาณ 11 เท่า และมีมวลมากกว่าดาวเคราะห์อื่นรวมกัน'
                  },
                  {
                    left: 'ดาวเสาร์',
                    right: 'ใหญ่กว่าโลก 9 เท่า แต่น้ำหนักเบากว่าน้ำ',
                    explanation: 'ดาวเสาร์มีความหนาแน่นต่ำมาก หากมีมหาสมุทรใหญ่พอ ดาวเสาร์จะลอยน้ำได้'
                  },
                  {
                    left: 'ดาวพุธ',
                    right: 'เล็กกว่าโลก 2.6 เท่า',
                    explanation: 'ดาวพุธเป็นดาวเคราะห์ที่เล็กที่สุด มีขนาดเพียงประมาณ 38% ของโลก'
                  },
                  {
                    left: 'ดาวยูเรนัส',
                    right: 'ใหญ่กว่าโลก 4 เท่า และหมุนตะแคงข้าง',
                    explanation: 'ดาวยูเรนัสมีขนาดใหญ่กว่าโลก 4 เท่า และมีแกนหมุนเอียงเกือบ 90 องศา'
                  }
                ]
              },
              points: 25,
              feedback: {
                correct: 'สุดยอด! คุณเข้าใจขนาดและสัดส่วนของดาวเคราะห์เป็นอย่างดี',
                incorrect: 'ลองใหม่อีกครั้ง ดูข้อมูลเปรียบเทียบขนาดให้ละเอียดยิ่งขึ้น',
                hint: 'พฤหัสฯ ใหญ่ที่สุด เสาร์เบาที่สุด พุธเล็กที่สุด ยูเรนัสเอียงข้าง'
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
            imageUrl: '/images/planets/earth-layers.jpg'
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
          },
          {
            type: 'text',
            content: 'เปลือกโลกมีความหนาประมาณ 5-70 กิโลเมตร เนื้อโลกมีความหนาประมาณ 2,900 กิโลเมตร และแกนกลางมีรัศมีประมาณ 3,500 กิโลเมตร'
          },
          {
            type: 'multiple-choice',
            content: '🌍 กิจกรรมพิเศษ: Earthquake Simulation',
            required: true,
            minimumScore: 15,
            activity: {
              id: 'earthquake-simulation',
              title: 'จำลองการเกิดแผ่นดินไหว',
              type: 'multiple-choice',
              instruction: 'ศึกษาสาเหตุของแผ่นดินไหวและเลือกคำตอบที่ถูกต้อง',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 15,
              timeLimit: 60,
              data: {
                question: 'แผ่นดินไหวส่วนใหญ่เกิดจากอะไร?',
                options: [
                  'การระเบิดของภูเขาไฟ',
                  'การเคลื่อนที่ของแผ่นเปลือกโลก',
                  'การเปลี่ยนแปลงของอุณหภูมิในแกนโลก',
                  'การกระทบของอุกกาบาต'
                ],
                correctAnswer: 1,
                explanation: 'แผ่นดินไหวส่วนใหญ่เกิดจากการเคลื่อนที่และการชนกันของแผ่นเปลือกโลก (Tectonic Plates) ที่รอยต่อของแผ่น'
              },
              points: 18,
              feedback: {
                correct: 'ถูกต้อง! การเคลื่อนที่ของแผ่นเปลือกโลกเป็นสาเหตุหลักของแผ่นดินไหว',
                incorrect: 'ไม่ถูกต้อง แผ่นดินไหวเกิดจากการเคลื่อนที่ของแผ่นเปลือกโลก',
                hint: 'คิดถึง "แผ่น" ใหญ่ๆ ที่เคลื่อนที่และชนกันใต้พื้นโลก'
              }
            }
          },
          {
            type: 'fill-blanks',
            content: '🗿 กิจกรรมพิเศษ: Rock Cycle Journey',
            required: true,
            minimumScore: 16,
            activity: {
              id: 'rock-cycle-journey',
              title: 'การเดินทางของหิน',
              type: 'fill-blanks',
              instruction: 'เติมคำให้ถูกต้องเกี่ยวกับวัฏจักรหิน',
              difficulty: 'medium',
              maxAttempts: 2,
              passingScore: 16,
              timeLimit: 90,
              data: {
                sentence: 'หินอัคนีเกิดจาก {blank} ที่เย็นตัว หินตะกอนเกิดจากการ {blank} และ {blank} ส่วนหินแปรเกิดจากความ {blank} และแรงกดสูง',
                options: ['แมกมา', 'น้ำ', 'กัดเซาะ', 'ตกทับถม', 'ร้อน', 'เย็น', 'ลม', 'แรงโน้มถ่วง'],
                correctAnswers: ['แมกมา', 'กัดเซาะ', 'ตกทับถม', 'ร้อน'],
                explanation: 'วัฏจักรหิน: หินอัคนี (แมกมาเย็นตัว) → หินตะกอน (กัดเซาะ+ตกทับถม) → หินแปร (ความร้อน+แรงกด)'
              },
              points: 20,
              feedback: {
                correct: 'ยอดเยี่ยม! คุณเข้าใจวัฏจักรหินเป็นอย่างดี',
                incorrect: 'ลองใหม่ คิดถึงกระบวนการเกิดหินแต่ละประเภท',
                hint: 'อัคนี = แมกมา, ตะกอน = กัดเซาะ+ทับถม, แปร = ร้อน+กด'
              }
            }
          },
          {
            type: 'range-answer',
            content: '🌡️ กิจกรรมพิเศษ: Earth Temperature Depth',
            activity: {
              id: 'earth-temperature-depth',
              title: 'ทายอุณหภูมิในใจกลางโลก',
              type: 'range-answer',
              instruction: 'ทายอุณหภูมิในแกนกลางโลก',
              difficulty: 'hard',
              data: {
                question: 'แกนกลางโลกมีอุณหภูมิประมาณกี่องศาเซลเซียส?',
                min: 4000,
                max: 7000,
                correctAnswer: 5500,
                tolerance: 500,
                unit: 'องศาเซลเซียส',
                explanation: 'แกนกลางโลกมีอุณหภูมิประมาณ 5,500°C ร้อนพอๆ กับผิวดวงอาทิตย์!'
              },
              points: 25,
              feedback: {
                correct: 'สุดยอด! แกนกลางโลกร้อนเท่ากับผิวดวงอาทิตย์เลย',
                incorrect: 'ไม่ถูกต้อง แกนกลางโลกร้อนมากถึง 5,500°C'
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
          },
          {
            type: 'text',
            content: 'ชั้นบรรยากาศแต่ละชั้นมีคุณสมบัติและหน้าที่ที่แตกต่างกัน เช่น โทรโปสเฟียร์เป็นที่เกิดสภาพอากาศ สตราโตสเฟียร์มีชั้นโอโซน'
          },
          {
            type: 'matching',
            content: '🌤️ กิจกรรมพิเศษ: Atmosphere Layer Explorer',
            required: true,
            minimumScore: 18,
            activity: {
              id: 'atmosphere-layer-explorer',
              title: 'สำรวจชั้นบรรยากาศ',
              type: 'matching',
              instruction: 'จับคู่ชั้นบรรยากาศกับลักษณะเด่นของแต่ละชั้น',
              difficulty: 'hard',
              maxAttempts: 2,
              passingScore: 18,
              timeLimit: 120,
              data: {
                pairs: [
                  {
                    left: 'โทรโปสเฟียร์',
                    right: 'ชั้นที่เราอยู่ มีเมฆและสภาพอากาศ',
                    explanation: 'โทรโปสเฟียร์เป็นชั้นล่างสุดที่มนุษย์อาศัยอยู่ มีการเกิดเมฆ ฝน และปรากฏการณ์อากาศต่างๆ'
                  },
                  {
                    left: 'สตราโตสเฟียร์',
                    right: 'มีชั้นโอโซนปกป้องจากรังสี UV',
                    explanation: 'สตราโตสเฟียร์มีชั้นโอโซนที่ดูดซับรังสียูวีจากดวงอาทิตย์ ปกป้องสิ่งมีชีวิตบนโลก'
                  },
                  {
                    left: 'มีโซสเฟียร์',
                    right: 'เย็นที่สุด อุกกาบาตไหม้หมดที่นี่',
                    explanation: 'มีโซสเฟียร์เป็นชั้นที่เย็นที่สุด อุกกาบาตส่วนใหญ่จะไหม้หมดในชั้นนี้'
                  },
                  {
                    left: 'เทอร์โมสเฟียร์',
                    right: 'ร้อนมาก มีแสงเหนือเกิดขึ้น',
                    explanation: 'เทอร์โมสเฟียร์มีอุณหภูมิสูงมาก และเป็นชั้นที่เกิดแสงเหนือ (Aurora)'
                  }
                ]
              },
              points: 22,
              feedback: {
                correct: 'ยอดเยี่ยม! คุณเข้าใจชั้นบรรยากาศทั้ง 4 ชั้นเป็นอย่างดี',
                incorrect: 'ลองใหม่ คิดถึงลักษณะเด่นของแต่ละชั้นบรรยากาศ',
                hint: 'โทรโป=อากาศ, สตราโต=โอโซน, มีโซ=เย็น+อุกกาบาต, เทอร์โม=ร้อน+แสงเหนือ'
              }
            }
          },
          {
            type: 'true-false',
            content: '🌈 กิจกรรมพิเศษ: Weather Phenomenon',
            activity: {
              id: 'weather-phenomenon',
              title: 'ปรากฏการณ์สภาพอากาศ',
              type: 'true-false',
              instruction: 'พิจารณาข้อความเกี่ยวกับปรากฏการณ์ทางอากาศ',
              difficulty: 'medium',
              maxAttempts: 2,
              data: {
                statement: 'ฟ้าร้องฟ้าผ่าเกิดขึ้นในชั้นโทรโปสเฟียร์ และเป็นการคายประจุไฟฟ้าจากเมฆมายังพื้นดิน',
                correctAnswer: true,
                explanation: 'ถูกต้อง! ฟ้าร้องฟ้าผ่าเกิดในโทรโปสเฟียร์ เป็นการคายประจุไฟฟ้าสถิตที่สะสมในเมฆ'
              },
              points: 12,
              feedback: {
                correct: 'ถูกต้อง! ฟ้าผ่าเป็นปรากฏการณ์ไฟฟ้าธรรมชาติ',
                incorrect: 'ไม่ถูกต้อง ฟ้าผ่าเกิดจากการคายประจุไฟฟ้าในโทรโปสเฟียร์',
                hint: 'ฟ้าผ่าเกิดในชั้นที่มีเมฆและสภาพอากาศ'
              }
            }
          },
          {
            type: 'range-answer',
            content: '📏 กิจกรรมพิเศษ: Atmosphere Thickness',
            activity: {
              id: 'atmosphere-thickness',
              title: 'ทายความหนาของชั้นบรรยากาศ',
              type: 'range-answer',
              instruction: 'ทายความสูงของชั้นบรรยากาศทั้งหมด',
              difficulty: 'medium',
              data: {
                question: 'ชั้นบรรยากาศโลกมีความสูงทั้งหมดประมาณกี่กิโลเมตร?',
                min: 500,
                max: 1500,
                correctAnswer: 1000,
                tolerance: 200,
                unit: 'กิโลเมตร',
                explanation: 'ชั้นบรรยากาศโลกมีความสูงประมาณ 1,000 กิโลเมตร จนถึงอวกาศ'
              },
              points: 15,
              feedback: {
                correct: 'ยอดเยี่ยม! บรรยากาศหนาประมาณ 1,000 กม.',
                incorrect: 'ไม่ถูกต้อง บรรยากาศโลกหนาประมาณ 1,000 กิโลเมตร'
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
            type: 'text',
            content: 'สนามแม่เหล็กโลกมีขั้วเหนือและขั้วใต้ ซึ่งไม่ตรงกับขั้วทางภูมิศาสตร์ และสามารถเปลี่ยนขั้วได้ในอนาคต'
          },
          {
            type: 'multiple-choice',
            content: '🧭 กิจกรรมพิเศษ: Magnetic Navigation',
            required: true,
            minimumScore: 15,
            activity: {
              id: 'magnetic-navigation',
              title: 'การนำทางด้วยสนามแม่เหล็ก',
              type: 'multiple-choice',
              instruction: 'ศึกษาการใช้เข็มทิศและเลือกคำตอบที่ถูกต้อง',
              difficulty: 'medium',
              maxAttempts: 2,
              passingScore: 15,
              timeLimit: 60,
              data: {
                question: 'เหตุใดเข็มทิศจึงชี้ไปทางเหนือ?',
                options: [
                  'เพราะมีแร่เหล็กในดินทางเหนือ',
                  'เพราะสนามแม่เหล็กโลกมีขั้วแม่เหล็กทางเหนือ',
                  'เพราะแสงดาวเหนือดึงดูดเข็มทิศ',
                  'เพราะอุณหภูมิทางเหนือเย็นกว่า'
                ],
                correctAnswer: 1,
                explanation: 'เข็มทิศชี้ไปทางขั้วแม่เหล็กเหนือของโลก ซึ่งเกิดจากสนามแม่เหล็กโลก'
              },
              points: 18,
              feedback: {
                correct: 'ถูกต้อง! เข็มทิศทำงานเพราะสนามแม่เหล็กโลก',
                incorrect: 'ไม่ถูกต้อง เข็มทิศชี้เหนือเพราะสนามแม่เหล็กโลก',
                hint: 'เข็มทิศเป็นแม่เหล็ก และแม่เหล็กจะชี้ไปตาม "สนาม"'
              }
            }
          },
          {
            type: 'true-false',
            content: '✨ กิจกรรมพิเศษ: Aurora Mystery',
            required: true,
            minimumScore: 12,
            activity: {
              id: 'aurora-mystery',
              title: 'ปริศนาแสงเหนือ',
              type: 'true-false',
              instruction: 'พิจารณาข้อความเกี่ยวกับแสงเหนือ (Aurora)',
              difficulty: 'medium',
              maxAttempts: 2,
              passingScore: 12,
              data: {
                statement: 'แสงเหนือ (Aurora) เกิดจากการที่อนุภาคจากดวงอาทิตย์ชนกับสนามแม่เหล็กโลกและก๊าซในบรรยากาศ',
                correctAnswer: true,
                explanation: 'ถูกต้อง! แสงเหนือเกิดจากลมสุริยะ (อนุภาคจากดวงอาทิตย์) ที่ถูกสนามแม่เหล็กโลกนำไปชนกับก๊าซในบรรยากาศที่ขั้วโลก'
              },
              points: 15,
              feedback: {
                correct: 'ยอดเยี่ยม! คุณเข้าใจการเกิดแสงเหนือแล้ว',
                incorrect: 'ไม่ถูกต้อง แสงเหนือเกิดจากการปฏิสัมพันธ์ระหว่างลมสุริยะและสนามแม่เหล็ก',
                hint: 'แสงเหนือเกิดจาก "อนุภาคดวงอาทิตย์" + "สนามแม่เหล็ก" + "ก๊าซบรรยากาศ"'
              }
            }
          },
          {
            type: 'image-identification',
            content: '🎨 กิจกรรมพิเศษ: Magnetic Field Visualization',
            activity: {
              id: 'magnetic-field-visualization',
              title: 'มองเห็นสนามแม่เหล็ก',
              type: 'image-identification',
              instruction: 'ดูรูปแบบสนามแม่เหล็กและเลือกคำตอบที่ถูกต้อง',
              difficulty: 'medium',
              maxAttempts: 2,
              data: {
                image: 'รูปแบบเส้นสนามแม่เหล็กโลกที่ดูเหมือนวงรี ออกจากขั้วเหนือและเข้าที่ขั้วใต้',
                question: 'รูปแบบสนามแม่เหล็กนี้เรียกว่าอะไร?',
                options: ['Magnetosphere', 'Atmosphere', 'Ionosphere', 'Thermosphere'],
                correctAnswer: 0,
                explanation: 'Magnetosphere คือบริเวณรอบโลกที่อยู่ภายใต้อิทธิพลของสนามแม่เหล็กโลก'
              },
              points: 20,
              feedback: {
                correct: 'ถูกต้อง! Magnetosphere ปกป้องโลกจากรังสีอวกาศ',
                incorrect: 'ไม่ถูกต้อง บริเวณสนามแม่เหล็กรอบโลกเรียก Magnetosphere',
                hint: 'คำที่ขึ้นต้นด้วย "Magneto" หมายถึงเกี่ยวกับแม่เหล็ก'
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