import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Ye endpoints public hain — inpe kabhi bhi Authorization token nahi lagna chahiye
const PUBLIC_ENDPOINTS = [
  '/auth/login/',
  '/auth/register/',
  '/auth/forgot-password/',
  '/auth/reset-password/',
  '/auth/refresh/',
  '/contact/',
];

function isPublicEndpoint(url) {
  return PUBLIC_ENDPOINTS.some((endpoint) => url?.includes(endpoint));
}

// Request interceptor: sirf protected endpoints pe token attach karo
api.interceptors.request.use((config) => {
  if (!isPublicEndpoint(config.url)) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: agar access token expire ho gaya (401), to refresh token se
// khamoshi se naya access token le kar original request dobara chalao
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Public endpoints (jaise login khud) pe 401 aaye to bas error return karo,
    // refresh mat karo — ye galat username/password ka normal error hai
    if (isPublicEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // Refresh token bhi nahi hai — user ko login page pe bhejna hoga
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Ek refresh already chal raha hai, uska result wait karo
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/auth/refresh/',
          { refresh: refreshToken }
        );
        const newAccessToken = response.data.access;

        localStorage.setItem('access_token', newAccessToken);
        isRefreshing = false;
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token bhi expire/invalid ho chuka — ab dobara login zaroori hai
        isRefreshing = false;
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;