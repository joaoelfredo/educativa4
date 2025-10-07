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

import Input from '../components/Input';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import { COLORS, FONTS } from '../constants/theme';
import { isValidEmail } from '../utils/validators';

const RecuperacaoSenhaScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecovery = () => {
    // Verificação 1: Campo vazio
    if (!email) {
      Alert.alert('Atenção', 'Por favor, digite seu e-mail.');
      return;
    }

    // Verificação 2: Validação do e-mail
    if (!isValidEmail(email)) {
      Alert.alert('E-mail Inválido', 'Por favor, insira um formato de e-mail válido.');
      return;
    }

    setLoading(true);
    
    // Simular envio do link de recuperação
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Link Enviado!', 
        'Verifique sua caixa de entrada e spam. O link de recuperação foi enviado para seu e-mail.',
        [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
      console.log('Link de recuperação enviado para:', email);
    }, 2000);
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
              <Text style={styles.title}>Recuperar Senha</Text>
              <Text style={styles.subtitle}>
                Não se preocupe! Vamos te ajudar a voltar 🔑
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                placeholder="📧 Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Button
                title="Enviar Link de Recuperação"
                onPress={handleRecovery}
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


export default RecuperacaoSenhaScreen;