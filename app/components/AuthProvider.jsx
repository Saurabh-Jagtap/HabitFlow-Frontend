"use client"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import api from "../utils/axios.utils.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(`${apiUrl}/api/v1/user/me`);
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  },[apiUrl]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <LoadingSpinner fullScreen={true} message="Initializing HabitFlow..." />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
