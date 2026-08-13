import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudentUser, DSAContent, FSContent, AptitudeTopic, SuccessStory, Announcement } from '@shared/types';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;

  // Students
  students: StudentUser[];
  refreshStudents: () => Promise<void>;
  deleteStudent: (email: string) => Promise<void>;
  resetStudentProgress: (email: string) => Promise<void>;
  updateStudentMentorship: (email: string, selected: boolean) => Promise<void>;

  // DSA Content
  dsaContent: DSAContent[];
  addDSAContent: (item: Omit<DSAContent, 'id' | 'addedAt'>) => Promise<void>;
  updateDSAContent: (id: string, item: Partial<DSAContent>) => Promise<void>;
  deleteDSAContent: (id: string) => Promise<void>;

  // FS Content
  fsContent: FSContent[];
  addFSContent: (item: Omit<FSContent, 'id' | 'addedAt'>) => Promise<void>;
  updateFSContent: (id: string, item: Partial<FSContent>) => Promise<void>;
  deleteFSContent: (id: string) => Promise<void>;

  // Aptitude Content
  aptContent: AptitudeTopic[];
  addAptTopic: (item: Omit<AptitudeTopic, 'id' | 'addedAt'>) => Promise<void>;
  updateAptTopic: (id: string, item: Partial<AptitudeTopic>) => Promise<void>;
  deleteAptTopic: (id: string) => Promise<void>;

  // Success Stories
  stories: SuccessStory[];
  addStory: (item: Omit<SuccessStory, 'id' | 'addedAt'>) => Promise<void>;
  updateStory: (id: string, item: Partial<SuccessStory>) => Promise<void>;
  deleteStory: (id: string) => Promise<void>;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  updateAnnouncement: (id: string, item: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return !!localStorage.getItem('pavanxdcl_admin_jwt_token');
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [dsaContent, setDsaContent] = useState<DSAContent[]>([]);
  const [fsContent, setFsContent] = useState<FSContent[]>([]);
  const [aptContent, setAptContent] = useState<AptitudeTopic[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const studentsData = await api.students.list();
      setStudents(studentsData.students || []);

      const dsaData = await api.content.dsa.list();
      setDsaContent(dsaData.content || []);

      const fsData = await api.content.fullstack.list();
      setFsContent(fsData.content || []);

      const aptData = await api.content.aptitude.list();
      setAptContent(aptData.content || []);

      const storiesData = await api.stories.listAll();
      setStories(storiesData.stories || []);

      const annData = await api.announcements.listAll();
      setAnnouncements(annData.announcements || []);
    } catch (e) {
      console.error('Error loading admin panel data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.auth.login(email, password);
      if (data.success && data.user?.role === 'ADMIN') {
        setIsAdmin(true);
        return true;
      }
      api.auth.logout();
      return false;
    } catch (e) {
      console.error('Admin Login failed:', e);
      return false;
    }
  };

  const adminLogout = () => {
    api.auth.logout();
    setIsAdmin(false);
    setStudents([]);
  };

  const refreshStudents = async () => {
    try {
      const data = await api.students.list();
      setStudents(data.students || []);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteStudent = async (email: string) => {
    try {
      const res = await api.students.delete(email);
      if (res.success) {
        setStudents(prev => prev.filter(s => s.email !== email));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetStudentProgress = async (email: string) => {
    try {
      const res = await api.students.resetProgress(email);
      if (res.success) {
        await refreshStudents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateStudentMentorship = async (email: string, selected: boolean) => {
    try {
      const res = await api.students.updateMentorship(email, selected);
      if (res.success) {
        setStudents(prev => prev.map(s => s.email === email ? { ...s, mentorshipSelected: selected } : s));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── DSA CRUD ──────────────────────────────────────────────
  const addDSAContent = async (item: Omit<DSAContent, 'id' | 'addedAt'>) => {
    try {
      const id = 'dsa-dynamic-' + Date.now();
      const res = await api.content.dsa.create({ ...item, id });
      if (res.success) {
        setDsaContent(prev => [...prev, res.content]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateDSAContent = async (id: string, item: Partial<DSAContent>) => {
    try {
      const res = await api.content.dsa.update(id, item);
      if (res.success) {
        setDsaContent(prev => prev.map(d => d.id === id ? res.content : d));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteDSAContent = async (id: string) => {
    try {
      const res = await api.content.dsa.delete(id);
      if (res.success) {
        setDsaContent(prev => prev.filter(d => d.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── FullStack CRUD ──────────────────────────────────────────
  const addFSContent = async (item: Omit<FSContent, 'id' | 'addedAt'>) => {
    try {
      const id = 'fs-dynamic-' + Date.now();
      const res = await api.content.fullstack.create({ ...item, id });
      if (res.success) {
        setFsContent(prev => [...prev, res.content]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateFSContent = async (id: string, item: Partial<FSContent>) => {
    try {
      const res = await api.content.fullstack.update(id, item);
      if (res.success) {
        setFsContent(prev => prev.map(f => f.id === id ? res.content : f));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteFSContent = async (id: string) => {
    try {
      const res = await api.content.fullstack.delete(id);
      if (res.success) {
        setFsContent(prev => prev.filter(f => f.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Aptitude CRUD ───────────────────────────────────────────
  const addAptTopic = async (item: Omit<AptitudeTopic, 'id' | 'addedAt'>) => {
    try {
      const id = 'apt-dynamic-' + Date.now();
      const res = await api.content.aptitude.create({ ...item, id });
      if (res.success) {
        setAptContent(prev => [...prev, res.content]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateAptTopic = async (id: string, item: Partial<AptitudeTopic>) => {
    try {
      const res = await api.content.aptitude.update(id, item);
      if (res.success) {
        setAptContent(prev => prev.map(a => a.id === id ? res.content : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAptTopic = async (id: string) => {
    try {
      const res = await api.content.aptitude.delete(id);
      if (res.success) {
        setAptContent(prev => prev.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Success Stories CRUD ─────────────────────────────────────
  const addStory = async (item: Omit<SuccessStory, 'id' | 'addedAt'>) => {
    try {
      const id = 'story-dynamic-' + Date.now();
      const res = await api.stories.create({ ...item, id });
      if (res.success) {
        setStories(prev => [res.story, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateStory = async (id: string, item: Partial<SuccessStory>) => {
    try {
      const res = await api.stories.update(id, item);
      if (res.success) {
        setStories(prev => prev.map(s => s.id === id ? res.story : s));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteStory = async (id: string) => {
    try {
      const res = await api.stories.delete(id);
      if (res.success) {
        setStories(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Announcements CRUD ───────────────────────────────────────
  const addAnnouncement = async (item: Omit<Announcement, 'id' | 'createdAt'>) => {
    try {
      const id = 'ann-dynamic-' + Date.now();
      const res = await api.announcements.create({ ...item, id });
      if (res.success) {
        setAnnouncements(prev => [res.announcement, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateAnnouncement = async (id: string, item: Partial<Announcement>) => {
    try {
      const res = await api.announcements.update(id, item);
      if (res.success) {
        setAnnouncements(prev => prev.map(a => a.id === id ? res.announcement : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const res = await api.announcements.delete(id);
      if (res.success) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdmin, loading, adminLogin, adminLogout,
      students, refreshStudents, deleteStudent, resetStudentProgress, updateStudentMentorship,
      dsaContent, addDSAContent, updateDSAContent, deleteDSAContent,
      fsContent, addFSContent, updateFSContent, deleteFSContent,
      aptContent, addAptTopic, updateAptTopic, deleteAptTopic,
      stories, addStory, updateStory, deleteStory,
      announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
