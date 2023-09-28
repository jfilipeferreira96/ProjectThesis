// AuthService.ts
import api from "@/config/api";
import { loginRoute, registerRoute } from "@/config/routes";
import { notifications } from '@mantine/notifications';

export interface LoginData
{
  email: string;
  password: string;
}

interface RegisterData
{
  email: string;
  fullname: string;
  password: string;
  avatar: string;
  numberid?: number | string;
}

export const login = async (data: LoginData) => {
  try
  {
    const response = await api.post(loginRoute, data);
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
    const response = await api.post(registerRoute, data);
    return response.data;
  }
  catch (error)
  {
    throw error;
  }
};