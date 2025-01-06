import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('error', error);
        if (error.response?.status === 401) {
            try {
                await axios.post('http://localhost:8000/api/token/refresh/', {}, { withCredentials: true }
                )
            } catch (authError) {
                if (window.location.pathname !== '/user/login') {
                    window.location.href = '/user/login';
                }
                console.log("auth error", authError)
                return Promise.reject(authError)
            }
            return apiClient.request(error.config)
        }

        return Promise.reject(error)
    });
export default apiClient;