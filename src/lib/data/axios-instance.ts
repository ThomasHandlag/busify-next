import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to handle errors globally
// api.interceptors.response.use(
//   response => response,
//   error => {
//     console.error("API Error:", error);
//     return Promise.reject(error);
//   }
// );

export default api;
