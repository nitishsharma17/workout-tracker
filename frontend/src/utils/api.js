import axios from 'axios';
import { API_URLS } from '../config/api';


const baseURL = import.meta.env.PROD ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') : '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const toPath = (url) => {
  try {
    const u = new URL(url);
    return u.pathname + (u.search || '');
  } catch (e) {
   
    return url;
  }
};

export const authApi = {
  login: (credentials) => api.post(toPath(API_URLS.LOGIN), credentials),
  register: (userData) => api.post(toPath(API_URLS.REGISTER), userData),
  getProfile: () => api.get(toPath(API_URLS.PROFILE)),
};

export const workoutApi = {
  getWorkouts: () => api.get(toPath(API_URLS.WORKOUTS)),
  addWorkout: (workout) => api.post(toPath(API_URLS.WORKOUTS), workout),
  updateWorkout: (id, workout) => api.put(`${toPath(API_URLS.WORKOUTS).replace(/\/$/, '')}/${id}`, workout),
  deleteWorkout: (id) => api.delete(`${toPath(API_URLS.WORKOUTS).replace(/\/$/, '')}/${id}`),
};

export const adminApi = {
  getDashboardStats: () => api.get(`${toPath(API_URLS.ADMIN).replace(/\/$/, '')}/dashboard`),
};

export default api;