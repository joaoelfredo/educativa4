import React, { createContext, useState } from 'react';
// import { COLORS } from '../constants/theme'; // Removido

export const TasksContext = createContext({
    tasks: [],
    setTasks: (tasks) => {}, // Expor o setTasks
    addTask: (taskData) => {},
    updateTask: (updatedTask) => {},
    deleteTask: (taskId) => {},
});

// REMOVIDO O INITIAL_TASKS (virá da API)

export const TasksProvider = ({ children }) => {
    // Começa com array vazio
    const [tasks, setTasks] = useState([]);

    // CORRIGIDO: addTask agora recebe a tarefa da API (com ID real)
    const addTask = (taskDataFromApi) => {
        setTasks(prevTasks => [...prevTasks, taskDataFromApi]);
        console.log("[TasksContext] Tarefa adicionada ao estado:", taskDataFromApi);
        return taskDataFromApi; // Retorna a tarefa
    };

    const updateTask = (updatedTask) => {
        console.log("[TasksContext] Tarefa atualizada no estado:", updatedTask.id);
        setTasks(prevTasks =>
            prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    const deleteTask = (taskId) => {
        console.log("[TasksContext] Tarefa deletada do estado:", taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };

    return (
        // Expor o 'setTasks'
        <TasksContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask }}>
            {children}
        </TasksContext.Provider>
    );
};