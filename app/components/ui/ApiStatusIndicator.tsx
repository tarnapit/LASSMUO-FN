"use client";
import React from 'react';
import { useApiContext } from '../../lib/api/providers/ApiProvider';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ApiStatusIndicator() {
  const { isOnline, isLoading, error, clearError, retryConnection } = useApiContext();

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
        <RefreshCw className="animate-spin mr-2" size={16} />
        <span className="text-sm">กำลังเชื่อมต่อ API...</span>
      </div>
    );
  }

  if (error && !isOnline) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-left">
            <WifiOff className="mr-2" size={16} />
            <span className="text-sm">โหมดออฟไลน์</span>
          </div>
          <button
            onClick={retryConnection}
            className="ml-4 hover:bg-orange-600 rounded p-1 transition-colors"
            title="ลองเชื่อมต่อใหม่"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (isOnline) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
        <Wifi className="mr-2" size={16} />
        <span className="text-sm">เชื่อมต่อ API สำเร็จ</span>
      </div>
    );
  }

  return null;
}
