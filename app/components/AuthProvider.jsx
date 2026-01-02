"use client"
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/v1/user/me`,
        { withCredentials: true }
      );
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
