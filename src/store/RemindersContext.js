import React, { createContext, useState } from 'react';
import { COLORS } from '../constants/theme';
import * as Notifications from 'expo-notifications'; // Importar para cancelar notificações

export const RemindersContext = createContext({
  reminders: [],
  addReminder: (reminderData) => {},
  updateReminder: (reminderData) => {}, 
  deleteReminder: (reminderId) => {},
  deleteRemindersByTaskId: (taskId) => {},
});

const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]); 

  const addReminder = (reminderData) => {
    const newReminder = {
      ...reminderData, 
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
      color: COLORS.purple, 
      triggered: false, 
      notificationId: reminderData.notificationId || null, 
    };
    console.log("CONTEXT: Adicionando lembrete (CORRIGIDO):", newReminder);
    setReminders(prev => [...prev, newReminder]);
  };

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