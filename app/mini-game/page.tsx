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
    "score-challenge",
    "random-quiz",
  ]); // Demo completed games
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState([
    {
      id: "first-quiz",
      name: "ผู้เริ่มต้น",
      description: "เล่นแบบทดสอบครั้งแรก",
      icon: "�",
      unlocked: true,
      reward: "+50 คะแนน",
    },
    {
      id: "score-master",
      name: "ปรมาจารย์คะแนน",
      description: "ได้คะแนนเต็มใน Score Challenge",
      icon: "🏆",
      unlocked: true,
      reward: "+200 คะแนน",
    },
    {
      id: "speed-demon",
      name: "ปีศาจความเร็ว",
      description: "ตอบถูก 20 ข้อใน Time Rush",
      icon: "⚡",
      unlocked: false,
      reward: "+300 คะแนน",
    },
    {
      id: "knowledge-expert",
      name: "ผู้เชี่ยวชาญความรู้",
      description: "ผ่านทุกโหมดด้วยคะแนน 80%+",
      icon: "🧠",
      unlocked: false,
      reward: "+500 คะแนน",
    },
    {
      id: "quiz-champion",
      name: "แชมป์แบบทดสอบ",
      description: "ครองอันดับ 1 ในลีดเดอร์บอร์ด",
      icon: "👑",
      unlocked: false,
      reward: "+1000 คะแนน",
    },
    {
      id: "perfect-streak",
      name: "สายฟ้าสมบูรณ์แบบ",
      description: "ทำแบบทดสอบติดต่อกัน 7 วัน",
      icon: "🔥",
      unlocked: false,
      reward: "+750 คะแนน",
    }
  ]);

  const text = {
    title: "แบบทดสอบดาราศาสตร์",
    subtitle: "ทดสอบความรู้และทักษะด้านดาราศาสตร์ผ่าน 3 โหมดการเล่น",
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
    gamesCompleted: "โหมดที่เล่นแล้ว",
    totalPoints: "คะแนนรวม",
    streakDays: "วันติดต่อกัน",
    newGame: "เกมใหม่!",
    popular: "ยอดนิยม",
    exclusive: "พิเศษ!",
    bonus: "โบนัส x2",
    trending: "แนะนำ",
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
      default:
        return <Brain className="text-blue-400" size={20} />;
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
      "time-rush",
    ].includes(gameId);
  const isPopularGame = (gameId: string) =>
    ["score-challenge", "random-quiz"].includes(gameId);
  const isTrendingGame = (gameId: string) =>
    ["score-challenge"].includes(gameId);
  const hasBonus = (gameId: string) =>
    ["time-rush"].includes(gameId);
  const isExclusive = (gameId: string) => false; // ไม่มีเกมพิเศษ

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
          {/* Header Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
              <Brain className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-semibold">ระบบทดสอบความรู้</span>
            </div>
          </div>

          <div className="relative mb-6">
            <Brain className="text-blue-400 animate-bounce mx-auto" size={72} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            {text.title}
          </h1>
          <p className="text-gray-300 text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed">
            {text.subtitle}
          </p>

          {/* Mode Description */}
          <div className="mt-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Trophy className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 text-center">สะสมคะแนน</h3>
                <p className="text-gray-300 text-center text-sm">หลายตัวเลือก, เติมคำ, จับคู่</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <Clock className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 text-center">ท้าทายเวลา</h3>
                <p className="text-gray-300 text-center text-sm">60 วินาที ตอบให้เร็วที่สุด</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Target className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 text-center">ทบทวนแบบสุ่ม</h3>
                <p className="text-gray-300 text-center text-sm">คำถามจากทุกบทเรียน</p>
              </div>
            </div>
          </div>
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
                {totalCompletedGames}/3
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                <div
                  className={`bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 progress-animated`}
                  data-progress={(totalCompletedGames / 3) * 100}
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

        {/* Quiz Modes Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              โหมดทดสอบความรู้
            </h2>
          </div>
        </div>

        {/* Quiz Modes Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto mb-16 mt-8">
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
                  border border-white/20 h-full game-card-glow min-h-[580px] max-h-[580px] overflow-visible
                  flex flex-col justify-between
                  ${completed ? "ring-2 ring-green-500/50" : ""}
                  ${isHovered ? "shadow-2xl shadow-yellow-500/20" : ""}
                `}
                  >
                    {/* Badges Container */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                      {/* Left badges */}
                      <div className="flex flex-col gap-2">
                        {!completed && isNewGame(game.id) && (
                          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                            {text.newGame}
                          </div>
                        )}
                        {isExclusive(game.id) && (
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {text.exclusive}
                          </div>
                        )}
                        {hasBonus(game.id) && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {text.bonus}
                          </div>
                        )}
                        {isPopularGame(game.id) && (
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {text.popular}
                          </div>
                        )}
                        {isTrendingGame(game.id) && (
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {text.trending}
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
                    <div className="flex items-center justify-between mb-6 mt-8">
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

                    {/* Game Content Container - Flex layout for consistent height */}
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Game Title */}
                      <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors leading-tight">
                        {game.title}
                      </h3>

                      {/* Game Description */}
                      <p className="text-gray-300 mb-6 leading-relaxed text-base line-clamp-3">
                        {game.description}
                      </p>

                      {/* Bottom Section */}
                      <div className="mt-auto">
                        {/* Game Stats */}
                        <div className="space-y-4 mb-6">
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
                              {hasBonus(game.id) ? " x2" : ""}
                            </span>
                          </div>

                          {/* Additional Game Info */}
                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                            <div className="text-center">
                              <div className="text-blue-400 font-bold text-lg">
                                {Math.floor(Math.random() * 2000) + 500}
                              </div>
                              <div className="text-xs text-gray-400">ผู้เล่น</div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-400 font-bold text-lg flex items-center justify-center gap-1">
                                ⭐ {(4.2 + Math.random() * 0.7).toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-400">คะแนน</div>
                            </div>
                          </div>
                        </div>

                        {/* Play Button */}
                        <div
                          className={`
                        flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-xl text-center transition-all duration-300 text-base
                        ${
                          completed
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400"
                            : "bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400"
                        }
                        transform group-hover:scale-105 shadow-lg
                      `}
                        >
                          <PlayCircle size={18} />
                          {completed ? text.completed : text.play}
                        </div>
                      </div>
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

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 max-w-7xl mx-auto mt-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 min-h-[140px] mt-4 overflow-visible
                  ${
                    achievement.unlocked
                      ? "border-yellow-500/50 bg-yellow-500/10 shadow-lg shadow-yellow-500/20"
                      : "border-white/10 grayscale"
                  }
                  hover:scale-105 transform group
                `}
              >
                {achievement.unlocked && (
                  <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-1 z-10">
                    <CheckCircle className="text-black" size={12} />
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3
                    className={`font-bold mb-1 text-xs leading-tight ${
                      achievement.unlocked ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-tight mb-2">
                    {achievement.description}
                  </p>

                  {achievement.unlocked && (
                    <div className="text-xs text-green-400 font-semibold">
                      {achievement.reward}
                    </div>
                  )}

                  {!achievement.unlocked && (
                    <div className="mt-2 flex items-center justify-center">
                      <Lock className="text-gray-500" size={12} />
                    </div>
                  )}
                </div>

                {/* Hover tooltip */}
                {!achievement.unlocked && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    รางวัล: {achievement.reward}
                  </div>
                )}
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
            <div className="flex flex-wrap justify-center gap-4 mb-6">
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

            {/* Enhanced Pro Tips Section */}
            <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-xl p-8 mt-8 border border-yellow-500/20">
              <h4 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3 text-center justify-center">
                <span>💡</span> เคล็ดลับการทำแบบทดสอบ
              </h4>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🎯</span>
                    <h5 className="font-bold text-white">Score Challenge</h5>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• อ่านคำถามให้จบก่อนตอบ</li>
                    <li>• เริ่มต้นด้วยข้อที่มั่นใจที่สุด</li>
                    <li>• ใช้การกำจัดตัวเลือกที่ผิดชัด</li>
                  </ul>
                </div>

                <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">⚡</span>
                    <h5 className="font-bold text-white">Time Rush</h5>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• ตอบด้วยสัญชาตญาณ</li>
                    <li>• อ่านคำสำคัญในคำถาม</li>
                    <li>• ข้ามข้อยากไปทำข้อง่ายก่อน</li>
                  </ul>
                </div>

                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🎲</span>
                    <h5 className="font-bold text-white">Random Quiz</h5>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• เหมาะสำหรับการทบทวน</li>
                    <li>• ไม่ควรใช้เดาคำตอบ</li>
                    <li>• อ่านคำอธิบายเมื่อตอบผิด</li>
                  </ul>
                </div>
              </div>

              {/* Special Tips */}
              <div className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 rounded-lg p-6 border border-indigo-400/30">
                <h5 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                  <span>🎖️</span> เคล็ดลับการเรียนรู้
                </h5>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <span className="text-yellow-400 font-semibold">
                      📚 การทบทวน:
                    </span>
                    <p>
                      ทำแบบทดสอบสม่ำเสมอจะช่วยเสริมสร้างความจำระยะยาว
                    </p>
                  </div>
                  <div>
                    <span className="text-green-400 font-semibold">
                      🧠 การเข้าใจ:
                    </span>
                    <p>อ่านคำอธิบายหลังตอบผิดเพื่อเข้าใจแนวคิดที่ถูกต้อง</p>
                  </div>
                  <div>
                    <span className="text-blue-400 font-semibold">
                      📊 การติดตาม:
                    </span>
                    <p>
                      ดูความก้าวหน้าของตัวเองเพื่อปรับปรุงจุดที่ยังไม่แข็งแกร่ง
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-400 font-semibold">
                      🎯 การฝึกฝน:
                    </span>
                    <p>ฝึกทำแบบทดสอบแต่ละโหมดเพื่อเชี่ยวชาญทุกแบบ</p>
                  </div>
                </div>
              </div>

              {/* Daily Goals */}
              <div className="mt-6 text-center">
                <h5 className="text-lg font-bold text-yellow-400 mb-3">
                  🎯 เป้าหมายการเรียนรู้
                </h5>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="bg-yellow-600/20 text-yellow-300 px-4 py-2 rounded-full text-sm border border-yellow-500/30">
                    วันนี้: ทำ Score Challenge ได้คะแนน 80%+
                  </div>
                  <div className="bg-green-600/20 text-green-300 px-4 py-2 rounded-full text-sm border border-green-500/30">
                    สัปดาห์นี้: ลองทุกโหมดอย่างน้อย 1 ครั้ง
                  </div>
                  <div className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm border border-blue-500/30">
                    เดือนนี้: ทำแบบทดสอบติดต่อกัน 7 วัน
                  </div>
                </div>
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
