// Example usage of the API services
'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/app/lib/api';
import { 
  useCourses, 
  useCreateCourse, 
  useAuth,
  useQuiz,
  useRandomOrdersForQuiz,
  useCourse
} from '@/app/lib/api/hooks';
import { Course, CreateCourseRequest, CreateAnswerRequest } from '@/app/lib/api/types';

// Example 1: Using API services directly
export function DirectApiUsageExample() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await api.course.getAllCourses();
        if (response.data) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;

  return (
    <div>
      <h2>Courses (Direct API)</h2>
      {courses.map((course: any) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>Level: {course.level}</p>
        </div>
      ))}
    </div>
  );
}

// Example 2: Using React hooks
export function HooksApiUsageExample() {
  const { data: courses, loading, error, refetch } = useCourses();
  const createCourse = useCreateCourse();

  const handleCreateCourse = async () => {
    const newCourse: CreateCourseRequest = {
      title: "New Space Course",
      description: "Learn about space exploration",
      isActive: true,
      level: "Fundamental"
    };

    try {
      await createCourse.mutate(api.course.createCourse, newCourse);
      refetch(); // Refresh the courses list
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Courses (Hooks)</h2>
      <button 
        onClick={handleCreateCourse}
        disabled={createCourse.loading}
      >
        {createCourse.loading ? 'Creating...' : 'Create Course'}
      </button>
      
      {createCourse.error && (
        <div style={{ color: 'red' }}>Error: {createCourse.error}</div>
      )}
      
      {createCourse.success && (
        <div style={{ color: 'green' }}>Course created successfully!</div>
      )}

      {courses?.data?.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p>Level: {course.level}</p>
        </div>
      ))}
    </div>
  );
}

// Example 3: Authentication usage
export function AuthExample() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth.login.execute(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout.execute();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <h2>Authentication</h2>
      
      {!auth.login.data ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            disabled={auth.login.loading}
          >
            {auth.login.loading ? 'Logging in...' : 'Login'}
          </button>
          
          {auth.login.error && (
            <div style={{ color: 'red' }}>Error: {auth.login.error}</div>
          )}
        </div>
      ) : (
        <div>
          <p>Welcome, {auth.login.data.data?.user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

// Example 4: Quiz functionality
export function QuizExample({ lessonId }: { lessonId: string }) {
  const { data: questions, loading: questionsLoading } = useRandomOrdersForQuiz(lessonId, 5);
  const quiz = useQuiz();
  const [answers, setAnswers] = useState<{ [orderId: string]: string }>({});

  const handleAnswerChange = (orderId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [orderId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!questions?.data) return;

    const answersToSubmit: CreateAnswerRequest[] = questions.data.map(question => ({
      userId: "current-user-id", // This should come from auth context
      orderId: question.id,
      answer: answers[question.id] || "",
      isCorrect: answers[question.id] === question.correctAnswer
    }));

    try {
      await quiz.submit.execute(answersToSubmit);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (questionsLoading) return <div>Loading quiz questions...</div>;

  return (
    <div>
      <h2>Quiz</h2>
      
      {questions?.data?.map((question, index) => (
        <div key={question.id} style={{ marginBottom: '20px' }}>
          <h4>Question {index + 1}: {question.question}</h4>
          {question.choices.map((choice, choiceIndex) => (
            <label key={choiceIndex} style={{ display: 'block' }}>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={choice}
                onChange={() => handleAnswerChange(question.id, choice)}
              />
              {choice}
            </label>
          ))}
        </div>
      ))}

      <button 
        onClick={handleSubmitQuiz}
        disabled={quiz.submit.loading}
        style={{ marginTop: '20px' }}
      >
        {quiz.submit.loading ? 'Submitting...' : 'Submit Quiz'}
      </button>

      {quiz.submit.error && (
        <div style={{ color: 'red' }}>Error: {quiz.submit.error}</div>
      )}

      {quiz.submit.success && quiz.submit.data && (
        <div style={{ color: 'green' }}>
          <h3>Quiz Results</h3>
          <p>Score: {quiz.submit.data.data?.score} / {quiz.submit.data.data?.totalQuestions}</p>
          <p>Percentage: {quiz.submit.data.data?.percentage}%</p>
        </div>
      )}
    </div>
  );
}

// Example 5: Error handling and loading states
export function ErrorHandlingExample() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  // This will trigger an error if courseId is invalid
  const { data: course, loading, error, refetch } = useCourse(selectedCourseId);

  return (
    <div>
      <h2>Error Handling Example</h2>
      
      <input
        type="text"
        placeholder="Enter Course ID"
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
      />

      {loading && <div>Loading course...</div>}
      
      {error && (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
          <button onClick={refetch} style={{ marginLeft: '10px' }}>
            Retry
          </button>
        </div>
      )}

      {course?.data && (
        <div style={{ color: 'green', padding: '10px', border: '1px solid green' }}>
          <h3>{course.data.title}</h3>
          <p>{course.data.description}</p>
        </div>
      )}
    </div>
  );
}
