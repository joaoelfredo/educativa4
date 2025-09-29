import api from './api';

/**
 * Envia as credenciais para a API de login.
 * A API deve retornar um objeto contendo o token: { token: "..." }
 */
export const loginUser = async (email, password) => {
  const response = await api.post('/auth', { email, password });
  return { token: response.data }; 
};

/**
 * Envia os dados de um novo usuário para a API de registro.
 */
export const registerUser = async (name, email, password) => {
  // ATUALIZADO: Usando o endpoint POST /user
  const response = await api.post('/user', { name, email, password });
  return response.data;
};

// A rota de recuperação de senha pode ser adicionada aqui quando o backend a tiver
// export const forgotPassword = async (email) => { ... };