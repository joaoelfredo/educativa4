import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecuperacaoSenhaScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Recuperação de Senha</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  text: { color: 'white', fontSize: 24 },
});

export default RecuperacaoSenhaScreen;