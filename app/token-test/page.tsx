"use client";
import { useState, useEffect } from 'react';
import { authManager } from '../lib/auth';
import { useTokenMonitor } from '../lib/hooks/useTokenMonitor';

export default function TokenTestPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const { getTimeUntilExpiry, isTokenValid } = useTokenMonitor();

  const updateTokenInfo = () => {
    if (authManager.isLoggedIn()) {
      setTokenInfo({
        isLoggedIn: authManager.isLoggedIn(),
        isTokenValid: isTokenValid(),
        timeUntilExpiry: getTimeUntilExpiry(),
        tokenExpiry: authManager.getTokenExpiry(),
        currentTime: new Date(),
        user: authManager.getCurrentUser()
      });
    } else {
      setTokenInfo(null);
    }
  };

  useEffect(() => {
    // อัปเดตครั้งแรก
    updateTokenInfo();
    
    // ตั้ง interval สำหรับอัปเดตข้อมูล
    const interval = setInterval(updateTokenInfo, 1000);
    
    return () => clearInterval(interval);
  }, []); // ลบ dependencies ทั้งหมดออกเพื่อป้องกัน infinite loop

  const formatTime = (ms: number | null) => {
    if (!ms || ms <= 0) return 'หมดอายุแล้ว';
    
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const setShortExpiry = () => {
    if (typeof window !== 'undefined') {
      // ตั้งให้หมดอายุใน 2 นาที
      const shortExpiry = new Date(Date.now() + 2 * 60 * 1000);
      localStorage.setItem('astronomy_app_token_expiry', shortExpiry.toISOString());
      updateTokenInfo();
    }
  };

  const extendToken = () => {
    authManager.refreshTokenExpiry();
    updateTokenInfo();
  };

  if (!authManager.isLoggedIn()) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Token Expiry Test</h1>
          <div className="bg-red-900 p-6 rounded-lg">
            <p className="text-xl">❌ ไม่ได้ล็อกอิน</p>
            <p className="text-gray-300 mt-2">กรุณาล็อกอินก่อนทดสอบ token expiry</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Token Expiry Test</h1>
        
        {tokenInfo && (
          <div className="space-y-6">
            {/* Token Status */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Token Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Is Logged In:</span>
                  <span className={`ml-2 font-bold ${tokenInfo.isLoggedIn ? 'text-green-400' : 'text-red-400'}`}>
                    {tokenInfo.isLoggedIn ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Is Token Valid:</span>
                  <span className={`ml-2 font-bold ${tokenInfo.isTokenValid ? 'text-green-400' : 'text-red-400'}`}>
                    {tokenInfo.isTokenValid ? '✅ Valid' : '❌ Invalid'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Time Until Expiry:</span>
                  <span className={`ml-2 font-bold font-mono ${
                    tokenInfo.timeUntilExpiry && tokenInfo.timeUntilExpiry > 5 * 60 * 1000 
                      ? 'text-green-400' 
                      : tokenInfo.timeUntilExpiry && tokenInfo.timeUntilExpiry > 0 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                  }`}>
                    {formatTime(tokenInfo.timeUntilExpiry)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Token Expiry:</span>
                  <span className="ml-2 font-mono text-blue-400">
                    {tokenInfo.tokenExpiry?.toLocaleString() || 'ไม่มี'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">User Info</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="ml-2 text-white">{tokenInfo.user?.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="ml-2 text-white">{tokenInfo.user?.email}</span>
                </div>
                <div>
                  <span className="text-gray-400">User ID:</span>
                  <span className="ml-2 text-white">{tokenInfo.user?.id}</span>
                </div>
              </div>
            </div>

            {/* Time Info */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Time Info</h2>
              <div>
                <span className="text-gray-400">Current Time:</span>
                <span className="ml-2 font-mono text-blue-400">
                  {tokenInfo.currentTime.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Test Controls */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
              <div className="space-x-4">
                <button
                  onClick={setShortExpiry}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition-colors"
                >
                  🕐 ตั้งให้หมดอายุใน 2 นาที
                </button>
                <button
                  onClick={extendToken}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium transition-colors"
                >
                  🔄 ขยายเวลา Token
                </button>
                <button
                  onClick={() => authManager.logout()}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-medium transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}