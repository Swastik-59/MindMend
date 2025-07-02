import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mindmend-backend-wmwt.onrender.com/api", // Fixed: Use production URL
  // baseURL: "http://localhost:3001/api", // Keep this commented for local development
  withCredentials: true,
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear localStorage and redirect to login
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_uid");
      window.location.href = "/SignIn";
    }
    return Promise.reject(error);
  }
);
