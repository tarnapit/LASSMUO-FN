"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/layout/Navbar";
import { stageData } from "../../data/stages";
import { StageData, Question } from "../../types/stage";

// Character Introduction Component
const CharacterIntro = ({ 
  stageInfo, 
  onContinue 
}: { 
  stageInfo: StageData;
  onContinue: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <h1 className="text-4xl font-bold text-white mb-12">Character</h1>
        
        <div className="text-center space-y-6 max-w-2xl">
          <p className="text-white text-lg">{stageInfo.character.introduction}</p>
          <p className="text-white text-lg">{stageInfo.character.learningContent}</p>
        </div>
        
        <button 
          onClick={onContinue}
          className="mt-12 bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          continue
        </button>
      </div>
    </div>
  );
};

// Learning Content Component
const LearningContent = ({ 
  stageInfo, 
  onContinue 
}: { 
  stageInfo: StageData;
  onContinue: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">{stageInfo.title}</h1>
        <p className="text-white text-lg mb-8 text-center max-w-2xl">{stageInfo.description}</p>
        
        <div className="mb-12">
          <div className="w-80 h-40 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
            <p className="text-white text-lg">Image or Animation</p>
          </div>
          <p className="text-white text-sm mt-2 text-center">แบบจำเป็น animation ต่อยหิน</p>
        </div>
        
        <button 
          onClick={onContinue}
          className="bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Continue to Quiz
        </button>
      </div>
    </div>
  );
};

// Quiz Component
const QuizComponent = ({ 
  questions, 
  onComplete 
}: { 
  questions: Question[];
  onComplete: (score: number) => void;
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerClick = (answerId: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerId);
    setShowResult(true);
    
    const answer = currentQuestion.answers.find(a => a.id === answerId);
    const isCorrect = answer?.isCorrect || false;
    
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getButtonStyle = (answerId: number) => {
    if (!showResult) {
      return "bg-white text-black hover:bg-gray-100";
    }
    
    const answer = currentQuestion.answers.find(a => a.id === answerId);
    if (answer?.isCorrect) {
      return "bg-green-500 text-white";
    } else if (selectedAnswer === answerId) {
      return "bg-orange-500 text-white";
    }
    return "bg-gray-500 text-white";
  };

  const getMessage = () => {
    if (!showResult) return null;
    
    const selectedAnswerData = currentQuestion.answers.find(a => a.id === selectedAnswer);
    if (selectedAnswerData?.isCorrect) {
      return (
        <div className="mt-8 text-center">
          <p className="text-green-500 text-lg font-semibold">
            {isLastQuestion ? "Good job ! Ready for results" : "Good job ! Ready to the next Question"}
          </p>
          <button 
            onClick={handleNext}
            className="text-yellow-500 underline cursor-pointer mt-2 hover:text-yellow-400"
          >
            Click Here
          </button>
        </div>
      );
    } else {
      return (
        <div className="mt-8 text-center">
          <p className="text-orange-500 text-lg font-semibold">Don't give up ! is just little mistake</p>
          <button 
            onClick={handleNext}
            className="text-yellow-500 underline cursor-pointer mt-2 hover:text-yellow-400"
          >
            Click Here
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="mb-4 text-white">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-8 text-center">{currentQuestion.question}</h1>
        
        <div className="mb-12">
          <div className="w-80 h-32 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
            <p className="text-white text-lg">Image or Animation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md">
          {currentQuestion.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswerClick(answer.id)}
              className={`
                w-32 h-16 rounded-lg font-bold text-xl transition-all duration-300
                ${getButtonStyle(answer.id)}
                disabled:cursor-not-allowed
              `}
              disabled={showResult}
            >
              {answer.text}
            </button>
          ))}
        </div>
        
        {getMessage()}
      </div>
    </div>
  );
};

// Results Component
const ResultsComponent = ({ 
  score, 
  totalQuestions,
  time, 
  onFinish 
}: { 
  score: number;
  totalQuestions: number;
  time: string; 
  onFinish: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">
            <span className="text-green-500">Good Job</span>{" "}
            <span className="text-white">Guys</span>
          </h1>
          
          <p className="text-white text-xl">
            You understand astronomy more than Your own
          </p>
          
          <div className="flex justify-center space-x-16 mt-12">
            <div className="text-center">
              <h3 className="text-orange-500 text-2xl font-bold mb-4">Time</h3>
              <p className="text-white text-xl">{time}</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-orange-500 text-2xl font-bold mb-4">Score</h3>
              <p className="text-white text-xl">{score}/{totalQuestions}</p>
            </div>
          </div>
          
          <button 
            onClick={onFinish}
            className="mt-12 bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Stage Level Component
export default function StageLevelPage() {
  const params = useParams();
  const router = useRouter();
  const level = parseInt(params.level as string);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const stageInfo = stageData[level];

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  // Redirect if stage not found
  if (!stageInfo) {
    router.push('/stage');
    return null;
  }

  const handleCharacterContinue = () => {
    setCurrentStep(1);
  };

  const handleLearningContinue = () => {
    setCurrentStep(2);
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setCurrentStep(3);
  };

  const handleFinish = () => {
    router.push('/stage');
  };

  const getElapsedTime = () => {
    if (!startTime) return "00:00 min";
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')} min`;
  };

  // Render different components based on current step
  switch (currentStep) {
    case 0:
      return <CharacterIntro stageInfo={stageInfo} onContinue={handleCharacterContinue} />;
    case 1:
      return <LearningContent stageInfo={stageInfo} onContinue={handleLearningContinue} />;
    case 2:
      return <QuizComponent questions={stageInfo.questions} onComplete={handleQuizComplete} />;
    case 3:
      return (
        <ResultsComponent 
          score={score} 
          totalQuestions={stageInfo.questions.length}
          time={getElapsedTime()} 
          onFinish={handleFinish} 
        />
      );
    default:
      return <CharacterIntro stageInfo={stageInfo} onContinue={handleCharacterContinue} />;
  }
}
