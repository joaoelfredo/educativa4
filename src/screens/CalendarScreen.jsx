import React, { useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';
import { taskTypes } from '../constants/taskTypes';
import { TasksContext } from '../store/TasksContext'; 

import TaskDetailModal from '../components/TaskDetailModal';
import AddTaskModal from '../components/AddTaskModal';

const CalendarScreen = ({ navigation }) => {
  const { tasks, addTask, updateTask, deleteTask } = useContext(TasksContext);

  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const markedDates = useMemo(() => {
    const marks = {};
    tasks.forEach(task => {
      if (!marks[task.date]) { marks[task.date] = { dots: [] }; }
      if (!marks[task.date].dots.some(dot => dot.key === task.id)) {
        marks[task.date].dots.push({ key: task.id, color: task.color });
      }
    });
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.marinho} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Calendário de Atividades</Text>
        <View style={styles.placeholder} /> 
      </View>

      <ScrollView>
        <View style={styles.card}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType={'multi-dot'}
            theme={{ monthTextColor: COLORS.marinho, arrowColor: COLORS.primary, todayTextColor: COLORS.primary }}
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
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray, backgroundColor: COLORS.white,
  },
  backButton: { padding: 4 },
  screenTitle: { ...FONTS.h2, color: COLORS.marinho },
  placeholder: { width: 36 },
  card: { backgroundColor: 'white', borderRadius: 16, marginHorizontal: 16, marginTop: 24, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  legendTitle: { ...FONTS.h3, color: COLORS.marinho, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendDot: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
  legendText: { ...FONTS.body, color: COLORS.text },
});

export default CalendarScreen;