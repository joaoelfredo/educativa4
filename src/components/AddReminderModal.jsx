import React, { useState, useContext, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, Platform, Keyboard, ScrollView 
} from 'react-native';
import Modal from 'react-native-modal'; 
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import * as Notifications from 'expo-notifications';
import { COLORS, FONTS } from '../constants/theme';
import { TasksContext } from '../store/TasksContext';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';

const AddReminderModal = ({ visible, onClose, onSubmit, editingReminder }) => {
    const { tasks } = useContext(TasksContext);

    const [text, setText] = useState('');
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [reminderDate, setReminderDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (visible) {
            if (editingReminder) {
                setText(editingReminder.text);
                const [hour, minute] = editingReminder.time.split(':');
                const savedDate = new Date(editingReminder.taskDate + 'T12:00:00Z');
                const savedTime = new Date(editingReminder.taskDate + 'T12:00:00Z');
                savedTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
                
                setReminderDate(savedDate);
                setTime(savedTime);
                setSelectedTaskId(editingReminder.taskId?.toString());
            } else {
                setText('');
                const today = new Date();
                const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
                setTime(localToday);
                setReminderDate(localToday);
                setSelectedTaskId(tasks.length > 0 ? tasks[0].id?.toString() : null);
            }
        }
    }, [visible, editingReminder, tasks]);

    const formatTime = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (date) => date.toLocaleDateString('pt-BR');

    const onChangeTime = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime && (Platform.OS === 'ios' || event.type === 'set')) {
            const localTime = new Date();
            localTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            setTime(localTime);
        }
    };
    
    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate && (Platform.OS === 'ios' || event.type === 'set')) {
            const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 12, 0, 0);
            setReminderDate(localDate);
        }
    };

    const handleSubmit = async () => {
        if (!text || !reminderDate || !time || !selectedTaskId) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }
        
        const task = tasks.find(task => task.id.toString() === selectedTaskId.toString());
        if (!task) {
            Alert.alert('Erro', 'Tarefa associada não encontrada.');
            return;
        }
        
        const formattedTime = formatTime(time);
        const formattedDate = reminderDate.toLocaleDateString('sv-SE'); // "YYYY-MM-DD"
        let notificationId = editingReminder?.notificationId;

        try {
            if (editingReminder?.notificationId) {
                try {
                    await Notifications.cancelScheduledNotificationAsync(editingReminder.notificationId);
                    notificationId = null;
                } catch (e) { console.warn('Falha ao cancelar notificação antiga'); }
            }

            const reminderHour = time.getHours();
            const reminderMinute = time.getMinutes();
            const [year, month, day] = formattedDate.split('-').map(Number);
            const triggerDate = new Date(year, month - 1, day, reminderHour, reminderMinute, 0, 0);

            if (triggerDate.getTime() > Date.now()) {
                notificationId = await Notifications.scheduleNotificationAsync({
                    content: { title: `🔔 Lembrete: ${task.title}`, body: text, sound: 'default', data: { taskId: selectedTaskId } },
                    trigger: { date: triggerDate },
                });
            } else {
                notificationId = null;
            }
        } catch (e) {
            console.error("[AddReminderModal] Erro no agendamento:", e);
            notificationId = editingReminder?.notificationId;
        }
        
        onSubmit({
            id: editingReminder?.id,
            text, 
            time: formattedTime,
            taskTitle: task.title,   
            taskId: selectedTaskId,
            taskDate: formattedDate, 
            notificationId: notificationId
        });
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            // --- REMOVIDO PARA PERMITIR SCROLL ---
            // onSwipeComplete={onClose}
            // swipeDirection="down"
            // ------------------------------------
            style={styles.modal}
            hideModalContentWhileAnimating={true}
            useNativeDriverForBackdrop={true}
        >
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close-circle" size={32} color={COLORS.lightGray} />
                </TouchableOpacity>

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    enableOnAndroid={true}
                    extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
                >
                    <Text style={styles.title}>{editingReminder ? '✏️ Editar Lembrete' : '➕ Novo Lembrete'}</Text>
                    
                    <Text style={styles.label}>Para qual tarefa?</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedTaskId}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedTaskId(itemValue ? itemValue.toString() : null);
                            }}
                            enabled={!editingReminder}
                        >
                            <Picker.Item label="-- Selecione uma tarefa --" value={null} />
                            {Array.isArray(tasks) && tasks.map(task => (
                                <Picker.Item key={task.id} label={task.title} value={task.id?.toString()} />
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
                    
                    <Text style={styles.label}>Data do Lembrete</Text>
                    <TouchableOpacity style={styles.input} onPress={() => { Keyboard.dismiss(); setShowDatePicker(true); }}>
                        <Text style={styles.dateText}>{formatDate(reminderDate)}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker 
                            value={reminderDate} 
                            mode="date" 
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onChangeDate} 
                        />
                    )}

                    <Text style={styles.label}>Horário do lembrete</Text>
                    <TouchableOpacity style={styles.input} onPress={() => { Keyboard.dismiss(); setShowTimePicker(true); }}>
                        <Text style={styles.dateText}>{formatTime(time)}</Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker 
                            value={time} 
                            mode="time" 
                            is24Hour={true} 
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onChangeTime} 
                        />
                    )}

                    <View style={styles.buttonContainer}>
                        <Button title={editingReminder ? "Salvar Alterações" : "Salvar Lembrete"} onPress={handleSubmit} style={{ marginBottom: 12 }} />
                        <Button title="Cancelar" variant="secondary" onPress={onClose} />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    modalContent: {
        maxHeight: '90%',
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
    title: { ...FONTS.h2, textAlign: 'center', marginBottom: 24, color: COLORS.marinho },
    label: { ...FONTS.body, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.gelo, borderRadius: 12, padding: 16, fontSize: 16, color: COLORS.text, marginBottom: 16, justifyContent: 'center' },
    dateText: { fontSize: 16, color: COLORS.text },
    buttonContainer: { marginTop: 24 },
    pickerContainer: {
        backgroundColor: COLORS.gelo,
        borderRadius: 12,
        justifyContent: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        height: Platform.OS === 'ios' ? 200 : 60,
    },
});

export default AddReminderModal;