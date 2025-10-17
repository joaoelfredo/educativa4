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

import Input from '../components/Input';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import { COLORS, FONTS } from '../constants/theme';
import { isValidEmail } from '../utils/validators';
import { registerUser } from '../services/authService'; 

const CadastroScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    if (!isValidEmail(form.email)) {
      Alert.alert('E-mail Inválido', 'Por favor, insira um formato de e-mail válido.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await registerUser(form.name, form.email, form.password);

      Alert.alert('Sucesso!', 'Sua conta foi criada. Agora é só fazer o login!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Falha no cadastro:', error);
      const errorMessage =
        error.response?.data?.message || 'Não foi possível criar a conta. Tente novamente mais tarde.';
      Alert.alert('Erro no Cadastro', errorMessage);
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
              <Mascot width={96} height={96} />
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>
                Preencha os campos abaixo para começar!
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                placeholder="👤 Nome completo"
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                autoCapitalize="words"
              />
              <Input
                placeholder="📧 Seu e-mail"
                value={form.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                placeholder="🔒 Sua senha"
                value={form.password}
                onChangeText={(text) => handleChange('password', text)}
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
                placeholder="🔒 Confirmar senha"
                value={form.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry={!isConfirmPasswordVisible}
                icon={
                  <Ionicons
                    name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color={COLORS.blue}
                  />
                }
                onIconPress={() =>
                  setConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              />
              <Button
                title="Criar Conta no EducAtiva"
                onPress={handleRegister}
                loading={loading}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.footerText, styles.link]}>Entrar</Text>
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
    marginBottom: 40,
  },
  form: { width: '100%', maxWidth: 320 },
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
  },
  link: {
    ...FONTS.body,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    paddingVertical: 8,
  },
  footerText: { ...FONTS.body, color: COLORS.white },
});

export default CadastroScreen;