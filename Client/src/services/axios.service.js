// src/services/axiosConfig.js
import axios from 'axios';
import { persistor, store } from "../store/index"
import { logout, setToken, updateToken } from '../store/slice/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_CHAT_APP_API_URL,
  withCredentials: false
});

let isRefreshing = false;

// request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.accessToken
      ?? localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//response interceptor
api.interceptors.response.use(
  (response) => {
    // Check every response for a silently refreshed token
    const newToken = response.headers['x-new-token'];

    if (newToken && !isRefreshing) {
      isRefreshing = true;
      localStorage.setItem('token', newToken);
      store.dispatch(updateToken(newToken));
      setTimeout(() => isRefreshing = false, 2000);
    }

    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      await persistor.purge();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
