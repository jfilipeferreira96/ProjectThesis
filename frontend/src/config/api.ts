import axios, { AxiosRequestConfig } from 'axios';
import { endpoints } from './routes';
import qs from 'qs';

const paramsSerializer = (params: any) =>{
  return qs.stringify(params, { arrayFormat: 'brackets' });
};

const api = axios.create({
  baseURL: endpoints.host, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: paramsSerializer
} as AxiosRequestConfig);

export default api;
