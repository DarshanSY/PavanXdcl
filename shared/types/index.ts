export interface UserProgress {
  dsa: string[];
  fullstack: string[];
  aptitude: string[]; // e.g. ["Percentages-0", "Percentages-1"]
}

export interface User {
  name: string;
  email: string;
  joinedDate: string;
  streak: number;
  targetGoal: string; // e.g. "FAANG", "MNCs", "Startup Pro"
  progress: UserProgress;
  mentorshipSelected?: boolean;
  mentorshipRequested?: boolean;
  notes?: string;
}

export interface StudentUser {
  name: string;
  email: string;
  joinedDate: string;
  streak: number;
  targetGoal: string;
  progress: UserProgress;
  mentorshipSelected?: boolean;
  mentorshipRequested?: boolean;
  notes?: string;
}

export interface VideoItem {
  url: string;
  label?: string;
  notesUrl?: string;
  leetcodeUrl?: string;
}

export interface DSAContent {
  id: string;
  module: string;
  topic: string;
  icon: string;
  description: string;
  videos: VideoItem[];
  addedAt: string;
}

export interface FSContent {
  id: string;
  topic: string;
  description: string;
  videos: VideoItem[];
  addedAt: string;
}

export interface AptitudeQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface AptitudeTopic {
  id: string;
  title: string;
  questions: AptitudeQuestion[];
  addedAt: string;
  emoji?: string;
  description?: string;
  badge?: string;
}

export interface SuccessStory {
  id: string;
  sender: string;
  title: string;
  message: string;
  time: string;
  photo?: string;
  visible: boolean;
  addedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}
