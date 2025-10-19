import React, { createContext, useState } from 'react';
import { COLORS } from '../constants/theme';

export const TasksContext = createContext();

const INITIAL_TASKS = [
    { id: '1', title: 'Entrega de História', date: '2025-10-08', type: 'trabalho', color: COLORS.laranja, icon: '📝', dueDate: '08/10/2025', notes: 'Capítulos 4 e 5 do livro. Mínimo de 3 páginas, formato ABNT.' },
    { id: '2', title: 'Prova de Cálculo I', date: '2025-10-13', type: 'prova', color: COLORS.red, icon: '📚', dueDate: '13/10/2025', notes: 'Estudar Limites e Derivadas. Levar calculadora.' },
    { id: '3', title: 'Reunião de Grupo', date: '2025-10-13', type: 'reuniao', color: COLORS.azulClaro, icon: '👥', dueDate: '13/10/2025', notes: 'Definir o escopo do projeto e dividir as tarefas iniciais.' },
    { id: '4', title: 'Apresentação de Algoritmos', date: '2025-10-22', type: 'apresentacao', color: COLORS.marinho, icon: '📊', dueDate: '22/10/2025', notes: 'Apresentar a implementação do algoritmo de Dijkstra. Duração: 15 minutos.' },
];

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const addTask = (taskData) => {
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newTask = {
      ...taskData, 
      id: newId,   
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    
    return newTask; 
  };

  const updateTask = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};