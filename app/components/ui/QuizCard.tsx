"use client";
import { useState } from "react";
import { Quiz } from "../../types/quiz";
import { Brain, Clock, Target, X, PlayCircle } from "lucide-react";
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
