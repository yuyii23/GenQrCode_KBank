import axios from 'axios';
import { useAuthorityStore } from '@/stores/authority';

const baseApiUrl = import.meta.env.VITE_API_URL_PRODUCTION;

const axiosServices = axios.create({
  baseURL: baseApiUrl,
});

axiosServices.interceptors.request.use((config) => {
  const auth = useAuthorityStore();
  if (auth.getAuthenKey) {
    config.headers = {
      ...config.headers,
      Authorization: `bearer ${auth.getAuthenKey}`,
    };
  }
  return config;
});

axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const auth = useAuthorityStore();
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await auth.getAccessToken();

      originalRequest.headers['Authorization'] = auth.getAuthenKey;
      originalRequest.transformResponse = axios.defaults.transformResponse;
      originalRequest.transformRequest = axios.defaults.transformRequest;

      return axiosServices(error.config);
    }

    return (error.response && error.response) || 'Wrong Services';
  }
);

export default axiosServices;
