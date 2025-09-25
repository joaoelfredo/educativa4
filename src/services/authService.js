// Versão "mock" (falsa) apenas para o app rodar
export const loginUser = async (email, password) => {
  console.log('Tentando login com:', email, password);
  // Simula uma chamada de API
  return new Promise(resolve => setTimeout(() => resolve('fake-token-123'), 1000));
};

export const registerUser = async (name, email, password) => {
  console.log('Tentando registrar:', name, email, password);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
};