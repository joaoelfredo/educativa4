import api from './api';

const MOCK_API = false;

export const loginUser = async (email, password) => {
  if (MOCK_API) {

    console.log('----------- MODO MOCK ATIVADO -----------');
    console.log('Simulando chamada de login para a API com:', { email, password });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'email@email.com' && password === '123456') {
          console.log('Mock: Login bem-sucedido!');
          const mockResponse = { token: 'fake-jwt-token-for-dev-1234567890' };
          resolve(mockResponse);
        } else {
          console.log('Mock: Credenciais inválidas!');
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
} else {
  // --- CÓDIGO REAL DA API ---
  const response = await api.post('/auth/login', { email, password });
  return response.data; 
}
};

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
    // --- CÓDIGO REAL DA API ---
      const response = await api.post('/user', { name, email, password });
    return response.data;
  }
};

