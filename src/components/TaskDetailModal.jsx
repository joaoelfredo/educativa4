import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import Button from './Button';

const TaskDetailModal = ({ visible, tasks, date, onClose, onComplete, onEdit }) => {
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
            {/* Mapeia e renderiza CADA tarefa encontrada para o dia */}
            {tasks.map(task => (
              <View key={task.id} style={[styles.taskCard, { borderLeftColor: task.color }]}>
                <Text style={styles.taskTitle}>{task.icon} {task.title}</Text>
                
                {task.notes && (
                  <Text style={styles.taskNotes}>ℹ️ {task.notes}</Text>
                )}

                <View style={styles.buttonRow}>
                  <Button
                    title="Concluir"
                    variant="primary" // Laranja
                    onPress={() => onComplete(task)}
                    style={{ flex: 1, marginRight: 8 }}
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
  taskNotes: {
    ...FONTS.body,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginBottom: 16,
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