"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../client';
import { authManager } from '../../auth';

interface ApiContextType {
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  retryConnection: () => Promise<void>;
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

  const clearError = () => setError(null);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // ลองเชื่อมต่อ API - ใช้ simple request แทน health check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsOnline(true);
        setError(null);
        console.log('API server connected successfully');
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (err: any) {
      setIsOnline(false);
      
      if (err.name === 'AbortError') {
        setError('API connection timeout. Using offline mode.');
      } else if (err.message?.includes('fetch')) {
        setError('API server not available. Using offline mode.');
      } else {
        setError('API server not responding. Using offline mode.');
      }
      
      console.warn('API connection failed, using offline mode:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = async () => {
    await checkConnection();
  };

  useEffect(() => {
    // ตั้งค่า auth token หากมี (จาก localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.setAuthToken(token);
    }

    // ตรวจสอบการเชื่อมต่อครั้งแรก
    checkConnection();

    // ตรวจสอบการเชื่อมต่อทุก 60 วินาที (แทน 30 วินาที)
    const interval = setInterval(() => {
      // ตรวจสอบเฉพาะเมื่อ page visible และยังไม่ online
      if (!document.hidden && !isOnline) {
        checkConnection();
      }
    }, 60000);

    // ฟัง online/offline events
    const handleOnline = () => checkConnection();
    const handleOffline = () => {
      setIsOnline(false);
      setError('Internet connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value: ApiContextType = {
    isOnline,
    isLoading,
    error,
    clearError,
    retryConnection,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}
