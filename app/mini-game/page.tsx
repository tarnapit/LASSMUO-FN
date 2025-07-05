"use client";
import Link from "next/link";
import { miniGames } from "../data/mini-games";
import Navbar from "../components/layout/Navbar";
import {
  Gamepad2,
  Clock,
  Star,
  Trophy,
  Zap,
  Medal,
  Target,
  Brain,
  Puzzle,
  PlayCircle,
  CheckCircle,
  Lock,
  Flame,
  Crown,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/mini-game-animations.css";

export default function MiniGamePage() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [completedGames, setCompletedGames] = useState<string[]>([
    "planet-match",
    "solar-quiz",
    "constellation-connect",
  ]); // Demo completed games
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState([
    {
      id: "first-game",
      name: "ผู้เริ่มต้น",
      description: "เล่นเกมแรก",
      icon: "🎮",
      unlocked: true,
    },
    {
      id: "memory-master",
      name: "ปรมาจารย์ความจำ",
      description: "เล่นเกมความจำ 5 ครั้ง",
      icon: "🧠",
      unlocked: true,
    },
    {
      id: "quiz-expert",
      name: "ผู้เชี่ยวชาญแบบทดสอบ",
      description: "ทำแบบทดสอบได้คะแนนเต็ม",
      icon: "🏆",
      unlocked: true,
    },
    {
      id: "speed-runner",
      name: "นักวิ่งเร็ว",
      description: "เล่นเกมจบภายใน 2 นาที",
      icon: "⚡",
      unlocked: false,
    },
    {
      id: "explorer",
      name: "นักสำรวจ",
      description: "เล่นเกมทุกประเภท",
      icon: "🌌",
      unlocked: false,
    },
    {
      id: "perfectionist",
      name: "นักสมบูรณ์แบบ",
      description: "ได้คะแนนเต็มใน 10 เกม",
      icon: "💎",
      unlocked: false,
    },
  ]);

  const text = {
    title: "มินิเกม",
    subtitle: "เรียนรู้ไปกับเกมสนุกๆ พร้อมท้าทายความรู้ของคุณ",
    difficulty: "ความยาก:",
    time: "เวลา:",
    points: "คะแนน:",
    play: "เล่นเลย",
    completed: "เล่นแล้ว",
    locked: "ล็อค",
    easy: "ง่าย",
    medium: "ปานกลาง",
    hard: "ยาก",
    achievements: "ความสำเร็จ",
    yourProgress: "ความคืบหน้าของคุณ",
    gamesCompleted: "เกมที่เล่นแล้ว",
    totalPoints: "คะแนนรวม",
    streakDays: "วันติดต่อกัน",
    newGame: "เกมใหม่!",
    popular: "ยอดนิยม",
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-red-400";
      default:
        return "text-green-400";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return text.easy;
      case "Medium":
        return text.medium;
      case "Hard":
        return text.hard;
      default:
        return text.easy;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Knowledge":
        return <Brain className="text-blue-400" size={20} />;
      case "Memory":
        return <Zap className="text-purple-400" size={20} />;
      case "Puzzle":
        return <Puzzle className="text-orange-400" size={20} />;
      case "Action":
        return <Gamepad2 className="text-red-400" size={20} />;
      default:
        return <Star className="text-blue-400" size={20} />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const baseClass =
      "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    switch (difficulty) {
      case "Easy":
        return (
          <div
            className={`${baseClass} bg-green-500/20 text-green-400 border border-green-500/30`}
          >
            <Target size={12} />
            {text.easy}
          </div>
        );
      case "Medium":
        return (
          <div
            className={`${baseClass} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`}
          >
            <Flame size={12} />
            {text.medium}
          </div>
        );
      case "Hard":
        return (
          <div
            className={`${baseClass} bg-red-500/20 text-red-400 border border-red-500/30`}
          >
            <Crown size={12} />
            {text.hard}
          </div>
        );
      default:
        return (
          <div
            className={`${baseClass} bg-green-500/20 text-green-400 border border-green-500/30`}
          >
            <Target size={12} />
            {text.easy}
          </div>
        );
    }
  };

  const isGameCompleted = (gameId: string) => completedGames.includes(gameId);
  const totalCompletedGames = completedGames.length;
  const totalPoints = completedGames.reduce((sum, gameId) => {
    const game = miniGames.find((g) => g.id === gameId);
    return sum + (game?.points || 0);
  }, 0);

  const isNewGame = (gameId: string) =>
    [
      "constellation-connect",
      "asteroid-dodge",
      "galaxy-explorer",
      "black-hole-escape",
    ].includes(gameId);
  const isPopularGame = (gameId: string) =>
    ["solar-quiz", "planet-match", "space-memory"].includes(gameId);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update progress bar width
    const progressBar = document.querySelector(
      ".progress-animated"
    ) as HTMLElement;
    if (progressBar) {
      progressBar.style.setProperty(
        "--progress-width",
        `${(totalCompletedGames / miniGames.length) * 100}%`
      );
      progressBar.style.width = `${
        (totalCompletedGames / miniGames.length) * 100
      }%`;
    }
  }, [totalCompletedGames]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Gamepad2
              className="text-yellow-400 animate-bounce mx-auto mb-4"
              size={64}
            />
            <div className="absolute inset-0 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 "></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            กำลังโหลดเกม...
          </h2>
          <p className="text-gray-400">
            เตรียมตัวสำหรับการผจญภัยที่น่าตื่นเต้น
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 relative overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-20 right-32 w-1 h-1 bg-green-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-red-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-80 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping delay-700"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-20 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Gamepad2 className="text-yellow-400 animate-bounce" size={64} />
              <Sparkles
                className="absolute -top-2 -right-2 text-blue-400"
                size={24}
              />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            {text.title}
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            {text.subtitle}
          </p>
        </div>

        {/* Progress Dashboard */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 mb-16 border border-white/10 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3 justify-center sm:justify-start">
            <Trophy className="text-yellow-400" size={32} />
            {text.yourProgress}
          </h2>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-lg font-medium">
                  {text.gamesCompleted}
                </span>
                <CheckCircle className="text-green-400" size={24} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {totalCompletedGames}/{miniGames.length}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                <div
                  className={`bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 progress-animated`}
                  data-progress={(totalCompletedGames / miniGames.length) * 100}
                ></div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-lg font-medium">
                  {text.totalPoints}
                </span>
                <Star className="text-yellow-400" size={24} />
              </div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {totalPoints.toLocaleString()}
              </div>
              <div className="text-base text-gray-400">
                +{Math.floor(totalPoints * 0.1)} วันนี้
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-lg font-medium">
                  {text.streakDays}
                </span>
                <Flame className="text-orange-400" size={24} />
              </div>
              <div className="text-4xl font-bold text-orange-400 mb-2">12</div>
              <div className="text-base text-gray-400">วันติดต่อกัน</div>
            </div>
          </div>
        </div>

        {/* Mini Games Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10 max-w-7xl mx-auto mb-16 mt-8">
          {miniGames.map((game, index) => {
            const completed = isGameCompleted(game.id);
            const isHovered = hoveredGame === game.id;

            return (
              <div key={game.id} className="mt-6">
                <Link
                  href={`/mini-game/${game.id}`}
                  className="group block"
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                >
                  <div
                    className={`
                  relative bg-white/10 backdrop-blur-sm rounded-3xl p-10 
                  hover:bg-white/20 transition-all duration-500 
                  transform hover:scale-105 hover:-translate-y-2
                  border border-white/20 h-full game-card-glow min-h-[420px] overflow-visible
                  ${completed ? "ring-2 ring-green-500/50" : ""}
                  ${isHovered ? "shadow-2xl shadow-yellow-500/20" : ""}
                `}
                  >
                    {/* Badges Container */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                      {/* Left badges */}
                      <div className="flex flex-col gap-2">
                        {!completed && isNewGame(game.id) && (
                          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {text.newGame}
                          </div>
                        )}
                        {isPopularGame(game.id) && (
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {text.popular}
                          </div>
                        )}
                      </div>

                      {/* Right badges */}
                      <div className="flex flex-col gap-2 items-end">
                        {completed && (
                          <div className="bg-green-500 rounded-full p-2 border-2 border-white achievement-unlocked">
                            <CheckCircle className="text-white" size={20} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Game Header */}
                    <div className="flex items-center justify-between mb-8 mt-8">
                      <div className="text-6xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 float-animation">
                        {game.thumbnail}
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        {getDifficultyBadge(game.difficulty)}
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(game.category)}
                          <span className="text-sm text-gray-400 font-medium">
                            {game.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Game Title */}
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors leading-tight">
                      {game.title}
                    </h3>

                    {/* Game Description */}
                    <p className="text-gray-300 mb-8 leading-relaxed text-base">
                      {game.description}
                    </p>

                    {/* Game Stats */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-base">
                        <div className="flex items-center">
                          <Clock size={18} className="text-gray-400 mr-3" />
                          <span className="text-gray-400 font-medium">
                            {text.time}
                          </span>
                        </div>
                        <span className="text-gray-300 font-semibold">
                          {game.estimatedTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-base">
                        <div className="flex items-center">
                          <Trophy size={18} className="text-yellow-400 mr-3" />
                          <span className="text-gray-400 font-medium">
                            {text.points}
                          </span>
                        </div>
                        <span className="text-yellow-400 font-bold text-lg">
                          {game.points}
                        </span>
                      </div>
                    </div>

                    {/* Play Button */}
                    <div
                      className={`
                    flex items-center justify-center gap-3 font-bold py-5 px-8 rounded-2xl text-center transition-all duration-300 text-lg
                    ${
                      completed
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400"
                        : "bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400"
                    }
                    transform group-hover:scale-105 shadow-lg
                  `}
                    >
                      <PlayCircle size={24} />
                      {completed ? text.completed : text.play}
                    </div>

                    {/* Hover Effect Overlay */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-3xl pointer-events-none"></div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <div className="mb-16 mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Medal className="text-yellow-400" size={32} />
            {text.achievements}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 max-w-7xl mx-auto mt-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 min-h-[160px] mt-4 overflow-visible
                  ${
                    achievement.unlocked
                      ? "border-yellow-500/50 bg-yellow-500/10 shadow-lg shadow-yellow-500/20"
                      : "border-white/10 grayscale"
                  }
                  hover:scale-105 transform
                `}
              >
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1 z-10">
                    <CheckCircle className="text-black" size={16} />
                  </div>
                )}

                <div className="text-center">
                  <div className="text-5xl mb-4">{achievement.icon}</div>
                  <h3
                    className={`font-bold mb-2 text-sm ${
                      achievement.unlocked ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-tight">
                    {achievement.description}
                  </p>

                  {!achievement.unlocked && (
                    <div className="mt-3 flex items-center justify-center">
                      <Lock className="text-gray-500" size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Fun Stats Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <Sparkles className="text-purple-400" size={32} />
            สถิติที่น่าสนใจ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 border border-blue-500/20 hover:scale-105 transition-transform">
              <div className="text-5xl text-blue-400 mb-4">🌟</div>
              <div className="text-4xl font-bold text-white mb-3">1,247</div>
              <div className="text-gray-400 text-base mb-2">
                ครั้งที่เล่นทั้งหมด
              </div>
              <div className="text-green-400 text-sm">+23% จากเดือนที่แล้ว</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 border border-green-500/20 hover:scale-105 transition-transform">
              <div className="text-5xl text-green-400 mb-4">⏱️</div>
              <div className="text-4xl font-bold text-white mb-3">4.2 นาที</div>
              <div className="text-gray-400 text-base mb-2">
                เวลาเฉลี่ยต่อเกม
              </div>
              <div className="text-blue-400 text-sm">ลดลง 18% จากเดิม</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-500/20 hover:scale-105 transition-transform">
              <div className="text-5xl text-yellow-400 mb-4">🏆</div>
              <div className="text-4xl font-bold text-white mb-3">2,850</div>
              <div className="text-gray-400 text-base mb-2">
                คะแนนสูงสุดในวัน
              </div>
              <div className="text-purple-400 text-sm">สถิติใหม่!</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20 hover:scale-105 transition-transform">
              <div className="text-5xl text-purple-400 mb-4">🎯</div>
              <div className="text-4xl font-bold text-white mb-3">92%</div>
              <div className="text-gray-400 text-base mb-2">
                อัตราผ่านเฉลี่ย
              </div>
              <div className="text-green-400 text-sm">เพิ่มขึ้น 5%</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              พร้อมท้าทายตัวเองหรือยัง?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              เริ่มต้นการผจญภัยในจักรวาลไปกับเกมที่ทดสอบความรู้ ความจำ
              และความคิดเชิงตรรกะของคุณ
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 rounded-lg px-4 py-2 border border-white/20">
                <span className="text-sm text-gray-300">
                  🎮 เกมใหม่ทุกสัปดาห์
                </span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 border border-white/20">
                <span className="text-sm text-gray-300">
                  🏆 แข่งขันกับเพื่อน
                </span>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 border border-white/20">
                <span className="text-sm text-gray-300">
                  📊 ติดตามความก้าวหน้า
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Stars Effect */}
      <div className="star-field">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="star" />
        ))}
      </div>
    </div>
  );
}
