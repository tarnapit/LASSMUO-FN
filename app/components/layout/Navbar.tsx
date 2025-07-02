"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { learningModules } from "../../data/learning-modules";
import { miniGames } from "../../data/mini-games";

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
  { name: "กับเพื่อน", href: "/friends" },
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
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white tracking-wider hover:text-yellow-300 transition-colors"
        >
          LASSMUOO
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative group">
              {item.hasDropdown ? (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="nav-link flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <Link
                          href={item.href}
                          className="text-yellow-400 hover:text-yellow-300 font-semibold"
                          onClick={() => setActiveDropdown(null)}
                        >
                          ดูเนื้อหาทั้งหมด →
                        </Link>
                      </div>
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-3 text-white hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-b-0"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-white hover:text-yellow-300 transition-colors">
                                {dropdownItem.name}
                              </div>
                              {dropdownItem.description && (
                                <div className="text-sm text-gray-400 mt-1 line-clamp-2">
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
                <Link href={item.href} className="nav-link">
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Auth Button */}
        <div className="hidden md:block">
          <button className="btn-secondary">เข้าสู่ระบบ</button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-yellow-300 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="w-full flex items-center justify-between text-white hover:text-yellow-300 transition-colors py-2"
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
              <button
                className="w-full btn-secondary"
                onClick={() => setIsOpen(false)}
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
