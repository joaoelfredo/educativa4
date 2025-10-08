import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';


const QuickActions2 = ({ onNewTask, onSetReminder }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onNewTask} activeOpacity={0.8}>
        <LinearGradient colors={COLORS.primaryGradient} style={styles.buttonGradient}>
          <Text style={styles.icon}>➕</Text>
          <Text style={styles.buttonText}>Nova Tarefa</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onSetReminder} activeOpacity={0.8}>
        <LinearGradient colors={COLORS.secondaryGradient} style={styles.buttonGradient}>
          <Text style={styles.icon}>⏰</Text>
          <Text style={styles.buttonText}>Definir Lembrete</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    ...FONTS.body,
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.white,
  },
});

export default QuickActions2;