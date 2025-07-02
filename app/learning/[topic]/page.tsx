"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLearningModuleById } from "../../data/learning-modules";
import { LearningModule, Chapter } from "../../types/learning";
import Navbar from "../../components/layout/Navbar";
import ProgressBar from "../../components/ui/ProgressBar";
import { ChevronLeft, ChevronRight, BookOpen, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LearningTopicPage() {
  const params = useParams();
  const router = useRouter();
  const [module, setModule] = useState<LearningModule | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => {
    if (params.topic) {
      const foundModule = getLearningModuleById(params.topic as string);
      if (foundModule) {
        setModule(foundModule);
      } else {
        router.push('/learning');
      }
    }
  }, [params.topic, router]);

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  const currentChapter = module.chapters[currentChapterIndex];
  const currentContent = currentChapter?.content[currentContentIndex];
  const isLastContent = currentContentIndex === currentChapter.content.length - 1;
  const isLastChapter = currentChapterIndex === module.chapters.length - 1;
  const isFirstContent = currentContentIndex === 0;
  const isFirstChapter = currentChapterIndex === 0;

  const nextContent = () => {
    if (!isLastContent) {
      setCurrentContentIndex(prev => prev + 1);
    } else if (!isLastChapter) {
      setCurrentChapterIndex(prev => prev + 1);
      setCurrentContentIndex(0);
    }
  };

  const prevContent = () => {
    if (!isFirstContent) {
      setCurrentContentIndex(prev => prev - 1);
    } else if (!isFirstChapter) {
      setCurrentChapterIndex(prev => prev - 1);
      setCurrentContentIndex(module.chapters[currentChapterIndex - 1].content.length - 1);
    }
  };

  const goToExercise = () => {
    router.push(`/quiz?topic=${module.id}`);
  };

  const renderContent = () => {
    if (!currentContent) return null;

    // Calculate progress percentage
    const progressPercentage = ((currentContentIndex + 1) / currentChapter.content.length) * 100;

    switch (currentContent.type) {
      case 'text':
        return (
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed text-lg">
              {currentContent.content}
            </p>
          </div>
        );
      
      case 'image':
        return (
          <div className="text-center">
            <div className="bg-gray-800 rounded-lg p-8 mb-4">
              <div className="text-gray-400 text-lg">
                📷 {currentContent.content}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                (รูปภาพจะแสดงที่นี่)
              </div>
            </div>
            {currentContent.imageUrl && (
              <p className="text-sm text-gray-400">{currentContent.imageUrl}</p>
            )}
          </div>
        );
      
      case 'interactive':
        return (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">แบบฝึกหัด</h3>
            <p className="text-gray-200 mb-6">{currentContent.content}</p>
            <button 
              onClick={goToExercise}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-400 hover:to-red-400 transition-all"
            >
              ไปทำแบบฝึกหัด
            </button>
          </div>
        );
      
      default:
        return <div className="text-gray-200">{currentContent.content}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learning" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้าบทเรียน
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">{module.title}</h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center">
              <BookOpen size={16} className="mr-1" />
              <span>บทที่ {currentChapterIndex + 1}: {currentChapter.title}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{currentChapter.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">ความคืบหน้า</span>
            <span className="text-sm text-gray-400">
              {currentContentIndex + 1} / {currentChapter.content.length}
            </span>
          </div>
          <ProgressBar 
            current={currentContentIndex + 1} 
            total={currentChapter.content.length} 
          />
        </div>

        {/* Chapter Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {module.chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => {
                  setCurrentChapterIndex(index);
                  setCurrentContentIndex(0);
                }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  index === currentChapterIndex
                    ? 'bg-yellow-500 text-black font-semibold'
                    : index < currentChapterIndex
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                บทที่ {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
            {renderContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevContent}
              disabled={isFirstChapter && isFirstContent}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                isFirstChapter && isFirstContent
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft size={20} className="mr-2" />
              ย้อนกลับ
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">
                บทที่ {currentChapterIndex + 1} จาก {module.chapters.length}
              </div>
              <div className="text-lg font-semibold text-white">
                {currentChapter.title}
              </div>
            </div>

            <button
              onClick={nextContent}
              disabled={isLastChapter && isLastContent}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                isLastChapter && isLastContent
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400'
              }`}
            >
              ถัดไป
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
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
