"use client";
import { useState, useEffect } from "react";
import { friends, leaderboard, groupSessions, getOnlineFriends } from "../data/friends";
import { Friend } from "../types/friends";
import Navbar from "../components/layout/Navbar";
import ChatModal from "../components/ui/ChatModal";
import LoginModal from "../components/ui/LoginModal";
import { authManager, User as UserType } from "../lib/auth";
import { useUsers } from "../lib/api/hooks";
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  UserPlus, 
  Search, 
  Star,
  Clock,
  Play,
  Crown,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  User
} from "lucide-react";

type Tab = 'friends' | 'leaderboard' | 'groups' | 'badges';

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // API hooks - removed unused useUserProfile
  const { data: apiUsers, loading: usersLoading } = useUsers();
  // Removed useLeaderboard as it is not exported from "../lib/api/hooks"

  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอินเมื่อ component mount
    const checkAuthState = () => {
      const loggedIn = authManager.isLoggedIn();
      const user = authManager.getCurrentUser();
      setIsLoggedIn(loggedIn);
      setCurrentUser(user);
    };

    checkAuthState();

    // Listen for auth state changes
    const unsubscribe = authManager.onAuthStateChange((user) => {
      setIsLoggedIn(!!user);
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const openChat = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedFriend(null);
  };

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  const text = {
    title: "กับเพื่อน",
    subtitle: "เรียนรู้และเล่นร่วมกับเพื่อนๆ",
    loginRequired: {
      title: "เข้าสู่ระบบเพื่อใช้งานฟีเจอร์เพื่อน",
      subtitle: "ล็อกอินเพื่อดูรายชื่อเพื่อน แอดเพื่อน และแข่งขันกับผู้อื่น",
      loginButton: "เข้าสู่ระบบ",
      signUpText: "ยังไม่มีบัญชี? สมัครสมาชิก"
    },
    tabs: {
      friends: "เพื่อนๆ",
      leaderboard: "อันดับ",
      groups: "กลุ่ม",
      badges: "เหรียญรางวัล"
    },
    search: "ค้นหาเพื่อน...",
    addFriend: "เพิ่มเพื่อน",
    online: "ออนไลน์",
    offline: "ออฟไลน์",
    playing: "กำลังเล่น",
    lastSeen: "เห็นล่าสุด",
    level: "เลเวล",
    score: "คะแนน",
    activity: "กิจกรรม",
    joinGroup: "เข้าร่วม",
    createGroup: "สร้างกลุ่ม",
    participants: "ผู้เข้าร่วม",
    waiting: "รอผู้เข้าร่วม",
    active: "กำลังดำเนินการ",
    finished: "จบแล้ว"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'playing': return 'text-blue-400';
      case 'offline': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return text.online;
      case 'playing': return text.playing;
      case 'offline': return text.offline;
      default: return text.offline;
    }
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="text-green-400" size={16} />;
    if (change < 0) return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-gray-400" size={16} />;
  };

  const onlineFriends = getOnlineFriends();
  const filteredFriends = friends.filter(friend => 
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Users className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-4">{text.title}</h1>
          <p className="text-gray-300 text-base sm:text-lg px-4">{text.subtitle}</p>
        </div>

        {/* Navigation Tabs */}
        {isLoggedIn && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-white/20">
              <div className="flex space-x-2">
                {(Object.keys(text.tabs) as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-yellow-500 text-black'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {text.tabs[tab]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Login Required Section */}
        {!isLoggedIn && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Users className="text-yellow-400" size={40} />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                {text.loginRequired.title}
              </h2>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {text.loginRequired.subtitle}
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleShowLogin}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <User className="mr-3" size={24} />
                  {text.loginRequired.loginButton}
                </button>
                
                <p className="text-gray-400 text-sm">
                  {text.loginRequired.signUpText}
                </p>
              </div>

              {/* Features Preview */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="text-green-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">เพิ่มเพื่อน</h3>
                  <p className="text-gray-400 text-sm">ค้นหาและเพิ่มเพื่อนใหม่</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="text-blue-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">กระดานคะแนน</h3>
                  <p className="text-gray-400 text-sm">แข่งขันกับเพื่อนๆ</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="text-purple-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">แชทกลุ่ม</h3>
                  <p className="text-gray-400 text-sm">สื่อสารกับเพื่อนๆ</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Friends Tab */}
        {isLoggedIn && activeTab === 'friends' && (
          <div className="max-w-6xl mx-auto">
            {/* Search and Add Friend */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={text.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-400 hover:to-blue-400 transition-all flex items-center">
                <UserPlus size={20} className="mr-2" />
                {text.addFriend}
              </button>
            </div>

            {/* Online Friends Summary */}
            <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-green-400/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                  <span className="text-white font-semibold">เพื่อนออนไลน์ {onlineFriends.length} คน</span>
                </div>
                <div className="flex -space-x-2">
                  {onlineFriends.slice(0, 5).map((friend) => (
                    <div key={friend.id} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border-2 border-green-400">
                      <span className="text-sm">{friend.avatar}</span>
                    </div>
                  ))}
                  {onlineFriends.length > 5 && (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border-2 border-green-400">
                      <span className="text-xs text-white">+{onlineFriends.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Friends List */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                          {friend.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                          friend.status === 'online' ? 'bg-green-400' : 
                          friend.status === 'playing' ? 'bg-blue-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-white">{friend.displayName}</h3>
                        <p className="text-gray-400 text-sm">@{friend.username}</p>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                      title="ส่งข้อความ"
                      aria-label={`ส่งข้อความให้ ${friend.displayName}`}
                      onClick={() => openChat(friend)}
                    >
                      <MessageCircle size={20} />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{text.level}:</span>
                      <span className="text-yellow-400 font-semibold">{friend.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{text.score}:</span>
                      <span className="text-blue-400 font-semibold">{friend.totalScore.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">สถานะ:</span>
                      <span className={`font-semibold ${getStatusColor(friend.status)}`}>
                        {getStatusText(friend.status)}
                      </span>
                    </div>
                  </div>

                  {friend.currentActivity && friend.status !== 'offline' && (
                    <div className="bg-blue-500/10 rounded-lg p-3 mb-4">
                      <p className="text-blue-300 text-sm">
                        <Play size={14} className="inline mr-2" />
                        {friend.currentActivity}
                      </p>
                    </div>
                  )}

                  {friend.status === 'offline' && (
                    <div className="text-center text-gray-400 text-sm">
                      <Clock size={14} className="inline mr-2" />
                      {text.lastSeen} {formatLastSeen(friend.lastSeen)}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {friend.badges.slice(0, 3).map((badge) => (
                      <div
                        key={badge.id}
                        className={`${getBadgeColor(badge.rarity)} text-white text-xs px-2 py-1 rounded-full flex items-center`}
                        title={badge.description}
                      >
                        <span className="mr-1">{badge.icon}</span>
                        {badge.name}
                      </div>
                    ))}
                    {friend.badges.length > 3 && (
                      <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                        +{friend.badges.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {/* Removed Leaderboard Tab as useLeaderboard is not available */}

        {/* Groups Tab */}
        {isLoggedIn && activeTab === 'groups' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">กลุ่มกิจกรรม</h2>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all">
                {text.createGroup}
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupSessions.map((session) => (
                <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{session.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        session.type === 'learning' ? 'bg-blue-500/20 text-blue-300' :
                        session.type === 'quiz' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {session.type === 'learning' ? 'การเรียน' : 
                         session.type === 'quiz' ? 'แบบทดสอบ' : 'เกม'}
                      </span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      session.status === 'active' ? 'bg-green-400 animate-pulse' :
                      session.status === 'waiting' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">ผู้จัด:</span>
                      <span className="text-white font-semibold">
                        {friends.find(f => f.id === session.hostId)?.displayName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{text.participants}:</span>
                      <span className="text-blue-400 font-semibold">
                        {session.participants.length}/{session.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">สถานะ:</span>
                      <span className={`font-semibold ${
                        session.status === 'active' ? 'text-green-400' :
                        session.status === 'waiting' ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {session.status === 'active' ? text.active :
                         session.status === 'waiting' ? text.waiting : text.finished}
                      </span>
                    </div>
                  </div>

                  {/* Participants avatars */}
                  <div className="flex -space-x-2 mb-4">
                    {session.participants.map((participant) => (
                      <div key={participant.id} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border-2 border-gray-800">
                        <span className="text-sm">{participant.avatar}</span>
                      </div>
                    ))}
                    {session.participants.length < session.maxParticipants && (
                      <div className="w-8 h-8 bg-white/10 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">+</span>
                      </div>
                    )}
                  </div>

                  <button 
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      session.status === 'waiting' 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-400 hover:to-blue-400'
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    }`}
                    disabled={session.status !== 'waiting'}
                  >
                    {session.status === 'waiting' ? text.joinGroup : text.active}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Tab - Simple implementation */}
        {isLoggedIn && activeTab === 'badges' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">เหรียญรางวัลของคุณ</h2>
              <p className="text-gray-400">สะสมเหรียญรางวัลโดยการทำกิจกรรมต่างๆ</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends[0].badges.map((badge) => (
                <div key={badge.id} className={`${getBadgeColor(badge.rarity)} rounded-2xl p-6 text-white`}>
                  <div className="text-center">
                    <div className="text-4xl mb-4">{badge.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                    <p className="text-sm opacity-90 mb-4">{badge.description}</p>
                    <div className="text-xs opacity-75">
                      ปลดล็อกแล้ว
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

      {/* Chat Modal */}
      {selectedFriend && (
        <ChatModal 
          friend={selectedFriend} 
          isOpen={isChatOpen} 
          onClose={closeChat} 
        />
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
}
