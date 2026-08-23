import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/auth/login/", { username, password });
    const { access, refresh, username: returnedUsername } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("username", returnedUsername);

    setUser({ username: returnedUsername });
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
