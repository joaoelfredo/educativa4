import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import { TasksContext } from '../store/TasksContext'; // Importando o Contexto de Tarefas

// Componentes
import AppHeader from '../components/AppHeader'; // Usando o novo Header Padrão
import MascotMessage from '../components/MascotMessage2';
import QuickActions from '../components/QuickActions2';
import TodaySchedule from '../components/TodaySchedule2';
import UpcomingTasks from '../components/UpcomingTasks2';
import AddTaskModal from '../components/AddTaskModal';

const HomeScreen2 = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  
  // Pegando a lista de tarefas e a função de adicionar do Contexto Central
  const { tasks, addTask } = useContext(TasksContext);

  const userData = {
    name: 'Ana',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  };

  const handleAddTask = (newTask) => {
    // Usando a função do Contexto para adicionar a tarefa na lista global
    addTask(newTask);
    setModalVisible(false);
  };

  // Filtra as tarefas de hoje para o componente TodaySchedule
  const today = new Date().toISOString().split('T')[0];
  const tasksForToday = tasks.filter(task => task.date === today);

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} userData={userData} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MascotMessage message={`Oi Ana! Você tem ${tasksForToday.length} tarefa(s) para hoje. Vamos começar?`} />
        
        <QuickActions
          onNewTask={() => setModalVisible(true)}
          onSetReminder={() => console.log('Definir Lembrete')}
        />
        
        <TodaySchedule
          date={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          schedule={tasksForToday}
        />
        
        <UpcomingTasks tasks={tasks} />
      </ScrollView>
      
      <AddTaskModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
});

export default HomeScreen2;