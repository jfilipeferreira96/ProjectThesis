"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { notifications } from "@mantine/notifications";
import { UserType } from "@/services/auth.service";
import { getChallenges } from "@/services/challenge.service";

export interface User {
  _id: string;
  fullname: string;
  studentId: string;
  email: string;
  avatar: string;
  type: UserType;
  adminChallenges?: string[];
  score?: number;
  password?: string;
}

interface DecodedToken extends JwtPayload {
  user: User;
  exp: number;
}

type sessionProps = (userData: User, accessToken: string, refreshToken: string, redirect?: boolean | undefined) => void;
interface SessionContextProps {
  user: User | null | any;
  sessionLogin: sessionProps;
  logout: () => void;
  isReady: boolean;
  addToAdminChallenge: (challengeId: string) => void;
  updateUser: (newUserData: Partial<User>) => void; 
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const pathname = usePathname();
 
  const sessionLogin: sessionProps = (userData, accessToken, refreshToken, redirect = true) => {
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("avatar", userData.avatar);

    if (redirect) {
      router.push(routes.home.url);
    }
  };

  const logout = (redirect = true) => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("avatar");
    if (redirect) {
      router.push(routes.landingpage.url);
    }
  };

  const getSession = async  () => {
    try {
      const accessToken = localStorage.getItem("accessToken") ?? "";
      const refreshToken = localStorage.getItem("refreshToken") ?? "";
      const avatar = localStorage.getItem("avatar") ?? "";
      const currentDate = new Date();

      if (accessToken) {
        const decodedToken = jwt.decode(accessToken) as DecodedToken;

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          if (pathname !== routes.landingpage.url) {
            notifications.show({
              title: "Error",
              message: "Session expired",
              color: "red",
            });
          }

          logout();
        } else {
          //fetch challenges for setting the adminChallenges
          const userChallenges = await getChallenges();

          let adminChallenges = decodedToken.adminChallenges;
          if (userChallenges.challenges.length > 0) {
            adminChallenges = userChallenges.challenges.reduce((acc: string[], challenge: any) => {
              if (challenge.admins.includes(decodedToken._id)) {
                acc.push(challenge._id);
              }
              return acc;
            }, []);
          }

          const userData = {
            _id: decodedToken._id,
            fullname: decodedToken.fullname,
            studentId: decodedToken.studentId,
            email: decodedToken.email,
            avatar: avatar,
            adminChallenges: adminChallenges,
            type: decodedToken.type,
          };

          sessionLogin(userData, accessToken, refreshToken, false);
        }
      } else {
        logout(false);
      }
      setIsReady(true);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return null;
    }
  };

  const addToAdminChallenge = (challengeId: string) => {
    setUser((prevUser) => {
      if (prevUser) {
        return {
          ...prevUser,
          adminChallenges: [...(prevUser.adminChallenges || []), challengeId],
        };
      }
      return null;
    });
  };

  const updateUser = (newUserData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
  };


  useEffect(() => {
    getSession();
  }, []);

  return <SessionContext.Provider value={{ isReady, user, sessionLogin, logout, addToAdminChallenge, updateUser }}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
