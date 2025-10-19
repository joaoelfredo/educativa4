import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { COLORS } from '../constants/theme';
import { TasksContext } from '../store/TasksContext';

// Componentes
import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';
import QuickActions from '../components/QuickActions2';
import TodaySchedule from '../components/TodaySchedule2';
import UpcomingTasks from '../components/UpcomingTasks2';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

const HomeScreen2 = ({ navigation }) => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  const { tasks, addTask, updateTask, deleteTask } = useContext(TasksContext);

  const userData = {
    name: 'Ana',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  };

  const handleAddTask = (newTask) => {
    if (taskToEdit) {
      updateTask(newTask);
      Alert.alert("Sucesso!", "Tarefa atualizada.");
      setTaskToEdit(null);
    } else {
      addTask(newTask);
      Alert.alert("Sucesso!", "Nova tarefa criada.");
    }
    setAddModalVisible(false);
  };

  // Função para abrir o modal de detalhes
  const handleOpenTaskDetail = (date) => {
    const tasksForDate = tasks.filter(task => task.date === date);
    if (tasksForDate.length > 0) {
      setSelectedTasks(tasksForDate);
      setSelectedDate(date);
      setDetailModalVisible(true);
    }
  };

  // Função para marcar tarefa como concluída
  const handleCompleteTask = (task) => {
    Alert.alert(
      "Concluir Tarefa",
      `Marcar "${task.title}" como concluída?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Concluir",
          onPress: () => {
            updateTask({ ...task, completed: true });
            setDetailModalVisible(false);
            Alert.alert("Parabéns! 🎉", "Tarefa concluída!");
          }
        }
      ]
    );
  };

  // Função para editar tarefa
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setDetailModalVisible(false);
    setAddModalVisible(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const tasksForToday = tasks.filter(task => task.date === today);

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} userData={userData} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MascotMessage2 message={`Oi Ana! Você tem ${tasksForToday.length} tarefa(s) para hoje. Vamos começar?`} />
        
        <QuickActions
          onNewTask={() => {
            setTaskToEdit(null);
            setAddModalVisible(true);
          }}
          onSetReminder={() => navigation.navigate('Reminders')}
        />
        
        <TodaySchedule
          date={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          schedule={tasksForToday}
          onTaskPress={() => handleOpenTaskDetail(today)}
        />
        
        <UpcomingTasks 
          tasks={tasks}
          onTaskPress={(date) => handleOpenTaskDetail(date)}
        />
      </ScrollView>
      
      {/* Modal de Adicionar/Editar Tarefa */}
      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleAddTask}
        editingTask={taskToEdit}
      />

      {/* Modal de Detalhes da Tarefa */}
      <TaskDetailModal
        visible={isDetailModalVisible}
        tasks={selectedTasks}
        date={selectedDate}
        onClose={() => setDetailModalVisible(false)}
        onComplete={handleCompleteTask}
        onEdit={handleEditTask}
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