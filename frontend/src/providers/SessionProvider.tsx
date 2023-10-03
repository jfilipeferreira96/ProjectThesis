"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

export interface User {
  _id: string,
  fullname: string,
  studentId: string,
  email: string,
  avatar: string,
}

interface SessionContextProps {
  user: User | null;
  sessionLogin: (userData: User) => void;
  registerSession: (userData: User) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const router = useRouter(); 
  const [user, setUser] = useState<User | null>(null);

  const sessionLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push(routes.home.url);
  };

  const registerSession = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push(routes.home.url);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push(routes.landingpage.url);
  };

  return <SessionContext.Provider value={{ user, sessionLogin, registerSession, logout }}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
