import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { routes } from "@/config/routes";

interface User {
  // Defina a estrutura do objeto de usuário aqui
}

interface SessionContextProps {
  user: User | null;
  login: (userData: User) => void;
  register: (userData: User) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const router = useRouter(); 
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    // Implemente a lógica de login aqui, incluindo a chamada API
    // ...
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push(routes.landingpage.url);
  };

  const register = (userData: User) => {
    // Implemente a lógica de registro aqui, incluindo a chamada API
    // ...
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
      localStorage.removeItem("user");
      router.push(routes.landingpage.url);
  };

  return <SessionContext.Provider value={{ user, login, register, logout }}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
