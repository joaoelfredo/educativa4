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
            const responseData = await loginUser(email, password);
            const { token, user: userData } = responseData;

            setUserToken(token);
            setUser(userData);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));

        } catch (error) {
            console.error("Erro no login:", error.response?.data);
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('user');
            setUserToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
        } catch (e) {
            console.log('Erro ao deslogar:', e);
        }
    };

    const register = async (name, email, password) => {
        try {
            await registerUser(name, email, password);
        } catch (error) {
            console.error("Erro no registro:", error);
            throw new Error(error.response?.data?.message || 'Erro ao registrar');
        }
    };

    const loadStoredData = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const userString = await AsyncStorage.getItem('user');

            if (token && userString) {
                setUserToken(token);
                setUser(JSON.parse(userString));
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            console.log(`Erro ao carregar dados salvos: ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = async (newUserData) => {
        try {
            setUser(newUserData); 
            await AsyncStorage.setItem('user', JSON.stringify(newUserData)); 
        } catch (e) {
            console.error("Erro ao atualizar usuário no contexto:", e);
        }
    };

    useEffect(() => {
        loadStoredData();
    }, []);

    return (
        <AuthContext.Provider value={{
            login,
            logout,
            register,
            isLoading,
            userToken,
            user, 
            updateUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};