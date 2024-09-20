import axios from "axios";

const comprasApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/compras`
});

comprasApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'Authorization': sessionStorage.getItem('token'),
    }
    return config;
});

export default comprasApi;