import axios from "axios";

const API = axios.create({
  baseURL: "https://shopsphere-8kru.onrender.com/api",
});

// Request Interceptor: Automatically attach Authorization token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;