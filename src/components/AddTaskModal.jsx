import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Platform, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS } from '../constants/theme';
import { taskTypes } from '../constants/taskTypes';
import Button from './Button';

const AddTaskModal = ({ visible, onClose, onSubmit, editingTask, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('trabalho');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [addReminder, setAddReminder] = useState(false);

  useEffect(() => {
    // Limpa o formulário antes de preencher para evitar dados antigos
    setTitle(''); setDate(null); setNotes(''); setType('trabalho'); setAddReminder(false);

    if (editingTask) {
      setTitle(editingTask.title);
      setDate(new Date(editingTask.date + 'T12:00:00Z'));
      setNotes(editingTask.notes || '');
      setType(editingTask.type || 'trabalho');
      setAddReminder(editingTask.hasReminder || false);
    } else if (selectedDate) {
      setDate(new Date(selectedDate + 'T12:00:00Z'));
    }
  }, [editingTask, selectedDate, visible]);
  
  const handleSubmit = () => {
    if (!title || !date) {
      Alert.alert('Atenção', 'Por favor, preencha o título e a data.');
      return;
    }
    const selectedType = taskTypes.find(t => t.id === type);
    
    const taskData = {
      id: editingTask ? editingTask.id : Date.now(),
      title,
      date: date.toISOString().split('T')[0],
      dueDate: date.toLocaleDateString('pt-BR'),
      notes: notes,
      type: selectedType.id,
      icon: selectedType.icon,
      color: selectedType.color,
      hasReminder: addReminder,
    };
    onSubmit(taskData);
    onClose();
  };

  const onChangeDate = (event, newSelectedDate) => {
    setShowDatePicker(false);
    if (newSelectedDate) setDate(newSelectedDate);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      {/* 1. O fundo escuro que, ao ser tocado, fecha o modal */}
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* 2. Um container para evitar que o toque no conteúdo feche o modal */}
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close-circle" size={32} color={COLORS.lightGray} />
            </TouchableOpacity>

            {/* 3. KeyboardAwareScrollView gerencia o scroll e o teclado APENAS dentro do modal */}
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>{editingTask ? '✏️ Editar Tarefa' : '➕ Nova Tarefa'}</Text>
              
              <Text style={styles.label}>Tipo de Tarefa</Text>
              <View style={styles.typeSelectorContainer}>
                {taskTypes.map(taskType => {
                  const isSelected = type === taskType.id;
                  return (
                    <TouchableOpacity key={taskType.id} style={[styles.typeButton, isSelected && { backgroundColor: `${taskType.color}20`, borderColor: taskType.color }]} onPress={() => setType(taskType.id)}>
                      <Text style={styles.typeButtonIcon}>{taskType.icon}</Text>
                      <Text style={[styles.typeButtonLabel, isSelected && { color: taskType.color }]}>{taskType.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Título da Tarefa</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex: Estudar para prova..." />

              <Text style={styles.label}>Data de Entrega</Text>
              <TouchableOpacity style={styles.input} onPress={() => { Keyboard.dismiss(); setShowDatePicker(true); }}>
                <Text style={date ? styles.dateText : styles.datePlaceholder}>{date ? date.toLocaleDateString('pt-BR') : 'Selecione a data'}</Text>
              </TouchableOpacity>

              {showDatePicker && (<DateTimePicker value={date || new Date()} mode="date" display="default" onChange={onChangeDate} />)}

              <Text style={styles.label}>Observações</Text>
              <TextInput style={[styles.input, styles.notesInput]} placeholder="Algum detalhe extra?" value={notes} onChangeText={setNotes} multiline={true} />

              <View style={styles.switchContainer}>
                <Text style={styles.labelSwitch}>Adicionar Lembrete?</Text>
                <Switch trackColor={{ false: '#767577', true: COLORS.primary }} thumbColor={addReminder ? COLORS.primary : '#f4f3f4'} onValueChange={setAddReminder} value={addReminder} />
              </View>

              <View style={styles.buttonContainer}>
                <Button title={editingTask ? 'Salvar Alterações' : 'Criar Tarefa'} onPress={handleSubmit} style={{ marginBottom: 12 }} />
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
    label: { ...FONTS.body, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
    labelSwitch: { ...FONTS.body, fontWeight: '600', color: COLORS.text },
    input: { backgroundColor: COLORS.gelo, borderRadius: 12, padding: 16, fontSize: 16, color: COLORS.text, marginBottom: 16, justifyContent: 'center' },
    notesInput: { height: 100, textAlignVertical: 'top' },
    dateText: { fontSize: 16, color: COLORS.text },
    datePlaceholder: { fontSize: 16, color: COLORS.gray },
    typeSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
    typeButton: { borderWidth: 2, borderColor: COLORS.lightGray, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center', width: '48.5%', marginBottom: 8 },
    typeButtonIcon: { fontSize: 20 },
    typeButtonLabel: { ...FONTS.small, fontWeight: '700', marginTop: 2, color: COLORS.gray },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8, marginBottom: 24 },
    buttonContainer: { marginTop: 16 },
});

export default AddTaskModal;