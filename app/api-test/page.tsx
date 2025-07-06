"use client";
import React, { useState } from 'react';
import { useApiContext } from '../lib/api/providers/ApiProvider';
import { useUsers, useStages, useCourses, useLeaderboard } from '../lib/api/hooks';
import { Monitor, Database, Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function ApiTestPage() {
  const { isOnline, isLoading, error, retryConnection } = useApiContext();
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // API hooks for testing
  const usersQuery = useUsers();
  const stagesQuery = useStages();
  const coursesQuery = useCourses();
  const leaderboardQuery = useLeaderboard();

  const apiTests = [
    { name: 'Users API', hook: usersQuery, endpoint: '/users' },
    { name: 'Stages API', hook: stagesQuery, endpoint: '/stage' },
    { name: 'Courses API', hook: coursesQuery, endpoint: '/course' },
    { name: 'Leaderboard API', hook: leaderboardQuery, endpoint: '/answer/leaderboard' },
  ];

  const testApiEndpoint = async (endpoint: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}${endpoint}`);
      const data = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          success: response.ok,
          status: response.status,
          data: data,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          success: false,
          error: err.message,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Monitor className="mr-3" size={40} />
            API Testing Dashboard
          </h1>
          <p className="text-gray-400">ทดสอบการเชื่อมต่อ API และสถานะของระบบ</p>
        </div>

        {/* API Connection Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Database className="mr-3" size={24} />
            API Connection Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              isOnline ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isOnline ? <Wifi className="text-green-400 mr-2" size={20} /> : <WifiOff className="text-red-400 mr-2" size={20} />}
                  <span className="text-white font-medium">
                    {isOnline ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {isLoading && <RefreshCw className="animate-spin text-blue-400" size={16} />}
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-600 bg-gray-700/30">
              <div className="text-white font-medium">API URL</div>
              <div className="text-gray-400 text-sm mt-1">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-600 bg-gray-700/30">
              <div className="text-white font-medium">Status</div>
              <div className="text-gray-400 text-sm mt-1">
                {error || 'Ready'}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={retryConnection}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin mr-2" size={16} />
              ) : (
                <RefreshCw className="mr-2" size={16} />
              )}
              Test Connection
            </button>
          </div>
        </div>

        {/* API Hooks Testing */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="mr-3" size={24} />
            API Hooks Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiTests.map((test, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-600 bg-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{test.name}</h3>
                  <div className="flex items-center">
                    {test.hook.loading ? (
                      <RefreshCw className="animate-spin text-blue-400" size={16} />
                    ) : test.hook.error ? (
                      <XCircle className="text-red-400" size={16} />
                    ) : test.hook.data ? (
                      <CheckCircle className="text-green-400" size={16} />
                    ) : (
                      <div className="w-4 h-4 bg-gray-500 rounded-full" />
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mb-2">
                  Endpoint: {test.endpoint}
                </div>
                
                <div className="text-sm">
                  {test.hook.loading && <span className="text-blue-400">Loading...</span>}
                  {test.hook.error && <span className="text-red-400">Error: {test.hook.error}</span>}
                  {test.hook.data && (
                    <span className="text-green-400">
                      Data loaded ({Array.isArray(test.hook.data?.data) ? test.hook.data.data.length : 'object'} items)
                    </span>
                  )}
                  {!test.hook.loading && !test.hook.error && !test.hook.data && (
                    <span className="text-gray-400">Not tested</span>
                  )}
                </div>

                <button
                  onClick={() => testApiEndpoint(test.endpoint)}
                  className="mt-2 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  Test Manually
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">Manual Test Results</h2>
            
            <div className="space-y-4">
              {Object.entries(testResults).map(([endpoint, result]: [string, any]) => (
                <div key={endpoint} className="p-4 rounded-lg border border-gray-600 bg-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{endpoint}</h3>
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircle className="text-green-400" size={16} />
                      ) : (
                        <XCircle className="text-red-400" size={16} />
                      )}
                      <span className="ml-2 text-sm text-gray-400">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  {result.success ? (
                    <div className="text-sm text-green-400">
                      Status: {result.status} | Data: {JSON.stringify(result.data).substring(0, 100)}...
                    </div>
                  ) : (
                    <div className="text-sm text-red-400">
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">Instructions</h2>
          <div className="text-gray-300 space-y-2">
            <p>1. ตรวจสอบสถานะการเชื่อมต่อ API ที่ด้านบน</p>
            <p>2. หาก API ไม่เชื่อมต่อ ระบบจะทำงานในโหมด Offline โดยอัตโนมัติ</p>
            <p>3. คุณสามารถทดสอบ API endpoints แต่ละตัวได้ด้วยปุ่ม "Test Manually"</p>
            <p>4. ระบบจะแสดง status indicator ที่มุมขวาบนของหน้าจอ</p>
            <p>5. เมื่อ API server พร้อมใช้งาน ให้กดปุ่ม "Test Connection" เพื่อเชื่อมต่อใหม่</p>
          </div>
        </div>
      </div>
    </div>
  );
}
