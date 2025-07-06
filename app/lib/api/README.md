# LASSMUO API Service Documentation

## Overview

This API service provides a complete interface for the LASSMUO learning management system. It includes services for managing courses, stages, lessons, quiz questions (orders), users, and answers.

## Architecture

```
app/lib/api/
├── config.ts          # API configuration and error types
├── types.ts           # TypeScript type definitions
├── client.ts          # HTTP client with error handling
├── services/          # API service classes
│   ├── courseService.ts
│   ├── stageService.ts
│   ├── lessonService.ts
│   ├── orderService.ts
│   ├── userService.ts
│   ├── answerService.ts
│   └── index.ts
├── hooks/             # React hooks for easy component integration
│   ├── useApi.ts
│   ├── useCourse.ts
│   ├── useStage.ts
│   ├── useLesson.ts
│   ├── useUser.ts
│   ├── useQuiz.ts
│   └── index.ts
├── examples/          # Usage examples
│   └── usage-examples.tsx
└── index.ts          # Main export file
```

## Setup

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8888
```

### 2. Basic Usage

Import the API services or hooks:

```typescript
// Using services directly
import { api } from '@/app/lib/api';

// Using React hooks
import { useCourses, useCreateCourse } from '@/app/lib/api/hooks';
```

## API Services

### Course Service

```typescript
// Get all courses
const courses = await api.course.getAllCourses();

// Get course by ID
const course = await api.course.getCourseById('course-id');

// Create new course
const newCourse = await api.course.createCourse({
  title: "Space Exploration",
  description: "Learn about space",
  isActive: true,
  level: "Fundamental"
});

// Update course
const updatedCourse = await api.course.updateCourse('course-id', courseData);

// Delete course
await api.course.deleteCourse('course-id');
```

### Stage Service

```typescript
// Get stages by course
const stages = await api.stage.getStagesByCourseId('course-id');

// Create new stage
const newStage = await api.stage.createStage({
  courseId: 'course-id',
  title: 'Introduction to Planets',
  order: 1,
  unlockCondition: true
});
```

### Lesson Service

```typescript
// Get lessons by stage
const lessons = await api.lesson.getLessonsByStageId('stage-id');

// Create new lesson
const newLesson = await api.lesson.createLesson({
  stageId: 'stage-id',
  title: 'Solar System Basics',
  content: 'Lesson content here...',
  order: 1
});
```

### Quiz/Order Service

```typescript
// Get quiz questions for a lesson
const questions = await api.order.getOrdersByLessonId('lesson-id');

// Create quiz question
const newQuestion = await api.order.createOrder({
  lessonId: 'lesson-id',
  question: 'Which planet is closest to the Sun?',
  choices: ['Mercury', 'Venus', 'Earth', 'Mars'],
  correctAnswer: 'Mercury'
});

// Validate answer
const result = await api.order.validateAnswer('question-id', 'Mercury');
```

### User Service

```typescript
// Create user (register)
const newUser = await api.user.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword'
});

// Login
const loginResult = await api.user.loginUser('john@example.com', 'securepassword');

// Get user profile
const profile = await api.user.getUserProfile('user-id');
```

### Answer Service

```typescript
// Submit quiz answers
const quizResult = await api.answer.submitQuizAnswers([
  {
    userId: 'user-id',
    orderId: 'question-id',
    answer: 'Mercury',
    isCorrect: true
  }
]);

// Get user progress
const progress = await api.answer.getUserProgress('user-id');

