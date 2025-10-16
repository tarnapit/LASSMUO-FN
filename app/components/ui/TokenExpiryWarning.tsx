"use client";
import React, { useState, useEffect } from 'react';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { useApiContext } from '../../lib/api/providers/ApiProvider';
import { authManager } from '../../lib/auth';

interface TokenExpiryWarningProps {
  className?: string;
}

export default function TokenExpiryWarning({ className = "" }: TokenExpiryWarningProps) {
  const { tokenTimeRemaining } = useApiContext();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!tokenTimeRemaining || tokenTimeRemaining <= 0) {
      setShowWarning(false);
      return;
    }

    // แสดง warning เมื่อเหลือเวลาน้อยกว่า 10 นาที
    const shouldShow = tokenTimeRemaining <= 10 * 60 * 1000; // 10 minutes
    setShowWarning(shouldShow);

    if (shouldShow) {
      // แปลงเวลาเป็น minute:second format
      const minutes = Math.floor(tokenTimeRemaining / (60 * 1000));
      const seconds = Math.floor((tokenTimeRemaining % (60 * 1000)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  }, [tokenTimeRemaining]);

  const handleExtendSession = () => {
    // รีเฟรช token expiry (ขยายเวลา)
    authManager.refreshTokenExpiry();
    setShowWarning(false);
  };

  const handleLogout = () => {
    authManager.logout();
  };

  if (!showWarning || !authManager.isLoggedIn()) {
    return null;
  }

  const isUrgent = tokenTimeRemaining && tokenTimeRemaining <= 5 * 60 * 1000; // 5 minutes

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`
        px-4 py-3 rounded-lg shadow-lg border-l-4 max-w-sm
        ${isUrgent 
          ? 'bg-red-50 border-red-500 text-red-800' 
          : 'bg-yellow-50 border-yellow-500 text-yellow-800'
        }
      `}>
        <div className="flex items-center gap-2 mb-2">
          <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`} />
          <h4 className="font-semibold text-sm">
            {isUrgent ? 'เซสชันกำลังจะหมดอายุ!' : 'เซสชันใกล้หมดอายุ'}
          </h4>
        </div>
        
        <p className="text-sm mb-3">
          เหลือเวลา: <span className="font-mono font-bold">{timeLeft}</span>
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={handleExtendSession}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium
              ${isUrgent 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }
              transition-colors duration-200
            `}
          >
            <RefreshCw className="w-3 h-3" />
            ขยายเวลา
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200"
          >
            <LogOut className="w-3 h-3" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}