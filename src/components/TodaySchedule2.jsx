import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

// Adicionada a prop 'onTaskPress'
const TodaySchedule2 = ({ date, schedule, onTaskPress }) => {
  return (
    // Envolvemos o card inteiro em um TouchableOpacity
    <TouchableOpacity onPress={onTaskPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Hoje</Text>
        <Text style={styles.dateText}>{date}</Text>

        {(!schedule || schedule.length === 0) ? (
          <Text style={styles.noTasksText}>Nenhuma tarefa para hoje! 🎉</Text>
        ) : (
          <View style={styles.taskList}>
            {schedule.map((task) => (
              // Cada item de tarefa agora é apenas visual
              <View
                key={task.id}
                style={[styles.taskItem, { borderLeftColor: task.color || COLORS.purple }]}
              >
                <Text style={styles.taskIcon}>{task.icon || '📝'}</Text>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                  {task.notes && (
                    <Text style={styles.taskNotes} numberOfLines={1}>
                      {task.notes}
                    </Text>
                  )}
                </View>
                {task.completed && (
                  <Text style={styles.completedBadge}>✓</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// (Seus estilos do TodaySchedule2)
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
    marginBottom: 8,
  },
  dateText: {
    ...FONTS.body,
    color: COLORS.gray,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  taskList: {},
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.gelo,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  taskNotes: {
    ...FONTS.small,
    color: COLORS.gray,
    marginTop: 2,
  },
  completedBadge: {
    fontSize: 20,
    color: COLORS.green,
    fontWeight: 'bold',
  },
  noTasksText: {
    ...FONTS.body,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default TodaySchedule2;