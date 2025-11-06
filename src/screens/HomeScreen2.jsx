import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';
import { TasksContext } from '../store/TasksContext';
import { RemindersContext } from '../store/RemindersContext';
import { AuthContext } from '../store/AuthContext';
import api from '../services/api';
import * as Notifications from 'expo-notifications';

// Componentes
import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';
import QuickActions from '../components/QuickActions2';
import TodaySchedule from '../components/TodaySchedule2';
import UpcomingTasks from '../components/UpcomingTasks2';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';

// (Handler de Notificação - MANTIDO)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPresentAlert: false, // Não mostrar se o app estiver aberto
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
async function registerForPushNotificationsAsync() {
    // ... (função de permissão completa)
    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default', importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250], lightColor: '#FF231F7C',
            });
        } catch (e) { console.error("Erro Canal Android:", e); }
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        Alert.alert('Permissão Negada', 'Lembretes via notificação desativados.');
        return false;
    }
    return true;
}


const RemindersDoDia = ({ reminders }) => {
    // ... (Componente mantido igual)
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

// --- FUNÇÃO HELPER (NOVA) ---
// Retorna a data de HOJE formatada como "YYYY-MM-DD" no fuso LOCAL
const getTodayLocalString = () => {
    return new Date().toLocaleDateString('sv-SE'); // sv-SE = "YYYY-MM-DD"
};
// -----------------------------


const HomeScreen2 = ({ navigation }) => {
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const { tasks, setTasks, addTask, updateTask, deleteTask } = useContext(TasksContext);
    const { reminders, addReminder, updateReminder, deleteRemindersByTaskId } = useContext(RemindersContext);
    const { user } = useContext(AuthContext);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/task');
            const tasksFromApi = response.data.tasks || [];
            
            const tasksMapeadas = tasksFromApi.map(task => ({
                ...task,
                date: task.dueDate.split('T')[0], // "YYYY-MM-DD" (vem do DB)
                dueDate: new Date(task.dueDate).toLocaleDateString('pt-BR'), // "DD/MM/YYYY" (para UI)
                type: task.type.toLowerCase(),
            }));
            
            setTasks(tasksMapeadas);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error.response?.data || error.message);
            Alert.alert("Erro", "Não foi possível carregar suas tarefas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        registerForPushNotificationsAsync();
        fetchTasks();
        const unsubscribeFocus = navigation.addListener('focus', fetchTasks);
        const notificationListener = Notifications.addNotificationReceivedListener(n => {});
        const responseListener = Notifications.addNotificationResponseReceivedListener(r => {});
        return () => {
            unsubscribeFocus();
            notificationListener.remove();
            responseListener.remove();
        };
    }, [navigation]);

    // useEffect separado para o timer de lembretes
    useEffect(() => {
        console.log("[AlarmChecker] Timer iniciado.");
        const timer = setInterval(() => {
            checkDueRemindersWithUpdate();
        }, 10000); // Verifica a cada 10 segundos
        return () => clearInterval(timer);
    }, [reminders, updateReminder]); // Depende apenas dos lembretes


    // --- LÓGICA DO ALARM CHECKER CORRIGIDA ---
    const checkDueRemindersWithUpdate = () => {
        const now = new Date();
        // 1. Pega o dia de HOJE (local) como "YYYY-MM-DD"
        const todayStr = now.toLocaleDateString('sv-SE');
        // 2. Pega a hora atual (local) como "HH:MM"
        const currentTimeStr = formatTimeHHMM(now);
        
        console.log(`[AlarmChecker] Verificando... ${todayStr} @ ${currentTimeStr}`);

        // 3. Filtra lembretes
        const dueReminders = reminders.filter(r =>
            r.taskDate === todayStr &&  // Compara string com string
            r.time === currentTimeStr && // Compara string com string
            !r.triggered
        );

        if (dueReminders.length > 0) {
            console.log(`[AlarmChecker] ${dueReminders.length} lembrete(s) encontrado(s)!`);
        }

        for (const reminder of dueReminders) {
            Alert.alert(
                `🔔 Lembrete: ${reminder.taskTitle}`,
                reminder.text,
                [{ text: 'OK' }]
            );
            updateReminder({ ...reminder, triggered: true });
        }
    };
    // --- FIM DA CORREÇÃO DO ALARM CHECKER ---

    const userData = { /* ... seus dados ... */ };

    // (handleAddTask - MANTIDO IGUAL)
    const handleAddTask = async (taskDataFromModal) => {
        setLoading(true);
        const isEditing = !!taskDataFromModal.id;
        // ... (resto da lógica de formatar backendData)
        const backendData = {
            title: taskDataFromModal.title,
            completed: taskDataFromModal.completed || false,
            dueDate: taskDataFromModal.date, 
            type: taskDataFromModal.type.toUpperCase(), 
            icon: taskDataFromModal.icon,
            notes: taskDataFromModal.notes || null,
            hasReminder: taskDataFromModal.hasReminder,
            reminderTime: taskDataFromModal.reminderTime,
        };
        if (!isEditing) delete backendData.id;

        try {
            let savedTask;
            if (isEditing) {
                const response = await api.put(`/task/${taskDataFromModal.id}`, backendData);
                savedTask = response.data.taskForUpdate;
                const taskParaContexto = {
                    ...savedTask,
                    date: savedTask.dueDate.split('T')[0],
                    dueDate: new Date(savedTask.dueDate).toLocaleDateString('pt-BR'),
                    type: savedTask.type.toLowerCase(),
                };
                updateTask(taskParaContexto); 
            } else {
                const response = await api.post('/task', backendData);
                savedTask = response.data.newTask;
                const taskParaContexto = {
                    ...savedTask,
                    date: savedTask.dueDate.split('T')[0],
                    dueDate: new Date(savedTask.dueDate).toLocaleDateString('pt-BR'),
                    type: savedTask.type.toLowerCase(),
                };
                addTask(taskParaContexto);
            }
            
            setTaskToEdit(null);
            setAddModalVisible(false); 
            setLoading(false); 
            return savedTask; 

        } catch (error) {
            console.error("Erro ao salvar tarefa:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || "Não foi possível salvar a tarefa.";
            Alert.alert("Erro de API", errorMsg);
            setLoading(false); 
            return null;
        }
    };

    // (handleDeleteTask - MANTIDO IGUAL)
    const handleDeleteTask = (taskId) => { 
        if (!taskId) return;
        Alert.alert("Excluir Tarefa", `Tem certeza que deseja excluir esta tarefa?`,
            [{ text: "Cancelar", style: "cancel" }, {
                text: "Excluir", style: "destructive",
                onPress: async () => {
                    setLoading(true);
                    try {
                        await api.delete(`/task/${taskId}`);
                        deleteRemindersByTaskId(taskId);
                        deleteTask(taskId);
                        setAddModalVisible(false);
                        setDetailModalVisible(false);
                        setTaskToEdit(null);
                        Alert.alert("Sucesso!", "Tarefa excluída.");
                    } catch (error) {
                        console.error("Erro ao excluir tarefa:", error.response?.data);
                        Alert.alert("Erro", "Não foi possível excluir a tarefa.");
                    } finally {
                        setLoading(false);
                    }
                }
            }]
        );
    };

    // (handleCompleteTask - MANTIDO IGUAL)
    const handleCompleteTask = async (task) => {
        Alert.alert("Concluir Tarefa", `Marcar "${task.title}" como concluída?`,
            [{ text: "Cancelar", style: "cancel" }, {
                text: "Concluir",
                onPress: async () => {
                    setLoading(true);
                    try {
                        const response = await api.put(`/task/${task.id}`, {
                            completed: !task.completed
                        });
                        
                        const updatedTask = {
                            ...response.data.taskForUpdate,
                            date: response.data.taskForUpdate.dueDate.split('T')[0],
                            dueDate: new Date(response.data.taskForUpdate.dueDate).toLocaleDateString('pt-BR'),
                            type: response.data.taskForUpdate.type.toLowerCase(),
                        };

                        updateTask(updatedTask);
                        setDetailModalVisible(false);
                        Alert.alert("Parabéns! 🎉", "Tarefa concluída!");
                    } catch (error) {
                        console.error("Erro ao completar tarefa:", error.response?.data);
                        Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
                    } finally {
                        setLoading(false);
                    }
                }
            }]
        );
    };

    // --- FUNÇÃO QUE FALTAVA ---
    const handleOpenTaskDetail = (date) => {
        const tasksForDate = tasks.filter(task => (task.date) === date);
        if (tasksForDate.length > 0) {
            setSelectedTasks(tasksForDate);
            setSelectedDate(date);
            setDetailModalVisible(true);
        }
    };
    // ----------------------------

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setDetailModalVisible(false);
        setAddModalVisible(true);
    };

    // --- FILTROS CORRIGIDOS ---
    const today = getTodayLocalString(); // "YYYY-MM-DD" local
    const tasksForToday = tasks.filter(task => (task.date) === today); 
    const remindersToday = reminders
        .filter(r => r.taskDate === today)
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <AppHeader
                    navigation={navigation}
                    userData={userData}
                    onProfilePress={() => navigation.navigate('Profile')}
                />
                
                {isLoading && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />}

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <MascotMessage2 message={`Oi ${user ? user.name : ''}! Você tem ${tasksForToday.length} tarefa(s) e ${remindersToday.length} lembrete(s) para hoje.`} />
                    <QuickActions
                        onNewTask={() => {
                            setTaskToEdit(null);
                            setSelectedDate(null);
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
                    onDelete={() => handleDeleteTask(taskToEdit?.id)}
                    selectedDate={selectedDate}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { padding: 16, paddingBottom: 80 },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 10,
        marginLeft: -18,
        marginTop: -18,
    },
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