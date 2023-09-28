import axios, { AxiosRequestConfig } from 'axios';
import { host } from './routes';
import qs from 'qs';

const paramsSerializer = (params: any) =>{
  return qs.stringify(params, { arrayFormat: 'brackets' });
};

const api = axios.create({
  baseURL: host, 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: paramsSerializer
} as AxiosRequestConfig);

export default api;
