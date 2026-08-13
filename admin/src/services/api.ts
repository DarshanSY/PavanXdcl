const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem('pavanxdcl_admin_jwt_token');
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
        localStorage.setItem('pavanxdcl_admin_jwt_token', data.token);
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
      localStorage.removeItem('pavanxdcl_admin_jwt_token');
    }
  },

  students: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/admin/students`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    get: async (email: string) => {
      const res = await fetch(`${BASE_URL}/admin/students/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    delete: async (email: string) => {
      const res = await fetch(`${BASE_URL}/admin/students/${encodeURIComponent(email)}/delete`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    resetProgress: async (email: string) => {
      const res = await fetch(`${BASE_URL}/admin/students/${encodeURIComponent(email)}/reset`, {
        method: 'POST',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    updateMentorship: async (email: string, selected: boolean) => {
      const res = await fetch(`${BASE_URL}/admin/students/${encodeURIComponent(email)}/mentorship`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ selected })
      });
      return handleResponse(res);
    }
  },

  content: {
    dsa: {
      list: async () => {
        const res = await fetch(`${BASE_URL}/content/dsa`, {
          method: 'GET',
          headers: getHeaders()
        });
        return handleResponse(res);
      },
      create: async (item: any) => {
        const res = await fetch(`${BASE_URL}/content/dsa`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(item)
        });
        return handleResponse(res);
      },
      update: async (id: string, item: any) => {
        const res = await fetch(`${BASE_URL}/content/dsa/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(item)
        });
        return handleResponse(res);
      },
      delete: async (id: string) => {
        const res = await fetch(`${BASE_URL}/content/dsa/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        return handleResponse(res);
      }
    },

    fullstack: {
      list: async () => {
        const res = await fetch(`${BASE_URL}/content/fullstack`, {
          method: 'GET',
          headers: getHeaders()
        });
        return handleResponse(res);
      },
      create: async (item: any) => {
        const res = await fetch(`${BASE_URL}/content/fullstack`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(item)
        });
        return handleResponse(res);
      },
      update: async (id: string, item: any) => {
        const res = await fetch(`${BASE_URL}/content/fullstack/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(item)
        });
        return handleResponse(res);
      },
      delete: async (id: string) => {
        const res = await fetch(`${BASE_URL}/content/fullstack/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        return handleResponse(res);
      }
    },

    aptitude: {
      list: async () => {
        const res = await fetch(`${BASE_URL}/content/aptitude`, {
          method: 'GET',
          headers: getHeaders()
        });
        return handleResponse(res);
      },
      create: async (item: any) => {
        const res = await fetch(`${BASE_URL}/content/aptitude`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(item)
        });
        return handleResponse(res);
      },
      update: async (id: string, item: any) => {
        const res = await fetch(`${BASE_URL}/content/aptitude/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(item)
        });
        return handleResponse(res);
      },
      delete: async (id: string) => {
        const res = await fetch(`${BASE_URL}/content/aptitude/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        return handleResponse(res);
      }
    }
  },

  announcements: {
    listAll: async () => {
      const res = await fetch(`${BASE_URL}/admin/announcements`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    create: async (item: any) => {
      const res = await fetch(`${BASE_URL}/announcements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      return handleResponse(res);
    },
    update: async (id: string, item: any) => {
      const res = await fetch(`${BASE_URL}/announcements/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      return handleResponse(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`${BASE_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  stories: {
    listAll: async () => {
      const res = await fetch(`${BASE_URL}/stories`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    create: async (item: any) => {
      const res = await fetch(`${BASE_URL}/stories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      return handleResponse(res);
    },
    update: async (id: string, item: any) => {
      const res = await fetch(`${BASE_URL}/stories/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(item)
      });
      return handleResponse(res);
    },
    delete: async (id: string) => {
      const res = await fetch(`${BASE_URL}/stories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  }
};
