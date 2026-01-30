import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../services/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (credentials) => {
    const res = await axiosInstance.post("/users/login", credentials);

    setUser(res.data.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.data.user));
  };

  // SIGNUP (AGENT ONLY)
  const signup = async (data) => {
    return axiosInstance.post("/users/register", data);
  };

  // LOGOUT
  const logout = async () => {
    await axiosInstance.post("/users/logout");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup, // ✅ NOW AVAILABLE
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
