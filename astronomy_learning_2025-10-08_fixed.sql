--
-- PostgreSQL database dump (FIXED VERSION)
-- This version will not produce errors when importing to existing database
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Difficulty; Type: TYPE; Schema: public; Owner: admin
--

DO $$ BEGIN
    CREATE TYPE public."Difficulty" AS ENUM (
        'Easy',
        'Medium',
        'Hard'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

--
-- Name: Level; Type: TYPE; Schema: public; Owner: admin
--

DO $$ BEGIN
    CREATE TYPE public."Level" AS ENUM (
        'Fundamental',
        'Intermediate',
        'Advanced'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

--
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: admin
--

DO $$ BEGIN
    CREATE TYPE public."QuestionType" AS ENUM (
        'MULTIPLE_CHOICE',
        'DRAG_DROP',
        'FILL_BLANK',
        'MATCH_PAIRS',
        'TRUE_FALSE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public."Course" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "coverImage" text DEFAULT ''::text,
    "isActive" boolean NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    level public."Level" NOT NULL,
    "estimatedTime" integer DEFAULT 5
);

--
-- Name: CourseDetail; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public."CourseDetail" (
    id text NOT NULL,
    "courseLessonId" text NOT NULL,
    "ImageUrl" text DEFAULT ''::text,
    content jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    required boolean DEFAULT false,
    score double precision DEFAULT 2.0,
    type text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

--
-- Name: CourseLesson; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public."CourseLesson" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    title text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "estimatedTime" integer DEFAULT 5,
    "updatedAt" timestamp(3) without time zone
);

--
-- Name: CoursePostest; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public."CoursePostest" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text,
    "timeLimit" integer DEFAULT 0,
    "passingScore" integer DEFAULT 0,
    "maxAttempts" integer DEFAULT 0,
    question jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);

--
-- Name: CourseQuiz; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public."CourseQuiz" (
    id text NOT NULL,
    "courseDetailId" text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    instruction text NOT NULL,
    "maxAttempts" integer DEFAULT 0,
    "passingScore" integer DEFAULT 0,
    "timeLimite" double precision DEFAULT 0,
    difficulty public."Difficulty" DEFAULT 'Easy'::public."Difficulty",
    data jsonb NOT NULL,
    point integer DEFAULT 0,
    feedback jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);

--
-- Name: User; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text NOT NULL
);

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);

