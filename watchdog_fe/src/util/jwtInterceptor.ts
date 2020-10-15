import Axios, { AxiosRequestConfig } from 'axios';

export const jwtRequestInterceptor = (config: AxiosRequestConfig) => {
    const accessToken = window.localStorage.getItem('watchdogAccessToken');
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
};

export const jwtResponseInterceptor = (error: any) => {
    if (error.response?.status !== 401) {
        return Promise.reject(error);
    }
    if (
        error.config.url === '/token/refresh' ||
        error.response.data.detail === 'User is inactive' ||
        error.response.data.detail === 'User not found'
    ) {
        window.localStorage.removeItem('watchdogAccessToken');
        window.localStorage.removeItem('watchdogRefreshToken');
        return Promise.reject(error);
    }
    const refreshToken = window.localStorage.getItem('watchdogRefreshToken');
    if (refreshToken === null) {
        return Promise.reject(error);
    }
    return Axios.post('/token/refresh/', { refresh: refreshToken }).then((response) => {
        const newAccessToken = response.data['access'];
        const config = error.config;
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        window.localStorage.setItem('watchdogAccessToken', newAccessToken);
        return new Promise((resolve, reject) => {
            Axios(config)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    window.localStorage.removeItem('watchdogAccessToken');
                    window.localStorage.removeItem('watchdogRefreshToken');
                    reject(err);
                });
        }).catch((error) => {
            window.localStorage.removeItem('watchdogAccessToken');
            window.localStorage.removeItem('watchdogRefreshToken');
            return Promise.reject(error);
        });
    });
};
