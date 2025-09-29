import React from 'react';
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

const login = async (email, password) => {
    setIsLoading(true);
    try {
      // 1. Chama a função do authService
      const response = await loginUser(email, password);
      const token = response.token; // Pega o token da resposta da API

      if (token) {
        // 2. Salva o token no estado do app
        setUserToken(token);
        // 3. Salva o token no AsyncStorage (o "localStorage" do React Native)
        await AsyncStorage.setItem('userToken', token);
      } else {
        throw new Error("Token não recebido da API");
      }

    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };
  
  const register = async (name, email, password) => {
    // A lógica de registro pode retornar um token diretamente ou não
    // Aqui, vamos apenas chamar o serviço e deixar o usuário fazer login depois
    await registerUser(name, email, password);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
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