"use client";
import { useState } from 'react';
import { X, User, Mail, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // ตรวจสอบข้อมูลสำหรับการสมัครสมาชิก
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }
    } else {
      // ตรวจสอบข้อมูลสำหรับการเข้าสู่ระบบ
      if (!email.trim() || !password.trim()) {
        setError('กรุณากรอกอีเมลและรหัสผ่าน');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let result;
      if (isSignUp) {
        result = authManager.signUp({ name: name.trim(), email: email.trim(), password });
      } else {
        result = authManager.login({ email: email.trim(), password });
      }

      if (!result.success) {
        setError(result.message);
        return;
      }

      if (result.user) {
        // Migrate progress จาก temp เป็น user progress
        progressManager.migrateProgressOnLogin();
        
        onLogin(result.user);
        onClose();
        
        // แสดง toast notification
        if (onShowToast) {
          const progressData = progressManager.getProgress();
          if (progressData.totalStars > 0 || progressData.completedStages.length > 0) {
            onShowToast('เข้าสู่ระบบสำเร็จ! ข้อมูลความคืบหน้าของคุณถูกบันทึกแล้ว', 'success');
          } else {
            onShowToast(`ยินดีต้อนรับ ${result.user.name}! ${isSignUp ? 'สมัครสมาชิกเรียบร้อย' : 'เริ่มต้นการเรียนรู้ดาราศาสตร์กันเถอะ'}`, 'success');
          }
        }
        
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setIsSignUp(false);
        setError('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (only for sign up) */}
          {isSignUp && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ใส่ชื่อ-นามสกุลของคุณ"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

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

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              รหัสผ่าน {isSignUp && <span className="text-gray-400 text-xs">(อย่างน้อย 6 ตัวอักษร)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={isSignUp ? "สร้างรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)" : "ใส่รหัสผ่านของคุณ"}
                required
                minLength={isSignUp ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim() || (isSignUp && !name.trim())}
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
