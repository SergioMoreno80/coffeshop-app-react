import axios from "axios";

const recargasApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/recargas`
});

recargasApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'Authorization': sessionStorage.getItem('token'),
    }
    return config;
});

export default recargasApi;