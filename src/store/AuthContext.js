import React from 'react';
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  // O nome é userToken, mas ele vai guardar o objeto inteiro que a API retorna
  const [userToken, setUserToken] = useState(null); 

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // --> A variável 'token' aqui é na verdade um objeto retornado pela API.
      const tokenObject = await loginUser(email, password); // Chamada de API

      // --> 1. Stringify o objeto ANTES de salvar.
      await AsyncStorage.setItem('userToken', JSON.stringify(tokenObject));
      
      // --> 2. O estado 'userToken' agora vai guardar o objeto inteiro.
      setUserToken(tokenObject);

    } catch (error) {
      // Lançar o erro para a tela de Login tratar
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (e) {
      console.log('Erro ao deslogar:', e);
    }
  };

  const register = async (name, email, password) => {
    await registerUser(name, email, password);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      // --> 1. Recupera o dado como string.
      let storedTokenString = await AsyncStorage.getItem('userToken');

      // --> 2. IMPORTANTE: Verifica se algo foi encontrado antes de tentar o parse.
      if (storedTokenString) {
        // --> 3. Converte a string de volta para um objeto e atualiza o estado.
        setUserToken(JSON.parse(storedTokenString));
      }
    } catch (e) {
      console.log(`isLogged in error ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, register, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};