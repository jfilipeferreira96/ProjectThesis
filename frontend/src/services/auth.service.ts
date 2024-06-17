import api from "@/config/api";
import { endpoints } from "@/config/routes";
import { User } from "@/providers/SessionProvider";

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
    const response = await api.post(endpoints.loginRoute, data);

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

export const updateAccount = async (userId: number, data: Partial<User>) => {
  try
  {
    const response = await api.put(`${endpoints.updateAccount}/${userId}`, data);
    return response.data;
  } catch (error)
  {
    throw error;
  }
};
