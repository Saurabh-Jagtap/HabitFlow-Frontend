import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const publicRoutes = ["/login", "/register", "/", "/forgotPassword", "/resetPassword"];

    const isPublicPage = publicRoutes.some(route =>
      window.location.pathname.startsWith(route)
    );

    if (isPublicPage) {
      return Promise.reject(error);
    }

    // If not 401 -> reject
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Do NOT intercept refresh-token itself
    if (originalRequest.url.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    // Prevent infinite retry
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Handle concurrent requests
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Call refresh-token
      await api.post("/api/v1/user/refresh-token");

      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
