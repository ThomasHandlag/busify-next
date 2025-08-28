import { BASE_URL } from "@/lib/constants/constants";
import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import TokenManager from "@/lib/utils/token-manager";

export type ApiFnParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  callback: (message: string) => void;
  localeMessage?: string;
};

const api = axios.create({
  baseURL: `${BASE_URL}/`,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để tự động thêm access token
api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // Chỉ thêm token cho các request cần authentication
    if (
      config.url &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {
      try {
        const accessToken = await TokenManager.getValidAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý 401 và retry với token mới
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    console.error("API Error:", error);

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const newAccessToken = await TokenManager.getValidAccessToken();

        if (newAccessToken && originalRequest.headers) {
          // Cập nhật token mới và retry request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Token refresh thất bại, chuyển hướng đến login
        await TokenManager.handleTokenExpired();
        return Promise.reject(refreshError);
      }
    }

    // Nếu vẫn là 401 sau khi retry hoặc lỗi khác
    if (error.response?.status === 401) {
      await TokenManager.handleTokenExpired();
    }

    return Promise.reject(error);
  }
);

export default api;
