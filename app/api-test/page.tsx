"use client";
import React, { useState } from 'react';
import { useApiContext } from '../lib/api/providers/ApiProvider';
import { useUsers, useStages, useCourses, useLeaderboard } from '../lib/api/hooks';
import { Monitor, Database, Wifi, WifiOff, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { userService } from '../lib/api/services/userService';
import { authManager } from '../lib/auth';

export default function ApiTestPage() {
  const { isOnline, isLoading, error, retryConnection } = useApiContext();
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // API hooks for testing
  const usersQuery = useUsers();
  const stagesQuery = useStages();
  const coursesQuery = useCourses();
  const leaderboardQuery = useLeaderboard();

  const apiTests = [
    { name: 'Users API', hook: usersQuery, endpoint: '/users/get' },
    { name: 'Stages API', hook: stagesQuery, endpoint: '/stage/get' },
    { name: 'Courses API', hook: coursesQuery, endpoint: '/course/get' },
    { name: 'Leaderboard API', hook: leaderboardQuery, endpoint: '/answer/leaderboard/get' },
  ];

  const testApiEndpoint = async (endpoint: string) => {
    try {
      console.log(`Testing endpoint: ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}${endpoint}`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}${endpoint}`);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Response data:`, data);
      
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
      console.error(`Error testing ${endpoint}:`, err);
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

  // Add new test functions
  const testCreateUser = async () => {
    try {
      const userData = {
        name: "Test User " + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: "123456"
      };
      
      console.log('Creating user:', userData);
      const result = await userService.createUser(userData);
      console.log('Create user result:', result);
      setTestResults(prev => ({ ...prev, createUser: result }));
      alert('User created successfully! Check console for details.');
    } catch (error) {
      console.error('Create user error:', error);
      setTestResults(prev => ({ ...prev, createUser: { error: (error as any).message } }));
      alert('Error creating user: ' + (error as any).message);
    }
  };

  const testAuthSignUp = async () => {
    try {
      const signUpData = {
        name: "Auth Test User " + Date.now(),
        email: `authtest${Date.now()}@example.com`,
        password: "123456"
      };
      
      console.log('Auth sign up:', signUpData);
      const result = await authManager.signUp(signUpData);
      console.log('Auth sign up result:', result);
      setTestResults(prev => ({ ...prev, authSignUp: result }));
      alert(`Auth sign up: ${result.success ? 'Success' : 'Failed'} - ${result.message}`);
    } catch (error) {
      console.error('Auth sign up error:', error);
      setTestResults(prev => ({ ...prev, authSignUp: { error: (error as any).message } }));
      alert('Auth sign up error: ' + (error as any).message);
    }
  };

  const testAuthLogin = async () => {
    try {
      // สร้างผู้ใช้ก่อน
      const testUser = {
        name: "Login Test User",
        email: "logintest@example.com", 
        password: "123456"
      };
      
      console.log('Creating test user for login:', testUser);
      const createResult = await userService.createUser(testUser);
      console.log('Create user result:', createResult);
      
      // ลอง login
      console.log('Testing login with:', { email: testUser.email, password: testUser.password });
      const loginResult = await authManager.login({ 
        email: testUser.email, 
        password: testUser.password 
      });
      console.log('Login result:', loginResult);
      
      setTestResults(prev => ({ 
        ...prev, 
        testLogin: { 
          createUser: createResult, 
          login: loginResult 
        } 
      }));
      
      alert(`Login test: ${loginResult.success ? 'Success' : 'Failed'} - ${loginResult.message}`);
    } catch (error) {
      console.error('Login test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        testLogin: { error: (error as any).message } 
      }));
      alert('Login test error: ' + (error as any).message);
    }
  };

  const testDirectLogin = async () => {
    try {
      console.log('Testing direct login API call...');
      const result = await userService.loginUser('Tum@gmail.com', '123456');
      console.log('Direct login result:', result);
      setTestResults(prev => ({ ...prev, directLogin: result }));
      alert('Direct login test completed - check console for details');
    } catch (error) {
      console.error('Direct login error:', error);
      setTestResults(prev => ({ ...prev, directLogin: { error: (error as any).message } }));
      alert('Direct login error: ' + (error as any).message);
    }
  };

  const testLoginEndpoint = async () => {
    try {
      console.log('Testing /login/users endpoint directly...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'}/login/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: 'Tum@gmail.com',
          password: '123456'
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = { rawResponse: responseText };
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        loginEndpointTest: { 
          status: response.status, 
          ok: response.ok,
          data: result 
        } 
      }));
      
      alert(`Login endpoint test:\nStatus: ${response.status}\nOK: ${response.ok}\nCheck console for details`);
    } catch (error) {
      console.error('Login endpoint test error:', error);
      setTestResults(prev => ({ 
        ...prev, 
        loginEndpointTest: { error: (error as any).message } 
      }));
      alert('Login endpoint test error: ' + (error as any).message);
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

        {/* New User Registration Tests */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="mr-3" size={24} />
            User Registration Tests
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={testCreateUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mr-4 transition-colors"
            >
              Test Create User (Direct API)
            </button>
            <button
              onClick={testAuthSignUp}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded mr-4 transition-colors"
            >
              Test Auth Sign Up (via AuthManager)
            </button>
            <br />
            <button
              onClick={testAuthLogin}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mr-4 transition-colors"
            >
              Test Auth Login (Full Flow)
            </button>
            <button
              onClick={testDirectLogin}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded mr-4 transition-colors"
            >
              Test Direct Login API
            </button>
            <button
              onClick={testLoginEndpoint}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded transition-colors"
            >
              Test /login/users Endpoint
            </button>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-white font-medium mb-2">Test Results:</h3>
              <pre className="text-gray-300 text-sm overflow-auto max-h-40">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          {/* Current Auth Status */}
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <h3 className="text-white font-medium mb-2">Current Auth Status:</h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p>Logged in: <span className={authManager.isLoggedIn() ? 'text-green-400' : 'text-red-400'}>
                {authManager.isLoggedIn() ? 'Yes' : 'No'}
              </span></p>
              <p>Current user: {authManager.getCurrentUser()?.name || 'None'}</p>
              <p>Token: <span className={authManager.getToken() ? 'text-green-400' : 'text-red-400'}>
                {authManager.getToken() ? 'Available' : 'None'}
              </span></p>
            </div>
          </div>
        </div>

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
