import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api, { setAuthToken } from "../lib/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Store token in state
  const [loading, setLoading] = useState(true);

  // Helper to update state and axios
  const handleAuthSuccess = (accessToken) => {
    setToken(accessToken);
    setAuthToken(accessToken); // Sync with Axios
    
    try {
      const decoded = jwtDecode(accessToken);
      setUser({
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      });
    } catch (e) {
      console.error("Token decode failed", e);
    }
  };

  // On Page Load: Try to refresh to get a token
  useEffect(() => {
    const initAuth = async () => {
      try {
        // This request sends the HttpOnly cookie
        const { data } = await api.post("/auth/refresh");
        handleAuthSuccess(data.accessToken);
      } catch (error) {
        // No session or expired
        setUser(null);
        setToken(null);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    handleAuthSuccess(data.accessToken);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setToken(null);
      setAuthToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);