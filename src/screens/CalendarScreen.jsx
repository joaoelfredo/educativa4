import React, { useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import { taskTypes } from '../constants/taskTypes';
import { TasksContext } from '../store/TasksContext';

// Componentes
import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';
import TaskDetailModal from '../components/TaskDetailModal';
import AddTaskModal from '../components/AddTaskModal';

const CalendarScreen = ({ navigation }) => {
  const { tasks, addTask, updateTask, deleteTask } = useContext(TasksContext);

  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const userData = {
    name: 'Ana',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  };

  // --- LÓGICA DE MARCAÇÃO ATUALIZADA ---
  const markedDates = useMemo(() => {
    const marks = {};
    
    // Define a prioridade dos tipos de tarefa
    const priority = { 'prova': 1, 'apresentacao': 2, 'trabalho': 3, 'reuniao': 4 };

    // Agrupa as tarefas por data
    const tasksByDate = tasks.reduce((acc, task) => {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }
      acc[task.date].push(task);
      return acc;
    }, {});

    for (const date in tasksByDate) {
      const tasksOnDay = tasksByDate[date];
      
      // Ordena as tarefas do dia pela prioridade definida
      tasksOnDay.sort((a, b) => (priority[a.type] || 99) - (priority[b.type] || 99));
      
      // A tarefa mais importante (a primeira após ordenar) define a cor do fundo
      const mostImportantTask = tasksOnDay[0];
      
      marks[date] = {
        selected: true,
        selectedColor: mostImportantTask.color,
        // Mantemos os pontinhos para indicar se há mais de uma tarefa
        dots: tasksOnDay.length > 1 ? tasksOnDay.map(task => ({ key: task.id, color: 'white' })) : [],
        marked: tasksOnDay.length > 1, // 'marked' mostra os pontinhos
      };
    }
    return marks;
  }, [tasks]);

  const handleDayPress = (day) => {
    const tasksOnDay = tasks.filter(task => task.date === day.dateString);
    if (tasksOnDay.length > 0) {
      setSelectedTasks(tasksOnDay);
      setDetailModalVisible(true);
    } else {
      setSelectedDate(day.dateString);
      setTaskToEdit(null);
      setAddModalVisible(true);
    }
  };

  const handleCompleteTask = (taskToDelete) => {
    deleteTask(taskToDelete.id);
    if (selectedTasks.length === 1 && selectedTasks[0].id === taskToDelete.id) {
      setDetailModalVisible(false);
    } else {
      setSelectedTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
    }
    Alert.alert("Parabéns!", `Tarefa "${taskToDelete.title}" concluída! Você ganhou 10 XP!`);
  };

  const handleOpenEditModal = (task) => {
    setDetailModalVisible(false);
    setTaskToEdit(task);
    setAddModalVisible(true);
  };

  const handleSubmitTask = (taskData) => {
    if (taskToEdit) {
      updateTask(taskData);
      Alert.alert("Sucesso", "Tarefa atualizada!");
    } else {
      addTask(taskData);
      Alert.alert("Sucesso", "Nova tarefa criada!");
    }
    setTaskToEdit(null);
    setAddModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={COLORS.secondaryGradient}>
        <AppHeader
          navigation={navigation}
          userData={userData}
          showBackButton={true}
          title="Calendário"
          onProfilePress={() => console.log('Ir para o Perfil')}
        />
      </LinearGradient>

      <ScrollView>
        <View style={styles.mascotContainer}>
          <MascotMessage2 message="Os dias coloridos indicam seus compromissos. Pontinhos brancos significam mais de uma tarefa no dia!" />
        </View>
        
        <View style={styles.card}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            // A biblioteca agora entende a combinação de 'selected' e 'dots'
            markingType={'multi-dot'}
            theme={{
              monthTextColor: COLORS.marinho,
              arrowColor: COLORS.primary,
              todayTextColor: COLORS.primary,
              selectedDayTextColor: COLORS.white, // Garante que o número do dia fique branco
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.legendTitle}>🎨 Legenda</Text>
          {taskTypes.map(type => (
            <View key={type.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: type.color }]} />
              <Text style={styles.legendText}>{type.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TaskDetailModal 
        visible={isDetailModalVisible}
        tasks={selectedTasks}
        date={selectedTasks.length > 0 ? selectedTasks[0].date : ''}
        onClose={() => setDetailModalVisible(false)}
        onComplete={handleCompleteTask}
        onEdit={handleOpenEditModal}
      />
      <AddTaskModal 
        visible={isAddModalVisible}
        onClose={() => { setAddModalVisible(false); setTaskToEdit(null); }}
        onSubmit={handleSubmitTask}
        editingTask={taskToEdit}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? 25 : 0 },
  mascotContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    marginHorizontal: 16, 
    marginTop: 8,
    padding: 16, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 } 
  },
  legendTitle: { ...FONTS.h3, color: COLORS.marinho, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendDot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  legendText: { ...FONTS.body, color: COLORS.text },
});

export default CalendarScreen;