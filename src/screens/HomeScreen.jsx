import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuthContext } from '../store/AuthContext';
import Button from '../components/Button';
import { getUsers } from '../services/userService'; // Importe a nova função

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers();
        console.log("Usuários recebidos da API:", userData);
        setUsers(userData);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error.response?.data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login realizado com sucesso!</Text>
      <Text style={styles.text}>Lista de Usuários:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()} // Assumindo que o usuário tem um 'id'
        renderItem={({ item }) => <Text style={styles.userItem}>{item.name} - {item.email}</Text>}
      />
      <Button title="Sair" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', paddingTop: 50 },
    text: { color: '#FFF', fontSize: 24, marginBottom: 20 },
    userItem: { color: 'lightgray', fontSize: 16 },
});

export default HomeScreen;