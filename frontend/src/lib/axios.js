import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for sending the cookie
});

let accessToken = null;

// Function to set the token from AuthContext
export const setAuthToken = (token) => {
  accessToken = token;
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Refresh Logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 403/401 and not already retried
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint (cookie is sent automatically)
        const { data } = await api.post("/auth/refresh");
        
        // Update local variable
        accessToken = data.accessToken;
        
        // Update header
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        
        // Retry
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user must login again
        accessToken = null;
        window.location.href = "/"; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;