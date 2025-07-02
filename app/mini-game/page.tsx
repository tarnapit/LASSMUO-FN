"use client";
import Link from "next/link";
import { miniGames } from "../data/mini-games";
import Navbar from "../components/layout/Navbar";
import { Gamepad2, Clock, Star, Trophy, Zap } from "lucide-react";

export default function MiniGamePage() {
  const text = {
    title: "มินิเกม",
    subtitle: "เรียนรู้ไปกับเกมสนุกๆ",
    difficulty: "ความยาก:",
    time: "เวลา:",
    points: "คะแนน:",
    play: "เล่นเลย",
    easy: "ง่าย",
    medium: "ปานกลาง",
    hard: "ยาก"
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-green-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return text.easy;
      case 'Medium': return text.medium;
      case 'Hard': return text.hard;
      default: return text.easy;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Knowledge': return <Star className="text-blue-400" size={20} />;
      case 'Memory': return <Zap className="text-purple-400" size={20} />;
      case 'Puzzle': return <Trophy className="text-orange-400" size={20} />;
      case 'Action': return <Gamepad2 className="text-red-400" size={20} />;
      default: return <Star className="text-blue-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Gamepad2 className="text-yellow-400" size={48} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{text.title}</h1>
          <p className="text-gray-300 text-lg">{text.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {miniGames.map((game) => (
            <Link 
              key={game.id} 
              href={`/mini-game/${game.id}`}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-4xl">{game.thumbnail}</div>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(game.category)}
                    <span className="text-sm text-gray-400">{game.category}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {game.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {game.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{text.difficulty}</span>
                    <span className={`font-semibold ${getDifficultyColor(game.difficulty)}`}>
                      {getDifficultyText(game.difficulty)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-400">{text.time}</span>
                    </div>
                    <span className="text-gray-300">{game.estimatedTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Trophy size={16} className="text-yellow-400 mr-2" />
                      <span className="text-gray-400">{text.points}</span>
                    </div>
                    <span className="text-yellow-400 font-semibold">{game.points}</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold py-3 px-6 rounded-lg text-center group-hover:from-yellow-400 group-hover:to-orange-400 transition-all">
                  {text.play}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Fun Stats Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">สถิติที่น่าสนใจ</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-3xl text-blue-400 mb-2">🌟</div>
              <div className="text-2xl font-bold text-white mb-1">1,000+</div>
              <div className="text-gray-400">ครั้งที่เล่น</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-3xl text-green-400 mb-2">⏱️</div>
              <div className="text-2xl font-bold text-white mb-1">5 นาที</div>
              <div className="text-gray-400">เวลาเฉลี่ยต่อเกม</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-3xl text-yellow-400 mb-2">🏆</div>
              <div className="text-2xl font-bold text-white mb-1">850</div>
              <div className="text-gray-400">คะแนนสูงสุด</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-3/4 right-1/6 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  );
}
