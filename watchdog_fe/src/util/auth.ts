export const clearToken = () => {
    window.localStorage.removeItem('watchdogAccessToken');
    window.localStorage.removeItem('watchdogRefreshToken');
};
