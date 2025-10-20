import React, { useContext, useEffect } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../store/AuthContext';
import { TasksProvider } from '../store/TasksContext';
import RemindersProvider, { RemindersContext } from '../store/RemindersContext'; 
import { ActivityIndicator, View, Alert } from 'react-native'; 

// Telas de Autenticação
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import RecuperacaoSenhaScreen from '../screens/RecuperacaoSenhaScreen';

// Telas Principais do App
import HomeScreen2 from '../screens/HomeScreen2';
import CalendarScreen from '../screens/CalendarScreen';
import RemindersScreen from '../screens/RemindersScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen'; // NOVO
import EditProfileScreen from '../screens/EditProfileScreen'; // NOVO

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

const formatTimeHHMM = (time) => {
  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`; 
};

// Stack para Home com navegação para Profile
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen2} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
  </Stack.Navigator>
);

const MainAppWrapper = () => {
  const { reminders, updateReminder } = useContext(RemindersContext);

  useEffect(() => {
    const timer = setInterval(() => {
      checkDueReminders();
    }, 10000); 

    return () => clearInterval(timer);
  }, [reminders]); 

  const checkDueReminders = () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTimeStr = formatTimeHHMM(now); 

    const dueReminders = reminders.filter(r => 
      r.taskDate === todayStr &&  
      r.time === currentTimeStr && 
      !r.triggered                 
    );

    for (const reminder of dueReminders) {
      Alert.alert(
        `🔔 Lembrete: ${reminder.taskTitle}`,
        reminder.text,
        [{ text: 'OK' }]
      );
      updateReminder({ ...reminder, triggered: true });
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabBar2 {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
    </Tab.Navigator>
  );
};

const AppTabs = () => (
  <TasksProvider>
    <RemindersProvider>
      <MainAppWrapper />
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