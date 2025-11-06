import React, { useState, useEffect, useContext } from 'react';
import {
    Modal, View, Text, TextInput, StyleSheet, TouchableOpacity,
    Switch, Platform, Alert, TouchableWithoutFeedback, Keyboard // 1. IMPORTAR O KEYBOARD
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, FONTS } from '../constants/theme';
import { taskTypes } from '../constants/taskTypes';
import Button from './Button';
// Importar o RemindersContext (mesmo que a lógica seja local, o toggle 'addReminder' pode precisar dele)
import { RemindersContext } from '../store/RemindersContext';

const AddTaskModal = ({ visible, onClose, onSubmit, editingTask, selectedDate, onDelete }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(null); // Começa como null
    const [notes, setNotes] = useState('');
    const [type, setType] = useState('trabalho');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [addReminder, setAddReminder] = useState(false);

    const [reminderTime, setReminderTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    // Pegar o addReminder do contexto (mesmo que a lógica de notificação não esteja aqui, o contexto precisa saber)
    const { addReminder: addGlobalReminder } = useContext(RemindersContext);

    useEffect(() => {
        setTitle('');
        setNotes('');
        setType('trabalho');
        setAddReminder(false);
        setReminderTime(new Date());

        if (editingTask) {
            setTitle(editingTask.title);
            // Garante que a data (string YYYY-MM-DD) seja convertida para um objeto Date
            setDate(new Date(editingTask.date + 'T12:00:00Z')); // Usar T12Z para estabilidade
            setNotes(editingTask.notes || '');
            setType(editingTask.type.toLowerCase() || 'trabalho'); // Backend envia MAIÚSCULA
            setAddReminder(editingTask.hasReminder || false);
        } else if (selectedDate) {
            setDate(new Date(selectedDate + 'T12:00:00Z'));
        } else {
            // 2. CORREÇÃO: Garante que 'date' NUNCA seja null ao criar
            const today = new Date();
            setDate(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0));
        }
    }, [editingTask, selectedDate, visible]);

    const formatTime = (time) => {
        const date = new Date(time);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleSubmit = () => {
        if (!title || !date) { // Verificação agora é segura, 'date' não deve ser null
            Alert.alert('Atenção', 'Por favor, preencha o título e a data.');
            return;
        }
        const selectedType = taskTypes.find(t => t.id === type);
        
        // Formato "YYYY-MM-DD"
        const localDateString = date.toLocaleDateString('sv-SE');

        // 3. FORMATAR DADOS PARA O BACKEND (como o HomeScreen espera)
        const taskData = {
            id: editingTask ? editingTask.id : null,
            title,
            completed: editingTask ? editingTask.completed : false,
            date: localDateString, // 'date' (YYYY-MM-DD)
            dueDate: date.toLocaleDateString('pt-BR'), // 'dueDate' (DD/MM/YYYY)
            notes: notes,
            type: selectedType.id, // 'trabalho' (minúsculo)
            icon: selectedType.icon,
            color: selectedType.color,
            hasReminder: addReminder,
            reminderTime: addReminder ? formatTime(reminderTime) : null,
        };

        // 4. CHAMAR O onSubmit (da HomeScreen) com os dados formatados
        // A HomeScreen fará a chamada de API
        onSubmit(taskData);
        
        // 5. LÓGICA DE LEMBRETE LOCAL (NÃO INTEGRADA COM BACKEND, COMO PEDIDO)
        if (addReminder) {
            console.log("Lógica de lembrete local ativada.");
            // Adiciona ao contexto de lembretes (para UI e AlarmChecker)
            addGlobalReminder({
                taskId: taskData.id || Date.now().toString(), // Usa ID temporário se for novo
                taskTitle: taskData.title,
                text: 'Lembrete para: ' + taskData.title,
                time: taskData.reminderTime,
                taskDate: taskData.date, // Passa a data da tarefa
            });
            // A lógica de agendamento de notificação foi removida, como solicitado
        }

        onClose();
    };

    // 6. FUNÇÃO onChangeDate CORRIGIDA
    const onChangeDate = (event, newSelectedDate) => {
        setShowDatePicker(false); // Fecha o picker imediatamente
        if (newSelectedDate && (Platform.OS === 'ios' || event.type === 'set')) {
            // Cria um objeto Date limpo (meio-dia local)
            const localDate = new Date(
                newSelectedDate.getFullYear(),
                newSelectedDate.getMonth(),
                newSelectedDate.getDate(),
                12, 0, 0
            );
            setDate(localDate);
        }
        // Se cancelado, 'date' (do state) mantém o valor anterior (que nunca é null)
    };

    // 7. FUNÇÃO onChangeTime CORRIGIDA
    const onChangeTime = (event, newSelectedTime) => {
        setShowTimePicker(false); // Fecha o picker imediatamente
        if (newSelectedTime && (Platform.OS === 'ios' || event.type === 'set')) {
            const localTime = new Date();
            localTime.setHours(newSelectedTime.getHours(), newSelectedTime.getMinutes(), 0, 0);
            setReminderTime(localTime);
        }
    };
    
    // Função de Deleção (mantida)
    const handleDelete = () => {
        if (!editingTask || !onDelete) return;
        Alert.alert(
            "Excluir Tarefa",
            `Tem certeza que deseja excluir a tarefa "${editingTask.title}"?`,
            [{ text: "Cancelar", style: "cancel" }, {
                text: "Excluir", style: "destructive",
                onPress: () => {
                    onDelete(editingTask.id); 
                    onClose();
                }
            }]
        );
    };


    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close-circle" size={32} color={COLORS.lightGray} />
                        </TouchableOpacity>
                        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
                                <Text style={date ? styles.dateText : styles.datePlaceholder}>{date ? date.toLocaleDateString('pt-BR') : 'Carregando data...'}</Text>
                            </TouchableOpacity>

                            {/* Usando 'spinner' no iOS para melhor visibilidade dentro do modal */}
                            {showDatePicker && (
                                <DateTimePicker 
                                    value={date || new Date()} 
                                    mode="date" 
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                                    onChange={onChangeDate} 
                                    minimumDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())} // Data mínima hoje
                                />
                            )}

                            <Text style={styles.label}>Observações</Text>
                            <TextInput style={[styles.input, styles.notesInput]} placeholder="Algum detalhe extra?" value={notes} onChangeText={setNotes} multiline={true} />

                            <View style={styles.switchContainer}>
                                <Text style={styles.labelSwitch}>Adicionar Lembrete?</Text>
                                <Switch trackColor={{ false: '#767577', true: COLORS.primary }} thumbColor={addReminder ? COLORS.primary : '#f4f3f4'} onValueChange={setAddReminder} value={addReminder} />
                            </View>

                            {addReminder && (
                                <>
                                    <Text style={styles.label}>Horário do Lembrete</Text>
                                    <TouchableOpacity style={styles.input} onPress={() => { Keyboard.dismiss(); setShowTimePicker(true); }}>
                                        <Text style={styles.dateText}>{formatTime(reminderTime)}</Text>
                                    </TouchableOpacity>
                                    
                                    {showTimePicker && (
                                        <DateTimePicker
                                            value={reminderTime}
                                            mode="time"
                                            is24Hour={true}
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={onChangeTime}
                                        />
                                    )}
                                </>
                            )}

                            <View style={styles.buttonContainer}>
                                <Button
                                    title={editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
                                    onPress={handleSubmit}
                                    style={{ marginBottom: 12 }}
                                />
                                
                                {editingTask && onDelete && (
                                    <Button
                                        title="Excluir Tarefa"
                                        variant="danger"
                                        onPress={handleDelete}
                                        style={{
                                            marginBottom: 12,
                                            backgroundColor: COLORS.red || '#D9534F',
                                            borderColor: COLORS.red || '#D9534F',
                                        }}
                                        textStyle={{
                                            color: COLORS.white
                                        }}
                                    />
                                )}
                                
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
    labelSwitch: { ...FONTS.body, fontWeight: '600', color: COLORS.text },
    input: { backgroundColor: COLORS.gelo, borderRadius: 12, padding: 16, fontSize: 16, color: COLORS.text, marginBottom: 16, justifyContent: 'center' },
    notesInput: { height: 100, textAlignVertical: 'top' },
    dateText: { fontSize: 16, color: COLORS.text },
    datePlaceholder: { fontSize: 16, color: COLORS.gray },
    typeSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
    typeButton: { borderWidth: 2, borderColor: COLORS.lightGray, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center', width: '48.5%', marginBottom: 8 },
    typeButtonIcon: { fontSize: 20 },
    typeButtonLabel: { ...FONTS.small, fontWeight: '700', marginTop: 2, color: COLORS.gray },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8, marginBottom: 16 }, 
    buttonContainer: { marginTop: 16 },
});

export default AddTaskModal;