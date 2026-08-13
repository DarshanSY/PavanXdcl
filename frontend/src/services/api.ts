const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem('pavanxdcl_jwt_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('pavanxdcl_jwt_token', data.token);
      }
      return data;
    },
    register: async (name: string, email: string, password: string) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password })
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('pavanxdcl_jwt_token', data.token);
      }
      return data;
    },
    me: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    logout: () => {
      localStorage.removeItem('pavanxdcl_jwt_token');
    }
  },

  student: {
    toggleDsa: async (topicName: string) => {
      const res = await fetch(`${BASE_URL}/student/progress/dsa`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ topicName })
      });
      return handleResponse(res);
    },
    toggleFullstack: async (topicName: string) => {
      const res = await fetch(`${BASE_URL}/student/progress/fullstack`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ topicName })
      });
      return handleResponse(res);
    },
    toggleAptitude: async (topicTitle: string, questionIndex: number) => {
      const res = await fetch(`${BASE_URL}/student/progress/aptitude`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ topicTitle, questionIndex })
      });
      return handleResponse(res);
    },
    updateGoal: async (goal: string) => {
      const res = await fetch(`${BASE_URL}/student/goal`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ goal })
      });
      return handleResponse(res);
    },
    resetProgress: async () => {
      const res = await fetch(`${BASE_URL}/student/reset`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    saveNotes: async (notes: string) => {
      const res = await fetch(`${BASE_URL}/student/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes })
      });
      return handleResponse(res);
    },
    requestMentorship: async () => {
      const res = await fetch(`${BASE_URL}/student/mentorship-request`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  content: {
    getDsa: async () => {
      const res = await fetch(`${BASE_URL}/content/dsa`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getFullstack: async () => {
      const res = await fetch(`${BASE_URL}/content/fullstack`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getAptitude: async () => {
      const res = await fetch(`${BASE_URL}/content/aptitude`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  announcements: {
    getAnnouncements: async () => {
      const res = await fetch(`${BASE_URL}/announcements`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  stories: {
    getStories: async () => {
      const res = await fetch(`${BASE_URL}/stories`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    createStory: async (story: { id: string; sender: string; title: string; message: string; time: string; photo?: string }) => {
      const res = await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(story)
      });
      return handleResponse(res);
    }
  }
};
