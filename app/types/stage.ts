export interface Question {
  id: number;
  question: string;
  answers: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
  }>;
  explanation?: string;
}

export interface StageData {
  id: number;
  title: string;
  description: string;
  character: {
    name: string;
    introduction: string;
    learningContent: string;
  };
  questions: Question[];
}
