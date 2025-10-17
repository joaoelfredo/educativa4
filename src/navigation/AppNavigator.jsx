import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../store/AuthContext';
import { TasksProvider } from '../store/TasksContext';
import RemindersProvider from '../store/RemindersContext'; 
import { ActivityIndicator, View } from 'react-native';

// Telas de Autenticação
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import RecuperacaoSenhaScreen from '../screens/RecuperacaoSenhaScreen';

// Telas Principais do App
import HomeScreen2 from '../screens/HomeScreen2';
import CalendarScreen from '../screens/CalendarScreen';
import RemindersScreen from '../screens/RemindersScreen';
import RewardsScreen from '../screens/RewardsScreen';

import BottomTabBar2 from '../components/BottomTabBar2';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Cadastro" component={CadastroScreen} />
    <Stack.Screen name="RecuperacaoSenha" component={RecuperacaoSenhaScreen} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <TasksProvider>
    <RemindersProvider>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={props => <BottomTabBar2 {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen2} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Reminders" component={RemindersScreen} />
        <Tab.Screen name="Rewards" component={RewardsScreen} />
      </Tab.Navigator>
    </RemindersProvider>
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