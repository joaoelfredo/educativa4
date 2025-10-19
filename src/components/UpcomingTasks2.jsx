import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const UpcomingTasks2 = ({ tasks, onTaskPress }) => {
  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = tasks.filter(task => task.date > today);

  const tasksByDate = upcomingTasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push(task);
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: 'white',
    borderLeftWidth: 3,
    borderRadius: 6,
    padding: 8,
  },
  taskIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  taskTitle: {
    ...FONTS.body,
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