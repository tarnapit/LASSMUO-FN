"use client";
import { useState } from 'react';
import { X, User, Mail, LogIn, UserPlus } from 'lucide-react';
import { authManager, User as UserType } from '../../lib/auth';
import { progressManager } from '../../lib/progress';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function LoginModal({ isOpen, onClose, onLogin, onShowToast }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = authManager.login(username.trim(), email.trim());
      
      // Migrate progress จาก temp เป็น user progress
      progressManager.migrateProgressOnLogin();
      
      onLogin(user);
      onClose();
      
      // แสดง toast notification
      if (onShowToast) {
        const progressData = progressManager.getProgress();
        if (progressData.totalStars > 0 || progressData.completedStages.length > 0) {
          onShowToast('เข้าสู่ระบบสำเร็จ! ข้อมูลความคืบหน้าของคุณถูกบันทึกแล้ว', 'success');
        } else {
          onShowToast(`ยินดีต้อนรับ ${user.username}! เริ่มต้นการเรียนรู้ดาราศาสตร์กันเถอะ`, 'success');
        }
      }
      
      // Reset form
      setUsername('');
      setEmail('');
      setIsSignUp(false);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {isSignUp ? <UserPlus size={24} /> : <LogIn size={24} />}
            {isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </h2>
          <button
            onClick={onClose}
            title="ปิด"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Info Message */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <p className="text-blue-200 text-sm">
            💡 <strong>เก็บ Progress ของคุณ!</strong>
            <br />
            {isSignUp 
              ? 'สมัครสมาชิกเพื่อเก็บความคืบหน้าการเรียนรู้ของคุณไว้ตลอดไป' 
              : 'เข้าสู่ระบบเพื่อซิงค์ข้อมูลการเรียนรู้ของคุณ'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="ใส่ชื่อผู้ใช้"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="ใส่อีเมลของคุณ"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !username.trim() || !email.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                กำลังดำเนินการ...
              </>
            ) : (
              <>
                {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
                {isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isSignUp ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?'}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors"
            >
              {isSignUp ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
          </p>
        </div>

        {/* Continue Without Login */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            ดำเนินการต่อโดยไม่ล็อกอิน
          </button>
        </div>
      </div>
    </div>
  );
}
