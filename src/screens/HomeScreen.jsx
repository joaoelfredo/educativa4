import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../store/AuthContext';
import Button from '../components/Button';

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login realizado com sucesso!</Text>
      <Text style={styles.text}>Bem-vindo à Home.</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
    text: { color: '#FFF', fontSize: 24, marginBottom: 20 },
});

export default HomeScreen;