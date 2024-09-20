import axios from "axios";

const productosApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/productos`
});

productosApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'Authorization': sessionStorage.getItem('token'),
    }
    return config;
});

export default productosApi;