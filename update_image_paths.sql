-- อัปเดต path ของรูปภาพในฐานข้อมูลให้ตรงกับโครงสร้างโฟลเดอร์ใหม่

-- อัปเดต solar-system-overview.jpg
UPDATE public."CourseDetail" 
SET "ImageUrl" = '/images/learning/solar-system/solar-system-overview.jpg' 
WHERE "ImageUrl" = '/images/solar-system-overview.jpg';

-- อัปเดต inner-planets.jpg
UPDATE public."CourseDetail" 
SET "ImageUrl" = '/images/planets/inner-planets.jpg' 
WHERE "ImageUrl" = '/images/inner-planets.jpg';

-- อัปเดต earth-layers.jpg
UPDATE public."CourseDetail" 
SET "ImageUrl" = '/images/planets/earth-layers.jpg' 
WHERE "ImageUrl" = '/images/earth-layers.jpg';

-- ตรวจสอบผลลัพธ์
SELECT id, "courseLessonId", "ImageUrl", type 
FROM public."CourseDetail" 
WHERE "ImageUrl" IS NOT NULL AND "ImageUrl" != ''
ORDER BY "ImageUrl";