// Integration examples showing complete workflows
'use client';

import React, { useState, useEffect } from 'react';
import { 
  useCourses, 
  useStagesByCourse, 
  useLessonsByStage,
  useRandomOrdersForQuiz,
  useQuiz,
  useAuth,
  useUserProgress,
  useLeaderboard
} from '@/app/lib/api/hooks';
import { CreateAnswerRequest } from '@/app/lib/api/types';
import { calculatePercentage, formatDuration } from '@/app/lib/api-utils';

// Complete learning flow example
export function LearningFlowExample() {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'courses' | 'stages' | 'lessons' | 'quiz'>('courses');

  const { data: courses, loading: coursesLoading } = useCourses();
  const { data: stages, loading: stagesLoading } = useStagesByCourse(selectedCourse);
  const { data: lessons, loading: lessonsLoading } = useLessonsByStage(selectedStage);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedStage('');
    setSelectedLesson('');
    setCurrentStep('stages');
  };

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
    setSelectedLesson('');
    setCurrentStep('lessons');
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
    setCurrentStep('quiz');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learning Journey</h1>
      
      {/* Course Selection */}
      {currentStep === 'courses' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select a Course</h2>
          {coursesLoading ? (
            <div>Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses?.data?.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleCourseSelect(course.id)}
                >
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-gray-600 text-sm">{course.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {course.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stage Selection */}
      {currentStep === 'stages' && selectedCourse && (
        <div>
          <button 
            onClick={() => setCurrentStep('courses')}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Courses
          </button>
          <h2 className="text-2xl font-semibold mb-4">Select a Stage</h2>
          {stagesLoading ? (
            <div>Loading stages...</div>
          ) : (
            <div className="space-y-3">
              {stages?.data?.map((stage) => (
                <div
                  key={stage.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleStageSelect(stage.id)}
                >
                  <h3 className="font-semibold">{stage.title}</h3>
                  <p className="text-sm text-gray-600">Order: {stage.order}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lesson Selection */}
      {currentStep === 'lessons' && selectedStage && (
        <div>
          <button 
            onClick={() => setCurrentStep('stages')}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Stages
          </button>
          <h2 className="text-2xl font-semibold mb-4">Select a Lesson</h2>
          {lessonsLoading ? (
            <div>Loading lessons...</div>
          ) : (
            <div className="space-y-3">
              {lessons?.data?.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleLessonSelect(lesson.id)}
                >
                  <h3 className="font-semibold">{lesson.title}</h3>
                  {lesson.duration && (
                    <p className="text-sm text-gray-600">
                      Duration: {formatDuration(lesson.duration)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quiz */}
      {currentStep === 'quiz' && selectedLesson && (
        <QuizSection 
          lessonId={selectedLesson} 
          onBack={() => setCurrentStep('lessons')}
        />
      )}
    </div>
  );
}

// Quiz section component
function QuizSection({ lessonId, onBack }: { lessonId: string; onBack: () => void }) {
  const { data: questions, loading: questionsLoading } = useRandomOrdersForQuiz(lessonId, 5);
  const quiz = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [orderId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions?.data?.[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (questions?.data?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!questions?.data) return;

    const answersToSubmit: CreateAnswerRequest[] = questions.data.map(question => ({
      userId: 'current-user-id', // This should come from auth context
      orderId: question.id,
      answer: answers[question.id] || '',
      isCorrect: answers[question.id] === question.correctAnswer
    }));

    try {
      await quiz.submit.execute(answersToSubmit);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (questionsLoading) {
    return <div>Loading quiz questions...</div>;
  }

  if (showResults && quiz.submit.data) {
    const result = quiz.submit.data.data;
    const percentage = result ? calculatePercentage(result.correctAnswers, result.totalQuestions) : 0;

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
        <div className="bg-white border rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-gray-600">
              {result?.correctAnswers} out of {result?.totalQuestions} correct
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-semibold">{result?.score}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-semibold">{percentage}%</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Back to Lessons
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>No questions available</div>;
  }

  return (
    <div>
      <button 
        onClick={onBack}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Lessons
      </button>

      <div className="bg-white border rounded-lg p-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions?.data?.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / (questions?.data?.length || 1)) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / (questions?.data?.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

        {/* Answer choices */}
        <div className="space-y-3 mb-6">
          {currentQuestion.choices.map((choice, index) => (
            <label
              key={index}
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion.id] === choice
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={choice}
                checked={answers[currentQuestion.id] === choice}
                onChange={() => handleAnswerSelect(choice)}
                className="sr-only"
              />
              <span className="text-sm font-medium">{choice}</span>
            </label>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || quiz.submit.loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === (questions?.data?.length || 0) - 1 
              ? (quiz.submit.loading ? 'Submitting...' : 'Submit Quiz')
              : 'Next'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// Dashboard example with user progress and leaderboard
export function DashboardExample() {
  const auth = useAuth();
  const userId = 'current-user-id'; // This should come from auth context
  const { data: progress } = useUserProgress(userId);
  const { data: leaderboard } = useLeaderboard(undefined, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Section */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          
          {progress?.data ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-semibold">
                  {progress.data.answeredQuestions} / {progress.data.totalQuestions}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Correct Answers:</span>
                <span className="font-semibold">{progress.data.correctAnswers}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Overall Progress:</span>
                <span className="font-semibold">{progress.data.progressPercentage}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress.data.progressPercentage}%` }}
                />
              </div>

              {progress.data.weakAreas && progress.data.weakAreas.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Areas to Improve:</h4>
                  <div className="flex flex-wrap gap-2">
                    {progress.data.weakAreas.map((area, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {progress.data.strongAreas && progress.data.strongAreas.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Strengths:</h4>
                  <div className="flex flex-wrap gap-2">
                    {progress.data.strongAreas.map((area, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>Loading progress data...</div>
          )}
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Top Learners</h2>
          
          {leaderboard?.data ? (
            <div className="space-y-3">
              {leaderboard.data.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-sm text-gray-600">
                        {user.correctAnswers} / {user.totalAnswers} correct
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.totalScore}</div>
                    <div className="text-xs text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Loading leaderboard...</div>
          )}
        </div>
      </div>
    </div>
  );
}
