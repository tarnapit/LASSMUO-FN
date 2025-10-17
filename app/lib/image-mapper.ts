// Image mapping สำหรับ mock รูปภาพเข้าไปในคำถามจาก API
// จับคู่รูปภาพตาม stageId และลำดับคำถาม

interface ImageMapping {
  stageId: number;
  questionIndex: number; // ลำดับคำถามใน stage (0-based)
  image: string;
  description?: string;
}

// การ mapping รูปภาพสำหรับแต่ละด่าน
const IMAGE_MAPPINGS: ImageMapping[] = [
  // ด่านที่ 1 - การรู้จักระบบสุริยะ
  {
    stageId: 1,
    questionIndex: 0,
    image: "/images/stage/solar-system.png",
    description: "ระบบสุริยะ - แสดงดาวเคราะห์ทั้ง 8 ดวง"
  },
  {
    stageId: 1,
    questionIndex: 1,
    image: "/images/stage/venus.jpg",
    description: "ดาวศุกร์ - ดาวเคราะห์ที่ร้อนที่สุด"
  },
  {
    stageId: 1,
    questionIndex: 2,
    image: "/images/stage/saturn.jpg",
    description: "ดาวเสาร์ - ดาวเคราะห์ที่มีวงแหวนสวยงาม"
  },
  {
    stageId: 1,
    questionIndex: 3,
    image: "/images/stage/solar-system.png",
    description: "โลก - ดาวเคราะห์ที่เราอาศัยอยู่"
  },
  {
    stageId: 1,
    questionIndex: 4,
    image: "/images/stage/mars.jpg",
    description: "ดาวอังคาร - ดาวเคราะห์สีแดง"
  },

  // ด่านที่ 5 - ดาวหางและดาวเคราะห์น้อย
  {
    stageId: 5,
    questionIndex: 0,
    image: "/images/stage/comet.jpg",
    description: "ดาวหาง - มาจากเมฆออร์ต"
  },
  {
    stageId: 5,
    questionIndex: 1,
    image: "/images/stage/oort.jpg",
    description: "เมฆออร์ต - แหล่งกำเนิดของดาวหาง"
  },
  {
    stageId: 5,
    questionIndex: 2,
    image: "/images/stage/meteor_shower.jpg",
    description: "ฝนดาวตก - อุกกาบาตที่ตกสู่โลก"
  },
  {
    stageId: 5,
    questionIndex: 3,
    image: "/images/stage/ceres.jpg",
    description: "เซเรส - ดาวเคราะห์แคระในเข็มขัดดาวเคราะห์น้อย"
  },
  {
    stageId: 5,
    questionIndex: 4,
    image: "/images/stage/asteroid_belt.jpg",
    description: "เข็มขัดดาวเคราะห์น้อย - ระหว่างดาวอังคารและดาวพฤหัสบดี"
  },

  // สามารถเพิ่มด่านอื่นๆ ได้ที่นี่
  // ด่านที่ 2
  {
    stageId: 2,
    questionIndex: 0,
    image: "/images/stage/mars.jpg",
    description: "ดาวอังคาร - ดาวเคราะห์สีแดง"
  },

  // ด่านที่ 3
  {
    stageId: 3,
    questionIndex: 0,
    image: "/images/stage/saturn.jpg",
    description: "ดาวเคราะห์ยักษ์แก๊ส"
  },

  // ด่านที่ 4
  {
    stageId: 4,
    questionIndex: 0,
    image: "/images/stage/solar-system.png",
    description: "ดวงจันทร์และระบบสุริยะ"
  }
];

/**
 * หารูปภาพสำหรับคำถามตาม stageId และ index ของคำถาม
 * @param stageId - ID ของด่าน
 * @param questionIndex - ลำดับคำถามใน stage (0-based)
 * @returns path ของรูปภาพ หรือ undefined ถ้าไม่มี
 */
export function getQuestionImage(stageId: number, questionIndex: number): string | undefined {
  const mapping = IMAGE_MAPPINGS.find(
    m => m.stageId === stageId && m.questionIndex === questionIndex
  );
  return mapping?.image;
}

/**
 * หาคำอธิบายรูปภาพ
 * @param stageId - ID ของด่าน  
 * @param questionIndex - ลำดับคำถามใน stage (0-based)
 * @returns คำอธิบายรูปภาพ หรือ undefined ถ้าไม่มี
 */
export function getQuestionImageDescription(stageId: number, questionIndex: number): string | undefined {
  const mapping = IMAGE_MAPPINGS.find(
    m => m.stageId === stageId && m.questionIndex === questionIndex
  );
  return mapping?.description;
}

/**
 * เพิ่มรูปภาพเข้าไปในคำถามจาก API
 * @param questions - array ของคำถามจาก API
 * @param stageId - ID ของด่าน
 * @returns คำถามที่มีรูปภาพเพิ่มเข้าไป
 */
export function addImagesToQuestions(questions: any[], stageId: number): any[] {
  return questions.map((question, index) => ({
    ...question,
    image: getQuestionImage(stageId, index) || question.image, // ใช้ image จาก API ถ้ามี ไม่งั้นใช้ mock
    imageDescription: getQuestionImageDescription(stageId, index)
  }));
}

/**
 * ตรวจสอบว่าด่านนี้มีรูปภาพ mock หรือไม่
 * @param stageId - ID ของด่าน
 * @returns true ถ้ามีรูปภาพ mock
 */
export function hasStageImages(stageId: number): boolean {
  return IMAGE_MAPPINGS.some(m => m.stageId === stageId);
}

/**
 * รายการด่านที่มีรูปภาพ mock
 */
export function getStagesWithImages(): number[] {
  return [...new Set(IMAGE_MAPPINGS.map(m => m.stageId))].sort();
}

// Export mappings สำหรับการ debug
export { IMAGE_MAPPINGS };