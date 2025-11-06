import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

// --- FUNÇÃO HELPER (NOVA) ---
// Retorna um objeto Date "limpo" (meia-noite local)
const getLocalDate = (dateString) => {
    // dateString é YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    // Mês em Date é 0-indexado
    return new Date(year, month - 1, day); 
};

// Retorna a data de HOJE "limpa" (meia-noite local)
const getTodayLocal = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
// -----------------------------


const UpcomingTasks2 = ({ tasks, onTaskPress }) => {
    // 1. CORREÇÃO: Comparar datas como objetos Date, não strings
    const today = getTodayLocal(); // Pega meia-noite de hoje

    const upcomingTasks = tasks.filter(task => {
        const taskDate = getLocalDate(task.date); // Pega meia-noite da data da tarefa
        return taskDate.getTime() > today.getTime(); // Compara os milissegundos
    });
    // --- FIM DA CORREÇÃO ---

    const tasksByDate = upcomingTasks.reduce((acc, task) => {
        const taskDate = task.date; // Continuamos usando a string YYYY-MM-DD como chave
        if (!acc[taskDate]) {
            acc[taskDate] = [];
        }
        acc[taskDate].push(task);
        return acc;
    }, {});

    const sortedDates = Object.keys(tasksByDate).sort();

    if (sortedDates.length === 0) {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📆 Próximas Tarefas</Text>
                <Text style={styles.noTasksText}>Nenhuma tarefa futura agendada.</Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>📆 Próximas Tarefas</Text>
            
            {sortedDates.slice(0, 5).map(date => {
                const tasksForDate = tasksByDate[date];
                // Usar T12:00:00Z é seguro para formatar a data
                const formattedDate = new Date(date + 'T12:00:00Z').toLocaleDateString('pt-BR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                });

                return (
                    <TouchableOpacity
                        key={date}
                        style={styles.dateGroup}
                        onPress={() => onTaskPress(date)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.dateHeader}>
                            <Text style={styles.dateText}>{formattedDate}</Text>
                            <Text style={styles.taskCount}>{tasksForDate.length} tarefa(s)</Text>
                        </View>

                        <View style={styles.tasksList}>
                            {tasksForDate.slice(0, 2).map(task => (
                                <View
                                    key={task.id}
                                    style={[styles.taskItem, { borderLeftColor: task.color || COLORS.purple }]}
                                >
                                    <Text style={styles.taskIcon}>{task.icon || '📝'}</Text>
                                    <Text style={styles.taskTitle} numberOfLines={1}>
                                        {task.title}
                                    </Text>
                                    {task.completed && (
                                        <Text style={styles.completedBadge}>✓</Text>
                                    )}
                                </View>
                            ))}
                            
                            {tasksForDate.length > 2 && (
                                <Text style={styles.moreTasksText}>
                                    + {tasksForDate.length - 2} mais
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
            
            {sortedDates.length > 5 && (
                <Text style={styles.moreTasksText}>
                    E mais {sortedDates.length - 5} dia(s) com tarefas...
                </Text>
            )}
        </View>
    );
};

// ... (seus estilos permanecem os mesmos)
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        ...FONTS.h3,
        color: COLORS.marinho,
        marginBottom: 12,
    },
    dateGroup: {
        marginBottom: 16,
        backgroundColor: COLORS.gelo,
        borderRadius: 12,
        padding: 12,
    },
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dateText: {
        ...FONTS.body,
        fontWeight: '600',
        color: COLORS.text,
        textTransform: 'capitalize',
    },
    taskCount: {
        ...FONTS.small,
        color: COLORS.gray,
    },
    tasksList: {
        gap: 6,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        backgroundColor: 'white',
    },
    taskIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    taskTitle: {
        ...FONTS.body,
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
    },
    completedBadge: {
        fontSize: 16,
        color: COLORS.green,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    moreTasksText: {
        ...FONTS.small,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    noTasksText: {
        ...FONTS.body,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: 8,
    },
});

export default UpcomingTasks2;