--
-- Name: mini_game_questions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.mini_game_questions (
    id text NOT NULL,
    "legacyId" text,
    type public."QuestionType" NOT NULL,
    question text NOT NULL,
    difficulty public."Difficulty" DEFAULT 'Easy'::public."Difficulty" NOT NULL,
    points integer DEFAULT 0,
    category text,
    payload jsonb,
    "timeBonus" integer,
    "timeLimit" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

--
-- Name: mini_game_results; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.mini_game_results (
    id text NOT NULL,
    "userId" text NOT NULL,
    "miniGameId" text NOT NULL,
    score integer NOT NULL,
    "starsEarned" integer DEFAULT 0 NOT NULL,
    "timeSpent" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--
-- Name: questions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.questions (
    id integer NOT NULL,
    "stageId" integer NOT NULL,
    "order" integer,
    type public."QuestionType" NOT NULL,
    question text NOT NULL,
    difficulty public."Difficulty" DEFAULT 'Easy'::public."Difficulty" NOT NULL,
    points integer DEFAULT 0,
    "timeLimit" integer,
    payload jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    explanation text,
    "funFact" text
);

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

DO $$ BEGIN
    CREATE SEQUENCE public.questions_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

--
-- Name: stage_characters; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.stage_characters (
    id integer NOT NULL,
    "stageId" integer NOT NULL,
    name text NOT NULL,
    avatar text,
    introduction text,
    "learningContent" text,
    "completionMessage" text,
    encouragements jsonb,
    hints jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

--
-- Name: stage_characters_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

DO $$ BEGIN
    CREATE SEQUENCE public.stage_characters_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

--
-- Name: stage_prerequisites; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.stage_prerequisites (
    id integer NOT NULL,
    "stageId" integer NOT NULL,
    "prerequisiteId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--
-- Name: stage_prerequisites_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

DO $$ BEGIN
    CREATE SEQUENCE public.stage_prerequisites_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

--
-- Name: stages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.stages (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    thumbnail text,
    difficulty public."Difficulty" DEFAULT 'Easy'::public."Difficulty" NOT NULL,
    "estimatedTime" text,
    "totalStars" integer DEFAULT 3,
    "xpReward" integer DEFAULT 0,
    "streakBonus" boolean DEFAULT false NOT NULL,
    "healthSystem" boolean DEFAULT false NOT NULL,
    rewards jsonb,
    "maxStars" integer DEFAULT 3 NOT NULL,
    "requiredStarsToUnlockNext" integer DEFAULT 0,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);

--
-- Name: stages_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

DO $$ BEGIN
    CREATE SEQUENCE public.stages_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

--
-- Name: user_course_progress; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.user_course_progress (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "totalScore" integer DEFAULT 0 NOT NULL,
    "progressPercent" double precision DEFAULT 0 NOT NULL,
    "totalStars" integer DEFAULT 0 NOT NULL,
    "unlockedAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--
-- Name: user_stage_progress; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE IF NOT EXISTS public.user_stage_progress (
    id text NOT NULL,
    "userId" text NOT NULL,
    "stageId" integer NOT NULL,
    "bestScore" integer DEFAULT 0 NOT NULL,
    "starsEarned" integer DEFAULT 0 NOT NULL,
    passed boolean DEFAULT false NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    unlocked boolean DEFAULT false NOT NULL,
    "lastPlayed" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--
-- Set up sequences ownership
--

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'questions_id_seq') THEN
        ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'stage_characters_id_seq') THEN
        ALTER SEQUENCE public.stage_characters_id_seq OWNED BY public.stage_characters.id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'stage_prerequisites_id_seq') THEN
        ALTER SEQUENCE public.stage_prerequisites_id_seq OWNED BY public.stage_prerequisites.id;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'stages_id_seq') THEN
        ALTER SEQUENCE public.stages_id_seq OWNED BY public.stages.id;
    END IF;
END $$;

--
-- Set default values for sequences
--

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stage_characters' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.stage_characters ALTER COLUMN id SET DEFAULT nextval('public.stage_characters_id_seq'::regclass);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stage_prerequisites' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.stage_prerequisites ALTER COLUMN id SET DEFAULT nextval('public.stage_prerequisites_id_seq'::regclass);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stages' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.stages ALTER COLUMN id SET DEFAULT nextval('public.stages_id_seq'::regclass);
    END IF;
END $$;

--
-- Data insertion with conflict resolution
--

-- Course data
INSERT INTO public."Course" (id, title, description, "coverImage", "isActive", "createAt", level, "estimatedTime") 
VALUES 
('ba3fd565-dc81-4e74-b253-ef0a4074f8cf', 'Solar System', 'Planets in our universe we call Solar System and it is base knowledge of astronomy', NULL, true, '2025-10-03 05:41:02.833', 'Fundamental', 45),
('4db710de-f734-4c7e-bf5f-a5645847b5bc', 'Earth Structure', 'In our planet that call "Earth" have structure that we going to find out', NULL, true, '2025-10-07 07:15:17.159', 'Fundamental', 50)
;

-- CourseLesson data
INSERT INTO public."CourseLesson" (id, "courseId", title, "createdAt", "estimatedTime", "updatedAt")
VALUES 
('f23f104f-3690-4ca8-a3fc-dfbec284e9ae', 'ba3fd565-dc81-4e74-b253-ef0a4074f8cf', 'Introduction to Solar System', '2025-10-03 05:49:18.803', 15, '2025-10-03 05:49:18.803'),
('a1b2c3d4-5678-9abc-def0-1234567890ab', 'ba3fd565-dc81-4e74-b253-ef0a4074f8cf', 'The Eight Planets', '2025-10-03 05:49:18.803', 20, '2025-10-03 05:49:18.803'),
('b2c3d4e5-6789-abcd-ef01-234567890abc', 'ba3fd565-dc81-4e74-b253-ef0a4074f8cf', 'Special Features of Planets', '2025-10-03 05:49:18.803', 10, '2025-10-03 05:49:18.803'),
('c3d4e5f6-789a-bcde-f012-34567890abcd', '4db710de-f734-4c7e-bf5f-a5645847b5bc', 'Earth Layers', '2025-10-03 05:49:18.803', 15, '2025-10-03 05:49:18.803'),
('d4e5f6g7-89ab-cdef-0123-4567890abcde', '4db710de-f734-4c7e-bf5f-a5645847b5bc', 'Atmosphere', '2025-10-03 05:49:18.803', 15, '2025-10-03 05:49:18.803'),
('e5f6g7h8-9abc-def0-1234-567890abcdef', '4db710de-f734-4c7e-bf5f-a5645847b5bc', 'Magnetic Field', '2025-10-03 05:49:18.803', 10, '2025-10-03 05:49:18.803')
;

-- Stages data (ต้องมาก่อน Questions และ Stage Characters)
INSERT INTO public.stages (id, title, description, thumbnail, difficulty, "estimatedTime", "totalStars", "xpReward", "streakBonus", "healthSystem", rewards, "maxStars", "requiredStarsToUnlockNext", "createdAt", "updatedAt")
VALUES 
(1, 'การรู้จักระบบสุริยะ - Multiple Choice Challenge', 'เรียนรู้พื้นฐานของระบบสุริยะด้วยคำถามปรนัย', '☀️', 'Easy', '15 นาที', 3, 50, true, true, '{"xp": 50, "gems": 5, "stars": 3, "badges": ["multiple-choice-master"], "points": 100, "unlocksStages": [2], "achievementUnlocks": ["first-steps"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(2, 'ดาวเคราะห์ในระบบภายใน - Drag & Drop Challenge', 'สำรวจดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ด้วยการลากและวาง', '🌍', 'Easy', '20 นาที', 3, 75, true, true, '{"xp": 75, "gems": 8, "stars": 3, "badges": ["drag-drop-master"], "points": 150, "unlocksStages": [3], "achievementUnlocks": ["planet-discoverer"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(3, 'ดาวเคราะห์ในระบบภายนอก - Fill in the Blanks', 'ค้นพบดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน ด้วยการเติมคำ', '🪐', 'Medium', '25 นาที', 3, 100, true, true, '{"xp": 100, "gems": 10, "stars": 3, "badges": ["fill-blank-master"], "points": 200, "unlocksStages": [4], "achievementUnlocks": ["outer-planet-explorer"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(4, 'ดวงจันทร์และดาวเทียม - Matching Challenge', 'เรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมของดาวเคราะห์ด้วยการจับคู่', '🌙', 'Medium', '30 นาที', 3, 125, true, true, '{"xp": 125, "gems": 12, "stars": 3, "badges": ["matching-master"], "points": 250, "unlocksStages": [5], "achievementUnlocks": ["satellite-specialist"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(5, 'ดาวหางและดาวเคราะห์น้อย - True or False Challenge', 'สำรวจดาวหาง ดาวตก และดาวเคราะห์น้อยในระบบสุริยะ ด้วยคำถามจริง-เท็จ', '☄️', 'Hard', '35 นาที', 3, 150, true, true, '{"xp": 150, "gems": 20, "stars": 3, "badges": ["true-false-master", "solar-system-complete"], "points": 300, "unlocksStages": [], "achievementUnlocks": ["astronomy-expert", "space-explorer-elite"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701')
;

-- CourseDetail data
INSERT INTO public."CourseDetail" (id, "courseLessonId", "ImageUrl", content, "createdAt", required, score, type, "updatedAt")
VALUES 
('cc4ec466-4f4e-4e13-9f52-b1cec240bc31', 'f23f104f-3690-4ca8-a3fc-dfbec284e9ae', '/images/solar-system-overview.jpg', '{"text": "ระบบสุริยะ หรือ ระบบดาวอาทิตย์ คือระบบที่ประกอบด้วยดาวอาทิตย์และวัตถุท้องฟ้าต่างๆ ที่โคจรรอบดาวอาทิตย์ ซึ่งรวมถึงดาวเคราะห์ 8 ดวง ดาวเคราะห์แคระ ดาวเคราะห์น้อย และอุกกาบาต"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('dd5fd577-5f5f-5f24-a963-c2ded351cd42', 'f23f104f-3690-4ca8-a3fc-dfbec284e9ae', '', '{"text": "ดาวอาทิตย์เป็นดาวฤกษ์ที่อยู่ใจกลางของระบบสุริยะ มีมวลมากที่สุดในระบบ คิดเป็นประมาณ 99.86% ของมวลทั้งหมดในระบบสุริยะ"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('ee6fe688-6f6f-6f35-ba74-d3efe462de53', 'a1b2c3d4-5678-9abc-def0-1234567890ab', '/images/inner-planets.jpg', '{"text": "ในระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง แบ่งออกเป็น 2 กลุ่มหลัก คือ ดาวเคราะห์ในระบบภายใน (Inner Planets) และดาวเคราะห์ในระบบภายนอก (Outer Planets)"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('ff7ff799-7f7f-7f46-cb85-e4fff573ef64', 'a1b2c3d4-5678-9abc-def0-1234567890ab', '', '{"text": "ดาวเคราะห์ในระบบภายใน ได้แก่ ดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ซึ่งเป็นดาวเคราะห์หิน"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('gg8gg8aa-8f8f-8f57-dc96-f5fff684ff75', 'a1b2c3d4-5678-9abc-def0-1234567890ab', '', '{"text": "ดาวเคราะห์ในระบบภายนอก ได้แก่ ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน ซึ่งเป็นดาวเคราะห์แก๊ส"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('hh9hh9bb-9f9f-9f68-ed97-f6fff795ff86', 'b2c3d4e5-6789-abcd-ef01-234567890abc', '', '{"text": "แต่ละดาวเคราะห์มีคุณสมบัติพิเศษที่แตกต่างกัน เช่น ดาวเสาร์มีวงแหวน ดาวพฤหัสบดีมีจุดแดงใหญ่ และดาวยูเรนัสหมุนตะแคงข้าง"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('ii0ii0cc-0f0f-0f79-fe08-f7fff806ff97', 'b2c3d4e5-6789-abcd-ef01-234567890abc', '', '{"text": "ดาวเคราะห์แต่ละดวงมีขนาดและระยะห่างจากดวงอาทิตย์ที่แตกต่างกัน ซึ่งส่งผลต่ออุณหภูมิและสภาพแวดล้อมของแต่ละดาว"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('jj1jj1dd-1f1f-1f8a-ff19-f8fff917ffa8', 'c3d4e5f6-789a-bcde-f012-34567890abcd', '/images/earth-layers.jpg', '{"text": "โลกของเรามีโครงสร้างภายในที่แบ่งออกเป็น 4 ชั้นหลัก คือ เปลือกโลก เนื้อโลก แกนกลางชั้นนอก และแกนกลางชั้นใน"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('kk2kk2ee-2f2f-2f9b-ff2a-f9fff028ffb9', 'c3d4e5f6-789a-bcde-f012-34567890abcd', '', '{"text": "เปลือกโลกมีความหนาประมาณ 5-70 กิโลเมตร เนื้อโลกมีความหนาประมาณ 2,900 กิโลเมตร และแกนกลางมีรัศมีประมาณ 3,500 กิโลเมตร"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('ll3ll3ff-3f3f-3fac-ff3b-faff139ffca', 'd4e5f6g7-89ab-cdef-0123-4567890abcde', '', '{"text": "ชั้นบรรยากาศของโลกแบ่งออกเป็น 5 ชั้น คือ โทรโปสเฟียร์ สตราโตสเฟียร์ มีโซสเฟียร์ เทอร์โมสเฟียร์ และเอ็กโซสเฟียร์"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('mm4mm4gg-4f4f-4fbd-ff4c-fbff24affdb', 'd4e5f6g7-89ab-cdef-0123-4567890abcde', '', '{"text": "ชั้นบรรยากาศแต่ละชั้นมีคุณสมบัติและหน้าที่ที่แตกต่างกัน เช่น โทรโปสเฟียร์เป็นที่เกิดสภาพอากาศ สตราโตสเฟียร์มีชั้นโอโซน"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('nn5nn5hh-5f5f-5fce-ff5d-fcff35bffec', 'e5f6g7h8-9abc-def0-1234-567890abcdef', '', '{"text": "สนามแม่เหล็กโลกเกิดจากการเคลื่อนไหวของเหล็กเหลวในแกนกลางชั้นนอก ทำหน้าที่ปกป้องโลกจากรังสีอันตรายจากอวกาศ"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731'),
('oo6oo6ii-6f6f-6fdf-ff6e-fdff46cfffd', 'e5f6g7h8-9abc-def0-1234-567890abcdef', '', '{"text": "สนามแม่เหล็กโลกมีขั้วเหนือและขั้วใต้ ซึ่งไม่ตรงกับขั้วทางภูมิศาสตร์ และสามารถเปลี่ยนขั้วได้ในอนาคต"}', '2025-10-03 05:54:17.731', false, 2, 'text', '2025-10-03 05:54:17.731')
;

-- CourseQuiz data
INSERT INTO public."CourseQuiz" (id, "courseDetailId", title, type, instruction, "maxAttempts", "passingScore", "timeLimite", difficulty, data, point, feedback, "createdAt", "updatedAt")
VALUES 
('67cbff29-1479-417f-8797-5157e3efe2ed', 'cc4ec466-4f4e-4e13-9f52-b1cec240bc31', 'ทดสอบความรู้เบื้องต้น', 'multiple-choice', 'เลือกคำตอบที่ถูกต้องที่สุด', 3, 10, 0, 'Easy', '{"options": ["7 ดวง", "8 ดวง", "9 ดวง", "10 ดวง"], "question": "ระบบสุริยะประกอบด้วยดาวเคราะห์ทั้งหมดกี่ดวง?", "explanation": "ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง หลังจากที่ดาวพลูโตถูกจัดประเภทเป็นดาวเคราะห์แคระในปี 2006", "correctAnswer": 1}', 0, '{"hint": "คิดถึงดาวเคราะห์ตั้งแต่ดาวพุธไปจนถึงดาวเนปจูน ลองนับดูสิ", "correct": "เยี่ยม! คุณจำได้ถูกต้องว่าระบบสุริยะมีดาวเคราะห์ 8 ดวง", "incorrect": "ไม่ถูกต้อง ระบบสุริยะมีดาวเคราะห์ 8 ดวง หลังจากที่ดาวพลูโตถูกจัดเป็นดาวเคราะห์แคระ"}', '2025-10-03 06:13:50.583', '2025-10-03 06:13:50.583'),
('f4cc81d2-f1b1-4505-9a18-f6158bac4bce', 'dd5fd577-5f5f-5f24-a963-c2ded351cd42', 'เติมคำในช่องว่าง', 'fill-blanks', 'เลือกคำที่เหมาะสมมาเติมในช่องว่าง', 3, 15, 60, 'Medium', '{"sentence": "ดาวอาทิตย์เป็น {blank} ที่อยู่ใจกลางของระบบสุริยะ และมีมวลคิดเป็นประมาณ {blank} ของมวลทั้งหมดในระบบ", "options": ["ดาวฤกษ์", "ดาวเคราะห์", "99.86%", "50%", "ดาวเทียม", "75%"], "correctAnswers": ["ดาวฤกษ์", "99.86%"]}', 15, '{"correct": "ถูกต้อง! ดาวอาทิตย์เป็นดาวฤกษ์และมีมวลมากถึง 99.86% ของระบบ", "incorrect": "ลองใหม่อีกครั้ง คิดถึงประเภทของดาวอาทิตย์และสัดส่วนมวลของมัน", "hint": "ดาวอาทิตย์เป็นดาวที่ส่องแสงได้เอง และมีมวลมากกว่า 99% ของระบบสุริยะ"}', '2025-10-03 06:14:03.979', '2025-10-03 06:14:03.979'),
('f0b0f1e0-616b-45eb-a714-0f55cb24625c', 'ee6fe688-6f6f-6f35-ba74-d3efe462de53', 'จับคู่ดาวเคราะห์กับคุณสมบัติ', 'matching', 'คลิกเพื่อจับคู่ดาวเคราะห์กับคุณสมบัติที่ถูกต้อง', 2, 16, 120, 'Medium', '{"pairs": [{"left": "ดาวพุธ", "right": "ใกล้ดวงอาทิตย์ที่สุด", "explanation": "ดาวพุธอยู่ใกล้ดวงอาทิตย์ที่สุด ห่างเพียง 58 ล้านกิโลเมตร"}, {"left": "ดาวศุกร์", "right": "ร้อนที่สุดในระบบสุริยะ", "explanation": "ดาวศุกร์ร้อนที่สุดเนื่องจากมีชั้นบรรยากาศหนาทึบ"}, {"left": "โลก", "right": "มีสิ่งมีชีวิตอาศัยอยู่", "explanation": "โลกเป็นดาวเคราะห์เดียวที่ทราบว่ามีสิ่งมีชีวิต"}, {"left": "ดาวอังคาร", "right": "มีสีแดงจากสนิมเหล็ก", "explanation": "ดาวอังคารมีสีแดงเพราะพื้นผิวมีสนิมเหล็ก (Iron Oxide)"}]}', 20, '{"correct": "เยี่ยมมาก! คุณจับคู่ดาวเคราะห์กับคุณสมบัติได้ถูกต้องทั้งหมด", "incorrect": "ลองดูใหม่อีกครั้ง คิดถึงคุณสมบัติเด่นของแต่ละดาวเคราะห์", "hint": "ดาวพุธใกล้ดวงอาทิตย์ ดาวศุกร์ร้อน โลกมีชีวิต ดาวอังคารสีแดง"}', '2025-10-03 06:14:11.08', '2025-10-03 06:14:11.08'),
('aa1aa1bb-1a1a-1a1a-aa1a-a1aaa1a1a1a1', 'ff7ff799-7f7f-7f46-cb85-e4fff573ef64', 'เรียงลำดับดาวเคราะห์ภายใน', 'sentence-ordering', 'เรียงลำดับดาวเคราะห์ภายในจากใกล้ดวงอาทิตย์ที่สุดไปไกลที่สุด', 2, 12, 60, 'Hard', '{"instruction": "เรียงลำดับดาวเคราะห์ภายในจากใกล้ไปไกล", "sentences": ["ดาวพุธ", "ดาวศุกร์", "โลก", "ดาวอังคาร"], "correctOrder": [0, 1, 2, 3]}', 15, '{"correct": "ถูกต้อง! ลำดับดาวเคราะห์ภายในคือ พุธ ศุกร์ โลก อังคาร", "incorrect": "ไม่ถูกต้อง ลองนึกถึงระยะห่างจากดวงอาทิตย์อีกครั้ง", "hint": "เริ่มจากดาวที่ใกล้ดวงอาทิตย์ที่สุด (พุธ) แล้วออกไปเรื่อยๆ"}', '2025-10-03 06:14:11.08', '2025-10-03 06:14:11.08'),
('bb2bb2cc-2b2b-2b2b-bb2b-b2bbb2b2b2b2', 'gg8gg8aa-8f8f-8f57-dc96-f5fff684ff75', 'ถูกหรือผิด: ดาวเคราะห์แก๊ส', 'true-false', 'พิจารณาข้อความต่อไปนี้ว่าถูกหรือผิด', 2, 10, 30, 'Medium', '{"statement": "ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะและมีแรงโน้มถ่วงมากกว่าโลกหลายเท่า", "correctAnswer": true, "explanation": "ถูกต้อง! ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุด มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกัน และแรงโน้มถ่วงมากกว่าโลกประมาณ 2.5 เท่า"}', 10, '{"correct": "ถูกต้อง! ดาวพฤหัสบดีใหญ่และหนักมากจริงๆ", "incorrect": "ไม่ถูกต้อง ดาวพฤหัสบดีเป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะ", "hint": "ดาวพฤหัสบดีเป็น \"ยักษ์ใหญ่\" ของระบบสุริยะ"}', '2025-10-03 06:14:11.08', '2025-10-03 06:14:11.08'),
('cc3cc3dd-3c3c-3c3c-cc3c-c3ccc3c3c3c3', 'hh9hh9bb-9f9f-9f68-ed97-f6fff795ff86', 'จำแนกดาวเคราะห์จากคุณลักษณะ', 'image-identification', 'ดูรูปภาพและเลือกดาวเคราะห์ที่ตรงกัน', 2, 12, 45, 'Hard', '{"image": "ดาวเคราะห์ที่มีวงแหวนสวยงามล้อมรอบ", "question": "ดาวเคราะห์ในภาพคือดาวใด?", "options": ["ดาวพฤหัสบดี", "ดาวเสาร์", "ดาวยูเรนัส", "ดาวเนปจูน"], "correctAnswer": 1, "explanation": "ดาวเสาร์เป็นดาวเคราะห์ที่มีวงแหวนที่เห็นได้ชัดเจนและสวยงามที่สุด"}', 15, '{"correct": "ถูกต้อง! ดาวเสาร์มีวงแหวนที่สวยงามและโดดเด่นที่สุด", "incorrect": "ไม่ถูกต้อง วงแหวนที่เห็นได้ชัดเจนนี้เป็นของดาวเสาร์", "hint": "ดาวเคราะห์ที่มีวงแหวนสวยงามที่มองเห็นได้ง่ายที่สุดคือ?"}', '2025-10-03 06:14:11.08', '2025-10-03 06:14:11.08'),
('dd4dd4ee-4d4d-4d4d-dd4d-d4ddd4d4d4d4', 'ii0ii0cc-0f0f-0f79-fe08-f7fff806ff97', 'ทายขนาดดาวเคราะห์', 'range-answer', 'ทายขนาดเส้นผ่านศูนย์กลางของโลกเป็นกิโลเมตร', 1, 15, 30, 'Medium', '{"question": "โลกมีเส้นผ่านศูนย์กลางประมาณกี่กิโลเมตร?", "min": 10000, "max": 15000, "correctAnswer": 12742, "tolerance": 500, "unit": "กิโลเมตร", "explanation": "โลกมีเส้นผ่านศูนย์กลางประมาณ 12,742 กิโลเมตร"}', 20, '{"correct": "เยี่ยม! คุณทายขนาดของโลกได้ใกล้เคียงมาก", "incorrect": "ไม่ถูกต้อง โลกมีเส้นผ่านศูนย์กลางประมาณ 12,742 กิโลเมตร"}', '2025-10-03 06:14:11.08', '2025-10-03 06:14:11.08')
;

-- User data
INSERT INTO public."User" (id, email, name, "createAt", password)
VALUES 
('e03b75d7-0c24-49f2-8837-cf7d04094703', 'test8392@test.com', 'Sigco', '2025-10-07 07:05:26.747', '$2b$10$lM1t1MZV6hrkZTHZhT7XIunSJ8PfNSMmeXDeoeaTnLHb185Uywk/W')
;

-- Prisma migrations data
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES 
('5382a5c5-c883-4a38-9cfc-379353c5ec8d', 'ed7c5b271fa4fb5393b5b8aa6bd6be1f22b17c82a98b0a0cbf7a20e9152b14cf', '2025-10-03 04:04:27.515461+00', '20250624042323_init', NULL, NULL, '2025-10-03 04:04:27.467141+00', 1),
('44f0e2d2-3391-409f-bda6-43bc19cdd4df', 'b3e628c2ca526ae0ee01c013d409ce47c86422a6d7c59166be29658314f5d5df', '2025-10-03 04:04:27.621465+00', '20250625151033_init', NULL, NULL, '2025-10-03 04:04:27.519983+00', 1),
('0dc1bae3-5003-483e-9566-428751040df6', '12d58b41576c7780de5ac98ecdd34b07f1e3826e8d6bf9cd155dcf557edf37c3', '2025-10-07 07:27:30.848793+00', '20251007072730_fix_medium_to_medium_in_enum_difficulty', NULL, NULL, '2025-10-07 07:27:30.708301+00', 1),
('d91b074a-7980-4328-bd02-a1b9107d7669', '7b11a56f1ed16c6c90858bbd7dcac31d4cf2b56d0dadebf61148f731b3b7d521', '2025-10-03 04:04:27.641014+00', '20250625155046_init', NULL, NULL, '2025-10-03 04:04:27.626209+00', 1),
('e74ed88d-9b25-4677-87d3-f9832428d3ce', '1309bc6ad5ffe42d21398e32dffb582e177680e67a091e6c42b519d4ecce10dc', '2025-10-03 04:04:27.667093+00', '20250626052043_init', NULL, NULL, '2025-10-03 04:04:27.645801+00', 1),
('1ef1af56-d970-46c2-be63-0f4e4c1fbd97', '80912fae2ab0781e85be05bb0f7c998fba83fe4db5682959de0fc2de863bc27d', '2025-10-03 04:04:27.686832+00', '20250627092158_init', NULL, NULL, '2025-10-03 04:04:27.672161+00', 1),
('a5194257-834b-48a0-bf21-be2bd5c3d2c9', 'd3c6e746da88cbafc885e57661068d7f4cbed2709898c08c721732fb0399c89b', '2025-10-03 04:04:27.708899+00', '20250701181028_init', NULL, NULL, '2025-10-03 04:04:27.691986+00', 1),
('c1aedb2a-839a-4cc4-8168-272b7aa7195b', '1831f85a22deee04391575673240e9573f5740907b81fa5b6b25682577854b43', '2025-10-03 04:04:27.729655+00', '20250701181208_init', NULL, NULL, '2025-10-03 04:04:27.713575+00', 1),
('670755a4-9451-4ae4-9487-dfcc3a40dc31', 'a40eb1ddac96fc401af5884fb96ad4407f9e0d98d7e38dbef224bc12e7dab849', '2025-10-03 04:04:27.750942+00', '20250701182711_init', NULL, NULL, '2025-10-03 04:04:27.735692+00', 1),
('a74ac029-c11e-4494-8941-500e1c51fd65', '45d732510b8bce18f4e42ee47e8db874251b0c09ed21a43f911832fc5693ff67', '2025-10-03 04:04:27.856983+00', '20250718032701_init', NULL, NULL, '2025-10-03 04:04:27.756014+00', 1),
('3318bcea-49da-41ff-86ef-163bae50e147', '909a083d735bdc7fb3214745a746b6a4022f5d9ae5a86de0c0b017b839c00dc5', '2025-10-03 04:04:27.909982+00', '20250730043016_init', NULL, NULL, '2025-10-03 04:04:27.862835+00', 1),
('cc4904da-c71b-4486-9e72-30b00067b072', 'a9ab12337a345505b8b32d6d2153cf223abfa58c034244ad749f4c4da8266e68', '2025-10-03 04:04:27.931073+00', '20250801043727_init', NULL, NULL, '2025-10-03 04:04:27.915735+00', 1),
('3e1641af-b5ad-4db4-8fa5-85a4252350b3', 'ad971ba1554788f66e11897376d0f6d464e396a786d2efbb65206ff5d40df329', '2025-10-03 04:05:00.430973+00', '20251003040500_new_version_of_db', NULL, NULL, '2025-10-03 04:05:00.130645+00', 1),
('554d51c6-8603-422f-9d50-bad038a97c00', '86d634312dc36a7e5ed19a8561b0d259b37aed472583b099611ea89eeca54176', '2025-10-03 04:34:45.565051+00', '20251003043445_update_dalete_on_cascade', NULL, NULL, '2025-10-03 04:34:45.542748+00', 1),
('b8022987-256c-4694-bff0-88a65c7a1a9e', '57b76d3d7fab763d8f39998a14ca5e461461ae12b00b3784659bedf042ab12b3', '2025-10-07 07:08:40.800242+00', '20251007070840_fix_question_model', NULL, NULL, '2025-10-07 07:08:40.77465+00', 1)
;

-- Questions data
INSERT INTO public.questions (id, "stageId", "order", type, question, difficulty, points, "timeLimit", payload, "createdAt", "updatedAt", explanation, "funFact")
VALUES 
(1, 1, 1, 'MULTIPLE_CHOICE', 'ระบบสุริยะมีดาวเคราะห์กี่ดวง?', 'Easy', 10, 30, '[{"id": 1, "text": "7 ดวง", "emoji": "7️⃣", "isCorrect": false}, {"id": 2, "text": "8 ดวง", "emoji": "8️⃣", "isCorrect": true}, {"id": 3, "text": "9 ดวง", "emoji": "9️⃣", "isCorrect": false}, {"id": 4, "text": "10 ดวง", "emoji": "🔢", "isCorrect": false}]', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668', '🎉 ถูกต้อง! ระบบสุริยะมีดาวเคราะห์ 8 ดวง: พุธ ศุกร์ โลก อังคาร พฤหัสบดี เสาร์ ยูเรนัส เนปจูน', '💡 ดาวพลูโตเคยเป็นดาวเคราะห์ดวงที่ 9 แต่ปี 2006 ถูกจัดเป็นดาวเคราะห์แคระ!'),
(2, 1, 2, 'MULTIPLE_CHOICE', 'ดาวเคราะห์ดวงใดที่ร้อนที่สุด?', 'Medium', 15, 25, '[{"id": 1, "text": "ดาวพุธ", "emoji": "☿️", "isCorrect": false}, {"id": 2, "text": "ดาวศุกร์", "emoji": "♀️", "isCorrect": true}, {"id": 3, "text": "โลก", "emoji": "🌍", "isCorrect": false}, {"id": 4, "text": "ดาวอังคาร", "emoji": "♂️", "isCorrect": false}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🔥 ถูกต้อง! ดาวศุกร์ร้อนที่สุดเพราะมีเรือนกระจกธรรมชาติ', '🌋 ดาวศุกร์ร้อนถึง 470°C หลอมตะกั่วได้!'),
(3, 1, 3, 'MULTIPLE_CHOICE', 'ดาวเคราะห์ดวงใดที่มีวงแหวนสวยงามที่สุด?', 'Easy', 10, 20, '[{"id": 1, "text": "ดาวพฤหัสบดี", "emoji": "🪐", "isCorrect": false}, {"id": 2, "text": "ดาวเสาร์", "emoji": "🪐", "isCorrect": true}, {"id": 3, "text": "ดาวยูเรนัส", "emoji": "🌀", "isCorrect": false}, {"id": 4, "text": "ดาวเนปจูน", "emoji": "🌊", "isCorrect": false}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '💎 เยี่ยม! ดาวเสาร์มีวงแหวนที่สวยงามและมองเห็นได้ชัดจากโลก', '✨ วงแหวนของดาวเสาร์กว้าง 282,000 กิโลเมตร แต่หนาเพียง 1 กิโลเมตร!'),
(4, 1, 4, 'MULTIPLE_CHOICE', 'โลกเป็นดาวเคราะห์ลำดับที่เท่าไหร่จากดวงอาทิตย์?', 'Easy', 10, 15, '[{"id": 1, "text": "ลำดับที่ 2", "emoji": "2️⃣", "isCorrect": false}, {"id": 2, "text": "ลำดับที่ 3", "emoji": "3️⃣", "isCorrect": true}, {"id": 3, "text": "ลำดับที่ 4", "emoji": "4️⃣", "isCorrect": false}, {"id": 4, "text": "ลำดับที่ 5", "emoji": "5️⃣", "isCorrect": false}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🎯 ถูกต้อง! โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดวงอาทิตย์ อยู่ในโซนที่เหมาะกับการมีชีวิต', '🌱 โลกอยู่ใน "Goldilocks Zone" ที่มีอุณหภูมิพอดีสำหรับน้ำเหลว!'),
(5, 1, 5, 'MULTIPLE_CHOICE', 'ดาวเคราะห์ดวงใดที่เรียกว่า "ดาวเคราะห์สีแดง"?', 'Easy', 10, 20, '[{"id": 1, "text": "ดาวศุกร์", "emoji": "♀️", "isCorrect": false}, {"id": 2, "text": "ดาวอังคาร", "emoji": "♂️", "isCorrect": true}, {"id": 3, "text": "ดาวพฤหัสบดี", "emoji": "🪐", "isCorrect": false}, {"id": 4, "text": "ดาวเสาร์", "emoji": "🪐", "isCorrect": false}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '⚔️ สุดยอด! ดาวอังคารเรียกว่า "Red Planet" เพราะพื้นผิวเต็มไปด้วยสนิมเหล็ก', '🌪️ ดาวอังคารมีพายุฝุ่นที่ใหญ่ที่สุดและสามารถครอบคลุมดาวเคราะห์ทั้งดวง!'),
(6, 2, 1, 'DRAG_DROP', 'เรียงลำดับดาวเคราะห์ในระบบภายในจากใกล้ดวงอาทิตย์ที่สุด', 'Easy', 20, 45, '[{"dragItems": [{"id": "mercury", "text": "ดาวพุธ", "emoji": "☿️", "correctPosition": 1}, {"id": "venus", "text": "ดาวศุกร์", "emoji": "♀️", "correctPosition": 2}, {"id": "earth", "text": "โลก", "emoji": "🌍", "correctPosition": 3}, {"id": "mars", "text": "ดาวอังคาร", "emoji": "♂️", "correctPosition": 4}], "dropZones": [{"id": 1, "label": "ใกล้ที่สุด"}, {"id": 2, "label": "ที่ 2"}, {"id": 3, "label": "ที่ 3"}, {"id": 4, "label": "ไกลที่สุด"}]}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', 'ลำดับดาวเคราะห์ในระบบภายใน: ดาวพุธ → ดาวศุกร์ → โลก → ดาวอังคาร', '🌟 ดาวเคราะห์ในระบบภายในเรียกอีกชื่อว่า "ดาวเคราะห์หิน" เพราะมีพื้นผิวแข็ง!'),
(7, 2, 2, 'DRAG_DROP', 'จับคู่ดาวเคราะห์กับคุณสมบัติเด่น', 'Medium', 25, 60, '[{"dragItems": [{"id": "mercury-small", "text": "เล็กที่สุด", "emoji": "🤏", "correctPosition": 1}, {"id": "venus-hot", "text": "ร้อนที่สุด", "emoji": "🔥", "correctPosition": 2}, {"id": "earth-life", "text": "มีสิ่งมีชีวิต", "emoji": "🌱", "correctPosition": 3}, {"id": "mars-red", "text": "สีแดง", "emoji": "🔴", "correctPosition": 4}], "dropZones": [{"id": 1, "label": "ดาวพุธ ☿️"}, {"id": 2, "label": "ดาวศุกร์ ♀️"}, {"id": 3, "label": "โลก 🌍"}, {"id": 4, "label": "ดาวอังคาร ♂️"}]}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', 'แต่ละดาวเคราะห์ในระบบภายในมีลักษณะเฉพาะที่แตกต่างกัน', '✨ ดาวพุธมีแกนหมุนที่เอียงน้อยที่สุด ทำให้ไม่มีฤดูกาล!'),
(8, 3, 1, 'FILL_BLANK', 'ดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะคือ ___________', 'Easy', 15, 25, '{"correctAnswer": "ดาวพฤหัสบดี", "alternatives": ["พฤหัสบดี", "Jupiter", "jupiter"], "placeholder": "พิมพ์ชื่อดาวยักษ์...", "hints": ["🪐 เป็นดาวเคราะห์แก๊สยักษ์ที่มีพายุอันโด่งดัง", "⚡ มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกัน"]}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🎉 ยอดเยี่ยม! ดาวพฤหัสบดี (Jupiter) คือราชาแห่งดาวเคราะห์!', '🤯 ดาวพฤหัสบดีใหญ่มากจนสามารถใส่โลกได้มากกว่า 1,300 ดวง!'),
(9, 3, 2, 'FILL_BLANK', 'ดาวเคราะห์ที่มีวงแหวนสวยงามที่สุดคือ ___________', 'Easy', 15, 20, '{"correctAnswer": "ดาวเสาร์", "alternatives": ["เสาร์", "Saturn", "saturn"], "placeholder": "พิมพ์ชื่อดาวแห่งวงแหวน...", "hints": ["💍 มีวงแหวนที่มองเห็นได้ชัดจากโลก", "💎 เรียกว่า \"อัญมณีแห่งระบบสุริยะ\""]}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '💍 สุดยอด! ดาวเสาร์ (Saturn) คือ "อัญมณีแห่งระบบสุริยะ"', '✨ วงแหวนประกอบด้วยน้ำแข็ง หิน และฝุ่นนับพันล้านชิ้น!'),
(10, 3, 3, 'FILL_BLANK', 'ดาวเคราะห์ที่หมุนข้างแบบไม่เหมือนใครคือ ___________', 'Hard', 20, 30, '{"correctAnswer": "ดาวยูเรนัส", "alternatives": ["ยูเรนัส", "Uranus", "uranus"], "placeholder": "พิมพ์ชื่อดาวนักกายกรรม...", "hints": ["🧊 เป็นดาวเคราะห์น้ำแข็งที่มีสีฟ้าปริศนา", "🤸 หมุนแกนเอียง 98 องศา"]}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🎯 ยอดเยี่ยม! ดาวยูเรนัส (Uranus) เป็น "นักกายกรรมแห่งอวกาศ"!', '🌀 เอียงมากจนฤดูกาลหนึ่งฤดูยาวนาน 21 ปีโลก!'),
(11, 4, 1, 'MATCH_PAIRS', 'จับคู่ดาวเทียมกับดาวเคราะห์เจ้าของ', 'Medium', 25, 60, '[{"pairs": [{"left": {"id": "moon", "text": "ดวงจันทร์", "emoji": "🌙"}, "right": {"id": "earth", "text": "โลก", "emoji": "🌍"}}, {"left": {"id": "titan", "text": "ไททัน", "emoji": "🌫️"}, "right": {"id": "saturn", "text": "ดาวเสาร์", "emoji": "🪐"}}, {"left": {"id": "europa", "text": "ยูโรปา", "emoji": "🧊"}, "right": {"id": "jupiter", "text": "ดาวพฤหัสบดี", "emoji": "🪐"}}, {"left": {"id": "phobos", "text": "โฟบอส", "emoji": "🌑"}, "right": {"id": "mars", "text": "ดาวอังคาร", "emoji": "♂️"}}]}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', 'แต่ละดาวเคราะห์มีดาวเทียมที่โดดเด่นและมีคุณสมบัติพิเศษ', '🛰️ ไททัน เป็นดาวเทียมเดียวที่มีบรรยากาศหนาแน่นและทะเลสาบของไฮโดรคาร์บอน!'),
(12, 4, 2, 'MATCH_PAIRS', 'จับคู่ดาวเทียมกับลักษณะเด่น', 'Hard', 30, 75, '[{"pairs": [{"left": {"id": "moon", "text": "ดวงจันทร์", "emoji": "🌙"}, "right": {"id": "tides", "text": "ควบคุมกระแสน้ำ", "emoji": "🌊"}}, {"left": {"id": "io", "text": "ไอโอ", "emoji": "🌋"}, "right": {"id": "volcanoes", "text": "ภูเขาไฟกำมะถัน", "emoji": "🌋"}}, {"left": {"id": "ganymede", "text": "แกนีมีด", "emoji": "🔵"}, "right": {"id": "largest", "text": "ดาวเทียมใหญ่ที่สุด", "emoji": "👑"}}, {"left": {"id": "enceladus", "text": "เอนเซลาดัส", "emoji": "💎"}, "right": {"id": "ice-geysers", "text": "ไกเซอร์น้ำแข็ง", "emoji": "⛲"}}]}]', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', 'ดาวเทียมแต่ละดวงมีความพิเศษและลักษณะที่น่าทึ่งแตกต่างกัน', '💎 เอนเซลาดัสพ่นน้ำแข็งออกมาจากขั้วโลกใต้ บ่งชี้ว่าอาจมีมหาสมุทรใต้พื้นผิว!'),
(13, 5, 1, 'TRUE_FALSE', 'ดาวหางมาจากเมฆออร์ตที่ขอบระบบสุริยะ', 'Hard', 20, 30, '{"correctAnswer": true}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🎯 ถูกต้อง! เมฆออร์ต (Oort Cloud) คือ "ตู้เย็นยักษ์" ของระบบสุริยะ!', '🤯 เมฆออร์ตไกลจากดวงอาทิตย์ถึง 50,000 เท่าของระยะโลก-ดวงอาทิตย์!'),
(14, 5, 2, 'TRUE_FALSE', 'ฝนดาวตกเกิดจากโลกโคจรผ่านเศษซากของดาวหาง', 'Medium', 15, 25, '{"correctAnswer": true}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🎆 ถูกต้อง! ฝนดาวตกคือ "การแสดงแสงไฟธรรมชาติ" ที่เกิดเมื่อโลกโคจรผ่านเศษซาก!', '🌠 ดาวตกพุ่งด้วยความเร็ว 59 กม./วินาที - เร็วกว่าชิ้นกระสุน 150 เท่า!'),
(15, 5, 3, 'TRUE_FALSE', 'เซเรสเป็นดาวเคราะห์แคระที่ใหญ่ที่สุดในเข็มขัดดาวเคราะห์น้อย', 'Hard', 25, 35, '{"correctAnswer": true}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🎉 สุดยอด! เซเรส (Ceres) คือ "ราชินีแห่งเข็มขัดดาวเคราะห์น้อย"!', '💎 เซเรสอาจมีมหาสมุทรใต้ดิน! น้ำเหลวมากกว่าน้ำจืดทั้งหมดบนโลก!'),
(16, 5, 4, 'TRUE_FALSE', 'ดาวเคราะห์น้อยทั้งหมดอยู่ระหว่างดาวอังคารและดาวพฤหัสบดี', 'Medium', 15, 20, '{"correctAnswer": false}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '❌ ไม่ถูกต้อง! ส่วนใหญ่อยู่ในเข็มขัดดาวเคราะห์น้อย แต่มีบางดวงกระจายอยู่ทั่วระบบสุริยะ', '🌌 มีดาวเคราะห์น้อยบางดวงที่มีวงโคจรใกล้โลก เรียกว่า Near-Earth Objects (NEOs)!'),
(17, 5, 5, 'TRUE_FALSE', 'หางดาวหางเกิดจากแรงลมสุริยะ', 'Hard', 20, 30, '{"correctAnswer": true}', '2025-10-07 07:27:53.47', '2025-10-07 07:27:53.47', '🎯 ถูกต้อง! หางดาวหางเกิดจากแรงลมสุริยะ (Solar Wind) ที่พัดเศษน้ำแข็งและแก๊สให้เป็นหาง', '☄️ หางดาวหางมักจะชี้ออกจากดวงอาทิตย์เสมอ ไม่ใช่ตามทิศทางที่เคลื่อนที่!')
;

-- Stage characters data
INSERT INTO public.stage_characters (id, "stageId", name, avatar, introduction, "learningContent", "completionMessage", encouragements, hints, "createdAt", "updatedAt")
VALUES 
(1, 1, 'ซิกโก้', '🚀', '🌟 ยินดีต้อนรับสู่ด่าน Multiple Choice! ทดสอบความรู้พื้นฐานกันเถอะ! 🚀', '🎯 ด่านที่ 1: ทดสอบความรู้พื้นฐานด้วยคำถามแบบเลือกตอบ! 

⭐ เรียนรู้เกี่ยวกับดาวเคราะห์ทั้ง 8 ดวง
🌡️ ทำความเข้าใจอุณหภูมิและสภาพแวดล้อม
💫 จดจำลักษณะเด่นของแต่ละดาว', '🎉 ยอดเยี่ยม! คุณผ่านด่าน Multiple Choice แล้ว!', '["🔥 เจ๋งสุดๆ! คำตอบถูกต้อง! 🌟", "⚡ สุดยอด! พลังสมองเต็มเปี่ยม! 🚀", "💫 ยอดเยี่ยม! คุณคือนักเรียนตัวจริง! 🎯", "🌈 เก่งมาก! ไปต่อได้เลย! 👑"]', '["🤔 ลองนับดูว่ามีกี่ดวงในระบบสุริยะ? ⭐", "☀️ คิดถึงดาวที่ใกล้ดวงอาทิตย์ที่สุด 🏃‍♂️", "🪐 ลองนึกถึงดาวยักษ์ที่มีแรงโน้มถวงมหาศาล 💪"]', '2025-10-07 06:23:12.88', '2025-10-07 06:23:12.88'),
(2, 2, 'ซิกโก้', '🚀', '🎊 ยินดีต้อนรับกลับมา นักสำรวจผู้กล้า! การผจญภัยครั้งนี้จะยิ่งตื่นเต้นกว่าเดิม! 🌟 วันนี้เราจะมาสำรวจ "โลกใกล้บ้าน" 4 ดวงด้วยการลากและวาง! 🤯✨', '🏰 ยินดีต้อนรับสู่ "ย่านใกล้บ้าน" ของเรา! 

🔥 ดาวพุธ - นักวิ่งจอมเร็ว ใกล้ดวงอาทิตย์ที่สุด!
💃 ดาวศุกร์ - เจ้าหญิงแห่งไฟ สวยงามแต่อันตราย!
🏡 โลก - บ้านสวยงามของเรา โอเอซิสแห่งชีวิต!
⚔️ ดาวอังคาร - นักรบสีแดง ที่อาจมีสิ่งมีชีวิต!

🎯 ในด่านนี้คุณจะได้ฝึกการลากและวางเพื่อจัดเรียงข้อมูล!', '🏆 AMAZING! คุณคือนักสำรวจระดับตำนาน! ความรู้เกี่ยวกับดาวเคราะห์ใกล้บ้านครบสมบูรณ์แล้ว! 🌟', '["🔥 พลังระเบิด! คุณเจ๋งสุดขีด! 💥", "⚡ เหนือชั้น! สมองอัจฉริยะเลย! 🧠✨", "🌟 สุดยอด! คุณคือตำนานนักสำรวจ! 🏆", "🚀 ยอดเยี่ยม! พิชิตอวกาศได้แล้ว! 🎯"]', '["🔴 ลองคิดถึงดาวที่มีสีเหมือนเลือด... น่ากลัวมั้ย? 😈", "🔥 ดาวไหนที่มีเรือนกระจกธรรมชาติที่ร้อนสุดๆ? ♨️", "🌍 บ้านเราอยู่ลำดับที่เท่าไหร่นับจากดวงอาทิตย์? 🏠"]', '2025-10-07 06:23:12.88', '2025-10-07 06:23:12.88'),
(3, 3, 'ซิกโก้', '🚀', '🎆 ยินดีต้อนรับสู่การเดินทางที่ยิ่งใหญ่ที่สุด! วันนี้เราจะออกสำรวจ "ดินแดนแห่งยักษ์" ที่ไกลออกไป! 🌌 ด้วยการเติมคำในช่องว่าง!', '🪐 ยินดีต้อนรับสู่ "อาณาจักรแห่งยักษ์"! 

👑 ดาวพฤหัสบดี - จักรพรรดิแห่งระบบสุริยะ มีจุดแดงยักษ์!
💍 ดาวเสาร์ - เจ้าแห่งวงแหวนที่สวยงามล้ำ!
🌀 ดาวยูเรนัส - นักกายกรรมที่หมุนข้าง มีสีฟ้าปริศนา!
🌊 ดาวเนปจูน - จอมลมแรงแห่งขอบระบบ!', '🏆 LEGENDARY! คุณคือนักสำรวจระดับตำนาน! พิชิตดินแดนแห่งยักษ์ได้สำเร็จ! 🌟', '["🔥 ยอดเยี่ยม! เติมคำถูกต้อง! 💪", "⚡ สุดยอด! ความจำแม่นมาก! 🧠", "🌟 เจ๋งสุดๆ! คิดได้เร็วมาก! 🚀", "🎯 เพอร์เฟค! ทักษะการเติมคำยอดเยี่ยม! 👑"]', '["🪐 ลองนึกถึงดาวยักษ์ที่มีแรงโน้มถวงมหาศาล... 💪", "💍 คิดถึงดาวที่มีวงแหวนสวยงามที่สุด... 💎", "🌀 ดาวใดที่หมุนแบบแปลกๆ เอียงข้าง? 🤸"]', '2025-10-07 06:23:12.88', '2025-10-07 06:23:12.88'),
(4, 4, 'ซิกโก้', '🚀', '🌙 ยินดีต้อนรับสู่การผจญภัยใหม่! วันนี้เราจะไปสำรวจ "เพื่อนร่วมทาง" ของดาวเคราะห์! 🛰️', '🌙 ยินดีต้อนรับสู่ "ราชอาณาจักรดาวเทียม"! 

🌍 ดวงจันทร์ - เพื่อนซี้ของโลก ที่ควบคุมคลื่นและเวลา!
🪐 ไททัน - ดาวเทียมลึกลับที่มีทะเลสาบไฮโดรคาร์บอน!
🧊 ยูโรปา - โลกน้ำแข็งที่อาจมีสิ่งมีชีวิตใต้น้ำ!', '🎆 EXCELLENT! คุณคือนักสำรวจดาวเทียมระดับเซียน!', '["🌙 LUNAR POWER! พลังดวงจันทร์! ✨", "🛰️ SATELLITE MASTER! เซียนดาวเทียม! 🎯", "⭐ COSMIC GENIUS! อัจฉริยะแห่งจักรวาล! 💫", "🎆 MOON WALKER! นักเดินดวงจันทร์! 👨‍🚀"]', '["🌙 ลองคิดถึงดวงจันทร์ที่เราเห็นทุกคืน... ใช้เวลาเกือบเดือน! 🗓️", "🪐 ดาวเทียมยักษ์ของดาวพฤหัสบดี... ใหญ่กว่าดาวพุธเสียอีก! 💪", "🌫️ ดาวเทียมที่มีหมอกหนาเหมือนโลกยุคแรก... 🌍"]', '2025-10-07 06:23:12.88', '2025-10-07 06:23:12.88'),
(5, 5, 'ซิกโก้', '🚀', '🎆 CONGRATULATIONS! คุณมาถึงด่านสุดท้ายแล้ว! นี่คือการทดสอบขั้นสุดท้ายเพื่อเป็น "ปรมาจารย์แห่งระบบสุริยะ"! 🌟', '☄️ ยินดีต้อนรับสู่ "โลกแห่งนักเดินทาง"! 

🌠 ดาวหาง - นักเดินทางน้ำแข็งที่มาจากขอบระบบสุริยะ!
✨ ดาวตก - นักแสดงแสงไฟในท้องฟ้ายามค่ำคืน!
🪨 ดาวเคราะห์น้อย - ซากปริศนาจากอดีตอันไกลโพ้น!', '🎆🏆 ULTIMATE ACHIEVEMENT! 🏆🎆

คุณไม่ใช่แค่นักเรียน... คุณคือ "ปรมาจารย์แห่งระบบสุริยะ" แล้ว! 🌟', '["🔥 ULTIMATE POWER! คุณคือตำนาน! ⚡", "🏆 LEGENDARY! ปรมาจารย์แท้จริง! 👑", "💎 PERFECT! เพชรผู้พิชิตอวกาศ! 💫", "👑 CHAMPION! จักรพรรดิแห่งความรู้! 🎆"]', '["🌌 คิดถึงขอบไกลของระบบสุริยะ... หนาวและมืด 🧊", "🪨 ลองนึกถึงดาวเคราะห์แคระที่มีชื่อเสียง... 💫", "🌠 เศษซากจากไหนที่เข้ามาในชั้นบรรยากาศ? 💨"]', '2025-10-07 06:23:12.88', '2025-10-07 06:23:12.88')
;

-- Stages data
INSERT INTO public.stages (id, title, description, thumbnail, difficulty, "estimatedTime", "totalStars", "xpReward", "streakBonus", "healthSystem", rewards, "maxStars", "requiredStarsToUnlockNext", "createdAt", "updatedAt")
VALUES 
(1, 'การรู้จักระบบสุริยะ - Multiple Choice Challenge', 'เรียนรู้พื้นฐานของระบบสุริยะด้วยคำถามปรนัย', '☀️', 'Easy', '15 นาที', 3, 50, true, true, '{"xp": 50, "gems": 5, "stars": 3, "badges": ["multiple-choice-master"], "points": 100, "unlocksStages": [2], "achievementUnlocks": ["first-steps"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(2, 'ดาวเคราะห์ในระบบภายใน - Drag & Drop Challenge', 'สำรวจดาวพุธ ดาวศุกร์ โลก และดาวอังคาร ด้วยการลากและวาง', '🌍', 'Easy', '20 นาที', 3, 75, true, true, '{"xp": 75, "gems": 8, "stars": 3, "badges": ["drag-drop-master"], "points": 150, "unlocksStages": [3], "achievementUnlocks": ["planet-discoverer"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(3, 'ดาวเคราะห์ในระบบภายนอก - Fill in the Blanks', 'ค้นพบดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส และดาวเนปจูน ด้วยการเติมคำ', '🪐', 'Medium', '25 นาที', 3, 100, true, true, '{"xp": 100, "gems": 10, "stars": 3, "badges": ["fill-blank-master"], "points": 200, "unlocksStages": [4], "achievementUnlocks": ["outer-planet-explorer"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(4, 'ดวงจันทร์และดาวเทียม - Matching Challenge', 'เรียนรู้เกี่ยวกับดวงจันทร์และดาวเทียมของดาวเคราะห์ด้วยการจับคู่', '🌙', 'Medium', '30 นาที', 3, 125, true, true, '{"xp": 125, "gems": 12, "stars": 3, "badges": ["matching-master"], "points": 250, "unlocksStages": [5], "achievementUnlocks": ["satellite-specialist"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701'),
(5, 'ดาวหางและดาวเคราะห์น้อย - True or False Challenge', 'สำรวจดาวหาง ดาวตก และดาวเคราะห์น้อยในระบบสุริยะ ด้วยคำถามจริง-เท็จ', '☄️', 'Hard', '35 นาที', 3, 150, true, true, '{"xp": 150, "gems": 20, "stars": 3, "badges": ["true-false-master", "solar-system-complete"], "points": 300, "unlocksStages": [], "achievementUnlocks": ["astronomy-expert", "space-explorer-elite"]}', 3, 0, '2025-10-06 10:25:01.701', '2025-10-06 10:25:01.701')
;

--
-- Stage prerequisites data
INSERT INTO public.stage_prerequisites (id, "stageId", "prerequisiteId", "createdAt")
VALUES 
(1, 2, 1, '2025-10-07 06:23:12.88'),
(2, 3, 2, '2025-10-07 06:23:12.88'),
(3, 4, 3, '2025-10-07 06:23:12.88'),
(4, 5, 4, '2025-10-07 06:23:12.88')
;

-- Mini game questions data
INSERT INTO public.mini_game_questions (id, type, question, difficulty, points, category, "timeBonus", payload, "createdAt", "updatedAt")
VALUES 
('mc-1', 'MULTIPLE_CHOICE', 'ดาวเคราะห์ดวงใดอยู่ใกล้ดวงอาทิตย์ที่สุด?', 'Easy', 10, 'solar-system', 5, '{"options": ["ดาวพุธ", "ดาวศุกร์", "โลก", "ดาวอังคาร"], "correctAnswer": 0, "explanation": "ดาวพุธ (Mercury) เป็นดาวเคราะห์ที่ใกล้ดวงอาทิตย์ที่สุด ห่างเพียง 58 ล้านกิโลเมตร"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('mc-2', 'MULTIPLE_CHOICE', 'ระบบสุริยะมีดาวเคราะห์ทั้งหมดกี่ดวง?', 'Easy', 10, 'solar-system', 5, '{"options": ["7 ดวง", "8 ดวง", "9 ดวง", "10 ดวง"], "correctAnswer": 1, "explanation": "ระบบสุริยะมีดาวเคราะห์ทั้งหมด 8 ดวง หลังจากที่ดาวพลูโตถูกจัดประเภทเป็นดาวเคราะห์แคระในปี 2006"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('mc-3', 'MULTIPLE_CHOICE', 'ดาวเคราะห์ใดที่เรียกว่า "ดาวแดง"?', 'Easy', 10, 'planets', 5, '{"options": ["ดาวพุธ", "ดาวศุกร์", "ดาวอังคาร", "ดาวพฤหัสบดี"], "correctAnswer": 2, "explanation": "ดาวอังคาร (Mars) เรียกว่า \"ดาวแดง\" เนื่องจากพื้นผิวมีสีแดงจากสนิมเหล็ก (Iron Oxide)"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('mc-4', 'MULTIPLE_CHOICE', 'ดาวเคราะห์ใดมีขนาดใหญ่ที่สุดในระบบสุริยะ?', 'Medium', 15, 'planets', 7, '{"options": ["ดาวเสาร์", "ดาวพฤหัสบดี", "ดาวยูเรนัส", "ดาวเนปจูน"], "correctAnswer": 1, "explanation": "ดาวพฤหัสบดี (Jupiter) เป็นดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะ มีมวลมากกว่าดาวเคราะห์อื่นๆ รวมกันทั้งหมด"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('mc-5', 'MULTIPLE_CHOICE', 'ชั้นบรรยากาศของโลกชั้นใดที่มีโอโซน?', 'Medium', 15, 'earth-structure', 7, '{"options": ["โทรโปสเฟียร์", "สตราโตสเฟียร์", "มีโซสเฟียร์", "เทอร์โมสเฟียร์"], "correctAnswer": 1, "explanation": "ชั้นสตราโตสเฟียร์มีชั้นโอโซน (Ozone Layer) ที่ปกป้องโลกจากรังสีอัลตราไวโอเลตจากดวงอาทิตย์"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('mc-6', 'MULTIPLE_CHOICE', 'ดาวเคราะห์ใดที่หมุนรอบแกนในทิศทางตรงข้ามกับดาวเคราะห์อื่นๆ?', 'Hard', 20, 'planets', 10, '{"options": ["ดาวพุธ", "ดาวศุกร์", "ดาวยูเรนัส", "ดาวเนปจูน"], "correctAnswer": 2, "explanation": "ดาวยูเรนัส หมุนรอบแกนในทิศทางตรงข้าม และมีแกนโลกเอียงถึง 98 องศา ทำให้เหมือนกลิ้งตามวงโคจร"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('mc-7', 'MULTIPLE_CHOICE', 'โลกเป็นดาวเคราะห์ลำดับที่เท่าไหร่จากดวงอาทิตย์?', 'Easy', 10, 'solar-system', 5, '{"options": ["ลำดับที่ 2", "ลำดับที่ 3", "ลำดับที่ 4", "ลำดับที่ 5"], "correctAnswer": 1, "explanation": "โลกเป็นดาวเคราะห์ลำดับที่ 3 จากดวงอาทิตย์ หลังจากดาวพุธและดาวศุกร์"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('mc-8', 'MULTIPLE_CHOICE', 'แกนกลางของโลกประกอบด้วยธาตุใดเป็นหลัก?', 'Medium', 15, 'earth-structure', 7, '{"options": ["ซิลิกอน", "เหล็กและนิกเกิล", "แมกนีเซียม", "อลูมิเนียม"], "correctAnswer": 1, "explanation": "แกนกลางของโลกประกอบด้วยเหล็กและนิกเกิลเป็นหลัก ทำให้เกิดสนามแม่เหล็กของโลก"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('fb-1', 'FILL_BLANK', 'ชั้นของโลกที่มีสถานะเป็นของแข็งและบางที่สุดคือ ________', 'Medium', 15, 'earth-structure', 7, '{"blanks": ["เปลือกโลก", "Crust"], "correctAnswer": "เปลือกโลก", "explanation": "เปลือกโลก (Crust) เป็นชั้นนอกสุดที่เป็นของแข็งและบางที่สุด มีความหนาเฉลี่ย 30-50 กิโลเมตร"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('fb-2', 'FILL_BLANK', 'ดาวเคราะห์ที่มีวงแหวนที่สวยงามและชัดเจนที่สุดคือ ________', 'Easy', 10, 'planets', 5, '{"blanks": ["ดาวเสาร์", "Saturn"], "correctAnswer": "ดาวเสาร์", "explanation": "ดาวเสาร์ (Saturn) มีระบบวงแหวนที่สวยงามและชัดเจนที่สุด ประกอบด้วยหิน น้ำแข็ง และฝุ่น"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('fb-3', 'FILL_BLANK', 'ดาวอาทิตย์มีมวลคิดเป็น ________ % ของมวลทั้งหมดในระบบสุริยะ', 'Hard', 20, 'solar-system', 10, '{"blanks": ["99.86", "99.8"], "correctAnswer": "99.86", "explanation": "ดาวอาทิตย์มีมวลคิดเป็น 99.86% ของมวลทั้งหมดในระบบสุริยะ ทำให้เป็นศูนย์กลางแรงโน้มถ่วง"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('fb-4', 'FILL_BLANK', 'ชั้นบรรยากาศที่เราอาศัยอยู่เรียกว่า ________', 'Medium', 15, 'earth-structure', 7, '{"blanks": ["โทรโปสเฟียร์", "Troposphere"], "correctAnswer": "โทรโปสเฟียร์", "explanation": "โทรโปสเฟียร์ (Troposphere) เป็นชั้นบรรยากาศที่ใกล้พื้นผิวโลกที่สุด และเป็นที่เกิดสภาพอากาศต่างๆ"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('match-1', 'MATCH_PAIRS', 'จับคู่ดาวเคราะห์กับลักษณะเด่น', 'Medium', 20, 'planets', 10, '{"pairs": [{"left": "ดาวพุธ", "right": "ใกล้ดวงอาทิตย์ที่สุด"}, {"left": "ดาวศุกร์", "right": "ร้อนที่สุดในระบบสุริยะ"}, {"left": "ดาวอังคาร", "right": "ดาวแดง"}, {"left": "ดาวพฤหัสบดี", "right": "ใหญ่ที่สุด"}], "correctAnswer": ["ดาวพุธ-ใกล้ดวงอาทิตย์ที่สุด", "ดาวศุกร์-ร้อนที่สุดในระบบสุริยะ", "ดาวอังคาร-ดาวแดง", "ดาวพฤหัสบดี-ใหญ่ที่สุด"], "explanation": "การจับคู่ดาวเคราะห์กับลักษณะเด่นของแต่ละดวง"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('match-2', 'MATCH_PAIRS', 'จับคู่ชั้นโลกกับลักษณะสำคัญ', 'Hard', 25, 'earth-structure', 12, '{"pairs": [{"left": "เปลือกโลก", "right": "ชั้นที่เป็นของแข็งและบางที่สุด"}, {"left": "เนื้อโลก", "right": "ชั้นที่หนาที่สุดและเป็นหิน"}, {"left": "แกนกลางชั้นนอก", "right": "เป็นของเหลว ประกอบด้วยเหล็ก"}, {"left": "แกนกลางชั้นใน", "right": "เป็นของแข็ง อุณหภูมิสูงที่สุด"}], "correctAnswer": ["เปลือกโลก-ชั้นที่เป็นของแข็งและบางที่สุด", "เนื้อโลก-ชั้นที่หนาที่สุดและเป็นหิน", "แกนกลางชั้นนอก-เป็นของเหลว ประกอบด้วยเหล็ก", "แกนกลางชั้นใน-เป็นของแข็ง อุณหภูมิสูงที่สุด"], "explanation": "การจับคู่ชั้นโครงสร้างภายในของโลกกับลักษณะสำคัญ"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('tf-1', 'TRUE_FALSE', 'ดาวศุกร์เป็นดาวเคราะห์ที่ร้อนที่สุดในระบบสุริยะ', 'Medium', 12, 'planets', 6, '{"correctAnswer": "true", "explanation": "ดาวศุกร์เป็นดาวเคราะห์ที่ร้อนที่สุด มีอุณหภูมิประมาณ 464°C เนื่องจากเอฟเฟกต์เรือนกระจก"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('tf-2', 'TRUE_FALSE', 'โลกมีชั้นบรรยากาศทั้งหมด 4 ชั้น', 'Medium', 12, 'earth-structure', 6, '{"correctAnswer": "false", "explanation": "โลกมีชั้นบรรยากาศ 5 ชั้น ได้แก่ โทรโปสเฟียร์ สตราโตสเฟียร์ มีโซสเฟียร์ เทอร์โมสเฟียร์ และเอ็กโซสเฟียร์"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('tf-3', 'TRUE_FALSE', 'ดาวเคราะห์ในระบบภายนอกทั้งหมดเป็นดาวเคราะห์ก๊าซ', 'Easy', 10, 'solar-system', 5, '{"correctAnswer": "true", "explanation": "ดาวเคราะห์ในระบบภายนอก (ดาวพฤหัสบดี ดาวเสาร์ ดาวยูเรนัส ดาวเนปจูน) ล้วนเป็นดาวเคราะห์ก๊าซ"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('order-1', 'DRAG_DROP', 'เรียงลำดับดาวเคราะห์จากใกล้ดวงอาทิตย์ไปไกลที่สุด', 'Medium', 18, 'solar-system', 9, '{"items": ["ดาวอังคาร", "ดาวพุธ", "โลก", "ดาวศุกร์"], "correctOrder": [1, 3, 0, 2], "correctAnswer": ["ดาวพุธ", "ดาวศุกร์", "โลก", "ดาวอังคาร"], "explanation": "ลำดับดาวเคราะห์จากใกล้ดวงอาทิตย์: ดาวพุธ, ดาวศุกร์, โลก, ดาวอังคาร"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668'),
('order-2', 'DRAG_DROP', 'เรียงลำดับชั้นโครงสร้างโลกจากนอกเข้าใน', 'Hard', 22, 'earth-structure', 11, '{"items": ["แกนกลางชั้นใน", "เนื้อโลก", "เปลือกโลก", "แกนกลางชั้นนอก"], "correctOrder": [2, 1, 3, 0], "correctAnswer": ["เปลือกโลก", "เนื้อโลก", "แกนกลางชั้นนอก", "แกนกลางชั้นใน"], "explanation": "ลำดับชั้นโครงสร้างโลกจากนอกเข้าใน: เปลือกโลก, เนื้อโลก, แกนกลางชั้นนอก, แกนกลางชั้นใน"}', '2025-10-07 07:11:24.668', '2025-10-07 07:11:24.668')
;
--

SELECT setval('public.questions_id_seq', COALESCE((SELECT MAX(id) FROM public.questions), 1), true);
SELECT setval('public.stage_characters_id_seq', COALESCE((SELECT MAX(id) FROM public.stage_characters), 1), true);
SELECT setval('public.stage_prerequisites_id_seq', COALESCE((SELECT MAX(id) FROM public.stage_prerequisites), 1), true);
SELECT setval('public.stages_id_seq', COALESCE((SELECT MAX(id) FROM public.stages), 1), true);

--
-- Add primary keys if they don't exist
--

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'Course' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public."Course" ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'CourseDetail' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public."CourseDetail" ADD CONSTRAINT "CourseDetail_pkey" PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'CourseLesson' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public."CourseLesson" ADD CONSTRAINT "CourseLesson_pkey" PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'CoursePostest' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public."CoursePostest" ADD CONSTRAINT "CoursePostest_pkey" PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'CourseQuiz' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public."CourseQuiz" ADD CONSTRAINT "CourseQuiz_pkey" PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'User' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = '_prisma_migrations' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public._prisma_migrations ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'mini_game_questions' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.mini_game_questions ADD CONSTRAINT mini_game_questions_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'mini_game_results' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.mini_game_results ADD CONSTRAINT mini_game_results_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'questions' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.questions ADD CONSTRAINT questions_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'stage_characters' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.stage_characters ADD CONSTRAINT stage_characters_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'stage_prerequisites' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.stage_prerequisites ADD CONSTRAINT stage_prerequisites_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'stages' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.stages ADD CONSTRAINT stages_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'user_course_progress' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.user_course_progress ADD CONSTRAINT user_course_progress_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'user_stage_progress' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE ONLY public.user_stage_progress ADD CONSTRAINT user_stage_progress_pkey PRIMARY KEY (id);
    END IF;
END $$;

--
-- Add unique indexes if they don't exist
--

CREATE UNIQUE INDEX IF NOT EXISTS "CourseDetail_id_courseLessonId_key" ON public."CourseDetail" USING btree (id, "courseLessonId");
CREATE UNIQUE INDEX IF NOT EXISTS "CourseLesson_id_courseId_key" ON public."CourseLesson" USING btree (id, "courseId");
CREATE UNIQUE INDEX IF NOT EXISTS "CourseQuiz_id_courseDetailId_key" ON public."CourseQuiz" USING btree (id, "courseDetailId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON public."User" USING btree (email);
CREATE UNIQUE INDEX IF NOT EXISTS "stage_characters_stageId_key" ON public.stage_characters USING btree ("stageId");
CREATE UNIQUE INDEX IF NOT EXISTS "stage_prerequisites_stageId_prerequisiteId_key" ON public.stage_prerequisites USING btree ("stageId", "prerequisiteId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_course_progress_userId_courseId_key" ON public.user_course_progress USING btree ("userId", "courseId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_stage_progress_userId_stageId_key" ON public.user_stage_progress USING btree ("userId", "stageId");

--
-- Add other indexes if they don't exist
--

CREATE INDEX IF NOT EXISTS mini_game_questions_category_idx ON public.mini_game_questions USING btree (category);
CREATE INDEX IF NOT EXISTS mini_game_questions_difficulty_idx ON public.mini_game_questions USING btree (difficulty);
CREATE INDEX IF NOT EXISTS "mini_game_results_userId_miniGameId_idx" ON public.mini_game_results USING btree ("userId", "miniGameId");
CREATE INDEX IF NOT EXISTS "questions_stageId_order_idx" ON public.questions USING btree ("stageId", "order");
CREATE INDEX IF NOT EXISTS stages_difficulty_idx ON public.stages USING btree (difficulty);
CREATE INDEX IF NOT EXISTS "user_stage_progress_stageId_idx" ON public.user_stage_progress USING btree ("stageId");
CREATE INDEX IF NOT EXISTS "user_stage_progress_userId_idx" ON public.user_stage_progress USING btree ("userId");

--
-- Add foreign key constraints if they don't exist
--

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'CourseDetail_courseLessonId_fkey') THEN
        ALTER TABLE ONLY public."CourseDetail" ADD CONSTRAINT "CourseDetail_courseLessonId_fkey" FOREIGN KEY ("courseLessonId") REFERENCES public."CourseLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'CourseLesson_courseId_fkey') THEN
        ALTER TABLE ONLY public."CourseLesson" ADD CONSTRAINT "CourseLesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'CoursePostest_courseId_fkey') THEN
        ALTER TABLE ONLY public."CoursePostest" ADD CONSTRAINT "CoursePostest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'CourseQuiz_courseDetailId_fkey') THEN
        ALTER TABLE ONLY public."CourseQuiz" ADD CONSTRAINT "CourseQuiz_courseDetailId_fkey" FOREIGN KEY ("courseDetailId") REFERENCES public."CourseDetail"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'mini_game_results_userId_fkey') THEN
        ALTER TABLE ONLY public.mini_game_results ADD CONSTRAINT "mini_game_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'questions_stageId_fkey') THEN
        ALTER TABLE ONLY public.questions ADD CONSTRAINT "questions_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES public.stages(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'stage_characters_stageId_fkey') THEN
        ALTER TABLE ONLY public.stage_characters ADD CONSTRAINT "stage_characters_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES public.stages(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'stage_prerequisites_prerequisiteId_fkey') THEN
        ALTER TABLE ONLY public.stage_prerequisites ADD CONSTRAINT "stage_prerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES public.stages(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'stage_prerequisites_stageId_fkey') THEN
        ALTER TABLE ONLY public.stage_prerequisites ADD CONSTRAINT "stage_prerequisites_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES public.stages(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_course_progress_courseId_fkey') THEN
        ALTER TABLE ONLY public.user_course_progress ADD CONSTRAINT "user_course_progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_course_progress_userId_fkey') THEN
        ALTER TABLE ONLY public.user_course_progress ADD CONSTRAINT "user_course_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_stage_progress_stageId_fkey') THEN
        ALTER TABLE ONLY public.user_stage_progress ADD CONSTRAINT "user_stage_progress_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES public.stages(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_stage_progress_userId_fkey') THEN
        ALTER TABLE ONLY public.user_stage_progress ADD CONSTRAINT "user_stage_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;
