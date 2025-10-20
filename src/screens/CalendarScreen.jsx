import React, { useState, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import { taskTypes } from '../constants/taskTypes';
import { TasksContext } from '../store/TasksContext';
import { RemindersContext } from '../store/RemindersContext';

// Componentes
import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';
import TaskDetailModal from '../components/TaskDetailModal';
import AddTaskModal from '../components/AddTaskModal';

const CalendarScreen = ({ navigation }) => {
  const { tasks, addTask, updateTask, deleteTask } = useContext(TasksContext);
  const { addReminder, deleteRemindersByTaskId } = useContext(RemindersContext);

  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [userData, setUserData] = useState({
    name: 'Ana',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  });


  const markedDates = useMemo(() => {
    const marks = {};
    const priority = { 'prova': 1, 'apresentacao': 2, 'trabalho': 3, 'reuniao': 4 };

    const tasksByDate = tasks.reduce((acc, task) => {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }
      acc[task.date].push(task);
      return acc;
    }, {});

    for (const date in tasksByDate) {

      const pendingTasksOnDay = tasksByDate[date].filter(task => !task.completed);

      if (pendingTasksOnDay.length === 0) {
        continue; 
      }

      pendingTasksOnDay.sort((a, b) => (priority[a.type] || 99) - (priority[b.type] || 99));
      const mostImportantTask = pendingTasksOnDay[0];

      marks[date] = {
        selected: true,
        selectedColor: mostImportantTask.color,

        dots: pendingTasksOnDay.length > 1
              ? pendingTasksOnDay.map(task => ({ key: task.id, color: 'white' }))
              : [], 

        marked: pendingTasksOnDay.length > 1, 
      };
    }
    return marks;
  }, [tasks]); 

  const handleDayPress = (day) => {
    const pendingTasksOnDay = tasks.filter(task => task.date === day.dateString && !task.completed);
    if (pendingTasksOnDay.length > 0) {
      setSelectedTasks(pendingTasksOnDay);
      setSelectedDate(day.dateString);
      setDetailModalVisible(true);
    } else {
      setSelectedDate(day.dateString);
      setTaskToEdit(null);
      setAddModalVisible(true);
    }
  };

  const handleCompleteTaskOnDetail = (taskToComplete) => {
     Alert.alert(
      "Concluir Tarefa",
      `Tem certeza que deseja marcar "${taskToComplete.title}" como concluída?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Concluir",
          onPress: () => {
             try {
                deleteRemindersByTaskId(taskToComplete.id);
                updateTask({ ...taskToComplete, completed: true });

                const remainingTasks = selectedTasks.filter(task => task.id !== taskToComplete.id);
                setSelectedTasks(remainingTasks);

                if (remainingTasks.length === 0) {
                    setDetailModalVisible(false);
                }

                Alert.alert("Parabéns!", `Tarefa "${taskToComplete.title}" concluída! Você ganhou 10 XP! 🎉`);
                setUserData(prev => ({ ...prev, xpProgress: prev.xpProgress + 10 }));

             } catch (error) {
                console.error("Erro ao concluir tarefa:", error);
                Alert.alert("Erro", "Não foi possível marcar a tarefa como concluída.");
             }
          }
        }
      ]
    );
  };

  const handleOpenEditModal = (task) => {
    setDetailModalVisible(false);
    setTaskToEdit(task);
    setAddModalVisible(true);
  };

  const handleSubmitTask = (taskData) => {
    const { hasReminder, reminderTime, ...newTaskData } = taskData;

    if (taskToEdit) {
      updateTask({ ...newTaskData, id: taskToEdit.id });
      Alert.alert("Sucesso", "Tarefa atualizada!");
    } else {
      const addedTask = addTask(newTaskData);

      if (addedTask && hasReminder) {
        addReminder({
          taskId: addedTask.id,
          taskTitle: addedTask.title,
          text: 'Lembrete para: ' + addedTask.title,
          time: reminderTime,
          taskDate: addedTask.date,
        });
        Alert.alert("Sucesso", "Nova tarefa e lembrete criados!");
      } else if (addedTask) {
        Alert.alert("Sucesso", "Nova tarefa criada!");
      } else {
        Alert.alert("Erro", "Não foi possível criar a tarefa.");
      }
    }

    setTaskToEdit(null);
    setAddModalVisible(false);
  };

  const handleDeleteTaskOnEdit = () => {
    if (!taskToEdit) return;

    Alert.alert(
      "Excluir Tarefa",
      `Tem certeza que deseja excluir "${taskToEdit.title}"? Todos os lembretes associados a ela também serão excluídos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            try {
              deleteRemindersByTaskId(taskToEdit.id);
              deleteTask(taskToEdit.id);

              setAddModalVisible(false);
              setTaskToEdit(null);
              Alert.alert("Sucesso!", "Tarefa e lembretes associados foram excluídos.");

            } catch (error) {
              console.error("Erro ao excluir tarefa:", error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            }
          }
        }
      ]
    );
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
          <MascotMessage2 message="Os dias coloridos indicam seus compromissos pendentes. Pontinhos brancos significam mais de uma tarefa pendente no dia!" />
        </View>

        <View style={styles.card}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType={'multi-dot'}
            theme={{
              monthTextColor: COLORS.marinho,
              arrowColor: COLORS.primary,
              todayTextColor: COLORS.primary,
              selectedDayTextColor: COLORS.white,
              textDisabledColor: COLORS.lightGray,
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

      {/* Modal de Detalhes da Tarefa */}
      <TaskDetailModal
        visible={isDetailModalVisible}
        tasks={selectedTasks}
        date={selectedDate || (selectedTasks.length > 0 ? selectedTasks[0].date : '')}
        onClose={() => setDetailModalVisible(false)}
        onComplete={handleCompleteTaskOnDetail}
        onEdit={handleOpenEditModal}
      />

      {/* Modal de Adicionar/Editar Tarefa */}
      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => { setAddModalVisible(false); setTaskToEdit(null); setSelectedDate(null); }}
        onSubmit={handleSubmitTask}
        editingTask={taskToEdit}
        selectedDate={selectedDate}
        onDelete={handleDeleteTaskOnEdit}
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