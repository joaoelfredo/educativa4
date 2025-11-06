import React, { useState, useMemo, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native'; // Adicionado ActivityIndicator
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import { taskTypes } from '../constants/taskTypes';
import { TasksContext } from '../store/TasksContext';
import { RemindersContext } from '../store/RemindersContext';
import { SafeAreaView as SafeContextView } from 'react-native-safe-area-context';
import api from '../services/api'; 

// Componentes
import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';
import TaskDetailModal from '../components/TaskDetailModal';
import AddTaskModal from '../components/AddTaskModal';

const CalendarScreen = ({ navigation }) => {
    // 2. PEGAR O 'setTasks' E O 'addTask' REAIS DO CONTEXTO
    const { tasks, setTasks, addTask, updateTask, deleteTask } = useContext(TasksContext); 
    const { addReminder, deleteRemindersByTaskId } = useContext(RemindersContext);

    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Adicionar estado de loading

    const [userData, setUserData] = useState({ /* ... seus dados ... */ });

    // 3. FUNÇÃO PARA BUSCAR TAREFAS (Igual da HomeScreen)
    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/task');
            const tasksFromApi = response.data.tasks || [];
            const tasksMapeadas = tasksFromApi.map(task => ({
                ...task,
                date: task.dueDate.split('T')[0], // "YYYY-MM-DD"
                dueDate: new Date(task.dueDate).toLocaleDateString('pt-BR'), // "DD/MM/YYYY"
                type: task.type.toLowerCase(),
            }));
            setTasks(tasksMapeadas); // Atualiza o contexto global
        } catch (error) {
            console.error("Erro ao buscar tarefas (Calendário):", error.response?.data);
            Alert.alert("Erro", "Não foi possível carregar as tarefas.");
        } finally {
            setIsLoading(false);
        }
    };

    // 4. useEffect PARA CARREGAR TAREFAS
    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            fetchTasks(); // Recarrega tarefas quando a tela recebe foco
        });
        fetchTasks(); // Carrega na primeira vez
        return unsubscribeFocus;
    }, [navigation]);


    const markedDates = useMemo(() => {
        // ... (sua lógica de markedDates - está correta)
        const marks = {};
        const priority = { 'prova': 1, 'apresentacao': 2, 'trabalho': 3, 'reuniao': 4 };
        const tasksByDate = tasks.reduce((acc, task) => {
            if (!acc[task.date]) acc[task.date] = [];
            acc[task.date].push(task);
            return acc;
        }, {});
        for (const date in tasksByDate) {
            const pendingTasksOnDay = tasksByDate[date].filter(task => !task.completed);
            if (pendingTasksOnDay.length === 0) continue;
            pendingTasksOnDay.sort((a, b) => (priority[a.type] || 99) - (priority[b.type] || 99));
            const mostImportantTask = pendingTasksOnDay[0];
            marks[date] = {
                selected: true,
                selectedColor: mostImportantTask.color,
                dots: pendingTasksOnDay.length > 1 ? pendingTasksOnDay.map(task => ({ key: task.id, color: 'white' })) : [],
                marked: pendingTasksOnDay.length > 1,
            };
        }
        return marks;
    }, [tasks]);

    const handleDayPress = (day) => {
        // ... (sua lógica de handleDayPress - está correta)
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
    
    // 5. FUNÇÃO DE DELETAR (do Modal de Detalhes) - CORRIGIDA COM API
    const handleDeleteTaskOnDetail = async (taskToDelete) => {
        setIsLoading(true);
        try {
            // 1. Chamar a API para deletar
            await api.delete(`/task/${taskToDelete.id}`); 
            
            // 2. Chamar o contexto local (como antes)
            deleteRemindersByTaskId(taskToDelete.id);
            deleteTask(taskToDelete.id);

            const remainingTasks = selectedTasks.filter(task => task.id !== taskToDelete.id);
            setSelectedTasks(remainingTasks);

            if (remainingTasks.length === 0) {
                setDetailModalVisible(false);
            }
            
            Alert.alert("Sucesso!", "Tarefa finalizada e removida."); // Mensagem de sucesso
            console.log(`Tarefa ${taskToDelete.id} excluída via API.`);

        } catch (error) {
            console.error("Erro ao excluir tarefa (detalhe):", error.response?.data);
            Alert.alert("Erro", "Não foi possível excluir a tarefa.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenEditModal = (task) => {
        setDetailModalVisible(false);
        setTaskToEdit(task);
        setAddModalVisible(true);
    };

    // 6. FUNÇÃO DE SUBMISSÃO (CRIAR/EDITAR) - CORRIGIDA COM API
    const handleSubmitTask = async (taskDataFromModal) => {
        setLoading(true);
        const isEditing = !!taskDataFromModal.id;

        // Formatar dados para o backend (igual HomeScreen)
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
                // Mapear resposta para formato local
                const taskParaContexto = { ...savedTask, date: savedTask.dueDate.split('T')[0], dueDate: new Date(savedTask.dueDate).toLocaleDateString('pt-BR'), type: savedTask.type.toLowerCase() };
                updateTask(taskParaContexto);
                Alert.alert("Sucesso", "Tarefa atualizada!");
            } else {
                const response = await api.post('/task', backendData);
                savedTask = response.data.newTask;
                const taskParaContexto = { ...savedTask, date: savedTask.dueDate.split('T')[0], dueDate: new Date(savedTask.dueDate).toLocaleDateString('pt-BR'), type: savedTask.type.toLowerCase() };
                addTask(taskParaContexto);
                Alert.alert("Sucesso", "Nova tarefa criada!");
            }

            // Lógica de lembrete local (mantida)
            if (savedTask && taskDataFromModal.hasReminder) {
                addReminder({
                    taskId: savedTask.id,
                    taskTitle: savedTask.title,
                    text: 'Lembrete para: ' + savedTask.title,
                    time: taskDataFromModal.reminderTime,
                    taskDate: savedTask.dueDate.split('T')[0],
                });
            }
            
            setTaskToEdit(null);
            setAddModalVisible(false);
            return savedTask; // Retorna para o modal (para notificação)

        } catch (error) {
            console.error("Erro ao salvar tarefa (Calendário):", error.response?.data);
            Alert.alert("Erro", "Não foi possível salvar a tarefa.");
            setLoading(false);
            return null; // Falhou
        } finally {
             setLoading(false);
        }
    };

    // 7. FUNÇÃO DE DELETAR (do Modal de Edição) - CORRIGIDA COM API
    const handleDeleteTaskOnEdit = async () => {
        if (!taskToEdit) return;

        Alert.alert(
            "Excluir Tarefa",
            `Tem certeza que deseja excluir "${taskToEdit.title}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => { // Adicionado async
                        setLoading(true);
                        try {
                            // 1. Chamar API
                            await api.delete(`/task/${taskToEdit.id}`);
                            // 2. Chamar Contextos
                            deleteRemindersByTaskId(taskToEdit.id);
                            deleteTask(taskToEdit.id);

                            setAddModalVisible(false);
                            setTaskToEdit(null);
                            Alert.alert("Sucesso!", "Tarefa excluída.");
                        } catch (error) {
                            console.error("Erro ao excluir tarefa (edição):", error);
                            Alert.alert("Erro", "Não foi possível excluir a tarefa.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };


    return (
        <SafeContextView style={styles.safeArea}>
            <LinearGradient colors={COLORS.secondaryGradient}>
                <AppHeader
                    navigation={navigation}
                    userData={userData}
                    showBackButton={true}
                    title="Calendário"
                    onProfilePress={() => navigation.navigate('Profile')}       
                />
            </LinearGradient>
            
            {isLoading && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingIndicator} />}

            <ScrollView>
                <View style={styles.mascotContainer}>
                    <MascotMessage2 message="Os dias coloridos indicam seus compromissos pendentes." />
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
                // 8. Passando a função de DELETAR para o botão 'onDelete'
                onDelete={handleDeleteTaskOnDetail} 
                onEdit={handleOpenEditModal}
            />

            {/* Modal de Adicionar/Editar Tarefa */}
            <AddTaskModal
                visible={isAddModalVisible}
                onClose={() => { setAddModalVisible(false); setTaskToEdit(null); setSelectedDate(null); }}
                onSubmit={handleSubmitTask}
                editingTask={taskToEdit}
                selectedDate={selectedDate}
                onDelete={handleDeleteTaskOnEdit} // Passando a função de DELETAR para o botão 'onDelete'
            />
        </SafeContextView>
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
    // Estilo de loading
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 10,
        marginLeft: -18,
        marginTop: -18,
    }
});

export default CalendarScreen;