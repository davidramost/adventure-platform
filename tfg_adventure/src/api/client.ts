import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://tfg-daw-smx4.onrender.com/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        const isTimeout = error.code === 'ECONNABORTED';
        const isNetworkError = !error.response && error.message !== 'canceled';
        if (isTimeout || isNetworkError) {
            window.dispatchEvent(new CustomEvent('server-unavailable'));
        }
        return Promise.reject(error);
    }
);

export default api;
