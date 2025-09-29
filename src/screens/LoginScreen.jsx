import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AuthContext } from '../store/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import { COLORS, FONTS } from '../constants/theme';
import { isValidEmail } from '../utils/validators';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('E-mail Inválido', 'Por favor, insira um formato de e-mail válido.');
      return; 
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Erro no Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Conteúdo da tela
  const renderContent = () => (
    <SafeAreaView style={styles.content}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Mascot width={128} height={128} />
          <Text style={styles.title}>Bem-vindo ao EducAtiva!</Text>
          <Text style={styles.subtitle}>Seu companheiro de estudos para ajudar!</Text>
        </View>

        <View style={styles.form}>
          <Input 
            placeholder="📧 Seu e-mail" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input 
            placeholder="🔒 Sua senha" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry 
          />
          <Button 
            title="Entrar no EducAtiva" 
            onPress={handleLogin} 
            loading={loading}
          />
          <TouchableOpacity onPress={() => navigation.navigate('RecuperacaoSenha')}>
            <Text style={styles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Primeira vez aqui? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={[styles.footerText, styles.link]}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={COLORS.secondaryGradient} style={styles.container}>
        {/* Só usa TouchableWithoutFeedback em mobile */}
        {Platform.OS === 'web' ? (
          renderContent()
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {renderContent()}
          </TouchableWithoutFeedback>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    header: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 40, 
    },
    form: { width: '100%', maxWidth: 320 },
    footer: {
        flexDirection: 'row',
        paddingVertical: 16,
        alignItems: 'center',
    },
    title: { ...FONTS.h1, color: COLORS.white, textAlign: 'center', marginTop: 16 },
    subtitle: { ...FONTS.body, color: COLORS.white, opacity: 0.9, textAlign: 'center', marginTop: 8 },
    link: { ...FONTS.body, fontWeight: '700', color: COLORS.primary, textAlign: 'center', paddingVertical: 8 },
    footerText: { ...FONTS.body, color: COLORS.white },
});

export default LoginScreen;