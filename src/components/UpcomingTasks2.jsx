import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';


const UpcomingTasks2 = ({ tasks }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Próximas Tarefas</Text>
      
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <View 
            key={task.id} 
            style={[
              styles.taskItem,
              { 
                backgroundColor: task.backgroundColor,
                borderLeftColor: task.color,
                marginBottom: 12,
              }
            ]}
          >
            <Text style={styles.taskIcon}>{task.icon}</Text>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskDueDate, { color: task.color }]}>
                {task.dueDate}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    ...FONTS.h3,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.anil,
    marginBottom: 16,
  },
  taskList: {},
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    ...FONTS.body,
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  taskDueDate: {
    ...FONTS.small,
    fontSize: 12,
  },
});

export default UpcomingTasks2;