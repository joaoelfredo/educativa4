import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL } from '@env';

const getBaseURL = () => {
  if (Platform.OS === 'web') {
    return API_BASE_URL || 'http://192.168.1.9:3333';
  }

  if (Platform.OS === 'android') {
    if (!API_BASE_URL || API_BASE_URL.includes('localhost')) {
      return 'http://192.168.1.9:3333';
    }
    return API_BASE_URL;
  }

  if (Platform.OS === 'ios') {
    if (!API_BASE_URL) {
      return 'http://localhost:3333';
    }
    return API_BASE_URL;
  }

  return API_BASE_URL || 'http://localhost:3333';
};

const BASE_URL = getBaseURL();

console.log('🔵 Platform:', Platform.OS);
console.log('🔵 API_BASE_URL raw:', API_BASE_URL);
console.log('🔵 API_BASE_URL resolvida:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    console.log('🔵 Fazendo requisição para:', config.baseURL + config.url);
    console.log('🔵 Método:', config.method);
    console.log('🔵 Dados enviados:', config.data);

    config.headers = config.headers || {};
    const token = (await AsyncStorage.getItem('userToken'))?.trim();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 Token anexado:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ Nenhum token encontrado no AsyncStorage');
      delete config.headers.Authorization;
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
    if (error.response) {
      console.log('🔴 Status:', error.response.status);
      console.log('🔴 Mensagem:', error.response.data);
    } else if (error.request) {
      console.log('🔴 A requisição foi feita, mas nenhuma resposta recebida.');
      console.log('🔴 Request:', error.request);
    } else {
      console.log('🔴 Erro ao configurar a requisição:', error.message);
    }
    console.log('🔴 URL que falhou:', error.config?.url);
    console.log('🔴 Erro completo:', error.message);
    return Promise.reject(error);
  }
);

export const createGoal = async (goalInput) => {
  const title = typeof goalInput === 'string' ? goalInput : goalInput?.title ?? goalInput?.text
  const text = typeof goalInput === 'string' ? goalInput : goalInput?.text ?? goalInput?.title
  const priority = typeof goalInput === 'string' ? 'media' : goalInput?.priority ?? 'media'
  const totalSessions = typeof goalInput === 'object' && Number.isInteger(goalInput?.totalSessions)
    ? goalInput.totalSessions
    : Number(goalInput?.totalSessions) || 1

  try {
    const response = await api.post('/goals', { title, text, priority, totalSessions });
    return response.data?.newGoal ?? null;
  } catch (error) {
    console.error('[api] Erro em createGoal:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchGoals = async () => {
  try {
    const response = await api.get('/goals');
    return response.data?.goals ?? [];
  } catch (error) {
    console.error('[api] Erro em fetchGoals:', error.response?.data || error.message);
    throw error;
  }
};

export const progressGoal = async (goalId, duration = 25) => {
  try {
    const response = await api.patch(`/goals/${goalId}/progress`, { duration });
    return response.data?.goal ?? null;
  } catch (error) {
    console.error('[api] Erro em progressGoal:', error.response?.data || error.message);
    throw error;
  }
};

export const completeGoal = async (goalId) => {
  try {
    const response = await api.patch(`/goals/${goalId}/complete`);
    return response.data;
  } catch (error) {
    console.error('[api] Erro em completeGoal:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    const response = await api.delete(`/goals/${goalId}`);
    return response.status === 204;
  } catch (error) {
    console.error('[api] Erro em deleteGoal:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data?.user ?? null;
  } catch (error) {
    console.warn('[api] fetchUserProfile falhou:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchXP = async () => {
  try {
    const user = await fetchUserProfile();
    return user?.xp ?? 0;
  } catch (error) {
    return 0;
  }
};

export const fetchHistory = async () => {
  try {
    const response = await api.get('/goals/history');
    return Array.isArray(response.data) ? response.data : response.data.history ?? [];
  } catch (error) {
    console.warn('[api] fetchHistory falhou, retornando vazio:', error.response?.data || error.message);
    return [];
  }
};

export const fetchMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data ?? {
      weekGoals: 0,
      monthGoals: 0,
      yearGoals: 0,
      completedTasks: 0,
      streakDays: 0,
      currentLevel: 1,
    };
  } catch (error) {
    console.error('[api] Erro em fetchMetrics:', error.response?.data || error.message);
    return {
      weekGoals: 0,
      monthGoals: 0,
      yearGoals: 0,
      completedTasks: 0,
      streakDays: 0,
      currentLevel: 1,
    };
  }
};

export default api;