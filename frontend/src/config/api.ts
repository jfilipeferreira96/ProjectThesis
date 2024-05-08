import axios, { AxiosRequestConfig } from "axios";
import { endpoints } from "./routes";
import qs from "qs";

const paramsSerializer = (params: any) => {
  return qs.stringify(params, { arrayFormat: "brackets" });
};


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://51.89.138.159:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: paramsSerializer,
} as AxiosRequestConfig);

// Add a request interceptor
api.interceptors.request.use((config) =>
{
  const accessToken = localStorage?.getItem("accessToken");
  const refreshToken = localStorage?.getItem("refreshToken");
  
  if (accessToken)
  {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (refreshToken)
  {
    config.headers["Refresh-Token"] = "refreshToken";
  }

  return config;
});

export default api;
