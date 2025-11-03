import React, { createContext, useState, useEffect } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/authService.js';
import api from '../services/api'; 

export const AuthContext = createContext({}); 

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null); 

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 3. A API retorna o objeto { token, user }
      const responseData = await loginUser(email, password); 

      const { token, user: userData } = responseData; 

      // 4. Salvar dados separadamente
      setUserToken(token); 
      setUser(userData); 

      // 5. Configurar o Axios para usar o token em todas as futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 6. Salvar no AsyncStorage separadamente
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData)); 

    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user'); // 7. Remover usuário do storage
      setUserToken(null);
      setUser(null); // 8. Limpar o estado do usuário
      delete api.defaults.headers.common['Authorization']; // Limpa o header do Axios
    } catch (e) {
      console.log('Erro ao deslogar:', e);
    }
  };

  const register = async (name, email, password) => {
    // A função de registro não precisa logar, apenas registrar.
    // A tela de Cadastro deve redirecionar para Login após o sucesso.
    try {
        await registerUser(name, email, password);
    } catch (error) {
         console.error("Erro no registro:", error);
         throw new Error(error.response?.data?.message || 'Erro ao registrar');
    }
  };

  // Renomeado para mais clareza
  const loadStoredData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const userString = await AsyncStorage.getItem('user'); // 9. Carregar o usuário

      if (token && userString) {
        setUserToken(token);
        setUser(JSON.parse(userString)); // 10. Salvar usuário no estado
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Reconfigurar o Axios
      }
    } catch (e) {
      console.log(`Erro ao carregar dados salvos: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  return (
    // 11. Expor o 'user' para o restante do app
    <AuthContext.Provider value={{ login, logout, register, isLoading, userToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};