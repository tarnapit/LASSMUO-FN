// API Testing Utilities
// These functions help test API integration and can be used in development

import { api } from './index';
import { CreateCourseRequest, CreateStageRequest } from './types';

/**
 * Test API connection and basic functionality
 */
export async function testApiConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    console.log('🧪 Testing API connection...');
    
    // Test getting all courses (should work even if empty)
    const coursesResponse = await api.course.getAllCourses();
    
    return {
      success: true,
      message: 'API connection successful',
      details: {
        coursesCount: coursesResponse.data?.length || 0,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
}

/**
 * Create sample data for testing
 */
export async function createSampleData(): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    console.log('🏗️ Creating sample data...');

    // Create a sample course
    const sampleCourse: CreateCourseRequest = {
      title: "Introduction to Solar System",
      description: "Learn the basics of our solar system including planets, moons, and other celestial bodies.",
      isActive: true,
      level: "Fundamental"
    };

    const courseResponse = await api.course.createCourse(sampleCourse);
    if (!courseResponse.data) {
      throw new Error('Failed to create course');
    }

    const courseId = courseResponse.data.id;
    console.log('✅ Created course:', courseId);

    // Create sample stages
    const sampleStages: CreateStageRequest[] = [
      {
        courseId,
        name: "Getting Started with Astronomy",
        description: "Introduction to astronomy basics",
        order: 1,
        unlockCondition: true
      },
      {
        courseId,
        name: "Understanding Planets",
        description: "Learn about planets in our solar system",
        order: 2,
        unlockCondition: false
      },
      {
        courseId,
        name: "Moons and Satellites",
        description: "Explore moons and artificial satellites",
        order: 3,
        unlockCondition: false
      }
    ];

    const stages = [];
    for (const stageData of sampleStages) {
      const stageResponse = await api.stage.createStage(stageData);
      if (stageResponse.data) {
        stages.push(stageResponse.data);
        console.log('✅ Created stage:', stageResponse.data.id);
      }
    }



    return {
      success: true,
      message: 'Sample data created successfully',
      data: {
        course: courseResponse.data,
        stages: stages
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `Failed to create sample data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Test complete learning flow
 */
export async function testLearningFlow(): Promise<{
  success: boolean;
  message: string;
  results?: any;
}> {
  try {
    console.log('🎓 Testing basic learning flow...');

    // 1. Get all courses
    const coursesResponse = await api.course.getAllCourses();
    console.log('📚 Found courses:', coursesResponse.data?.length || 0);

    if (!coursesResponse.data || coursesResponse.data.length === 0) {
      throw new Error('No courses found. Create sample data first.');
    }

    const firstCourse = coursesResponse.data[0];

    // 2. Get stages for the first course
    const stagesResponse = await api.stage.getStagesByCourseId(firstCourse.id);
    console.log('📖 Found stages:', stagesResponse.data?.length || 0);

    return {
      success: true,
      message: 'Basic learning flow test completed successfully',
      results: {
        coursesCount: coursesResponse.data.length,
        stagesCount: stagesResponse.data?.length || 0
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `Learning flow test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Test user operations (requires a test user)
 */
export async function testUserOperations(): Promise<{
  success: boolean;
  message: string;
  results?: any;
}> {
  try {
    console.log('👤 Testing user operations...');

    // Create a test user
    const testUser = {
      name: "Test User",
      email: `test_${Date.now()}@example.com`,
      password: "TestPassword123!"
    };

    const createUserResponse = await api.user.createUser(testUser);
    console.log('✅ Created test user:', createUserResponse.data?.id);

    if (!createUserResponse.data) {
      throw new Error('Failed to create test user');
    }

    // Test login
    const loginResponse = await api.user.loginUser(testUser.email, testUser.password);
    console.log('✅ Login successful:', !!loginResponse.data?.token);

    // Test getting user profile
    const profileResponse = await api.user.getUserProfile(createUserResponse.data.id);
    console.log('✅ Got user profile:', !!profileResponse.data);

    // Clean up - delete test user
    try {
      await api.user.deleteUser(createUserResponse.data.id);
      console.log('🧹 Cleaned up test user');
    } catch (cleanupError) {
      console.warn('⚠️ Failed to cleanup test user:', cleanupError);
    }

    return {
      success: true,
      message: 'User operations test completed successfully',
      results: {
        userCreated: !!createUserResponse.data,
        loginSuccessful: !!loginResponse.data?.token,
        profileRetrieved: !!profileResponse.data
      }
    };

  } catch (error) {
    return {
      success: false,
      message: `User operations test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<void> {
  console.log('🚀 Starting comprehensive API tests...\n');

  // Test 1: API Connection
  const connectionTest = await testApiConnection();
  console.log(`${connectionTest.success ? '✅' : '❌'} API Connection:`, connectionTest.message);
  if (connectionTest.details) {
    console.log('   Details:', connectionTest.details);
  }
  console.log('');

  // Test 2: Sample Data Creation
  const sampleDataTest = await createSampleData();
  console.log(`${sampleDataTest.success ? '✅' : '❌'} Sample Data Creation:`, sampleDataTest.message);
  console.log('');

  // Test 3: Learning Flow
  const learningFlowTest = await testLearningFlow();
  console.log(`${learningFlowTest.success ? '✅' : '❌'} Learning Flow:`, learningFlowTest.message);
  if (learningFlowTest.results) {
    console.log('   Results:', learningFlowTest.results);
  }
  console.log('');

  // Test 4: User Operations
  const userOpsTest = await testUserOperations();
  console.log(`${userOpsTest.success ? '✅' : '❌'} User Operations:`, userOpsTest.message);
  if (userOpsTest.results) {
    console.log('   Results:', userOpsTest.results);
  }
  console.log('');

  // Summary
  const allPassed = [connectionTest, sampleDataTest, learningFlowTest, userOpsTest]
    .every(test => test.success);

  console.log('🏁 Test Summary:');
  console.log(`   Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log(`   API Connection: ${connectionTest.success ? 'PASS' : 'FAIL'}`);
  console.log(`   Sample Data: ${sampleDataTest.success ? 'PASS' : 'FAIL'}`);
  console.log(`   Learning Flow: ${learningFlowTest.success ? 'PASS' : 'FAIL'}`);
  console.log(`   User Operations: ${userOpsTest.success ? 'PASS' : 'FAIL'}`);
}

/**
 * Quick API health check
 */
export async function quickHealthCheck(): Promise<boolean> {
  try {
    await api.course.getAllCourses();
    return true;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}

// Export for use in development console
if (typeof window !== 'undefined') {
  (window as any).apiTests = {
    testConnection: testApiConnection,
    createSampleData: createSampleData,
    testLearningFlow: testLearningFlow,
    testUserOperations: testUserOperations,
    runAllTests: runAllTests,
    quickHealthCheck: quickHealthCheck
  };
}
