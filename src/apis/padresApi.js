import axios from "axios";

const padresApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/padres`
});

padresApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'Authorization': sessionStorage.getItem('token'),
    }
    return config;
});

export default padresApi;