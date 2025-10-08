import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HomeHeader from '../components/HomeHeader2';
import MascotMessage from '../components/MascotMessage2';
import QuickActions from '../components/QuickActions2';
import TodaySchedule from '../components/TodaySchedule2';
import UpcomingTasks from '../components/UpcomingTasks2';
import BottomTabBar from '../components/BottomTabBar2';
import { COLORS } from '../constants/theme';

const HomeScreen2 = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');

  // Dados mockados - depois virão de API/Context
  const userData = {
    name: 'Ana',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  };

  // MUDEI O NOME: todayScheduleData (antes era TodaySchedule2)
  const todayScheduleData = [
    {
      id: 1,
      title: 'Aula de Matemática',
      time: '08:00 - 10:00',
      location: 'Sala 105',
      color: COLORS.azulClaro,
      backgroundColor: COLORS.gelo,
    },
    {
      id: 2,
      title: 'Entrega: Trabalho de História',
      time: 'Até 20:00',
      location: 'Importante!',
      color: COLORS.laranja,
      backgroundColor: '#FFF3E0',
    },
  ];

  // MUDEI O NOME: upcomingTasksData (antes era UpcomingTasks2)
  const upcomingTasksData = [
    {
      id: 1,
      title: 'Relatório de Estágio',
      dueDate: 'Vence em 2 dias',
      icon: '📝',
      color: COLORS.laranja,
      backgroundColor: '#FFF3E0',
    },
    {
      id: 2,
      title: 'Prova de Cálculo',
      dueDate: 'Vence em 5 dias',
      icon: '📚',
      color: COLORS.azulClaro,
      backgroundColor: COLORS.gelo,
    },
  ];

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    console.log('Tab selecionada:', tabId);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.secondaryGradient} style={styles.headerGradient}>
        <SafeAreaView>
          <HomeHeader
            userData={userData}
            onProfilePress={() => navigation.navigate('Profile')}
            onSettingsPress={() => console.log('Settings')}
          />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MascotMessage
          message="Oi Ana! Você tem 2 tarefas para hoje. Vamos começar?"
        />
       
        <QuickActions
          onNewTask={() => console.log('Nova Tarefa')}
          onSetReminder={() => console.log('Definir Lembrete')}
        />
       
        <TodaySchedule
          date="Quarta, 13 Nov"
          schedule={todayScheduleData}
        />
       
        <UpcomingTasks tasks={upcomingTasksData} />
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
});

export default HomeScreen2;