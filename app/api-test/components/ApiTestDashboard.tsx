import React, { useState, useEffect } from 'react';
import { 
  courseService, 
  courseDetailService, 
  courseLessonService, 
  stageService, 
  lessonService, 
  orderService, 
  userService, 
  answerService, 
  authService 
} from '../../lib/api/services';

// API Testing Component
export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  // Update token info when component mounts and after auth operations
  const updateTokenInfo = () => {
    const info = authService.getTokenInfo();
    const token = authService.getAuthToken();
    if (info.hasToken && token) {
      // Determine which storage key has the token
      let storageKey = 'none';
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('astronomy_app_token')) storageKey = 'astronomy_app_token';
        else if (localStorage.getItem('authToken')) storageKey = 'authToken';
        else if (localStorage.getItem('token')) storageKey = 'token';
      }
      
      setTokenInfo({
        userId: authService.getCurrentUser()?.id || 'N/A',
        email: authService.getCurrentUser()?.email || 'N/A',
        role: authService.getCurrentUser()?.role || 'N/A',
        storageKey: storageKey,
        token: token,
        tokenPreview: info.tokenPreview
      });
    } else {
      setTokenInfo(null);
    }
  };

  useEffect(() => {
    updateTokenInfo();
  }, []);

  const runTests = async () => {
    setLoading(true);
    const results: Record<string, any> = {};

    try {
      // Test Course APIs
      console.log('Testing Course APIs...');
      try {
        const courses = await courseService.getAllCourses();
        results.courses = { success: true, data: courses };
      } catch (error) {
        results.courses = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Course Detail APIs
      console.log('Testing Course Detail APIs...');
      try {
        const courseDetails = await courseDetailService.getAllCourseDetails();
        results.courseDetails = { success: true, data: courseDetails };
      } catch (error) {
        results.courseDetails = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Course Lesson APIs
      console.log('Testing Course Lesson APIs...');
      try {
        const courseLessons = await courseLessonService.getAllCourseLessons();
        results.courseLessons = { success: true, data: courseLessons };
      } catch (error) {
        results.courseLessons = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Stage APIs
      console.log('Testing Stage APIs...');
      try {
        const stages = await stageService.getAllStages();
        results.stages = { success: true, data: stages };
      } catch (error) {
        results.stages = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Lesson APIs
      console.log('Testing Lesson APIs...');
      try {
        const lessons = await lessonService.getAllLessons();
        results.lessons = { success: true, data: lessons };
      } catch (error) {
        results.lessons = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Order APIs
      console.log('Testing Order APIs...');
      try {
        const orders = await orderService.getAllOrders();
        results.orders = { success: true, data: orders };
      } catch (error) {
        results.orders = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test User APIs (protected)
      console.log('Testing User APIs (protected)...');
      try {
        const users = await userService.getAllUsers();
        results.users = { success: true, data: users, protected: true };
      } catch (error) {
        results.users = { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          protected: true,
          needsAuth: error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))
        };
      }

      // Test Answer APIs
      console.log('Testing Answer APIs...');
      try {
        const answers = await answerService.getAllAnswers();
        results.answers = { success: true, data: answers };
      } catch (error) {
        results.answers = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Authentication (without credentials to avoid errors)
      console.log('Testing Auth System...');
      try {
        const isAuth = authService.isAuthenticated();
        const currentUser = authService.getCurrentUser();
        results.auth = { 
          success: true, 
          data: { 
            isAuthenticated: isAuth, 
            currentUser: currentUser,
            hasToken: !!authService.getAuthToken()
          } 
        };
      } catch (error) {
        results.auth = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

    } catch (error) {
      console.error('Overall test error:', error);
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  const testCreate = async () => {
    setLoading(true);
    
    try {
      // Test creating a new course
      const newCourse = await courseService.createCourse({
        title: 'Test Course from Frontend',
        description: 'This is a test course created from the frontend',
        price: 99,
        duration: '30 days',
        isActive: true,
        level: 'Fundamental'
      });
      
      console.log('Created course:', newCourse);
      alert('Course created successfully! Check console for details.');
      
      // Refresh the course list
      await runTests();
    } catch (error) {
      console.error('Failed to create course:', error);
      alert(`Failed to create course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setLoading(false);
  };

  const testAuth = async () => {
    setLoading(true);
    
    try {
      // Test login with demo credentials
      const loginResult = await authService.login({
        email: 'Tum@gmail.com',
        password: '123456'
      });
      
      console.log('Login result:', loginResult);
      
      if (loginResult.success && loginResult.token) {
        alert('Login successful! Token saved. Now you can test protected endpoints.');
        updateTokenInfo(); // Update token info after successful login
      } else {
        alert('Login failed: ' + (loginResult.message || 'Unknown error'));
      }
      
      // Refresh tests to check token status
      await runTests();
    } catch (error) {
      console.error('Login test failed:', error);
      alert(`Login test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setLoading(false);
  };

  const testWithDemoToken = async () => {
    setLoading(true);
    
    try {
      // Set demo token for testing
      const demoToken = 'demo-jwt-token-for-testing-purposes';
      authService.setToken(demoToken);
      
      updateTokenInfo(); // Update token info after setting demo token
      console.log('Demo token set:', authService.getTokenInfo());
      alert('Demo token set! You can now test protected endpoints.');
      
      // Test protected endpoint
      await runTests();
    } catch (error) {
      console.error('Demo token test failed:', error);
      alert(`Demo token test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setLoading(false);
  };

  const clearTokens = async () => {
    try {
      await authService.logout();
      updateTokenInfo(); // Update token info after clearing tokens
      alert('All tokens cleared!');
      await runTests();
    } catch (error) {
      console.error('Clear tokens failed:', error);
      alert(`Clear tokens failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                API Integration Dashboard
              </h1>
              <p className="text-gray-600">
                Test and monitor API endpoints in real-time
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Controls</h2>
          {loading && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-blue-700 text-sm font-medium">Testing in progress...</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={runTests}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span className={loading ? 'animate-spin' : ''}>
                {loading ? '⏳' : '🔄'}
              </span>
              {loading ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <button
              onClick={testCreate}
              disabled={loading}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span>➕</span>
              Test Create Course
            </button>
            
            <button
              onClick={testAuth}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span>🔐</span>
              Test Login
            </button>

            <button
              onClick={testWithDemoToken}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span>🎯</span>
              Set Demo Token
            </button>

            <button
              onClick={clearTokens}
              disabled={loading}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span>🗑️</span>
              Clear Tokens
            </button>
          </div>

          {/* Current Auth Status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Authentication Status:</h3>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Authenticated:</span>
                <span className={authService.isAuthenticated() ? 'text-green-600 font-medium' : 'text-red-600'}>
                  {authService.isAuthenticated() ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Current User:</span>
                <span className="text-gray-800">
                  {authService.getCurrentUser()?.name || 'None'}
                </span>
              </div>
              {tokenInfo && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">User ID:</span>
                    <span className="text-gray-800 font-mono text-xs">{tokenInfo.userId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-800">{tokenInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Role:</span>
                    <span className="text-blue-600 font-medium">{tokenInfo.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Storage:</span>
                    <span className="text-purple-600 font-medium">{tokenInfo.storageKey}</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Token:</span>
                <span className={authService.getAuthToken() ? 'text-green-600' : 'text-red-600'}>
                  {authService.getTokenInfo().hasToken ? 
                    `✅ ${authService.getTokenInfo().tokenPreview}` : 
                    '❌ No token'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(testResults).length}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter((r: any) => r.success).length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter((r: any) => !r.success).length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(testResults).length > 0 
                    ? Math.round((Object.values(testResults).filter((r: any) => r.success).length / Object.keys(testResults).length) * 100) 
                    : 0}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Results Grid */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
          
          {loading && Object.keys(testResults).length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Running API tests...</p>
                <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
              </div>
            </div>
          ) : Object.keys(testResults).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No test results yet</p>
              <p className="text-sm mt-2">Click "Run All Tests" to start testing APIs</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  
                  <div className={`text-xs mb-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? '✅ Success' : '❌ Failed'}
                  </div>
                  
                  {result.success ? (
                    <div className="text-gray-500 text-xs">
                      <div>✓ Response received</div>
                      {result.data && typeof result.data === 'object' && (
                        <div className="mt-2">
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:text-blue-800">View Data</summary>
                            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-red-600 text-xs">
                      <div className="truncate" title={result.error}>
                        {result.error}
                      </div>
                      {result.protected && result.needsAuth && (
                        <div className="mt-1 text-orange-600 text-xs">
                          🔒 This endpoint requires authentication. Try logging in first.
                        </div>
                      )}
                      {result.protected && !result.needsAuth && (
                        <div className="mt-1 text-blue-600 text-xs">
                          🛡️ This is a protected endpoint
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Endpoints Documentation */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Course APIs</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• GET /course/all</li>
                <li>• POST /course/create</li>
                <li>• GET /course/getCourse/:id</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Stage APIs</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• GET /stage/getAll</li>
                <li>• GET /stage/getById/:id</li>
                <li>• POST /stage/create</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Lesson APIs</h3>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• GET /lesson/getAll</li>
                <li>• GET /lesson/getById/:id</li>
                <li>• POST /lesson/createLesson</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-2">Order APIs</h3>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• GET /order/getOrder</li>
                <li>• POST /order/createOrder</li>
                <li>• DELETE /order/deleteOrder/:id</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-medium text-indigo-900 mb-2">User APIs</h3>
              <ul className="text-xs text-indigo-700 space-y-1">
                <li>• GET /users/get</li>
                <li>• POST /users/create</li>
              </ul>
            </div>
            
            <div className="bg-pink-50 rounded-lg p-4">
              <h3 className="font-medium text-pink-900 mb-2">Answer APIs</h3>
              <ul className="text-xs text-pink-700 space-y-1">
                <li>• GET /answer/get</li>
                <li>• POST /answer/create</li>
              </ul>
            </div>
            
            <div className="bg-teal-50 rounded-lg p-4">
              <h3 className="font-medium text-teal-900 mb-2">Course Detail APIs</h3>
              <ul className="text-xs text-teal-700 space-y-1">
                <li>• GET /courseDetail/all</li>
                <li>• POST /courseDetail/create</li>
                <li>• DELETE /courseDetail/delete/:id</li>
              </ul>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">Authentication</h3>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• POST /login/users</li>
                <li>• Local storage</li>
                <li>• Token handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}