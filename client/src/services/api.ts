import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 響應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: async (username: string, password: string) => {
    const response = await api.post('/api/register', { username, password });
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post('/api/login', { username, password });
    return response.data;
  },
};

export const rooms = {
  create: async (name: string, smallBlind: number, bigBlind: number) => {
    const response = await api.post('/api/rooms', { name, smallBlind, bigBlind });
    return response.data;
  },

  list: async () => {
    const response = await api.get('/api/rooms');
    return response.data;
  },

  join: async (roomId: string) => {
    const response = await api.post(`/api/rooms/${roomId}/join`);
    return response.data;
  },

  leave: async (roomId: string) => {
    const response = await api.post(`/api/rooms/${roomId}/leave`);
    return response.data;
  },
};

export const game = {
  action: async (roomId: string, action: string, amount?: number) => {
    const response = await api.post(`/api/game/${roomId}/action`, { action, amount });
    return response.data;
  },
};

export default api; 