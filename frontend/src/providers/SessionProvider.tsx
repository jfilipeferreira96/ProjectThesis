"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { notifications } from "@mantine/notifications";

export interface User {
  _id: string;
  fullname: string;
  studentId: string;
  email: string;
  avatar: string;
}

interface DecodedToken extends JwtPayload {
  user: User;
  exp: number;
}

type sessionProps = (userData: User, accessToken: string, refreshToken: string, redirect?: boolean | undefined) => void;
interface SessionContextProps {
  user: User | null;
  sessionLogin: sessionProps;
  logout: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const sessionLogin: sessionProps = (userData, accessToken, refreshToken, redirect = true) => {
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    if (redirect) {
      router.push(routes.home.url);
    }
  };

  const logout = (redirect = true) => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (redirect) {
      router.push(routes.landingpage.url);
    }
  };

  const getSession = () => {
    try {
      const accessToken = localStorage.getItem("accessToken") ?? "";
      const refreshToken = localStorage.getItem("refreshToken") ?? "";
      const currentDate = new Date();
      if (accessToken) {
        const decodedToken = jwt.decode(accessToken) as DecodedToken;

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          notifications.show({
            title: "Error",
            message: "Session expired",
            color: "red",
          });
          logout();
        } else {
          const userData = {
            _id: decodedToken._id,
            fullname: decodedToken.fullname,
            studentId: decodedToken.studentId,
            email: decodedToken.email,
            avatar: decodedToken.avatar,
          };
          sessionLogin(userData, accessToken, refreshToken, false);
        }
      } else {
        logout(false);
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return null;
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return <SessionContext.Provider value={{ user, sessionLogin, logout }}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
