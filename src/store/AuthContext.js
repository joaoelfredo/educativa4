import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/authService.js';
import api from '../services/api';
import { fetchUserProfile } from '../services/api';

export const AuthContext = createContext({});

const normalizeUserData = (rawUser) => {
    if (!rawUser) return null;

    const xp = rawUser.xp ?? 0;
    const xpToNextLevel = rawUser.xpToNextLevel ?? 100;
    const xpProgress = rawUser.xpProgress ?? (xp % xpToNextLevel);
    const level = rawUser.level ?? Math.floor(xp / xpToNextLevel) + 1;

    return {
        ...rawUser,
        xp,
        xpToNextLevel,
        xpProgress,
        level,
    };
};

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null); 
    const [user, setUser] = useState(null); 

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const responseData = await loginUser(email, password);
            console.log('🔵 AuthContext login responseData:', responseData);
            const { token, user: userData } = responseData;

            const trimmedToken = token?.trim();
            setUserToken(trimmedToken);

            if (trimmedToken) {
              api.defaults.headers.common['Authorization'] = `Bearer ${trimmedToken}`;
            }

            let finalUser = normalizeUserData(userData);
            try {
                const profileUser = await fetchUserProfile();
                finalUser = normalizeUserData(profileUser ?? userData);
            } catch (profileError) {
                console.warn('Não foi possível buscar perfil após login:', profileError?.message || profileError);
            }

            setUser(finalUser);
            await AsyncStorage.setItem('userToken', trimmedToken);
            await AsyncStorage.setItem('user', JSON.stringify(finalUser));

        } catch (error) {
            console.error("Erro no login:", error.response?.data || error.message);
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Erro ao fazer login';
            throw new Error(message);
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
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Erro ao registrar';
            throw new Error(message);
        }
    };

    const loadStoredData = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const userString = await AsyncStorage.getItem('user');

            const trimmedToken = token?.trim();
            if (trimmedToken) {
                setUserToken(trimmedToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${trimmedToken}`;

                let storedUser = userString ? JSON.parse(userString) : null;
                try {
                    const profileUser = await fetchUserProfile();
                    setUser(normalizeUserData(profileUser ?? storedUser));
                } catch (profileError) {
                    console.warn('Não foi possível buscar perfil armazenado:', profileError?.message || profileError);
                    setUser(normalizeUserData(storedUser));
                }
            } else {
                delete api.defaults.headers.common['Authorization'];
            }
        } catch (e) {
            console.log(`Erro ao carregar dados salvos: ${e}`);
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = async (newUserData) => {
        try {
            const normalized = normalizeUserData(newUserData);
            setUser(normalized);
            await AsyncStorage.setItem('user', JSON.stringify(normalized));
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