import axios, { AxiosRequestConfig } from "axios";
import { endpoints } from "./routes";
import qs from "qs";

const paramsSerializer = (params: any) => {
  return qs.stringify(params, { arrayFormat: "brackets" });
};

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: baseURL || "http://51.89.138.159:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: paramsSerializer,
} as AxiosRequestConfig);

// Add a request interceptor
api.interceptors.request.use(async (config) => {
  if (isServer) {
    const { cookies } = await import("next/headers");
    const token = cookies().get("token")?.value;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } else {
    const accessToken = localStorage?.getItem("accessToken");
    const refreshToken = localStorage?.getItem("refreshToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      config.headers["Refresh-Token"] = "refreshToken";
    }
  }

  return config;
});

export default api;
