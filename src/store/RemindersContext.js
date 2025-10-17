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
});

const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState(initialReminders);

  const addReminder = (reminderData) => {
    const newReminder = {
      id: Date.now().toString(),
      ...reminderData,
      color: COLORS.purple,
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (updatedReminder) => {
    setReminders(prev => 
      prev.map(r => r.id === updatedReminder.id ? { ...r, ...updatedReminder } : r)
    );
  };

  const value = {
    reminders,
    addReminder,
    updateReminder,
  };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersProvider;