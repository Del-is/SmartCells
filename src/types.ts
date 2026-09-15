export type QuestionType = 'multiple-choice' | 'true-false' | 'multi-select' | 'short-answer';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  imageUrl?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  grade?: string;
  difficulty?: string;
  description: string;
  questions: Question[];
  createdAt: number;
}

export interface UserProfile {
  name: string;
  preferredDifficulty: string;
  frequentSubjects: string[];
  grade?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  answers: Record<string, string>;
  reviewedAnswers?: Record<string, boolean>;
  score: number;
  completedAt: number;
  feedback?: string;
  status: 'in-progress' | 'completed';
  currentQuestionIndex: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  grade?: string;
  content: string;
  flashcards: { question: string; answer: string }[];
  createdAt: number;
}

export type UITheme = 'standard' | 'midnight' | 'nature' | 'sunset' | 'anime';

export interface UserSettings {
  soundEnabled: boolean;
  aiResponseStyle: 'concise' | 'detailed' | 'creative';
  defaultQuestionCount: number;
  theme: 'light' | 'dark' | 'system';
  uiTheme: UITheme;
  examReminderEnabled?: boolean;
}

export interface WeeklyGoals {
  targetHours: number;
  targetExams: number;
}

export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  note?: string;
  timestamp: number;
}
