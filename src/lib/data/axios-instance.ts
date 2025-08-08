import axios from "axios";
import { BASE_URL } from "@/lib/constants/constants";

const api = axios.create({
  baseURL: `${BASE_URL}/`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/passenger/login";
    }
    return Promise.reject(error);
  }
);

export default api;
