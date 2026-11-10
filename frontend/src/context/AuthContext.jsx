import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("eventpro_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("eventpro_user");
    return raw ? JSON.parse(raw) : null;
  });

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("eventpro_token", data.token);
    localStorage.setItem("eventpro_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("eventpro_token", data.token);
    localStorage.setItem("eventpro_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("eventpro_token");
    localStorage.removeItem("eventpro_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
