import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen2 from '../screens/HomeScreen2';


const Stack = createStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen2} />
    </Stack.Navigator>
  );
}