// Get leaderboard
const leaderboard = await api.answer.getLeaderboard('course-id', 10);
```

## React Hooks

### Basic Data Fetching

```typescript
function CourseList() {
  const { data: courses, loading, error, refetch } = useCourses();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {courses?.data?.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

### Creating Resources

```typescript
function CreateCourseForm() {
  const createCourse = useCreateCourse();

  const handleSubmit = async (formData) => {
    try {
      await createCourse.mutate(api.course.createCourse, formData);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={createCourse.loading}>
        {createCourse.loading ? 'Creating...' : 'Create Course'}
      </button>
      {createCourse.error && <div>Error: {createCourse.error}</div>}
      {createCourse.success && <div>Course created successfully!</div>}
    </form>
  );
}
```

### Authentication

```typescript
function LoginForm() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth.login.execute(email, password);
      // User is now logged in, token is stored automatically
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin} disabled={auth.login.loading}>
        {auth.login.loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}
```

### Quiz Management

```typescript
function QuizComponent({ lessonId }: { lessonId: string }) {
  const { data: questions } = useRandomOrdersForQuiz(lessonId, 5);
  const quiz = useQuiz();
  const [answers, setAnswers] = useState<{ [orderId: string]: string }>({});

  const handleSubmit = async () => {
    const answersToSubmit = questions?.data?.map(question => ({
      userId: 'current-user-id',
      orderId: question.id,
      answer: answers[question.id] || '',
      isCorrect: answers[question.id] === question.correctAnswer
    })) || [];

    try {
      await quiz.submit.execute(answersToSubmit);
    } catch (error) {
      console.error('Quiz submission failed:', error);
    }
  };

  return (
    <div>
      {/* Render quiz questions */}
      <button onClick={handleSubmit} disabled={quiz.submit.loading}>
        Submit Quiz
      </button>
      {quiz.submit.data && (
        <div>Score: {quiz.submit.data.data?.percentage}%</div>
      )}
    </div>
  );
}
```

## Error Handling

The API service includes comprehensive error handling:

```typescript
try {
  const result = await api.course.getCourseById('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, 'Status:', error.status);
  } else if (error instanceof NetworkError) {
    console.error('Network Error:', error.message);
  } else {
    console.error('Unknown Error:', error);
  }
}
```

## Authentication Flow

1. **Login**: Call `api.user.loginUser()` or use `useAuth().login.execute()`
2. **Token Storage**: JWT token is automatically stored in localStorage
3. **Auto Headers**: Token is automatically added to all subsequent requests
4. **Logout**: Call `api.user.logoutUser()` or use `useAuth().logout.execute()`

## API Endpoints Reference

Based on the Postman collection, the following endpoints are available:

### Course Endpoints
- `POST /course/create` - Create course
- `GET /course` - Get all courses
- `GET /course/{id}` - Get course by ID
- `PUT /course/update/{id}` - Update course
- `PATCH /course/patch/{id}` - Patch course
- `DELETE /course/delete/{id}` - Delete course

### Stage Endpoints
- `POST /stage/create` - Create stage
- `GET /stage` - Get all stages
- `GET /stage/{id}` - Get stage by ID
- `PUT /stage/update/{id}` - Update stage
- `PATCH /stage/patch/{id}` - Patch stage
- `DELETE /stage/delete/{id}` - Delete stage

### Lesson Endpoints
- `POST /lesson/createLesson` - Create lesson
- `GET /lesson` - Get all lessons
- `GET /lesson/{id}` - Get lesson by ID
- `PUT /lesson/update/{id}` - Update lesson
- `PATCH /lesson/patchLesson/{id}` - Patch lesson
- `DELETE /lesson/deleteLesson/{id}` - Delete lesson

### Order (Quiz) Endpoints
- `POST /order/createOrder` - Create quiz question
- `GET /order/getOrder` - Get all questions
- `DELETE /order/deleteOrder/{id}` - Delete question

### User Endpoints
- `POST /users/create` - Create user (register)
- `GET /users/get` - Get all users
- `POST /users/login` - Login user
- `POST /users/logout` - Logout user

### Answer Endpoints
- `POST /answer/create` - Create answer
- `GET /answer` - Get answers

## Best Practices

1. **Use Hooks in Components**: Prefer React hooks over direct service calls in components
2. **Handle Loading States**: Always show loading indicators during API calls
3. **Error Boundaries**: Implement error boundaries for better UX
4. **Type Safety**: Use TypeScript types for all API interactions
5. **Token Management**: Let the service handle authentication automatically
6. **Retry Logic**: Use the built-in retry functionality for failed requests

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your API server allows requests from your frontend domain
2. **Network Timeouts**: Check your internet connection and API server status
3. **Authentication Errors**: Verify your token is valid and not expired
4. **Type Errors**: Ensure you're using the correct TypeScript types

### Debug Mode

Enable debug logging by setting:
```bash
NEXT_PUBLIC_API_DEBUG=true
```

This will log all API requests and responses to the console.
