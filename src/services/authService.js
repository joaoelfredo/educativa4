import api from './api';

// ================================================================
// INTERRUPTOR DE SIMULAÇÃO (MOCK)
// Mude para 'false' quando quiser usar a API real do backend.
// ================================================================
const MOCK_API = true;

/**
 * Envia as credenciais para a API de login ou simula a resposta.
 * A API deve retornar um objeto contendo o token: { token: "..." }
 */
export const loginUser = async (email, password) => {
  if (MOCK_API) {
    // --- INÍCIO DO CÓDIGO DE SIMULAÇÃO ---
    console.log('----------- MODO MOCK ATIVADO -----------');
    console.log('Simulando chamada de login para a API com:', { email, password });

    // Simula um atraso de rede de 1 segundo
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Lógica de sucesso: Se o usuário e senha forem os de teste, simula o sucesso
        if (email === 'email@email.com' && password === '123456') {
          console.log('Mock: Login bem-sucedido!');
          const mockResponse = { token: 'fake-jwt-token-for-dev-1234567890' };
          resolve(mockResponse);
        } else {
          // Lógica de erro: Se as credenciais estiverem erradas, simula um erro
          console.log('Mock: Credenciais inválidas!');
          // A estrutura do 'reject' simula um erro do Axios para o AuthContext capturar
          reject({ 
            response: { 
              data: { 
                message: 'Credenciais inválidas (resposta simulada)' 
              } 
            } 
          });
        }
      }, 1000);
    });
    // --- FIM DO CÓDIGO DE SIMULAÇÃO ---
  } else {
    // --- CÓDIGO REAL DA API ---
    // Se MOCK_API for false, executa a chamada real
    const response = await api.post('/auth', { email, password });
    return response.data; 
  }
};

/**
 * Envia os dados de um novo usuário para a API de registro ou simula.
 */
export const registerUser = async (name, email, password) => {
  if (MOCK_API) {
    console.log('----------- MODO MOCK ATIVADO -----------');
    console.log('Simulando chamada de registro para a API com:', { name, email, password });
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Mock: Registro bem-sucedido!');
        resolve({ message: 'Usuário criado com sucesso! (resposta simulada)' });
      }, 1000);
    });
  } else {
    const response = await api.post('/user', { name, email, password });
    return response.data;
  }
};

// ... (outras funções podem ser mockadas da mesma forma)