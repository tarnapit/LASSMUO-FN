"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogOut, Star, Trophy } from "lucide-react";
import { learningModules } from "../../data/learning-modules";
import { miniGames } from "../../data/mini-games";
import { authManager, User as UserType } from "../../lib/auth";
import { progressManager } from "../../lib/progress";
import LoginModal from "../ui/LoginModal";
import Toast from "../ui/Toast";

interface DropdownItem {
  name: string;
  href: string;
  description?: string;
  level?: string;
}

interface NavigationItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

const navigation: NavigationItem[] = [
  { name: "ด่าน", href: "/stage" },
  {
    name: "บทเรียน",
    href: "/learning",
    hasDropdown: true,
    dropdownItems: learningModules.map(module => ({
      name: module.title,
      href: `/learning/${module.id}`,
      description: module.description,
      level: module.level
    })),
  },
  // { name: "กับเพื่อน", href: "/friends" },
  {
    name: "มินิเกม",
    href: "/mini-game",
    hasDropdown: true,
    dropdownItems: miniGames.map(game => ({
      name: game.title,
      href: `/mini-game/${game.id}`,
      description: game.description,
      level: game.difficulty
    })),
  },
  { name: "บอร์ดผู้นำ", href: "/leaderboard" },
  // เพิ่มในโหมด development
  ...(process.env.NODE_ENV === 'development' ? [{ name: "API Test", href: "/api-test" }] : []),
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    // ตรวจสอบสถานะล็อกอิน
    setCurrentUser(authManager.getCurrentUser());
    
    // โหลด progress
    const progress = progressManager.getProgress();
    setUserProgress(progress);

    // Listen for auth state changes
    const unsubscribe = authManager.onAuthStateChange((user) => {
      setCurrentUser(user);
      if (user) {
        // อัพเดท progress เมื่อล็อกอิน
        const newProgress = progressManager.getProgress();
        setUserProgress(newProgress);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    const progress = progressManager.getProgress();
    setUserProgress(progress);
  };

  const handleLogout = () => {
    authManager.logout();
    setCurrentUser(null);
    // รีโหลด progress (จะเป็น temp progress)
    const progress = progressManager.getProgress();
    setUserProgress(progress);
    // แสดง Toast
    setToast({ message: 'ออกจากระบบแล้ว ข้อมูลจะถูกเก็บแบบชั่วคราว', type: 'info' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Fundamental': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-green-400';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'Fundamental': return 'พื้นฐาน';
      case 'Intermediate': return 'ปานกลาง';
      case 'Advanced': return 'ขั้นสูง';
      default: return 'พื้นฐาน';
    }
  };

  return (
    <nav className="relative z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-white tracking-wider hover:text-yellow-300 transition-colors"
        >
          LASSMUOO
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              {item.hasDropdown ? (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="nav-link flex items-center space-x-2 text-lg font-medium px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="w-5 h-5" />
                  </button>

                  {activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-3 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-3">
                      <div className="px-6 py-4 border-b border-slate-700">
                        <Link
                          href={item.href}
                          className="text-yellow-400 hover:text-yellow-300 font-semibold text-base"
                          onClick={() => setActiveDropdown(null)}
                        >
                          ดูเนื้อหาทั้งหมด →
                        </Link>
                      </div>
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-6 py-4 text-white hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-b-0"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-white hover:text-yellow-300 transition-colors text-base">
                                {dropdownItem.name}
                              </div>
                              {dropdownItem.description && (
                                <div className="text-sm text-gray-400 mt-2 line-clamp-2">
                                  {dropdownItem.description}
                                </div>
                              )}
                            </div>
                            {dropdownItem.level && (
                              <div className={`text-xs px-2 py-1 rounded ml-2 ${getLevelColor(dropdownItem.level)} bg-current/10`}>
                                {getLevelText(dropdownItem.level)}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href} className="nav-link text-lg font-medium px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all">
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:block">
          {currentUser ? (
            <div className="relative group">
              <button 
                onClick={() => toggleDropdown('profile')}
                className="flex items-center space-x-4 bg-slate-800 rounded-xl px-5 py-3 border border-slate-700 hover:border-yellow-400 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-base">{currentUser.email?.split('@')[0] || currentUser.id}</div>
                  {userProgress && (
                    <div className="text-sm text-gray-400 flex items-center space-x-3">
                      <span className="flex items-center">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        {userProgress.stages ? Object.values(userProgress.stages).reduce((sum: number, stage: any) => sum + (stage.stars || 0), 0) : userProgress.totalStars}
                      </span>
                      <span className="flex items-center">
                        <Trophy size={14} className="text-green-400 mr-1" />
                        {userProgress.stages ? Object.values(userProgress.stages).filter((s: any) => s.isCompleted || s.stars > 0).length : userProgress.completedStages.length}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {activeDropdown === 'profile' && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-3">
                  <div className="px-6 py-4 border-b border-slate-700">
                    <div className="text-white font-medium text-base">{currentUser.email?.split('@')[0] || currentUser.id}</div>
                    <div className="text-sm text-gray-400 mt-1">{currentUser.email}</div>
                    {userProgress && (
                      <div className="mt-3 flex space-x-6 text-sm">
                        <span className="flex items-center text-yellow-400">
                          <Star size={14} className="mr-2" />
                          {userProgress.stages ? Object.values(userProgress.stages).reduce((sum: number, stage: any) => sum + (stage.stars || 0), 0) : userProgress.totalStars} ดาว
                        </span>
                        <span className="flex items-center text-green-400">
                          <Trophy size={14} className="mr-2" />
                          {userProgress.stages ? Object.values(userProgress.stages).filter((s: any) => s.isCompleted || s.stars > 0).length : userProgress.completedStages.length} ด่าน
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setActiveDropdown(null);
                    }}
                    className="w-full px-6 py-4 text-left text-red-400 hover:bg-slate-700 transition-colors flex items-center space-x-3 text-base"
                  >
                    <LogOut size={18} />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="btn-secondary text-base px-6 py-3"
            >
              เข้าสู่ระบบ
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-yellow-300 transition-colors p-2"
          aria-label="เปิด/ปิดเมนู"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 z-40">
          <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="w-full flex items-center justify-between text-white hover:text-yellow-300 transition-colors py-2 text-base font-medium"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === item.name && (
                      <div className="pl-4 mt-2 space-y-3">
                        <Link
                          href={item.href}
                          className="block text-yellow-400 hover:text-yellow-300 transition-colors py-1 font-semibold"
                          onClick={() => {
                            setIsOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          ดูเนื้อหาทั้งหมด →
                        </Link>
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block text-white/80 hover:text-yellow-300 transition-colors py-2 border-b border-slate-700/30 last:border-b-0"
                            onClick={() => {
                              setIsOpen(false);
                              setActiveDropdown(null);
                            }}
                          >
                            <div>
                              <div className="font-medium">{dropdownItem.name}</div>
                              {dropdownItem.description && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {dropdownItem.description}
                                </div>
                              )}
                              {dropdownItem.level && (
                                <div className={`text-xs mt-1 ${getLevelColor(dropdownItem.level)}`}>
                                  ระดับ: {getLevelText(dropdownItem.level)}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-white hover:text-yellow-300 transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-slate-700">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{currentUser.email?.split('@')[0] || currentUser.id}</div>
                      {userProgress && (
                        <div className="text-xs text-gray-400 flex items-center space-x-2">
                          <span className="flex items-center">
                            <Star size={12} className="text-yellow-400 mr-1" />
                            {userProgress.stages ? Object.values(userProgress.stages).reduce((sum: number, stage: any) => sum + (stage.stars || 0), 0) : userProgress.totalStars}
                          </span>
                          <span className="flex items-center">
                            <Trophy size={12} className="text-green-400 mr-1" />
                            {userProgress.stages ? Object.values(userProgress.stages).filter((s: any) => s.isCompleted || s.stars > 0).length : userProgress.completedStages.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors py-2"
                  >
                    <LogOut size={16} />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full btn-secondary"
                >
                  เข้าสู่ระบบ
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </nav>
  );
}
