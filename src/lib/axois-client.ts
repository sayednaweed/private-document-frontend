import axios from "axios";
// import secureLocalStorage from "react-secure-storage";
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/`,
});
axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY);
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-API-KEY"] = import.meta.env.VITE_BACK_END_API_TOKEN;
  return config;
});

axiosClient.interceptors.request.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    console.log(error);
    if (response.status == 401) {
      // localStorage.removeItem(import.meta.env.VITE_TOKEN_STORAGE_KEY);
    }
    throw error;
  }
);

export default axiosClient;
