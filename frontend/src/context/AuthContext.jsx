import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const isStaff = localStorage.getItem("is_staff") === "true";
    if (token && username) {
      setUser({ username, isStaff });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/auth/login/", { username, password });
    const {
      access,
      refresh,
      username: returnedUsername,
      is_staff,
    } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("username", returnedUsername);
    localStorage.setItem("is_staff", is_staff ? "true" : "false");

    setUser({ username: returnedUsername, isStaff: !!is_staff });
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await api.post("/auth/register/", {
      username,
      email,
      password,
    });
    return response.data;
  };

  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password/", { email });
    return response.data;
  };

  const resetPassword = async (uid, token, password) => {
    const response = await api.post("/auth/reset-password/", {
      uid,
      token,
      password,
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("is_staff");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
