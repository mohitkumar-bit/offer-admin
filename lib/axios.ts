import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
    baseURL: 'http://localhost:5001/api', // Based on the backend server port
});

API.interceptors.request.use((config) => {
    const token = Cookies.get('adminToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = Cookies.get('adminRefreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const response = await axios.post(`${API.defaults.baseURL}/auth/refresh`, {
                    refreshToken,
                });

                const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

                Cookies.set('adminToken', newAccessToken, { expires: 7 });
                Cookies.set('adminRefreshToken', newRefreshToken, { expires: 7 });

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                Cookies.remove('adminToken');
                Cookies.remove('adminRefreshToken');
                Cookies.remove('adminData');

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('unauthorized'));
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
