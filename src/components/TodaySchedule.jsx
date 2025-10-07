import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';


const TodaySchedule = ({ date, schedule }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Hoje - {date}</Text>
      
      <View style={styles.scheduleList}>
        {schedule.map((item) => (
          <View 
            key={item.id} 
            style={[
              styles.scheduleItem,
              { 
                backgroundColor: item.backgroundColor,
                borderLeftColor: item.color,
                marginBottom: 12,
              }
            ]}
          >
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>{item.title}</Text>
              <Text style={[styles.scheduleTime, { color: item.color }]}>
                {item.time} • {item.location}
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
    padding: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    ...FONTS.h3,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.anil,
    marginBottom: 16,
  },
  scheduleList: {},
  scheduleItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    ...FONTS.body,
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  scheduleTime: {
    ...FONTS.small,
    fontSize: 12,
  },
});

export default TodaySchedule;