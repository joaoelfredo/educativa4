import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../store/AuthContext';
import { TasksProvider } from '../store/TasksContext';
import RemindersProvider, { RemindersContext } from '../store/RemindersContext';
import { ActivityIndicator, View, Alert } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import RecuperacaoSenhaScreen from '../screens/RecuperacaoSenhaScreen';

import HomeScreen2 from '../screens/HomeScreen2';
import CalendarScreen from '../screens/CalendarScreen';
import RemindersScreen from '../screens/RemindersScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

import BottomTabBar2 from '../components/BottomTabBar2';

const AuthStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MainStackNav = createNativeStackNavigator(); 

const AuthStack = () => (
  <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
    <AuthStackNav.Screen name="Login" component={LoginScreen} />
    <AuthStackNav.Screen name="Cadastro" component={CadastroScreen} />
    <AuthStackNav.Screen name="RecuperacaoSenha" component={RecuperacaoSenhaScreen} />
  </AuthStackNav.Navigator>
);

const formatTimeHHMM = (time) => {
  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const AlarmChecker = () => {
  const { reminders, updateReminder } = useContext(RemindersContext);
  useEffect(() => {
    const timer = setInterval(() => checkDueReminders(), 10000);
    return () => clearInterval(timer);
  }, [reminders, updateReminder]);

  const checkDueReminders = () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; 
    const currentTimeStr = formatTimeHHMM(now);
    const dueReminders = reminders.filter(r =>
      r.taskDate === todayStr && r.time === currentTimeStr && !r.triggered
    );
    for (const reminder of dueReminders) {
      Alert.alert(`🔔 Lembrete: ${reminder.taskTitle}`, reminder.text, [{ text: 'OK' }]);
      updateReminder({ ...reminder, triggered: true });
    }
  };
  return null;
};

const AppTabs = () => (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabBar2 {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen2} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
    </Tab.Navigator>
  );

const MainStack = () => (
  <MainStackNav.Navigator screenOptions={{ headerShown: false }}>
    <MainStackNav.Screen name="AppTabs" component={AppTabs} />
    <MainStackNav.Screen name="Profile" component={ProfileScreen} />
    <MainStackNav.Screen name="EditProfile" component={EditProfileScreen} />
  </MainStackNav.Navigator>
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
    <TasksProvider>
      <RemindersProvider>
        <AlarmChecker />
        <NavigationContainer>
          {userToken ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
      </RemindersProvider>
    </TasksProvider>
  );
};

export default AppNavigator;