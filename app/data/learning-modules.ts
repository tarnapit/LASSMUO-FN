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
            type: 'text',
            content: 'ดาวอาทิตย์เป็นดาวฤกษ์ที่อยู่ใจกลางของระบบสุริยะ มีมวลมากที่สุดในระบบ คิดเป็นประมาณ 99.86% ของมวลทั้งหมดในระบบสุริยะ'
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
            type: 'text',
            content: 'ดาวเคราะห์ในระบบภายใน ได้แก่ ดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ซึ่งเป็นดาวเคราะห์หิน'
          },
          {
            type: 'image',
            content: 'Inner Planets',
            imageUrl: '/images/inner-planets.jpg'
          },
          {
            type: 'text',
            content: 'ดาวเคราะห์ในระบบภายนอก ได้แก่ ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน ซึ่งเป็นดาวเคราะห์แก๊ส'
          }
        ]
      },
      {
        id: 'chapter-3',
        title: 'Exercise and Review',
        estimatedTime: '10 minutes',
        content: [
          {
            type: 'text',
            content: 'ตอนนี้คุณได้เรียนรู้เกี่ยวกับระบบสุริยะแล้ว ลองทำแบบฝึกหัดเพื่อทบทวนความรู้กัน'
          },
          {
            type: 'interactive',
            content: 'แบบฝึกหัด: จับคู่ชื่อดาวเคราะห์กับลักษณะเฉพาะ'
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
    estimatedTime: '40 minutes',
    chapters: [
      {
        id: 'chapter-1',
        title: 'Earth Layers',
        estimatedTime: '15 minutes',
        content: [
          {
            type: 'text',
            content: 'โลกมีโครงสร้างภายในที่แบ่งออกเป็น 4 ชั้นหลัก ได้แก่ เปลือกโลก เสื้อคลุมโลก แกนกลางชั้นนอก และแกนกลางชั้นใน'
          },
          {
            type: 'image',
            content: 'Earth Structure Layers',
            imageUrl: '/images/earth-layers.jpg'
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
          }
        ]
      }
    ]
  }
];

export const getLearningModuleById = (id: string): LearningModule | undefined => {
  return learningModules.find(module => module.id === id);
};

export const getChapterById = (moduleId: string, chapterId: string) => {
  const module = getLearningModuleById(moduleId);
  return module?.chapters.find(chapter => chapter.id === chapterId);
};
