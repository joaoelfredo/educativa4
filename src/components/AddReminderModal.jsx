import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS } from '../constants/theme';
import { TasksContext } from '../store/TasksContext';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';

const AddReminderModal = ({ visible, onClose, onSubmit, editingReminder, taskToRemind }) => {
  const { tasks } = useContext(TasksContext);

  const [text, setText] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // EFEITO PARA PREENCHER O FORMULÁRIO
  useEffect(() => {
    if (visible) {
      if (editingReminder) {
        // Modo Edição
        setText(editingReminder.text);
        const [hour, minute] = editingReminder.time.split(':');
        const newTime = new Date();
        newTime.setHours(hour, minute);
        setTime(newTime);
        setSelectedTaskId(editingReminder.taskId);
      } else {
        // Modo Criação
        setText('');
        setTime(new Date());
        setSelectedTaskId(taskToRemind?.id || null);
      }
    }
  }, [visible, editingReminder, taskToRemind]);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) setTime(selectedDate);
  };

  const handleSubmit = () => {
    if (!text || !time || !selectedTaskId) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    const taskTitle = tasks.find(task => task.id === selectedTaskId)?.title || '';
    
    // Envia o ID de volta se estiver editando
    onSubmit({ 
      id: editingReminder?.id, 
      text, 
      time: formatTime(time), 
      taskTitle, 
      taskId: selectedTaskId 
    });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close-circle" size={32} color={COLORS.lightGray} />
            </TouchableOpacity>

            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{editingReminder ? '✏️ Editar Lembrete' : '➕ Novo Lembrete'}</Text>
              
              <Text style={styles.label}>Para qual tarefa?</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTaskId}
                  onValueChange={(itemValue) => setSelectedTaskId(itemValue)}
                  enabled={!editingReminder} // Não pode mudar a tarefa ao editar
                >
                  <Picker.Item label="Selecione uma tarefa..." value={null} />
                  {tasks.map(task => (
                    <Picker.Item key={task.id} label={task.title} value={task.id} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Texto do lembrete</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Não esquecer a conclusão!"
                value={text}
                onChangeText={setText}
              />
              
              <Text style={styles.label}>Horário do lembrete</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.dateText}>{formatTime(time)}</Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker value={time} mode="time" is24Hour={true} display="default" onChange={onChangeTime} />
              )}

              <View style={styles.buttonContainer}>
                <Button title={editingReminder ? "Salvar Alterações" : "Salvar Lembrete"} onPress={handleSubmit} style={{ marginBottom: 12 }} />
                <Button title="Cancelar" variant="secondary" onPress={onClose} />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

// ... (seus styles continuam os mesmos)
const styles = StyleSheet.create({
    modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { maxHeight: '90%', width: '90%', backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24 },
    closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
    title: { ...FONTS.h2, textAlign: 'center', marginBottom: 24, color: COLORS.marinho },
    label: { ...FONTS.body, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.gelo, borderRadius: 12, padding: 16, fontSize: 16, color: COLORS.text, marginBottom: 16, justifyContent: 'center' },
    dateText: { fontSize: 16, color: COLORS.text },
    pickerContainer: { backgroundColor: COLORS.gelo, borderRadius: 12, justifyContent: 'center' },
    buttonContainer: { marginTop: 24 },
});

export default AddReminderModal;