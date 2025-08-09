import { BASE_URL } from "@/lib/constants/constants";
import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: `${BASE_URL}/`,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<unknown>
  ): InternalAxiosRequestConfig<unknown> => {
    return config;
  }
);

// Add an interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default api;
