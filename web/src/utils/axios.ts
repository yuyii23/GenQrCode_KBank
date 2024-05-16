import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_API_URL_PRODUCTION;

const axiosServices = axios.create({
  baseURL: baseApiUrl,
});



axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    return (error.response && error.response) || 'Wrong Services';
  }
);

export default axiosServices;
