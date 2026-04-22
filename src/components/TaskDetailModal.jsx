import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Button from './Button';
import { MaterialIcons } from '@expo/vector-icons';

const TaskDetailModal = ({ visible, tasks, date, onClose, onDelete, onEdit, onComplete }) => {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  
  const formattedDate = new Date(date + 'T12:00:00Z').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{formattedDate}</Text>
          
          <ScrollView>
            {tasks.map(task => (
              <View key={task.id} style={[styles.taskCard, { borderLeftColor: task.color }]}>
                <Text style={styles.taskTitle}>{task.icon} {task.title}</Text>
                
                {task.notes && (
                  <View style={styles.notesContainer}>
                    <MaterialIcons name="info-outline" size={18} color={COLORS.gray} />
                    <Text style={styles.taskNotes}>{task.notes}</Text>
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <Button
                    title={task.completed ? "Concluída" : "Concluir"}
                    variant="success" 
                    onPress={() => onComplete(task)}
                    style={{ flex: 1, marginRight: 8, backgroundColor: task.completed ? COLORS.gray : (COLORS.green || '#10B981'), borderColor: 'transparent' }}
                    textStyle={{ color: COLORS.white }}
                  />
                  <Button
                    title="Editar"
                    variant="blue"
                    onPress={() => onEdit(task)}
                    style={{ flex: 1, marginLeft: 8 }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButtonWrapper}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ... (seus styles continuam os mesmos)
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.marinho,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  taskCard: {
    backgroundColor: COLORS.gelo,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 5,
    marginBottom: 16,
  },
  taskTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 8,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskNotes: {
    ...FONTS.body,
    color: COLORS.text,
    fontStyle: 'italic',
    marginLeft: 6,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButtonWrapper: {
    marginTop: 8,
  },
  closeText: {
    ...FONTS.body,
    color: COLORS.gray,
    textAlign: 'center',
    padding: 8,
  },
});

export default TaskDetailModal;