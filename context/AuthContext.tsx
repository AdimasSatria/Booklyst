"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
  isAdmin?: boolean;
}

// Akun admin yang terdaftar (mock, frontend-only).
const ADMIN_EMAILS = ["25081010266@student.upnjatim.ac.id"];

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "booklyst_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration-safe read: localStorage only available on client.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user, isMounted]);

  const login = (email: string, name?: string) => {
    const nextUser: User = {
      name: name?.trim() || email.split("@")[0],
      email,
      isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
    };
    setUser(nextUser);
  };

  const logout = () => setUser(null);

  const contextValue: AuthContextType = {
    // Guard against hydration mismatch: treat as logged-out until mounted.
    user: isMounted ? user : null,
    isLoggedIn: isMounted ? !!user : false,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
