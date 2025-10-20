import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';
import { RemindersContext } from '../store/RemindersContext';

import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';
import AddReminderModal from '../components/AddReminderModal';
import Button from '../components/Button';

const RemindersScreen = ({ navigation }) => {
    const { reminders, addReminder, updateReminder, deleteReminder } = useContext(RemindersContext);

    const [isModalVisible, setModalVisible] = useState(false);
    const [reminderToEdit, setReminderToEdit] = useState(null);

    const userData = {
        name: 'Ana',
        level: 3,
        title: 'Estudante Dedicada',
        xpProgress: 65,
        xpToNextLevel: 150,
    };

    const handleOpenEditModal = (reminder) => {
        setReminderToEdit(reminder);
        setModalVisible(true);
    };

    const handleOpenAddModal = () => {
        setReminderToEdit(null);
        setModalVisible(true);
    };

    const handleSaveReminder = (reminderData) => {
        if (reminderToEdit) {
            updateReminder(reminderData);
            Alert.alert("Sucesso!", "Lembrete atualizado.");
        } else {
            addReminder(reminderData);
            Alert.alert("Sucesso!", "Novo lembrete criado.");
        }
        setModalVisible(false);
        setReminderToEdit(null);
    };

    const handleDeleteReminder = (reminderId) => {
        Alert.alert(
            "Excluir Lembrete",
            "Tem certeza que deseja excluir este lembrete? A notificação agendada também será cancelada.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteReminder(reminderId);
                            Alert.alert("Sucesso!", "Lembrete excluído.");
                        } catch (error) {
                            console.error("Erro ao excluir lembrete:", error);
                            Alert.alert("Erro", "Não foi possível excluir o lembrete.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={COLORS.secondaryGradient}>
                <AppHeader
                    navigation={navigation}
                    userData={userData}
                    showBackButton={true}
                    title="Lembretes"
                    onProfilePress={() => navigation.navigate('Profile')} 
                />
            </LinearGradient>

            <ScrollView>
                <View style={styles.mascotContainer}>
                    <MascotMessage2 message="Lembretes ajudam a organizar melhor seus estudos. Gerencie seus lembretes aqui!" />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>⏰ Lembretes Ativos</Text>
                    {reminders.length > 0 ? (
                        reminders.map((item) => {
                            if (!item || !item.id) {
                                console.warn("Item inválido ou sem ID encontrado na lista de lembretes:", item);
                                return null; 
                            }
                            return (
                                <View key={item.id} style={[styles.reminderItemContainer, { borderLeftColor: item.color || COLORS.purple }]}>
                                    <TouchableOpacity style={styles.reminderContent} onPress={() => handleOpenEditModal(item)}>
                                        <Text style={styles.reminderTaskTitle}>{item.taskTitle}</Text>
                                        <Text style={styles.reminderTitle}>{item.text}</Text>
                                        <Text style={styles.reminderSchedule}>Lembrar às {item.time}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReminder(item.id)}>
                                        <Ionicons name="trash-outline" size={24} color={COLORS.red} />
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.noRemindersText}>Você ainda não tem lembretes ativos.</Text>
                    )}

                    <Button
                        title="+ Adicionar Novo Lembrete"
                        variant="primary"
                        onPress={handleOpenAddModal}
                        style={{ marginTop: 10 }}
                    />
                </View>
            </ScrollView>

            <AddReminderModal
                visible={isModalVisible}
                onClose={() => { setModalVisible(false); setReminderToEdit(null); }}
                onSubmit={handleSaveReminder}
                editingReminder={reminderToEdit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? 25 : 0 },
    mascotContainer: { paddingHorizontal: 16, marginTop: 16 },
    card: { backgroundColor: 'white', borderRadius: 16, marginHorizontal: 16, marginTop: 8, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
    cardTitle: { ...FONTS.h3, color: COLORS.marinho, marginBottom: 12 },
    reminderItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gelo,
        borderLeftWidth: 5,
        borderRadius: 8,
        marginBottom: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    reminderContent: {
        flex: 1,
    },
    reminderTaskTitle: { ...FONTS.small, color: COLORS.gray, marginBottom: 4 },
    reminderTitle: { ...FONTS.body, fontWeight: '600', color: COLORS.darkGray },
    reminderSchedule: { ...FONTS.small, color: COLORS.gray, marginTop: 4 },
    deleteButton: {
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRemindersText: { ...FONTS.body, color: COLORS.gray, textAlign: 'center', marginVertical: 20 },
});

export default RemindersScreen;