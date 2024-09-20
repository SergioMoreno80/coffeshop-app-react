import axios from "axios";

const estudiantesApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/estudiantes`
});

estudiantesApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'Authorization': sessionStorage.getItem('token'),
    }
    return config;
});

export default estudiantesApi;