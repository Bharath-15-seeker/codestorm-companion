// User & Auth Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Topic & Question Types
export interface Topic {
  id: number;
  name: string;
  description: string;
  subtopics?: Subtopic[];
}

export interface Subtopic {
  id: number;
  name: string;
  topicId: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  link: string;
  subtopicId: number;
  platform: string;
  completed?: boolean;
}

// Event Types
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  status: 'OPEN' | 'CLOSED' | 'COMPLETED';
  maxParticipants: number;
  registeredCount: number;
  imageUrl?: string;
}

export interface EventRegistration {
  id: number;
  eventId: number;
  studentId: number;
  studentName: string;
  email: string;
  registeredAt: string;
  points?: number;
}

// Career Track Types
export interface CareerTrack {
  id: number;
  title: string;
  description: string;
  icon: string;
  resources?: Resource[];
  totalResources: number;
}

export interface Resource {
  id: number;
  title: string;
  type: 'VIDEO' | 'ARTICLE' | 'COURSE';
  url: string;
  duration?: string;
  order: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  studentId: number;
  name: string;
  avatarUrl?: string;
  score: number;
  questionsCompleted: number;
}

// Progress Types
export interface Progress {
  questionId: number;
  completed: boolean;
  completedAt?: string;
}

export interface StudentProgress {
  totalQuestions: number;
  completedQuestions: number;
  codingProgress: number;
  aptitudeProgress: number;
  streak: number;
}

// Sheet Types
export interface Sheet {
  id: number;
  type: 'CODING' | 'APTITUDE';
  topics: Topic[];
}
