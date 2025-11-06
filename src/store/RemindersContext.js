import React, { createContext, useState } from 'react';
import { COLORS } from '../constants/theme';
import * as Notifications from 'expo-notifications';

export const RemindersContext = createContext({
  reminders: [],
  addReminder: (reminderData) => {},
  updateReminder: (reminderData) => {}, 
  deleteReminder: (reminderId) => {},
  deleteRemindersByTaskId: (taskId) => {},
});

const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]); // Começa vazio

  // --- FUNÇÃO addReminder CORRIGIDA ---
  const addReminder = (reminderData) => {
    // Ordem CORRETA: espalha primeiro, define/sobrescreve depois
    const newReminder = {
      ...reminderData, // 1. Espalha dados (pode ter id: undefined)
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // 2. GERA/SOBRESCREVE ID único
      color: COLORS.purple, // 3. GARANTE cor padrão
      triggered: false, // 4. GARANTE estado inicial
      notificationId: reminderData.notificationId || null, // Garante que o campo exista
    };
    console.log("CONTEXT: Adicionando lembrete (CORRIGIDO):", newReminder);
    setReminders(prev => [...prev, newReminder]);
  };
  // --- FIM DA CORREÇÃO ---

  const updateReminder = (updatedReminder) => {
    console.log("CONTEXT: Atualizando lembrete:", updatedReminder.id);
    setReminders(prev => 
      prev.map(r => r.id === updatedReminder.id 
        ? { ...r, ...updatedReminder, triggered: updatedReminder.triggered || false } 
        : r
      )
    );
  };

  const deleteReminder = async (reminderId) => {
    console.log("CONTEXT: Excluindo lembrete ID:", reminderId);
    const reminderToDelete = reminders.find(r => r.id === reminderId);
    setReminders(prev => prev.filter(r => r.id !== reminderId));

    if (reminderToDelete?.notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(reminderToDelete.notificationId);
        console.log(`CONTEXT: Notificação ${reminderToDelete.notificationId} cancelada.`);
      } catch (e) {
        console.error(`CONTEXT: Erro ao cancelar notificação ${reminderToDelete.notificationId}:`, e);
      }
    }
  };

  const deleteRemindersByTaskId = (taskId) => {
    console.log("CONTEXT: Excluindo lembretes da Tarefa ID:", taskId);
    setReminders(prev => prev.filter(r => {
        if (r.taskId === taskId) {
            if (r.notificationId) {
                Notifications.cancelScheduledNotificationAsync(r.notificationId)
                    .catch(e => console.error(`CONTEXT: Erro ao cancelar notificação ${r.notificationId}:`, e));
            }
            return false; // Remove da lista
        }
        return true; // Mantém na lista
    }));
  };

  const value = {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    deleteRemindersByTaskId,
  };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersProvider;