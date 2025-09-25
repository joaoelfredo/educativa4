import axios from 'axios';

const api = axios.create({
  baseURL: 'http://sua-api-aqui.com', // URL temporária
});

export default api;