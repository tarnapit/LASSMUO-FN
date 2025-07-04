"use client";
import { useState } from "react";
import { Quiz } from "../../types/quiz";
import { progressManager } from "../../lib/progress";
import { Brain, Clock, Target, X, PlayCircle, Lock } from "lucide-react";
import Link from "next/link";

interface QuizCardProps {
  quiz: Quiz | null;
  moduleTitle: string;
  onClose?: () => void;
}

export default function QuizCard({ quiz, moduleTitle, onClose }: QuizCardProps) {
  if (!quiz) {
    return (
      <div className="p-4 bg-gray-500/20 rounded-lg border border-gray-500/30 text-center">
        <Brain className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-400 text-sm">ยังไม่มีแบบทดสอบสำหรับบทเรียนนี้</p>
      </div>
    );
  }

  const isUnlocked = progressManager.isQuizUnlocked(quiz.id);
  const unlockReq = progressManager.getQuizUnlockRequirements(quiz.id);

  if (!isUnlocked) {
    return (
      <div className="p-4 bg-gray-600/20 rounded-lg border border-gray-600/30">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-bold text-gray-400 flex items-center">
            <Lock className="mr-2" size={18} />
            แบบฝึกหัดยังไม่ปลดล็อก
          </h4>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              title="ปิด"
              aria-label="ปิด"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <h5 className="text-gray-300 font-bold text-lg mb-2">{quiz.title}</h5>
        <p className="text-gray-400 text-sm mb-4">ต้องเรียนเนื้อหาไปอย่างน้อย 60% ก่อนจึงจะสามารถทำแบบฝึกหัดได้</p>
        
        <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <div className="text-sm text-yellow-300 space-y-1">
            <div>ความคืบหน้าปัจจุบัน: {unlockReq.currentPercentage}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(unlockReq.currentPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs mt-1">
              ต้องการอีก {Math.max(0, unlockReq.requiredPercentage - unlockReq.currentPercentage)}% เพื่อปลดล็อก
            </div>
          </div>
        </div>
        
        <button
          disabled
          className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed font-bold"
        >
          <Lock size={18} className="mr-2" />
          ล็อกอยู่
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border-2 border-orange-500/40">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-orange-400">แบบฝึกหัดพร้อมแล้ว!</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="ปิด"
            aria-label="ปิด"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <h5 className="text-white font-bold text-lg mb-2">{quiz.title}</h5>
      <p className="text-orange-200 text-sm mb-4">{quiz.description}</p>
      
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="text-center">
          <Brain size={16} className="mx-auto text-orange-400 mb-1" />
          <div className="text-orange-300 font-medium">{quiz.questions.length} ข้อ</div>
        </div>
        <div className="text-center">
          <Clock size={16} className="mx-auto text-orange-400 mb-1" />
          <div className="text-orange-300 font-medium">
            {quiz.timeLimit ? `${quiz.timeLimit} นาที` : 'ไม่จำกัด'}
          </div>
        </div>
        <div className="text-center">
          <Target size={16} className="mx-auto text-orange-400 mb-1" />
          <div className="text-orange-300 font-medium">{quiz.passingScore}%</div>
        </div>
      </div>
      
      <Link
        href={`/quiz/${quiz.id}`}
        className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all transform hover:scale-105 font-bold shadow-lg"
      >
        <PlayCircle size={18} className="mr-2" />
        ไปทำแบบฝึกหัด
      </Link>
    </div>
  );
}
