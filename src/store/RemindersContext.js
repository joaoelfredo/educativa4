import React, { createContext, useState } from 'react';
import { COLORS } from '../constants/theme';

const initialReminders = [
  {
    id: '1',
    taskId: 'task1', 
    taskTitle: 'Prova de História',
    text: 'Revisar capítulo 5 e 6.',
    time: '19:00',
    color: COLORS.orange,
  },
  {
    id: '2',
    taskId: 'task2',
    taskTitle: 'Trabalho de Matemática',
    text: 'Finalizar os gráficos e a conclusão.',
    time: '20:30',
    color: COLORS.blue,
  },
];

export const RemindersContext = createContext({
  reminders: [],
  addReminder: (reminderData) => {},
  updateReminder: (reminderData) => {}, 
  deleteReminder: (reminderId) => {},
});

const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState(initialReminders);

  const addReminder = (reminderData) => {
    // Gera um ID único para o novo lembrete
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newReminder = {
      id: newId,
      ...reminderData,
      color: COLORS.purple,
    };

    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (updatedReminder) => {
    setReminders(prev => 
      prev.map(r => r.id === updatedReminder.id 
        ? { ...r, ...updatedReminder } 
        : r
      )
    );
  };

  const deleteReminder = (reminderId) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const value = {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
  };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersProvider;