import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { TasksContext } from '../store/TasksContext';
import { RemindersContext } from '../store/RemindersContext'; 
import { AuthContext } from '../store/AuthContext';

// Componentes
import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';
import QuickActions from '../components/QuickActions2';
import TodaySchedule from '../components/TodaySchedule2';
import UpcomingTasks from '../components/UpcomingTasks2';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

const RemindersDoDia = ({ reminders }) => {
  if (reminders.length === 0) return null; 
  return (
    <View style={styles.remindersCard}>
      <Text style={styles.remindersTitle}>🔔 Lembretes de Hoje</Text>
      {reminders.map(reminder => (
        <View key={reminder.id} style={styles.reminderItem}>
          <Text style={styles.reminderTime}>{reminder.time}</Text>
          <View style={styles.reminderDetails}>
            <Text style={styles.reminderTaskTitle}>{reminder.taskTitle}</Text>
            <Text style={styles.reminderText}>{reminder.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const formatTimeHHMM = (time) => {
  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`; 
};

const HomeScreen2 = ({ navigation }) => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  const { tasks, addTask, updateTask, deleteTask } = useContext(TasksContext);
  const { reminders, addReminder, updateReminder, deleteRemindersByTaskId } = useContext(RemindersContext); 
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const timer = setInterval(() => {
      checkDueRemindersWithUpdate();
    }, 10000); 
    return () => clearInterval(timer);
  }, [reminders, updateReminder]);

  const checkDueRemindersWithUpdate = () => {
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

  const userData = {
    name: user ? user.name : 'Carregando...',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  };

  const handleAddTask = (taskData) => {
    const { hasReminder, reminderTime, ...newTaskData } = taskData;
    
    if (taskToEdit) {
      updateTask({ ...newTaskData, id: taskToEdit.id }); 
      Alert.alert("Sucesso!", "Tarefa atualizada.");
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
        Alert.alert("Sucesso!", "Tarefa e lembrete criados!");
      } else if (addedTask) {
        Alert.alert("Sucesso!", "Tarefa criada!");
      }
    }
    
    setTaskToEdit(null);
    setAddModalVisible(false);
  };

  const handleDeleteTask = () => {
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

  const handleOpenTaskDetail = (date) => {
    const tasksForDate = tasks.filter(task => task.date === date);
    if (tasksForDate.length > 0) {
      setSelectedTasks(tasksForDate);
      setSelectedDate(date);
      setDetailModalVisible(true);
    }
  };

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

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setDetailModalVisible(false);
    setAddModalVisible(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const tasksForToday = tasks.filter(task => task.date === today);
  const remindersToday = reminders
    .filter(r => r.taskDate === today)
    .sort((a, b) => a.time.localeCompare(b.time)); 

  return (
    <View style={styles.container}>
      <AppHeader 
        navigation={navigation} 
        userData={userData}
        onProfilePress={() => navigation.navigate('Profile')} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
         <MascotMessage2 message={`Oi ${user ? user.name : ''}! Você tem ${tasksForToday.length} tarefa(s) e ${remindersToday.length} lembrete(s) para hoje.`} />
         <QuickActions
           onNewTask={() => {
             setTaskToEdit(null);
             setAddModalVisible(true);
           }}
           onSetReminder={() => navigation.navigate('Reminders')}
         />
         <RemindersDoDia reminders={remindersToday} />
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
      
      <AddTaskModal
        visible={isAddModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleAddTask}
        editingTask={taskToEdit}
        onDelete={handleDeleteTask}
      />

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
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 24 },
  remindersCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  remindersTitle: { ...FONTS.h3, color: COLORS.marinho, marginBottom: 12 },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: COLORS.gelo,
    padding: 12,
    borderRadius: 10,
  },
  reminderTime: { ...FONTS.h4, color: COLORS.primary, marginRight: 12, width: 60 },
  reminderDetails: { flex: 1 },
  reminderTaskTitle: { ...FONTS.body, fontWeight: '600', color: COLORS.darkGray },
  reminderText: { ...FONTS.small, color: COLORS.gray },
});

export default HomeScreen2;