"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../client';
import { authManager } from '../../auth';
import { useTokenMonitor } from '../../hooks/useTokenMonitor';

// Debug import for development
if (process.env.NODE_ENV === 'development') {
  import('../../debug/tokenDebugger');
}

interface ApiContextType {
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  retryConnection: () => Promise<void>;
  tokenTimeRemaining: number | null;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}

interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenTimeRemaining, setTokenTimeRemaining] = useState<number | null>(null);
  
  // ใช้ token monitoring แต่ไม่เก็บ reference เพื่อป้องกัน dependency loop
  useTokenMonitor();

  const clearError = () => setError(null);

  const checkConnection = async () => {
    // ป้องกัน multiple calls ในเวลาเดียวกัน
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // ลองเชื่อมต่อ API - ใช้ users endpoint แทน health check เพราะ health endpoint อาจไม่มี
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      // ตรวจสอบว่า response เป็น JSON และมี status ที่ถูกต้อง
      if (response.ok || response.status === 200) {
        if (!isOnline) { // อัปเดตเฉพาะเมื่อ status เปลี่ยน
          setIsOnline(true);
          setError(null);
          console.log('API server connected successfully');
        }
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (err: any) {
      if (isOnline || !error) { // อัปเดตเฉพาะเมื่อ status เปลี่ยนหรือยังไม่มี error
        setIsOnline(false);
        
        if (err.name === 'AbortError') {
          setError('API connection timeout. Using offline mode.');
        } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          setError('API server not available. Using offline mode.');
        } else {
          setError('API server not responding. Using offline mode.');
        }
        
        console.warn('API connection failed, using offline mode:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = async () => {
    await checkConnection();
  };

  useEffect(() => {
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 ApiProvider useEffect running');
    }

    // ตั้งค่า auth token หากมี (จาก localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.setAuthToken(token);
    }

    // ตรวจสอบการเชื่อมต่อครั้งแรก
    checkConnection();

    // อัปเดต token time remaining
    const updateTokenTime = () => {
      if (authManager.isLoggedIn()) {
        const expiry = authManager.getTokenExpiry();
        if (expiry) {
          const timeRemaining = Math.max(0, expiry.getTime() - Date.now());
          setTokenTimeRemaining(timeRemaining);
        } else {
          setTokenTimeRemaining(null);
        }
      } else {
        setTokenTimeRemaining(null);
      }
    };

    // อัปเดตทุก 30 วินาที
    updateTokenTime();
    const tokenInterval = setInterval(updateTokenTime, 30000);

    // ตรวจสอบการเชื่อมต่อทุก 60 วินาที (เฉพาะเมื่อออฟไลน์)
    const interval = setInterval(() => {
      // ตรวจสอบเฉพาะเมื่อ page visible และยังไม่ online
      if (!document.hidden && !isOnline) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Retrying API connection...');
        }
        checkConnection();
      }
    }, 60000);

    // ฟัง online/offline events
    const handleOnline = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🌐 Network online, checking connection...');
      }
      checkConnection();
    };
    
    const handleOffline = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🌐 Network offline');
      }
      setIsOnline(false);
      setError('Internet connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 ApiProvider cleanup');
      }
      clearInterval(interval);
      clearInterval(tokenInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // ลบ dependency ทั้งหมดออกเพื่อป้องกัน infinite loop

  const value: ApiContextType = {
    isOnline,
    isLoading,
    error,
    clearError,
    retryConnection,
    tokenTimeRemaining,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}
