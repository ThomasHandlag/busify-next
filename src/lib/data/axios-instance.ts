import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config: InternalAxiosRequestConfig<unknown>): InternalAxiosRequestConfig<unknown> => {
  return config;
});

export default api;
