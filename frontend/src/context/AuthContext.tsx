import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, UserProgress } from '@shared/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  toggleDsaTopic: (topicName: string) => Promise<void>;
  toggleFullStackTopic: (topicName: string) => Promise<void>;
  toggleAptitudeQuestion: (topicTitle: string, questionIndex: number) => Promise<void>;
  updateGoal: (goal: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  saveNotes: (notes: string) => Promise<void>;
  requestMentorship: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('pavanxdcl_jwt_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.auth.me();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('pavanxdcl_jwt_token');
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to load user profile:', e);
      localStorage.removeItem('pavanxdcl_jwt_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.auth.login(email, password);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, message: data.message || 'Logged in successfully!' };
      }
      return { success: false, message: data.message || 'Login failed.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Invalid email or password.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await api.auth.register(name, email, password);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, message: data.message || 'Registration successful!' };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Registration error.' };
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  const toggleDsaTopic = async (topicName: string) => {
    if (!user) return;
    try {
      const res = await api.student.toggleDsa(topicName);
      if (res.success) {
        setUser(prev => prev ? { ...prev, streak: res.streak, progress: res.progress } : null);
      }
    } catch (e) {
      console.error('Failed to toggle DSA topic:', e);
    }
  };

  const toggleFullStackTopic = async (topicName: string) => {
    if (!user) return;
    try {
      const res = await api.student.toggleFullstack(topicName);
      if (res.success) {
        setUser(prev => prev ? { ...prev, streak: res.streak, progress: res.progress } : null);
      }
    } catch (e) {
      console.error('Failed to toggle Full Stack topic:', e);
    }
  };

  const toggleAptitudeQuestion = async (topicTitle: string, questionIndex: number) => {
    if (!user) return;
    try {
      const res = await api.student.toggleAptitude(topicTitle, questionIndex);
      if (res.success) {
        setUser(prev => prev ? { ...prev, streak: res.streak, progress: res.progress } : null);
      }
    } catch (e) {
      console.error('Failed to toggle Aptitude question:', e);
    }
  };

  const updateGoal = async (goal: string) => {
    if (!user) return;
    try {
      const res = await api.student.updateGoal(goal);
      if (res.success) {
        setUser(prev => prev ? { ...prev, targetGoal: goal } : null);
      }
    } catch (e) {
      console.error('Failed to update target goal:', e);
    }
  };

  const resetProgress = async () => {
    if (!user) return;
    try {
      const res = await api.student.resetProgress();
      if (res.success) {
        setUser(prev => prev ? {
          ...prev,
          progress: { dsa: [], fullstack: [], aptitude: [] }
        } : null);
      }
    } catch (e) {
      console.error('Failed to reset progress:', e);
    }
  };

  const saveNotes = async (notes: string) => {
    if (!user) return;
    try {
      const res = await api.student.saveNotes(notes);
      if (res.success) {
        setUser(prev => prev ? { ...prev, notes } : null);
      }
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  };

  const requestMentorship = async () => {
    if (!user) return;
    try {
      const res = await api.student.requestMentorship();
      if (res.success) {
        setUser(prev => prev ? { ...prev, mentorshipRequested: true } : null);
      }
    } catch (e) {
      console.error('Failed to request mentorship:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      toggleDsaTopic,
      toggleFullStackTopic,
      toggleAptitudeQuestion,
      updateGoal,
      resetProgress,
      saveNotes,
      requestMentorship,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
