// useApi.js
import axios from "axios";

const useApi = axios.create({
  baseURL: "http://192.168.0.47:4000",
});

// Interceptor para agregar el token a las peticiones
useApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtener el token del localStorage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export { useApi };