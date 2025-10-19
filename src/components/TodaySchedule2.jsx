import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const TodaySchedule2 = ({ date, schedule, onTaskPress }) => {
  if (!schedule || schedule.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Hoje</Text>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.noTasksText}>Nenhuma tarefa para hoje! 🎉</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📅 Hoje</Text>
      <Text style={styles.dateText}>{date}</Text>
      
      {schedule.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={[styles.taskItem, { borderLeftColor: task.color || COLORS.purple }]}
          onPress={onTaskPress}
          activeOpacity={0.7}
        >
          <View style={styles.taskContent}>
            <Text style={styles.taskIcon}>{task.icon || '📝'}</Text>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              {task.notes && (
                <Text style={styles.taskNotes} numberOfLines={1}>
                  {task.notes}
                </Text>
              )}
            </View>
          </View>
          {task.completed && (
            <Text style={styles.completedBadge}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
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
    marginBottom: 8,
  },
  dateText: {
    ...FONTS.body,
    color: COLORS.gray,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
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
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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