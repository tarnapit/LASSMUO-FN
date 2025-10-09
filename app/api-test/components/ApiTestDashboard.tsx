import React, { useState, useEffect } from 'react';
import { 
  courseService, 
  courseDetailService, 
  courseLessonService,
  courseQuizService,
  coursePostestService,
  stageService, 
  questionService,
  userService,
  userCourseProgressService,
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

      // Test Course Quiz APIs
      console.log('Testing Course Quiz APIs...');
      try {
        const courseQuizzes = await courseQuizService.getAllCourseQuizzes();
        results.courseQuizzes = { success: true, data: courseQuizzes };
      } catch (error) {
        results.courseQuizzes = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Course Postest APIs
      console.log('Testing Course Postest APIs...');
      try {
        const coursePostests = await coursePostestService.getAllCoursePostests();
        results.coursePostests = { success: true, data: coursePostests };
      } catch (error) {
        results.coursePostests = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test Stage APIs
      console.log('Testing Stage APIs...');
      try {
        const stages = await stageService.getAllStages();
        results.stages = { success: true, data: stages };
      } catch (error) {
        results.stages = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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

      // Test Question APIs (New - replaces some Order functionality)
      console.log('Testing Question APIs...');
      try {
        const questions = await questionService.getAllQuestions();
        results.questions = { success: true, data: questions };
      } catch (error) {
        results.questions = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test User Course Progress APIs (New)
      console.log('Testing User Course Progress APIs...');
      try {
        const userProgress = await userCourseProgressService.getAllUserCourseProgress();
        results.userCourseProgress = { success: true, data: userProgress };
      } catch (error) {
        results.userCourseProgress = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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

  const testCreatePostest = async () => {
    setLoading(true);
    
    try {
      // Test creating a new course postest
      const newPostest = await coursePostestService.createCoursePostest({
        courseId: 'ba3fd565-dc81-4e74-b253-ef0a4074f8cf', // Solar System course ID
        title: 'Test Postest from Frontend',
        description: 'This is a test postest created from the frontend',
        timeLimit: 1800, // 30 minutes
        passingScore: 70,
        maxAttempts: 3,
        question: {
          type: 'multiple-choice',
          questions: [
            {
              id: 1,
              question: 'ระบบสุริยะมีดาวเคราะห์กี่ดวง?',
              options: ['7 ดวง', '8 ดวง', '9 ดวง', '10 ดวง'],
              correctAnswer: 1,
              explanation: 'ระบบสุริยะมีดาวเคราะห์ 8 ดวง'
            },
            {
              id: 2,
              question: 'ดาวเคราะห์ใดใกล้ดวงอาทิตย์ที่สุด?',
              options: ['ดาวพุธ', 'ดาวศุกร์', 'โลก', 'ดาวอังคาร'],
              correctAnswer: 0,
              explanation: 'ดาวพุธอยู่ใกล้ดวงอาทิตย์ที่สุด'
            }
          ]
        }
      });
      
      console.log('Created postest:', newPostest);
      alert('Course Postest created successfully! Check console for details.');
      
      // Refresh the test results
      await runTests();
    } catch (error) {
      console.error('Failed to create postest:', error);
      alert(`Failed to create postest: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setLoading(false);
  };

  const testPostestByCourse = async () => {
    setLoading(true);
    
    try {
      const courseId = 'ba3fd565-dc81-4e74-b253-ef0a4074f8cf'; // Solar System course ID
      console.log('Testing CoursePostest by courseId:', courseId);
      
      // Test getting postest by course ID
      const postestResponse = await coursePostestService.getCoursePostestsByCourseId(courseId);
      
      console.log('CoursePostest by course response:', postestResponse);
      
      if (postestResponse.success && postestResponse.data) {
        alert(`✅ Found ${postestResponse.data.length} postest(s) for Solar System course!\n\nDetails:\n${JSON.stringify(postestResponse.data, null, 2)}`);
      } else {
        alert(`❌ No postests found for course: ${courseId}\n\nError: ${postestResponse.error || 'Unknown error'}`);
      }
      
      // Refresh tests
      await runTests();
    } catch (error) {
      console.error('Postest by course test failed:', error);
      alert(`Postest by course test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const testServerConnection = async () => {
    setLoading(true);
    
    try {
      console.log('Testing backend server connection...');
      
      // Test basic connectivity to backend server
      const response = await fetch('http://localhost:8888', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const responseText = await response.text();
      console.log('Server connection test:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        responseText: responseText
      });
      
      if (response.ok) {
        alert('✅ Server connection successful! Backend is running on port 8888.');
      } else {
        // ตรวจสอบ error messages ที่เฉพาะเจาะจง
        let errorDetails = '';
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error && errorData.error.includes('findMany')) {
            errorDetails = '\n\n🔧 Database Error Detected:\n- Backend server is running but database connection failed\n- Please check if your database is running\n- Verify Prisma client configuration\n- Check environment variables (DATABASE_URL)';
          } else if (errorData.error && errorData.error.includes('Cannot read properties of undefined')) {
            errorDetails = '\n\n⚙️ Backend Configuration Error:\n- ORM/Database client not properly initialized\n- Check backend startup logs\n- Restart backend server\n- Verify all dependencies are installed';
          } else if (errorData.error && (errorData.error.includes('character') || errorData.error.includes('prerequisites') || errorData.error.includes('include'))) {
            errorDetails = '\n\n🗄️ Prisma Schema Error Detected:\n- Database model relations are incorrectly defined\n- Fix schema.prisma file (Stage model relations)\n- Remove undefined relation fields\n- Run: npx prisma db push && npx prisma generate\n- Restart backend server';
          }
        } catch (e) {
          // Response is not JSON
        }
        
        alert(`⚠️ Server responded with status ${response.status}: ${response.statusText}${errorDetails}`);
      }
    } catch (error) {
      console.error('Server connection failed:', error);
      
      let errorMessage = '';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
          errorMessage = `❌ Cannot connect to backend server at http://localhost:8888

🔍 Possible causes:
• Backend server is not running
• Backend is running on different port
• Firewall blocking connection
• Network connectivity issues

💡 Solutions:
• Start your backend server (usually: npm run dev or npm start)
• Check if backend is running on port 8888
• Verify backend server logs for errors`;
        } else {
          errorMessage = `❌ Connection Error: ${error.message}`;
        }
      } else {
        errorMessage = '❌ Unknown connection error occurred';
      }
      
      alert(errorMessage);
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
              onClick={testCreatePostest}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span>📝</span>
              Test Create Postest
            </button>

            <button
              onClick={testPostestByCourse}
              disabled={loading}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span>🔍</span>
              Test Postest by Course
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
              onClick={testServerConnection}
              disabled={loading}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition-all font-medium"
            >
              <span>🔗</span>
              Test Server Connection
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
                      <div className="truncate mb-1" title={result.error}>
                        {result.error}
                      </div>
                      
                      {/* แสดงคำแนะนำสำหรับ error ที่พบบ่อย */}
                      {result.error.includes('findMany') && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-xs">
                          <div className="font-medium">💡 Backend Database Error:</div>
                          <div className="mt-1">
                            • ตรวจสอบว่า backend server กำลังทำงาน<br/>
                            • ตรวจสอบการเชื่อมต่อ database<br/>
                            • ตรวจสอบ Prisma client initialization
                          </div>
                        </div>
                      )}
                      
                      {(result.error.includes('character') || result.error.includes('prerequisites') || result.error.includes('schema')) && (
                        <div className="mt-2 p-2 bg-purple-50 rounded text-purple-700 text-xs">
                          <div className="font-medium">🗄️ Prisma Schema Error:</div>
                          <div className="mt-1">
                            • แก้ไข schema.prisma file<br/>
                            • ตรวจสอบ relation field names<br/>
                            • รัน: npx prisma db push<br/>
                            • Restart backend server
                          </div>
                        </div>
                      )}
                      
                      {result.error.includes('Cannot read properties of undefined') && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-xs">
                          <div className="font-medium">⚠️ Backend Configuration Error:</div>
                          <div className="mt-1">
                            • ORM/Database client ไม่ได้ initialize<br/>
                            • ตรวจสอบ environment variables<br/>
                            • Restart backend server
                          </div>
                        </div>
                      )}
                      
                      {result.error.includes('Network connection failed') && (
                        <div className="mt-2 p-2 bg-orange-50 rounded text-orange-700 text-xs">
                          <div className="font-medium">🔌 Connection Error:</div>
                          <div className="mt-1">
                            • Backend server ไม่ทำงาน (port 8888)<br/>
                            • ตรวจสอบ firewall/network<br/>
                            • ลอง "Test Server Connection"
                          </div>
                        </div>
                      )}
                      
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

        {/* API Configuration Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Configuration & Troubleshooting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Backend Server</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• Base URL: http://localhost:8888</div>
                <div>• Timeout: 5000ms</div>
                <div>• Max Retries: 2</div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Authentication</h3>
              <div className="text-xs text-green-700 space-y-1">
                <div>• Login: POST /login/users</div>
                <div>• Token Storage: localStorage</div>
                <div>• Header: Authorization: Bearer</div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Response Format</h3>
              <div className="text-xs text-purple-700 space-y-1">
                <div>• Content-Type: application/json</div>
                <div>• Success: {"{success: true, data: ...}"}</div>
                <div>• Error: {"{success: false, error: ...}"}</div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">CoursePostest Testing</h3>
              <div className="text-xs text-purple-700 space-y-1">
                <div>• GET /coursePostest (All postests)</div>
                <div>• GET /coursePostest?courseId=xxx</div>
                <div>• POST /coursePostest (Create)</div>
                <div>• Test Solar System course ID</div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">Common Issues</h3>
              <div className="text-xs text-red-700 space-y-1">
                <div>• findMany error: Database issue</div>
                <div>• undefined properties: ORM error</div>
                <div>• Network failed: Server down</div>
                <div>• No postests: Check courseId match</div>
              </div>
            </div>
          </div>
          
          {/* Troubleshooting Guide */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">🔧 Troubleshooting Guide:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
              <div>
                <div className="font-medium text-red-600 mb-1">❌ "findMany" Error:</div>
                <div className="space-y-1">
                  <div>1. Check database connection</div>
                  <div>2. Verify Prisma configuration</div>
                  <div>3. Check DATABASE_URL env var</div>
                  <div>4. Run: npx prisma generate</div>
                </div>
              </div>
              <div>
                <div className="font-medium text-orange-600 mb-1">⚠️ Network Failed:</div>
                <div className="space-y-1">
                  <div>1. Start backend server</div>
                  <div>2. Check port 8888 availability</div>
                  <div>3. Verify firewall settings</div>
                  <div>4. Test with "Test Server Connection"</div>
                </div>
              </div>
              <div>
                <div className="font-medium text-purple-600 mb-1">🗄️ Schema Errors:</div>
                <div className="space-y-1">
                  <div>1. Check Prisma schema.prisma</div>
                  <div>2. Fix relation field names</div>
                  <div>3. Run: npx prisma db push</div>
                  <div>4. Restart backend server</div>
                </div>
              </div>
            </div>
            
            {/* Specific Stage Model Error Guide */}
            <div className="mt-4 p-3 bg-purple-50 rounded border-l-4 border-purple-400">
              <div className="font-medium text-purple-800 mb-2">🔍 Current Backend Issue Detected:</div>
              <div className="text-xs text-purple-700 space-y-1">
                <div><strong>Stage Model Schema Error:</strong> Relation fields mismatch</div>
                <div>• Fix in <code>schema.prisma</code>: character, questions, prerequisites relations</div>
                <div>• Remove undefined fields: course?, lessons?, UserProgress?</div>
                <div>• Run: <code>npx prisma db push && npx prisma generate</code></div>
                <div>• Restart backend server after fixing schema</div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints Documentation */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints Reference (Updated)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Course APIs</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• GET /course</li>
                <li>• POST /course</li>
                <li>• GET /course/:id</li>
                <li>• PUT /course/:id</li>
                <li>• PATCH /course/:id</li>
                <li>• DELETE /course/:id</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Stage APIs</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• GET /stage</li>
                <li>• POST /stage</li>
                <li>• DELETE /stage/:id</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Question APIs</h3>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• GET /question</li>
                <li>• POST /question</li>
                <li>• GET /question/:id</li>
                <li>• DELETE /question/:id</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-medium text-orange-900 mb-2">Course Quiz APIs</h3>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• GET /courseQuiz</li>
                <li>• POST /courseQuiz</li>
                <li>• DELETE /courseQuiz/:id</li>
              </ul>
            </div>

            <div className="bg-pink-50 rounded-lg p-4">
              <h3 className="font-medium text-pink-900 mb-2">Course Postest APIs</h3>
              <ul className="text-xs text-pink-700 space-y-1">
                <li>• GET /coursePostest</li>
                <li>• POST /coursePostest</li>
                <li>• GET /coursePostest/:id</li>
                <li>• PUT /coursePostest/:id</li>
                <li>• DELETE /coursePostest/:id</li>
                <li>• GET /coursePostest?courseId=xxx</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-medium text-indigo-900 mb-2">User APIs</h3>
              <ul className="text-xs text-indigo-700 space-y-1">
                <li>• GET /users/get</li>
                <li>• POST /users/create</li>
              </ul>
            </div>
            

            <div className="bg-teal-50 rounded-lg p-4">
              <h3 className="font-medium text-teal-900 mb-2">Course Detail APIs</h3>
              <ul className="text-xs text-teal-700 space-y-1">
                <li>• GET /courseDetail</li>
                <li>• POST /courseDetail</li>
                <li>• DELETE /courseDetail/:id</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Course Lesson APIs</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• GET /courseLesson</li>
                <li>• POST /courseLesson</li>
                <li>• GET /courseLesson/:id</li>
                <li>• DELETE /courseLesson/:id</li>
              </ul>
            </div>
            
            <div className="bg-cyan-50 rounded-lg p-4">
              <h3 className="font-medium text-cyan-900 mb-2">User Progress APIs</h3>
              <ul className="text-xs text-cyan-700 space-y-1">
                <li>• GET /user-course-progress</li>
                <li>• POST /user-course-progress</li>
                <li>• PUT /user-course-progress/:id</li>
                <li>• DELETE /user-course-progress/:id</li>
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