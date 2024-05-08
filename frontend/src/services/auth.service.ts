import api from "@/config/api";
import { endpoints } from "@/config/routes";

export interface LoginData {
  email: string;
  password: string;
}

export enum UserType {
  STUDENT = "Student",
  TEACHER = "Teacher",
  ADMIN = "Admin"
}

export interface RegisterData {
  email: string;
  fullname: string;
  password: string;
  avatar: string;
  type: UserType;
  studentId?: number | string;
}

export const login = async (data: LoginData) => {
  try
  {
    console.log(endpoints.loginRoute, data);
    const response = await api.post(endpoints.loginRoute, data);
    const teste = await api.post("/api/auth/login", data);
    const teste123 = await api.post("http://51.89.138.159:5000/api/auth/login", data);
    console.log(teste)
    console.log(teste123);
    return response.data;
  }
  catch (error)
  {
    throw error;
  }
};

export const register = async (data: RegisterData) => {
  try
  {
    const response = await api.post(endpoints.registerRoute, data);
    return response.data;
  }
  catch (error)
  {
    throw error;
  }
};