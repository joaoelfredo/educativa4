import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../store/AuthContext';
import { TasksProvider } from '../store/TasksContext'; // 1. IMPORTE O PROVIDER DE TAREFAS
import { ActivityIndicator, View } from 'react-native';

// Telas de Autenticação
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import RecuperacaoSenhaScreen from '../screens/RecuperacaoSenhaScreen';

// Telas Principais do App
import HomeScreen2 from '../screens/HomeScreen2';
import CalendarScreen from '../screens/CalendarScreen';

// Componente de UI
import BottomTabBar2 from '../components/BottomTabBar2';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// A pilha de autenticação não muda
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Cadastro" component={CadastroScreen} />
    <Stack.Screen name="RecuperacaoSenha" component={RecuperacaoSenhaScreen} />
  </Stack.Navigator>
);

// O navegador de abas que será exibido após o login
const AppTabs = () => (
  // 2. ENVOLVA O NAVEGADOR COM O TASKS PROVIDER
  // Isso faz com que todas as telas dentro dele compartilhem o mesmo estado de tarefas
  <TasksProvider>
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabBar2 {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen2} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      {/* Adicione as outras telas da Tab Bar aqui quando criá-las */}
    </Tab.Navigator>
  </TasksProvider>
);

const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;