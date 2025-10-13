"use client";
import { useState, useEffect } from 'react';
import { X, User, Mail, LogIn, UserPlus, Eye, EyeOff, Lock } from 'lucide-react';
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

  // ฟังก์ชันปิด modal พร้อม confirmation
  const handleClose = () => {
    const hasData = name.trim() || email.trim() || password.trim();
    if (hasData && !isLoading) {
      if (confirm('คุณต้องการปิดหน้าต่างนี้? ข้อมูลที่กรอกจะหายไป')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // เคลียร์ข้อมูลเมื่อเปิด modal ใหม่
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setError('');
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, name, email, password, isLoading]);

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
      let result;
      if (isSignUp) {
        console.log('Attempting sign up with:', { name: name.trim(), email: email.trim() });
        result = await authManager.signUp({ name: name.trim(), email: email.trim(), password });
      } else {
        console.log('Attempting login with:', { email: email.trim() });
        result = await authManager.login({ email: email.trim(), password });
      }

      console.log('Auth result:', result);

      if (!result.success) {
        console.error('Auth failed:', result.message);
        setError(result.message);
        return;
      }

      if (result.user) {
        console.log('Auth successful, user:', result.user);
        
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
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่คาดคิด');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      
      const errorMessage = error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      
      // แสดง toast สำหรับ error ที่สำคัญ
      if (onShowToast) {
        onShowToast(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 rounded-2xl p-8 w-full max-w-lg border border-slate-600/50 shadow-2xl backdrop-blur-sm ring-1 ring-white/5"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              {isSignUp ? <UserPlus size={24} className="text-white" /> : <LogIn size={24} className="text-white" />}
            </div>
            {isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </h2>
          <button
            onClick={handleClose}
            title="ปิด"
            className="text-gray-400 hover:text-white hover:bg-slate-700/50 p-2 rounded-lg transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Info Message */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-sm"></div>
          <div className="relative">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg mt-0.5">
                <span className="text-blue-300 text-lg">💡</span>
              </div>
              <div>
                <h4 className="text-blue-200 font-semibold mb-1">เก็บ Progress ของคุณ!</h4>
                <p className="text-blue-300/90 text-sm leading-relaxed">
                  {isSignUp 
                    ? 'สมัครสมาชิกเพื่อเก็บความคืบหน้าการเรียนรู้ของคุณไว้ตลอดไป' 
                    : 'เข้าสู่ระบบเพื่อซิงค์ข้อมูลการเรียนรู้ของคุณ'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 backdrop-blur-sm"></div>
            <div className="relative flex items-start gap-3">
              <div className="p-1.5 bg-red-500/20 rounded-lg mt-0.5">
                <span className="text-red-300 text-base">⚠️</span>
              </div>
              <p className="text-red-200 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name (only for sign up) */}
          {isSignUp && (
            <div className="group">
              <label className="block text-gray-200 text-sm font-semibold mb-3">
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:bg-slate-700/70 transition-all duration-200"
                  placeholder="ใส่ชื่อ-นามสกุลของคุณ"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="group">
            <label className="block text-gray-200 text-sm font-semibold mb-3">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:bg-slate-700/70 transition-all duration-200"
                placeholder="ใส่อีเมลของคุณ"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-gray-200 text-sm font-semibold mb-3">
              รหัสผ่าน {isSignUp && <span className="text-gray-400 text-xs font-normal">(อย่างน้อย 6 ตัวอักษร)</span>}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:bg-slate-700/70 transition-all duration-200"
                placeholder={isSignUp ? "สร้างรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)" : "ใส่รหัสผ่านของคุณ"}
                required
                minLength={isSignUp ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors p-1 rounded"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim() || (isSignUp && !name.trim())}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/95 text-gray-400">หรือ</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mt-4">
            {isSignUp ? 'มีบัญชีอยู่แล้ว?' : 'ยังไม่มีบัญชี?'}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:text-blue-300 font-semibold ml-2 hover:underline transition-all duration-200"
            >
              {isSignUp ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
          </p>
        </div>

        {/* Continue Without Login */}
        <div className="mt-6 text-center border-t border-slate-700/50 pt-6">
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors hover:underline"
          >
            ดำเนินการต่อโดยไม่ล็อกอิน
          </button>
        </div>
      </div>
    </div>
  );
}
