import axios, { AxiosRequestConfig } from "axios";
import { endpoints } from "./routes";
import qs from "qs";

const getAccessToken = () => {
  return localStorage.getItem("auth_token"); 
};

const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

const paramsSerializer = (params: any) => {
  return qs.stringify(params, { arrayFormat: "brackets" });
};

const api = axios.create({
  baseURL: endpoints.host,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAccessToken()}`,
    "Refresh-Token": `${getRefreshToken()}`,
  },
  paramsSerializer: paramsSerializer,
} as AxiosRequestConfig);

export default api;