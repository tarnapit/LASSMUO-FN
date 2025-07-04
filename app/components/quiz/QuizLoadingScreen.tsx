"use client";
import { useEffect, useState } from "react";
import { Star, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  stage: string;
  onComplete: () => void;
}

export default function QuizLoadingScreen({ stage, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "💡 อ่านคำถามให้ดีก่อนตอบ",
    "🎯 ใช้เวลาในการคิดให้เพียงพอ",
    "⭐ คำตอบถูกจะได้คะแนนมากขึ้น",
    "🔥 ตอบถูกติดต่อกันจะได้โบนัส",
    "💎 คะแนนสูงจะปลดล็อกเนื้อหาใหม่"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const tipTimer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, [onComplete, tips.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-8">
        {/* Animated Stars */}
        <div className="relative mb-8">
          <div className="flex justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={`w-12 h-12 text-yellow-400 fill-current animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-8 h-8 text-yellow-300 animate-bounce" />
        </div>

        {/* Stage Title */}
        <h2 className="text-3xl font-bold text-white mb-4">
          กำลังเตรียม {stage}
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
          <div 
            className={`bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-200 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-gray-300 text-lg mb-8">
          {progress}% เสร็จสิ้น
        </p>

        {/* Loading Tips */}
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-yellow-400 font-semibold mb-2">เคล็ดลับ:</h3>
          <p className="text-white text-lg transition-all duration-500">
            {tips[currentTip]}
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 bg-blue-500 rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
