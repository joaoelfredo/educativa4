import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL } from '@env';

const getBaseURL = () => {
  // Forçando a URL de produção do Render para contornar o cache do .env
  return 'https://educativaback.onrender.com';
};

const BASE_URL = getBaseURL();

console.log('🔵 Platform:', Platform.OS);
console.log('🔵 API_BASE_URL configurada:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    console.log('🔵 Fazendo requisição para:', config.baseURL + config.url);
    console.log('🔵 Método:', config.method);
    console.log('🔵 Dados enviados:', config.data);
    
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 Token anexado:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ Nenhum token encontrado no AsyncStorage');
    }

    return config;
  },
  (error) => {
    console.log('🔴 Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('🟢 Resposta recebida com sucesso:', response.status);
    console.log('🟢 Dados da resposta:', response.data);
    return response;
  },
  (error) => {
    console.log('🔴 Erro na requisição!');
    console.log('🔴 Status:', error.response?.status);
    console.log('🔴 Mensagem:', error.response?.data);
    console.log('🔴 URL que falhou:', error.config?.url);
    console.log('🔴 Erro completo:', error.message);
    return Promise.reject(error);
  }
);

export default api;