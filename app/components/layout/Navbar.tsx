"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navigation = [
  { name: "ด่าน", href: "/stage" },
  {
    name: "บทเรียน",
    href: "/learning",
    hasDropdown: true,
    dropdownItems: [
      { name: "ระบบสุริยะ", href: "/learning/solar-system" },
      { name: "ดาวและกาแล็กซี", href: "/learning/stars" },
      { name: "กลุ่มดาว", href: "/learning/constellations" },
      { name: "การสำรวจอวกาศ", href: "/learning/space-exploration" },
    ],
  },
  { name: "กับเพื่อน", href: "/friends" },
  {
    name: "มินิเกม",
    href: "/mini-game",
    hasDropdown: true,
    dropdownItems: [
      { name: "จับคู่ดาวเคราะห์", href: "/mini-game/planet-match" },
      { name: "วาดกลุ่มดาว", href: "/mini-game/constellation-draw" },
      { name: "สร้างระบบสุริยะ", href: "/mini-game/solar-system-builder" },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="relative z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-white tracking-wider hover:text-yellow-300 transition-colors"
        >
          LASSMUDO
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
                    <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-white hover:bg-slate-700 hover:text-yellow-300 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {dropdownItem.name}
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
                      <div className="pl-4 mt-2 space-y-2">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block text-white/80 hover:text-yellow-300 transition-colors py-1"
                            onClick={() => {
                              setIsOpen(false);
                              setActiveDropdown(null);
                            }}
                          >
                            {dropdownItem.name}
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
