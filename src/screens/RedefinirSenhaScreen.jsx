import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api'; 

import Input from '../components/Input';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import { COLORS, FONTS } from '../constants/theme';

const RedefinirSenhaScreen = ({ navigation, route }) => {
    
    const { token } = route.params || {}; 

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleResetPassword = async () => {
        if (!token) {
            Alert.alert('Erro', 'Token de recuperação inválido ou não encontrado. Por favor, tente novamente pelo link do seu e-mail.');
            return;
        }
        if (!password || !confirmPassword) {
            Alert.alert('Atenção', 'Por favor, preencha e confirme sua nova senha.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
             Alert.alert('Senha Fraca', 'Sua nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await api.patch('/auth/reset-password-confirm', {
                token: token,
                newPassword: password,
                confirmNewPassword: confirmPassword
            });

            Alert.alert(
                'Sucesso!',
                response.data.message || 'Sua senha foi redefinida. Você já pode fazer login.',
                [
                    { text: 'OK', onPress: () => navigation.navigate('Login') }
                ]
            );

        } catch (error) {
            console.error("Erro ao redefinir senha:", error.response?.data);
            const errorMessage = error.response?.data?.message || 'Token inválido/expirado ou erro no servidor.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={COLORS.secondaryGradient} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.header}>
                            <Mascot width={128} height={128} />
                            <Text style={styles.title}>Redefinir Senha</Text>
                            <Text style={styles.subtitle}>
                                Crie uma nova senha forte para sua conta. 🔒
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <Input
                                placeholder="🔒 Digite sua nova senha"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                                icon={
                                    <Ionicons
                                        name={isPasswordVisible ? 'eye-off' : 'eye'}
                                        size={24}
                                        color={COLORS.blue}
                                    />
                                }
                                onIconPress={() => setPasswordVisible(!isPasswordVisible)}
                            />
                            
                            <Input
                                placeholder="🔒 Confirme sua nova senha"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!isConfirmPasswordVisible}
                                icon={
                                    <Ionicons
                                        name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                                        size={24}
                                        color={COLORS.blue}
                                    />
                                }
                                onIconPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            />

                            <Button
                                title="Salvar Nova Senha"
                                onPress={handleResetPassword}
                                loading={loading}
                            />
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Lembrou da senha? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={[styles.footerText, styles.link]}>Fazer login</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    form: {
        width: '100%',
        maxWidth: 320,
        marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...FONTS.h1,
        color: COLORS.white,
        textAlign: 'center',
        marginTop: 16,
    },
    subtitle: {
        ...FONTS.body,
        color: COLORS.white,
        opacity: 0.9,
        textAlign: 'center',
        marginTop: 8,
        fontSize: 16,
    },
    link: {
        ...FONTS.body,
        fontWeight: '700',
        color: COLORS.primary,
        textAlign: 'center',
        paddingVertical: 8,
    },
    footerText: {
        ...FONTS.body,
        color: COLORS.white
    },
});

export default RedefinirSenhaScreen;