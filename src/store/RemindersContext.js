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
    taskDate: '2025-10-20', 
    triggered: false, // <-- Propriedade de controle
  },
  {
    id: '2',
    taskId: 'task2',
    taskTitle: 'Trabalho de Matemática',
    text: 'Finalizar os gráficos e a conclusão.',
    time: '20:30',
    color: COLORS.blue,
    taskDate: '2025-10-21', 
    triggered: false, // <-- Propriedade de controle
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
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newReminder = {
      id: newId,
      ...reminderData,
      color: COLORS.purple,
      triggered: false, // <-- Adiciona a flag em novos lembretes
    };

    setReminders(prev => [...prev, newReminder]);
  };

  // A função updateReminder já funciona como precisamos
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