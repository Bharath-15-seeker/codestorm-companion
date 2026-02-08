import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Topic,
  Subtopic,
  Question,
  Event,
  EventRegistration,
  CareerTrack,
  Resource,
  LeaderboardEntry,
  Progress,
  StudentProgress,
  Sheet,
} from '@/types';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH SERVICES ============
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// ============ ADMIN SERVICES ============
export const adminService = {
  // Topics
  async getTopics(): Promise<Topic[]> {
    const { data } = await api.get<Topic[]>('/api/admin/topics');
    return data;
  },

  async createTopic(topic: Partial<Topic>): Promise<Topic> {
    const { data } = await api.post<Topic>('/api/admin/topics', topic);
    return data;
  },

  async updateTopic(id: number, topic: Partial<Topic>): Promise<Topic> {
    const { data } = await api.put<Topic>(`/api/admin/topics/${id}`, topic);
    return data;
  },

  async deleteTopic(id: number): Promise<void> {
    await api.delete(`/api/admin/topics/${id}`);
  },

  // Subtopics
  async getSubtopics(topicId: number): Promise<Subtopic[]> {
    const { data } = await api.get<Subtopic[]>(`/api/admin/subtopics?topicId=${topicId}`);
    return data;
  },

  async createSubtopic(subtopic: Partial<Subtopic>): Promise<Subtopic> {
    const { data } = await api.post<Subtopic>('/api/admin/subtopics', subtopic);
    return data;
  },

  async updateSubtopic(id: number, subtopic: Partial<Subtopic>): Promise<Subtopic> {
    const { data } = await api.put<Subtopic>(`/api/admin/subtopics/${id}`, subtopic);
    return data;
  },

  async deleteSubtopic(id: number): Promise<void> {
    await api.delete(`/api/admin/subtopics/${id}`);
  },

  // Questions
  async getQuestions(subtopicId?: number): Promise<Question[]> {
    const url = subtopicId ? `/api/admin/questions?subtopicId=${subtopicId}` : '/api/admin/questions';
    const { data } = await api.get<Question[]>(url);
    return data;
  },

  async createQuestion(question: Partial<Question>): Promise<Question> {
    const { data } = await api.post<Question>('/api/admin/questions', question);
    return data;
  },

  async updateQuestion(id: number, question: Partial<Question>): Promise<Question> {
    const { data } = await api.put<Question>(`/api/admin/questions/${id}`, question);
    return data;
  },

  async deleteQuestion(id: number): Promise<void> {
    await api.delete(`/api/admin/questions/${id}`);
  },

  // Events
  async getEvents(): Promise<Event[]> {
    const { data } = await api.get<Event[]>('/api/admin/events');
    return data;
  },

  async createEvent(event: Partial<Event>): Promise<Event> {
    const { data } = await api.post<Event>('/api/admin/events', event);
    return data;
  },

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const { data } = await api.put<Event>(`/api/admin/events/${id}`, event);
    return data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/api/admin/events/${id}`);
  },

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    const { data } = await api.get<EventRegistration[]>(`/api/admin/events/${eventId}/registrations`);
    return data;
  },

  async assignEventPoints(eventId: number, studentId: number, points: number): Promise<void> {
    await api.post(`/api/admin/events/${eventId}/points`, { studentId, points });
  },

  // Career Tracks
  async getCareerTracks(): Promise<CareerTrack[]> {
    const { data } = await api.get<CareerTrack[]>('/api/admin/career-tracks');
    return data;
  },

  async createCareerTrack(track: Partial<CareerTrack>): Promise<CareerTrack> {
    const { data } = await api.post<CareerTrack>('/api/admin/career-tracks', track);
    return data;
  },

  async updateCareerTrack(id: number, track: Partial<CareerTrack>): Promise<CareerTrack> {
    const { data } = await api.put<CareerTrack>(`/api/admin/career-tracks/${id}`, track);
    return data;
  },

  async deleteCareerTrack(id: number): Promise<void> {
    await api.delete(`/api/admin/career-tracks/${id}`);
  },

  async getTrackResources(trackId: number): Promise<Resource[]> {
    const { data } = await api.get<Resource[]>(`/api/admin/career-tracks/${trackId}/resources`);
    return data;
  },

  async addTrackResource(trackId: number, resource: Partial<Resource>): Promise<Resource> {
    const { data } = await api.post<Resource>(`/api/admin/career-tracks/${trackId}/resources`, resource);
    return data;
  },

  async deleteTrackResource(trackId: number, resourceId: number): Promise<void> {
    await api.delete(`/api/admin/career-tracks/${trackId}/resources/${resourceId}`);
  },

  // Students
  async deleteStudent(id: number): Promise<void> {
    await api.delete(`/api/admin/students/${id}`);
  },
};

// ============ STUDENT SERVICES ============
export const studentService = {
  // Sheets
  async getCodingSheet(): Promise<Sheet> {
    const { data } = await api.get<Sheet>('/api/sheets/coding');
    return data;
  },

  async getAptitudeSheet(): Promise<Sheet> {
    const { data } = await api.get<Sheet>('/api/sheets/aptitude');
    return data;
  },

  // Progress
async getCodingProgress(userId: number) {
  const { data } = await api.get(`/api/progress/coding?userId=${userId}`);
  return data;
},

async getAptitudeProgress(userId: number) {
  const { data } = await api.get(`/api/progress/aptitude?userId=${userId}`);
  return data;
},

  // Progress
  async updateQuestionProgress(questionId: number, solved: boolean): Promise<Progress> {
    const { data } = await api.post<Progress>(
      '/api/progress/question',
      { questionId, solved }   // ✅ CORRECT FIELD
    );
    return data;
  },
  

  async getMyProgress(): Promise<StudentProgress> {
    const { data } = await api.get<StudentProgress>('/api/progress/my');
    return data;
  },

  // Leaderboard
  async getCodingLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data } = await api.get<LeaderboardEntry[]>('/api/leaderboard/coding');
    return data;
  },

  async getAptitudeLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data } = await api.get<LeaderboardEntry[]>('/api/leaderboard/aptitude');
    return data;
  },

  // Events
  async getEvents(): Promise<Event[]> {
    const { data } = await api.get<Event[]>('/api/events');
    return data;
  },

  async registerForEvent(eventId: number): Promise<void> {
    await api.post(`/api/events/${eventId}/register`);
  },

  // Career Tracks
  async getCareerTracks(): Promise<CareerTrack[]> {
    const { data } = await api.get<CareerTrack[]>('/api/career-tracks');
    return data;
  },

  async getCareerTrack(trackId: number): Promise<CareerTrack> {
    const { data } = await api.get<CareerTrack>(`/api/career-tracks/${trackId}`);
    return data;
  },
};

export default api;
