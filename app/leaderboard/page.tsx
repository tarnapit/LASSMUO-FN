"use client";
import { useState, useEffect } from "react";
import { Trophy, Star, Target, Medal, Crown, Users } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { progressManager } from "../lib/progress";
import { authManager } from "../lib/auth";
import { useLeaderboard } from "../lib/api/hooks";

interface LeaderboardEntry {
  username: string;
  totalStars: number;
  totalPoints: number;
  completedStages: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [userProgress, setUserProgress] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // API hooks - removed unused useUserProfile
  const { data: apiLeaderboard, loading: leaderboardLoading } = useLeaderboard();

  useEffect(() => {
    const progress = progressManager.getProgress();
    setUserProgress(progress);
    
    const user = authManager.getCurrentUser();
    setCurrentUser(user);
    setIsLoggedIn(!!user);
  }, []);

  // Mock leaderboard data - ในระบบจริงจะดึงจาก API
  const mockLeaderboard: LeaderboardEntry[] = [
    { username: "StarMaster", totalStars: 15, totalPoints: 1500, completedStages: 5, rank: 1 },
    { username: "SpaceExplorer", totalStars: 13, totalPoints: 1300, completedStages: 5, rank: 2 },
    { username: "CosmicLearner", totalStars: 12, totalPoints: 1200, completedStages: 4, rank: 3 },
    { username: "AstroStudent", totalStars: 10, totalPoints: 1000, completedStages: 4, rank: 4 },
    { username: "UniverseSeeker", totalStars: 9, totalPoints: 900, completedStages: 3, rank: 5 },
  ];

  // ใช้ API leaderboard หากมี หรือใช้ mock data
  const leaderboardData = apiLeaderboard?.data || mockLeaderboard;

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="text-yellow-400" size={24} />;
      case 2: return <Medal className="text-gray-400" size={24} />;
      case 3: return <Medal className="text-orange-400" size={24} />;
      default: return <Trophy className="text-blue-400" size={20} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2: return "bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30";
      case 3: return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30";
      default: return "bg-slate-800/50 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 px-4">
            🏆 บอร์ดผู้นำ
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 px-4">
            ดูอันดับของนักเรียนดาราศาสตร์ที่เก่งที่สุด
          </p>
        </div>

        {/* Your Progress */}
        {userProgress && (
          <div className="mb-8 sm:mb-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 sm:p-6 border border-blue-500/30">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
              <Users className="mr-2 text-blue-400" size={20} />
              ผลการเรียนรู้ของคุณ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="text-yellow-400 mr-2" size={24} />
                  <span className="text-3xl font-bold text-white">{userProgress.totalStars}</span>
                </div>
                <p className="text-gray-300">ดาวที่เก็บได้</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="text-green-400 mr-2" size={24} />
                  <span className="text-3xl font-bold text-white">{userProgress.totalPoints}</span>
                </div>
                <p className="text-gray-300">คะแนนรวม</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="text-purple-400 mr-2" size={24} />
                  <span className="text-3xl font-bold text-white">{userProgress.completedStages.length}</span>
                </div>
                <p className="text-gray-300">ด่านที่ผ่าน</p>
              </div>
            </div>
            
            {!isLoggedIn && (
              <div className="mt-4 text-center">
                <p className="text-yellow-400 text-sm">
                  💡 ล็อกอินเพื่อแข่งขันกับผู้เล่นคนอื่น!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🌟 อันดับผู้เล่น
          </h2>
          
          <div className="space-y-4">
            {leaderboardData.map((entry, index) => {
              // แปลง API data structure ให้เข้ากับ local structure
              const displayEntry = apiLeaderboard?.data ? {
                username: (entry as any).userName || (entry as any).username,
                totalStars: (entry as any).totalScore || (entry as any).totalStars || 0,
                totalPoints: (entry as any).totalScore || (entry as any).totalPoints || 0,
                completedStages: (entry as any).totalAnswers || (entry as any).completedStages || 0,
                rank: (entry as any).rank || index + 1
              } : entry as LeaderboardEntry;
              
              return (
              <div
                key={index}
                className={`rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${getRankColor(displayEntry.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getRankIcon(displayEntry.rank)}
                    <div>
                      <h3 className="text-xl font-bold text-white">{displayEntry.username}</h3>
                      <p className="text-gray-400">อันดับ {displayEntry.rank}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="text-yellow-400 mr-1" size={16} />
                        <span className="text-white font-semibold">{displayEntry.totalStars}</span>
                      </div>
                      <p className="text-gray-400 text-xs">ดาว</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="text-green-400 mr-1" size={16} />
                        <span className="text-white font-semibold">{displayEntry.totalPoints}</span>
                      </div>
                      <p className="text-gray-400 text-xs">คะแนน</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Trophy className="text-purple-400 mr-1" size={16} />
                        <span className="text-white font-semibold">{displayEntry.completedStages}</span>
                      </div>
                      <p className="text-gray-400 text-xs">ด่าน</p>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Motivation Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              🚀 เป้าหมายของคุณ
            </h3>
            <p className="text-gray-300 mb-4">
              เรียนรู้ให้มากขึ้นเพื่อขึ้นสู่อันดับที่สูงขึ้น!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-yellow-400 text-lg font-semibold">เป้าหมายถัดไป</div>
                <div className="text-white text-2xl font-bold">⭐ 15 ดาว</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-green-400 text-lg font-semibold">เป้าหมายสูงสุด</div>
                <div className="text-white text-2xl font-bold">🏆 อันดับ 1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
