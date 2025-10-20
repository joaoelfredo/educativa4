import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS } from '../constants/theme';
import { TasksContext } from '../store/TasksContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';

const AddReminderModal = ({ visible, onClose, onSubmit, editingReminder, taskToRemind }) => {
  const { tasks } = useContext(TasksContext);

  const [text, setText] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [reminderDate, setReminderDate] = useState(new Date()); 
  const [time, setTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editingReminder) {
        setText(editingReminder.text);
        setSelectedTaskId(editingReminder.taskId);
        
        const [hour, minute] = editingReminder.time.split(':');
        const savedDate = new Date(editingReminder.taskDate + 'T00:00:00');
        const savedTime = new Date(editingReminder.taskDate + 'T00:00:00');
        savedTime.setHours(hour, minute);
        
        setReminderDate(savedDate);
        setTime(savedTime);
        
      } else {
        setText('');
        setTime(new Date());
        setReminderDate(new Date()); 
        setSelectedTaskId(taskToRemind?.id || null);
      }
    }
  }, [visible, editingReminder, taskToRemind]);

  const formatTime = (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) setTime(selectedDate);
  };
  
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setReminderDate(selectedDate);
  };


  const handleSubmit = () => {
    if (!text || !reminderDate || !time || !selectedTaskId) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    
    const task = tasks.find(task => task.id === selectedTaskId);
    if (!task) {
        Alert.alert('Erro', 'Tarefa associada não encontrada.');
        return;
    }
    
    const reminderData = {
      text, 
      time: formatTime(time),            
      taskTitle: task.title,   
      taskId: selectedTaskId,
      taskDate: reminderDate.toISOString().split('T')[0], 
    };

    if (editingReminder?.id) {
      reminderData.id = editingReminder.id;
    }
    
    onSubmit(reminderData); 
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
              <View style={styles.customPickerContainer}>
                <ScrollView nestedScrollEnabled={true}>
                  <TouchableOpacity
                    style={[styles.customPickerItem, selectedTaskId === null && styles.customPickerItemSelected]}
                    onPress={() => setSelectedTaskId(null)}
                    disabled={editingReminder}
                  >
                    <Text style={styles.customPickerItemText}>Selecione uma tarefa...</Text>
                  </TouchableOpacity>
                  {tasks.map(task => (
                    <TouchableOpacity
                      key={task.id}
                      style={[styles.customPickerItem, selectedTaskId === task.id && styles.customPickerItemSelected]}
                      onPress={() => setSelectedTaskId(task.id)}
                      disabled={editingReminder}
                    >
                      <Text style={styles.customPickerItemText}>{task.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.label}>Texto do lembrete</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Não esquecer a conclusão!"
                value={text}
                onChangeText={setText}
              />
              
              <Text style={styles.label}>Data do Lembrete</Text>
              <TouchableOpacity style={styles.input} onPress={() => { Keyboard.dismiss(); setShowDatePicker(true); }}>
                <Text style={styles.dateText}>{formatDate(reminderDate)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={reminderDate} mode="date" display="default" onChange={onChangeDate} />
              )}

              <Text style={styles.label}>Horário do lembrete</Text>
              <TouchableOpacity style={styles.input} onPress={() => { Keyboard.dismiss(); setShowTimePicker(true); }}>
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

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { maxHeight: '90%', width: '90%', backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24 },
  closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
  title: { ...FONTS.h2, textAlign: 'center', marginBottom: 24, color: COLORS.marinho },
  label: { ...FONTS.body, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: COLORS.gelo, borderRadius: 12, padding: 16, fontSize: 16, color: COLORS.text, marginBottom: 16, justifyContent: 'center' },
  dateText: { fontSize: 16, color: COLORS.text },
  buttonContainer: { marginTop: 24 },
  
  customPickerContainer: {
    backgroundColor: COLORS.gelo,
    borderRadius: 12,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  customPickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  customPickerItemSelected: {
    backgroundColor: "#9ca3af", 
  },
  customPickerItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default AddReminderModal;