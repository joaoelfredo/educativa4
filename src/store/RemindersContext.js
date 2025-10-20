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
    taskDate: '2025-10-20', // Exemplo de data
    triggered: false,
  },
  {
    id: '2',
    taskId: 'task2',
    taskTitle: 'Trabalho de Matemática',
    text: 'Finalizar os gráficos e a conclusão.',
    time: '20:30',
    color: COLORS.blue,
    taskDate: '2025-10-21', // Exemplo de data
    triggered: false,
  },
];

export const RemindersContext = createContext({
  reminders: [],
  addReminder: (reminderData) => {},
  updateReminder: (reminderData) => {}, 
  deleteReminder: (reminderId) => {},
  deleteRemindersByTaskId: (taskId) => {}, // 1. Adicionado ao tipo do contexto
});

const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState(initialReminders);

  const addReminder = (reminderData) => {
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newReminder = {
      id: newId,
      ...reminderData,
      color: COLORS.purple,
      triggered: false,
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

  // 2. NOVA FUNÇÃO para excluir lembretes por ID da tarefa
  const deleteRemindersByTaskId = (taskId) => {
    setReminders(prev => prev.filter(r => r.taskId !== taskId));
  };


  const value = {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    deleteRemindersByTaskId, // 3. Expondo a função no valor do contexto
  };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersProvider;