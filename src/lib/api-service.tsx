import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://localhost:7118/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  // Get token from localStorage or other storage
  const token = localStorage.getItem("token");

  // If token exists, add it to the headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response:any) => response,
  (error:any) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      console.log("Unauthorized, redirecting to login...");
      // You can use router here to redirect
    }
    return Promise.reject(error);
  }
);

export default api;
