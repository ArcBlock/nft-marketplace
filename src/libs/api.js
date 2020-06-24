import axios from 'axios';
import env from './env';

axios.defaults.baseURL = env.apiPrefix || '';
axios.defaults.timeout = 200000;

axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('login_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axios;
