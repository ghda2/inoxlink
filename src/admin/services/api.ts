import axios from 'axios';

const api = axios.create({
    // Como estamos no mesmo domínio, usamos caminho relativo
    baseURL: '/api',
});

export default api;
